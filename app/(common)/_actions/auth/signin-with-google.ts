'use server';
import type { AxiosInstance, AxiosResponse } from 'axios';
import { SigninReqConfig } from '../../../../lib/AxiosInstance/sign-in-axios';

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

export default async function SigninGoogleSA(
  email: string,
): Promise<SigninGoogleResult> {
  try {
    console.log('siginin with the gooogle is called ', email);
    const axiosInstance: AxiosInstance = await SigninReqConfig();
    const response = await axiosInstance.get(`/google?email=${encodeURIComponent(email)}`);
    console.log('response is from the signin with google server action', response);
    
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
  } catch (error: any) {
    console.error('Error signing up with Google:', error);
    
    // Handle axios error responses
    const errorResponse = error.response?.data;
    
    return {
      success: false,
      error: {
        code: errorResponse?.error || 'GOOGLE_AUTH_ERROR',
        message: errorResponse?.message || 'Failed to authenticate with Google',
      },
    };
  }
}
