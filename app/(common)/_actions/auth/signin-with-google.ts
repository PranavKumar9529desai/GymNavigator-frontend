'use server';
import { SigninReqConfig } from '@/lib/AxiosInstance/sign-in-axios';
import type { AxiosError, AxiosInstance, AxiosResponse } from 'axios';

export interface BaseUser {
  id: string;
  name: string;
  email: string;
  role: string;
}

export interface ApiResponse<T> {
  success: boolean;
  msg: string;
  data: T;
  error?: string;
}

export interface SigninGoogleResponseType {
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

export interface SigninGoogleResult {
  success: boolean;
  data?: SigninGoogleResponseType;
  error?: {
    code: string;
    message: string;
  };
}

export default async function SigninGoogleSA(email: string): Promise<SigninGoogleResult> {
  try {
    console.log('siginin with the gooogle is called ', email);
    const axiosInstance: AxiosInstance = await SigninReqConfig();
    const response = await axiosInstance.get(`/google?email=${encodeURIComponent(email)}`);

    const responseData = response.data;

    if (!responseData || !responseData.success) {
      return {
        success: false,
        error: {
          code: responseData?.error || 'UNKNOWN_ERROR',
          message: responseData?.message || 'Failed to authenticate with Google',
        },
      };
    }

    return {
      success: true,
      data: responseData.data as SigninGoogleResponseType,
    };
  } catch (error: unknown) {
    console.error('Error signing up with Google:', error);

    // Create a type guard for axios error
    const isAxiosError = (err: unknown): err is AxiosError => {
      return typeof err === 'object' && err !== null && 'response' in err;
    };

    // Handle axios error responses with proper type checking
    const errorResponse = isAxiosError(error)
      ? (error.response?.data as { error?: string; message?: string })
      : undefined;

    return {
      success: false,
      error: {
        code: errorResponse?.error || 'GOOGLE_AUTH_ERROR',
        message: errorResponse?.message || 'Failed to authenticate with Google',
      },
    };
  }
}
