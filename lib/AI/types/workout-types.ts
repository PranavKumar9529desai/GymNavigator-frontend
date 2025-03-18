import { z } from 'zod';

// Zod schemas
export const ExerciseSchema = z.object({
  name: z.string().min(1, "Exercise name is required"),
  sets: z.number().min(1, "Sets must be at least 1"),
  reps: z.string().min(1, "Reps information is required"),
  description: z.string().min(1, "Exercise description is required"),
  order: z.number().int().min(1, "Exercise order must be a positive integer")
});

export const WorkoutScheduleSchema = z.object({
  dayOfWeek: z.enum(["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"]),
  muscleTarget: z.string().min(1, "Muscle target is required"),
  duration: z.number().min(10, "Duration must be at least 10 minutes"),
  calories: z.number().min(1, "Estimated calories must be provided"),
  exercises: z.array(ExerciseSchema).min(1, "At least one exercise is required")
});

export const WorkoutPlanSchema = z.object({
  name: z.string().min(3, "Plan name must be at least 3 characters"),
  description: z.string().min(10, "Plan description must be at least 10 characters"),
  schedules: z.array(WorkoutScheduleSchema).min(1, "At least one workout schedule is required")
});

// TypeScript types (inferred from the Zod schemas)
export type Exercise = z.infer<typeof ExerciseSchema>;
export type WorkoutSchedule = z.infer<typeof WorkoutScheduleSchema>;
export type WorkoutPlan = z.infer<typeof WorkoutPlanSchema>;

/**
 * Validate a workout plan against the schema
 */
export function validateWorkoutPlan(data: unknown) {
  return WorkoutPlanSchema.safeParse(data);
}
