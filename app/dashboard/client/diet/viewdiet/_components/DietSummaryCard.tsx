'use client';

import React from 'react';
import { DietPlan } from '../_actions/get-todays-diet';
import { CalendarDays, TargetIcon, FlameIcon, BarChart3 } from 'lucide-react';
import { NutritionCard } from './NutritionCard';

interface DietSummaryCardProps {
  dietPlan: DietPlan;
}

export const DietSummaryCard = ({ dietPlan }: DietSummaryCardProps) => {
  // Calculate totals
  const totalCalories = dietPlan.meals.reduce((acc, meal) => acc + meal.calories, 0);
  const totalProtein = dietPlan.meals.reduce((acc, meal) => acc + meal.protein, 0);
  const totalCarbs = dietPlan.meals.reduce((acc, meal) => acc + meal.carbs, 0);
  const totalFats = dietPlan.meals.reduce((acc, meal) => acc + meal.fats, 0);

  // Calculate percentages for the progress bars
  const caloriePercentage = Math.min(Math.round((totalCalories / dietPlan.targetCalories) * 100), 100);
  
  // Format created date
  const formattedDate = new Date(dietPlan.createdAt).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric'
  });

  return (
    <div className="bg-white overflow-hidden mb-4">
      <div className="px-3 py-3 bg-gradient-to-r from-blue-600 to-indigo-700">
        <div className="flex justify-between items-center">
          <h3 className="text-base font-medium text-white">{dietPlan.name}</h3>
          <div className="flex items-center text-blue-100">
            <CalendarDays className="h-3.5 w-3.5 mr-1" />
            <span className="text-xs">{formattedDate}</span>
          </div>
        </div>
        {dietPlan.description && (
          <p className="mt-1 max-w-full text-xs text-blue-100">{dietPlan.description}</p>
        )}
      </div>
      
      <div className="px-3 py-3">
        {/* Target vs. Actual */}
        <div className="mb-3">
          <div className="flex items-center justify-between mb-1">
            <div className="flex items-center">
              <TargetIcon className="h-4 w-4 text-indigo-600 mr-1.5" />
              <span className="text-xs font-medium text-gray-700">Daily Target</span>
            </div>
            <div className="flex items-center">
              <span className="text-xs font-semibold text-gray-900">{totalCalories} / {dietPlan.targetCalories} cal</span>
            </div>
          </div>
          
          {/* Progress bar */}
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div 
              className="bg-indigo-600 h-2 rounded-full" 
              style={{ width: `${caloriePercentage}%` }}
            />
          </div>
        </div>
        
        {/* Macro ratio targets */}
        <div className="mb-3">
          <div className="flex items-center mb-1">
            <BarChart3 className="h-4 w-4 text-indigo-600 mr-1.5" />
            <span className="text-xs font-medium text-gray-700">Macro Targets</span>
          </div>
          
          <div className="grid grid-cols-3 gap-1.5 mt-1.5">
            <div className="bg-purple-50 rounded p-1.5 text-center">
              <span className="text-[10px] text-gray-500">Protein</span>
              <p className="text-xs font-semibold text-purple-700">{dietPlan.proteinRatio}%</p>
            </div>
            <div className="bg-amber-50 rounded p-1.5 text-center">
              <span className="text-[10px] text-gray-500">Carbs</span>
              <p className="text-xs font-semibold text-amber-700">{dietPlan.carbsRatio}%</p>
            </div>
            <div className="bg-blue-50 rounded p-1.5 text-center">
              <span className="text-[10px] text-gray-500">Fats</span>
              <p className="text-xs font-semibold text-blue-700">{dietPlan.fatsRatio}%</p>
            </div>
          </div>
        </div>
        
        {/* Daily totals */}
        <div>
          <div className="flex items-center mb-1">
            <FlameIcon className="h-4 w-4 text-indigo-600 mr-1.5" />
            <span className="text-xs font-medium text-gray-700">Daily Totals</span>
          </div>
          <NutritionCard 
            calories={totalCalories}
            protein={totalProtein}
            carbs={totalCarbs}
            fats={totalFats}
            size="sm"
          />
        </div>
      </div>
    </div>
  );
}; 