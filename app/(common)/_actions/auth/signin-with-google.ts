'use server';

import {
  type ApiResult,
  type SigninResponseType,
  authClient,
} from '@/lib/AxiosInstance/Signin/sign-in-client';

export default async function SigninGoogleSA(
  email: string,
): Promise<ApiResult<SigninResponseType>> {
  console.log('Signing in with Google:', email);
  return authClient.signInWithGoogle(email);
}
