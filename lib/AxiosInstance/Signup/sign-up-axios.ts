'use server';
import axios, { type AxiosInstance } from 'axios';

export const SignupReqConfig = async (): Promise<AxiosInstance> => {
	const signupAxios: AxiosInstance = await axios.create({
		baseURL: `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/v1/signup`,
		headers: {
			'Content-Type': 'application/json',
		},
	});

	return signupAxios;
};
