'use server';

import { AuthReqConfig } from '@/lib/AxiosInstance/authAxios';
import { AxiosError } from 'axios';
import type {
	ApiResult,
	LoginResponseData,
	SignInRequest,
} from '@/lib/api/types';

export async function signInWithCredentials(
	credentials: SignInRequest,
): Promise<ApiResult<LoginResponseData>> {
	console.log('🚀 [signInWithCredentials] Called with:', {
		email: credentials.email,
		password: credentials.password ? '***' : 'undefined',
	});

	try {
		const axiosInstance = await AuthReqConfig();
		console.log('📡 [signInWithCredentials] Making request to /login/login');

		const response = await axiosInstance.post('/login/login', credentials);
		console.log('📥 [signInWithCredentials] Response received:', {
			status: response.status,
			success: response.data?.success,
			message: response.data?.message,
			hasData: !!response.data?.data,
		});

		// Handle successful response
		if (response.data.success) {
			console.log('✅ [signInWithCredentials] Login successful');
			return {
				success: true,
				data: response.data.data,
			};
		}

		// Handle error response from API
		console.log(
			'❌ [signInWithCredentials] API returned error:',
			response.data,
		);
		return {
			success: false,
			error: {
				code: response.data.error || 'API_ERROR',
				message: response.data.message || 'Failed to sign in',
			},
		};
	} catch (error: unknown) {
		// Handle network or unexpected errors
		console.error('💥 [signInWithCredentials] Error:', error);

		let errorMessage = 'An error occurred while signing in';

		if (error instanceof AxiosError) {
			console.log('📡 [signInWithCredentials] Axios error details:', {
				status: error.response?.status,
				statusText: error.response?.statusText,
				data: error.response?.data,
				message: error.message,
			});

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
