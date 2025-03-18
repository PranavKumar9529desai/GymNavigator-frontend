"use server";

import { generateStructuredContent, validateResponseWithSchema } from "@/lib/AI";
import { generateFeedbackPrompt } from "@/lib/AI/prompts/workout-prompts";
import { WorkoutPlanSchema } from "@/lib/AI/types/workout-types";
import { revalidatePath } from "next/cache";
import { z } from "zod";
import type { z as zod } from "zod";
import type { WorkoutPlan } from "./generate-ai-workout";

const RefineWorkoutSchema = z.object({
  userId: z.string(),
  originalWorkoutPlan: z.any(), // This should be WorkoutPlan type but using any for flexibility
  feedback: z.string().min(1, "Feedback is required"),
  conversationHistory: z.array(z.object({
    type: z.enum(["ai", "user"]),
    message: z.string(),
    timestamp: z.date()
  }))
});

type RefineWorkoutInput = z.infer<typeof RefineWorkoutSchema>;

export async function refineWorkout(input: RefineWorkoutInput): Promise<{ 
  success: boolean; 
  workoutPlan?: WorkoutPlan; 
  error?: string;
}> {
  try {
    // Validate input
    const validatedData = RefineWorkoutSchema.parse(input);
    
    // Format conversation history for context
    const conversationContext = validatedData.conversationHistory
      .map(entry => `${entry.type === "ai" ? "AI" : "Trainer"}: ${entry.message}`)
      .join("\n\n");
    
    // Generate prompt with context
    const prompt = generateFeedbackPrompt({
      userId: validatedData.userId,
      originalWorkoutPlan: validatedData.originalWorkoutPlan,
      feedback: validatedData.feedback,
      conversationHistory: conversationContext
    });
    
    // Generate updated workout plan
    const result = await generateStructuredContent<zod.infer<typeof WorkoutPlanSchema>>(
      prompt,
      (response) => validateResponseWithSchema(response, WorkoutPlanSchema),
      {
        provider: 'gemini', // Or 'openai' based on your configuration
        maxAttempts: 3,
        temperature: 0.7,
      }
    );
    
    if (result.success && result.data) {
      // Transform the result to match our interface
      const refinedWorkoutPlan: WorkoutPlan = {
        ...result.data,
        // Preserve original ID if it exists
        id: validatedData.originalWorkoutPlan.id || 0,
        // Keep original name unless modified in the feedback
        name: result.data.name || validatedData.originalWorkoutPlan.name,
      };
      
      // Update cache to reflect changes
      revalidatePath("/dashboard/trainer/workouts/assigncustomworkoutswithai");
      
      return {
        success: true,
        workoutPlan: refinedWorkoutPlan
      };
    }
    
    return {
      success: false,
      error: "Failed to generate a refined workout plan"
    };
    
  } catch (error) {
    console.error("Error refining workout:", error);
    return {
      success: false,
      error: error instanceof Error ? error.message : "Failed to refine workout"
    };
  }
}
