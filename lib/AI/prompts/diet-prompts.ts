import type { AssignedUser } from '@/app/dashboard/trainer/workouts/assignworkout/GetuserassignedTotrainers';

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
  }
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
  
  // Extract health profile data safely
  const healthProfile = user.HealthProfile || {};
  const height = healthProfile.height || 'Unknown';
  const weight = healthProfile.weight || 'Unknown';
  const gender = healthProfile.gender || user.gender || 'Unknown';
  const userGoal = healthProfile.goal || user.goal || 'General fitness';
  
  // Calculate daily calories if not provided
  const calculatedCalories = dailyCalories || (
    gender.toLowerCase() === 'male' 
      ? Math.round((weight * 10 + height * 6.25 - 5 * 25 + 5) * 1.55)
      : Math.round((weight * 10 + height * 6.25 - 5 * 25 - 161) * 1.55)
  );
  
  // Adjust calories based on goal
  const adjustedCalories = goal === 'weight_loss' 
    ? Math.round(calculatedCalories * 0.8)
    : goal === 'muscle_gain'
      ? Math.round(calculatedCalories * 1.1)
      : calculatedCalories;

  // Calculate macros based on protein target
  let proteinPercentage, carbsPercentage, fatsPercentage;
  
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
    case 'moderate':
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

${restrictions.length ? `Dietary restrictions:\n${restrictions.map(r => `- ${r}`).join('\n')}` : ''}
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
