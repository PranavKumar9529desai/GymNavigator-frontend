'use client';

import { TrainerReqConfig } from '@/lib/AxiosInstance/trainerAxios';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';

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

export function useDietPlanMutation() {
	const queryClient = useQueryClient();

	const createDietPlanMutation = useMutation({
		mutationFn: async (dietPlan: DietPlanInput) => {
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
				throw new Error(response.data.msg || 'Failed to create diet plan');
			}

			return response.data.data as DietPlanResponse;
		},
		onSuccess: () => {
			// Invalidate relevant queries
			queryClient.invalidateQueries({ queryKey: ['dietPlans'] });
			toast.success('Diet plan created successfully');
		},
		onError: (error: Error) => {
			console.error('Error creating diet plan:', error);
			toast.error(error.message || 'Failed to create diet plan');
		},
	});

	const updateDietPlanMutation = useMutation({
		mutationFn: async (dietPlan: DietPlanUpdateInput) => {
			const trainerAxios = await TrainerReqConfig();
			const response = await trainerAxios.put('/diet/updatedietplan', dietPlan);

			if (response.status !== 200) {
				throw new Error(response.data.msg || 'Failed to update diet plan');
			}

			return response.data.data as DietPlanResponse;
		},
		onSuccess: (_, variables) => {
			// Update the diet plan in the cache
			queryClient.invalidateQueries({ queryKey: ['dietPlans'] });
			queryClient.invalidateQueries({ queryKey: ['dietPlan', variables.id] });
			toast.success('Diet plan updated successfully');
		},
		onError: (error: Error) => {
			console.error('Error updating diet plan:', error);
			toast.error(error.message || 'Failed to update diet plan');
		},
	});

	return {
		createDietPlanMutation,
		updateDietPlanMutation,
	};
}

// Add proper types to parameters
export const calculateTotalCalories = (meals: Meal[]): number => {
	return meals.reduce((total, meal: Meal, index: number) => {
		console.log('meal', meal, index);
		// ...existing code...
		return total;
	}, 0);
};
