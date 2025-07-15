'use server';
import { TrainerReqConfig } from '@/lib/AxiosInstance/trainerAxios';

export interface AssignedUser {
	id: string;
	name: string;
	email: string;
	membershipStatus: string;
	HealthProfile?: {
		weight: number;
		height: number;
		goal: string | null;
		gender: string;
		dietaryPreference?: string;
	} | null;
	computedHealthMetrics?: {
		bmi: number | null;
		bmr: number | null;
		tdee: number | null;
	} | null;
	dietPlanId?: number | null;
	dietPlanName?: string | null;
	dietPlanCompliance?: number;
	userDietPlanId?: number | null;
}

interface ApiUserResponse {
	id: string;
	name: string;
	email: string;
	HealthProfile?: {
		weight: number;
		height: number;
		goal: string | null;
		gender: string;
		dietaryPreference?: string;
	} | null;
	computedHealthMetrics?: {
		bmi: number | null;
		bmr: number | null;
		tdee: number | null;
	} | null;
	dietPlanId?: number | null;
	dietPlanName?: string | null;
	dietPlanCompliance?: number;
	userDietPlanId?: number | null;
}

export const getUsersAssignedToTrainer = async (): Promise<AssignedUser[]> => {
	const trainerAxios = await TrainerReqConfig();
	try {
		console.log('getUsersAssignedToTrainer is called');
		const response = await trainerAxios.get('/client/dietassignedusers');
		if (response.data.msg === 'success') {
			console.log('response.data.users', response.data.users);
			// Transform the data to ensure all fields are present even if null
			console.log('user id of the user is ', response.data.users[0]?.id);
			return response.data.users.map((user: ApiUserResponse) => ({
				id: user.id,
				name: user.name,
				email: user.email,
				membershipStatus: 'active',
				HealthProfile: user.HealthProfile || null,
				computedHealthMetrics: user.computedHealthMetrics || { bmi: null, bmr: null, tdee: null },
				dietPlanId: user.dietPlanId || null,
				dietPlanName: user.dietPlanName || null,
				dietPlanCompliance: user.dietPlanCompliance || 0,
				userDietPlanId: user.userDietPlanId || null,
			}));
		}
		return [];
	} catch (error) {
		console.error('Error fetching assigned users with diet plans:', error);
		return [];
	}
};
