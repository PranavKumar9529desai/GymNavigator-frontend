import type { HealthProfile } from '@/app/dashboard/trainer/diet/dietassignedusers/assigndietplanwithai2/_actions/get-healthprofile-by-id';
import { z } from 'zod';

export const dietGenerationSchema = z.object({
	healthProfile: z.custom<HealthProfile>(),
	dietPreference: z.string().min(1, { message: 'Diet preference is required' }),
	medicalConditions: z
		.array(z.string())
		.min(1, { message: 'At least one medical condition must be selected' }),
	location: z.string().min(1, { message: 'Location is required' }),
	country: z.string().min(1, { message: 'Country is required' }),
	state: z.string().min(1, { message: 'State is required' }),
	targetCalories: z
		.number()
		.positive({ message: 'Target calories must be a positive number' }),
	specialInstructions: z.string(),
});

export type DietGenerationParams = z.infer<typeof dietGenerationSchema>;
