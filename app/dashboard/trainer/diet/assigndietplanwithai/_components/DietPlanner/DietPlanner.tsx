// src/app/diet-page/components/DietPlanner.tsx
'use client'; // Needed for useState and event handling

import { Button } from '@/components/ui/button';
import { Loader2 } from 'lucide-react';
import { useSearchParams } from 'next/navigation';
import React, { useState, useTransition } from 'react';
import { toast } from 'sonner';
import {
	assignDietPlan,
	assignWeeklyDietPlan,
} from '../../_actions/assign-diet-plan';
import { generateDietWithAI2 } from '../../_actions/generate-diet-with-ai2';
import { DietControls } from './DietControls'; // Adjust path if needed
import { DietDisplay } from './DietDisplay/DietDisplay'; // Adjust path if needed

// Define Meal interface to work with the diet plan data
interface Meal {
	id: string | number;
	name: string;
	time: string;
	description: string;
	instructions: string[];
	protein: string;
	fat: string;
	carbs: string;
}

// Define DietPlan interface matching our backend
interface DietPlan {
	id: number;
	name: string;
	description?: string;
	targetCalories: number;
	proteinRatio: number;
	carbsRatio: number;
	fatsRatio: number;
	meals: {
		id: number;
		name: string;
		timeOfDay: string;
		calories: number;
		protein: number;
		carbs: number;
		fats: number;
		instructions: string;
	}[];
}

// Define DayOfWeek type for strict typing
export type DayOfWeek =
	| 'Monday'
	| 'Tuesday'
	| 'Wednesday'
	| 'Thursday'
	| 'Friday'
	| 'Saturday'
	| 'Sunday';

// Helper to convert from API diet plan meal to display meal
const convertToDisplayMeal = (meal: DietPlan['meals'][0]): Meal => {
	return {
		id: meal.id,
		name: meal.name,
		time: meal.timeOfDay,
		description: `${meal.calories} calories`,
		instructions: meal.instructions.split('. ').filter(Boolean),
		protein: `${Math.round(meal.protein)}g (${Math.round((meal.protein * 4 * 100) / meal.calories)}%)`,
		fat: `${Math.round(meal.fats)}g (${Math.round((meal.fats * 9 * 100) / meal.calories)}%)`,
		carbs: `${Math.round(meal.carbs)}g (${Math.round((meal.carbs * 4 * 100) / meal.calories)}%)`,
	};
};

