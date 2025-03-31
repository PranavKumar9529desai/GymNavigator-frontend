'use server';

import {
	type ApiResult,
	type SigninResponseType,
	authClient,
} from '@/lib/AxiosInstance/Signin/sign-in-client';

export default async function SigninSA(
	email: string,
	password: string,
): Promise<ApiResult<SigninResponseType>> {
	return authClient.signInWithCredentials(email, password);
}
