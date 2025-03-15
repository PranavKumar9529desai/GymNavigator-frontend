'use server';

import { SigninReqConfig } from '@/lib/AxiosInstance/sign-in-axios';
import type { AxiosError } from 'axios';

export interface BaseUser {
  id: string;
  name: string;
  email: string;
  role: string;
}

export interface ApiResponse<T> {
  success: boolean;
  message: string;
  data: T;
  error?: string;
}

export type Rolestype = 'owner' | 'trainer' | 'client';

export interface SigninResponseType {
  token: string;
  user: {
    id: string;
    name: string;
    email: string;
    role: Rolestype;
    gym_id?: string | null;
    gym?: {
      id: number;
      name: string;
    } | null;
  };
}

export interface SigninResult {
  success: boolean;
  data?: SigninResponseType;
  error?: {
    code: string;
    message: string;
  };
}

export default async function SigninSA(email: string, password: string): Promise<SigninResult> {
  try {
    const axiosInstance = await SigninReqConfig();
    const response = await axiosInstance.get('/login', {
      params: {
        email,
        password,
      },
    });

    const responseData = response.data;

    if (!responseData || !responseData.success) {
      console.error('Login failed:', responseData?.message || 'Unknown error');
      return {
        success: false,
        error: {
          code: responseData?.error || 'UNKNOWN_ERROR',
          message: responseData?.message || 'An unknown error occurred',
        },
      };
    }

    // Extract the data object from the API response wrapper
    return {
      success: true,
      data: responseData.data as SigninResponseType,
    };
  } catch (error: unknown) {
    console.error('Error signing in:', error);

    // Handle axios error responses
    const axiosError = error as AxiosError<{ error?: string; message?: string }>;
    const errorResponse = axiosError.response?.data;

    return {
      success: false,
      error: {
        code: errorResponse?.error || 'SERVER_ERROR',
        message: errorResponse?.message || 'Failed to connect to authentication service',
      },
    };
  }
}
