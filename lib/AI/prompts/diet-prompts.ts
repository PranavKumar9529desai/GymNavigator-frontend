import type { DietPlan } from '@/app/dashboard/trainer/diet/assigndietplan/_actions /GetallDiets';
import type { AssignedUser } from '@/app/dashboard/trainer/workouts/assignworkout/GetuserassignedTotrainers';

// Define interface for HealthProfile to properly type the properties
interface HealthProfile {
	height?: number;
	weight?: number;
	gender?: string;
	goal?: string;
}

/**
 * Generate a diet plan for a user based on their profile and trainer preferences
 */
export function buildDietPlanPrompt(
	user: AssignedUser,
	preferences: {
		dailyCalories?: number;
		mealsPerDay?: number;
		dietType?: string;
		restrictions?: string[];
		goal?: 'weight_loss' | 'maintenance' | 'muscle_gain';
		proteinTarget?: 'high' | 'moderate' | 'low';
		specialInstructions?: string;
	},
) {
	const {
		dailyCalories,
		mealsPerDay = 5,
		dietType = 'balanced',
		restrictions = [],
		goal = 'maintenance',
		proteinTarget = 'moderate',
		specialInstructions = '',
	} = preferences;

	// Extract health profile data safely with proper typing
	const healthProfile = (user.HealthProfile || {}) as HealthProfile;
	const height = healthProfile.height || 'Unknown';
	const weight = healthProfile.weight || 'Unknown';
	const gender = healthProfile.gender || user.gender || 'Unknown';
	const userGoal = healthProfile.goal || user.goal || 'General fitness';

	// Calculate daily calories if not provided
	const calculatedCalories =
		dailyCalories ||
		(gender.toLowerCase() === 'male'
			? Math.round(
					(typeof weight === 'number' ? weight : 70) * 10 +
						(typeof height === 'number' ? height : 170) * 6.25 -
						5 * 25 +
						5,
				) * 1.55
			: Math.round(
					(typeof weight === 'number' ? weight : 60) * 10 +
						(typeof height === 'number' ? height : 160) * 6.25 -
						5 * 25 -
						161,
				) * 1.55);

	// Adjust calories based on goal
	const adjustedCalories =
		goal === 'weight_loss'
			? Math.round(calculatedCalories * 0.8)
			: goal === 'muscle_gain'
				? Math.round(calculatedCalories * 1.1)
				: calculatedCalories;

	// Calculate macros based on protein target - fixed variable declarations
	let proteinPercentage: number;
	let carbsPercentage: number;
	let fatsPercentage: number;

	switch (proteinTarget) {
		case 'high':
			proteinPercentage = 40;
			carbsPercentage = 30;
			fatsPercentage = 30;
			break;
		case 'low':
			proteinPercentage = 15;
			carbsPercentage = 60;
			fatsPercentage = 25;
			break;
		// Combined moderate and default since they're the same
		default:
			proteinPercentage = 30;
			carbsPercentage = 40;
			fatsPercentage = 30;
			break;
	}

	return `
Create a personalized diet plan for a client with the following profile:
- Gender: ${gender}
- Weight: ${weight} kg
- Height: ${height} cm
- Fitness goal: ${userGoal}
- Diet goal: ${goal.replace('_', ' ')}

Diet parameters:
- Type: ${dietType}
- Daily calories: ${adjustedCalories} kcal
- Meals per day: ${mealsPerDay}
- Protein target: ${proteinTarget} (${proteinPercentage}%)
- Carbohydrates: ${carbsPercentage}%
- Fats: ${fatsPercentage}%

${restrictions.length ? `Dietary restrictions:\n${restrictions.map((r) => `- ${r}`).join('\n')}` : ''}
${specialInstructions ? `Special instructions: ${specialInstructions}` : ''}

RESPONSE FORMAT:
You must respond with a valid JSON object that strictly follows this schema:
{
  "name": "Name of the diet plan",
  "description": "Brief overview of the diet plan",
  "dailyCalories": ${adjustedCalories},
  "proteinPercentage": ${proteinPercentage},
  "carbsPercentage": ${carbsPercentage},
  "fatsPercentage": ${fatsPercentage},
  "meals": [
    {
      "name": "Meal name (e.g., Breakfast)",
      "timeOfDay": "Time of day (e.g., 8:00 AM)",
      "totalCalories": 500, // Calories for this meal
      "items": [
        {
          "name": "Food item",
          "portion": "Portion size (e.g., '1 cup')",
          "calories": 200, // Calories for this item
          "protein": 20, // Protein in grams
          "carbs": 30, // Carbs in grams
          "fats": 5, // Fats in grams
          "description": "Brief preparation instructions"
        }
        // Include all items in this meal
      ]
    }
    // Include all meals for the day
  ],
  "waterIntake": 2500, // Daily water intake in ml
  "supplements": ["Supplement 1", "Supplement 2"], // Optional supplements
  "notes": "Additional notes about the diet plan" // Optional notes
}

IMPORTANT:
1. Respond ONLY with the JSON. No introduction or explanations.
2. Ensure all required fields are included and properly typed.
3. Make sure the total calories across all meals equals the daily calorie target.
4. Ensure macronutrient percentages match the specified targets.
5. Include practical, easy-to-prepare meals that are realistic for daily consumption.
6. Consider the client's dietary restrictions.
`;
}

