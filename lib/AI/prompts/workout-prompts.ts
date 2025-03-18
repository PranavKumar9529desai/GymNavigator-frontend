import type { AssignedUser } from '@/app/dashboard/trainer/workouts/assignworkout/GetuserassignedTotrainers';

/**
 * Generate a workout plan for a user based on their profile and trainer preferences
 */
export function buildWorkoutPlanPrompt(
  user: AssignedUser, 
  trainerPreferences: {
    focusAreas?: string[];
    daysPerWeek?: number;
    sessionDuration?: number;
    equipment?: string[];
    intensity?: 'beginner' | 'intermediate' | 'advanced';
    specialInstructions?: string;
  }
) {
  const {
    focusAreas = [],
    daysPerWeek = 4,
    sessionDuration = 60,
    equipment = ['Dumbbells', 'Barbells', 'Machines'],
    intensity = 'intermediate',
    specialInstructions = '',
  } = trainerPreferences;

  // Extract health profile data safely
  const healthProfile = user.HealthProfile || {};
  const height = healthProfile.height || 'Unknown';
  const weight = healthProfile.weight || 'Unknown';
  const gender = healthProfile.gender || user.gender || 'Unknown';
  const goal = healthProfile.goal || user.goal || 'General fitness';

  return `
Create a personalized workout plan for a client with the following profile:
- Gender: ${gender}
- Weight: ${weight} kg
- Height: ${height} cm
- Fitness goal: ${goal}
- Fitness level: ${intensity}

The workout plan should focus on these areas: ${focusAreas.join(', ') || 'balanced full body training'}

Available equipment:
${equipment.map(e => `- ${e}`).join('\n')}

Parameters:
- ${daysPerWeek} days per week
- ${sessionDuration} minutes per session

${specialInstructions ? `Special instructions: ${specialInstructions}` : ''}

RESPONSE FORMAT:
You must respond with a valid JSON object that strictly follows this schema:
{
  "name": "Name of the workout plan",
  "description": "Brief overview of the plan",
  "schedules": [
    {
      "dayOfWeek": "Monday", // Must be a valid day of week
      "muscleTarget": "Chest & Triceps", // Muscle group targeted
      "duration": 60, // Duration in minutes (number)
      "calories": 350, // Estimated calories burned (number)
      "exercises": [
        {
          "name": "Bench Press", // Exercise name
          "sets": 3, // Number of sets (number)
          "reps": "8-10", // Repetition range (string)
          "description": "Instructions for the exercise",
          "order": 1 // Exercise order (number)
        }
        // Include 4-8 exercises per day
      ]
    }
    // Include schedules for each training day
  ]
}

IMPORTANT:
1. Respond ONLY with the JSON. No introduction or explanations.
2. Ensure all required fields are included and properly typed.
3. Structure the workout to match the client's fitness level (${intensity}).
4. Include a mix of compound and isolation exercises.
5. Include proper warm-up and cool-down exercises.
6. Consider the client's goals: ${goal}
`;
}

/**
 * Generate feedback-based improvements to a workout plan
 */
export function buildWorkoutFeedbackPrompt(
  originalPlan: any,
  feedback: string
) {
  return `
I previously generated this workout plan:
${JSON.stringify(originalPlan, null, 2)}

The trainer provided this feedback:
"${feedback}"

Please adjust the workout plan to address this feedback. Maintain the same JSON structure:
{
  "name": "Plan name",
  "description": "Plan description",
  "schedules": [
    {
      "dayOfWeek": "Day",
      "muscleTarget": "Target muscles",
      "duration": duration_in_minutes,
      "calories": calories_burned,
      "exercises": [
        {
          "name": "Exercise name",
          "sets": number_of_sets,
          "reps": "rep_range",
          "description": "Instructions",
          "order": order_number
        }
      ]
    }
  ]
}

IMPORTANT:
1. Respond ONLY with the updated JSON. No explanation needed.
2. Keep the same structure but modify the content based on feedback.
3. Ensure all fields from the original plan remain in the response.
`;
}
