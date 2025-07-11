'use server';

import { TrainerReqConfig } from '@/lib/AxiosInstance/trainerAxios';
import { toast } from 'sonner';

interface AssignDietPlanParams {
	userId: string;
	dietPlan: {
		name: string;
		description?: string;
		targetCalories: number;
		proteinRatio: number;
		carbsRatio: number;
		fatsRatio: number;
		meals: {
			id: number;
			name: string;
			timeOfDay: string;
			calories: number;
			protein: number;
			carbs: number;
			fats: number;
			instructions: string;
		}[];
	};
	day: string;
}

export async function assignDietPlan({
	userId,
	dietPlan,
	day,
}: AssignDietPlanParams) {
	try {
		const trainerAxios = await TrainerReqConfig();

		// Format the diet plan to match the backend expectations
		const formattedDietPlan = {
			name: `${day} Diet Plan - ${dietPlan.name || 'Custom Diet'}`,
			description: dietPlan.description || `Generated diet plan for ${day}`,
			targetCalories: dietPlan.targetCalories,
			proteinRatio: dietPlan.proteinRatio,
			carbsRatio: dietPlan.carbsRatio,
			fatsRatio: dietPlan.fatsRatio,
			meals: dietPlan.meals.map((meal, index) => ({
				name: meal.name,
				timeOfDay: meal.timeOfDay,
				calories: meal.calories,
				protein: meal.protein,
				carbs: meal.carbs,
				fats: meal.fats,
				instructions: `[Time: ${meal.timeOfDay}] ${meal.instructions}`,
				order: index + 1, // Add order field
			})),
		};

		// Call the createandassign endpoint
		const response = await trainerAxios.post('/diet/createandassign', {
			userId: Number(userId),
			dietPlan: formattedDietPlan,
		});

		if (response.data.success) {
			return {
				success: true,
				data: response.data.data,
				message: 'Diet plan assigned successfully',
			};
		}
		throw new Error(response.data.error || 'Failed to assign diet plan');
	} catch (error) {
		console.error('Error assigning diet plan:', error);
		return {
			success: false,
			error:
				error instanceof Error ? error.message : 'Failed to assign diet plan',
		};
	}
}

// Function to assign the weekly diet plan
export async function assignWeeklyDietPlan({
	userId,
	weeklyPlans,
}: {
	userId: string;
	weeklyPlans: Record<string, AssignDietPlanParams['dietPlan']>;
}) {
	try {
		const trainerAxios = await TrainerReqConfig();

		// Format all the diet plans
		const formattedWeeklyPlans = Object.entries(weeklyPlans).map(
			([day, plan]) => ({
				day,
				plan: {
					name: `${day} Diet Plan - ${plan.name || 'Custom Diet'}`,
					description: plan.description || `Generated diet plan for ${day}`,
					targetCalories: plan.targetCalories,
					proteinRatio: plan.proteinRatio,
					carbsRatio: plan.carbsRatio,
					fatsRatio: plan.fatsRatio,
					meals: plan.meals.map((meal, index) => ({
						name: meal.name,
						timeOfDay: meal.timeOfDay,
						calories: meal.calories,
						protein: meal.protein,
						carbs: meal.carbs,
						fats: meal.fats,
						instructions: `[Time: ${meal.timeOfDay}] ${meal.instructions}`,
						order: index + 1,
					})),
				},
			}),
		);

		// Call the createandassignweekly endpoint
		const response = await trainerAxios.post('/diet/createandassignweekly', {
			userId: Number(userId),
			weeklyPlans: formattedWeeklyPlans,
		});

		if (response.data.success) {
			return {
				success: true,
				data: response.data.data,
				message: 'Weekly diet plan assigned successfully',
			};
		}
		throw new Error(response.data.error || 'Failed to assign weekly diet plan');
	} catch (error) {
		console.error('Error assigning weekly diet plan:', error);
		return {
			success: false,
			error:
				error instanceof Error
					? error.message
					: 'Failed to assign weekly diet plan',
		};
	}
}
