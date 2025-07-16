'use server';
import { ClientReqConfig } from '@/lib/AxiosInstance/clientAxios';

// Align with the backend response structure
export interface Ingredient {
	name: string;
	quantity: string | null;
}

export interface Meal {
	id: number;
	name: string;
	timeOfDay: string;
	calories: number;
	protein: number;
	carbs: number;
	fats: number;
	instructions: string;
	ingredients: Ingredient[];
}

export interface DietPlan {
	id: number;
	name: string;
	description: string | null;
	targetCalories: number;
	proteinRatio: number;
	carbsRatio: number;
	fatsRatio: number;
	meals: Meal[];
	createdAt: string;
	updatedAt: string;
	trainer?: { name: string } | null;
}

export interface DietResponse {
	success: boolean;
	data?: {
		dietPlan: DietPlan;
	};
	error?: string;
}

export interface TodaysDiet {
	dietPlan: DietPlan | null;
}

export const fetchTodaysDiet = async (): Promise<TodaysDiet> => {
	try {
		const clientAxios = await ClientReqConfig();
		const response = await clientAxios.get<DietResponse>('/diet/today');

		if (!response.data.success || !response.data.data) {
			console.error("Failed to fetch today's diet:", response.data.error);
			return { dietPlan: null };
		}

		console.log('response', response.data.data.dietPlan);

		// Return the direct response from the backend without transformation
		return { dietPlan: response.data.data.dietPlan };
	} catch (error) {
		console.error("Error fetching today's diet:", error);
		return { dietPlan: null };
	}
};

// Helper function to format meal type display
// biome-ignore lint/correctness/noUnusedVariables: Will be used in future component updates
function getMealTypeDisplay(name: string, timeOfDay: string): string {
	if (timeOfDay.includes('7:00 AM')) return 'Breakfast';
	if (timeOfDay.includes('1:00 PM')) return 'Lunch';
	if (timeOfDay.includes('4:00 PM')) return 'Snack';
	if (timeOfDay.includes('7:00 PM')) return 'Dinner';
	// If can't determine from timeOfDay, use the name
	return name;
}
