'use client';

import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import type { DietPlan } from '../../_actions/get-customdiets';
import { getCustomDietPlans } from '../../_actions/get-customdiets';
import { saveDietPlan } from '../../_actions/save-diet-plan';
import type { DietPlanInput } from '../../_actions/save-diet-plan';
import { useDietViewStore } from '../../_store/diet-view-store';
import type { DietHistoryItem } from '../../_store/diet-view-store';

// Define query keys
export const DIET_PLANS_QUERY_KEY = 'dietPlans';
export const CUSTOM_DIET_PLANS_QUERY_KEY = 'customDietPlans';

// Helper function to normalize dates for sorting
const normalizeDate = (dateStr?: string): Date => {
  if (!dateStr) return new Date();
  try {
    return new Date(dateStr);
  } catch (_e) {
    return new Date();
  }
};

// Helper function to ensure DietPlan matches expected format
const normalizeDietPlan = (diet: DietPlan): DietPlan => {
  return {
    ...diet,
    // Ensure description is string | undefined (not null)
    description: diet.description === null ? undefined : diet.description,
    // Process meals to ensure compatibility
    meals: diet.meals.map(meal => ({
      ...meal,
      // Ensure id is present
      id: meal.id || 0,
      // Ensure instructions is a string (not null)
      instructions: meal.instructions || ""
    }))
  };
};

export function useDietHistoryQuery(userId: string) {
  const { getSavedDiets } = useDietViewStore();
  const localDiets = getSavedDiets(userId);

  return useQuery({
    queryKey: [CUSTOM_DIET_PLANS_QUERY_KEY],
    queryFn: async () => {
      // Fetch diet plans from backend
      const backendDiets = await getCustomDietPlans();
      
      // Get unique IDs from backend diets to filter local diets
      const backendIdsSet = new Set(backendDiets.map(diet => diet.id.toString()));
      
      // Filter out local diets that already exist in backend
      const uniqueLocalDiets = localDiets.filter(item => 
        !backendIdsSet.has(typeof item.dietPlan.id === 'string' 
          ? item.dietPlan.id 
          : item.dietPlan.id.toString()
        )
      );
      
      // Normalize backend diet data to match expected format
      const normalizedBackendDiets = backendDiets.map(diet => ({
        id: `backend-${diet.id}`,
        clientName: diet.name,
        dietPlan: normalizeDietPlan(diet),
        createdAt: diet.createdAt || new Date().toISOString(),
        updatedAt: diet.updatedAt || new Date().toISOString(),
        userId: userId
      }));
      
      // Combine all diets
      const allDiets = [...normalizedBackendDiets, ...uniqueLocalDiets];
      
      // Sort by createdAt (newest first) using improved date handling
      return allDiets.sort((a, b) => {
        const dateA = normalizeDate(a.createdAt);
        const dateB = normalizeDate(b.createdAt);
        return dateB.getTime() - dateA.getTime(); // Newest first
      });
    },
    initialData: localDiets, // Show local diets immediately while fetching
    staleTime: 30 * 1000, // 30 seconds
    retry: 1,
  });
}

// Mutation hook for saving a diet plan to localStorage ONLY
export function useSaveToLocalStorageMutation() {
  const { saveDietToLocalStorage } = useDietViewStore();
  
  return useMutation({
    mutationFn: async ({ 
      clientName, 
      dietPlan, 
      userId 
    }: { 
      clientName: string;
      dietPlan: DietPlan; 
      userId: string;
    }) => {
      // Normalize the diet plan to ensure type compatibility
      const normalizedDietPlan = normalizeDietPlan(dietPlan);
      
      saveDietToLocalStorage({ clientName, dietPlan: normalizedDietPlan }, userId);
      return { success: true };
    }
  });
}

// Mutation hook for saving a diet plan to the BACKEND ONLY
export function useSaveToBackendMutation() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async ({ dietPlan }: { dietPlan: DietPlanInput }) => {
      // Pass the diet plan directly to saveDietPlan without wrapping it
      return await saveDietPlan(dietPlan);
    },
    onSuccess: () => {
      // Invalidate all diet-related queries to trigger refetches
      queryClient.invalidateQueries({ queryKey: [CUSTOM_DIET_PLANS_QUERY_KEY] });
    },
  });
}

// Combined mutation for saving diet plan to both localStorage and backend
export function useSaveDietPlanMutation() {
  const queryClient = useQueryClient();
  const { saveDietToLocalStorage } = useDietViewStore();
  
  return useMutation({
    mutationFn: async ({ 
      dietPlan, 
      userId, 
      clientName 
    }: { 
      dietPlan: DietPlan; 
      userId: string;
      clientName: string;
    }) => {
      // Normalize the diet plan to ensure type compatibility
      const normalizedDietPlan = normalizeDietPlan(dietPlan);
      
      // First save to localStorage
      saveDietToLocalStorage({ clientName, dietPlan: normalizedDietPlan }, userId);
      
      // Then transform and save to backend
      const dietPlanInput: DietPlanInput = {
        name: dietPlan.name,
        description: dietPlan.description || null,
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
          instructions: meal.instructions || null,
          order: index + 1, // Add the required order field
          ingredients: [] // Add empty ingredients array since it's not in the AI response
        }))
      };
      
      // Save to backend and return result
      console.log("dietPlanInput from the useSaveDietPlanMutation", dietPlanInput);

      return await saveDietPlan(dietPlanInput);
    },
    onSuccess: () => {
      // Invalidate the diet plans query to trigger a refetch
      queryClient.invalidateQueries({ queryKey: [CUSTOM_DIET_PLANS_QUERY_KEY] });
    },
  });
} 