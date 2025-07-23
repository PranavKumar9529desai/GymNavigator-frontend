import type {
	ActivityLevel,
	Gender,
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
		// Mifflin-St Jeor for Men
		return 10 * weight + 6.25 * height - 5 * age + 5;
	}
	// Mifflin-St Jeor for Women
	// Using the female formula for 'female' and 'other' genders as a default.
	// You might consider specific adjustments for 'other' if more data becomes available.
	return 10 * weight + 6.25 * height - 5 * age - 161;
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
 * Calculate Target Daily Caloric Intake based on TDEE and goal (Updated Rules)
 *
 * @param tdee Calculated TDEE
 * @param goal User's weight goal
 * @param gender User's gender (needed for bodybuilding)
 * @returns Target daily caloric intake
 */
export function calculateTargetCalories(
	tdee: number,
	goal: GoalType,
	gender: Gender, // Added gender for bodybuilding rule
): number {
	switch (goal) {
		case 'fat-loss':
			// Rule: Fat Loss for Obese Individuals
			return tdee - 500;
		case 'muscle-building-with-fat-loss':
			// Rule: Fat Loss with Muscle Building (Body Recomposition)
			// Using midpoint of 250-500 deficit
			return tdee - 375;
		case 'muscle-building':
			// Rule: Normal Muscle Building for Skinny Individuals
			// Using midpoint of 500-1000 surplus
			return tdee + 750;
		case 'bodybuilding':
			// Rule: Body Building for Professional Bodybuilders
			// Using the specified ~3800 kcal for males, else TDEE + 500 (example adjustment)
			// You might want a more specific input for female bodybuilders
			return gender === 'male' ? 3800 : tdee + 500; // Adjusted for non-males, refine as needed
		default:
			// Rule: Maintaining Health and Lean Muscles
			return tdee;
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
 * Calculate macronutrient distribution based on target calories, weight, gender, and goal (Evidence-Based)
 *
 * @param targetCalories Target daily caloric intake
 * @param weightKg Weight in kilograms
 * @param gender User's gender
 * @param goal Weight goal
 * @returns Object containing protein, carbs, and fat in grams
 */
export function calculateMacros(
	targetCalories: number,
	weightKg: number,
	gender: Gender,
	goal: GoalType,
) {
	// Set protein (g/kg) and fat (g/kg or %), carbs as remainder
	let proteinPerKg: number;
	const _fatPerKg: number | null = null;
	let fatPercent: number | null = null;

	switch (goal) {
		case 'fat-loss':
			proteinPerKg = 2.0; // 1.8-2.2g/kg for fat loss
			fatPercent = 0.25; // 20-30% of calories from fat
			break;
		case 'muscle-building-with-fat-loss':
			proteinPerKg = 2.0; // 1.8-2.2g/kg for recomp
			fatPercent = 0.25;
			break;
		case 'muscle-building':
			proteinPerKg = 1.8; // 1.6-2.0g/kg for muscle gain
			fatPercent = 0.25;
			break;
		case 'bodybuilding':
			proteinPerKg = gender === 'male' ? 2.2 : 2.0; // higher for advanced
			fatPercent = 0.20;
			break;
		default:
			proteinPerKg = 1.6; // maintenance
			fatPercent = 0.25;
			break;
	}

	const proteinGrams = Math.round(proteinPerKg * weightKg);
	const proteinCals = proteinGrams * 4;

	// Fat: use % of calories, but ensure at least 0.5g/kg
	let fatCals = Math.round(targetCalories * (fatPercent ?? 0.25));
	let fatGrams = Math.round(fatCals / 9);
	const minFatGrams = Math.round(0.5 * weightKg);
	if (fatGrams < minFatGrams) {
		fatGrams = minFatGrams;
		fatCals = fatGrams * 9;
	}

	// Carbs: remainder of calories
	const remainingCals = targetCalories - (proteinCals + fatCals);
	const carbsGrams = Math.max(0, Math.round(remainingCals / 4));

	return {
		protein: proteinGrams,
		carbs: carbsGrams,
		fat: fatGrams,
	};
}
