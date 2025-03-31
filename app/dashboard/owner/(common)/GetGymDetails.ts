'use server';
import { OwnerReqConfig } from '@/lib/AxiosInstance/ownerAxios';
import type { AxiosResponse } from 'axios';

export interface sessionType {
	role: string;
	user: {
		name: string;
		email: string;
		picture?: string | null;
	};
}

export default async function FetchGymDetailsSA() {
	interface responseType {
		msg: string;
		gym: {
			gym_name: string;
			gym_logo: string;
			address: string;
			phone_number: string;
			Email: string;
			gymauthtoken: string;
		};
	}

	try {
		// Initialize Axios instance with Authorization header
		const ownerAxios = await OwnerReqConfig();
		const response: AxiosResponse<responseType> =
			await ownerAxios.get('/gym/gymdetails');

		console.log('Gym details fetched successfully:', response.data.gym);
		return response.data.gym;
	} catch (err: unknown) {
		console.error('Error fetching gym details:', err);
		return null; // Return null or handle the error as needed
	}
}
