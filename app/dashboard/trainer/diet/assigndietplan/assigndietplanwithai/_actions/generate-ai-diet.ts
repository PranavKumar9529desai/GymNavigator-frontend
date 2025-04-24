'use server';

import { gethealthprofileById } from '@/app/dashboard/trainer/diet/assigndietplan/assigndietplanwithai2/_actions/get-healthprofile-by-id';
import type { HealthProfile } from '@/app/dashboard/trainer/diet/assigndietplan/assigndietplanwithai2/_actions/get-healthprofile-by-id';
import {
	generateStructuredContent,
	validateResponseWithSchema,
} from '@/lib/AI';
import { generateDietPrompt } from '@/lib/AI/prompts/diet-prompts';
import { DietPlanSchema } from '@/lib/AI/types/diet-types';
import type { z } from 'zod';
import type { DietPlan } from '../../_actions /GetallDiets';
import {
	type DietGenerationParams,
	dietGenerationSchema,
} from '../types/dietGenerationSchema';

// Location information for diet generation
interface LocationInfo {
	country: string;
	state: string;
}

/**
 * Custom validation function to ensure successful parsing of diet plans
 */
function validateDietPlanResponse(response: string) {
	try {
		// First, try to extract JSON from the response
		let jsonData: Record<string, unknown> | null = null;

		// Try parsing directly first
		try {
			jsonData = JSON.parse(response);
		} catch (_e) {
			// Try extracting from code blocks if direct parsing fails
			const codeBlockMatch = response.match(/```(?:json)?\s*([\s\S]*?)\s*```/);
			if (codeBlockMatch?.[1]) {
				jsonData = JSON.parse(codeBlockMatch[1]);
			} else {
				// Try finding a JSON object pattern
				const jsonMatch = response.match(/{[\s\S]*}/);
				if (jsonMatch) {
					jsonData = JSON.parse(jsonMatch[0]);
				}
			}
		}

		if (!jsonData) {
			return { valid: false, errors: 'No valid JSON found in response' };
		}

		// Now validate against the schema
		const result = DietPlanSchema.safeParse(jsonData);

		if (result.success) {
			return { valid: true, data: result.data };
		}

		return { valid: false, errors: result.error };
	} catch (error) {
		console.error('Diet plan validation error:', error);
		return { valid: false, errors: error };
	}
}

/**
 * Generates a personalized diet plan using AI based on user parameters
 */
export async function generateAIDiet(
	userId: string,
	targetCalories?: number,
	specialInstructions?: string,
	locationInfo?: LocationInfo,
): Promise<DietPlan> {
	try {
		// Get the health profile
		const healthProfileResult = await gethealthprofileById(userId);

		if (!healthProfileResult.success || !healthProfileResult.data) {
			throw new Error(
				healthProfileResult.error || 'Failed to fetch health profile',
			);
		}

		const healthProfile = healthProfileResult.data;

		// Get location information
		const location = locationInfo?.state
			? `${locationInfo.state}, ${locationInfo.country}`
			: 'Not specified';
		const country = locationInfo?.country || 'Not specified';
		const state = locationInfo?.state || '';

		// Calculate default target calories based on health profile if not provided
		const calculatedCalories = targetCalories ?? 2000;

		// Prepare generation parameters
		const generationParams: DietGenerationParams = {
			healthProfile,
			dietPreference:
				healthProfile.dietaryPreference || 'No specific preference',
			medicalConditions: Array.isArray(healthProfile.medicalConditions)
				? typeof healthProfile.medicalConditions === 'string'
					? [healthProfile.medicalConditions]
					: healthProfile.medicalConditions.map((condition) =>
							typeof condition === 'string' ? condition : condition.name,
						)
				: ['None'],
			location,
			country,
			state,
			targetCalories: calculatedCalories,
			specialInstructions:
				specialInstructions || 'No special instructions provided',
		};

		// Generate prompt for AI
		const prompt = generateDietPrompt(generationParams);

		// Generate structured response using AI
		const response = await generateStructuredContent<
			z.infer<typeof DietPlanSchema>
		>(prompt, validateDietPlanResponse, {
			provider: 'gemini',
			temperature: 0.7,
			maxAttempts: 3,
		});

		if (!response || !response.success || !response.data) {
			console.error('Failed to generate diet plan - no valid response');
			throw new Error('Failed to generate diet plan');
		}

		// Transform the result to match our interface
		const aiGeneratedDiet = response.data;
		const dietPlan: DietPlan = {
			id: -1, // Temporary ID that will be replaced when saved to database
			name: aiGeneratedDiet.name,
			description: aiGeneratedDiet.description,
			targetCalories: aiGeneratedDiet.targetCalories,
			proteinRatio: aiGeneratedDiet.proteinRatio,
			carbsRatio: aiGeneratedDiet.carbsRatio,
			fatsRatio: aiGeneratedDiet.fatsRatio,
			meals: aiGeneratedDiet.meals.map((meal, index) => ({
				...meal,
				id: meal.id || index + 1, // Use existing ID or generate one based on index
			})),
		};

		return dietPlan;
	} catch (error) {
		console.error('Error generating diet plan:', error);
		throw error;
	}
}
