'use server';

import { GoogleGenerativeAI } from '@google/generative-ai';
import type { Message } from 'ai';
import { v4 as uuidv4 } from 'uuid';

// Get API key with fallbacks for different environment variable names
const geminiApiKey = process.env.GOOGLE_GEMINI_API_KEY || '';

// Initialize AI providers
const genAI = new GoogleGenerativeAI(geminiApiKey);

/**
 * Fetch and log available Gemini models using the REST API
 */
export async function logAvailableGeminiModels() {
	try {
		const apiKey = process.env.GOOGLE_GEMINI_API_KEY;
		if (!apiKey) {
			console.error('No Gemini API key found.');
			return;
		}
		const url = `https://generativelanguage.googleapis.com/v1beta/models?key=${apiKey}`;
		const res = await fetch(url);
		if (!res.ok) {
			console.error('Failed to fetch models:', res.status, res.statusText);
			return;
		}
		const data = await res.json();
		console.log(
			'Available Gemini models:',
			data.models?.map(
				(m: { name: string; displayName?: string; description?: string }) => ({
					name: m.name,
					displayName: m.displayName,
					description: m.description,
				}),
			),
		);
	} catch (error) {
		console.error('Error fetching Gemini models:', error);
	}
}

// Call this for debugging on startup
// Un comment this to see the available models
// logAvailableGeminiModels();

/**
 * Generate content with Gemini model
 */
export async function generateWithGemini(
	prompt: string,
	options?: {
		temperature?: number;
		maxOutputTokens?: number;
	},
) {
	try {
		if (!geminiApiKey) {
			throw new Error(
				'Gemini API key is not configured. Please check your environment variables.',
			);
		}

		const modelName = 'gemini-2.0-flash-lite';

		const model = genAI.getGenerativeModel({
			model: modelName,
			generationConfig: {
				temperature: options?.temperature || 0.4,
				topK: 32,
				topP: 0.95,
				maxOutputTokens: options?.maxOutputTokens || 4096,
			},
		});

		console.log(`Trying to generate content with ${modelName} model...`);

		try {
			const result = await model.generateContent(prompt);
			return result.response.text();
		} catch (modelError: unknown) {
			console.log('modelError', modelError);
			console.log(`${modelName} failed, trying gemini-2.0-flash...`);
			const fallbackModel = genAI.getGenerativeModel({
				model: 'gemini-2.0-flash',
				generationConfig: {
					temperature: options?.temperature || 0.4,
					topK: 32,
					topP: 0.95,
					maxOutputTokens: options?.maxOutputTokens || 2048,
				},
			});

			const fallbackResult = await fallbackModel.generateContent(prompt);
			return fallbackResult.response.text();
		}
	} catch (error) {
		console.error('Gemini API error details:', error);
		throw new Error(
			`Failed to generate content with Gemini: ${
				error instanceof Error ? error.message : 'Unknown error'
			}`,
		);
	}
}

/**
 * Generate structured content with retry logic
 */
export async function generateStructuredContent<T>(
	prompt: string,
	validateFn: (data: string) => { valid: boolean; data?: T; errors?: unknown },
	options?: {
		maxAttempts?: number;
		temperature?: number;
	},
) {
	const maxAttempts = options?.maxAttempts || 3;
	let attempts = 0;
	let lastResponse = '';
	let currentPrompt = prompt;

	while (attempts < maxAttempts) {
		attempts++;
		try {
			const response = await generateWithGemini(currentPrompt, {
				temperature: options?.temperature,
			});

			lastResponse = response as string;

			const validation = validateFn(lastResponse || '');

			if (validation.valid && validation.data) {
				console.log('Validation passed: form the AI', validation.data);
				return {
					success: true,
					data: validation.data,
					attempts,
				};
			}

			currentPrompt = `
I tried to generate a structured response but received these errors:
${JSON.stringify(validation.errors || 'Invalid format')}

Please fix these issues and provide a response that strictly follows the specified format.

Original prompt:
${prompt}
`;
		} catch (error) {
			console.error(`Error on attempt ${attempts}:`, error);
		}
	}

	throw new Error(
		`Failed to generate valid structured content after ${maxAttempts} attempts. Last response: ${lastResponse}`,
	);
}

/**
 * Generate with feedback for iterative improvement
 */
export async function regenerateWithFeedback<T>(
	originalPrompt: string,
	originalResponse: unknown,
	feedback: string,
	validateFn: (data: string) => { valid: boolean; data?: T; errors?: unknown },
	options?: {
		temperature?: number;
	},
) {
	const feedbackPrompt = `
I previously generated this response:
${JSON.stringify(originalResponse, null, 2)}

Based on this feedback:
"${feedback}"

I need to create an improved version that addresses this feedback while maintaining the same structure.
Please provide a complete response that incorporates the feedback.

Original request:
${originalPrompt}
`;

	try {
		const response = await generateWithGemini(feedbackPrompt, {
			temperature: options?.temperature || 0.5,
		});

		const validation = validateFn(response || '');

		if (validation.valid && validation.data) {
			console.log('Validation passed:', validation.data);
			return {
				success: true,
				data: validation.data,
			};
		}

		throw new Error('Generated response did not pass validation');
	} catch (error) {
		console.error('Error regenerating with feedback:', error);
		throw new Error('Failed to regenerate content based on feedback');
	}
}
