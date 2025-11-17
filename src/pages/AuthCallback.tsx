import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Loader2, CheckCircle, XCircle } from "lucide-react";
import { Button } from "@/components/ui/button";

const AuthCallback = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    const handleAuthCallback = async () => {
      try {
        // Get the hash from the URL
        const hashParams = new URLSearchParams(window.location.hash.substring(1));
        const accessToken = hashParams.get('access_token');
        const refreshToken = hashParams.get('refresh_token');
        const type = hashParams.get('type');

        console.log('Auth callback params:', { type, accessToken: !!accessToken, refreshToken: !!refreshToken });

        // Check for different callback formats
        if (accessToken && refreshToken) {
          // Set the session with the tokens
          const { data, error } = await supabase.auth.setSession({
            access_token: accessToken,
            refresh_token: refreshToken,
          });

          if (error) {
            console.error('Session error:', error);
            throw error;
          }

          console.log('Session data:', data);

          if (data.user) {
            setSuccess(true);
            // Wait a moment to show success message, then redirect
            setTimeout(() => {
              navigate('/admin');
            }, 2000);
          } else {
            throw new Error('No user data received');
          }
        } else {
          // Try alternative: check if we're already authenticated
          const { data: session } = await supabase.auth.getSession();
          if (session?.session?.user) {
            setSuccess(true);
            setTimeout(() => {
              navigate('/admin');
            }, 2000);
          } else {
            console.log('URL params:', window.location.href);
            console.log('Hash params:', Object.fromEntries(hashParams));
            throw new Error(`Missing authentication tokens. Type: ${type}, Access Token: ${!!accessToken}, Refresh Token: ${!!refreshToken}`);
          }
        }
      } catch (err: any) {
        console.error('Auth callback error:', err);
        setError(err.message || 'Authentication failed');
      } finally {
        setLoading(false);
      }
    };

    handleAuthCallback();
  }, [navigate]);

  return (
    <div className="min-h-[calc(100vh-12rem)] flex items-center justify-center py-12 px-4">
      <Card className="w-full max-w-md shadow-xl border-0 bg-white/95 backdrop-blur">
        <CardHeader className="text-center pb-8">
          <div className="mx-auto w-16 h-16 rounded-full flex items-center justify-center mb-4">
            {loading && (
              <div className="bg-blue-100 w-full h-full rounded-full flex items-center justify-center">
                <Loader2 className="w-8 h-8 text-blue-600 animate-spin" />
              </div>
            )}
            {success && (
              <div className="bg-green-100 w-full h-full rounded-full flex items-center justify-center">
                <CheckCircle className="w-8 h-8 text-green-600" />
              </div>
            )}
            {error && (
              <div className="bg-red-100 w-full h-full rounded-full flex items-center justify-center">
                <XCircle className="w-8 h-8 text-red-600" />
              </div>
            )}
          </div>
          <CardTitle className="text-2xl font-serif text-gray-900">
            {loading && "Signing you in..."}
            {success && "Welcome back!"}
            {error && "Authentication failed"}
          </CardTitle>
        </CardHeader>
        
        <CardContent className="text-center space-y-4">
          {loading && (
            <p className="text-gray-600">
              Please wait while we authenticate your magic link...
            </p>
          )}
          
          {success && (
            <div className="space-y-4">
              <p className="text-green-600 font-medium">
                Authentication successful!
              </p>
              <p className="text-gray-600 text-sm">
                Redirecting you to the admin panel...
              </p>
            </div>
          )}
          
          {error && (
            <div className="space-y-4">
              <p className="text-red-600 font-medium">
                {error}
              </p>
              <p className="text-gray-600 text-sm">
                The magic link may have expired or been used already.
              </p>
              <Button 
                onClick={() => navigate('/login')}
                className="w-full bg-gradient-to-r from-gold to-gold-dark hover:from-gold-dark hover:to-gold text-white"
              >
                Try Again
              </Button>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default AuthCallback;
