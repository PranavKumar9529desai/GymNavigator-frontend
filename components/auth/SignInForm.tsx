'use client';

import { useState, useTransition } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { signIn } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';
import { Eye, EyeOff, Lock, Mail } from 'lucide-react';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
	Form,
	FormControl,
	FormField,
	FormItem,
	FormLabel,
	FormMessage,
} from '@/components/ui/form';
import FormError from '@/components/ui/form-error';
import GoogleButton from '@/components/ui/googleButton';
import {
	signInSchema,
	type SignInFormValues,
} from '@/components/auth/schemas/signin-schema';
import { useGoogleSignIn } from '@/components/auth/hooks/useGoogleSignIn';
import { useCredentialStorage } from '@/components/auth/hooks/useCredentialStorage';
import { parseAuthError } from '@/lib/utils/auth-error-parser';

export default function SignInForm() {
	const [isPending, startTransition] = useTransition();
	const [showPassword, setShowPassword] = useState(false);
	const router = useRouter();

	const { handleGoogleSignIn } = useGoogleSignIn();
	const { storeCredentials } = useCredentialStorage();

	const form = useForm<SignInFormValues>({
		resolver: zodResolver(signInSchema),
		defaultValues: {
			email: '',
			password: '',
		},
	});

	const handleSubmit = async (values: SignInFormValues) => {
		startTransition(async () => {
			const _loadingToast = toast.loading('Signing you in...');

			try {
				const result = await signIn('credentials', {
					redirect: false,
					email: values.email,
					password: values.password,
				});

				console.log('🔐 [SignInForm] result:', result);

				if (result?.error) {
					// Parse the error message using our utility function
					const { message: errorMessage } = parseAuthError(result.error);

					toast.dismiss();
					toast.error('Sign in failed', { description: errorMessage });
				} else if (result?.ok) {
					toast.dismiss();
					toast.success('Welcome back!', {
						description: 'Redirecting to dashboard...',
					});

					// Store credentials for future use
					await storeCredentials(values.email, values.password);
					router.push('/dashboard');
				}
			} catch (_error) {
				toast.dismiss();
				toast.error('Sign in error', {
					description: 'An unexpected error occurred',
				});
			}
		});
	};

	return (
		<div className="md:flex justify-center px-4 sm:px-6 lg:px-8">
			<div className="w-full max-w-md p-8 rounded-xl">
				<Form {...form}>
					<form
						onSubmit={form.handleSubmit(handleSubmit)}
						className="space-y-6"
					>
						<FormField
							control={form.control}
							name="email"
							render={({ field }) => (
								<FormItem className="space-y-2">
									<FormLabel className="text-gray-300">Email Address</FormLabel>
									<div className="relative">
										<Mail className="absolute left-3 top-3 h-5 w-5 text-blue-400" />
										<FormControl>
											<Input
												placeholder="john@example.com"
												{...field}
												type="email"
												disabled={isPending}
												className="pl-10 bg-blue-950/30 border-blue-500/30 text-white placeholder:text-gray-400"
												autoComplete="email"
											/>
										</FormControl>
									</div>
									<FormMessage className="text-xs" />
								</FormItem>
							)}
						/>

						<FormField
							control={form.control}
							name="password"
							render={({ field }) => (
								<FormItem className="space-y-2">
									<FormLabel className="text-gray-300">Password</FormLabel>
									<div className="relative">
										<Lock className="absolute left-3 top-3 h-5 w-5 text-blue-400" />
										<FormControl>
											<Input
												placeholder="Your password"
												{...field}
												type={showPassword ? 'text' : 'password'}
												disabled={isPending}
												className="pl-10 pr-10 bg-blue-950/30 border-blue-500/30 text-white placeholder:text-gray-400"
												autoComplete="current-password"
											/>
										</FormControl>
										<button
											type="button"
											onClick={() => setShowPassword(!showPassword)}
											className="absolute right-3 top-3 text-blue-400 hover:text-blue-300"
											aria-label={
												showPassword ? 'Hide password' : 'Show password'
											}
										>
											{showPassword ? (
												<EyeOff className="h-5 w-5" />
											) : (
												<Eye className="h-5 w-5" />
											)}
										</button>
									</div>
									<FormMessage className="text-xs" />
								</FormItem>
							)}
						/>

						<Button
							type="submit"
							className="w-full bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white"
							disabled={isPending}
						>
							{isPending ? 'Signing in...' : 'Sign In'}
						</Button>
					</form>
				</Form>

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
