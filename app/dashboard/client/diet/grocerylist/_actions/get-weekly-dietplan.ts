'use server';

import { generateGroceryList } from '@/lib/AI/grocery-list';
import { auth } from '@/app/(auth)/auth';
import { ClientReqConfig } from '@/lib/AxiosInstance/clientAxios';
import { z } from 'zod';
import type { DietPlan } from '@/lib/AI/types/diet-types';
import type { GroceryListResponse } from '@/lib/AI/prompts/grocery-list-prompts';

// Schema for validating parameters
const ParamsSchema = z.object({
  timeFrame: z.enum(['weekly', 'monthly'])
});

export type GetDietPlanResult = {
  success: boolean;
  dietPlans?: DietPlan[];
  groceryList?: GroceryListResponse;
  error?: string;
};

/**
 * Fetch weekly diet plan for the authenticated client and generate a grocery list
 */
export async function getWeeklyDietPlan(
  params: z.infer<typeof ParamsSchema>
): Promise<GetDietPlanResult> {
  try {
    const { timeFrame } = ParamsSchema.parse(params);
    const session = await auth();
    
    if (!session?.user?.id) {
      return { success: false, error: 'User not authenticated' };
    }
    
    // Fetch diet plans for the client from the backend
    const clientAxios = await ClientReqConfig();
    const response = await clientAxios.get('/diet/dietplans');
    
    if (!response.data?.success || !response.data?.data) {
      return { success: false, error: 'Failed to fetch diet plans: No data received' };
    }
    
    // Get diet plans from response
    const dietPlans = response.data.data as DietPlan[];
    
    if (!dietPlans || dietPlans.length === 0) {
      return { success: false, error: 'No diet plans found' };
    }
    
    // Generate grocery list from diet plans
    const groceryList = await generateGroceryList(dietPlans, timeFrame);
    
    return {
      success: true,
      dietPlans,
      groceryList,
    };
    
  } catch (error) {
    console.error('Error in getWeeklyDietPlan:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'An unknown error occurred',
    };
  }
}
