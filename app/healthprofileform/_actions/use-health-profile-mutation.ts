'use server';

import { revalidatePath } from 'next/cache';
import { z } from 'zod';
import {
	DietaryPreference,
	GoalType,
	type HealthProfileState,
	MealTimes,
	ReligiousPreference,
} from '../_store/health-profile-store';
import { calculateHealthMetrics } from '../calculate-health-data/calculate-all-metrics';
import type { HealthMetrics } from '../calculate-health-data/health-data-types';

// Update the schema to make targetWeight optional or handle null values
const healthProfileSchema = z.object({
	gender: z.enum(['male', 'female', 'other']),
	age: z.number().min(1).max(120),
	activityLevel: z.enum([
		'sedentary',
		'light',
		'moderate',
		'active',
		'veryActive',
	]),
	height: z.object({
		value: z.number().min(1),
		unit: z.enum(['cm', 'ft']),
	}),
	weight: z.object({
		value: z.number().min(1),
		unit: z.enum(['kg', 'lb']),
	}),
	// Make targetWeight optional
	targetWeight: z
		.object({
			value: z.number().min(1).nullable(),
			unit: z.enum(['kg', 'lb']),
		})
		.optional(),
	goal: z.enum([
		'fat-loss',
		'muscle-building',
		'muscle-building-with-fat-loss',
		'bodybuilding',
		'maintenance',
		'general-fitness',
		'other',
	]),
	otherGoal: z.string().optional(),
	// New fields
	dietaryPreference: z.enum(['vegetarian', 'non-vegetarian', 'vegan', 'other']),
	otherDietaryPreference: z.string().optional(),
	nonVegDays: z
		.array(
			z.object({
				day: z.string(),
				selected: z.boolean(),
			}),
		)
		.optional(),
	allergies: z.array(
		z.object({
			id: z.string(),
			name: z.string(),
			selected: z.boolean(),
		}),
	),
	otherAllergy: z.string().optional(),
	mealTimes: z.enum(['2', '3', '4+']),
	// Original fields
	medicalConditions: z.array(
		z.object({
			id: z.string(),
			name: z.string(),
			selected: z.boolean(),
		}),
	),
	otherMedicalCondition: z.string().optional(),
	religiousPreference: z
		.enum([
			'hindu',
			'muslim',
			'sikh',
			'jain',
			'christian',
			'buddhist',
			'other',
			'none',
		])
		.nullable(),
	otherReligiousPreference: z.string().optional(),
	dietaryRestrictions: z.array(z.string()).optional(),
});

export type HealthProfileData = z.infer<typeof healthProfileSchema>;

export async function submitHealthProfile(
	formData: Partial<HealthProfileState>,
) {
	// Extract only the required fields from the form data
	const profileData: HealthProfileData = {
		gender: formData.gender || 'male',
		age: formData.age || 30,
		activityLevel: formData.activityLevel || 'moderate',
		height: formData.height as { value: number; unit: 'cm' | 'ft' },
		weight: formData.weight as { value: number; unit: 'kg' | 'lb' },
		// Handle targetWeight with a conditional check
		...(formData.targetWeight?.value
			? {
					targetWeight: formData.targetWeight as {
						value: number;
						unit: 'kg' | 'lb';
					},
				}
			: {}),
		goal: formData.goal || 'maintenance',
		otherGoal: formData.goal === 'other' ? formData.otherGoal : undefined,
		// New fields
		dietaryPreference: formData.dietaryPreference || 'vegetarian',
		otherDietaryPreference: formData.otherDietaryPreference,
		nonVegDays:
			formData.dietaryPreference === 'non-vegetarian'
				? formData.nonVegDays
				: undefined,
		allergies: formData.allergies?.filter((allergy) => allergy.selected) || [],
		otherAllergy: formData.otherAllergy,
		mealTimes: formData.mealTimes || '3',
		// Original fields
		medicalConditions:
			formData.medicalConditions?.filter((condition) => condition.selected) ||
			[],
		otherMedicalCondition: formData.otherMedicalCondition,
		religiousPreference: formData.religiousPreference || null,
		otherReligiousPreference: formData.otherReligiousPreference,
		dietaryRestrictions: formData.dietaryRestrictions || [],
	};

	try {
		// Validate the data
		healthProfileSchema.parse(profileData);
		console.log('Health profile submitted:', profileData);

		// Calculate health metrics
		let healthMetrics: HealthMetrics | null = null;

		try {
			healthMetrics = calculateHealthMetrics({
				gender: formData.gender || 'male',
				age: formData.age || 30,
				weight: formData.weight as { value: number; unit: 'kg' | 'lb' },
				height: formData.height as { value: number; unit: 'cm' | 'ft' },
				activityLevel: formData.activityLevel || 'moderate',
				goal: formData.goal || 'maintenance',
				// targetWeight is not needed for health metric calculations
			});

			console.log('Calculated health metrics:', healthMetrics);
		} catch (metricError) {
			console.error('Error calculating health metrics:', metricError);
		}

		// TODO: Replace with actual API call to backend
		// For now, simulate a successful API call
		await new Promise((resolve) => setTimeout(resolve, 1000));

		// Revalidate paths that may depend on this data
		revalidatePath('/dashboard');
		revalidatePath('/healthprofileform');

		return { success: true, healthMetrics };
	} catch (error) {
		console.error('Error submitting health profile:', error);
		return {
			success: false,
			error:
				error instanceof Error ? error.message : 'An unknown error occurred',
		};
	}
}
