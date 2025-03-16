export interface MealInterface {
  name: string;
  time: string;
  calories: number;
  protein: number;
  carbs: number;
  fats: number;
  ingredients: string[];
  instructions: string;
  order: number;
}

export interface DietPlanInterface {
  name: string;
  description: string;
  targetCalories: number;
  macroSplit: {
    protein: number;
    carbs: number;
    fats: number;
  };
  meals: MealInterface[];
}

export const mealTimes = [
  'Breakfast (6-8 AM)',
  'Morning Snack (10-11 AM)',
  'Lunch (1-2 PM)',
  'Evening Snack (4-5 PM)',
  'Dinner (7-8 PM)',
  'Late Night (9-10 PM)',
];
