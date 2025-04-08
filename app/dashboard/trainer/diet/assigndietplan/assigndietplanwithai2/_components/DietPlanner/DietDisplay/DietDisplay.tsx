// src/app/diet-page/components/DietPlanner/DietDisplay.tsx
import { type Meal, MealCard } from "../DietDisplay/MealCard"; // Adjust path if needed

interface DietDisplayProps {
  dietPlan: Meal[]; // Expects an array of meal objects
}

export function DietDisplay({ dietPlan }: DietDisplayProps) {
  if (!dietPlan || dietPlan.length === 0) {
    return null; // Don't render anything if there's no diet plan
  }

  return (
    <div className="mt-8">
      <h2 className="text-xl font-semibold mb-4 text-center text-red-600">
        {" "}
        {/* Added styling for "Generated diet" */}
        Generated diet
      </h2>
      <div>
        {dietPlan.map((meal) => (
          <MealCard key={meal.id} meal={meal} />
        ))}
      </div>
    </div>
  );
}
