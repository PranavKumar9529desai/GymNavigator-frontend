import type { HealthProfile } from "../../_actions/get-healthprofile-by-id";

interface MealTime {
	name: string;
	time: string;
}

interface MealsSectionProps {
	profile?: HealthProfile;
}

export function MealsSection({ profile }: MealsSectionProps) {
	// Default meal schedule if none provided
	const defaultMeals: MealTime[] = [
		{ name: "Breakfast", time: "08:00" },
		{ name: "Lunch", time: "13:00" },
		{ name: "Dinner", time: "19:00" },
	];

	// Helper function to extract mealPreferences from profile
	const getMealPreferences = (profile?: HealthProfile): MealTime[] => {
		if (!profile) return [];
		
		// Try to access mealPreferences if it exists
		const mealPrefs = (profile as any).mealPreferences;
		if (Array.isArray(mealPrefs) && mealPrefs.length > 0) {
			return mealPrefs;
		}
		
		// Try to access mealTimings if it exists
		const mealTimings = (profile as any).mealTimings;
		if (mealTimings && typeof mealTimings === 'string') {
			try {
				const parsed = JSON.parse(mealTimings);
				if (Array.isArray(parsed)) {
					return parsed;
				}
			} catch (e) {
				console.error("Failed to parse meal timings", e);
			}
		}
		
		return [];
	};

	// Use profile meals or default if not available
	const mealsToShow = getMealPreferences(profile).length > 0
		? getMealPreferences(profile)
		: defaultMeals;
		
	// Helper to get number of meals safely
	const getNumberOfMeals = (profile?: HealthProfile): number | undefined => {
		if (!profile) return undefined;
		return typeof (profile as any).numberOfMeals === 'number'
			? (profile as any).numberOfMeals 
			: undefined;
	};

	// Helper to display meal name appropriately (handles both generic and descriptive names)
	const displayMealName = (meal: MealTime, index: number): { mainTitle: string; subtitle?: string } => {
		// If it's a descriptive name with a colon, split it
		if (meal.name.includes(":")) {
			const [mainTitle, subtitle] = meal.name.split(":", 2);
			return { mainTitle: mainTitle.trim(), subtitle: subtitle.trim() };
		}
		
		// If it's a basic meal type with no description
		const basicMealTypes = ["Breakfast", "Lunch", "Dinner", "Snack"];
		if (basicMealTypes.includes(meal.name)) {
			return { mainTitle: meal.name };
		}
		
		// For any other case
		return { mainTitle: meal.name };
	};

	return (
		<div className="p-4 border-b border-blue-100">
			<h3 className="font-semibold text-blue-800 mb-3 flex items-center">
				<svg
					xmlns="http://www.w3.org/2000/svg"
					className="h-5 w-5 mr-2 text-blue-600"
					fill="none"
					viewBox="0 0 24 24"
					stroke="currentColor"
				>
					<path
						strokeLinecap="round"
						strokeLinejoin="round"
						strokeWidth={2}
						d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
					/>
				</svg>
				Meal Schedule
			</h3>

			<ul className="space-y-2">
				{mealsToShow.map((meal: MealTime, index: number) => {
					const { mainTitle, subtitle } = displayMealName(meal, index);
					return (
						<li
							key={index}
							className="flex items-center p-3 bg-blue-50 rounded-lg border border-blue-100"
						>
							<span className="w-9 h-9 flex items-center justify-center bg-blue-100 text-blue-700 rounded-full mr-3 font-medium">
								{index + 1}
							</span>
							<div className="flex-1">
								<span className="font-medium text-blue-700">{mainTitle}</span>
								<span className="text-xs text-gray-500 ml-2">~ {meal.time}</span>
								{subtitle && (
									<p className="text-sm text-gray-600 mt-1">{subtitle}</p>
								)}
							</div>
						</li>
					);
				})}
			</ul>

			{getNumberOfMeals(profile) && (
				<div className="mt-3 p-3 bg-blue-50 rounded-lg border border-blue-100">
					<span className="text-xs font-medium text-gray-600 uppercase tracking-wide">
						Preferred Meals Per Day
					</span>
					<p className="font-medium text-lg text-blue-700 mt-1">
						{getNumberOfMeals(profile)}
					</p>
				</div>
			)}
		</div>
	);
}
