'use server';

import { TrainerReqConfig } from '@/lib/AxiosInstance/trainerAxios';
import { toast } from 'sonner';
import type { AssignWeeklyDietPayload, AssignSingleDietPayload } from '../../diet-types'; // Adjust import path as needed

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

// Refactored: Assign a single diet plan using the new assignment endpoint
export async function assignDietPlan({
	userId,
	dietPlan,
	day,
}: AssignSingleDietPayload & { day: string; dietPlan: AssignSingleDietPayload['dietPlan'] }) {
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

// Refactored: Assign a weekly diet plan using the new assignment endpoint
export async function assignWeeklyDietPlan({
	userId,
	weeklyPlans,
}: AssignWeeklyDietPayload & { weeklyPlans: Record<string, AssignSingleDietPayload['dietPlan']> }) {
	try {
		const trainerAxios = await TrainerReqConfig();
		// Refactored: Send a single POST with the correct structure
		const payload = {
			userId: Number(userId),
			weeklyPlans: Object.entries(weeklyPlans).map(([day, plan]) => ({ day, plan })),
		};
		const response = await trainerAxios.post('/diet/createandassignweekly', payload);
		if (response.data.success) {
			return {
				success: true,
				data: response.data.data,
			};
		}
		throw new Error(response.data.error || 'Failed to assign weekly diet plans');
	} catch (error) {
		console.error('Error assigning weekly diet plan:', error);
		return {
			success: false,
			error: error instanceof Error ? error.message : 'Failed to assign weekly diet plan',
		};
	}
}
