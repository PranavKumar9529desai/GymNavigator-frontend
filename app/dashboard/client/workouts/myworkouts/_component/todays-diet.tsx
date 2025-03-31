'use client';

import {
	Apple,
	ChevronDown,
	ChevronUp,
	Clock,
	Droplets,
	Flame,
	Utensils,
	Wheat,
} from 'lucide-react';
import { useState } from 'react';
import type { DietPlan } from '../_actions/get-todays-diet';

interface TodaysDietProps {
	dietPlan: DietPlan;
}

export const TodaysDiet = ({ dietPlan }: TodaysDietProps) => {
	const [expandedMeal, setExpandedMeal] = useState<number | null>(
		dietPlan.meals.length > 0 ? dietPlan.meals[0].id : null,
	);

	const toggleExpand = (mealId: number) => {
		setExpandedMeal(expandedMeal === mealId ? null : mealId);
	};

	// If no diet plan, show a message
	if (dietPlan.meals.length === 0) {
		return (
			<div className="w-full bg-white rounded-xl border border-gray-100 p-6 text-center">
				<div className="mb-4 flex justify-center">
					<div className="bg-blue-100 p-3 rounded-full">
						<Utensils className="w-6 h-6 text-blue-600" />
					</div>
				</div>
				<h3 className="text-xl font-medium text-gray-900 mb-2">
					No meals scheduled for today
				</h3>
				<p className="text-gray-600">
					You don't have any meals scheduled for today. Check with your trainer
					for your diet plan.
				</p>
			</div>
		);
	}

	return (
		<div className="w-full">
			{/* Header Section with Gradient Background */}
			<div className="relative mb-6 rounded-2xl overflow-hidden">
				<div className="bg-gradient-to-r from-green-500 to-teal-600 p-6">
					<div className="flex items-center gap-3 mb-2">
						<div className="bg-white/20 p-2 rounded-full">
							<Utensils className="w-5 h-5 text-white" />
						</div>
						<h2 className="text-2xl font-bold text-white">Today's Diet Plan</h2>
					</div>
					<p className="text-green-100">
						Track your meals and nutrition for today
					</p>

					{/* Diet Plan Stats Summary */}
					<div className="flex flex-wrap gap-4 mt-4">
						<div className="bg-white/10 rounded-lg px-3 py-2 text-white flex items-center gap-2">
							<Flame className="w-4 h-4" />
							<span>{dietPlan.targetCalories} calories</span>
						</div>
						<div className="bg-white/10 rounded-lg px-3 py-2 text-white flex items-center gap-2">
							<Apple className="w-4 h-4" />
							<span>{dietPlan.meals.length} meals</span>
						</div>
					</div>

					{/* Macro Breakdown */}
					<div className="grid grid-cols-3 gap-2 mt-4">
						<div className="bg-white/10 rounded-lg p-2 text-white text-center">
							<div className="text-xs opacity-80">Protein</div>
							<div className="font-semibold">{dietPlan.proteinRatio}%</div>
						</div>
						<div className="bg-white/10 rounded-lg p-2 text-white text-center">
							<div className="text-xs opacity-80">Carbs</div>
							<div className="font-semibold">{dietPlan.carbsRatio}%</div>
						</div>
						<div className="bg-white/10 rounded-lg p-2 text-white text-center">
							<div className="text-xs opacity-80">Fats</div>
							<div className="font-semibold">{dietPlan.fatsRatio}%</div>
						</div>
					</div>
				</div>

				{/* Decorative wave */}
				<div className="absolute bottom-0 left-0 right-0">
					<svg
						xmlns="http://www.w3.org/2000/svg"
						viewBox="0 0 1440 80"
						className="w-full h-6"
						aria-hidden="true"
						role="img"
					>
						<title>Decorative wave pattern</title>
						<path
							fill="#ffffff"
							fillOpacity="1"
							d="M0,32L80,42.7C160,53,320,75,480,74.7C640,75,800,53,960,42.7C1120,32,1280,32,1360,32L1440,32L1440,80L1360,80C1280,80,1120,80,960,80C800,80,640,80,480,80C320,80,160,80,80,80L0,80Z"
						/>
					</svg>
				</div>
			</div>

			<div className="space-y-6">
				{dietPlan.meals.map((meal) => (
					<div
						key={meal.id}
						className="bg-white rounded-xl border border-gray-100 overflow-hidden"
					>
						{/* Meal Header - Always visible */}
						<button
							type="button"
							className={`w-full text-left p-5 border-b border-gray-100 transition-colors ${
								expandedMeal === meal.id ? 'bg-green-50' : ''
							}`}
							onClick={() => toggleExpand(meal.id)}
							onKeyDown={(e) => {
								if (e.key === 'Enter' || e.key === ' ') {
									toggleExpand(meal.id);
								}
							}}
							aria-expanded={expandedMeal === meal.id}
						>
							<div className="flex items-start justify-between">
								<div className="flex-1">
									<h3 className="text-xl font-semibold text-gray-900 mb-1">
										{meal.name}
									</h3>
									<div className="flex items-center text-gray-600 text-base">
										<Clock className="w-4 h-4 mr-1" />
										<span>{meal.timeOfDay}</span>
									</div>
								</div>
								<div className="flex flex-col items-end gap-2 ml-2">
									{expandedMeal === meal.id ? (
										<ChevronUp className="w-5 h-5 text-gray-500" />
									) : (
										<ChevronDown className="w-5 h-5 text-gray-500" />
									)}
								</div>
							</div>
						</button>

						{/* Meal Details - Expandable */}
						{expandedMeal === meal.id && (
							<div className="p-5">
								{/* Nutrition Information */}
								<div className="mb-5">
									<h4 className="font-medium text-gray-900 mb-3">Nutrition</h4>
									<div className="grid grid-cols-2 gap-3 text-base">
										<div className="flex items-center gap-2 bg-green-50 p-3 rounded">
											<Flame className="w-5 h-5 text-green-600" />
											<span>{meal.calories} calories</span>
										</div>
										<div className="flex items-center gap-2 bg-green-50 p-3 rounded">
											<Droplets className="w-5 h-5 text-green-600" />
											<span>{meal.protein}g protein</span>
										</div>
										<div className="flex items-center gap-2 bg-green-50 p-3 rounded">
											<Wheat className="w-5 h-5 text-green-600" />
											<span>{meal.carbs}g carbs</span>
										</div>
										<div className="flex items-center gap-2 bg-green-50 p-3 rounded">
											<Droplets className="w-5 h-5 text-green-600" />
											<span>{meal.fats}g fats</span>
										</div>
									</div>
								</div>

								{/* Ingredients */}
								<div className="mb-5">
									<h4 className="font-medium text-gray-900 mb-3">
										Ingredients
									</h4>
									<ul className="bg-gray-50 rounded-lg p-4 space-y-2">
										{meal.ingredients.map((ingredient) => (
											<li
												key={`${meal.id}-${ingredient.name}`}
												className="flex justify-between text-gray-700"
											>
												<span>{ingredient.name}</span>
												{ingredient.quantity && (
													<span className="text-gray-500">
														{ingredient.quantity}
													</span>
												)}
											</li>
										))}
									</ul>
								</div>

								{/* Instructions */}
								{meal.instructions && (
									<div>
										<h4 className="font-medium text-gray-900 mb-3">
											Instructions
										</h4>
										<div className="bg-gray-50 rounded-lg p-4 text-gray-700">
											<p>{meal.instructions}</p>
										</div>
									</div>
								)}
							</div>
						)}
					</div>
				))}
			</div>
		</div>
	);
};
