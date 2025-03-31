// FILE: trainerAxios.ts

'use server';
import { auth } from '@/app/(auth)/auth';
import axios, { type AxiosInstance } from 'axios';

export const TrainerReqConfig = async (): Promise<AxiosInstance> => {
	const session = await auth();
	console.log('session information is this trainer axios', session);
	const trainerAxios: AxiosInstance = axios.create({
		baseURL: `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/v1/trainer`,
		headers: {
			Authorization: `${JSON.stringify(session)}`,
		},
	});

	return trainerAxios;
};
