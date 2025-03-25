import { z } from 'zod';

export const dietGenerationSchema = z.object({
  dietPreference: z.string().min(1, { message: "Diet preference is required" }),
  medicalConditions: z.array(z.string()).min(1, { message: "At least one medical condition must be selected" }),
  location: z.string().min(1, { message: "Location is required" }),
  country: z.string().min(1, { message: "Country is required" }),
  targetCalories: z.number().positive({ message: "Target calories must be a positive number" }),
  specialInstructions: z.string().optional(),
});

export type DietGenerationParams = z.infer<typeof dietGenerationSchema>;
