'use client';

import * as React from 'react';
import {
	Bar,
	BarChart,
	CartesianGrid,
	PieChart,
	Pie,
	Cell,
	ResponsiveContainer,
	XAxis,
	Tooltip as RechartsTooltip,
} from 'recharts';
import {
	ChevronDown,
	ChevronUp,
	Utensils,
	Clock,
	Info,
	AlertCircle,
} from 'lucide-react';
import { cn } from '@/lib/utils';

import {
	Accordion,
	AccordionContent,
	AccordionItem,
	AccordionTrigger,
} from '@/components/ui/accordion';

import type { TodaysDiet } from '../_actions/get-todays-diet';
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

// Types for our improved components
interface MacroNutrient {
	name: string;
	value: number;
	color: string;
}

interface CustomTooltipProps {
	active?: boolean;
	payload?: Array<{ name: string; value: number }>;
}

// Chart configuration
const MACRO_COLORS = {
	protein: '#9333ea', // Purple
	carbs: '#d97706', // Amber
	fat: '#3b82f6', // Blue
};

// Custom tooltip for charts
const CustomTooltip = ({ active, payload }: CustomTooltipProps) => {
	if (active && payload && payload.length) {
		return (
			<div className="bg-white p-2 text-xs shadow-md rounded border border-gray-100">
				<p className="text-gray-700 font-medium">{`${payload[0].name}: ${payload[0].value}`}</p>
			</div>
		);
	}
	return null;
};

interface TodaysDietProps {
	todaysDiet: TodaysDiet;
}

