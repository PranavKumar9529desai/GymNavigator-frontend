import { z } from 'zod';

// Zod schemas
export const MealItemSchema = z.object({
  name: z.string().min(1, "Meal item name is required"),
  portion: z.string().min(1, "Portion size is required"),
  calories: z.number().min(1, "Calorie information is required"),
  protein: z.number().min(0, "Protein must be non-negative"),
  carbs: z.number().min(0, "Carbs must be non-negative"),
  fats: z.number().min(0, "Fats must be non-negative"),
  description: z.string().optional(),
});

export const MealSchema = z.object({
  name: z.string().min(1, "Meal name is required"),
  timeOfDay: z.string().min(1, "Time of day is required"),
  totalCalories: z.number().min(1, "Total calories must be provided"),
  items: z.array(MealItemSchema).min(1, "At least one meal item is required"),
});

export const DietPlanSchema = z.object({
  name: z.string().min(3, "Plan name must be at least 3 characters"),
  description: z.string().min(10, "Plan description must be at least 10 characters"),
  dailyCalories: z.number().min(1000, "Daily calories should be at least 1000"),
  proteinPercentage: z.number().min(10).max(70),
  carbsPercentage: z.number().min(10).max(70),
  fatsPercentage: z.number().min(10).max(70),
  meals: z.array(MealSchema).min(3, "At least three meals are required"),
  waterIntake: z.number().min(1500, "Water intake should be at least 1500ml"),
  supplements: z.array(z.string()).optional(),
  notes: z.string().optional(),
});

// TypeScript types (inferred from the Zod schemas)
export type MealItem = z.infer<typeof MealItemSchema>;
export type Meal = z.infer<typeof MealSchema>;
export type DietPlan = z.infer<typeof DietPlanSchema>;

/**
 * Validate a diet plan against the schema
 */
export function validateDietPlan(data: unknown) {
  return DietPlanSchema.safeParse(data);
}
