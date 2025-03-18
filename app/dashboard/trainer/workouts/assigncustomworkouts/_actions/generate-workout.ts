'use server';

import { generateStructuredContent } from '@/lib/AI/client';
import { validateResponseWithSchema } from '@/lib/AI/schema-validation';
import { WorkoutPlanSchema, type WorkoutPlan } from '@/lib/AI/types/workout-types';
import { buildWorkoutPlanPrompt } from '@/lib/AI/prompts/workout-prompts';
import { getUserById } from '@/app/dashboard/trainer/assignedusers/_actions/get-user';

export interface WorkoutGenerationParams {
  userId: string;
  focusAreas?: string[];
  daysPerWeek?: number;
  sessionDuration?: number;
  equipment?: string[];
  intensity?: 'beginner' | 'intermediate' | 'advanced';
  specialInstructions?: string;
}

export async function generateWorkoutPlan(params: WorkoutGenerationParams) {
  try {
    const { userId, ...preferences } = params;
    
    // Fetch user data
    const user = await getUserById(userId);
    if (!user) {
      throw new Error(`User with ID ${userId} not found`);
    }
    
    // Build prompt with user data and trainer preferences
    const prompt = buildWorkoutPlanPrompt(user, preferences);
    
    // Generate structured workout plan with retry logic
    const result = await generateStructuredContent<WorkoutPlan>(
      prompt,
      (response) => validateResponseWithSchema(response, WorkoutPlanSchema),
      { 
        provider: 'gemini', 
        maxAttempts: 3,
        temperature: 0.4 
      }
    );
    
    return {
      success: true,
      workoutPlan: result.data,
      attempts: result.attempts,
    };
  } catch (error) {
    console.error('Error generating workout plan:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'An unknown error occurred',
    };
  }
}

export async function regenerateWorkoutWithFeedback(
  originalPlan: WorkoutPlan, 
  feedback: string, 
  userId: string
) {
  // Implementation for regenerating with feedback
  // Similar to the generateWorkoutPlan but using the feedback-specific prompt
  // ...
}
