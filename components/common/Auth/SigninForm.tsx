"use client";

import { AuthError } from "@/components/Auth/AuthError";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { signIn } from "@/node_modules/next-auth/react";
import { Eye, EyeOff, Lock, Mail } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { toast } from "sonner";

export default function SignInForm() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const result = await signIn("credentials", {
        email,
        password,
        redirect: false,
      });

      if (result?.error) {
        try {
          const errorData = JSON.parse(result.error);
          switch (errorData.error) {
            case "USER_NOT_FOUND":
              setError("No account found with this email address");
              break;
            case "INVALID_PASSWORD":
              setError("Invalid password. Please try again");
              break;
            case "SERVER_ERROR":
              setError("An error occurred. Please try again later");
              break;
            default:
              setError(errorData.message || "Failed to sign in");
          }
        } catch {
          setError("Failed to sign in");
        }
      } else if (result?.ok) {
        toast.success("Successfully signed in!", {
          description: "Redirecting to dashboard...",
        });
        router.refresh();
      }
    } catch (error) {
      console.error("Failed to sign in:", error);
      setError("An unexpected error occurred");
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleSignIn = async () => {
    setLoading(true);
    try {
      await signIn("google", {});
    } catch (error) {
      console.error("Failed to sign in with Google:", error);
      setError("Failed to sign in with Google");
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen md:flex items-center justify-center py-8 px-4 sm:px-6 lg:px-8">
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
                type={showPassword ? "text" : "password"}
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
                aria-label={showPassword ? "Hide password" : "Show password"}
              >
                {showPassword ? (
                  <EyeOff className="h-5 w-5" />
                ) : (
                  <Eye className="h-5 w-5" />
                )}
              </button>
            </div>
          </div>

          <Button
            type="submit"
            className="w-full bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white"
            disabled={loading}
          >
            {loading ? "Signing in..." : "Sign In"}
          </Button>
        </form>

        <div className="relative my-6">
          <div className="absolute inset-0 flex items-center">
            <span className="w-full border-t border-blue-500/30" />
          </div>
          <div className="relative flex justify-center text-sm">
            <span className="px-2 bg-blue-900/20 text-gray-300">
              Or continue with
            </span>
          </div>
        </div>

        <Button
          type="button"
          variant="outline"
          className="w-full border-blue-500/30 text-gray-200 hover:bg-blue-900/30"
          onClick={handleGoogleSignIn}
          disabled={loading}
        >
          <svg
            className="mr-2 h-5 w-5"
            viewBox="0 0 24 24"
            xmlns="http://www.w3.org/2000/svg"
            aria-labelledby="googleLogoTitle"
          >
            <title id="googleLogoTitle">Google logo</title>
            <path
              d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
              fill="#4285F4"
            />
            <path
              d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
              fill="#34A853"
            />
            <path
              d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
              fill="#FBBC05"
            />
            <path
              d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
              fill="#EA4335"
            />
            <path d="M1 1h22v22H1z" fill="none" />
          </svg>
          Sign in with Google
        </Button>

        <div className="mt-6 text-center text-sm text-gray-300">
          Don&apos;t have an account?{" "}
          <a
            href="/signup"
            className="font-medium text-blue-400 hover:text-blue-300"
          >
            Sign up
          </a>
        </div>
      </div>
    </div>
  );
}
