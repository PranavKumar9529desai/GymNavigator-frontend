import type {
	Gender,
	ActivityLevel,
	GoalType,
} from '../_store/health-profile-store';

// Export all functions from this directory
export * from './calculate-all-metrics';
export * from './health-data-types';

/**
 * Calculate Body Mass Index (BMI)
 * Formula: BMI = Weight (kg) / (Height (cm) / 100)²
 *
 * @param weight Weight in kilograms
 * @param height Height in centimeters
 * @returns Calculated BMI value
 */
export function calculateBMI(weight: number, height: number): number {
	// Convert height from cm to meters and square it
	const heightInMeters = height / 100;
	return weight / heightInMeters ** 2;
}

/**
 * Get BMI category based on calculated BMI value
 *
 * @param bmi Calculated BMI value
 * @returns BMI category as a string
 */
export function getBMICategory(bmi: number): string {
	if (bmi < 18.5) return 'Underweight';
	if (bmi >= 18.5 && bmi < 25) return 'Normal weight';
	if (bmi >= 25 && bmi < 30) return 'Overweight';
	if (bmi >= 30 && bmi < 35) return 'Obesity (Class 1)';
	if (bmi >= 35 && bmi < 40) return 'Obesity (Class 2)';
	return 'Obesity (Class 3 - Severe/Morbid)';
}

/**
 * Calculate Basal Metabolic Rate (BMR)
 * Formulas:
 * For Men: BMR = 66.5 + (13.75 * Weight (kg)) + (5.003 * Height (cm)) - (6.755 * Age (years))
 * For Women: BMR = 655.1 + (9.563 * Weight (kg)) + (1.850 * Height (cm)) - (4.676 * Age (years))
 *
 * @param gender User's gender
 * @param weight Weight in kilograms
 * @param height Height in centimeters
 * @param age Age in years
 * @returns Calculated BMR value
 */
export function calculateBMR(
	gender: Gender,
	weight: number,
	height: number,
	age: number,
): number {
	if (gender === 'male') {
		return 66.5 + 13.75 * weight + 5.003 * height - 6.755 * age;
	}
	// Use female formula for both 'female' and 'other' for now
	return 655.1 + 9.563 * weight + 1.85 * height - 4.676 * age;
}

/**
 * Convert activity level string to the corresponding activity factor
 *
 * @param activityLevel User's activity level
 * @returns Activity factor as a number
 */
export function getActivityFactor(activityLevel: ActivityLevel): number {
	switch (activityLevel) {
		case 'sedentary':
			return 1.2; // Sedentary (little exercise)
		case 'light':
			return 1.375; // Lightly active (light exercise 1-3 days/week)
		case 'moderate':
			return 1.55; // Moderately active (moderate exercise 3-5 days/week)
		case 'active':
			return 1.725; // Very active (hard exercise 6-7 days/week)
		case 'veryActive':
			return 1.9; // Extra active (very hard exercise & physical job or 2x training)
		default:
			return 1.2; // Default to sedentary if unknown
	}
}

/**
 * Calculate Total Daily Energy Expenditure (TDEE)
 * Formula: TDEE = BMR * Activity Factor
 *
 * @param bmr Calculated Basal Metabolic Rate
 * @param activityLevel User's activity level
 * @returns Calculated TDEE value
 */
export function calculateTDEE(
	bmr: number,
	activityLevel: ActivityLevel,
): number {
	const activityFactor = getActivityFactor(activityLevel);
	return bmr * activityFactor;
}

/**
 * Calculate Target Daily Caloric Intake based on TDEE and goal
 *
 * @param tdee Calculated TDEE
 * @param goal User's weight goal
 * @returns Target daily caloric intake
 */
export function calculateTargetCalories(tdee: number, goal: GoalType): number {
	switch (goal) {
		case 'fat-loss':
			return tdee - 500; // 500 calorie deficit for fat loss (approximately 0.5 kg/week)
		case 'muscle-building':
		case 'muscle-building-with-fat-loss':
		case 'bodybuilding':
			return tdee + 250; // 250 calorie surplus for muscle gain (approximately 0.25 kg/week)
		default:
			return tdee; // Maintain current weight
	}
}

/**
 * Convert weight between kg and lb
 *
 * @param weight Weight value
 * @param fromUnit Original unit ('kg' or 'lb')
 * @param toUnit Target unit ('kg' or 'lb')
 * @returns Converted weight value
 */
export function convertWeight(
	weight: number,
	fromUnit: 'kg' | 'lb',
	toUnit: 'kg' | 'lb',
): number {
	if (fromUnit === toUnit) return weight;

	if (fromUnit === 'lb' && toUnit === 'kg') {
		return weight * 0.45359237; // Convert pounds to kilograms
	}
	return weight * 2.20462262; // Convert kilograms to pounds
}

/**
 * Convert height between cm and ft
 * Note: This is a simplification. For more precise conversion, we would need to handle feet and inches separately.
 *
 * @param height Height value
 * @param fromUnit Original unit ('cm' or 'ft')
 * @param toUnit Target unit ('cm' or 'ft')
 * @returns Converted height value
 */
export function convertHeight(
	height: number,
	fromUnit: 'cm' | 'ft',
	toUnit: 'cm' | 'ft',
): number {
	if (fromUnit === toUnit) return height;

	if (fromUnit === 'ft' && toUnit === 'cm') {
		return height * 30.48; // Convert feet to centimeters
	}
	return height / 30.48; // Convert centimeters to feet
}

/**
 * Calculate macronutrient distribution based on target calories and goal
 *
 * @param targetCalories Target daily caloric intake
 * @param goal Weight goal
 * @returns Object containing protein, carbs, and fat in grams
 */
export function calculateMacros(targetCalories: number, goal: GoalType) {
	let proteinPercentage: number;
	let carbsPercentage: number;
	let fatPercentage: number;

	// Set macronutrient percentages based on goal
	switch (goal) {
		case 'bodybuilding':
			// Body-Building macros: 30% protein, 50% carbs, 20% fat
			proteinPercentage = 0.3;
			carbsPercentage = 0.5;
			fatPercentage = 0.2;
			break;
		case 'fat-loss':
			// Weight Loss macros: 45% protein, 20% carbs, 35% fat
			proteinPercentage = 0.45;
			carbsPercentage = 0.2;
			fatPercentage = 0.35;
			break;
		default:
			// Maintenance/General macros: 30% protein, 40% carbs, 30% fat
			proteinPercentage = 0.3;
			carbsPercentage = 0.4;
			fatPercentage = 0.3;
			break;
	}

	// Calculate macros in grams
	const proteinGrams = Math.round((targetCalories * proteinPercentage) / 4);
	const carbsGrams = Math.round((targetCalories * carbsPercentage) / 4);
	const fatGrams = Math.round((targetCalories * fatPercentage) / 9);

	return {
		protein: proteinGrams,
		carbs: carbsGrams,
		fat: fatGrams,
	};
}
