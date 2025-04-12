'use server';

import { TrainerReqConfig } from '@/lib/AxiosInstance/trainerAxios';

export async function assignWorkoutPlanToUser(
	userId: string,
	workoutPlanId: number,
) {
	const trainerAxios = await TrainerReqConfig();

	try {
		const response = await trainerAxios.post('/workouts/assignworkoutplan', {
			userId: Number(userId),
			workoutPlanId,
		});

		if (response.data.msg === 'Workout plan updated successfully' || 
			response.data.msg === 'Workout plan assigned successfully') {
			return {
				success: true,
				message: response.data.msg,
				previousPlan: response.data.previousPlan,
				newPlan: response.data.newPlan
			};
		}

		return {
			success: false,
			message: response.data.msg || 'Failed to assign workout plan',
			error: response.data.error
		};
	} catch (error: any) {
		console.error('Error assigning workout plan:', error);
		
		if (error.response) {
			const message = error.response.data?.msg || 'Failed to assign workout plan';
			throw new Error(message);
		}
		
		throw error;
	}
}
