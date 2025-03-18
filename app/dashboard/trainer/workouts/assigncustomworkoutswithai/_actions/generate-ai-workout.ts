"use server";

import { 
  generateStructuredContent, 
  validateResponseWithSchema 
} from "@/lib/AI";
import { WorkoutPlanSchema } from "@/lib/AI/types/workout-types";
import { generateWorkoutPrompt } from "@/lib/AI/prompts/workout-prompts";
import type { z } from "zod";

// Define the expected schema for workout plans
export interface Exercise {
  id?: number;
  name: string;
  sets: number;
  reps: string;
  description: string;
  order: number;
}

export interface WorkoutSchedule {
  id?: number;
  dayOfWeek: string;
  muscleTarget: string;
  duration: number;
  calories: number;
  exercises: Exercise[];
}

export interface WorkoutPlan {
  id?: number;
  name: string;
  description: string | null;
  schedules: WorkoutSchedule[];
}

export interface WorkoutGenerationParams {
  userId: string;
  goals: string;
  fitnessLevel: string;
  preferredDays?: string[];
  focusAreas?: string[];
  healthConditions?: string[];
  workoutDuration?: number;
  equipment?: string[];
  specialInstructions?: string;
}

/**
 * Generates a personalized workout plan using AI based on user parameters
 */
export async function generateAiWorkout(params: WorkoutGenerationParams): Promise<{
  success: boolean;
  workoutPlan?: WorkoutPlan;
  error?: string;
}> {
  try {
    // Generate prompt based on parameters
    const prompt = generateWorkoutPrompt(params);
    
    // Generate structured content with AI
    const result = await generateStructuredContent<z.infer<typeof WorkoutPlanSchema>>(
      prompt,
      (response) => validateResponseWithSchema(response, WorkoutPlanSchema),
      {
        provider: 'gemini', // Or 'openai' based on preference
        maxAttempts: 3,
        temperature: 0.7,
      }
    );
    
    if (result.success && result.data) {
      // Transform the result to match our interface
      const workoutPlan: WorkoutPlan = {
        ...result.data,
        id: 0, // Will be assigned by backend when saved
      };
      
      return {
        success: true,
        workoutPlan,
      };
    }
    
    return {
      success: false,
      error: "Failed to generate a valid workout plan",
    };
  } catch (error) {
    console.error("Error generating AI workout plan:", error);
    return {
      success: false,
      error: error instanceof Error ? error.message : "Failed to generate AI workout plan",
    };
  }
}
