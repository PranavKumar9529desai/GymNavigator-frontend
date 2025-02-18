'use server';
import axios, { type AxiosResponse } from 'axios';

export interface SignupWithGoogleReturnType {
  name: string;
  email: string;
  role: 'owner' | 'trainer' | 'client';
}

export default async function SignupWithGoogle(
  name: string,
  email: string,
  role: 'owner' | 'trainer' | 'client'
): Promise<SignupWithGoogleReturnType> {
  try {
    const response: AxiosResponse<{
      msg: string;
      user: {
        name: string;
        email: string;
        role: 'owner' | 'trainer' | 'client';
      };
    }> = await axios.post(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/v1/signup/google/${role}`, {
      name,
      email,
    });
    console.log('response from the signup with google', response.data.user);
    return response.data.user;
  } catch (error) {
    console.error('Error in the signup with google', error);
    return null as unknown as SignupWithGoogleReturnType;
  }
}
