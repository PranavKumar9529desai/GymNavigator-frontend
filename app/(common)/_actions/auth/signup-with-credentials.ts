'use server';
import type { AxiosResponse } from 'axios';
import axios from 'axios';
import { SignupReqConfig } from '../../../../lib/AxiosInstance/sign-up-axios';

export interface BaseUser {
  id: string;
  name: string;
  email: string;
  role: string;
}

export interface ApiResponse<T> {
  success: boolean;
  message: string; // Changed from 'msg' to 'message' to match backend
  data: T;
  error?: string;
}

export interface SignupResponseType {
  id: string;
  name: string;
  email: string;
  role: string;
}

export default async function SignupSA(
  role: string,
  name: string,
  email: string,
  password: string,
): Promise<SignupResponseType | null> {
  try {
    const axiosInstance = await SignupReqConfig();
    const response = await axiosInstance.post('/createaccount', {
      name,
      email,
      password,
      role: role.toLowerCase(),
    });

    const responseData = response.data;

    if (!responseData || !responseData.success) {
      console.error('Signup failed:', responseData?.message || 'Unknown error');
      return null;
    }

    // Extract the user data from the API response wrapper
    const userData = responseData.data;

    if (!userData) {
      throw new Error('No user data received');
    }

    // Return properly structured SignupResponseType
    return {
      id: String(userData.id),
      name: userData.name,
      email: userData.email,
      role: role.toLowerCase(),
    };
  } catch (error) {
    console.error('Error signing up:', error);
    return null;
  }
}
