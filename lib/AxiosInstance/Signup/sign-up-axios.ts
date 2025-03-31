import axios, { type AxiosInstance } from 'axios';

/**
 * Axios instance for unauthenticated requests related to signup/registration
 *
 * Available endpoints:
 * - POST /createaccount - Create a new user (owner, trainer, client, sales)
 * - POST /isexists - Check if a user exists by email
 * - POST /google/:role - Google signup with specific role
 *
 * @returns Configured AxiosInstance
 */
export const SignupReqConfig = async (): Promise<AxiosInstance> => {
	const SignupAxios: AxiosInstance = await axios.create({
		baseURL: `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/v1/signup`,
		headers: {
			'Content-Type': 'application/json',
			Accept: 'application/json',
		},
		timeout: 10000, // 10 second timeout
	});

	// Enhanced response interceptor with better error handling
	SignupAxios.interceptors.response.use(
		(response) => response,
		(error) => {
			console.error('API request failed:', error);

			// Format the error with consistent structure
			const errorResponse = error.response?.data;
			const formattedError = {
				success: false,
				error: {
					code: errorResponse?.error || 'SERVER_ERROR',
					message:
						errorResponse?.message || error.message || 'Unknown error occurred',
				},
			};

			return Promise.reject(formattedError);
		},
	);

	return SignupAxios;
};
