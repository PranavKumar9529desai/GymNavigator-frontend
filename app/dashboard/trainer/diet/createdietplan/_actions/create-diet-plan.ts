'use server';
import { TrainerReqConfig } from '@/lib/AxiosInstance/trainerAxios';
import type { AxiosError } from 'axios';
// Use DietPlanInput from diet-types if available

export interface MealIngredientInput {
	name: string;
	quantity: number;
	unit: string;
	calories: number;
	protein?: number | null;
	carbs?: number | null;
	fats?: number | null;
}

export interface MealInput {
	name: string;
	timeOfDay: string;
	calories: number;
	protein: number;
	carbs: number;
	fats: number;
	instructions?: string | null;
	order: number;
	ingredients: MealIngredientInput[];
}

export interface DietPlanInput {
	name: string;
	description?: string | null;
	targetCalories: number;
	proteinRatio: number;
	carbsRatio: number;
	fatsRatio: number;
	meals: MealInput[];
}

export interface ApiResponse<T = unknown> {
	success: boolean;
	data?: T;
	error?: string;
}

export async function createDietPlan(
	dietPlan: DietPlanInput,
): Promise<ApiResponse> {
	'use server';

	const trainerAxios = await TrainerReqConfig();

	try {
		// Add order to meals if not present
		const mealsWithOrder = dietPlan.meals.map((meal, index) => ({
			...meal,
			order: meal.order || index + 1,
		}));

		// Transform data from frontend format to backend format if needed
		const response = await trainerAxios.post('/diet/createdietplan', {
			...dietPlan,
			meals: mealsWithOrder,
		});

		if (response.status === 201) {
			return {
				success: true,
				data: response.data.data,
			};
		}
		throw new Error(response.data.error || 'Failed to create diet plan');
	} catch (error: unknown) {
		const axiosError = error as AxiosError<{ error: string }>;
		console.error('Error creating diet plan:', axiosError);
		return {
			success: false,
			error: axiosError.response?.data?.error || 'Failed to create diet plan',
		};
	}
}
