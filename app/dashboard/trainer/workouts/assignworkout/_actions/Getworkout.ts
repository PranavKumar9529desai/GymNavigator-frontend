'use server';

import { OwnerReqConfig } from '@/lib/AxiosInstance/ownerAxios';

export interface WorkoutPlan {
    id: number;
    name: string;
    description: string;
    difficulty: string;
    duration: number;
    category: string;
    isActive: boolean;
}

export async function getWorkoutPlans(): Promise<WorkoutPlan[]> {
    try {
        const response = await OwnerReqConfig.get('/api/trainer/workoutplans');
        return response.data.data;
    } catch (error) {
        console.error('Error fetching workout plans:', error);
        return [];
    }
} 