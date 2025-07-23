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
		meals: {
			id: number;
			name: string;
			mealTime: string;
			calories?: number;
			proteinPercent?: number;
		}[];
	};
	day: DayOfWeek;
}

export interface AssignWeeklyDietPayload {
	userId: string | number;
	weeklyPlans: Record<DayOfWeek, AssignSingleDietPayload['dietPlan']>;
}
