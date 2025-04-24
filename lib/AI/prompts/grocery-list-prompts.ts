import type { DietPlan, Meal } from '../types/diet-types';

/**
 * Generate a grocery list from a weekly diet plan
 */
export function buildGroceryListPrompt(
	dietPlan: DietPlan[],
	timeFrame: 'weekly' | 'monthly',
) {
	// Format all meals for the prompt
	const mealsList = dietPlan
		.flatMap((plan) =>
			plan.meals.map((meal) => `- ${meal.name}: ${meal.instructions}`),
		)
		.join('\n');

	const _multiplier = timeFrame === 'weekly' ? 1 : 4;

	return `
Generate a comprehensive grocery list based on the following meal plan for a ${timeFrame === 'weekly' ? 'week' : 'month'}:

${mealsList}

RESPONSE FORMAT:
You must respond with a valid JSON object WITHOUT any markdown formatting, code blocks, or backticks.
The JSON must strictly follow this schema:
{
  "categories": [
    {
      "id": "string", // unique identifier like "proteins", "vegetables", "grains", etc.
      "name": "string", // display name like "Proteins", "Vegetables", "Grains", etc.
      "items": [
        {
          "name": "string", // name of the grocery item
          "quantity": number, // estimated quantity needed
          "unit": "string", // unit of measurement (e.g., "g", "kg", "pcs", "bunches")
          "notes": "string" // optional notes about the item (can be empty string)
        }
      ]
    }
  ]
}

IMPORTANT GUIDELINES:
1. Group items into logical categories (proteins, vegetables, fruits, dairy, grains, spices, etc.)
2. Combine ingredients used across multiple meals (e.g., if multiple meals use chicken, sum up the total quantity)
3. Use reasonable units (g, kg, pieces, bunches, etc.) for each item
4. Estimate quantities ${timeFrame === 'weekly' ? 'for one week' : 'for one month (multiply weekly by 4)'}
5. For items where exact quantity may not be relevant (like spices), use appropriate metrics (e.g., "1 bottle" or "1 pack")
6. ONLY respond with PURE JSON - no explanations, markdown, or other text
7. DO NOT wrap your response in backticks, code blocks, or any other formatting
8. Ensure all property names are in double quotes
9. Do not include trailing commas
10. Numbers should not be quoted

CRITICAL: ONLY return the raw, valid JSON object. No explanatory text, no markdown formatting.
`;
}

/**
 * Interface for grocery list response
 */
export interface GroceryListResponse {
	categories: GroceryCategory[];
}

export interface GroceryCategory {
	id: string;
	name: string;
	items: GroceryItem[];
}

export interface GroceryItem {
	name: string;
	quantity: number;
	unit: string;
	notes: string;
}

/**
 * Validate grocery list response
 */
export function validateGroceryList(data: unknown): {
	valid: boolean;
	data?: GroceryListResponse;
	errors?: unknown;
} {
	try {
		// If data is a string, try to parse it as JSON
		let parsedData = data;
		if (typeof data === 'string') {
			// Preprocess string data to extract properly formatted JSON
			let jsonStr = data.trim();

			// Handle markdown code blocks (remove ```json and ```)
			const codeBlockRegex = /```(?:json)?\s*([\s\S]*?)\s*```/;
			const codeBlockMatch = jsonStr.match(codeBlockRegex);
			if (codeBlockMatch?.[1]) {
				jsonStr = codeBlockMatch[1].trim();
			}

			// Remove backticks if the entire string is wrapped in them
			if (jsonStr.startsWith('`') && jsonStr.endsWith('`')) {
				jsonStr = jsonStr.slice(1, -1).trim();
			}

			// Remove non-JSON content before and after JSON object
			const jsonStartIdx = jsonStr.indexOf('{');
			const jsonEndIdx = jsonStr.lastIndexOf('}');

			if (
				jsonStartIdx !== -1 &&
				jsonEndIdx !== -1 &&
				jsonEndIdx > jsonStartIdx
			) {
				jsonStr = jsonStr.substring(jsonStartIdx, jsonEndIdx + 1);
			}

			// Check for common issues in JSON formatting and correct them
			jsonStr = jsonStr
				// Fix trailing commas in arrays and objects
				.replace(/,\s*([\]}])/g, '$1')
				// Ensure property names are double-quoted
				.replace(/([{,]\s*)([a-zA-Z0-9_]+)\s*:/g, '$1"$2":')
				// Fix single quotes to double quotes
				.replace(/'/g, '"');

			try {
				parsedData = JSON.parse(jsonStr);
				console.log('Successfully parsed JSON after preprocessing');
			} catch (e) {
				const parseError = e as Error;
				console.error('Failed to parse preprocessed JSON:', parseError);
				console.error('Preprocessed JSON string:', jsonStr);
				return {
					valid: false,
					errors: `Invalid JSON format after preprocessing: ${parseError.message}`,
				};
			}
		}

		// Basic validation
		const typedData = parsedData as GroceryListResponse;

		if (!typedData || !Array.isArray(typedData.categories)) {
			return { valid: false, errors: 'Missing or invalid categories array' };
		}

		// Validate each category and its items
		for (const category of typedData.categories) {
			if (!category.id || !category.name || !Array.isArray(category.items)) {
				return {
					valid: false,
					errors: `Invalid category: ${JSON.stringify(category)}`,
				};
			}

			for (const item of category.items) {
				if (!item.name || typeof item.quantity !== 'number' || !item.unit) {
					return {
						valid: false,
						errors: `Invalid item in category ${category.name}: ${JSON.stringify(item)}`,
					};
				}
			}
		}

		return { valid: true, data: typedData };
	} catch (error) {
		console.error('Error validating grocery list:', error);
		return { valid: false, errors: error };
	}
}
