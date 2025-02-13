'use server';
import { TrainerReqConfig } from '@/lib/AxiosInstance/trainerAxios';

interface UpdateDietPlanInput {
  userDietPlanId: number;
  newDietPlanId: number;
  userId: number; // Add userId to the interface
}

interface DietPlanResponse {
  id: number;
  name: string;
  // Add other diet plan fields as needed
}

interface UpdateDietPlanResponse {
  success: boolean;
  message: string;
  dietPlan?: DietPlanResponse;
}

export const updateAssignedDietPlan = async (
  data: UpdateDietPlanInput
): Promise<UpdateDietPlanResponse> => {
  const trainerAxios = await TrainerReqConfig();
  try {
    const response = await trainerAxios.post('/updateassigneddietplan', data);

    return {
      success: response.data.msg === 'Diet plan updated successfully',
      message: response.data.msg,
      dietPlan: response.data.updatedPlan?.dietPlan,
    };
  } catch (error) {
    console.error('Error updating diet plan:', error);
    return {
      success: false,
      message: 'Failed to update diet plan',
    };
  }
};
