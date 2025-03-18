"use server";

import { revalidatePath } from "next/cache";
import { OpenAIApi } from "openai";
import { z } from "zod";

const RefineWorkoutSchema = z.object({
  initialPrompt: z.string(),
  currentWorkout: z.string(),
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
  workout?: string; 
  error?: string;
}> {
  try {
    // Validate input
    const validatedData = RefineWorkoutSchema.parse(input);
    
    // Initialize OpenAI client (use your actual implementation)
    const openai = new OpenAIApi(/* your config */);
    
    // Format conversation history for the AI
    const formattedHistory = validatedData.conversationHistory.map(entry => ({
      role: entry.type === "ai" ? "assistant" : "user",
      content: entry.message
    }));
    
    // Add the new feedback message
    formattedHistory.push({
      role: "user",
      content: validatedData.feedback
    });
    
    // Initial system message with context
    const systemMessage = {
      role: "system",
      content: `You are a fitness coach AI that creates personalized workout plans. 
      The user has provided initial requirements and feedback on your previous suggestion. 
      Based on their feedback, refine the workout plan. Original request: ${validatedData.initialPrompt}`
    };
    
    // Get response from AI
    const completion = await openai.chat.completions.create({
      model: "gpt-4",
      messages: [systemMessage, ...formattedHistory],
      temperature: 0.7,
      max_tokens: 1500,
    });
    
    const refinedWorkout = completion.choices[0]?.message?.content || "";
    
    // Update cache to reflect changes
    revalidatePath("/assign-custom-workout-ai");
    
    return {
      success: true,
      workout: refinedWorkout
    };
  } catch (error) {
    console.error("Error refining workout:", error);
    return {
      success: false,
      error: error instanceof Error ? error.message : "Failed to refine workout"
    };
  }
}
