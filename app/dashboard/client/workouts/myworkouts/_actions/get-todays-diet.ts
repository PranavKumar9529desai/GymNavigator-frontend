'use server';

import { ClientReqConfig } from '@/lib/AxiosInstance/clientAxios';
import type { AxiosResponse } from 'axios';

// Types that match backend data structure
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
}

// Backend API Response type
interface ApiResponse {
  success: boolean;
  msg: string;
  data?: {
    dietPlan: DietPlan;
  };
  error?: string;
}

export const getTodaysDiet = async (): Promise<DietPlan | null> => {
  try {
    const clientAxios = await ClientReqConfig();

    // Fetch the diet plan from the backend
    const response: AxiosResponse<ApiResponse> = await clientAxios.get('/diet/today');

    if (!response.data?.success || !response.data?.data?.dietPlan) {
      return null;
    }

    // The backend now returns the complete diet plan structure
    return response.data.data.dietPlan;
  } catch (error) {
    console.error("Error fetching today's diet:", error);
    throw error;
  }
};
