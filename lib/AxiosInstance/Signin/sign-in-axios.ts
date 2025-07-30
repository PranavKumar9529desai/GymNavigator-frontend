'use server';
import axios, { type AxiosInstance } from 'axios';

export const SigninReqConfig = async (): Promise<AxiosInstance> => {
	const signinAxios: AxiosInstance = await axios.create({
		baseURL: `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/v1/login`,
		headers: {
			'Content-Type': 'application/json',
		},
	});

	return signinAxios;
};
