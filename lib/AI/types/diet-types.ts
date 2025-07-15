import { z } from 'zod';

// Interface for a single meal in the diet plan
export interface Meal {
  id: number;
  name: string;
  timeOfDay: string;
  calories: number;
  protein: number;
  carbs: number;
  fats: number;
  instructions: string;
}

// Interface for a single day's diet plan
export interface DietPlan {
  id: number;
  name: string;
  description?: string;
  targetCalories: number;
  proteinRatio: number;
  carbsRatio: number;
  fatsRatio: number;
  meals: Meal[];
}

// Interface for diet plans organized by day
export interface DietPlansByDay {
  [day: string]: DietPlan;
}

// Interface for location information
export interface LocationInfo {
  country: string;
  state: string;
}

// Zod schema for validating the weekly diet plan response from AI
export const WeeklyDietPlanSchema = z.object({
  Monday: z.object({
    name: z.string(),
    description: z.string().optional(),
    targetCalories: z.number(),
    proteinRatio: z.number(),
    carbsRatio: z.number(),
    fatsRatio: z.number(),
    meals: z.array(
      z.object({
        name: z.string(),
        timeOfDay: z.string(),
        calories: z.number(),
        protein: z.number(),
        carbs: z.number(),
        fats: z.number(),
        instructions: z.string(),
      })
    ),
  }),
  Tuesday: z.object({
    name: z.string(),
    description: z.string().optional(),
    targetCalories: z.number(),
    proteinRatio: z.number(),
    carbsRatio: z.number(),
    fatsRatio: z.number(),
    meals: z.array(
      z.object({
        name: z.string(),
        timeOfDay: z.string(),
        calories: z.number(),
        protein: z.number(),
        carbs: z.number(),
        fats: z.number(),
        instructions: z.string(),
      })
    ),
  }),
  Wednesday: z.object({
    name: z.string(),
    description: z.string().optional(),
    targetCalories: z.number(),
    proteinRatio: z.number(),
    carbsRatio: z.number(),
    fatsRatio: z.number(),
    meals: z.array(
      z.object({
        name: z.string(),
        timeOfDay: z.string(),
        calories: z.number(),
        protein: z.number(),
        carbs: z.number(),
        fats: z.number(),
        instructions: z.string(),
      })
    ),
  }),
  Thursday: z.object({
    name: z.string(),
    description: z.string().optional(),
    targetCalories: z.number(),
    proteinRatio: z.number(),
    carbsRatio: z.number(),
    fatsRatio: z.number(),
    meals: z.array(
      z.object({
        name: z.string(),
        timeOfDay: z.string(),
        calories: z.number(),
        protein: z.number(),
        carbs: z.number(),
        fats: z.number(),
        instructions: z.string(),
      })
    ),
  }),
  Friday: z.object({
    name: z.string(),
    description: z.string().optional(),
    targetCalories: z.number(),
    proteinRatio: z.number(),
    carbsRatio: z.number(),
    fatsRatio: z.number(),
    meals: z.array(
      z.object({
        name: z.string(),
        timeOfDay: z.string(),
        calories: z.number(),
        protein: z.number(),
        carbs: z.number(),
        fats: z.number(),
        instructions: z.string(),
      })
    ),
  }),
  Saturday: z.object({
    name: z.string(),
    description: z.string().optional(),
    targetCalories: z.number(),
    proteinRatio: z.number(),
    carbsRatio: z.number(),
    fatsRatio: z.number(),
    meals: z.array(
      z.object({
        name: z.string(),
        timeOfDay: z.string(),
        calories: z.number(),
        protein: z.number(),
        carbs: z.number(),
        fats: z.number(),
        instructions: z.string(),
      })
    ),
  }),
  Sunday: z.object({
    name: z.string(),
    description: z.string().optional(),
    targetCalories: z.number(),
    proteinRatio: z.number(),
    carbsRatio: z.number(),
    fatsRatio: z.number(),
    meals: z.array(
      z.object({
        name: z.string(),
        timeOfDay: z.string(),
        calories: z.number(),
        protein: z.number(),
        carbs: z.number(),
        fats: z.number(),
        instructions: z.string(),
      })
    ),
  }),
});

// Type for a weekly diet plan object
export type WeeklyDietPlan = z.infer<typeof WeeklyDietPlanSchema>;

// Validation helper for weekly diet plan
export function validateWeeklyDietPlanResponse(response: string) {
  try {
    let jsonData: Record<string, unknown> | null = null;
    try {
      jsonData = JSON.parse(response);
    } catch (_e) {
      const codeBlockMatch = response.match(/```(?:json)?\s*([\s\S]*?)\s*```/);
      if (codeBlockMatch?.[1]) {
        jsonData = JSON.parse(codeBlockMatch[1]);
      } else {
        const jsonMatch = response.match(/{[\s\S]*}/);
        if (jsonMatch) {
          jsonData = JSON.parse(jsonMatch[0]);
        }
      }
    }
    if (!jsonData) {
      return { valid: false, errors: 'No valid JSON found in response' };
    }
    const result = WeeklyDietPlanSchema.safeParse(jsonData);
    if (result.success) {
      return { valid: true, data: result.data };
    }
    return { valid: false, errors: result.error };
  } catch (error) {
    console.error('Weekly diet plan validation error:', error);
    return { valid: false, errors: error };
  }
}
