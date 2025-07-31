'use client';

import type { gym } from '@/app/(common)/selectgym/_components/SelectGym';
import { Button } from '@/components/ui/button';
import { PinInput } from '@/components/ui/pin-input';
import { useToast } from '@/hooks/use-toast';
import { CheckCircle2, Loader2 } from 'lucide-react';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { verifyGymToken } from '../_actions/verify-gym-token';

interface AuthTokenFormProps {
	gym: gym;
}

export function AuthTokenForm({ gym }: AuthTokenFormProps) {
	const [authToken, setAuthToken] = useState('');
	const [isLoading, setIsLoading] = useState(false);
	const [isRedirecting, setIsRedirecting] = useState(false);
	const router = useRouter();
	const { toast } = useToast();

	const handleSubmit = async (e: React.FormEvent) => {
		e.preventDefault();

		if (!authToken.trim() || authToken.length !== 7) {
			toast({
				title: 'Error',
				description: 'Please enter a valid 7-character authentication token',
				variant: 'destructive',
			});
			return;
		}

		setIsLoading(true);
		try {
			const result = await verifyGymToken(gym, authToken);

			if (result.success) {
				setIsRedirecting(true);
				toast({
					title: 'Success',
					description: 'Authentication successful!',
				});

				// Add a slight delay before redirect to allow session update to complete
				setTimeout(() => {
					router.push('/dashboard');
				}, 2000);
			} else {
				toast({
					title: 'Verification Failed',
					description: result.message || 'Invalid authentication token',
					variant: 'destructive',
				});
			}
		} catch (error: unknown) {
			console.error('Error during verification:', error);
			toast({
				title: 'Error',
				description:
					error instanceof Error
						? error.message
						: 'An error occurred during verification',
				variant: 'destructive',
			});
		} finally {
			if (!isRedirecting) {
				setIsLoading(false);
			}
		}
	};

	const handlePinChange = (value: string) => {
		setAuthToken(value);
	};

	if (isRedirecting) {
		return (
			<div className="w-full max-w-md mx-auto bg-white rounded-xl shadow-lg p-8 text-center">
				<div className="flex flex-col items-center gap-6">
					<div className="bg-green-100 p-4 rounded-full">
						<CheckCircle2 className="h-12 w-12 text-green-600" />
					</div>

					<div className="space-y-2">
						<h2 className="text-xl font-semibold text-gray-900">
							Authentication Successful!
						</h2>
						<p className="text-gray-500">Redirecting to your dashboard...</p>
					</div>

					<div className="flex items-center justify-center w-full pt-4">
						<Loader2 className="h-6 w-6 animate-spin text-blue-600" />
						<span className="ml-2 text-sm text-gray-500">
							Setting up your session...
						</span>
					</div>
				</div>
			</div>
		);
	}

	return (
		<div className="w-full max-w-md mx-auto bg-white rounded-xl shadow-lg p-8">
			<div className="flex flex-col items-center mb-6">
				<div className="relative w-24 h-24 mb-4 rounded-lg overflow-hidden">
					<Image src={gym.img} alt={gym.name} fill className="object-cover" />
				</div>
				<h2 className="text-xl font-bold text-gray-900">{gym.name}</h2>
				<p className="text-sm text-gray-500 mt-1 text-center">
					Enter the 7-character authentication token
				</p>
			</div>

			<form onSubmit={handleSubmit} className="space-y-6">
				<div className="space-y-4">
					<label
						htmlFor="authToken"
						className="block text-sm font-medium text-gray-700 text-center"
					>
						Authentication Token
					</label>
					<div className="flex justify-center">
						<PinInput
							length={7}
							value={authToken}
							onChange={handlePinChange}
							disabled={isLoading}
							regexCriteria={/^[A-Z0-9!@#$%^&*()_+\-=\[\]{}|;:,.<>?]$/}
						/>
					</div>
					<p className="text-xs text-gray-500 text-center">
						Enter the 7-character token provided by your gym
					</p>
				</div>

				<Button
					type="submit"
					className="w-full py-6 text-lg"
					disabled={isLoading || authToken.length !== 7}
				>
					{isLoading ? (
						<>
							<Loader2 className="mr-2 h-4 w-4 animate-spin" />
							Verifying...
						</>
					) : (
						'Verify Token'
					)}
				</Button>
			</form>
		</div>
	);
}
