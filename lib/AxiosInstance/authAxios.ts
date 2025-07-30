'use server';
import axios, { type AxiosInstance } from 'axios';

export const AuthReqConfig = async (): Promise<AxiosInstance> => {
	const authAxios: AxiosInstance = await axios.create({
		baseURL: `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/v1/auth/`,
		headers: {
			'Content-Type': 'application/json',
		},
	});

	return authAxios;
}; 