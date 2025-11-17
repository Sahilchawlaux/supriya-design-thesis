import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode,
} from "react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

/* -------------------------------------------------------------------------- */
/*                               Helper: Timeout                              */
/* -------------------------------------------------------------------------- */
// A type-safe timeout wrapper that works for both Promises and Supabase builders
// Helper: timeout wrapper for detecting stuck promises
const withTimeout = (promise: Promise<any>, label: string, ms = 8000) =>
  Promise.race([
    promise,
    new Promise((_, reject) =>
      setTimeout(
        () => reject(new Error(`Timeout while waiting for ${label}`)),
        ms
      )
    ),
  ]);

/* -------------------------------------------------------------------------- */
/*                                Type Declarations                           */
/* -------------------------------------------------------------------------- */

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
  sendOtp: (email: string) => Promise<void>;
  verifyOtp: (email: string, token: string) => Promise<void>;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

/* -------------------------------------------------------------------------- */
/*                            Main AuthProvider                               */
/* -------------------------------------------------------------------------- */

export const AuthProvider: React.FC<{ children: ReactNode }> = ({
  children,
}) => {
  const [user, setUser] = useState<User>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [pendingEmail, setPendingEmail] = useState<string | null>(null);

  /* ------------------------------------------------------------------------ */
  /*                             Fetch User Profile                           */
  /* ------------------------------------------------------------------------ */
  const fetchProfile = async (supabaseUser: any) => {
    console.log("[fetchProfile] called for:", supabaseUser?.email);

    try {
      const { data, error } = await withTimeout(
        supabase
          .from("profiles")
          .select("*")
          .eq("id", supabaseUser.id)
          .single() as any,
        "fetchProfile select"
      );

      if (error) {
        console.log("[fetchProfile] error:", error);
        if (error.code === "PGRST116") {
          console.log("[fetchProfile] No profile found, creating new one...");
          const { data: newProfile, error: createError } = await supabase
            .from("profiles")
            .insert({
              id: supabaseUser.id,
              email: supabaseUser.email,
              name: supabaseUser.email,
              is_admin: false,
            })
            .select()
            .single();

          if (createError) throw createError;
          console.log("[fetchProfile] New profile created:", newProfile);
          setUser({
            id: supabaseUser.id,
            email: supabaseUser.email,
            name: newProfile.name || supabaseUser.email,
            isAdmin: !!newProfile.is_admin,
            avatar_url: newProfile.avatar_url || null,
          });
          return;
        }
        throw error;
      }

      console.log("[fetchProfile] Fetched data:", data);
      setUser({
        id: supabaseUser.id,
        email: supabaseUser.email,
        name: data.name || supabaseUser.email,
        isAdmin: !!data.is_admin,
        avatar_url: data.avatar_url || null,
      });
    } catch (err) {
      console.error("[fetchProfile] Failed:", err);
      setUser({
        id: supabaseUser.id,
        email: supabaseUser.email,
        name: supabaseUser.email,
        isAdmin: false,
        avatar_url: null,
      });
    }
  };

  /* ------------------------------------------------------------------------ */
  /*                        Initialize Auth on Load                            */
  /* ------------------------------------------------------------------------ */
  useEffect(() => {
    let mounted = true;

    const initAuth = async () => {
      console.log("[initAuth] Starting authentication initialization...");
      setLoading(true);

      try {
        console.log("[initAuth] Checking existing session...");
        let session = null;
        try {
          const res = await supabase.auth.getSession();
          session = res.data?.session || null;
        } catch (err) {
          console.warn(
            "[initAuth] getSession failed, skipping direct session check:",
            err
          );
        }

        if (error) {
          console.error("[initAuth] getSession error:", error);
          await supabase.auth.signOut();
          setUser(null);
          return;
        }

        if (!session) {
          console.log("[initAuth] No session found.");
          await supabase.auth.signOut();
          setUser(null);
          return;
        }

        console.log("[initAuth] Session found:", session?.user?.email);
        const { data: userData, error: userError } = await withTimeout(
          supabase.auth.getUser(),
          "getUser"
        );

        if (userError || !userData?.user) {
          console.error("[initAuth] Invalid token/session:", userError);
          await supabase.auth.signOut();
          setUser(null);
          return;
        }

        console.log("[initAuth] Verified user:", userData.user.email);
        await fetchProfile(userData.user);
      } catch (err) {
        console.error("[initAuth] Unexpected error:", err);
        await supabase.auth.signOut();
        setUser(null);
      } finally {
        if (mounted) setLoading(false);
        console.log("[initAuth] Initialization complete.");
      }
    };

    /* ---------------------------------------------------------------------- */
    /*                     Subscribe to Auth State Changes                    */
    /* ---------------------------------------------------------------------- */
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange(async (event, session) => {
      console.log("[AuthStateChange] Event:", event, "Session:", session);

      if (event === "SIGNED_OUT") {
        console.log("[AuthStateChange] Signed out, clearing user.");
        setUser(null);
      }

      if (
        (event === "SIGNED_IN" || event === "TOKEN_REFRESHED") &&
        session?.user
      ) {
        console.log(`[AuthStateChange] Fetching profile after ${event}`);
        await fetchProfile(session.user);
      }
    });

    initAuth();

    return () => {
      mounted = false;
      subscription.unsubscribe();
    };
  }, []);

  /* ------------------------------------------------------------------------ */
  /*                               Send OTP                                   */
  /* ------------------------------------------------------------------------ */
  const sendOtp = async (email: string) => {
    console.log("[sendOtp] Sending OTP to:", email);
    setLoading(true);
    setError(null);

    try {
      await supabase.auth.signOut();
      const { error } = await supabase.auth.signInWithOtp({
        email,
        options: {
          shouldCreateUser: true,
          emailRedirectTo: window.location.origin,
        },
      });

      if (error) throw error;
      console.log("[sendOtp] OTP sent successfully!");
      toast.success("OTP sent successfully!");
      setPendingEmail(email);
    } catch (err: any) {
      console.error("[sendOtp] Failed:", err);
      setError(err.message);
      toast.error(err.message);
    } finally {
      setLoading(false);
    }
  };

  /* ------------------------------------------------------------------------ */
  /*                              Verify OTP                                  */
  /* ------------------------------------------------------------------------ */
  const verifyOtp = async (email: string, token: string) => {
    console.log("[verifyOtp] Verifying OTP for:", email);
    setLoading(true);
    setError(null);

    try {
      const { data, error } = await withTimeout(
        supabase.auth.verifyOtp({ email, token, type: "email" }),
        "verifyOtp"
      );

      if (error || !data?.user) throw error;
      console.log("[verifyOtp] Verified successfully:", data.user.email);
      await fetchProfile(data.user);
      setPendingEmail(null);
      toast.success("Login successful!");
    } catch (err: any) {
      console.error("[verifyOtp] Error:", err);
      setError(err.message);
      toast.error(err.message);
    } finally {
      setLoading(false);
    }
  };

  /* ------------------------------------------------------------------------ */
  /*                                Logout                                    */
  /* ------------------------------------------------------------------------ */
  const logout = async () => {
    console.log("[logout] Logging out...");
    setLoading(true);
    try {
      const { error } = await supabase.auth.signOut();
      if (error) console.error("[logout] signOut error:", error);
      localStorage.clear();
      sessionStorage.clear();
      setUser(null);
      toast.success("Logged out successfully.");
    } catch (err) {
      console.error("[logout] Unexpected error:", err);
    } finally {
      setLoading(false);
    }
  };

  /* ------------------------------------------------------------------------ */
  /*                             Context Return                               */
  /* ------------------------------------------------------------------------ */
  return (
    <AuthContext.Provider
      value={{ user, loading, error, sendOtp, verifyOtp, logout }}
    >
      {children}
    </AuthContext.Provider>
  );
};

/* -------------------------------------------------------------------------- */
/*                               Hook Export                                  */
/* -------------------------------------------------------------------------- */
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error("useAuth must be used within an AuthProvider");
  return context;
};
