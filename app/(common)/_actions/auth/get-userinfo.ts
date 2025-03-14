'use server';

import { SigninReqConfig } from '@/lib/AxiosInstance/sign-in-axios';

// Define types to match the backend API response
type Role = 'owner' | 'trainer' | 'client';

interface ApiResponse<T> {
  success: boolean;
  message: string;
  data?: T;
  error?: string;
}

interface RoleData {
  role: Role;
}

export type GetUserEmailResponse =
  | { success: true; data: ApiResponse<RoleData> }
  | { success: false; error: string };

/**
 * Server action to check if a user email exists in the system
 * @param email The email address to check
 * @returns Response indicating whether the email exists and any associated role
 */
export async function getUserByEmail(email: string): Promise<GetUserEmailResponse> {
  try {
    const axiosInstance = await SigninReqConfig();
    console.log('Checking email existence for:', email);

    try {
      const response = await axiosInstance.get(`/getuserinfo?email=${encodeURIComponent(email)}`);
      console.log('User check response:', response.status, response.data);
      return {
        success: true,
        data: response.data,
      };
    } catch (error: unknown) {
      // Type guard for error with response property
      if (
        error &&
        typeof error === 'object' &&
        'response' in error &&
        error.response &&
        typeof error.response === 'object' &&
        'status' in error.response
      ) {
        // If 404, it means user doesn't exist (which is fine for registration)
        if (error.response.status === 404) {
          console.log('User not found (which is good for registration)');
          return {
            success: false,
            error: 'User not found',
          };
        }
      }
      throw error; // Re-throw for other errors
    }
  } catch (error: unknown) {
    console.error('Error checking user email:', error);

    // More detailed error logging with type guards
    if (
      error &&
      typeof error === 'object' &&
      'response' in error &&
      error.response &&
      typeof error.response === 'object'
    ) {
      // Define a more specific type for the response object
      const errorResponse = error.response as { data?: unknown; status?: number };
      console.error('Response error data:', errorResponse.data);
      console.error('Response status:', errorResponse.status);
    } else if (error && typeof error === 'object' && 'request' in error) {
      console.error('Request was made but no response received');
    } else if (
      error &&
      typeof error === 'object' &&
      'message' in error &&
      typeof error.message === 'string'
    ) {
      console.error('Error during request setup:', error.message);
    }

    return {
      success: false,
      error: 'Failed to check email existence',
    };
  }
}
