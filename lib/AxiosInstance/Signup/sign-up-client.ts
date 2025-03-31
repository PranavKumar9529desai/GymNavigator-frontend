import { SignupReqConfig } from './sign-up-axios';

// Define the standard API response format from backend
export interface ApiResponse<T = unknown> {
	success: boolean;
	message: string;
	data?: T;
	error?: string;
}

// Define the standardized result format for frontend
export interface ApiResult<T> {
	success: boolean;
	data?: T;
	error?: {
		code: string;
		message: string;
	};
}

// Define signup-specific types
export type RoleType = 'owner' | 'trainer' | 'client' | 'sales';

export interface SignupResponseType {
	id: string;
	name: string;
	email: string;
	role: string;
}

export interface GoogleSignupResponseType {
	name: string;
	email: string;
	role: RoleType;
}

/**
 * Signup API client with typed methods for all registration-related operations
 */
export const signupClient = {
	/**
	 * Sign up with email, password and role
	 */
	signupWithCredentials: async (
		role: string,
		name: string,
		email: string,
		password: string,
	): Promise<ApiResult<SignupResponseType>> => {
		try {
			const axiosInstance = await SignupReqConfig();
			const response = await axiosInstance.post('/createaccount', {
				name,
				email,
				password,
				role: role.toLowerCase(),
			});

			const apiResponse = response.data as ApiResponse<SignupResponseType>;

			if (!apiResponse.success) {
				return {
					success: false,
					error: {
						code: apiResponse.error || 'UNKNOWN_ERROR',
						message: apiResponse.message || 'Unknown error occurred',
					},
				};
			}

			// Extract the user data from the API response wrapper
			const userData = apiResponse.data;

			if (!userData) {
				return {
					success: false,
					error: {
						code: 'NO_DATA',
						message: 'No user data received',
					},
				};
			}

			return {
				success: true,
				data: {
					id: String(userData.id),
					name: userData.name,
					email: userData.email,
					role: role.toLowerCase(),
				},
			};
		} catch (error: unknown) {
			// The error is already formatted by the axios interceptor
			return error as ApiResult<never>;
		}
	},

	/**
	 * Sign up with Google
	 */
	signupWithGoogle: async (
		name: string,
		email: string,
		role: RoleType,
	): Promise<ApiResult<GoogleSignupResponseType>> => {
		try {
			const axiosInstance = await SignupReqConfig();
			const response = await axiosInstance.post(`/google/${role}`, {
				name,
				email,
			});

			const apiResponse = response.data;

			// Handle the different response format from the Google signup endpoint
			if (!apiResponse.user) {
				return {
					success: false,
					error: {
						code: 'USER_NOT_CREATED',
						message: apiResponse.msg || 'Failed to create user',
					},
				};
			}

			return {
				success: true,
				data: apiResponse.user,
			};
		} catch (error: unknown) {
			// The error is already formatted by the axios interceptor
			return error as ApiResult<never>;
		}
	},

	/**
	 * Check if user exists
	 */
	checkUserExists: async (email: string): Promise<ApiResult<boolean>> => {
		try {
			const axiosInstance = await SignupReqConfig();
			const response = await axiosInstance.post('/isexists', {
				email,
			});

			const apiResponse = response.data;

			// Handle unsuccessful responses properly
			if (!apiResponse.success) {
				return {
					success: false,
					error: {
						code: apiResponse.error || 'USER_CHECK_FAILED',
						message: apiResponse.message || 'Failed to check user existence',
					},
				};
			}

			return {
				success: true,
				data: apiResponse.exists,
			};
		} catch (error: unknown) {
			// The error is already formatted by the axios interceptor
			return error as ApiResult<never>;
		}
	},
};
