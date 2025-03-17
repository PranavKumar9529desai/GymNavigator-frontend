"use client";

import { useQuery } from "@tanstack/react-query";
import { Clock, Coffee, Sun, Sunset, UtensilsCrossed } from "lucide-react";
import { fetchTodaysDiet } from "../_actions/get-todays-diet";

// Helper function to determine icon based on meal type
const getMealIcon = (mealType: string) => {
  const type = mealType.toLowerCase();
  if (type.includes("breakfast")) return Coffee;
  if (type.includes("lunch")) return Sun;
  if (type.includes("dinner")) return Sunset;
  return UtensilsCrossed;
};

// Helper function to determine color based on meal type
const getMealColor = (mealType: string) => {
  const type = mealType.toLowerCase();
  if (type.includes("breakfast"))
    return "from-blue-100 to-blue-50 border-blue-200";
  if (type.includes("lunch"))
    return "from-amber-100 to-amber-50 border-amber-200";
  if (type.includes("dinner"))
    return "from-purple-100 to-purple-50 border-purple-200";
  if (type.includes("snack"))
    return "from-green-100 to-green-50 border-green-200";
  return "from-gray-100 to-gray-50 border-gray-200";
};

// Helper function to determine meal type priority for sorting
const getMealTypePriority = (mealType: string): number => {
  const type = mealType.toLowerCase();
  if (type.includes("breakfast")) return 1;
  if (type.includes("lunch")) return 2;
  if (type.includes("snack")) return 3;
  if (type.includes("dinner")) return 4;
  if (type.includes("recovery")) return 5;
  return 6; // Any other meal types
};

export default function TodaysDiet() {
  const { data, error } = useQuery({
    queryKey: ["todaysDiet"],
    queryFn: fetchTodaysDiet,
  });

  if (error || !data) {
    return (
      <div className="bg-red-50 text-red-700 p-4 rounded-lg text-center">
        <p>Failed to load diet information. Please try again later.</p>
      </div>
    );
  }

  // Sort meals by type priority first, then by timing if same type
  const sortedMeals = [...data.meals].sort((a, b) => {
    const priorityA = getMealTypePriority(a.type);
    const priorityB = getMealTypePriority(b.type);
    
    // If different meal types, sort by priority
    if (priorityA !== priorityB) {
      return priorityA - priorityB;
    }
    
    // If same meal type, sort by time
    const timeA = a.timing.split(":").map(Number);
    const timeB = b.timing.split(":").map(Number);
    return timeA[0] * 60 + timeA[1] - (timeB[0] * 60 + timeB[1]);
  });

  return (
    <div className="max-w-2xl mx-auto">
      {sortedMeals.length === 0 ? (
        <div className="text-center py-10">
          <div className="mx-auto w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mb-4">
            <UtensilsCrossed size={24} className="text-gray-500" />
          </div>
          <p className="text-gray-500">No diet plan available for today.</p>
        </div>
      ) : (
        <div className="space-y-8">
          {sortedMeals.map((meal, index) => {
            const Icon = getMealIcon(meal.type);
            const colorClasses = getMealColor(meal.type);

            return (
              <div key={`${meal.type}-${index}`} className="relative">
                <div className="flex items-center mb-2">
                  <div
                    className={`h-12 w-12 rounded-full bg-gradient-to-br ${colorClasses} border flex items-center justify-center z-10`}
                  >
                    <Icon size={20} className="text-gray-700" />
                  </div>
                  <div className="ml-4">
                    <h3 className="text-lg font-medium text-gray-800">
                      {meal.type}
                    </h3>
                    <div className="flex items-center text-sm text-gray-600">
                      <Clock size={14} className="mr-1" />
                      {meal.timing}
                    </div>
                  </div>
                </div>

                <div
                  className={`ml-6 pl-8 border-l-2 border-dashed ${
                    index === sortedMeals.length - 1 ? "" : "pb-8"
                  } border-gray-200`}
                >
                  <div
                    className={`bg-gradient-to-br ${colorClasses} rounded-lg p-4 border`}
                  >
                    <ul className="space-y-2">
                      {meal.items.map((item, itemIndex) => (
                        <li
                          key={`${meal.type}-item-${itemIndex}`}
                          className="text-gray-700 flex items-start"
                        >
                          <span className="inline-block w-2 h-2 rounded-full bg-gray-700 mr-2 mt-2" />
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
      )}
    </div>
  );
}
