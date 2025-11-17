import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { toast } from "sonner";
import { Loader2 } from "lucide-react";

const LoginPage = () => {
  const [email, setEmail] = useState("");
  const [otpSent, setOtpSent] = useState(false);
  const [otp, setOtp] = useState("");
  const { login, verifyOtp, error } = useAuth();
  const navigate = useNavigate();
  const [localError, setLocalError] = useState<string | null>(null);
  const [emailLoading, setEmailLoading] = useState(false);
  const [otpLoading, setOtpLoading] = useState(false);

  const handleEmailSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLocalError(null);
    setEmailLoading(true);
    try {
      await login(email);
      setOtpSent(true);
      toast.success("OTP sent to your email. Please check your inbox.");
    } catch (err) {
      setLocalError("Failed to send OTP. Please try again.");
    } finally {
      setEmailLoading(false);
    }
  };

  const handleOtpSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLocalError(null);
    setOtpLoading(true);
    try {
      await verifyOtp(email, otp);
      toast.success("Login successful!");
      navigate("/");
    } catch (err) {
      setLocalError("Invalid OTP. Please try again.");
    } finally {
      setOtpLoading(false);
    }
  };

  return (
    <div className="min-h-[calc(100vh-12rem)] flex items-center justify-center py-12 px-4">
      <Card className="w-full max-w-md">
        <CardHeader className="space-y-1">
          <CardTitle className="text-2xl font-serif text-center">Sign In</CardTitle>
          <CardDescription className="text-center">
            Enter your email to receive a one-time code. New users will have their profile created automatically after first login.
          </CardDescription>
        </CardHeader>
        <CardContent>
          {(error || localError) && (
            <div className="bg-destructive/10 border border-destructive text-destructive px-4 py-2 rounded-md mb-4 text-sm">
              {error || localError}
            </div>
          )}
          {!otpSent ? (
            <form onSubmit={handleEmailSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input 
                  id="email"
                  type="email"
                  placeholder="name@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </div>
              <Button 
                type="submit" 
                className="w-full bg-gold hover:bg-gold-dark text-white"
                disabled={emailLoading}
              >
                {emailLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                Send OTP
              </Button>
            </form>
          ) : (
            <form onSubmit={handleOtpSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="otp">Enter OTP</Label>
                <Input 
                  id="otp"
                  type="text"
                  placeholder="6-digit code"
                  value={otp}
                  onChange={(e) => setOtp(e.target.value)}
                  required
                  maxLength={6}
                />
              </div>
              <Button 
                type="submit" 
                className="w-full bg-gold hover:bg-gold-dark text-white"
                disabled={otpLoading}
              >
                {otpLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                Verify & Sign In
              </Button>
              <div className="text-center text-sm mt-4">
                <button
                  type="button"
                  className="text-gold hover:underline"
                  onClick={() => setOtpSent(false)}
                >
                  Change email
                </button>
              </div>
            </form>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default LoginPage;
