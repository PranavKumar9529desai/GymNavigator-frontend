'use server';

import { ClientReqConfig } from '@/lib/AxiosInstance/clientAxios';
import type {
	ActivityLevel,
	HealthProfileState,
} from '../_store/health-profile-store';
import type { HealthMetrics } from '../calculate-health-data/health-data-types';
// Define a type that matches what we need for the API request

export interface HealthProfileFormDataSubmissionType {
	// Renamed property to match backend type
	healthProfileFormData: HealthProfileApiRequest;
	healthMetrics: HealthMetrics;
}

export interface HealthProfileApiRequest {
	fullname: string;
	contact: string;
	gender: string;
	age: number;
	activityLevel: ActivityLevel; // Use the ActivityLevel type for consistency
	height: { value: number; unit: string };
	weight: { value: number; unit: string };
	goal: string;
	otherGoal?: string;
	dietaryPreference: string;
	otherDietaryPreference?: string;
	nonVegDays?: Array<{ day: string; selected: boolean }>;
	allergies: Array<{ id: string; name: string; selected: boolean }>;
	otherAllergy?: string;
	mealTimes: string;
	mealTimings: Array<{ name: string; time: string }>;
	medicalConditions: Array<{ id: string; name: string; selected: boolean }>;
	otherMedicalCondition?: string;
	religiousPreference: string | null;
	otherReligiousPreference?: string;
	dietaryRestrictions?: string[];
}

export interface HealthProfileResponse {
	success: boolean;
	data?: HealthProfileFormDataSubmissionType;
	error?: string;
	details?: string;
}

export const submitHealthProfileToApi = async (
	storeState: HealthProfileState,
): Promise<HealthProfileResponse> => {
	try {
		// Validate required fields
		if (!storeState.fullName || !storeState.whatsappNumber || !storeState.gender || 
		    !storeState.age || !storeState.height.value || !storeState.weight.value || 
		    !storeState.activityLevel || !storeState.goal || !storeState.dietaryPreference || 
		    !storeState.mealTimes) {
			return {
				success: false,
				error: 'Missing required fields',
				details: 'Please complete all required form fields before submitting.',
			};
		}

		// Import calculateHealthMetrics function
		const { calculateHealthMetrics } = await import('../calculate-health-data/calculate-all-metrics');
		
		// Calculate health metrics from the current state
		const healthMetrics = calculateHealthMetrics({
			age: storeState.age,
			gender: storeState.gender,
			height: {
				value: storeState.height.value,
				unit: storeState.height.unit,
			},
			weight: {
				value: storeState.weight.value,
				unit: storeState.weight.unit,
			},
			activityLevel: storeState.activityLevel,
			goal: storeState.goal,
		});

		// Transform store state to API format
		const healthProfileFormData: HealthProfileApiRequest = {
			fullname: storeState.fullName,
			contact: storeState.whatsappNumber,
			gender: storeState.gender,
			age: storeState.age,
			activityLevel: storeState.activityLevel,
			height: {
				value: storeState.height.value,
				unit: storeState.height.unit,
			},
			weight: {
				value: storeState.weight.value,
				unit: storeState.weight.unit,
			},
			goal: storeState.goal,
			otherGoal: storeState.otherGoal,
			dietaryPreference: storeState.dietaryPreference,
			otherDietaryPreference: storeState.otherDietaryPreference,
			nonVegDays: storeState.nonVegDays,
			allergies: storeState.allergies,
			otherAllergy: storeState.otherAllergy,
			mealTimes: storeState.mealTimes,
			mealTimings: storeState.mealTimings,
			medicalConditions: storeState.medicalConditions,
			otherMedicalCondition: storeState.otherMedicalCondition,
			religiousPreference: storeState.religiousPreference,
			otherReligiousPreference: storeState.otherReligiousPreference,
			dietaryRestrictions: storeState.dietaryRestrictions,
		};

		const submissionData: HealthProfileFormDataSubmissionType = {
			healthProfileFormData,
			healthMetrics,
		};

		const clientAxios = await ClientReqConfig();
		const response = await clientAxios.post<HealthProfileResponse>(
			'/profile/healthprofileform',
			submissionData,
		);

		return response.data;
	} catch (error) {
		console.error('Error submitting health profile data:', error);
		return {
			success: false,
			error: 'Failed to submit health profile data',
			details: error instanceof Error ? error.message : 'Unknown error',
		};
	}
};
