'use server';

import {
	type ApiResult,
	type GoogleSignupResponseType,
	signupClient,
} from '@/lib/AxiosInstance/Signup/sign-up-client';
import type { Rolestype } from '@/types/next-auth';

export default async function SignupWithGoogle(
	email: string,
	name: string,
	role: Rolestype,
): Promise<ApiResult<GoogleSignupResponseType>> {
	console.log('Signing in with Google:', email);
	return signupClient.signupWithGoogle(name, email, role);
}
