'use server';

import { TrainerReqConfig } from '@/lib/AxiosInstance/trainerAxios';
import { revalidatePath } from 'next/cache';

interface DietPlanResponse {
	id: number;
	name: string;
	description?: string | null;
	targetCalories: number;
	proteinRatio: number;
	carbsRatio: number;
	fatsRatio: number;
	createdAt: string;
	updatedAt: string;
	// Add other fields from backend response
}

// Define the DietPlanInput type
export interface DietPlanInput {
	name: string;
	description: string | null;
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
		ingredients: Array<{
			name: string;
			quantity: number;
			unit: string;
			calories: number;
			protein?: number | null;
			carbs?: number | null;
			fats?: number | null;
		}>;
		order?: number;
	}[];
}

// Define the DietPlanUpdateInput type
export interface DietPlanUpdateInput extends DietPlanInput {
	id: number;
}

export interface Meal {
	name: string;
	foods: Food[];
}

export interface Food {
	name: string;
	quantity: string;
	calories: number;
}

export async function createDietPlan(dietPlan: DietPlanInput) {
	try {
		const trainerAxios = await TrainerReqConfig();

		// Add order to meals if not present
		const mealsWithOrder = dietPlan.meals.map((meal, index: number) => ({
			...meal,
			order: meal.order || index + 1,
		}));

		const response = await trainerAxios.post('/diet/createdietplan', {
			...dietPlan,
			meals: mealsWithOrder,
		});

		if (response.status !== 201) {
			throw new Error(response.data.error || 'Failed to create diet plan');
		}

		revalidatePath('/dashboard/trainer/diet');
		return { success: true, data: response.data.data as DietPlanResponse };
	} catch (error) {
		console.error('Error creating diet plan:', error);
		return {
			success: false,
			error:
				error instanceof Error ? error.message : 'Failed to create diet plan',
		};
	}
}

export async function updateDietPlan(dietPlan: DietPlanUpdateInput) {
	try {
		const trainerAxios = await TrainerReqConfig();
		const response = await trainerAxios.put('/diet/updatedietplan', dietPlan);

		if (response.status !== 200) {
			throw new Error(response.data.error || 'Failed to update diet plan');
		}

		revalidatePath('/dashboard/trainer/diet');
		revalidatePath(`/dashboard/trainer/diet/edit/${dietPlan.id}`);
		return { success: true, data: response.data.data as DietPlanResponse };
	} catch (error) {
		console.error('Error updating diet plan:', error);
		return {
			success: false,
			error:
				error instanceof Error ? error.message : 'Failed to update diet plan',
		};
	}
}

// Add proper types to parameters
export const calculateTotalCalories = (meals: Meal[]): number => {
	return meals.reduce((total, _meal: Meal) => {
		// ...existing code...
		return total;
	}, 0);
};
