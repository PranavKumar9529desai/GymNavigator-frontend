'use client';

import { useMutation } from '@tanstack/react-query';
import type { DietPlan } from '../../_actions/get-customdiets';
import { useDietViewStore } from '../../_store/diet-view-store';

// Helper function to ensure DietPlan matches expected format
const normalizeDietPlan = (diet: DietPlan): DietPlan => {
	return {
		...diet,
		// Ensure description is string | undefined (not null)
		description: diet.description === null ? undefined : diet.description,
		// Process meals to ensure compatibility
		meals: diet.meals.map((meal) => ({
			...meal,
			// Ensure id is present
			id: meal.id || 0,
			// Ensure instructions is a string (not null)
			instructions: meal.instructions || '',
		})),
	};
};

// Mutation hook for saving a diet plan to localStorage ONLY
export function useSaveToLocalStorageMutation() {
	const { saveDietToLocalStorage } = useDietViewStore();

	return useMutation({
		mutationFn: async ({
			clientName,
			dietPlan,
			userId,
		}: {
			clientName: string;
			dietPlan: DietPlan;
			userId: string;
		}) => {
			// Normalize the diet plan to ensure type compatibility
			const normalizedDietPlan = normalizeDietPlan(dietPlan);

			saveDietToLocalStorage(
				{ clientName, dietPlan: normalizedDietPlan },
				userId,
			);
			return { success: true };
		},
	});
}
