import { useState } from 'react';
import { X, Mail, Lock } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Separator } from '@/components/ui/separator';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const AuthModal = ({ isOpen, onClose }: AuthModalProps) => {
  const [isSignUp, setIsSignUp] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  
  const { signInWithGoogle, signInWithEmail, signUpWithEmail } = useAuth();
  const { toast } = useToast();

  const resetForm = () => {
    setEmail('');
    setPassword('');
    setIsSignUp(false);
    setIsLoading(false);
  };

  const handleClose = () => {
    resetForm();
    onClose();
  };

  const handleGoogleSignIn = async () => {
    try {
      setIsLoading(true);
      await signInWithGoogle();
      toast({
        title: "Success",
        description: "Signing in with Google...",
      });
      handleClose();
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Failed to sign in with Google",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleEmailAuth = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!email.trim() || !password.trim()) {
      toast({
        title: "Error",
        description: "Please fill in all fields",
        variant: "destructive",
      });
      return;
    }

    try {
      setIsLoading(true);
      
      if (isSignUp) {
        await signUpWithEmail(email, password);
        toast({
          title: "Success",
          description: "Account created successfully!",
        });
      } else {
        await signInWithEmail(email, password);
        toast({
          title: "Success",
          description: "Signed in successfully!",
        });
      }
      
      handleClose();
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || `Failed to ${isSignUp ? 'sign up' : 'sign in'}`,
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <>
      {/* Overlay */}
      <div 
        className="fixed inset-0 bg-black/50 flex items-center justify-center z-50"
        onClick={handleClose}
        data-testid="auth-modal-overlay"
      />
      
      {/* Modal */}
      <div className="fixed inset-0 flex items-center justify-center z-50 p-4">
        <div 
          className="bg-card rounded-xl p-8 max-w-md w-full mx-4 relative"
          onClick={(e) => e.stopPropagation()}
          data-testid="auth-modal"
        >
          <Button
            variant="ghost"
            size="sm"
            className="absolute top-4 right-4"
            onClick={handleClose}
            data-testid="button-close-auth"
          >
            <X className="w-4 h-4" />
          </Button>

          <div className="text-center mb-8">
            <h2 className="font-serif text-2xl font-bold text-foreground mb-2">
              {isSignUp ? 'Create Account' : 'Welcome Back'}
            </h2>
            <p className="text-muted-foreground">
              {isSignUp 
                ? 'Join us to explore traditional Aipan crafts'
                : 'Sign in to your account'
              }
            </p>
          </div>

          <div className="space-y-4">
            {/* Google Sign In */}
            <Button
              variant="outline"
              className="w-full py-3 flex items-center justify-center space-x-3"
              onClick={handleGoogleSignIn}
              disabled={isLoading}
              data-testid="button-google-signin"
            >
              <svg className="w-5 h-5" viewBox="0 0 24 24">
                <path
                  fill="currentColor"
                  d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                />
                <path
                  fill="currentColor"
                  d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                />
                <path
                  fill="currentColor"
                  d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                />
                <path
                  fill="currentColor"
                  d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                />
              </svg>
              <span>Continue with Google</span>
            </Button>

            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <Separator className="w-full" />
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="bg-card px-2 text-muted-foreground">Or</span>
              </div>
            </div>

            {/* Email Form */}
            <form onSubmit={handleEmailAuth} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="email">Email address</Label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                  <Input
                    id="email"
                    type="email"
                    placeholder="Enter your email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="pl-10"
                    disabled={isLoading}
                    required
                    data-testid="input-email"
                  />
                </div>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="password">Password</Label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                  <Input
                    id="password"
                    type="password"
                    placeholder="Enter your password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="pl-10"
                    disabled={isLoading}
                    required
                    minLength={6}
                    data-testid="input-password"
                  />
                </div>
              </div>
              
              <Button 
                type="submit" 
                className="w-full py-3 font-semibold"
                disabled={isLoading}
                data-testid="button-submit-auth"
              >
                {isLoading ? 'Processing...' : isSignUp ? 'Create Account' : 'Sign In'}
              </Button>
            </form>

            <div className="text-center">
              <Button
                variant="link"
                onClick={() => setIsSignUp(!isSignUp)}
                disabled={isLoading}
                data-testid="button-toggle-auth-mode"
              >
                {isSignUp 
                  ? 'Already have an account? Sign in'
                  : "Don't have an account? Sign up"
                }
              </Button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};
