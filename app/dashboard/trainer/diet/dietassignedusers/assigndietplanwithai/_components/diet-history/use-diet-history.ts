'use client';

import { useState, useEffect, useCallback } from 'react';
import type { DietPlan } from '../../_actions/get-customdiets';
import { useDietViewStore } from '../../_store/diet-view-store';
import type { DietHistoryItem } from '../../_store/diet-view-store';

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

// Function for saving a diet plan to localStorage ONLY
export const saveToLocalStorage = ({
	clientName,
	dietPlan,
	userId,
}: {
	clientName: string;
	dietPlan: DietPlan;
	userId: string;
}) => {
	const { saveDietToLocalStorage } = useDietViewStore.getState();

	// Normalize the diet plan to ensure type compatibility
	const normalizedDietPlan = normalizeDietPlan(dietPlan);

	saveDietToLocalStorage(
		{ clientName, dietPlan: normalizedDietPlan },
		userId,
	);
	return { success: true };
};

export const useDietHistoryQuery = (userId: string) => {
	const getSavedDiets = useDietViewStore((state) => state.getSavedDiets);
	const [history, setHistory] = useState<DietHistoryItem[]>([]);
	const [isLoading, setIsLoading] = useState(true);
	const [error, setError] = useState<Error | null>(null);

	const fetchHistory = useCallback(() => {
		if (!userId) {
			setHistory([]);
			setIsLoading(false);
			return;
		}
		setIsLoading(true);
		try {
			const data = getSavedDiets(userId);
			setHistory(data);
		} catch (e) {
			setError(
				e instanceof Error ? e : new Error('Failed to fetch diet history'),
			);
		} finally {
			setIsLoading(false);
		}
	}, [userId, getSavedDiets]);

	useEffect(() => {
		fetchHistory();
	}, [fetchHistory]);

	const refetch = useCallback(() => {
		fetchHistory();
	}, [fetchHistory]);

	return { data: history, isLoading, isError: !!error, error, refetch };
};
