import { z } from 'zod';

// Zod schemas for workout data
export const ExerciseSchema = z.object({
  name: z.string().min(1, 'Exercise name is required'),
  sets: z.number().min(1, 'At least one set is required'),
  reps: z.string().min(1, 'Repetition information is required'),
  description: z.string().min(1, 'Exercise description is required'),
  order: z.number().min(0, 'Order must be non-negative'),
});

export const WorkoutScheduleSchema = z.object({
  dayOfWeek: z.string().min(1, 'Day of week is required'),
  muscleTarget: z.string().min(1, 'Target muscle group is required'),
  duration: z.number().min(10, 'Workout should be at least 10 minutes'),
  calories: z.number().min(1, 'Calorie information is required'),
  exercises: z.array(ExerciseSchema).min(1, 'At least one exercise is required'),
});

export const WorkoutPlanSchema = z.object({
  name: z.string().min(3, 'Plan name must be at least 3 characters'),
  description: z.string().nullable(),
  schedules: z.array(WorkoutScheduleSchema).min(1, 'At least one workout day is required'),
});

// TypeScript types (inferred from Zod schemas)
export type Exercise = z.infer<typeof ExerciseSchema>;
export type WorkoutSchedule = z.infer<typeof WorkoutScheduleSchema>;
export type WorkoutPlan = z.infer<typeof WorkoutPlanSchema>;

/**
 * Validate a workout plan against the schema
 */
export function validateWorkoutPlan(data: unknown) {
  return WorkoutPlanSchema.safeParse(data);
}
