import { z } from "zod";

export const dietGenerationSchema = z.object({
  dietPreference: z.string(),
  medicalConditions: z.array(z.string()),
  location: z.string(),
  country: z.string(),
  targetCalories: z.number().optional(),
  specialInstructions: z.string().optional(),
});

export type DietGenerationParams = z.infer<typeof dietGenerationSchema>;