export function DietPlanner() {
	const searchParams = useSearchParams();
	const userId = searchParams.get('userId') || 'defaultUserId';

	const [isPending, startTransition] = useTransition();
	const [isAssigning, setIsAssigning] = useState(false);
	const [dietPlans, setDietPlans] = useState<Record<DayOfWeek, Meal[]> | null>(
		null,
	);
	const [originalPlans, setOriginalPlans] = useState<Record<DayOfWeek, DietPlan> | null>(null);
	const [activeDay, setActiveDay] = useState<DayOfWeek>('Monday');

	const handleDayChange = (day: DayOfWeek) => {
		setActiveDay(day);
	};

	const handleGenerateDiet = async (location: {
		country: string;
		state: string;
	}) => {
		toast.info('Generating diet plans for the entire week...');

		startTransition(async () => {
			try {
				// Generate diet plans for all days of the week in a single call
				const result = await generateDietWithAI2(userId, undefined, location);

				if (!result.success || !result.data) {
					throw new Error(result.error || 'Failed to generate diet plans');
				}

				// Store the original plans for later use in assignment
				// Ensure only valid days are included
				const validDays: DayOfWeek[] = [
					'Monday',
					'Tuesday',
					'Wednesday',
					'Thursday',
					'Friday',
					'Saturday',
					'Sunday',
				];
				const filteredOriginalPlans: Record<DayOfWeek, DietPlan> = {} as Record<DayOfWeek, DietPlan>;
				for (const day of validDays) {
					if (result.data[day]) {
						filteredOriginalPlans[day] = result.data[day];
					}
				}
				setOriginalPlans(filteredOriginalPlans);

				// Convert the diet plans to the format required by DietDisplay
				const formattedDietPlans: Record<DayOfWeek, Meal[]> = {} as Record<DayOfWeek, Meal[]>;
				for (const day of validDays) {
					if (filteredOriginalPlans[day]) {
						formattedDietPlans[day] = filteredOriginalPlans[day].meals.map(convertToDisplayMeal);
					}
				}
				setDietPlans(formattedDietPlans);
				toast.success('Weekly diet plan generated successfully!');
			} catch (error) {
				console.error('Error generating diet plans:', error);
				toast.error('Failed to generate diet plans. Please try again.');
			}
		});
	};

	const _handleAssignDiet = async () => {
		if (!originalPlans || !originalPlans[activeDay]) {
			toast.error('No diet plan available to assign');
			return;
		}

		setIsAssigning(true);
		toast.info(`Assigning ${activeDay} diet plan...`);

		try {
			const result = await assignDietPlan({
				userId,
				dietPlan: originalPlans[activeDay],
				day: activeDay,
			});

			if (result.success) {
				toast.success(`${activeDay} diet plan assigned successfully!`);
			} else {
				throw new Error(result.error || 'Failed to assign diet plan');
			}
		} catch (error) {
			console.error('Error assigning diet plan:', error);
			toast.error('Failed to assign diet plan. Please try again.');
		} finally {
			setIsAssigning(false);
		}
	};

	const handleAssignWeeklyDiet = async () => {
		if (!originalPlans) {
			toast.error('No weekly diet plans available to assign');
			return;
		}

		setIsAssigning(true);
		toast.info('Assigning weekly diet plans...');

		try {
			const result = await assignWeeklyDietPlan({
				userId,
				weeklyPlans: originalPlans,
			});

			if (result.success) {
				toast.success('Weekly diet plans assigned successfully!');
			} else {
				throw new Error(result.error || 'Failed to assign weekly diet plans');
			}
		} catch (error) {
			console.error('Error assigning weekly diet plans:', error);
			toast.error('Failed to assign weekly diet plans. Please try again.');
		} finally {
			setIsAssigning(false);
		}
	};

	return (
		<div className="w-full space-y-6">
			<DietControls
				onGenerate={handleGenerateDiet}
				activeDay={activeDay}
				onDayChange={handleDayChange}
			/>

			{isPending && (
				<div className="flex flex-col justify-center items-center p-8 bg-white rounded-lg shadow-sm border border-blue-100">
					<Loader2 className="h-10 w-10 animate-spin text-blue-600 mb-4" />
					<p className="text-blue-700 font-medium">
						Generating weekly diet plan with native foods...
					</p>
					<p className="text-sm text-blue-500 mt-2">
						This may take a moment as we create a culturally appropriate meal
						plan for the entire week
					</p>
				</div>
			)}

			{isAssigning && (
				<div className="flex flex-col justify-center items-center p-8 bg-white rounded-lg shadow-sm border border-blue-100">
					<Loader2 className="h-10 w-10 animate-spin text-green-600 mb-4" />
					<p className="text-green-700 font-medium">
						Assigning diet plan to user...
					</p>
					<p className="text-sm text-green-500 mt-2">
						Saving plan to the database and assigning to the user's profile
					</p>
				</div>
			)}

			{!isPending && !isAssigning && dietPlans && dietPlans[activeDay] && (
				<div className="mt-4 bg-white rounded-lg shadow-sm border border-blue-50 overflow-hidden">
					<div className="bg-gradient-to-r from-blue-50 to-indigo-50 p-4 border-b border-blue-100">
						<h2 className="text-xl font-semibold text-blue-800">
							{activeDay} Meal Plan
						</h2>
						<p className="text-sm text-blue-600">
							Native diet tailored to client's location and preferences
						</p>
					</div>
					<div className="p-4">
						<DietDisplay
							dietPlan={dietPlans[activeDay]}
							isGeneratedDiet={true}
							onAssignDiet={handleAssignWeeklyDiet}
						/>
					</div>
				</div>
			)}

			{!isPending && !isAssigning && dietPlans && !dietPlans[activeDay] && (
				<div className="bg-white rounded-lg shadow-sm border border-blue-50 p-6 text-center">
					<div className="mb-4">
						<svg
							xmlns="http://www.w3.org/2000/svg"
							className="h-12 w-12 mx-auto text-blue-300"
							fill="none"
							viewBox="0 0 24 24"
							stroke="currentColor"
						>
							<path
								strokeLinecap="round"
								strokeLinejoin="round"
								strokeWidth={2}
								d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"
							/>
						</svg>
					</div>
					<p className="text-gray-600 mb-4">
						No diet plan available for {activeDay}.
					</p>
					<Button
						onClick={() => handleGenerateDiet({ country: '', state: '' })}
						variant="outline"
						className="border-blue-200 text-blue-700 hover:bg-blue-50"
					>
						Generate diet plan
					</Button>
				</div>
			)}

			{!isPending && !isAssigning && !dietPlans && (
				<div className="bg-white rounded-lg shadow-sm border border-blue-50 p-6 text-center">
					<div className="mb-4">
						<svg
							xmlns="http://www.w3.org/2000/svg"
							className="h-12 w-12 mx-auto text-blue-300"
							fill="none"
							viewBox="0 0 24 24"
							stroke="currentColor"
						>
							<path
								strokeLinecap="round"
								strokeLinejoin="round"
								strokeWidth={2}
								d="M12 9v3m0 0v3m0-3h3m-3 0H9m12 0a9 9 0 11-18 0 9 9 0 0118 0z"
							/>
						</svg>
					</div>
					<p className="text-gray-600 mb-2">
						Ready to create a personalized nutrition plan?
					</p>
					<p className="text-sm text-gray-500 mb-4">
						Click "Generate Diet Plan" to create a customized plan with native
						foods based on the user's profile and location.
					</p>
				</div>
			)}
		</div>
	);
}
