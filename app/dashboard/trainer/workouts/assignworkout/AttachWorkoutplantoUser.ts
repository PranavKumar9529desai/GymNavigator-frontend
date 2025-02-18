'use server';
import { TrainerReqConfig } from '@/lib/AxiosInstance/trainerAxios';

interface AssignWorkoutPlanResponse {
  msg: string;
  previousPlan?: {
    id: number;
    name: string;
    description?: string;
  } | null;
  newPlan?: {
    id: number;
    name: string;
    description?: string;
  } | null;
}

export async function attachWorkoutPlanToUser(
  userId: string,
  workoutPlanId: string
): Promise<AssignWorkoutPlanResponse> {
  try {
    const trainerAxios = await TrainerReqConfig();
    const response = await trainerAxios.post('/workouts/assignworkoutplan', {
      userId: Number.parseInt(userId),
      workoutPlanId: Number.parseInt(workoutPlanId),
    });

    if (response.data.error) {
      throw new Error(response.data.error);
    }

    return response.data;
  } catch (error) {
    console.error('Error assigning workout plan:', error);
    throw new Error(error instanceof Error ? error.message : 'Failed to assign workout plan');
  }
}
