'use server';
import { TrainerReqConfig } from '@/lib/AxiosInstance/trainerAxios';

export interface WorkoutPlan {
  id: number;
  name: string;
  description: string;
  createdAt: string;
  updatedAt: string;
}

export async function getWorkoutPlans(): Promise<WorkoutPlan[]> {
  try {
    const trainerAxios = await TrainerReqConfig();
    const response = await trainerAxios.get('/workouts/allworkoutplans');
    
    if (response.data.msg === 'success' && Array.isArray(response.data.workoutPlans)) {
      return response.data.workoutPlans;
    }
    
    return [];
  } catch (error) {
    console.error('Error fetching workout plans:', error);
    return [];
  }
} 