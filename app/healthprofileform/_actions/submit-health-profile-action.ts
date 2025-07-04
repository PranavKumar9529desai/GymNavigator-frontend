'use server';

import { revalidatePath } from 'next/cache';
import { ClientReqConfig } from '@/lib/AxiosInstance/clientAxios';
export const submitHealthProfileAction = async (data: unknown) => {
	try {
		const userAxios = await ClientReqConfig();
		const response = await userAxios.post('/health-profile', data);

		if (response.status === 201) {
			revalidatePath('/dashboard'); // Revalidate dashboard after profile update
			return { success: true, data: response.data };
		} else {
			return {
				success: false,
				error: response.data.message || 'Failed to save health profile.',
			};
		}
	} catch (error: unknown) {
		console.error('Error submitting health profile:', error);
		return {
			success: false,
			error: 'An unexpected error occurred. Please try again.',
		};
	}
};
