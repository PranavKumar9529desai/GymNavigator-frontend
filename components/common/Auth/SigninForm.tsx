'use client';
import { AuthError } from '@/components/Auth/AuthError';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
// Import the type definitions
import type { PasswordCredential } from '@/types/credential-management';
import { Eye, EyeOff, Lock, Mail } from 'lucide-react';
import { signIn } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { toast } from 'sonner';
import GoogleButton from '../../ui/googleButton';
// Make sure the types are imported (no need to explicitly import the global declarations)
import '@/types/credential-management';

// After successful login, store the credentials
const storeCredentials = async (email: string, password: string) => {
	// Check if Credential Management API is supported
	if ('credentials' in navigator && window.PasswordCredential) {
		try {
			const cred = new window.PasswordCredential({
				id: email,
				password: password,
				name: email,
				iconURL: `${window.location.origin}/favicon.ico`,
			});
			await navigator.credentials.store(cred);
		} catch (e) {
			console.error('Error storing credentials:', e);
		}
	}
};

export default function SignInForm() {
	const [email, setEmail] = useState('');
	const [password, setPassword] = useState('');
	const [showPassword, setShowPassword] = useState(false);
	const [loading, setLoading] = useState(false);
	const [error, setError] = useState<string | null>(null);
	const Router = useRouter();

	const handleSubmit = async (event: React.FormEvent) => {
		event.preventDefault();
		setLoading(true);
		setError(null);

		try {
			// Use NextAuth's signIn directly - auth.config.ts handles the authentication logic
			const result = await signIn('credentials', {
				redirect: false,
				email,
				password,
			});

			if (result?.error) {
				// Parse the error JSON if it exists
				toast.dismiss();
				let errorMessage = 'Failed to sign in';
				let errorCode = 'UNKNOWN_ERROR';

				try {
					const parsedError = JSON.parse(result.error);
					errorMessage = parsedError.message || errorMessage;
					errorCode = parsedError.error || errorCode;
				} catch {
					errorMessage = result.error;
				}

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
			} else if (result?.ok) {
				toast.dismiss();

				toast.success('Welcome back!', {
					description: 'Redirecting to dashboard...',
				});
				await storeCredentials(email, password);
				// router.refresh();
			}
		} catch (error) {
			toast.dismiss();
			console.error('Failed to sign in:', error);
			setError('An unexpected error occurred');
			toast.error('Sign in error', {
				description: 'An unexpected error occurred',
			});
		} finally {
			setLoading(false);
			toast.dismiss();
			toast.success('Welcome back!', {
				description: 'Redirecting to dashboard...',
			});
			Router.refresh();
		}
	};

	const handleGoogleSignIn = async () => {
		setLoading(true);
		try {
			toast.loading('Connecting to Google...');

			// Use NextAuth's Google provider directly
			// auth.config.ts handles the verification with our backend
			await signIn('google', {
				callbackUrl: '/dashboard',
			});

			// Note: No need for additional logic here since the page will redirect
			// and the signIn callback in auth.config.ts handles the verification
		} catch (error) {
			console.error('Failed to sign in with Google:', error);
			setError('Failed to sign in with Google');
			toast.error('Google Sign-in failed', { description: 'Please try again' });
			setLoading(false);
		} finally {
			toast.dismiss();
			toast.success('Welcome back!', {
				description: 'Redirecting to dashboard...',
			});
			Router.refresh();
		}
	};

	return (
		<div className="md:flex justify-center px-4 sm:px-6 lg:px-8">
			<div className="w-full max-w-md p-8 rounded-xl">
				{error && <AuthError error={error} onDismiss={() => setError(null)} />}

				<form
					onSubmit={handleSubmit}
					className="space-y-6"
					name="login"
					id="login-form"
					method="post"
					autoComplete="on"
				>
					<div className="space-y-2">
						<Label htmlFor="email" className="text-gray-300">
							Email Address
						</Label>
						<div className="relative">
							<Mail className="absolute left-3 top-3 h-5 w-5 text-blue-400" />
							<Input
								id="email"
								name="email"
								type="email"
								placeholder="john@example.com"
								className="pl-10 bg-blue-950/30 border-blue-500/30 text-white placeholder:text-gray-400"
								required
								value={email}
								onChange={(e) => setEmail(e.target.value)}
								disabled={loading}
								autoComplete="email"
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
								name="password"
								placeholder="Your password"
								type={showPassword ? 'text' : 'password'}
								className="pl-10 pr-10 bg-blue-950/30 border-blue-500/30 text-white placeholder:text-gray-400"
								required
								value={password}
								onChange={(e) => setPassword(e.target.value)}
								disabled={loading}
								autoComplete="current-password"
							/>
							<button
								type="button"
								onClick={() => setShowPassword(!showPassword)}
								className="absolute right-3 top-3 text-blue-400 hover:text-blue-300 focus:outline-none"
								aria-label={showPassword ? 'Hide password' : 'Show password'}
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
						name="login-button"
					>
						{loading ? 'Signing in...' : 'Sign In'}
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

				<GoogleButton handleSubmit={handleGoogleSignIn} />

				<div className="mt-6 text-center text-sm text-gray-300">
					Don&apos;t have an account?{' '}
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
