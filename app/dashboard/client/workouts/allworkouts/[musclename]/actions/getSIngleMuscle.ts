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

export interface SingleMuscleResponse {
  msg: string;
  exercises: ExerciseWithMuscle[];
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

// interface ResponseType {
//   msg: string;
//   Excercises: Excercisetype[];
// }

export const getSingleMuscle = async (muscle: string): Promise<Excercisetype[]> => {
  try {
    const clientAxios = await ClientReqConfig();
    const response: AxiosResponse<SingleMuscleResponse> = await clientAxios.get(
      `/workout/${muscle}`,
    );
    // Transform the data to match Excercisetype
    return response.data.exercises.map((exercise: ExerciseWithMuscle) => ({
      name: exercise.name,
      img: exercise.image_url || '',
      instructions: exercise.instructions,
      videolink: exercise.video_url || '',
      MuscleGroup: {
        id: exercise.MuscleGroup.id,
        name: exercise.MuscleGroup.name,
        img: exercise.MuscleGroup.image_url || '',
        fullimage: exercise.muscle_image || '',
      },
    }));
  } catch (error) {
    console.log('error from the getSingleMuscle', error);
    return [];
  }
};
