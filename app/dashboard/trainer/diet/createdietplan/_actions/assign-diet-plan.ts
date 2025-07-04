'use server';

import { TrainerReqConfig } from '@/lib/AxiosInstance/trainerAxios';
import { revalidatePath } from 'next/cache';

export interface AssignDietPlanInput {
	userId: number;
	dietPlanId: number;
}

export async function assignDietPlan({ userId, dietPlanId }: AssignDietPlanInput) {
	try {
		const trainerAxios = await TrainerReqConfig();

		const response = await trainerAxios.post('/diet/assigndiettouser', {
			userId,
			dietPlanId,
		});

		if (response.status !== 200) {
			throw new Error(response.data.msg || 'Failed to assign diet plan');
		}

		// Revalidate paths that show diet plan assignments
		revalidatePath('/dashboard/trainer/clients');
		revalidatePath(`/dashboard/trainer/clients/${userId}`);

		return { success: true, data: response.data.data };
	} catch (error) {
		const errorMessage =
			error instanceof Error ? error.message : 'An unknown error occurred';
		console.error('Error assigning diet plan:', errorMessage);
		return { success: false, error: errorMessage };
	}
}
