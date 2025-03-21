'use client';

import { useQuery } from '@tanstack/react-query';
import { Clock, UtensilsCrossed } from 'lucide-react';
import { fetchTodaysDiet } from '../_actions/get-todays-diet';
import { BreakfastIcon, DefaultMealIcon, DinnerIcon, LunchIcon, SnackIcon } from './MealIcons';

// Helper function to determine icon based on meal time
const getMealIcon = (timeOfDay: string) => {
  if (timeOfDay.includes('7:00 AM')) return BreakfastIcon;
  if (timeOfDay.includes('1:00 PM')) return LunchIcon;
  if (timeOfDay.includes('4:00 PM')) return SnackIcon;
  if (timeOfDay.includes('7:00 PM')) return DinnerIcon;
  return DefaultMealIcon;
};

// Helper function to determine color based on meal time
const getMealColor = (timeOfDay: string) => {
  if (timeOfDay.includes('7:00 AM')) return 'from-blue-100 to-blue-50 border-blue-200';
  if (timeOfDay.includes('1:00 PM')) return 'from-amber-100 to-amber-50 border-amber-200';
  if (timeOfDay.includes('7:00 PM')) return 'from-purple-100 to-purple-50 border-purple-200';
  if (timeOfDay.includes('4:00 PM')) return 'from-green-100 to-green-50 border-green-200';
  return 'from-gray-100 to-gray-50 border-gray-200';
};

// Helper function to determine meal type priority for sorting
const getMealTypePriority = (timeOfDay: string): number => {
  if (timeOfDay.includes('7:00 AM')) return 1; // Breakfast
  if (timeOfDay.includes('1:00 PM')) return 2; // Lunch
  if (timeOfDay.includes('4:00 PM')) return 3; // Snack
  if (timeOfDay.includes('7:00 PM')) return 4; // Dinner
  return 5; // Other
};

// Helper function to get meal type label
const getMealTypeLabel = (timeOfDay: string): string => {
  if (timeOfDay.includes('7:00 AM')) return 'Breakfast';
  if (timeOfDay.includes('1:00 PM')) return 'Lunch';
  if (timeOfDay.includes('4:00 PM')) return 'Snack';
  if (timeOfDay.includes('7:00 PM')) return 'Dinner';
  return 'Meal';
};

export default function TodaysDiet() {
  const { data, error } = useQuery({
    queryKey: ['todaysDiet'],
    queryFn: fetchTodaysDiet,
  });

  if (error) {
    return (
      <div className="bg-red-50 text-red-700 p-4 rounded-lg text-center">
        <p>Failed to load diet information. Please try again later.</p>
      </div>
    );
  }

  // If no diet plan or no meals
  if (!data?.dietPlan || data.dietPlan.meals.length === 0) {
    return (
      <div className="text-center py-10">
        <div className="mx-auto w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mb-4">
          <UtensilsCrossed size={24} className="text-gray-500" />
        </div>
        <p className="text-gray-500">No diet plan available for today.</p>
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
    <div className="max-w-2xl mx-auto">
      <div className="space-y-8">
        {sortedMeals.map((meal, index) => {
          const Icon = getMealIcon(meal.timeOfDay);
          const colorClasses = getMealColor(meal.timeOfDay);
          const mealTypeLabel = getMealTypeLabel(meal.timeOfDay);

          // Parse instructions into items for display
          const instructionItems = meal.instructions
            ? meal.instructions
                .split(/[.;]/)
                .map((item) => item.trim())
                .filter((item) => item.length > 0)
            : [];

          // If splitting didn't work, use the full instructions
          const items =
            instructionItems.length > 0
              ? instructionItems
              : meal.instructions
                ? [meal.instructions]
                : ['No specific instructions provided'];

          return (
            <div key={`meal-${meal.id}`} className="relative">
              <div className="flex items-center mb-2">
                <div
                  className={`h-12 w-12 rounded-full bg-gradient-to-br ${colorClasses} border flex items-center justify-center z-10 shadow-sm`}
                >
                  <Icon size={20} className="text-gray-700" />
                </div>
                <div className="ml-4">
                  <h3 className="text-lg font-medium text-gray-800">
                    {mealTypeLabel}: {meal.name}
                  </h3>
                  <div className="flex items-center text-sm text-gray-600">
                    <Clock size={14} className="mr-1" />
                    {meal.timeOfDay}
                  </div>
                </div>
              </div>

              <div
                className={`ml-6 pl-8 border-l-2 ${
                  index === sortedMeals.length - 1 ? '' : 'pb-10'
                } border-gray-300 dark:border-gray-600 relative`}
              >
                {/* Timeline connector dot */}
                <div className="absolute -left-[5px] top-0 h-3 w-3 rounded-full bg-gray-300 dark:bg-gray-600" />

                <div
                  className={`bg-gradient-to-br ${colorClasses} rounded-lg p-4 border shadow-sm`}
                >
                  <ul className="space-y-3">
                    {items.map((item, itemIndex) => (
                      <li
                        key={`instruction-${meal.id}-${itemIndex}`}
                        className="text-gray-700 flex items-start"
                      >
                        <span className="inline-block w-1.5 h-1.5 rounded-full bg-gray-500 mr-2 mt-2" />
                        <span>{item}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
