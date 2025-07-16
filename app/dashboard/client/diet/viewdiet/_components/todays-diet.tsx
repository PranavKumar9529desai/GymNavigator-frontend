'use client';

import * as React from 'react';
import { Clock } from 'lucide-react';
import type { TodaysDiet } from '../_actions/get-todays-diet';
import { MealCard } from './MealCard';
import { DietSummaryCard } from './DietSummaryCard';

export default function TodaysDietComponent({
  todaysDiet: data,
}: { todaysDiet: TodaysDiet }) {
  // If no diet plan or no meals
  if (!data?.dietPlan || data.dietPlan.meals.length === 0) {
    return (
      <div className="px-3 sm:px-4">
        <div className="bg-gray-50 border border-gray-100 rounded-lg p-6 sm:p-8 text-center">
          <Clock className="h-12 w-12 text-gray-400 mx-auto mb-4" />
          <h3 className="text-xl font-medium text-gray-700 mb-2">
            No Diet Plan Available
          </h3>
          <p className="text-sm text-gray-500 mb-1">
            Your personalized diet plan is not ready yet.
          </p>
          <p className="text-xs text-gray-400 mt-4">
            Check back later or contact your trainer for assistance.
          </p>
        </div>
      </div>
    );
  }

  // Sort meals by time of day
  const sortedMeals = [...data.dietPlan.meals].sort((a, b) => {
    return a.timeOfDay.localeCompare(b.timeOfDay);
  });

  // Calculate nutrition summary
  let totalCalories = 0;
  let totalProtein = 0;
  let totalCarbs = 0;
  let totalFats = 0;
  for (const meal of data.dietPlan.meals) {
    totalCalories += meal.calories;
    totalProtein += meal.protein;
    totalCarbs += meal.carbs;
    totalFats += meal.fats;
  }

  const targetCalories = data.dietPlan.targetCalories;
  const calorieProgress = Math.round((totalCalories / targetCalories) * 100);
  let calorieStatus = '';
  let calorieBadge = '';
  if (calorieProgress > 105) {
    calorieStatus = 'text-red-600';
    calorieBadge = 'Over Target';
  } else if (calorieProgress >= 95) {
    calorieStatus = 'text-green-600';
    calorieBadge = 'On Track';
  } else {
    calorieStatus = 'text-blue-600';
    calorieBadge = 'Below Target';
  }

  // Section header pattern
  const SectionHeader = ({ icon, title }: { icon: React.ReactNode; title: string }) => (
    <div className="flex items-center gap-3 mb-3 sm:mb-4">
      <div className="w-6 h-6 rounded-full bg-gradient-to-r from-blue-400 to-indigo-400 flex items-center justify-center">
        {icon}
      </div>
      <h2 className="text-lg font-semibold text-slate-800">{title}</h2>
    </div>
  );

  return (
    <div className="px-3 sm:px-4">
      {/* Meals Section */}
      <section className="mb-8">
        <SectionHeader
          icon={<svg className="h-3 w-3 text-white" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-label="Meal icon"><title>Meal icon</title><circle cx="12" cy="12" r="10" /><path d="M12 2v8" /><path d="m4.93 10.93 1.41 1.41" /><path d="M2 18h2" /><path d="M20 18h2" /><path d="m19.07 10.93-1.41 1.41" /><path d="M22 22H2" /><path d="m8 22 4-11 4 11" /></svg>}
          title="Today's Meals"
        />
        <div className="space-y-4">
          {sortedMeals.map((meal, index) => (
            <MealCard key={meal.id} meal={meal} index={index} />
          ))}
        </div>
      </section>

      {/* Nutrition Summary Section */}
      <section className="mb-4">
        <SectionHeader
          icon={<svg className="h-3 w-3 text-white" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-label="Nutrition icon"><title>Nutrition icon</title><circle cx="12" cy="12" r="10" /><path d="M12 2v8" /><path d="m4.93 10.93 1.41 1.41" /><path d="M2 18h2" /><path d="M20 18h2" /><path d="m19.07 10.93-1.41 1.41" /><path d="M22 22H2" /><path d="m8 22 4-11 4 11" /></svg>}
          title="Nutrition Summary"
        />
        <div className="bg-white/70 rounded-lg shadow-sm border border-blue-100 p-4 sm:p-6">
          <div className="flex items-center gap-3 mb-2">
            <span className={`text-2xl font-bold text-slate-800 ${calorieStatus}`}>{totalCalories}</span>
            <span className="text-slate-600">/</span>
            <span className="text-lg font-semibold text-slate-600">{targetCalories} kcal</span>
            <span className={`ml-3 px-2 py-0.5 rounded text-xs font-medium uppercase tracking-wide ${calorieStatus} bg-blue-50`}>{calorieBadge}</span>
          </div>
          <div className="text-xs text-slate-500 mb-4">Total calories consumed vs. your daily target</div>
          <DietSummaryCard dietPlan={data.dietPlan} />
        </div>
      </section>
    </div>
  );
}
