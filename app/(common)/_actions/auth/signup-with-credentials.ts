'use server';

import { 
  type ApiResult, 
  type SignupResponseType, 
  signupClient 
} from '@/lib/AxiosInstance/Signup/sign-up-client';

export default async function SignupSA(
  role: string,
  name: string,
  email: string,
  password: string,
): Promise<ApiResult<SignupResponseType>> {
  console.log('Signing up user with credentials:', { role, name, email });
  return signupClient.signupWithCredentials(role, name, email, password);
}
