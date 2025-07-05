'use client';
import { getUserByEmail } from '@/app/(common)/_actions/auth/get-userinfo';
import { storeGoogleSignupRole } from '@/app/(common)/_actions/auth/google-role-server-action';
import {
	Form,
	FormControl,
	FormField,
	FormItem,
	FormLabel,
	FormMessage,
} from '@/components/ui/form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Eye, EyeOff, Lock, Mail, User, UserRoundCogIcon } from 'lucide-react';
import { signIn } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import React, { useState, useTransition } from 'react';
import { useForm } from 'react-hook-form';
import { toast } from 'sonner';
import { Button } from '../../ui/button';
import FormError from '../../ui/form-error';
import GoogleButton from '../../ui/googleButton';
import { Input } from '../../ui/input';
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from '../../ui/select';
import SignIn from '../Auth/SigninForm';
import { type RegisterFormValues, registerSchema } from './register-schema';

// Remove the formSchema definition as it's now in register-schema.ts

export default function RegisterForm() {
	const [error, seterror] = useState<string>('');
	const [type, settype] = useState<'success' | 'fail' | null>();
	const [ispending, startTransition] = useTransition();
	const [showPassword, setShowPassword] = useState(false);
	const router = useRouter();
	const form = useForm<RegisterFormValues>({
		resolver: zodResolver(registerSchema),
		defaultValues: {
			email: '',
			password: '',
			name: '',
			role: undefined,
		},
	});

	const {
		formState: { errors },
	} = form;

	async function onSubmit(values: RegisterFormValues) {
		console.log('form is submitted values', values);
		const { email, password, name, role } = values;

		startTransition(async () => {
			// Create a dismissible loading toast
			const loadingToast = toast.loading('Processing registration...');
			
			try {
				// Check if the user already exists using the updated getUserByEmail function
				const userExistsResponse = await getUserByEmail(email);

				if (userExistsResponse.success && userExistsResponse.data?.exists) {
					// User exists, show error
					settype('fail');
					seterror('Email is already registered');
					toast.dismiss();
					toast.error('Registration failed', {
						description: 'Email is already registered',
					});
					return;
				}

				// If we reach here, the user doesn't exist, so we can proceed with registration
				settype('success');
				const signInResult = await signIn('credentials', {
					name,
					password,
					email,
					role,
					redirect: false,
				});

				if (signInResult?.error) {
					settype('fail');
					try {
						const errorData = JSON.parse(signInResult.error);
						const errorMessage = errorData.message || 'Registration failed. Please try again.';
						seterror(errorMessage);
						toast.dismiss();
						toast.error('Registration failed', {
							description: errorMessage,
						});
					} catch {
						seterror('Registration failed');
						toast.dismiss();
						toast.error('Registration failed', {
							description: 'Please try again',
						});
					}
				} else {
					settype('success');
					seterror('Account created successfully');
					toast.dismiss();
					toast.success('Welcome to GymNavigator!', {
						description: 'Your account has been created successfully',
					});
					router.refresh();
					
					// Redirect to dashboard on success - moved here from finally block
					router.push('/dashboard');
				}
			} catch (error) {
				settype('fail');
				seterror('An unexpected error occurred');
				toast.dismiss();
				toast.error('Registration error', {
					description: 'An unexpected error occurred',
				});
				console.error('Registration error:', error);
			}
		});
	}

	async function handleGoogleSubmit() {
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

		// Store the role in a server-side cookie
		await storeGoogleSignupRole(selectedRole);

		startTransition(async () => {
			const loadingToast = toast.loading('Connecting to Google...');
			
			try {
				// Pass the role as a state parameter to Google auth
				await signIn('google', {
					redirect: true,
					callbackUrl: '/dashboard',
				});
				// Note: We don't need to dismiss the toast here as the page will redirect
			} catch (error) {
				toast.dismiss();
				toast.error('Google sign-in failed', {
					description: 'Could not connect to Google. Please try again.',
				});
				console.error('Google sign-in error:', error);
			}
		});
	}

	return (
		<div className="w-full max-w-md mx-auto p-8 rounded-xl shadow-xl">
			<div className='h-8 sm:mb-4 mb-2'>

			{error && type ? (
				<FormError
				FormErrorProps={{
					message: error,
					type: type as 'success' | 'fail',
				}}
				/>
			) : null}
			</div>

			<div className="space-y-8">
				<Form {...form}>
					<form
						onSubmit={form.handleSubmit(onSubmit)}
						className="space-y-6"
						method="post"
						autoComplete="on"
						name="registration"
					>
						<FormField
							control={form.control}
							name="name"
							render={({ field }) => (
								<FormItem className="space-y-1">
									<FormLabel className="text-sm font-medium text-gray-300">
										<div className="flex items-center space-x-2">
											<User
												className={`w-4 h-4 ${
													errors.name ? 'text-destructive' : 'text-blue-400'
												}`}
											/>
											<span>Username</span>
										</div>
									</FormLabel>
									<FormControl>
										<Input
											placeholder="Username"
											{...field}
											disabled={ispending}
											type="text"
											className="bg-blue-950/30 border-blue-500/30 text-white placeholder:text-gray-400 focus:border-blue-500/50 focus:ring-blue-500/20 focus:ring-opacity-50 focus-visible:ring-blue-500/20 focus-visible:ring-offset-blue-900/20"
											autoComplete="name"
											id="name"
											name="name"
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
												<Mail
													className={`w-4 h-4 ${
														errors.email ? 'text-destructive' : 'text-blue-400'
													}`}
												/>
												<span>Email</span>
											</div>
										</FormLabel>
										<FormControl>
											<Input
												placeholder="your@email.com"
												{...field}
												type="email"
												disabled={ispending}
												className="bg-blue-950/30 border-blue-500/30 text-white placeholder:text-gray-400 focus:border-blue-500/50 focus:ring-blue-500/20 focus:ring-opacity-50 focus-visible:ring-blue-500/20 focus-visible:ring-offset-blue-900/20"
												autoComplete="username email"
												id="email"
												name="email"
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
												<Lock
													className={`w-4 h-4 ${
														errors.password
															? 'text-destructive'
															: 'text-blue-400'
													}`}
												/>
												<span>Password</span>
											</div>
										</FormLabel>
										<FormControl>
											<div className="relative">
												<Input
													placeholder="••••••••"
													{...field}
													disabled={ispending}
													type={showPassword ? 'text' : 'password'}
													className="bg-blue-950/30 border-blue-500/30 text-white placeholder:text-gray-400 pr-10 focus:border-blue-500/50 focus:ring-blue-500/20 focus:ring-opacity-50 focus-visible:ring-blue-500/20 focus-visible:ring-offset-blue-900/20"
													autoComplete="new-password"
													id="password"
													name="password"
												/>
												<button
													type="button"
													className="absolute right-3 top-1/2 -translate-y-1/2 text-blue-400 hover:text-blue-300 transition-colors"
													onClick={() => setShowPassword(!showPassword)}
													onKeyDown={(e) => e.key === 'Enter' && setShowPassword(!showPassword)}
													role="button"
													tabIndex={0}
													aria-label={showPassword ? "Hide password" : "Show password"}
												>
													{showPassword ? (
														<EyeOff className="h-4 w-4" />
													) : (
														<Eye className="h-4 w-4" />
													)}
												</button>
											</div>
										</FormControl>
										<div className="text-xs text-gray-400 mt-1 hidden sm:block">
											Password must contain: 6+ characters, uppercase & lowercase letters, 
											a number, and a special character
										</div>
										<FormMessage className="text-xs" />
									</FormItem>
								)}
							/>
						</div>
						<FormField
							control={form.control}
							name="role"
							render={({ field }) => (
								<FormItem className="space-y-1 w-full mt-4">
									<FormLabel className="text-sm font-medium text-gray-300">
										<div className="flex items-center space-x-2">
											<UserRoundCogIcon
												className={`w-4 h-4 ${
													errors.role ? 'text-destructive' : 'text-blue-400'
												}`}
											/>
											<span>Role</span>
										</div>
									</FormLabel>
									<Select
										onValueChange={(value) => field.onChange(value)}
										value={field.value}
										disabled={ispending}
									>
										<FormControl>
											<SelectTrigger className="w-full bg-blue-950/30 border-blue-500/30 text-white focus:ring-blue-500/20 focus:ring-offset-blue-900/20">
												<SelectValue placeholder="Select your Role" />
											</SelectTrigger>
										</FormControl>
										<SelectContent className="z-50 bg-blue-950/30 backdrop-blur-md border-blue-500/30 text-white">
											<SelectItem
												value="owner"
												className="hover:bg-blue-800/50 bg-blue-950/30"
											>
												Gym Owner
											</SelectItem>
											<SelectItem
												value="trainer"
												className="hover:bg-blue-800/50 bg-blue-950/30"
											>
												Trainer
											</SelectItem>
											<SelectItem
												value="client"
												className="hover:bg-blue-800/50 bg-blue-950/30"
											>
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
							className="w-full font-semibold bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 transition-all duration-300 shadow-lg relative z-10"
							disabled={ispending}
							size="lg"
						>
							{ispending ? (
								<div className="flex items-center space-x-2">
									<span className="animate-spin">⚪</span>
									<span>Registering...</span>
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
					<a
						href="/signin"
						className="hover:underline font-medium text-blue-400"
					>
						Sign In
					</a>
				</div>
			</div>
		</div>
	);
}
