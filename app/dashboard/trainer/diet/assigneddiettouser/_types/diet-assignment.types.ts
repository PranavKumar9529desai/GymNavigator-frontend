// Types for the diet assignment system

export interface UserHealthProfile {
	id: number;
	gender: string;
	age: number;
	goal: string;
	activityLevel: string;
	heightValue: number;
	heightUnit: string;
	weightValue: number;
	weightUnit: string;
	dietaryPreference: string;
	allergies: string;
	mealTimes: string;
	medicalConditions: string;
	bmi?: number;
	bmr?: number;
	tdee?: number;
}

export interface UserProfile {
	id: number;
	name: string;
	email: string;
	img?: string;
	HealthProfile?: UserHealthProfile | null;
	dietPlan?: {
		id: number;
		name: string;
		description: string;
		meals: DietMeal[];
	} | null;
	dietPlanId?: number | null;
}

export interface DietMeal {
	id: number;
	name: string;
	mealTime: string;
	calories?: number;
	proteinPercent?: number;
	carbPercent?: number;
	fatPercent?: number;
	instructions: string;
	groceryItems?: GroceryItem[];
}

export interface GroceryItem {
	id: number;
	name: string;
	quantity?: number;
	unit?: string;
	calories?: number;
	protein?: number;
	carbs?: number;
	fats?: number;
}

export interface DietPlan {
	id: number;
	name: string;
	description: string;
	targetCalories?: number;
	proteinPercent?: number;
	carbPercent?: number;
	fatPercent?: number;
	meals: DietMeal[];
	createdByTrainerId?: number;
	gymId?: number;
}

export interface DietAssignmentData {
	dietPlanId: number;
	startDate: Date;
	endDate: Date;
	daysOfWeek: string[];
	notes?: string;
}

export interface DietAssignmentResponse {
	success: boolean;
	msg: string;
	data?: {
		user: UserProfile;
		assignment: {
			userId: number;
			dietPlanId: number;
			startDate: Date;
			endDate: Date;
			daysOfWeek: string[];
			notes?: string;
			assignedBy: number;
			assignedAt: Date;
		};
	};
	error?: string;
}

export interface ApiResponse<T> {
	success: boolean;
	msg: string;
	data?: T;
	error?: string;
}
