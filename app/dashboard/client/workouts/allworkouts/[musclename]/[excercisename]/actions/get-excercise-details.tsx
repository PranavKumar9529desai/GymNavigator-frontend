import type { AxiosResponse } from 'axios';
import { ClientReqConfig } from '../../../../../../../../lib/AxiosInstance/clientAxios';

export interface Exercise {
  name: string;
  video_url: string;
  muscle_image: string;
  instructions: string;
  muscle_group: string;
}

interface SingleExerciseResponse {
  success: boolean;
  msg: string;
  data: {
    exercise: Exercise;
  };
}

export const GetExcerciseDetails = async (
  _muscleName: string,
  excerciseName: string,
): Promise<Exercise> => {
  const clientAxios = await ClientReqConfig();
  try {
    const response: AxiosResponse<SingleExerciseResponse> = await clientAxios.get(
      `/workout/singleworkout/${excerciseName}`,
    );

    // Check for the nested data structure
    if (!response.data.data || !response.data.data.exercise) {
      throw new Error('Exercise not found or invalid response structure');
    }

    return response.data.data.exercise;
  } catch (error) {
    console.error('Error fetching exercise:', error);
    throw error;
  }
};