interface DietGenerationParams {
	dietPreference: string;
	medicalConditions: string[];
	location: string;
	country: string;
	targetCalories?: number;
	specialInstructions?: string;
}

/**
 * Generate a diet plan prompt based on user parameters
 */
export function generateDietPrompt(params: DietGenerationParams): string {
	const {
		dietPreference,
		medicalConditions = [],
		location,
		country,
		targetCalories,
		specialInstructions = '',
	} = params;

	// Format medical conditions for the prompt
	const medicalConditionsText = medicalConditions.length
		? `The user has the following medical conditions to consider: ${medicalConditions.join(', ')}.`
		: '';

	// Format special instructions
	const specialInstructionsText = specialInstructions
		? `Additional requirements: ${specialInstructions}`
		: '';

	// Format target calories
	const caloriesText = targetCalories
		? `with a target caloric intake of ${targetCalories} calories per day`
		: 'with appropriate caloric intake based on standard dietary guidelines';

	return `
Create a personalized diet plan for a client with ${dietPreference} dietary preference, located in ${location}, ${country} ${caloriesText}.
${medicalConditionsText}
${specialInstructionsText}

Consider local food availability and cultural preferences based on the location.

Provide a complete diet plan in JSON format with the following structure:
{
  "name": "Descriptive name for the diet plan",
  "description": "Brief overview of the diet plan and its benefits",
  "targetCalories": number,
  "proteinRatio": number (percentage as decimal),
  "carbsRatio": number (percentage as decimal),
  "fatsRatio": number (percentage as decimal),
  "meals": [
    {
      "id": number,
      "name": "Meal name",
      "timeOfDay": "Time of day (e.g., 'Breakfast', 'Lunch')",
      "calories": number,
      "protein": number (in grams),
      "carbs": number (in grams),
      "fats": number (in grams),
      "instructions": "Brief instructions for meal preparation"
    }
    // Additional meals...
  ]
}

Please ensure the diet plan:
1. Respects the specified dietary preferences
2. Accounts for any medical conditions
3. Includes locally available ingredients
4. Provides balanced nutrition
5. Is culturally appropriate for the location
`;
}

/**
 * Generate feedback-based improvements to a diet plan
 */
export function buildDietFeedbackPrompt(
	originalPlan: DietPlan,
	feedback: string,
): string {
	return `
I previously generated this diet plan:
${JSON.stringify(originalPlan, null, 2)}

The trainer provided this feedback:
"${feedback}"

Please adjust the diet plan to address this feedback. Maintain the same JSON structure as the original plan:
{
  "name": "Plan name",
  "description": "Plan description",
  "targetCalories": number,
  "proteinRatio": number,
  "carbsRatio": number,
  "fatsRatio": number,
  "meals": [
    {
      "id": number,
      "name": "Meal name",
      "timeOfDay": "Time of day",
      "calories": number,
      "protein": number,
      "carbs": number,
      "fats": number,
      "instructions": "Instructions"
    }
  ]
}

IMPORTANT:
1. Respond ONLY with the updated JSON. No explanation needed.
2. Keep the same structure but modify the content based on feedback.
3. Ensure all fields from the original plan remain in the response.
`;
}
