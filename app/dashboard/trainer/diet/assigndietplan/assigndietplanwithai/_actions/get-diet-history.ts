'use server';

import { TrainerReqConfig } from '@/lib/AxiosInstance/trainerAxios';
import type { DietPlan } from '../../_actions /GetallDiets';
import type { DietHistoryItem } from '../_store/diet-view-store';

// Response type from the getcustomdietplans endpoint
interface CustomDietPlansResponse {
  success: boolean;
  msg: string;
  dietPlans?: (DietPlan & { createdAt?: string; updatedAt?: string })[];
  error?: string;
}

export async function getDietHistory(
  userId: string,
): Promise<{ success: boolean; data?: DietHistoryItem[]; message?: string }> {
  try {
    const trainerAxios = await TrainerReqConfig();

    // Call the getcustomdietplans endpoint instead of /diet/history/{userId}
    const response = await trainerAxios.get('/diet/getcustomdietplans');
    const data = response.data as CustomDietPlansResponse;

    if (data.success || data.msg === 'success') {
      // Transform the diet plans into DietHistoryItem format
      const dietHistoryItems: DietHistoryItem[] = (data.dietPlans || []).map((dietPlan) => {
        // Get the current date as ISO string for fallback
        const now = new Date().toISOString();

        return {
          id: dietPlan.id.toString(),
          clientName: 'Custom Template', // Default name for custom templates
          dietPlan: {
            id: dietPlan.id,
            name: dietPlan.name,
            description: dietPlan.description,
            targetCalories: dietPlan.targetCalories,
            proteinRatio: dietPlan.proteinRatio,
            carbsRatio: dietPlan.carbsRatio,
            fatsRatio: dietPlan.fatsRatio,
            meals: dietPlan.meals,
          },
          createdAt: dietPlan.createdAt || now,
          updatedAt: dietPlan.updatedAt || now,
          userId,
        };
      });

      return {
        success: true,
        data: dietHistoryItems,
      };
    }

    return {
      success: false,
      message: data.error || 'Failed to fetch diet plans from server',
    };
  } catch (error) {
    console.error('Error fetching diet plans:', error);

    // Create a more informative error message based on the type of error
    let errorMessage =
      'Unable to connect to the server. Your diet plans are still available locally.';

    // Check if it's a network error
    if (error && typeof error === 'object' && 'message' in error) {
      const errMsg = error.message as string;
      if (errMsg.includes('Network Error') || errMsg.includes('timeout')) {
        errorMessage = 'Network connection issue. Your diet plans are still available locally.';
      }
    }

    return {
      success: false,
      message: errorMessage,
    };
  }
}
