'use server';

import { ClientReqConfig } from '@/lib/AxiosInstance/clientAxios';
import { AxiosError } from 'axios';

// Types for the response
interface IsWorkoutAndDietAssignedResponse {
	diet_assigned: boolean;
	workout_assigned: boolean;
}

interface ApiResult<T> {
	success: boolean;
	data?: T;
	error?: {
		code: string;
		message: string;
	};
}

export async function getIsWorkoutAndDietAssignedStatus(): Promise<
	ApiResult<IsWorkoutAndDietAssignedResponse>
> {
	try {
		const axiosInstance = await ClientReqConfig();
		const response = await axiosInstance.get('/gym/isworkoutanddietassigned');

		// Handle successful response
		if (response.data.success) {
			return {
				success: true,
				data: response.data.data,
			};
		}

		// Handle error response from API
		return {
			success: false,
			error: {
				code: 'API_ERROR',
				message: response.data.error || 'Failed to get assignment status',
			},
		};
		// @ts-ignore
	} catch (error: unknown) {
		// Handle network or unexpected errors
		console.error('Error checking workout and diet assignments:', error);

		let errorMessage = 'An error occurred while fetching assignment status';

		if (error instanceof AxiosError) {
			if (error.response) {
				// The request was made and the server responded with a status code
				// that falls out of the range of 2xx
				errorMessage = error.response.data?.error || error.message;
			} else if (error.request) {
				// The request was made but no response was received
				errorMessage = 'No response received from server.';
			} else {
				// Something happened in setting up the request that triggered an Error
				errorMessage = error.message;
			}
		} else if (error instanceof Error) {
			errorMessage = error.message;
		}

		return {
			success: false,
			error: {
				code: 'REQUEST_FAILED',
				message: errorMessage,
			},
		};
	}
}
