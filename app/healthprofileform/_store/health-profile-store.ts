import { create } from 'zustand';

export type Gender = 'male' | 'female' | 'other';
export type ActivityLevel =
	| 'sedentary'
	| 'light'
	| 'moderate'
	| 'active'
	| 'veryActive';
export type DietaryPreference =
	| 'vegetarian'
	| 'non-vegetarian'
	| 'vegan'
	| 'other';
export type ReligiousPreference =
	| 'hindu'
	| 'muslim'
	| 'sikh'
	| 'jain'
	| 'christian'
	| 'buddhist'
	| 'other'
	| 'none';
export type MealTimes = '2' | '3' | '4+';
export type GoalType =
	| 'fat-loss'
	| 'muscle-building'
	| 'muscle-building-with-fat-loss'
	| 'bodybuilding'
	| 'maintenance'
	| 'general-fitness'
	| 'other';

export interface MedicalCondition {
	id: string;
	name: string;
	selected: boolean;
}

export interface Allergy {
	id: string;
	name: string;
	selected: boolean;
}

export interface NonVegDay {
	day: string;
	selected: boolean;
}

export interface MealTime {
	name: string;
	time: string;
}

export interface HealthProfileState {
	// Form data
	fullName: string;
	whatsappNumber: string;
	gender: Gender | null;
	age: number | null;
	activityLevel: ActivityLevel | null;
	height: { value: number | null; unit: 'cm' | 'ft' };
	weight: { value: number | null; unit: 'kg' | 'lb' };
	targetWeight: { value: number | null; unit: 'kg' | 'lb' };
	goal: GoalType | null;
	otherGoal: string;

	// New fieldscHealth profile submitted
	dietaryPreference: DietaryPreference | null;
	otherDietaryPreference: string;
	nonVegDays: NonVegDay[];
	allergies: Allergy[];
	otherAllergy: string;
	mealTimes: MealTimes | null;
	mealTimings: MealTime[];

	// Original fields
	medicalConditions: MedicalCondition[];
	otherMedicalCondition: string;
	religiousPreference: ReligiousPreference | null;
	otherReligiousPreference: string;
	dietaryRestrictions: string[];

	// Form navigation
	currentStep: number;
	totalSteps: number;

	// Actions
	setFullName: (name: string) => void;
	setWhatsappNumber: (number: string) => void;
	setGender: (gender: Gender) => void;
	setAge: (age: number) => void;
	setActivityLevel: (level: ActivityLevel) => void;
	setHeight: (value: number, unit: 'cm' | 'ft') => void;
	setWeight: (value: number, unit: 'kg' | 'lb') => void;
	setTargetWeight: (value: number, unit: 'kg' | 'lb') => void;
	setGoal: (goal: GoalType) => void;
	setOtherGoal: (text: string) => void;

	// New actions
	setDietaryPreference: (preference: DietaryPreference) => void;
	setOtherDietaryPreference: (text: string) => void;
	toggleNonVegDay: (day: string) => void;
	toggleAllergy: (id: string) => void;
	addAllergy: (allergy: string) => void;
	setOtherAllergy: (text: string) => void;
	setMealTimes: (times: MealTimes) => void;
	setMealTimings: (timings: MealTime[]) => void;
	updateMealTime: (index: number, time: string) => void;

	// Original actions
	toggleMedicalCondition: (id: string) => void;
	addMedicalCondition: (condition: string) => void;
	setOtherMedicalCondition: (text: string) => void;
	setReligiousPreference: (preference: ReligiousPreference) => void;
	setOtherReligiousPreference: (text: string) => void;
	addDietaryRestriction: (restriction: string) => void;
	removeDietaryRestriction: (restriction: string) => void;

	// Navigation actions
	nextStep: () => void;
	prevStep: () => void;
	goToStep: (step: number) => void;
	resetForm: () => void;
}

export const defaultMedicalConditions: MedicalCondition[] = [
	{ id: '1', name: 'Diabetes', selected: false },
	{ id: '2', name: 'Heart Disease', selected: false },
	{ id: '3', name: 'Thyroid', selected: false },
	{ id: '4', name: 'Hypertension', selected: false },
	{ id: '5', name: 'PCOS', selected: false },
	{ id: '6', name: 'Asthma', selected: false },
	{ id: '7', name: 'Arthritis', selected: false },
	{ id: '8', name: 'Back Pain', selected: false },
	{ id: '9', name: 'None', selected: false },
];

export const defaultAllergies: Allergy[] = [
	{ id: '1', name: 'Gluten', selected: false },
	{ id: '2', name: 'Lactose', selected: false },
	{ id: '3', name: 'Nuts', selected: false },
	{ id: '4', name: 'Soy', selected: false },
	{ id: '5', name: 'Shellfish', selected: false },
	{ id: '6', name: 'None', selected: false },
];

export const defaultNonVegDays: NonVegDay[] = [
	{ day: 'Monday', selected: false },
	{ day: 'Tuesday', selected: false },
	{ day: 'Wednesday', selected: false },
	{ day: 'Thursday', selected: false },
	{ day: 'Friday', selected: false },
	{ day: 'Saturday', selected: false },
	{ day: 'Sunday', selected: false },
];

const getDefaultMealTimings = (mealCount: MealTimes): MealTime[] => {
	switch (mealCount) {
		case '2':
			return [
				{ name: 'Breakfast', time: '08:00' },
				{ name: 'Dinner', time: '19:00' },
			];
		case '3':
			return [
				{ name: 'Breakfast', time: '08:00' },
				{ name: 'Lunch', time: '13:00' },
				{ name: 'Dinner', time: '19:00' },
			];
		case '4+':
			return [
				{ name: 'Breakfast', time: '08:00' },
				{ name: 'Lunch', time: '13:00' },
				{ name: 'Snack', time: '16:00' },
				{ name: 'Dinner', time: '19:00' },
			];
		default:
			return [{ name: 'Breakfast', time: '08:00' }];
	}
};

