"use client";

import { m } from "framer-motion";
import type { DietPlanInterface, MealInterface } from "../diet-plan-types";
import MealForm from "../meals/meal-form";
import MealList from "../meals/meal-list";

interface StepThreeProps {
	dietPlan: DietPlanInterface;
	currentMeal: MealInterface;
	setCurrentMeal: React.Dispatch<React.SetStateAction<MealInterface>>;
	addMeal: () => void;
	removeMeal: (index: number) => void;
	saveCheckpoint: (meal: MealInterface) => void;
}

export default function StepThree({
	dietPlan,
	currentMeal,
	setCurrentMeal,
	addMeal,
	removeMeal,
	saveCheckpoint,
}: StepThreeProps) {
	return (
		<m.div
			key="step3"
			initial={{ opacity: 0, x: -20 }}
			animate={{ opacity: 1, x: 0 }}
			exit={{ opacity: 0, x: 20 }}
			className="space-y-6"
		>
			<h2 className="text-2xl font-bold">Meal Planning</h2>

			{/* Meal Form */}
			<MealForm
				currentMeal={currentMeal}
				setCurrentMeal={setCurrentMeal}
				addMeal={addMeal}
			/>

			{/* Meals List */}
			<MealList meals={dietPlan.meals} removeMeal={removeMeal} />
		</m.div>
	);
}
