'use server';

import { generateStructuredContent } from '@/lib/AI';
import {
	Meal,
	DietPlan,
	DietPlansByDay,
	LocationInfo,
	WeeklyDietPlanSchema,
	validateWeeklyDietPlanResponse,
} from '@/lib/AI/types/diet-types';
import { TrainerReqConfig } from '@/lib/AxiosInstance/trainerAxios';
import { z } from 'zod';
import { gethealthprofileById } from './get-healthprofile-by-id';

/**
 * Generates diet plans for the entire week in a single API call
 * Uses Gemini's ability to handle large outputs
 */
export async function generateDietWithAI2(
	userId: string,
	_days?: string[],
	location?: LocationInfo,
): Promise<{ success: boolean; data?: DietPlansByDay; error?: string }> {
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
		const locationString = location?.state
			? `${location.state}, ${location.country}`
			: 'Not specified';
		const country = location?.country || 'Not specified';
		const state = location?.state || '';

		// Generate prompt for weekly diet plan
		const prompt = `
Create a comprehensive weekly diet plan (Monday through Sunday) for a client with the following health profile:

Basic Information:
- Gender: ${healthProfile.gender || 'Unknown'}
- Age: ${healthProfile.age || 'Unknown'}
- Weight: ${healthProfile.weightValue || 'Unknown'} ${healthProfile.weightUnit || 'kg'}
- Height: ${healthProfile.heightValue || 'Unknown'} ${healthProfile.heightUnit || 'cm'}
- Activity Level: ${healthProfile.activityLevel || 'Moderate'}
- Primary Goal: ${healthProfile.goal || 'General fitness'}
- BMI: ${healthProfile.bmi || 'Not provided'} 
- BMR: ${healthProfile.bmr || 'Not provided'} calories/day
- TDEE: ${healthProfile.tdee || 'Not provided'} calories/day
${healthProfile.targetCalories ? `- Target Calories: ${healthProfile.targetCalories} kcal/day` : ''}
${healthProfile.macros ? `- Macros: Protein: ${healthProfile.macros.protein}g, Carbs: ${healthProfile.macros.carbs}g, Fats: ${healthProfile.macros.fats}g` : ''}

Dietary Preferences:
- Dietary Preference: ${healthProfile.dietaryPreference || 'No specific preference'}
- Religious Considerations: ${healthProfile.religiousPreference || 'None'}

Meal Schedule:
${healthProfile.mealTimes ? `- Number of Meals Per Day: ${healthProfile.mealTimes}` : '- Regular meal schedule (3-5 meals per day)'}
${healthProfile.mealTimings ? `- Specific Meal Timings: ${healthProfile.mealTimings}` : ''}
${(() => {
	if (!healthProfile.nonVegDays) return '';

	try {
		if (typeof healthProfile.nonVegDays === 'string') {
			const parsed = JSON.parse(healthProfile.nonVegDays) as {
				day: string;
				selected: boolean;
			}[];
			const selectedDays = parsed
				.filter((day) => day.selected)
				.map((day) => day.day);
			if (selectedDays.length > 0) {
				return `- Non-Vegetarian Days: ${selectedDays.join(', ')}`;
			}
		} else if (Array.isArray(healthProfile.nonVegDays)) {
			const selectedDays = healthProfile.nonVegDays
				.filter((day) => day.selected)
				.map((day) => day.day);
			if (selectedDays.length > 0) {
				return `- Non-Vegetarian Days: ${selectedDays.join(', ')}`;
			}
		}
	} catch (error) {
		console.error('Error parsing nonVegDays:', error);
	}
	return '';
})()}

Location & Cultural Context:
- Country: ${country}
- State/Region: ${state}
- Location: ${locationString}

IMPORTANT REQUIREMENTS:
1. NATIVE/LOCAL DIET FOCUS: Create a diet plan that incorporates traditional, native foods from the client's region (${country}, ${state}). Use local ingredients, cooking methods, and dishes that are culturally appropriate.
2. Balance nutrition requirements with cultural preferences.
3. ${healthProfile.mealTimes ? `Ensure exactly ${healthProfile.mealTimes} meals per day.` : 'Each day should have 4-5 meals including breakfast, lunch, dinner, and snacks.'}
4. ${healthProfile.mealTimings ? `Follow the exact meal timings specified: ${healthProfile.mealTimings}.` : 'Space meals appropriately throughout the day.'}
5. ${healthProfile.dietaryPreference?.toLowerCase().includes('vegetarian') ? 'Create a completely vegetarian meal plan.' : healthProfile.nonVegDays ? 'IMPORTANT: Only include non-vegetarian dishes on the specified non-vegetarian days. All other days must be strictly vegetarian.' : 'Balance vegetarian and non-vegetarian options appropriately.'}
6. Ensure variety across the week while maintaining cultural relevance.
7. Include preparation instructions that are clear and easy to follow.
8. ${healthProfile.bmr && healthProfile.tdee ? `Base caloric calculations on the client's BMR (${healthProfile.bmr}) and TDEE (${healthProfile.tdee}).` : "Calculate appropriate caloric intake based on the client's profile."}
${healthProfile.targetCalories ? `9. IMPORTANT: The total daily calories for each day should be as close as possible to ${healthProfile.targetCalories} kcal.` : ''}
${healthProfile.macros ? `10. IMPORTANT: The total daily macros for each day should be as close as possible to Protein: ${healthProfile.macros.protein}g, Carbs: ${healthProfile.macros.carbs}g, Fats: ${healthProfile.macros.fats}g.` : ''}

RESPONSE FORMAT:
You must respond with a valid JSON object that strictly follows this schema for each day of the week:
{
  "Monday": {
    "name": "Monday Diet Plan",
    "description": "Overview of Monday's diet plan",
    "targetCalories": 2000,
    "proteinRatio": 0.3,
    "carbsRatio": 0.4,
    "fatsRatio": 0.3,
    "meals": [
      {
        "name": "Breakfast",
        "timeOfDay": "8:00 AM",
        "calories": 500,
        "protein": 30,
        "carbs": 50,
        "fats": 15,
        "instructions": "Detailed preparation instructions with local ingredients"
      },
      // Additional meals for Monday
    ]
  },
  "Tuesday": {
    // Same structure as Monday
  },
  // Wednesday through Sunday with the same structure
}

IMPORTANT:
1. Respond ONLY with the JSON. No introduction or explanations.
2. Make sure each day has a complete set of meals that total to appropriate daily calories.
3. Ensure all meals feature native/local foods appropriate to the client's location.
4. Each meal should have clear instructions using locally available ingredients.
5. IMPORTANT: Use descriptive meal names that clearly indicate the actual dish (like "Oatmeal with Mixed Berries" or "Lentil Soup with Brown Rice") instead of generic labels like "Breakfast" or "Lunch".
`;

		// Generate structured response using AI
		const response = await generateStructuredContent<
			z.infer<typeof WeeklyDietPlanSchema>
		>(prompt, validateWeeklyDietPlanResponse, {
			temperature: 0.7, // Add some creativity
			maxAttempts: 2, // Try up to 2 times
		});

		if (!response || !response.success || !response.data) {
			console.error('Failed to generate weekly diet plan - no valid response');
			throw new Error('Failed to generate weekly diet plan');
		}

		// Process the response to add IDs to each day's plan
		const weeklyPlan = response.data;
		const dietPlans: DietPlansByDay = {};

		// Log the raw weekly plan and the processed dietPlans for verification
		console.log('Raw weeklyPlan from AI:', weeklyPlan);

		Object.entries(weeklyPlan).forEach(([day, plan], index) => {
			dietPlans[day] = {
				...plan,
				id: Date.now() + index, // Generate a unique ID
				meals: plan.meals.map((meal, mealIndex) => ({
					...meal,
					id: mealIndex + 1,
				})),
			};
		});

		console.log('Processed dietPlans with IDs:', dietPlans);

		return {
			success: true,
			data: dietPlans,
		};
	} catch (error) {
		console.error('Error generating weekly diet plan:', error);
		return {
			success: false,
			error: 'Failed to generate weekly diet plan',
		};
	}
}

/**
 * Creates a fallback diet plan if AI generation fails
 */
function createFallbackDietPlan(day: string): DietPlan {
	return {
		id: Date.now(),
		name: `${day} Diet Plan`,
		description: 'A balanced diet plan for your goals.',
		targetCalories: 2000,
		proteinRatio: 0.3,
		carbsRatio: 0.4,
		fatsRatio: 0.3,
		meals: [
			{
				id: 1,
				name: 'Breakfast',
				timeOfDay: '8:00 AM',
				calories: 500,
				protein: 30,
				carbs: 50,
				fats: 15,
				instructions:
					'Prepare a balanced breakfast with protein and complex carbs.',
			},
			{
				id: 2,
				name: 'Lunch',
				timeOfDay: '12:30 PM',
				calories: 700,
				protein: 40,
				carbs: 70,
				fats: 20,
				instructions:
					'Enjoy a nutritious lunch with lean protein and vegetables.',
			},
			{
				id: 3,
				name: 'Dinner',
				timeOfDay: '7:00 PM',
				calories: 600,
				protein: 35,
				carbs: 60,
				fats: 18,
				instructions: 'Have a light dinner with protein and vegetables.',
			},
			{
				id: 4,
				name: 'Snack',
				timeOfDay: '4:00 PM',
				calories: 200,
				protein: 10,
				carbs: 20,
				fats: 5,
				instructions: 'Enjoy a healthy snack to maintain energy levels.',
			},
		],
	};
}
