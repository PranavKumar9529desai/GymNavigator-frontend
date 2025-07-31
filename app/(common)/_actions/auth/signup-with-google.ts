'use server';

import { AuthReqConfig } from '@/lib/AxiosInstance/authAxios';
import { AxiosError } from 'axios';
import type {
	ApiResult,
	LoginResponseData,
	GoogleSignUpRequest,
} from '@/lib/api/types';

export async function signUpWithGoogle(
	userData: GoogleSignUpRequest,
	role: string,
): Promise<ApiResult<LoginResponseData>> {
	try {
		const axiosInstance = await AuthReqConfig();
		const response = await axiosInstance.post(
			`/signup/google/${role}`,
			userData,
		);

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
				message: response.data.error || 'Failed to sign up with Google',
			},
		};
	} catch (error: unknown) {
		// Handle network or unexpected errors
		console.error('Error signing up with Google:', error);

		let errorMessage = 'An error occurred while signing up with Google';

		if (error instanceof AxiosError) {
			if (error.response) {
				// The request was made and the server responded with a status code
				// that falls out of the range of 2xx
				const responseData = error.response.data;
				if (
					responseData &&
					typeof responseData === 'object' &&
					'message' in responseData
				) {
					// Use the specific error message from the backend
					errorMessage = responseData.message as string;
				} else {
					errorMessage = error.response.data?.error || error.message;
				}
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
