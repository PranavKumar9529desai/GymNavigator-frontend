"use server";

import { ClientReqConfig } from "@/lib/AxiosInstance/clientAxios";
import type { AxiosResponse } from "axios";

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

export interface Workout {
  id: string;
  name: string;
  description: string;
  trainerId: string;
  createdAt: string;
  updatedAt: string;
  exercises: WorkoutExercise[];
}

export interface AssignedWorkout {
  id: string;
  workoutId: string;
  clientId: string;
  assignedDate: string;
  completedDate: string | null;
  isCompleted: boolean;
  workout: Workout;
}

// Backend API Response type
interface ApiResponse {
  success: boolean;
  msg: string;
  data?: {
    assignedWorkouts: AssignedWorkout[];
  };
  error?: string;
}

export const getTodaysWorkout = async (): Promise<AssignedWorkout[]> => {
  try {
    const clientAxios = await ClientReqConfig();
    
    // Log the request for debugging
    console.log("Fetching today's workouts...");
    
    const response: AxiosResponse<ApiResponse> = await clientAxios.get("/workout/myworkouts/get-todays-workout");
    
    // Log the raw response to see its structure
    console.log("Raw API response:", response.data);
    
    // Check for response structure
    if (!response.data) {
      console.error("Invalid API response");
      throw new Error("Failed to fetch today's workout");
    }
    
    // Return the workouts array (empty or not) along with the message
    return response.data.data?.assignedWorkouts || [];
  } catch (error) {
    console.error("Error fetching today's workouts:", error);
    throw error;
  }
};
