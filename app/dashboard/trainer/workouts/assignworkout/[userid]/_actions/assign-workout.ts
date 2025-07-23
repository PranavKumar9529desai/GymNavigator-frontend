'use server';

import { TrainerReqConfig } from '@/lib/AxiosInstance/trainerAxios';
import type { AxiosError } from 'axios';

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

		if (
			response.data.msg === 'Workout plan updated successfully' ||
			response.data.msg === 'Workout plan assigned successfully'
		) {
			console.log('Workout plan assignment successful');
			return {
				success: true,
				message: response.data.msg,
				previousPlan: response.data.previousPlan,
				newPlan: response.data.newPlan,
			};
		}

		return {
			success: false,
			message: response.data.msg || 'Failed to assign workout plan',
			error: response.data.error,
		};
	} catch (error) {
		console.error('Error assigning workout plan:', error);

		// Attempt to extract error message if error is an AxiosError
		if (
			typeof error === 'object' &&
			error !== null &&
			'response' in error &&
			(error as AxiosError).response
		) {
			const err = error as { response?: { data?: { msg?: string } } };
			const message =
				err.response?.data?.msg || 'Failed to assign workout plan';
			throw new Error(message);
		}

		throw error;
	}
}
