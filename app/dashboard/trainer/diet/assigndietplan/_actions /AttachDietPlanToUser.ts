'use server';
import { TrainerReqConfig } from '@/lib/AxiosInstance/trainerAxios';

interface DietPlanResponse {
  id: number;
  name: string;
  // Add other diet plan fields as needed
}

interface AttachDietPlanResponse {
  success: boolean;
  message: string;
  dietPlan?: DietPlanResponse;
}

export const attachDietPlanToUser = async (
  userId: string,
  dietPlanId: string,
): Promise<AttachDietPlanResponse> => {
  const trainerAxios = await TrainerReqConfig();
  try {
    const response = await trainerAxios.post('/assigndietplantouser', {
      userId: Number.parseInt(userId),
      dietPlanId: Number.parseInt(dietPlanId),
    });

    return {
      success: response.data.msg === 'Diet plan assigned successfully',
      message: response.data.msg,
      dietPlan: response.data.dietPlan?.dietPlan,
    };
  } catch (error) {
    console.error('Error assigning diet plan:', error);
    return {
      success: false,
      message: 'Failed to assign diet plan',
    };
  }
};
