'use server';
import { TrainerReqConfig } from '@/lib/AxiosInstance/trainerAxios';
import type { AxiosError } from 'axios';
import type { ApiResponse } from './create-diet-plan';

export interface DietPlanUpdateInput {
	id: number;
	name?: string;
	description?: string | null;
	targetCalories?: number;
	proteinRatio?: number;
	carbsRatio?: number;
	fatsRatio?: number;
	// We don't include meals here as they might need dedicated update endpoints
}

export async function updateDietPlan(
	dietPlan: DietPlanUpdateInput,
): Promise<ApiResponse> {
	const trainerAxios = await TrainerReqConfig();

	try {
		const response = await trainerAxios.put('/diet/updatedietplan', dietPlan);

		if (response.status === 200) {
			return {
				success: true,
				message: 'Diet plan updated successfully',
				data: response.data.data,
			};
		}
		throw new Error(response.data.msg || 'Failed to update diet plan');
	} catch (error: unknown) {
		const axiosError = error as AxiosError<{ msg: string }>;
		console.error('Error updating diet plan:', axiosError);
		return {
			success: false,
			message: axiosError.response?.data?.msg || 'Failed to update diet plan',
		};
	}
}
