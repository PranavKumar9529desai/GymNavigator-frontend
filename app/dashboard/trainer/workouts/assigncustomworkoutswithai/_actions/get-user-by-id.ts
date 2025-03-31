'use server';

import { TrainerReqConfig } from '@/lib/AxiosInstance/trainerAxios';

// Define response types for strong type safety
export interface HealthProfile {
	weight: number | null;
	height: number | null;
	goal: string | null;
	gender: string | null;
	age: number | null;
}

export interface WorkoutPlan {
	id: number;
	name: string;
	description: string | null;
}

export interface UserData {
	id: string;
	name: string;
	email: string;
	healthProfile: HealthProfile | null;
	activeWorkoutPlan: WorkoutPlan | null;
	hasActiveWorkoutPlan: boolean;
}

export async function getUserById(userId: string) {
	const trainerAxios = await TrainerReqConfig();

	try {
		const response = await trainerAxios.get(`/client/user/${userId}`);
		const data = response.data;

		if (data.msg === 'success' && data.user) {
			return {
				success: true,
				data: data.user as UserData,
			};
		}

		return {
			success: false,
			error: data.msg || 'Failed to fetch user data',
		};
	} catch (error) {
		console.error('Error fetching user by ID:', error);
		return {
			success: false,
			error: 'Failed to fetch user data',
		};
	}
}
