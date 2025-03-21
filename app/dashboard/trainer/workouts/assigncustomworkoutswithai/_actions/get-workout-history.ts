'use server';

import type { ChatMessage, SavedWorkout } from '../_store/workout-chat-store';
import type { WorkoutPlan, WorkoutSchedule } from './generate-ai-workout';

// Use SavedWorkout from store which already uses WorkoutPlan from generate-ai-workout
export type WorkoutHistoryItem = SavedWorkout;

export interface WorkoutHistoryResponse {
  success: boolean;
  data?: WorkoutHistoryItem[];
  error?: string;
}

// In a real application, this would query a database
export async function getWorkoutHistory(userId: string): Promise<WorkoutHistoryResponse> {
  try {
    // Mock data that conforms to the WorkoutPlan interface from generate-ai-workout.ts
    const mockHistory: WorkoutHistoryItem[] =
      userId !== 'defaultUserId'
        ? [
            {
              id: 'wh-1',
              workoutPlan: {
                id: 1,
                name: 'Strength Building Program',
                description: 'A program focused on building functional strength',
                schedules: [
                  {
                    id: 1,
                    dayOfWeek: 'Monday',
                    muscleTarget: 'Upper Body', // Using muscleTarget instead of focus
                    duration: 45, // Adding required number field
                    calories: 350, // Adding required number field
                    exercises: [
                      {
                        name: 'Bench Press',
                        sets: 3,
                        reps: '8-10',
                        description: 'Standard bench press movement', // Adding required description
                        order: 0, // Adding required order
                      },
                      {
                        name: 'Shoulder Press',
                        sets: 3,
                        reps: '8-10',
                        description: 'Overhead press with dumbbells',
                        order: 1,
                      },
                    ],
                  },
                  {
                    id: 2,
                    dayOfWeek: 'Wednesday',
                    muscleTarget: 'Lower Body',
                    duration: 50,
                    calories: 400,
                    exercises: [
                      {
                        name: 'Squats',
                        sets: 4,
                        reps: '8-10',
                        description: 'Standard barbell squat',
                        order: 0,
                      },
                      {
                        name: 'Deadlifts',
                        sets: 3,
                        reps: '8-10',
                        description: 'Conventional deadlift form',
                        order: 1,
                      },
                    ],
                  },
                ],
              },
              createdAt: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString(),
              clientId: userId,
              clientName: 'Jane Smith',
              conversationHistory: [
                {
                  type: 'ai',
                  message:
                    "Here's your personalized workout plan. Let me know if you'd like any modifications!",
                  workout: {
                    id: 1,
                    name: 'Strength Building Program',
                    description: 'A program focused on building functional strength',
                    schedules: [
                      {
                        id: 1,
                        dayOfWeek: 'Monday',
                        muscleTarget: 'Upper Body',
                        duration: 45,
                        calories: 350,
                        exercises: [
                          {
                            name: 'Bench Press',
                            sets: 3,
                            reps: '8-10',
                            description: 'Standard bench press movement',
                            order: 0,
                          },
                          {
                            name: 'Shoulder Press',
                            sets: 3,
                            reps: '8-10',
                            description: 'Overhead press with dumbbells',
                            order: 1,
                          },
                        ],
                      },
                      {
                        id: 2,
                        dayOfWeek: 'Wednesday',
                        muscleTarget: 'Lower Body',
                        duration: 50,
                        calories: 400,
                        exercises: [
                          {
                            name: 'Squats',
                            sets: 4,
                            reps: '8-10',
                            description: 'Standard barbell squat',
                            order: 0,
                          },
                          {
                            name: 'Deadlifts',
                            sets: 3,
                            reps: '8-10',
                            description: 'Conventional deadlift form',
                            order: 1,
                          },
                        ],
                      },
                    ],
                  },
                  timestamp: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000),
                },
                {
                  type: 'user',
                  message: 'Could you increase the intensity a bit for the upper body day?',
                  timestamp: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000 + 1000 * 60 * 5),
                },
                {
                  type: 'ai',
                  message:
                    "I've increased the intensity by adding more sets for the upper body exercises!",
                  timestamp: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000 + 1000 * 60 * 6),
                },
              ],
            },
            {
              id: 'wh-2',
              workoutPlan: {
                id: 2,
                name: 'Cardio Endurance Program',
                description:
                  'Improve cardiovascular health and endurance. Note: In a real application, this data would come from your database with actual saved workouts.',
                schedules: [
                  {
                    id: 3,
                    dayOfWeek: 'Tuesday',
                    muscleTarget: 'Cardio', // Using muscleTarget instead of focus
                    duration: 30,
                    calories: 250,
                    exercises: [
                      {
                        name: 'Running',
                        sets: 1,
                        reps: '30 mins',
                        description: 'Steady state running',
                        order: 0,
                      },
                      {
                        name: 'Jump Rope',
                        sets: 3,
                        reps: '5 mins',
                        description: 'High intensity rope jumping',
                        order: 1,
                      },
                    ],
                  },
                  {
                    id: 4,
                    dayOfWeek: 'Thursday',
                    muscleTarget: 'HIIT',
                    duration: 40,
                    calories: 300,
                    exercises: [
                      {
                        name: 'Burpees',
                        sets: 4,
                        reps: '45s work/15s rest',
                        description: 'High intensity interval training',
                        order: 0,
                      },
                      {
                        name: 'Mountain Climbers',
                        sets: 4,
                        reps: '45s work/15s rest',
                        description: 'High intensity interval training',
                        order: 1,
                      },
                    ],
                  },
                ],
              },
              createdAt: new Date(Date.now() - 14 * 24 * 60 * 60 * 1000).toISOString(),
              clientId: userId,
              clientName: 'Jane Smith',
              conversationHistory: [
                {
                  type: 'ai',
                  message:
                    "Here's your personalized workout plan. Let me know if you'd like any modifications!",
                  workout: {
                    id: 2,
                    name: 'Cardio Endurance Program',
                    description: 'Improve cardiovascular health and endurance',
                    schedules: [
                      {
                        id: 3,
                        dayOfWeek: 'Tuesday',
                        muscleTarget: 'Cardio',
                        duration: 30,
                        calories: 250,
                        exercises: [
                          {
                            name: 'Running',
                            sets: 1,
                            reps: '30 mins',
                            description: 'Steady state running',
                            order: 0,
                          },
                          {
                            name: 'Jump Rope',
                            sets: 3,
                            reps: '5 mins',
                            description: 'High intensity rope jumping',
                            order: 1,
                          },
                        ],
                      },
                      {
                        id: 4,
                        dayOfWeek: 'Thursday',
                        muscleTarget: 'HIIT',
                        duration: 40,
                        calories: 300,
                        exercises: [
                          {
                            name: 'Burpees',
                            sets: 4,
                            reps: '45s work/15s rest',
                            description: 'High intensity interval training',
                            order: 0,
                          },
                          {
                            name: 'Mountain Climbers',
                            sets: 4,
                            reps: '45s work/15s rest',
                            description: 'High intensity interval training',
                            order: 1,
                          },
                        ],
                      },
                    ],
                  },
                  timestamp: new Date(Date.now() - 14 * 24 * 60 * 60 * 1000),
                },
              ],
            },
          ]
        : [];

    return {
      success: true,
      data: mockHistory,
    };
  } catch (error) {
    console.error('Error fetching workout history:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Failed to fetch workout history',
    };
  }
}
