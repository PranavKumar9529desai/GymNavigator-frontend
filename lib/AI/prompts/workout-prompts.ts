import { WorkoutGenerationParams } from "@/app/dashboard/trainer/workouts/assigncustomworkoutswithai/_actions/generate-ai-workout";

/**
 * Generate a workout plan prompt based on user parameters
 */
export function generateWorkoutPrompt(params: WorkoutGenerationParams): string {
  const {
    goals,
    fitnessLevel,
    preferredDays,
    focusAreas = [],
    healthConditions = [],
    workoutDuration = 45
  } = params;

  // Format focus areas for the prompt
  const focusAreasText = focusAreas.length 
    ? `with special focus on: ${focusAreas.join(', ')}` 
    : '';
  
  // Format health conditions for the prompt
  const healthConditionsText = healthConditions.length 
    ? `The user has the following health conditions to consider: ${healthConditions.join(', ')}.` 
    : '';
  
  // Format preferred days
  const daysPerWeek = preferredDays.length;
  const daysText = preferredDays.length > 0 
    ? `on these specific days: ${preferredDays.join(', ')}`
    : `${daysPerWeek} days per week`;

  return `
Create a personalized workout plan for a ${fitnessLevel} level client with the primary goal of ${goals} ${focusAreasText}.
The workout plan should be designed for ${daysPerWeek} days per week ${daysText}, with each workout lasting approximately ${workoutDuration} minutes.
${healthConditionsText}

Provide a complete workout plan in JSON format with the following structure:
{
  "name": "Descriptive name for the workout plan",
  "description": "Brief overview of the workout plan and its benefits",
  "schedules": [
    {
      "dayOfWeek": "Monday",
      "muscleTarget": "Primary muscle groups targeted",
      "duration": duration in minutes,
      "calories": estimated calories burned,
      "exercises": [
        {
          "name": "Exercise name",
          "sets": number of sets,
          "reps": "repetition scheme (e.g. '10-12' or '3x10')",
          "description": "Brief description of how to perform the exercise",
          "order": 0
        }
        // Additional exercises...
      ]
    }
    // Additional workout days...
  ]
}

Please ensure the workout plan follows best practices for exercise selection, sequencing, and recovery. Include appropriate warm-up and cool-down recommendations.
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
