import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { toast } from "sonner";
import { Loader2, Mail, Shield, ArrowLeft, KeyRound } from "lucide-react";

const LoginPage = () => {
  // Clear any existing sessions on mount
  useEffect(() => {
    const clearSession = async () => {
      await supabase.auth.signOut();
    };
    clearSession();
  }, []);
  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState("");
  const [otpSent, setOtpSent] = useState(false);
  const { sendOtp, verifyOtp, error } = useAuth();
  const navigate = useNavigate();
  const [localError, setLocalError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleSendOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    setLocalError(null);
    setIsLoading(true);
    
    try {
      // Clear any existing sessions first
      await supabase.auth.signOut();
      
      await sendOtp(email.trim().toLowerCase());
      setOtpSent(true);
      toast.success("Verification code sent! Check your email.");
    } catch (err) {
      console.error('Send OTP error:', err);
      setLocalError("Failed to send verification code. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleVerifyOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    setLocalError(null);
    setIsLoading(true);
    
    try {
      await verifyOtp(email, otp);
      
      // Wait a bit for the session to be fully established
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      const { data: { session }, error: sessionError } = await supabase.auth.getSession();
      
      if (sessionError || !session) {
        console.error('Session check error:', sessionError);
        setLocalError("Failed to establish session. Please try again.");
        return;
      }
      
      toast.success("Login successful!");
      navigate("/admin");
    } catch (err) {
      console.error('Login error:', err);
      setLocalError("Invalid OTP. Please check your code and try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleBackToEmail = () => {
    setOtpSent(false);
    setOtp("");
    setLocalError(null);
  };

  return (
    <div className="min-h-[calc(100vh-12rem)] flex items-center justify-center py-12 px-4">
      <Card className="w-full max-w-md shadow-xl border-0 bg-white/95 backdrop-blur">
        <CardHeader className="space-y-6 text-center pb-8">
          <div className="mx-auto w-16 h-16 bg-gradient-to-br from-gold to-gold-dark rounded-full flex items-center justify-center">
            {!otpSent ? (
              <Mail className="w-8 h-8 text-white" />
            ) : (
              <Shield className="w-8 h-8 text-white" />
            )}
          </div>
          <div className="space-y-2">
            <CardTitle className="text-3xl font-serif text-gray-900">
              {!otpSent ? "Admin Login" : "Enter Verification Code"}
            </CardTitle>
            <CardDescription className="text-gray-600 text-base">
              {!otpSent 
                ? "Enter your email address to receive a secure verification code"
                : `We've sent a 6-digit code to ${email}. Enter it below to continue.`
              }
            </CardDescription>
          </div>
        </CardHeader>
        
        <CardContent className="space-y-6">
          {(error || localError) && (
            <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg text-sm flex items-center space-x-2">
              <div className="w-4 h-4 rounded-full bg-red-200 flex-shrink-0"></div>
              <span>{error || localError}</span>
            </div>
          )}
          
          {!otpSent ? (
            <form onSubmit={handleSendOtp} className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="email" className="text-sm font-medium text-gray-700">
                  Email Address
                </Label>
                <div className="relative">
                  <Input 
                    id="email"
                    type="email"
                    placeholder="Enter your admin email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    className="pl-10 h-12 border-gray-200 focus:border-gold focus:ring-gold"
                  />
                  <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                </div>
              </div>
              
              <Button 
                type="submit" 
                className="w-full h-12 bg-gradient-to-r from-gold to-gold-dark hover:from-gold-dark hover:to-gold text-white font-medium rounded-lg transition-all duration-200 shadow-lg hover:shadow-xl"
                disabled={isLoading}
              >
                {isLoading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Sending Code...
                  </>
                ) : (
                  <>
                    <KeyRound className="mr-2 h-4 w-4" />
                    Send Verification Code
                  </>
                )}
              </Button>
            </form>
          ) : (
            <form onSubmit={handleVerifyOtp} className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="otp" className="text-sm font-medium text-gray-700">
                  Verification Code
                </Label>
                <div className="relative">
                  <Input 
                    id="otp"
                    type="text"
                    placeholder="Enter 6-digit code"
                    value={otp}
                    onChange={(e) => setOtp(e.target.value.replace(/\D/g, '').slice(0, 6))}
                    required
                    maxLength={6}
                    className="pl-10 h-12 border-gray-200 focus:border-gold focus:ring-gold text-center text-lg font-mono tracking-widest"
                  />
                  <Shield className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                </div>
                <p className="text-xs text-gray-500 text-center">
                  Code expires in 10 minutes
                </p>
              </div>
              
              <Button 
                type="submit" 
                className="w-full h-12 bg-gradient-to-r from-gold to-gold-dark hover:from-gold-dark hover:to-gold text-white font-medium rounded-lg transition-all duration-200 shadow-lg hover:shadow-xl"
                disabled={isLoading || otp.length !== 6}
              >
                {isLoading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Verifying...
                  </>
                ) : (
                  <>
                    <Shield className="mr-2 h-4 w-4" />
                    Verify & Sign In
                  </>
                )}
              </Button>
              
              <div className="flex items-center justify-between text-sm">
                <Button 
                  type="button"
                  variant="ghost" 
                  onClick={handleBackToEmail}
                  className="text-gray-600 hover:text-gray-900 p-0 h-auto"
                >
                  <ArrowLeft className="mr-1 h-3 w-3" />
                  Change Email
                </Button>
                
                <Button 
                  type="button"
                  variant="ghost" 
                  onClick={() => {
                    setLocalError(null);
                    handleSendOtp({ preventDefault: () => {} } as React.FormEvent);
                  }}
                  className="text-gold hover:text-gold-dark p-0 h-auto"
                  disabled={isLoading}
                >
                  Resend Code
                </Button>
              </div>
            </form>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default LoginPage;
