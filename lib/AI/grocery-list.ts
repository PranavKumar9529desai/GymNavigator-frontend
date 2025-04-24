'use server';

import { generateStructuredContent, generateWithGemini } from './client';
import {
	type GroceryListResponse,
	buildGroceryListPrompt,
	validateGroceryList,
} from './prompts/grocery-list-prompts';
import type { DietPlan } from './types/diet-types';

/**
 * Generate a grocery list from a diet plan using AI
 */
export async function generateGroceryList(
	dietPlans: DietPlan[],
	timeFrame: 'weekly' | 'monthly',
): Promise<GroceryListResponse> {
	try {
		// Build the prompt for generating a grocery list
		const prompt = buildGroceryListPrompt(dietPlans, timeFrame);

		// Add extra safeguards to ensure we get valid JSON
		const enhancedPrompt = `${prompt}\n\nREMEMBER: Your response must be ONLY the raw JSON object with no backticks, no code blocks, no explanations.`;

		// First try with additional JSON safeguard
		try {
			const result = await generateStructuredContent<GroceryListResponse>(
				enhancedPrompt,
				validateGroceryList,
				{
					temperature: 0.2, // Lower temperature for more consistent, logical output
					maxAttempts: 3,
				},
			);

			if (result.success && result.data) {
				return result.data;
			}
		} catch (firstAttemptError) {
			console.warn(
				'First attempt failed, trying fallback approach:',
				firstAttemptError,
			);
		}

		// Fallback approach with explicit JSON wrapping
		const fallbackPrompt = `${prompt}\n\nNOTE: I am having trouble parsing your JSON response. Please make sure to return ONLY a valid JSON object with no markdown, no backticks, no code blocks.`;

		try {
			// Try direct generation with explicit post-processing
			const rawResponse = await generateWithGemini(fallbackPrompt, {
				temperature: 0.1, // Even lower temperature for more predictable output
			});

			// Log the raw response to help with debugging
			if (rawResponse) {
				console.log(
					'Raw Gemini response:',
					`${rawResponse.substring(0, 100)}...`,
				);

				// Validate and parse manually
				const validationResult = validateGroceryList(rawResponse);

				if (validationResult.valid && validationResult.data) {
					return validationResult.data;
				}
				throw new Error(
					`Validation failed: ${JSON.stringify(validationResult.errors)}`,
				);
			}
			throw new Error('Received null response from Gemini');
		} catch (fallbackError) {
			console.error('Fallback approach also failed:', fallbackError);
			throw fallbackError;
		}
	} catch (error) {
		console.error('Error generating grocery list:', error);
		// Return a basic empty structure so the UI doesn't crash
		return {
			categories: [
				{
					id: 'error',
					name: 'Error generating grocery list',
					items: [
						{
							name: 'Please try again later',
							quantity: 1,
							unit: '',
							notes: error instanceof Error ? error.message : 'Unknown error',
						},
					],
				},
			],
		};
	}
}
