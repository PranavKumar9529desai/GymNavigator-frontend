'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useSession } from 'next-auth/react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Button } from '@/components/ui/button';
import { PinInput } from '@/components/ui/pin-input';
import {
	Form,
	FormControl,
	FormField,
	FormItem,
	FormLabel,
	FormMessage,
} from '@/components/ui/form';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Mail, Phone, MessageCircle, ChevronDown, ChevronUp } from 'lucide-react';
import { verifyTrainerToken } from '../_actions/verify-trainer-token';
import { updateSessionWithGym } from '@/app/(common)/_actions/session/updateSessionWithGym';
import type { GymInfo } from '@/types/next-auth';

interface Gym {
	id: string;
	name: string;
	img: string;
	phone?: string;
	email?: string;
}

interface TrainerAuthFormProps {
	gym: Gym;
}

// Updated schema for PIN input - expecting 7 characters (based on the backend token generation)
const authTokenSchema = z.object({
	authToken: z
		.string()
		.length(7, 'Authentication token must be exactly 7 characters')
		.regex(/^[A-Z0-9!@#$%^&*()_+\-=\[\]{}|;:,.<>?]+$/, 'Token contains invalid characters'),
});

type AuthTokenFormData = z.infer<typeof authTokenSchema>;

export default function TrainerAuthForm({ gym }: TrainerAuthFormProps) {
	const [isLoading, setIsLoading] = useState(false);
	const [error, setError] = useState<string | null>(null);
	const [isContactExpanded, setIsContactExpanded] = useState(false);
	const [pinValue, setPinValue] = useState('');
	const router = useRouter();
	const { update } = useSession();

	const form = useForm<AuthTokenFormData>({
		resolver: zodResolver(authTokenSchema),
		defaultValues: {
			authToken: '',
		},
	});

	const onSubmit = async (data: AuthTokenFormData) => {
		setIsLoading(true);
		setError(null);

		try {
			const result = await verifyTrainerToken({
				gymId: gym.id,
				authToken: data.authToken,
			});

			if (result.success) {
				// Update session with gym information
				const gymInfo: GymInfo = {
					id: gym.id,
					gym_name: gym.name,
				};

				const sessionUpdateResult = await updateSessionWithGym(gymInfo, update);
				
				if (sessionUpdateResult.success) {
					// Redirect to trainer dashboard on success
					router.push('/dashboard/trainer');
				} else {
					setError('Failed to update session. Please try again.');
				}
			} else {
				setError(result.message);
			}
		} catch (_err) {
			setError('An unexpected error occurred. Please try again.');
		} finally {
			setIsLoading(false);
		}
	};

	const handlePinChange = (value: string) => {
		setPinValue(value);
		form.setValue('authToken', value);
		form.clearErrors('authToken');
	};

	const handlePinComplete = (value: string) => {
		form.setValue('authToken', value);
		form.trigger('authToken');
	};

	return (
		<div className="space-y-6">
			<div className="space-y-4">
				<div className="flex items-center gap-3">
					<div className="w-6 h-6 rounded-full bg-gradient-to-r from-blue-400 to-indigo-400 flex items-center justify-center">
						<svg
							className="h-3 w-3 text-white"
							fill="none"
							stroke="currentColor"
							viewBox="0 0 24 24"
							aria-hidden="true"
						>
							<path
								strokeLinecap="round"
								strokeLinejoin="round"
								strokeWidth={2}
								d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
							/>
						</svg>
					</div>
					<h2 className="text-lg font-semibold text-slate-800">
						Enter Authentication Token
					</h2>
				</div>
				<p className="text-sm text-slate-600">
					Please enter the 7-character authentication token provided by your gym administrator to complete your onboarding.
				</p>
			</div>

			<Form {...form}>
				<form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
					<FormField
						control={form.control}
						name="authToken"
						render={({ field: _field }) => (
							<FormItem>
								<FormLabel className="text-sm font-medium text-slate-700 block text-center mb-4">
									Authentication Token
								</FormLabel>
								<FormControl>
									<div className="flex justify-center">
										<PinInput
											length={7}
											value={pinValue}
											onChange={handlePinChange}
											onComplete={handlePinComplete}
											disabled={isLoading}
											regexCriteria={/^[A-Z0-9!@#$%^&*()_+\-=\[\]{}|;:,.<>?]$/}
										/>
									</div>
								</FormControl>
								<FormMessage className="text-center" />
							</FormItem>
						)}
					/>

					{error && (
						<div className="p-3 bg-red-50 border border-red-200 rounded-lg">
							<p className="text-sm text-red-600 text-center">{error}</p>
						</div>
					)}

					<Button
						type="submit"
						disabled={isLoading || pinValue.length !== 7}
						className="w-full h-11 bg-gradient-to-r from-blue-500 to-indigo-500 hover:from-blue-600 hover:to-indigo-600 text-white disabled:opacity-50 disabled:cursor-not-allowed"
					>
						{isLoading ? (
							<>
								<svg
									className="animate-spin -ml-1 mr-2 h-4 w-4 text-white"
									xmlns="http://www.w3.org/2000/svg"
									fill="none"
									viewBox="0 0 24 24"
									aria-hidden="true"
								>
									<circle
										className="opacity-25"
										cx="12"
										cy="12"
										r="10"
										stroke="currentColor"
										strokeWidth="4"
									/>
									<path
										className="opacity-75"
										fill="currentColor"
										d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
									/>
								</svg>
								Verifying...
							</>
						) : (
							'Join Gym as Trainer'
						)}
					</Button>
				</form>
			</Form>

			{/* Contact Information Section - Collapsible */}
			{(gym.phone || gym.email) && (
				<Card className="border-orange-200 bg-gradient-to-br from-orange-50/50 to-amber-50/30">
					<CardContent className="pt-6">
						<button
							type="button"
							onClick={() => setIsContactExpanded(!isContactExpanded)}
							className="w-full flex items-center justify-between text-left hover:bg-orange-100/50 rounded-lg p-3 -m-3 transition-colors"
						>
							<div className="flex items-center gap-3">
								<div className="w-6 h-6 rounded-full bg-gradient-to-r from-orange-400 to-amber-400 flex items-center justify-center">
									<MessageCircle className="h-3 w-3 text-white" />
								</div>
								<div>
									<h3 className="text-sm font-semibold text-slate-800">
										Need Help?
									</h3>
									<p className="text-xs text-slate-600">
										Don't have a token? Contact your gym administrator
									</p>
								</div>
							</div>
							<div className="flex items-center gap-2">
								<Badge variant="outline" className="bg-orange-50 text-orange-700 border-orange-200 text-xs">
									Contact
								</Badge>
								{isContactExpanded ? (
									<ChevronUp className="h-4 w-4 text-orange-600" />
								) : (
									<ChevronDown className="h-4 w-4 text-orange-600" />
								)}
							</div>
						</button>

						{/* Expandable Content */}
						{isContactExpanded && (
							<div className="mt-4 space-y-3 animate-in slide-in-from-top-2 duration-200">
								{gym.phone && (
									<div className="flex items-center gap-3 p-3 bg-white/50 rounded-lg border border-orange-100">
										<div className="w-8 h-8 rounded-full bg-orange-100 flex items-center justify-center">
											<Phone className="h-4 w-4 text-orange-600" />
										</div>
										<div className="flex-1">
											<p className="text-xs font-medium text-slate-700">Phone</p>
											<a 
												href={`tel:${gym.phone}`}
												className="text-sm text-orange-600 hover:text-orange-700 font-medium"
											>
												{gym.phone}
											</a>
										</div>
									</div>
								)}
								
								{gym.email && (
									<div className="flex items-center gap-3 p-3 bg-white/50 rounded-lg border border-orange-100">
										<div className="w-8 h-8 rounded-full bg-orange-100 flex items-center justify-center">
											<Mail className="h-4 w-4 text-orange-600" />
										</div>
										<div className="flex-1">
											<p className="text-xs font-medium text-slate-700">Email</p>
											<a 
												href={`mailto:${gym.email}`}
												className="text-sm text-orange-600 hover:text-orange-700 font-medium"
											>
												{gym.email}
											</a>
										</div>
									</div>
								)}
							</div>
						)}
					</CardContent>
				</Card>
			)}
		</div>
	);
} 