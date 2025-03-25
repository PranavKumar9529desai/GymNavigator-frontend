"use server";

import { TrainerReqConfig } from "@/lib/AxiosInstance/trainerAxios";

// Match the DietPlan type from GetallDiets.ts
export interface DietPlan {
	id: number;
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
		ingredients?: Array<{
			name: string;
			quantity?: string;
		}>;
	}[];
	createdAt?: string;
	updatedAt?: string;
}

export interface CustomDietPlansResponse {
	success: boolean;
	msg: string;
	dietPlans: DietPlan[];
	error?: string;
}

export async function getCustomDietPlans(): Promise<DietPlan[]> {
	try {
		const trainerAxios = await TrainerReqConfig();
		const response =
			await trainerAxios.get<CustomDietPlansResponse>("/diet/alldietplans");

		if (response.data.success && Array.isArray(response.data.dietPlans)) {
			return response.data.dietPlans.map((plan) => {
				// Transform the data to ensure type compatibility
				return {
					...plan,
					// Ensure id is a number
					id: typeof plan.id === "string" ? Number.parseInt(plan.id, 10) : plan.id,
					// Ensure description is string | undefined (not null)
					description: plan.description === null ? undefined : plan.description,
					// Ensure createdAt exists for sorting purposes
					createdAt: plan.createdAt || new Date().toISOString(),
					// Process meals to ensure compatibility
					meals: plan.meals.map(meal => ({
						...meal,
						// Ensure id is a number and not undefined
						id: meal.id ?? 0, // Provide a default id if missing
						// Ensure instructions is a string (not null)
						instructions: meal.instructions || ""
					}))
				};
			});
		}

		console.error("Failed to fetch custom diet plans:", response.data.msg);
		return [];
	} catch (error) {
		console.error("Error fetching custom diet plans:", error);
		return [];
	}
}
