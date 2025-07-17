'use server';

import { TrainerReqConfig } from '@/lib/AxiosInstance/trainerAxios';
import type { AssignSingleDietPayload } from '../../diet-types';

export async function assignDietPlan({ userId, dietPlan, day }: AssignSingleDietPayload) {
	try {
		const trainerAxios = await TrainerReqConfig();
		// Prepare payload for new assignment endpoint
		const payload = {
			userId: Number(userId),
			dietPlanId: dietPlan.id, // Assumes dietPlan has an id (should be created first)
			startDate: new Date().toISOString(), // Placeholder, UI should provide
			endDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(), // Placeholder: 1 week
			daysOfWeek: [day],
			notes: dietPlan.description || '',
		};
		const response = await trainerAxios.post('/diet/assigndiettouser/enhanced', payload);
		if (response.data.success) {
			return {
				success: true,
				data: response.data.data,
			};
		}
		throw new Error(response.data.error || 'Failed to assign diet plan');
	} catch (error) {
		console.error('Error assigning diet plan:', error);
		return {
			success: false,
			error: error instanceof Error ? error.message : 'Failed to assign diet plan',
		};
	}
}
