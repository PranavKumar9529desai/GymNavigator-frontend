'use server';
import { TrainerReqConfig } from '@/lib/AxiosInstance/trainerAxios';

export interface AssignedUser {
	id: string;
	name: string;
	email: string;
	gender: string;
	dietaryPreference: string;
	membershipStatus: 'active' | 'inactive';
	activeWorkoutPlanId: number | null;
	activeWorkoutPlanName: string | null;
	hasActiveWorkoutPlan: boolean;
}

export const getUsersAssignedToTrainer = async (): Promise<AssignedUser[]> => {
	const trainerAxios = await TrainerReqConfig();
	try {
		const response = await trainerAxios.get('/client/assignedusers');
		console.log(
			'response.data from the getUsersAssignedToTrainer',
			response.data,
		); // Add this line
		if (response.data.msg === 'success' && Array.isArray(response.data.users)) {
			return response.data.users;
		}
		console.log('response.data from the getUsersAssignedToTrainer', response.data);
		return [];
	} catch (error) {
		console.error('Error fetching assigned users:', error);
		return [];
	}
};
