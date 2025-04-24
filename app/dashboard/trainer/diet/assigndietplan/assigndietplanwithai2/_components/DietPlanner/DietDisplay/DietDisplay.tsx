import { Button } from '@/components/ui/button';
// src/app/diet-page/components/DietPlanner/DietDisplay.tsx
import { type Meal, MealCard } from '../DietDisplay/MealCard'; // Adjust path if needed

interface DietDisplayProps {
	dietPlan: Meal[]; // Expects an array of meal objects
	onAssignDiet?: () => void;
	isGeneratedDiet?: boolean;
}

export function DietDisplay({
	dietPlan,
	onAssignDiet,
	isGeneratedDiet = false,
}: DietDisplayProps) {
	if (!dietPlan || dietPlan.length === 0) {
		return null; // Don't render anything if there's no diet plan
	}

	// Calculate total calories
	const totalCalories = dietPlan.reduce((total, meal) => {
		const calories = Number.parseInt(meal.description.split(' ')[0], 10) || 0;
		return total + calories;
	}, 0);

	return (
		<div className="space-y-6">
			<div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
				<div className="p-3 bg-blue-50 rounded-md border border-blue-100 text-center">
					<div className="text-sm text-gray-500 mb-1">Total Calories</div>
					<div className="text-xl font-semibold text-blue-700">
						{totalCalories} kcal
					</div>
				</div>

				<div className="p-3 bg-blue-50 rounded-md border border-blue-100 text-center">
					<div className="text-sm text-gray-500 mb-1">Meals</div>
					<div className="text-xl font-semibold text-blue-700">
						{dietPlan.length}
					</div>
				</div>

				<div className="p-3 bg-blue-50 rounded-md border border-blue-100 text-center">
					<div className="text-sm text-gray-500 mb-1">Balanced Diet</div>
					<div className="text-xl font-semibold text-blue-700">
						Nutritionist Approved
					</div>
				</div>
			</div>

			{isGeneratedDiet && onAssignDiet && (
				<div className="mb-4">
					<Button
						onClick={onAssignDiet}
						className="w-full bg-green-600 hover:bg-green-700 text-white"
					>
						Assign Complete Weekly Diet Plan
					</Button>
				</div>
			)}

			<div className="space-y-4">
				{dietPlan.map((meal) => (
					<MealCard
						key={meal.id}
						meal={meal}
						isPartOfGeneratedPlan={false} // We'll use the global assign button instead
					/>
				))}
			</div>
		</div>
	);
}
