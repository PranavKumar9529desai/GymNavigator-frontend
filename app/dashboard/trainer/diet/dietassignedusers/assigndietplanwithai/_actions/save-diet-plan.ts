'use server';

import { TrainerReqConfig } from '@/lib/AxiosInstance/trainerAxios';
import type { DietPlan } from './get-customdiets';

// This is the type for the diet plan that is sent to the backend
// Define explicitly to avoid id field requirement in meals
export interface DietPlanInput {
	name: string;
	description?: string | null;
	targetCalories: number;
	proteinRatio: number;
	carbsRatio: number;
	fatsRatio: number;
	meals: {
		name: string;
		timeOfDay: string;
		calories: number;
		protein: number;
		carbs: number;
		fats: number;
		instructions: string | null;
		order: number;
		ingredients?: Array<{
			name: string;
			quantity: number;
			unit: string;
			calories: number;
			protein?: number | null;
			carbs?: number | null;
			fats?: number | null;
		}>;
	}[];
}

// Define a type for the API response
interface _ApiResponse {
	success: boolean;
	msg: string;
	data?: { id: number };
	error?: string;
}

export async function saveDietPlan(
	dietPlan: DietPlanInput,
): Promise<{ success: boolean; dietPlanId?: number; message: string }> {
	const trainerAxios = await TrainerReqConfig();

	try {
		console.log('Sending diet plan to backend from saveDietPlan:', dietPlan);

		// We need to wrap the diet plan in a dietPlan object since that's what the backend expects
		const response = await trainerAxios.post('/diet/createcustomdietplan', {
			dietPlan: dietPlan,
		});

		const data = response.data;
		console.log('Response from backend:', data);

		// Check the success field instead of msg field
		if (data.success === true) {
			// Extract dietPlanId from the response data if available
			const dietPlanId = data.data?.id;

			return {
				success: true,
				dietPlanId,
				message: data.msg || 'Diet plan saved successfully',
			};
		}

		console.log('response.data from the assigndietplanwithai', response.data);
		return {
			success: false,
			message: data.error || data.msg || 'Failed to save diet plan',
		};
	} catch (error) {
		console.error('Error saving diet plan:', error);

		return {
			success: false,
			message: 'Error saving diet plan. Please try again.',
		};
	}
}
