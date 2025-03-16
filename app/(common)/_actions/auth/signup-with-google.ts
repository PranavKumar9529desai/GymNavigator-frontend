'use server';

import {
  type ApiResult,
  type GoogleSignupResponseType,
  type RoleType,
  signupClient,
} from '@/lib/AxiosInstance/Signup/sign-up-client';

export default async function SignupWithGoogle(
  name: string,
  email: string,
  role?: RoleType, // Make role optional
): Promise<ApiResult<GoogleSignupResponseType>> {
  console.log('Signing up with Google:', { name, email, role });
  return signupClient.signupWithGoogle(name, email, role as RoleType);
}