export default function TodaysDietComponent({
	todaysDiet: data,
}: TodaysDietProps) {
	// If no diet plan or no meals
	if (!data?.dietPlan || data.dietPlan.meals.length === 0) {
		return (
			<div className="px-3 sm:px-4">
				<div className="bg-gray-50 border border-gray-100 rounded-lg p-6 sm:p-8 text-center">
					<Clock className="h-12 w-12 text-gray-400 mx-auto mb-4" />
					<h3 className="text-xl font-medium text-gray-700 mb-2">
						No Diet Plan Available
					</h3>
					<p className="text-sm text-gray-500 mb-1">
						Your personalized diet plan is not ready yet.
					</p>
					<p className="text-xs text-gray-400 mt-4">
						Check back later or contact your trainer for assistance.
					</p>
				</div>
			</div>
		);
	}

	// Sort meals by time of day
	const sortedMeals = [...data.dietPlan.meals].sort((a, b) => {
		const priorityA = getMealTypePriority(a.timeOfDay);
		const priorityB = getMealTypePriority(b.timeOfDay);
		return priorityA - priorityB;
	});

	// Calculate nutrition summary
	const totalCalories = data.dietPlan.meals.reduce(
		(acc, meal) => acc + meal.calories,
		0,
	);
	const totalProtein = data.dietPlan.meals.reduce(
		(acc, meal) => acc + meal.protein,
		0,
	);
	const totalCarbs = data.dietPlan.meals.reduce(
		(acc, meal) => acc + meal.carbs,
		0,
	);
	const totalFats = data.dietPlan.meals.reduce(
		(acc, meal) => acc + meal.fats,
		0,
	);

	// Create data for the macro pie chart
	const macroData: MacroNutrient[] = [
		{
			name: 'Protein',
			value: data.dietPlan.proteinRatio,
			color: MACRO_COLORS.protein,
		},
		{
			name: 'Carbs',
			value: data.dietPlan.carbsRatio,
			color: MACRO_COLORS.carbs,
		},
		{ name: 'Fats', value: data.dietPlan.fatsRatio, color: MACRO_COLORS.fat },
	];

	// Calculate calorie progress
	const caloriePercentage = Math.min(
		100,
		Math.round((totalCalories / data.dietPlan.targetCalories) * 100),
	);

	// Format created date
	const formattedDate = new Date(data.dietPlan.createdAt).toLocaleDateString(
		'en-US',
		{
			weekday: 'long',
			month: 'long',
			day: 'numeric',
		},
	);

	return (
		<div className="px-3 sm:px-4">
			{/* Nutrition Summary Card */}
			<div className="mb-6 sm:mb-8">
				<h2 className="text-lg font-semibold text-gray-700 mb-3 sm:mb-4 flex items-center">
					<span className="inline-block mr-2 w-1 h-6 bg-gradient-to-b from-emerald-500 to-green-600 rounded-sm" />
					Nutrition Summary
					<span className="text-xs font-normal text-gray-500 ml-auto">
						{formattedDate}
					</span>
				</h2>

				<div className="bg-white rounded-lg shadow-sm border border-gray-100 p-4 sm:p-6">
					<div className="grid grid-cols-1 md:grid-cols-3 gap-4 sm:gap-6">
						{/* Macro Distribution Chart */}
						<div className="col-span-1 flex flex-col items-center justify-center">
							<h3 className="text-sm font-medium text-gray-600 mb-2">
								Macro Distribution
							</h3>
							<div className="h-[200px] w-full">
								<ResponsiveContainer width="100%" height="100%">
									<PieChart>
										<Pie
											data={macroData}
											cx="50%"
											cy="50%"
											innerRadius={60}
											outerRadius={80}
											paddingAngle={2}
											dataKey="value"
										>
											{macroData.map((entry, index) => (
												// biome-ignore lint/suspicious/noArrayIndexKey: Macro data has consistent order
												<Cell key={`cell-${index}`} fill={entry.color} />
											))}
										</Pie>
										<RechartsTooltip content={<CustomTooltip />} />
									</PieChart>
								</ResponsiveContainer>
							</div>
							<div className="flex justify-center gap-4 mt-2">
								{macroData.map((macro) => (
									<div key={macro.name} className="flex items-center">
										<div
											className="w-3 h-3 rounded-full mr-1"
											style={{ backgroundColor: macro.color }}
										/>
										<span className="text-xs text-gray-500">{`${macro.name} ${macro.value}%`}</span>
									</div>
								))}
							</div>
						</div>

						{/* Macros Breakdown */}
						<div className="col-span-1 flex flex-col justify-center space-y-4">
							<h3 className="text-sm font-medium text-gray-600 mb-1">
								Daily Nutrients
							</h3>
							<div>
								<div className="flex justify-between mb-1">
									<span className="text-sm font-medium text-purple-700">
										Protein
									</span>
									<span className="text-sm text-gray-600">{totalProtein}g</span>
								</div>
								<div className="w-full bg-gray-100 rounded-full h-2">
									<div
										className="h-2 rounded-full bg-purple-600"
										style={{ width: `${data.dietPlan.proteinRatio}%` }}
									/>
								</div>
							</div>
							<div>
								<div className="flex justify-between mb-1">
									<span className="text-sm font-medium text-amber-700">
										Carbs
									</span>
									<span className="text-sm text-gray-600">{totalCarbs}g</span>
								</div>
								<div className="w-full bg-gray-100 rounded-full h-2">
									<div
										className="h-2 rounded-full bg-amber-500"
										style={{ width: `${data.dietPlan.carbsRatio}%` }}
									/>
								</div>
							</div>
							<div>
								<div className="flex justify-between mb-1">
									<span className="text-sm font-medium text-blue-700">
										Fats
									</span>
									<span className="text-sm text-gray-600">{totalFats}g</span>
								</div>
								<div className="w-full bg-gray-100 rounded-full h-2">
									<div
										className="h-2 rounded-full bg-blue-500"
										style={{ width: `${data.dietPlan.fatsRatio}%` }}
									/>
								</div>
							</div>
						</div>

						{/* Calories */}
						<div className="col-span-1 flex flex-col justify-center items-center">
							<h3 className="text-sm font-medium text-gray-600 mb-2">
								Calorie Progress
							</h3>
							<div className="relative w-32 h-32">
								<div className="absolute inset-0 flex items-center justify-center flex-col">
									<span className="text-3xl font-bold text-gray-800">
										{totalCalories}
									</span>
									<span className="text-sm text-gray-500">
										of {data.dietPlan.targetCalories}
									</span>
								</div>
								<svg
									className="w-full h-full"
									viewBox="0 0 100 100"
									aria-label="Calorie progress circle"
								>
									<title>Calorie progress circle</title>
									<circle
										cx="50"
										cy="50"
										r="40"
										fill="none"
										stroke="#e5e7eb"
										strokeWidth="8"
									/>
									<circle
										cx="50"
										cy="50"
										r="40"
										fill="none"
										stroke={
											caloriePercentage > 90
												? '#10b981'
												: caloriePercentage > 70
													? '#3b82f6'
													: '#f59e0b'
										}
										strokeWidth="8"
										strokeDasharray={`${caloriePercentage * 2.51} 251`}
										strokeDashoffset="0"
										transform="rotate(-90 50 50)"
									/>
								</svg>
							</div>
							<div className="text-xs font-medium mt-2 text-gray-500">
								{caloriePercentage}% of daily goal
							</div>
						</div>
					</div>
				</div>
			</div>

			{/* Meals Section */}
			<div className="mt-8">
				<h2 className="text-lg font-semibold text-gray-700 mb-4 flex items-center">
					<span className="inline-block mr-2 w-1 h-6 bg-gradient-to-b from-emerald-500 to-green-600 rounded-sm" />
					Today's Meal Plan
				</h2>

				<div className="space-y-4">
					{sortedMeals.map((meal, index) => (
						<MealCard key={`meal-${meal.id}`} meal={meal} index={index} />
					))}
				</div>
			</div>
		</div>
	);
}
