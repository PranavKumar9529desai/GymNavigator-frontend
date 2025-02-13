'use server';
import { TrainerReqConfig } from '@/lib/AxiosInstance/trainerAxios';
import { AxiosError } from 'axios';

export interface MealIngredientInput {
  name: string;
  quantity: number;
  unit: string;
  calories: number;
  protein?: number | null;
  carbs?: number | null;
  fats?: number | null;
}

export interface MealInput {
  name: string;
  timeOfDay: string;
  calories: number;
  protein: number;
  carbs: number;
  fats: number;
  instructions?: string | null;
  order: number;
  ingredients: MealIngredientInput[];
}

export interface DietPlanInput {
  name: string;
  description?: string | null;
  targetCalories: number;
  proteinRatio: number;
  carbsRatio: number;
  fatsRatio: number;
  meals: MealInput[];
}

export const createDietPlan = async (dietPlan: DietPlanInput) => {
  const trainerAxios = await TrainerReqConfig();

  try {
    // Add order to meals if not present
    const mealsWithOrder = dietPlan.meals.map((meal, index) => ({
      ...meal,
      order: meal.order || index + 1,
    }));

    const response = await trainerAxios.post('/createdietplans', {
      ...dietPlan,
      meals: mealsWithOrder,
    });

    if (response.status === 201) {
      return {
        success: true,
        message: 'Diet plan created successfully',
        data: response.data.dietPlan,
      };
    } else {
      throw new Error(response.data.msg || 'Failed to create diet plan');
    }
  } catch (error: unknown) {
    const axiosError = error as AxiosError<{ msg: string }>;
    console.error('Error creating diet plan:', axiosError);
    return {
      success: false,
      message: axiosError.response?.data?.msg || 'Failed to create diet plan',
    };
  }
};
