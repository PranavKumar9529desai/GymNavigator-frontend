'use client';

import { useState, useTransition } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { signIn } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';
import { Eye, EyeOff, Lock, Mail, User, UserRoundCogIcon } from 'lucide-react';

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
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from '@/components/ui/select';
import FormError from '@/components/ui/form-error';
import GoogleButton from '@/components/ui/googleButton';
import { registerSchema, type RegisterFormValues } from '@/components/auth/schemas/register-schema';
import { useGoogleSignUp } from '@/components/auth/hooks/useGoogleSignUp';

export default function SignUpForm() {
	const [error, setError] = useState<string>('');
	const [errorType, setErrorType] = useState<'success' | 'fail' | null>();
	const [isPending, startTransition] = useTransition();
	const [showPassword, setShowPassword] = useState(false);
	const router = useRouter();
	
	const { handleGoogleSignUp } = useGoogleSignUp();

	const form = useForm<RegisterFormValues>({
		resolver: zodResolver(registerSchema),
		defaultValues: {
			email: '',
			password: '',
			name: '',
			role: undefined,
		},
	});

	const handleSubmit = async (values: RegisterFormValues) => {
		startTransition(async () => {
			const loadingToast = toast.loading('Creating your account...');

			try {
				const result = await signIn('credentials', {
					name: values.name,
					password: values.password,
					email: values.email,
					role: values.role,
					redirect: false,
				});

				if (result?.error) {
					// Try to parse the error message
					let errorMessage = 'Registration failed';
					
					try {
						const errorData = JSON.parse(result.error);
						errorMessage = errorData.message || errorMessage;
					} catch {
						// If parsing fails, use the raw error
						errorMessage = result.error;
					}
					
					setErrorType('fail');
					setError(errorMessage);
					toast.dismiss();
					toast.error('Registration failed', { description: errorMessage });
				} else {
					setErrorType('success');
					setError('');
					toast.dismiss();
					toast.success('Welcome to GymNavigator!', {
						description: 'Your account has been created successfully',
					});
					router.push('/dashboard');
				}
			} catch (error) {
				setErrorType('fail');
				setError('An unexpected error occurred');
				toast.dismiss();
				toast.error('Registration error', {
					description: 'An unexpected error occurred',
				});
			}
		});
	};

	const handleGoogleSubmit = () => {
		const selectedRole = form.getValues('role');
		
		if (!selectedRole) {
			toast.error('Role selection required', {
				description: 'Please select a role before continuing with Google',
			});
			form.setError('role', {
				type: 'manual',
				message: 'Please select a role first',
			});
			return;
		}

		handleGoogleSignUp(selectedRole);
	};

	return (
		<div className="w-full max-w-md mx-auto p-8 rounded-xl shadow-xl">
			{error && errorType && (
				<div className="h-8 sm:mb-4 mb-2">
					<FormError
						FormErrorProps={{
							message: error,
							type: errorType,
						}}
					/>
				</div>
			)}

			<div className="space-y-8">
				<Form {...form}>
					<form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-6">
						<FormField
							control={form.control}
							name="name"
							render={({ field }) => (
								<FormItem className="space-y-1">
									<FormLabel className="text-sm font-medium text-gray-300">
										<div className="flex items-center space-x-2">
											<User className="w-4 h-4 text-blue-400" />
											<span>Username</span>
										</div>
									</FormLabel>
									<FormControl>
										<Input
											placeholder="Username"
											{...field}
											disabled={isPending}
											className="bg-blue-950/30 border-blue-500/30 text-white placeholder:text-gray-400"
											autoComplete="name"
										/>
									</FormControl>
									<FormMessage className="text-xs" />
								</FormItem>
							)}
						/>

						<div className="grid grid-cols-2 gap-4">
							<FormField
								control={form.control}
								name="email"
								render={({ field }) => (
									<FormItem className="space-y-1">
										<FormLabel className="text-sm font-medium text-gray-300">
											<div className="flex items-center space-x-2">
												<Mail className="w-4 h-4 text-blue-400" />
												<span>Email</span>
											</div>
										</FormLabel>
										<FormControl>
											<Input
												placeholder="your@email.com"
												{...field}
												type="email"
												disabled={isPending}
												className="bg-blue-950/30 border-blue-500/30 text-white placeholder:text-gray-400"
												autoComplete="email"
											/>
										</FormControl>
										<FormMessage className="text-xs" />
									</FormItem>
								)}
							/>

							<FormField
								control={form.control}
								name="password"
								render={({ field }) => (
									<FormItem className="space-y-1">
										<FormLabel className="text-sm font-medium text-gray-300">
											<div className="flex items-center space-x-2">
												<Lock className="w-4 h-4 text-blue-400" />
												<span>Password</span>
											</div>
										</FormLabel>
										<FormControl>
											<div className="relative">
												<Input
													placeholder="••••••••"
													{...field}
													disabled={isPending}
													type={showPassword ? 'text' : 'password'}
													className="bg-blue-950/30 border-blue-500/30 text-white placeholder:text-gray-400 pr-10"
													autoComplete="new-password"
												/>
												<button
													type="button"
													className="absolute right-3 top-1/2 -translate-y-1/2 text-blue-400 hover:text-blue-300"
													onClick={() => setShowPassword(!showPassword)}
													aria-label={showPassword ? 'Hide password' : 'Show password'}
												>
													{showPassword ? (
														<EyeOff className="h-4 w-4" />
													) : (
														<Eye className="h-4 w-4" />
													)}
												</button>
											</div>
										</FormControl>
										<FormMessage className="text-xs" />
									</FormItem>
								)}
							/>
						</div>

						<FormField
							control={form.control}
							name="role"
							render={({ field }) => (
								<FormItem className="space-y-1">
									<FormLabel className="text-sm font-medium text-gray-300">
										<div className="flex items-center space-x-2">
											<UserRoundCogIcon className="w-4 h-4 text-blue-400" />
											<span>Role</span>
										</div>
									</FormLabel>
									<Select
										onValueChange={field.onChange}
										value={field.value}
										disabled={isPending}
									>
										<FormControl>
											<SelectTrigger className="w-full bg-blue-950/30 border-blue-500/30 text-white">
												<SelectValue placeholder="Select your Role" />
											</SelectTrigger>
										</FormControl>
										<SelectContent className="z-50 bg-blue-950/30 backdrop-blur-md border-blue-500/30 text-white">
											<SelectItem value="owner" className="hover:bg-blue-800/50">
												Gym Owner
											</SelectItem>
											<SelectItem value="trainer" className="hover:bg-blue-800/50">
												Trainer
											</SelectItem>
											<SelectItem value="client" className="hover:bg-blue-800/50">
												Client
											</SelectItem>
										</SelectContent>
									</Select>
									<FormMessage className="text-xs" />
								</FormItem>
							)}
						/>

						<Button
							type="submit"
							className="w-full font-semibold bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700"
							disabled={isPending}
							size="lg"
						>
							{isPending ? (
								<div className="flex items-center space-x-2">
									<span className="animate-spin">⚪</span>
									<span>Creating Account...</span>
								</div>
							) : (
								'Create Account'
							)}
						</Button>
					</form>
				</Form>

				<div className="relative">
					<div className="absolute inset-0 flex items-center">
						<span className="w-full border-t border-blue-500/30" />
					</div>
					<div className="relative flex justify-center text-xs uppercase">
						<span className="bg-blue-900/20 px-2 text-gray-300">
							Or continue with
						</span>
					</div>
				</div>

				<GoogleButton handleSubmit={handleGoogleSubmit} />

				<div className="text-center text-sm text-gray-300">
					Already have an account?{' '}
					<a href="/signin" className="hover:underline font-medium text-blue-400">
						Sign In
					</a>
				</div>
			</div>
		</div>
	);
} 