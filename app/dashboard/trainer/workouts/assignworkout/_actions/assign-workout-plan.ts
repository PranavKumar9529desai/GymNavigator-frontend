'use server';

import { TrainerReqConfig } from '@/lib/AxiosInstance/trainerAxios';

export async function assignWorkoutPlan(userId: string, workoutPlanId: number) {
	const trainerAxios = await TrainerReqConfig();

	try {
		const response = await trainerAxios.post('/workouts/assign', {
			userId,
			workoutPlanId,
		});

		if (response.data.msg === 'success') {
			return {
				success: true,
			};
		}

		throw new Error(response.data.error || 'Failed to assign workout plan');
	} catch (error) {
		console.error('Error assigning workout plan:', error);
		throw error;
	}
}
