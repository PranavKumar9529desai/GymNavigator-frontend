import { z } from 'zod';

// Zod schemas for diet plan validation
export const MealSchema = z.object({
  id: z.number(),
  name: z.string().min(1, 'Meal name is required'),
  timeOfDay: z.string().min(1, 'Time of day is required'),
  calories: z.number().min(1, 'Calories must be provided'),
  protein: z.number().min(0, 'Protein must be non-negative'),
  carbs: z.number().min(0, 'Carbs must be non-negative'),
  fats: z.number().min(0, 'Fats must be non-negative'),
  instructions: z.string(),
});

export const DietPlanSchema = z.object({
  id: z.number().optional(), // Optional for AI generation, required when saved
  name: z.string().min(3, 'Plan name must be at least 3 characters'),
  description: z.string().optional(),
  targetCalories: z.number().min(500, 'Target calories should be at least 500'),
  proteinRatio: z.number().min(0.1).max(0.6), // 10-60% as decimal
  carbsRatio: z.number().min(0.1).max(0.6), // 10-60% as decimal
  fatsRatio: z.number().min(0.1).max(0.6), // 10-60% as decimal
  meals: z.array(MealSchema).min(1, 'At least one meal is required'),
});

// TypeScript types (inferred from the Zod schemas)
export type Meal = z.infer<typeof MealSchema>;
export type DietPlan = z.infer<typeof DietPlanSchema>;

/**
 * Validate a diet plan against the schema
 */
export function validateDietPlan(data: unknown) {
  try {
    // If data is a string, try to parse it as JSON
    let parsedData = data;
    if (typeof data === 'string') {
      try {
        // Clean up the string by removing extra spaces after colons
        const cleanedString = data.replace(/:\s+/g, ': ');
        parsedData = JSON.parse(cleanedString);
      } catch (e) {
        console.error('Failed to parse string data:', e);
      }
    }

    // Additional preprocessing for meal names that might have extra spaces
    if (parsedData && typeof parsedData === 'object' && 'meals' in parsedData) {
      // Use a more specific type
      type PartialDietPlan = {
        meals?: Array<{
          name?: string;
          timeOfDay?: string;
          [key: string]: unknown;
        }>;
        proteinRatio?: number;
        carbsRatio?: number;
        fatsRatio?: number;
        [key: string]: unknown;
      };

      const typedData = parsedData as PartialDietPlan;

      // Clean up any meal names that might have extra spaces
      if (Array.isArray(typedData.meals)) {
        typedData.meals = typedData.meals.map((meal) => {
          if (meal?.name) {
            meal.name = meal.name.trim();
          }
          if (meal?.timeOfDay) {
            meal.timeOfDay = meal.timeOfDay.trim();
          }
          return meal;
        });
      }

      // Ensure ratios sum to approximately 1
      if (
        typedData.proteinRatio !== undefined &&
        typedData.carbsRatio !== undefined &&
        typedData.fatsRatio !== undefined
      ) {
        const sum = typedData.proteinRatio + typedData.carbsRatio + typedData.fatsRatio;
        if (Math.abs(sum - 1) > 0.01) {
          console.warn(`Macro ratios don't sum to 1: ${sum}`);
        }
      }

      parsedData = typedData;
    }

    return DietPlanSchema.safeParse(parsedData);
  } catch (error) {
    console.error('Error preprocessing diet plan data:', error);
    return DietPlanSchema.safeParse(data);
  }
}

/**
 * Checks if the macronutrient ratios sum to approximately 1 (allowing small floating point errors)
 */
export function validateMacroRatios(dietPlan: DietPlan): boolean {
  const { proteinRatio, carbsRatio, fatsRatio } = dietPlan;
  const sum = proteinRatio + carbsRatio + fatsRatio;
  return Math.abs(sum - 1) < 0.01; // Allow for small floating point errors
}
