"use server";

import { TrainerReqConfig } from "@/lib/AxiosInstance/trainerAxios";
import type { WorkoutPlan } from "./generate-ai-workout";

export async function assignWorkoutPlan(userId: string, workoutPlanId: number) {
  const trainerAxios = await TrainerReqConfig();

  try {
    const response = await trainerAxios.post("/workouts/assignworkoutplan", {
      userId,
      workoutPlanId,
    });

    if (response.data.msg === "success") {
      return {
        success: true,
      };
    }

    throw new Error(response.data.error || "Failed to assign workout plan");
  } catch (error) {
    console.error("Error assigning workout plan:", error);
    throw error;
  }
}

interface WorkoutPlanInfo {
  id: number;
  name: string;
  description: string | null;
}

export interface CustomWorkoutPlanResponse {
  success: boolean;
  workoutPlanId: number;
  msg: string;
  error?: string;
  previousPlan: WorkoutPlanInfo | null;
  newPlan: WorkoutPlanInfo;
}

/**
 * Assigns a custom AI-generated workout plan to a user
 */
export async function assignCustomWorkoutPlan(
  userId: string,
  workoutPlan: WorkoutPlan
): Promise<CustomWorkoutPlanResponse> {
  const trainerAxios = await TrainerReqConfig();

  try {
    // Create and assign a workout plan to the user in one request
    const response = await trainerAxios.post(
      "/workouts/customworkoutplan",
      {
        userId,
        workoutPlan: {
          name: workoutPlan.name,
          description: workoutPlan.description,
          schedules: workoutPlan.schedules.map((schedule) => ({
            dayOfWeek: schedule.dayOfWeek,
            muscleTarget: schedule.muscleTarget,
            duration: schedule.duration,
            calories: schedule.calories,
            exercises: schedule.exercises.map((exercise) => ({
              name: exercise.name,
              sets: exercise.sets,
              reps: exercise.reps,
              description: exercise.description,
              order: exercise.order,
            })),
          })),
        },
      }
    );

    if (!response.data.success) {
      throw new Error(
        response.data.error || "Failed to create and assign custom workout plan"
      );
    }

    return {
      success: true,
      workoutPlanId: response.data.workoutPlanId,
      msg: response.data.msg,
      previousPlan: response.data.previousPlan,
      newPlan: response.data.newPlan
    };
  } catch (error) {
    console.error("Error assigning custom workout plan:", error);
    return {
      success: false,
      workoutPlanId: -1,
      msg: "Failed to assign workout plan",
      error: error instanceof Error ? error.message : "Unknown error",
      previousPlan: null,
      newPlan: { id: -1, name: "", description: null }
    };
  }
}
