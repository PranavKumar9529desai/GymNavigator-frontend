'use client';

import React from 'react';
import { DietPlan } from '../_actions/get-todays-diet';
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
    <div className="border-b border-gray-100 pb-4">
      <div className="py-2 border-l-4 border-indigo-500 pl-3">
        <div className="flex justify-between items-center">
          <h3 className="text-base font-medium text-gray-800">{dietPlan.name}</h3>
          <span className="text-xs text-gray-500">{formattedDate}</span>
        </div>
        {dietPlan.description && (
          <p className="mt-1 max-w-full text-xs text-gray-500">{dietPlan.description}</p>
        )}
      </div>
      
      <div className="mt-4">
        {/* Target vs. Actual */}
        <div className="mb-4">
          <div className="flex items-center justify-between mb-1">
            <span className="text-xs font-medium text-gray-700">Daily Target</span>
            <span className="text-xs font-semibold text-gray-900">{totalCalories} / {dietPlan.targetCalories} cal</span>
          </div>
          
          {/* Progress bar */}
          <div className="w-full bg-gray-100 h-2">
            <div 
              className="bg-indigo-600 h-2" 
              style={{ width: `${caloriePercentage}%` }}
            />
          </div>
        </div>
        
        {/* Macro ratio targets */}
        <div className="mb-4">
          <span className="text-xs font-medium text-gray-700 mb-2 block">Macro Targets</span>
          
          <div className="grid grid-cols-3 gap-3 mt-2">
            <div className="border-b-2 border-purple-500 pb-1">
              <p className="text-xs font-semibold text-purple-700">{dietPlan.proteinRatio}%</p>
              <span className="text-[10px] text-gray-500">Protein</span>
            </div>
            <div className="border-b-2 border-amber-500 pb-1">
              <p className="text-xs font-semibold text-amber-700">{dietPlan.carbsRatio}%</p>
              <span className="text-[10px] text-gray-500">Carbs</span>
            </div>
            <div className="border-b-2 border-blue-500 pb-1">
              <p className="text-xs font-semibold text-blue-700">{dietPlan.fatsRatio}%</p>
              <span className="text-[10px] text-gray-500">Fats</span>
            </div>
          </div>
        </div>
        
        {/* Daily totals */}
        <div>
          <span className="text-xs font-medium text-gray-700 mb-2 block">Daily Totals</span>
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