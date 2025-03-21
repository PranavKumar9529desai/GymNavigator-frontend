'use server';

import { TrainerReqConfig } from '@/lib/AxiosInstance/trainerAxios';
import type { DietPlan } from '../../_actions /GetallDiets';

export async function saveDietPlan(dietPlan: DietPlan): Promise<{ success: boolean; dietPlanId?: number; message: string }> {
  const trainerAxios = await TrainerReqConfig();

  try {
    const response = await trainerAxios.post('/diet/create-diet-plan', {
      dietPlan
    });

    const data = response.data;

    if (data.msg === 'success') {
      return {
        success: true,
        dietPlanId: data.dietPlanId,
        message: 'Diet plan saved successfully'
      };
    }
    
    return {
      success: false,
      message: data.error || 'Failed to save diet plan'
    };
  } catch (error) {
    console.error('Error saving diet plan:', error);
    
    return {
      success: false,
      message: 'Error saving diet plan. Please try again.'
    };
  }
} 