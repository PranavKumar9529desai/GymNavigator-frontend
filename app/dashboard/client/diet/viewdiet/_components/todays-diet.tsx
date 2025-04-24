"use client";

import { LoadingSpinner } from "@/components/ui/spinner";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { fetchTodaysDiet } from "../_actions/get-todays-diet";
import { DietSummaryCard } from "./DietSummaryCard";
import { MealCard } from "./MealCard";

// Helper function to determine meal type priority for sorting
const getMealTypePriority = (timeOfDay: string): number => {
  if (timeOfDay.includes("7:00 AM")) return 1; // Breakfast
  if (timeOfDay.includes("1:00 PM")) return 2; // Lunch
  if (timeOfDay.includes("4:00 PM")) return 3; // Snack
  if (timeOfDay.includes("7:00 PM")) return 4; // Dinner
  return 5; // Other
};

export default function TodaysDiet() {
  const _queryClient = useQueryClient();

  const { data, isLoading, isError, refetch } = useQuery({
    queryKey: ["todaysDiet"],
    queryFn: fetchTodaysDiet,
    staleTime: 1000 * 60 * 15, // 15 minutes
    refetchOnWindowFocus: true,
  });

  // Handle loading state
  if (isLoading) {
    return (
      <div className="space-y-6">
        {/* Diet summary skeleton */}
        <div className="border-b border-gray-100 pb-4">
          <div className="h-52 bg-gray-50 animate-pulse rounded-lg" />
          <div className="mt-3 grid grid-cols-4 gap-2">
            {[...Array(4)].map((_, i) => (
              <div
                key={`nutrition-skeleton-${i as number}`}
                className="flex flex-col items-center"
              >
                <div className="h-4 w-12 bg-gray-200 animate-pulse rounded" />
                <div className="mt-1 h-3 w-8 bg-gray-100 animate-pulse rounded" />
              </div>
            ))}
          </div>
        </div>

        {/* Meals skeletons */}
        <div>
          <div className="h-5 w-32 bg-gray-200 animate-pulse rounded mb-3" />
          <div className="space-y-4">
            {[...Array(4)].map((_, i) => (
              <div
                key={`meal-skeleton-${i as number}`}
                className="border-b border-gray-100 pb-3"
              >
                <div className="border-l-2 border-gray-200 pl-3 mb-2">
                  <div className="flex items-center justify-between">
                    <div>
                      <div className="h-4 w-40 bg-gray-200 animate-pulse rounded" />
                      <div className="mt-1 h-3 w-20 bg-gray-100 animate-pulse rounded" />
                    </div>
                    <div className="h-6 w-6 bg-gray-100 animate-pulse rounded-full" />
                  </div>
                </div>
                <div className="py-2 grid grid-cols-4 gap-2">
                  {[...Array(4)].map((_, j) => (
                    <div
                      key={`meal-nutrition-skeleton-${i as number}-${j as number}`}
                      className="flex flex-col items-center"
                    >
                      <div className="h-3 w-8 bg-gray-200 animate-pulse rounded" />
                      <div className="mt-1 h-2 w-6 bg-gray-100 animate-pulse rounded" />
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  // Handle error state
  if (isError) {
    return (
      <div className="text-red-700 py-3 text-center">
        <p className="text-sm">Failed to load diet information.</p>
        <button
          type="button"
          onClick={() => refetch()}
          className="mt-2 text-xs text-white bg-red-600 hover:bg-red-700 px-3 py-1 rounded-full"
          onKeyUp={() => refetch()}
        >
          Try Again
        </button>
      </div>
    );
  }

  // If no diet plan or no meals
  if (!data?.dietPlan || data.dietPlan.meals.length === 0) {
    return (
      <div className="text-center py-6">
        <p className="text-sm text-gray-500">
          No diet plan available for today.
        </p>
        <p className="text-xs text-gray-400 mt-1">
          Check back later or contact your trainer.
        </p>
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
    <div>
      {/* Diet Plan Summary */}
      <DietSummaryCard dietPlan={data.dietPlan} />

      {/* Meals Section */}
      <div className="mt-5">
        <h2 className="text-sm font-medium text-gray-800 mb-3 border-b border-gray-100 pb-2">
          Your Meals Today
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
