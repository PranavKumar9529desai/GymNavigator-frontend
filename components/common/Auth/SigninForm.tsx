'use client';
import SigninSA from '@/app/(common)/_actions/auth/signin-with-credentials';
import SigninGoogleSA from '@/app/(common)/_actions/auth/signin-with-google';
import { AuthError } from '@/components/Auth/AuthError';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { signIn } from '@/node_modules/next-auth/react';
import { Eye, EyeOff, Lock, Mail } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { toast } from 'sonner';
import GoogleButton from '../../ui/googleButton';

export default function SignInForm() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    setLoading(true);
    setError(null);

    try {
      // Use our server action instead of Next Auth directly
      const result = await SigninSA(email, password);

      if (!result.success) {
        const errorCode = result.error?.code || 'UNKNOWN_ERROR';
        const errorMessage = result.error?.message || 'Failed to sign in';
        
        setError(errorMessage);
        
        // Map error codes to user-friendly toast messages
        switch (errorCode) {
          case 'USER_NOT_FOUND':
            toast.error('Account not found', {
              description: 'No account found with this email address',
            });
            break;
          case 'INVALID_CREDENTIALS':
            toast.error('Invalid credentials', {
              description: 'The email or password you entered is incorrect',
            });
            break;
          case 'SERVER_ERROR':
            toast.error('Server error', {
              description: 'Please try again later',
            });
            break;
          default:
            toast.error('Sign in failed', {
              description: errorMessage,
            });
        }
      } else if (result.data) {
        // Handle successful login
        await signIn('credentials', {
          redirect: false,
          email,
          password,
          // Additional data to store in session if needed
          userData: JSON.stringify(result.data),
        });
        
        toast.success('Welcome back!', {
          description: 'Redirecting to dashboard...',
        });
        router.refresh();
      }
    } catch (error) {
      console.error('Failed to sign in:', error);
      setError('An unexpected error occurred');
      toast.error('Sign in error', { description: 'An unexpected error occurred' });
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleSignIn = async () => {
    setLoading(true);
    try {
      toast.loading('Connecting to Google...');
      
      // First attempt Google authentication through NextAuth
      const authResult = await signIn('google', {
        redirect: false,
      });
      
      // If we get the email from Google auth, validate with our backend
      if (authResult?.ok && authResult?.user?.email) {
        const googleEmail = authResult.user.email;
        const result = await SigninGoogleSA(googleEmail);
        
        if (!result.success) {
          const errorMessage = result.error?.message || 'Failed to sign in with Google';
          setError(errorMessage);
          
          switch (result.error?.code) {
            case 'USER_NOT_FOUND':
              toast.error('Account not found', {
                description: 'No account exists with this Google email',
              });
              break;
            default:
              toast.error('Google Sign-in failed', {
                description: errorMessage,
              });
          }
          setLoading(false);
        } else {
          // Successful Google login
          toast.success('Signed in with Google!', {
            description: 'Redirecting to dashboard...',
          });
          router.refresh();
        }
      } else {
        // Google authentication itself failed
        setError('Failed to authenticate with Google');
        toast.error('Google Sign-in failed', {
          description: 'Could not authenticate with Google',
        });
        setLoading(false);
      }
    } catch (error) {
      console.error('Failed to sign in with Google:', error);
      setError('Failed to sign in with Google');
      toast.error('Google Sign-in failed', { description: 'Please try again' });
      setLoading(false);
    }
  };

  return (
    <div className=" md:flex  justify-center  px-4 sm:px-6 lg:px-8 ">
      <div className="w-full max-w-md  p-8 rounded-xl ">
        {error && <AuthError error={error} onDismiss={() => setError(null)} />}

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-2">
            <Label htmlFor="email" className="text-gray-300">
              Email Address
            </Label>
            <div className="relative">
              <Mail className="absolute left-3 top-3 h-5 w-5 text-blue-400" />
              <Input
                id="email"
                type="email"
                placeholder="john@example.com"
                className="pl-10 bg-blue-950/30 border-blue-500/30 text-white placeholder:text-gray-400"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                disabled={loading}
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="password" className="text-gray-300">
              Password
            </Label>
            <div className="relative">
              <Lock className="absolute left-3 top-3 h-5 w-5 text-blue-400" />
              <Input
                id="password"
                placeholder="Your password"
                type={showPassword ? 'text' : 'password'}
                className="pl-10 pr-10 bg-blue-950/30 border-blue-500/30 text-white placeholder:text-gray-400"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                disabled={loading}
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-3 text-blue-400 hover:text-blue-300 focus:outline-none"
                aria-label={showPassword ? 'Hide password' : 'Show password'}
              >
                {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
              </button>
            </div>
          </div>

          <Button
            type="submit"
            className="w-full bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white"
            disabled={loading}
          >
            {loading ? 'Signing in...' : 'Sign In'}
          </Button>
        </form>

        <div className="relative my-6">
          <div className="absolute inset-0 flex items-center">
            <span className="w-full border-t border-blue-500/30" />
          </div>
          <div className="relative flex justify-center text-sm">
            <span className="px-2 bg-blue-900/20 text-gray-300">Or continue with</span>
          </div>
        </div>

        <GoogleButton handleSubmit={handleGoogleSignIn} />

        <div className="mt-6 text-center text-sm text-gray-300">
          Don&apos;t have an account?{' '}
          <a href="/signup" className="font-medium text-blue-400 hover:text-blue-300">
            Sign up
          </a>
        </div>
      </div>
    </div>
  );
}
