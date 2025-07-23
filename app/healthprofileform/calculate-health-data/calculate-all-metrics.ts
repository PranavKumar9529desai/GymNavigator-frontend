import type {
	ActivityLevel,
	Gender,
	GoalType,
} from '../_store/health-profile-store';
import type { HealthMetrics } from './health-data-types';
import {
	calculateBMI,
	calculateBMR,
	calculateMacros,
	calculateTDEE,
	calculateTargetCalories,
	convertHeight,
	convertWeight,
	getBMICategory,
} from './index';

export interface CalculateHealthMetricsParams {
	gender: Gender;
	age: number;
	weight: { value: number; unit: 'kg' | 'lb' };
	height: { value: number; unit: 'cm' | 'ft' };
	activityLevel: ActivityLevel;
	goal: GoalType;
}

/**
 * Calculate all health metrics based on the user's profile data
 *
 * @param params Object containing all required parameters
 * @returns Object with all calculated health metrics
 */
export function calculateHealthMetrics(
	params: CalculateHealthMetricsParams,
): HealthMetrics {
	// Convert units to metric if needed
	const weightInKg =
		params.weight.unit === 'kg'
			? params.weight.value
			: convertWeight(params.weight.value, 'lb', 'kg');

	const heightInCm =
		params.height.unit === 'cm'
			? params.height.value
			: convertHeight(params.height.value, 'ft', 'cm');

	// Calculate BMI
	const bmi = calculateBMI(weightInKg, heightInCm);
	const bmiCategory = getBMICategory(bmi);

	// Calculate BMR
	const bmr = calculateBMR(params.gender, weightInKg, heightInCm, params.age);

	// Calculate TDEE
	const tdee = calculateTDEE(bmr, params.activityLevel);

	// Add target calories - weight catergory calories

	// Calculate target calories
	const targetCalories = calculateTargetCalories(
		tdee,
		params.goal,
		params.gender,
	);

	// Calculate macros
	const macros = calculateMacros(
		targetCalories,
		weightInKg,
		params.gender,
		params.goal,
	);
	console.log('macros are this', macros);

	return {
		bmi: Math.round(bmi * 10) / 10, // Round to 1 decimal place
		bmiCategory,
		bmr: Math.round(bmr),
		tdee: Math.round(tdee),
		targetCalories: Math.round(targetCalories),
		macros,
	};
}
