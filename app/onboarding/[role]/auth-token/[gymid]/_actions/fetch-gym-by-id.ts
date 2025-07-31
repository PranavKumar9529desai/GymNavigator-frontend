'use server';

import { TrainerReqConfig } from '@/lib/AxiosInstance/trainerAxios';
import { AxiosError } from 'axios';

interface Gym {
	id: string;
	name: string;
	img: string;
	phone?: string;
	email?: string;
}

export async function fetchGymById(gymId: string): Promise<Gym | null> {
	try {
		const trainerAxios = await TrainerReqConfig();

		const response = await trainerAxios.get(`/onboarding/gym/${gymId}`);
		console.log(" the response is fetchbyid", response.data)

		if (!response.data || !response.data.gym) {
			return null;
		}

		return response.data.gym;
	} catch (error) {
		console.error('Error fetching gym:', error);
		return null;
	}
} 