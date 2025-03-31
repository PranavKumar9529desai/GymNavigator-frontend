'use server';
import { TrainerReqConfig } from '@/lib/AxiosInstance/trainerAxios';

export interface AssignedUser {
	id: string;
	name: string;
	email: string;
	gender: string;
	goal: string;
	membershipStatus: string;
	activeWorkoutPlanId: number | null;
	activeWorkoutPlanName: string | null;
	hasActiveWorkoutPlan: boolean;
	HealthProfile?: {
		weight: number;
		height: number;
		goal: string | null;
		gender: string;
	} | null;
}

export const getUsersAssignedToTrainer = async () => {
	const trainerAxios = await TrainerReqConfig();
	try {
		const response = await trainerAxios.get('/client/assignedusers');
		const data = response.data;

		if (data.msg === 'success') {
			// console.log("this are the assigned users", data.users);
			return data.users as AssignedUser[];
		}
		return [];
	} catch (error) {
		console.error('Error fetching assigned users:', error);
		return [];
	}
};
