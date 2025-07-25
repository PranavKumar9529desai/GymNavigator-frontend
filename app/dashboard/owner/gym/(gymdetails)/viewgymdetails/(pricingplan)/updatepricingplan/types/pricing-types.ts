export interface GymData {
	gym_name: string;
	gym_logo: string;
	address: string;
	phone_number: string;
	Email: string;
	gymauthtoken: string;
	amenities?: Record<string, string[]>;
	fitnessPlans?: FitnessPlan[];
}

export interface FitnessPlan {
	id?: number;
	name: string;
	description: string;
	price: string;
	duration: string;
	features: string[];
	isFeatured?: boolean;
	color?: string;
	icon?: string;
	popular?: boolean;
	maxMembers?: number;
	sortOrder?: number;
	benefits?: string[];
	sessionDuration?: number;
	genderCategory?: string;
	minAge?: number;
	maxAge?: number;
	categoriesJson?: string;
	gymId?: number;
}

export interface AdditionalService {
	name: string;
	price: string;
	duration: string;
	description?: string;
}
