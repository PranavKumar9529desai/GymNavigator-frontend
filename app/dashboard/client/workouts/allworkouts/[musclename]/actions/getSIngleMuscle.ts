'use server';
import { ClientReqConfig } from '@/lib/AxiosInstance/clientAxios';
import type { AxiosResponse } from 'axios';

export interface MuscleGroupType {
  id: number;
  name: string;
  img: string;
  fullimage: string;
  image_url?: string;
}

export interface Exercise {
  id: number;
  name: string;
  muscleGroupId: number;
  image_url?: string;
  video_url?: string;
  instructions: string;
  muscle_group: string;
  muscle_image?: string;
}

export interface ExerciseWithMuscle extends Exercise {
  MuscleGroup: MuscleGroupType & {
    exercises: Exercise[];
  };
}

// Update the interface to match the backend response structure
export interface SingleMuscleResponse {
  success: boolean;
  msg: string;
  data: {
    exercises: ExerciseWithMuscle[];
  };
}

export interface Excercisetype {
  name: string;
  img: string;
  instructions: string;
  videolink: string;
  MuscleGroup: {
    id: number;
    name: string;
    img: string;
    fullimage: string;
  };
}

export const getSingleMuscle = async (muscle: string): Promise<Excercisetype[]> => {
  try {
    const clientAxios = await ClientReqConfig();

    // Log the request URL for debugging
    console.log(`Fetching exercises for muscle: ${muscle}`);

    const response: AxiosResponse<SingleMuscleResponse> = await clientAxios.get(
      `/workout/${muscle}`,
    );

    // Log the raw response to see its structure
    console.log('Raw API response:', JSON.stringify(response.data, null, 2));

    // Check for response structure
    if (!response.data || !response.data.success) {
      console.error('API returned error or invalid response:', response.data);
      return [];
    }

    // Check if data and exercises exist
    if (!response.data.data || !response.data.data.exercises) {
      console.error('Missing exercises in response:', response.data);
      return [];
    }

    const exercises = response.data.data.exercises;
    console.log(`Found ${exercises.length} exercises for ${muscle}`);

    // Transform and return the exercises with more robust error handling
    return exercises.map((exercise: ExerciseWithMuscle) => {
      if (!exercise.MuscleGroup) {
        console.warn(`Exercise ${exercise.name} missing MuscleGroup data`);
      }

      return {
        name: exercise.name || 'Unknown',
        img: exercise.image_url || '',
        instructions: exercise.instructions || 'No instructions available',
        videolink: exercise.video_url || '',
        MuscleGroup: {
          id: exercise.MuscleGroup?.id || 0,
          name: exercise.MuscleGroup?.name || muscle,
          img: exercise.MuscleGroup?.image_url || '',
          fullimage: exercise.muscle_image || '',
        },
      };
    });
  } catch (error) {
    console.error('Error fetching single muscle exercises:', error);
    return [];
  }
};
