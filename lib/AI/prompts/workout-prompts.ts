import type { WorkoutGenerationParams } from '@/app/dashboard/trainer/workouts/assigncustomworkoutswithai/_actions/generate-ai-workout';
import type {
	Exercise,
	WorkoutPlan,
	WorkoutSchedule,
} from '../types/workout-types';

interface FeedbackPromptParams {
	userId: string;
	originalWorkoutPlan: WorkoutPlan;
	feedback: string;
	conversationHistory: string;
}

/**
 * Generate a workout plan prompt based on user parameters
 */
export function generateWorkoutPrompt(params: WorkoutGenerationParams): string {
	const {
		goals,
		fitnessLevel,
		preferredDays = [],
		focusAreas = [],
		healthConditions = [],
		workoutDuration = 45,
		specialInstructions = '',
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
	const daysText = `${daysPerWeek} days per week specifically on these days: ${preferredDays.join(
		', ',
	)}`;

	// Format special instructions
	const specialInstructionsText = specialInstructions
		? `Additional requirements: ${specialInstructions}`
		: '';

	return `
Create a personalized workout plan for a ${fitnessLevel} level client with the primary goal of ${goals} ${focusAreasText}.
The workout plan should be designed for ${daysText}, with each workout lasting approximately ${workoutDuration} minutes.
${healthConditionsText}
${specialInstructionsText}

IMPORTANT: Generate workouts ONLY for these specific days: ${preferredDays.join(
		', ',
	)}. Do not add workouts for any other days.

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
          "order": 0,
          
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
	originalPlan: WorkoutPlan,
	feedback: string,
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
          "order": order_number,
          
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

export function generateFeedbackPrompt(params: FeedbackPromptParams): string {
	const { originalWorkoutPlan, feedback, conversationHistory } = params;

	// Serialize the workout plan to provide context to the AI
	const workoutDetails = `
  Workout Name: ${originalWorkoutPlan.name}
  Description: ${originalWorkoutPlan.description || 'Not provided'}
  Schedule:
  ${originalWorkoutPlan.schedules
		.map(
			(s: WorkoutSchedule) => `
  - Day: ${s.dayOfWeek}
    Target: ${s.muscleTarget}
    Duration: ${s.duration} minutes
    Exercises: ${s.exercises
			.map((e: Exercise) => `${e.name} (${e.sets}x${e.reps})`)
			.join(', ')}
  `,
		)
		.join('')}
  `;

	return `
  You are an expert fitness trainer tasked with refining workout plans based on client feedback.
  
  THE ORIGINAL WORKOUT PLAN:
  ${workoutDetails}
  
  CONVERSATION HISTORY:
  ${conversationHistory}
  
  RECENT FEEDBACK FROM TRAINER:
  "${feedback}"
  
  Based on this feedback, please create a refined version of the workout plan that addresses the concerns or requested changes.
  
  Your response should follow this exact JSON structure:
  {
    "name": "Name of the workout plan",
    "description": "Brief description of the workout plan's goal and approach",
    "schedules": [
      {
        "dayOfWeek": "Monday/Tuesday/etc.",
        "muscleTarget": "Target muscle groups for this day",
        "duration": duration_in_minutes,
        "calories": estimated_calories_burned,
        "exercises": [
          {
            "name": "Exercise name",
            "sets": number_of_sets,
            "reps": "repetition scheme (e.g. '8-12' or '10')",
            "description": "Brief instructions or notes about the exercise",
            "order": 1,
            
          }
          // Additional exercises...
        ]
      }
      // Additional days...
    ]
  }
  
  IMPORTANT NOTES:
  1. Maintain the same overall structure but modify specific elements based on the feedback
  2. Keep exercise descriptions concise but informative
  3. Ensure appropriate progression and balance across the workout week
  4. The workout should be tailored to address the specific feedback provided
  5. If the feedback mentions intensity, modify sets, reps, or exercise selection accordingly
  6. If the feedback mentions time constraints, adjust the duration and exercise count
  7. Return ONLY valid JSON that follows the exact structure above
  `;
}
