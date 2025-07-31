'use client';

import { Button } from '@/components/ui/button';
import { PinInput } from '@/components/ui/pin-input';
import { useToast } from '@/hooks/use-toast';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import type { gym } from '../../_components/SelectGym';
import { verifyGymToken } from '../_actions/verify-gym-token';

interface AuthTokenFormProps {
	gym: gym;
}

export function AuthTokenForm({ gym }: AuthTokenFormProps) {
	const [authToken, setAuthToken] = useState('');
	const [isLoading, setIsLoading] = useState(false);
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
				toast({
					title: 'Success',
					description: 'Authentication successful!',
				});
				// Redirect to the dashboard or another page
				router.push('/dashboard');
			} else {
				toast({
					title: 'Verification Failed',
					description: result.message || 'Invalid authentication token',
					variant: 'destructive',
				});
			}
		} catch (_error: unknown) {
			toast({
				title: 'Error',
				description: 'An error occurred during verification',
				variant: 'destructive',
			});
		} finally {
			setIsLoading(false);
		}
	};

	const handlePinChange = (value: string) => {
		setAuthToken(value);
	};

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
					{isLoading ? 'Verifying...' : 'Verify Token'}
				</Button>
			</form>
		</div>
	);
}
