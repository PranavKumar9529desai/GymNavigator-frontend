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
  msg: string;
  exercise: Exercise;
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
    if (!response.data.exercise) {
      throw new Error('Exercise not found');
    }
    return response.data.exercise;
  } catch (error) {
    console.error('Error fetching exercise:', error);
    throw error;
  }
};
