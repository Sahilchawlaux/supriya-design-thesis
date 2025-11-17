import React, { createContext, useContext, useState, useEffect, ReactNode } from "react";
import { supabase } from "@/integrations/supabase/client";

// User type based on Supabase and profiles table
export type User = {
  id: string;
  email: string;
  name?: string;
  isAdmin: boolean;
  avatar_url?: string | null;
} | null;

interface AuthContextType {
  user: User;
  loading: boolean;
  error: string | null;
  login: (email: string) => Promise<void>;
  verifyOtp: (email: string, token: string) => Promise<void>;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [pendingEmail, setPendingEmail] = useState<string | null>(null);

  // Listen for auth state changes
  useEffect(() => {
    setLoading(true);
    const { data: listener } = supabase.auth.onAuthStateChange(async (event, session) => {
      if (session?.user) {
        await fetchProfile(session.user);
      } else {
        setUser(null);
      }
      setLoading(false);
    });
    // On mount, check session
    supabase.auth.getSession().then(async ({ data: { session } }) => {
      if (session?.user) {
        await fetchProfile(session.user);
      }
      setLoading(false);
    });
    return () => {
      listener.subscription.unsubscribe();
    };
  }, []);

  // Fetch user profile from 'profiles' table
  const fetchProfile = async (supabaseUser: any) => {
    const { data, error } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', supabaseUser.id)
      .single();
    if (data) {
      setUser({
        id: supabaseUser.id,
        email: supabaseUser.email,
        name: data.name || supabaseUser.email,
        isAdmin: !!data.is_admin,
        avatar_url: data.avatar_url || null,
      });
    } else {
      // If no profile, fallback to basic user
      setUser({
        id: supabaseUser.id,
        email: supabaseUser.email,
        name: supabaseUser.email,
        isAdmin: false,
        avatar_url: null,
      });
    }
  };

  // Start login: send OTP to email
  const login = async (email: string) => {
    setLoading(true);
    setError(null);
    const { error } = await supabase.auth.signInWithOtp({ email });
    if (error) {
      setError(error.message);
    } else {
      setPendingEmail(email);
    }
    setLoading(false);
  };

  // Complete login: verify OTP
  const verifyOtp = async (email: string, token: string) => {
    setLoading(true);
    setError(null);
    try {
      const { data, error } = await supabase.auth.verifyOtp({
        email,
        token,
        type: 'email',
      });
      if (error) {
        setError(error.message);
      } else if (data?.user) {
        await fetchProfile(data.user);
        setPendingEmail(null);
      } else {
        // Fallback: fetch session and user if not present in data
        const { data: sessionData } = await supabase.auth.getSession();
        if (sessionData?.session?.user) {
          await fetchProfile(sessionData.session.user);
          setPendingEmail(null);
        }
      }
    } finally {
      setLoading(false);
    }
  };

  // Logout
  const logout = async () => {
    setUser(null);
    await supabase.auth.signOut();
  };

  return (
    <AuthContext.Provider value={{ user, loading, error, login, verifyOtp, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
