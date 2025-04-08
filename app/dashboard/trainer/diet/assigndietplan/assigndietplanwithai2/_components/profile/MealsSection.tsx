import type { HealthProfile } from "../../_actions/get-healthprofile-by-id";

interface MealsSectionProps {
	profile?: HealthProfile;
}

export function MealsSection({ profile }: MealsSectionProps) {
	// Format meal times for better display
	const formatMealTimes = (mealTimes?: string): string[] => {
		if (!mealTimes) return [];

		// Remove quotes and split by commas
		return mealTimes
			.replace(/"/g, "")
			.split(",")
			.map((meal) => meal.trim())
			.filter((meal) => meal.length > 0);
	};

	// Parse meal timings if available
	const mealTimings = formatMealTimes(profile?.mealTimings);
	const mealPreferences = formatMealTimes(profile?.mealTimes);

	return (
		<div className="p-4 border-b border-gray-200">
			<h3 className="font-semibold text-gray-800 mb-3 flex items-center">
				<svg
					xmlns="http://www.w3.org/2000/svg"
					className="h-5 w-5 mr-2 text-green-600"
					fill="none"
					viewBox="0 0 24 24"
					stroke="currentColor"
				>
					<path
						strokeLinecap="round"
						strokeLinejoin="round"
						strokeWidth={2}
						d="M12 6v6m0 0v6m0-6h6m-6 0H6"
					/>
				</svg>
				Meals
			</h3>

			{mealPreferences.length > 0 && (
				<div className="mb-4">
					<span className="text-xs font-medium text-gray-500 uppercase tracking-wide block mb-2">
						Meal Preferences
					</span>
					<div className="flex flex-wrap gap-2">
						{mealPreferences.map((meal, index) => (
							<span
								key={`meal-${index}`}
								className="px-3 py-1.5 bg-purple-50 text-purple-700 rounded-full text-sm"
							>
								{meal}
							</span>
						))}
					</div>
				</div>
			)}

			{mealTimings.length > 0 && (
				<div className="mb-4">
					<span className="text-xs font-medium text-gray-500 uppercase tracking-wide block mb-2">
						Meal Timings
					</span>
					<div className="space-y-2">
						{mealTimings.map((timing, index) => (
							<div key={`timing-${index}`} className="flex items-center">
								<svg
									xmlns="http://www.w3.org/2000/svg"
									className="h-4 w-4 text-gray-400 mr-2"
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
								<span className="text-gray-700">{timing}</span>
							</div>
						))}
					</div>
				</div>
			)}

			{Array.isArray(profile?.nonVegDays) &&
				profile.nonVegDays.some((day) => day.selected) && (
					<div className="mt-4">
						<span className="text-xs font-medium text-gray-500 uppercase tracking-wide block mb-2">
							Non-Veg Days
						</span>
						<div className="flex flex-wrap gap-2">
							{profile.nonVegDays
								.filter((day) => day.selected)
								.map((day) => (
									<span
										key={day.day}
										className="px-3 py-1.5 bg-red-50 text-red-700 rounded-full text-sm"
									>
										{day.day}
									</span>
								))}
						</div>
					</div>
				)}
		</div>
	);
}