export const useHealthProfileStore = create<HealthProfileState>((set) => ({
	// Initial state
	fullName: '',
	whatsappNumber: '',
	gender: null,
	age: null,
	activityLevel: null,
	height: { value: null, unit: 'cm' },
	weight: { value: null, unit: 'kg' },
	targetWeight: { value: null, unit: 'kg' },
	goal: null,
	otherGoal: '',

	// New state fields
	dietaryPreference: null,
	otherDietaryPreference: '',
	nonVegDays: [...defaultNonVegDays],
	allergies: [...defaultAllergies],
	otherAllergy: '',
	mealTimes: null,
	mealTimings: [],

	// Original state fields
	medicalConditions: [...defaultMedicalConditions],
	otherMedicalCondition: '',
	religiousPreference: null,
	otherReligiousPreference: '',
	dietaryRestrictions: [],

	currentStep: 1,
	totalSteps: 15, // Default value, actual totalSteps is calculated dynamically in the UI

	// Actions
	setFullName: (name) => set({ fullName: name }),
	setWhatsappNumber: (number) => set({ whatsappNumber: number }),
	setGender: (gender) => set({ gender }),
	setAge: (age) => set({ age }),
	setActivityLevel: (activityLevel) => set({ activityLevel }),
	setHeight: (value, unit) => set({ height: { value, unit } }),
	setWeight: (value, unit) => set({ weight: { value, unit } }),
	setTargetWeight: (value, unit) => set({ targetWeight: { value, unit } }),
	setGoal: (goal) => set({ goal }),
	setOtherGoal: (text) => set({ otherGoal: text }),

	// New actions
	setDietaryPreference: (dietaryPreference) => set({ dietaryPreference }),
	setOtherDietaryPreference: (text) => set({ otherDietaryPreference: text }),
	toggleNonVegDay: (day) =>
		set((state) => ({
			nonVegDays: state.nonVegDays.map((d) =>
				d.day === day ? { ...d, selected: !d.selected } : d,
			),
		})),

	toggleAllergy: (id) =>
		set((state) => ({
			allergies: state.allergies.map((allergy) =>
				allergy.id === id
					? { ...allergy, selected: !allergy.selected }
					: // If selecting "None", unselect all others, and vice versa
						id === '6' || allergy.id === '6'
						? { ...allergy, selected: false }
						: allergy,
			),
		})),

	addAllergy: (allergy) =>
		set((state) => ({
			allergies: [
				...state.allergies,
				{ id: `custom-${Date.now()}`, name: allergy, selected: true },
			],
			otherAllergy: allergy,
		})),

	setOtherAllergy: (text) => set({ otherAllergy: text }),

	setMealTimes: (mealTimes) => {
		// Always generate new default timings when meal times changes
		const defaultTimings = getDefaultMealTimings(mealTimes);
		return set({ mealTimes, mealTimings: defaultTimings });
	},

	setMealTimings: (mealTimings) => set({ mealTimings }),

	updateMealTime: (index, time) =>
		set((state) => ({
			mealTimings: state.mealTimings.map((meal, i) =>
				i === index ? { ...meal, time } : meal,
			),
		})),

	// Original actions
	toggleMedicalCondition: (id) =>
		set((state) => ({
			medicalConditions: state.medicalConditions.map((condition) =>
				condition.id === id
					? { ...condition, selected: !condition.selected }
					: // If selecting "None", unselect all others, and vice versa
						id === '9' || condition.id === '9'
						? { ...condition, selected: false }
						: condition,
			),
		})),

	addMedicalCondition: (condition) =>
		set((state) => ({
			medicalConditions: [
				...state.medicalConditions,
				{ id: `custom-${Date.now()}`, name: condition, selected: true },
			],
			otherMedicalCondition: condition,
		})),

	setOtherMedicalCondition: (text) => set({ otherMedicalCondition: text }),

	setReligiousPreference: (preference) =>
		set({ religiousPreference: preference }),

	setOtherReligiousPreference: (text) =>
		set({ otherReligiousPreference: text }),

	addDietaryRestriction: (restriction) =>
		set((state) => ({
			dietaryRestrictions: [...state.dietaryRestrictions, restriction],
		})),

	removeDietaryRestriction: (restriction) =>
		set((state) => ({
			dietaryRestrictions: state.dietaryRestrictions.filter(
				(item) => item !== restriction,
			),
		})),

	nextStep: () =>
		set((state) => ({
			currentStep: state.currentStep + 1,
		})),

	prevStep: () =>
		set((state) => ({
			currentStep: Math.max(state.currentStep - 1, 1),
		})),

	goToStep: (step) => set({ currentStep: step }),

	resetForm: () =>
		set({
			fullName: '',
			whatsappNumber: '',
			gender: null,
			age: null,
			activityLevel: null,
			height: { value: null, unit: 'cm' },
			weight: { value: null, unit: 'kg' },
			targetWeight: { value: null, unit: 'kg' },
			goal: null,
			otherGoal: '',

			// Reset new fields
			dietaryPreference: null,
			otherDietaryPreference: '',
			nonVegDays: [...defaultNonVegDays],
			allergies: [...defaultAllergies],
			otherAllergy: '',
			mealTimes: null,
			mealTimings: [],

			// Reset original fields
			medicalConditions: [...defaultMedicalConditions],
			otherMedicalCondition: '',
			religiousPreference: null,
			otherReligiousPreference: '',
			dietaryRestrictions: [],
			currentStep: 1,
		}),
}));
