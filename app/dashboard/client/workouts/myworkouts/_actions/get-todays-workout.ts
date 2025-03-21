'use server';

import { ClientReqConfig } from '@/lib/AxiosInstance/clientAxios';
import type { AxiosResponse } from 'axios';

// Types that match backend exactly
export interface Exercise {
  id: number;
  name: string;
  image_url: string | null;
  type: string | null;
  equipment: string | null;
  mechanics: string | null;
  experience_level: string | null;
  detail_url: string | null;
  video_url: string | null;
  muscle_image: string | null;
  instructions: string;
  muscle_group: string;
  MuscleGroup: {
    id: number;
    name: string;
    image_url: string | null;
  };
}

export interface WorkoutExercise {
  id: string;
  workoutId: string;
  exerciseId: number;
  sets: number;
  reps: number;
  rest: number;
  notes: string | null;
  exercise: Exercise;
}

export interface MuscleGroup {
  muscle: string;
  exercises: WorkoutExercise[];
}

export interface TodaysWorkout {
  id: string;
  name: string;
  description: string;
  day: string;
  muscleGroups: MuscleGroup[];
}

// Backend API Response type
interface ApiResponse {
  success: boolean;
  msg: string;
  data?: {
    workout: TodaysWorkout;
  };
  error?: string;
}

export const getTodaysWorkout = async (): Promise<TodaysWorkout | null> => {
  try {
    const clientAxios = await ClientReqConfig();

    const response: AxiosResponse<ApiResponse> = await clientAxios.get(
      '/workout/myworkouts/get-todays-workout',
    );

    if (!response.data?.data?.workout) {
      return null;
    }

    return response.data.data.workout;
  } catch (error) {
    console.error("Error fetching today's workouts:", error);
    throw error;
  }
};
