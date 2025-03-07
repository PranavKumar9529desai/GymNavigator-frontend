"use server";

import axios, { type AxiosResponse } from "axios";
import { ClientReqConfig } from "../../../../../../lib/AxiosInstance/clientAxios";

interface FetchedMusclesResponse {
  msg: string;
  muscleGroups: MuscleGroup[];
}

export interface MuscleGroup {
  img: string;
  id: number;
  name: string;
  image_url: string | null;
  exercises: Exercise[];
}

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
}

export default async function getAllMuscles(): Promise<{
  muscles: MuscleGroup[];
}> {
  console.log(
    "process.env.NEXT_PUBLIC_BACKEND_URL",
    process.env.NEXT_PUBLIC_BACKEND_URL
  );
  // TODO later will be replaced withe clientAxios once the backend is ready
  try {
    const response: AxiosResponse<FetchedMusclesResponse> = await axios.get(
      `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/v1/workouts/`
    );
    // let print first 10 muscles

    const muscles = response.data.muscleGroups;
    return { muscles };
  } catch (error) {
    console.error("Error in getAllMuscles:", error);
    if (axios.isAxiosError(error)) {
      console.error("Axios error details:", {
        status: error.response?.status,
        data: error.response?.data,
        config: {
          url: error.config?.url,
          method: error.config?.method,
        },
      });
    }
    throw error; // Let the component handle the error
  }
}
