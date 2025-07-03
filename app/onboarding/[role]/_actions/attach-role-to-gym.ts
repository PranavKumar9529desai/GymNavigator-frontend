'use server';

import { ClientReqConfig } from '@/lib/AxiosInstance/clientAxios';

interface AttachRoleToGymParams {
	gymname: string;
	gymid: string;
	hash: string;
	role?: string;
}

interface AttachRoleToGymResponse {
	success: boolean;
	message: string;
}

/**
 * Server action to attach a user/trainer to a gym based on QR code data
 */
export async function attachRoleToGym({
	gymname,
	gymid,
	hash,
	role,
}: AttachRoleToGymParams): Promise<AttachRoleToGymResponse> {
	try {
		let axiosInstance;
		let endpoint: string;

		// Determine which axios instance and endpoint to use based on role
		if (role === 'trainer') {
			// Import trainer axios configuration
			const { TrainerReqConfig } = await import('@/lib/AxiosInstance/trainerAxios');
			axiosInstance = await TrainerReqConfig();
			endpoint = '/attachtogym';
		} else {
			// Default to client configuration for 'client' role or when no role is specified
			axiosInstance = await ClientReqConfig();
			endpoint = '/gym/attachtogym';
		}

		// Make request to the attach to gym endpoint
		const response = await axiosInstance.post(endpoint, {
			gymname,
			gymid,
			hash,
		});

		const data = response.data;

		if (!data.success) {
			console.error('Failed to attach to gym:', data.error);
			return {
				success: false,
				message: data.error || 'Failed to attach to gym',
			};
		}

		return {
			success: true,
			message: data.message || 'Successfully attached to gym',
		};
	} catch (error) {
		console.error('Error attaching to gym:', error);
		return {
			success: false,
			message: 'Failed to connect to server',
		};
	}
}
