'use client';

import { Button } from '@/components/ui/button';
import { m } from 'framer-motion';
import type { MealInterface } from '../diet-plan-types';

interface MealListProps {
	meals: MealInterface[];
	removeMeal: (index: number) => void;
}

export default function MealList({ meals, removeMeal }: MealListProps) {
	if (meals.length === 0) {
		return (
			<div className="bg-gray-50 p-6 rounded-lg border border-gray-200 text-center text-gray-500">
				No meals added yet. Use the form above to add meals to your diet plan.
			</div>
		);
	}

	return (
		<div className="space-y-4">
			<h3 className="text-lg font-semibold">Planned Meals</h3>

			{meals.map((meal, index) => (
				<m.div
					key={`meal-${meal.name}-${index}`}
					initial={{ opacity: 0, y: 20 }}
					animate={{ opacity: 1, y: 0 }}
					className="bg-white p-4 rounded-lg border border-gray-200"
				>
					<div className="flex justify-between items-start">
						<div>
							<h4 className="font-medium">{meal.name}</h4>
							<p className="text-sm text-gray-600">{meal.time}</p>
							<p className="text-sm">
								Calories: {meal.calories} | P: {meal.protein}g | C: {meal.carbs}
								g | F: {meal.fats}g
							</p>

							{meal.ingredients &&
								Array.isArray(meal.ingredients) &&
								meal.ingredients.length > 0 && (
									<div className="mt-2">
										<p className="text-sm font-medium">Ingredients:</p>
										<p className="text-sm text-gray-600">
											{meal.ingredients.join(', ')}
										</p>
									</div>
								)}

							{meal.instructions && (
								<div className="mt-2">
									<p className="text-sm font-medium">Instructions:</p>
									<p className="text-sm text-gray-600">{meal.instructions}</p>
								</div>
							)}
						</div>

						<Button
							variant="ghost"
							size="sm"
							onClick={() => removeMeal(index)}
							className="text-red-500 hover:text-red-700"
							aria-label={`Remove ${meal.name}`}
						>
							Remove
						</Button>
					</div>
				</m.div>
			))}

			<div className="mt-4 p-4 bg-blue-50 border border-blue-200 rounded-md">
				<p className="text-sm text-blue-800">
					<span className="font-medium">Total meals:</span> {meals.length}
				</p>
				<p className="text-sm text-blue-800">
					<span className="font-medium">Total calories:</span>{' '}
					{meals.reduce((sum, meal) => sum + meal.calories, 0)}
				</p>
			</div>
		</div>
	);
}
