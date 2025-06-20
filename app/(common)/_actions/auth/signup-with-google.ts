'use server';

import {
	type ApiResult,
	type SigninResponseType,
	authClient,
	Rolestype,
} from '@/lib/AxiosInstance/Signin/sign-in-client';

export default async function SignupWithGoogle(
	email: string,
	name: string,
	role: Rolestype,
): Promise<ApiResult<SigninResponseType>> {
	console.log('Signing in with Google:', email);
	return authClient.signUpWithGoogle(email, name, role);
}
