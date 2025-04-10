'use client';

import { useQuery } from '@tanstack/react-query';
import { UtensilsCrossed } from 'lucide-react';
import { fetchTodaysDiet } from '../_actions/get-todays-diet';
import { DietSummaryCard } from './DietSummaryCard';
import { MealCard } from './MealCard';

// Helper function to determine meal type priority for sorting
const getMealTypePriority = (timeOfDay: string): number => {
	if (timeOfDay.includes('7:00 AM')) return 1; // Breakfast
	if (timeOfDay.includes('1:00 PM')) return 2; // Lunch
	if (timeOfDay.includes('4:00 PM')) return 3; // Snack
	if (timeOfDay.includes('7:00 PM')) return 4; // Dinner
	return 5; // Other
};

export default function TodaysDiet() {
	const { data, error, isLoading } = useQuery({
		queryKey: ['todaysDiet'],
		queryFn: fetchTodaysDiet,
	});

	if (isLoading) {
		return (
			<div className="space-y-3">
				{/* Diet summary skeleton */}
				<div className="bg-gray-100 animate-pulse rounded-lg h-36 mb-3"></div>
				
				{/* Meals skeletons */}
				{[1, 2, 3].map((i) => (
					<div key={`skeleton-${i}`} className="bg-gray-100 animate-pulse rounded-lg h-24 mb-2"></div>
				))}
			</div>
		);
	}

	if (error) {
		return (
			<div className="bg-red-50 text-red-700 p-3 rounded-lg text-center">
				<p className="text-sm">Failed to load diet information. Please try again later.</p>
			</div>
		);
	}

	// If no diet plan or no meals
	if (!data?.dietPlan || data.dietPlan.meals.length === 0) {
		return (
			<div className="text-center py-6">
				<div className="mx-auto w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center mb-3">
					<UtensilsCrossed size={20} className="text-gray-500" />
				</div>
				<p className="text-sm text-gray-500">No diet plan available for today.</p>
				<p className="text-xs text-gray-400 mt-1">Check back later or contact your trainer.</p>
			</div>
		);
	}

	// Sort meals by time of day
	const sortedMeals = [...data.dietPlan.meals].sort((a, b) => {
		const priorityA = getMealTypePriority(a.timeOfDay);
		const priorityB = getMealTypePriority(b.timeOfDay);
		return priorityA - priorityB;
	});

	return (
		<div className="space-y-3">
			{/* Diet Plan Summary Card */}
			<DietSummaryCard dietPlan={data.dietPlan} />
			
			{/* Meals Section */}
			<div>
				<h2 className="text-sm font-semibold text-gray-800 mb-2 flex items-center">
					<UtensilsCrossed size={16} className="mr-1" />
					Your Meals Today
				</h2>
				<div className="space-y-3">
					{sortedMeals.map((meal, index) => (
						<MealCard key={`meal-${meal.id}`} meal={meal} index={index} />
					))}
				</div>
			</div>
		</div>
	);
}
