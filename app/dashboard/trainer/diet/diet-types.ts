// Shared types for diet actions (frontend)

export type DayOfWeek =
  | 'Monday'
  | 'Tuesday'
  | 'Wednesday'
  | 'Thursday'
  | 'Friday'
  | 'Saturday'
  | 'Sunday';

export interface AssignSingleDietPayload {
  userId: string | number;
  dietPlan: {
    id: number;
    name: string;
    description?: string;
    targetCalories?: number;
    proteinRatio?: number;
    carbsRatio?: number;
    fatsRatio?: number;
    meals: any[]; // Use a more specific type if available
  };
  day: DayOfWeek;
}

export interface AssignWeeklyDietPayload {
  userId: string | number;
  weeklyPlans: Record<DayOfWeek, AssignSingleDietPayload['dietPlan']>;
} 