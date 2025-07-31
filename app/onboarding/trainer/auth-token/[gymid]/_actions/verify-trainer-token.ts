'use server';

import { TrainerReqConfig } from '@/lib/AxiosInstance/trainerAxios';

interface VerifyTrainerTokenRequest {
	gymId: string;
	authToken: string;
}

interface VerifyTrainerTokenResponse {
	success: boolean;
	message: string;
	trainerData?: {
		id: string;
		name: string;
		email: string;
		role: string;
		gymId: string;
	};
}

export async function verifyTrainerToken(
	request: VerifyTrainerTokenRequest,
): Promise<VerifyTrainerTokenResponse> {
	try {
		const trainerAxios = await TrainerReqConfig();

		const response = await trainerAxios.post('/auth/verify-token', {
			gymId: request.gymId,
			authToken: request.authToken,
		});

		const data = response.data;

		if (!response.data.success) {
			return {
				success: false,
				message: data.message || 'Failed to verify token',
			};
		}

		return {
			success: true,
			message: data.message,
			trainerData: data.trainerData,
		};
	} catch (error: unknown) {
		console.error('Error verifying trainer token:', error);
		const errorMessage = error && typeof error === 'object' && 'response' in error 
			? (error.response as { data?: { message?: string } })?.data?.message || 'Network error occurred'
			: 'Network error occurred';
		return {
			success: false,
			message: errorMessage,
		};
	}
} 