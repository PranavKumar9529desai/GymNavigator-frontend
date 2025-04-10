'use client';

import React from 'react';
import { DietPlan } from '../_actions/get-todays-diet';
import { NutritionCard } from './NutritionCard';
import { PieChart, Pie, Cell, ResponsiveContainer, BarChart, Bar, XAxis, Tooltip } from 'recharts';

interface DietSummaryCardProps {
  dietPlan: DietPlan;
}

interface MacroDataItem {
  name: string;
  value: number;
  color: string;
}

interface CalorieDataItem {
  name: string;
  calories: number;
  fill: string;
}

// Define custom interfaces for Recharts props
interface CustomPieLabelProps {
  cx: number;
  cy: number;
  midAngle: number;
  innerRadius: number;
  outerRadius: number;
  percent: number;
  index: number;
}

interface CustomTooltipProps {
  active?: boolean;
  payload?: Array<{name: string; value: number}>;
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

  // Data for pie chart
  const macroData: MacroDataItem[] = [
    { name: 'Protein', value: dietPlan.proteinRatio, color: '#9333ea' },
    { name: 'Carbs', value: dietPlan.carbsRatio, color: '#d97706' },
    { name: 'Fats', value: dietPlan.fatsRatio, color: '#3b82f6' }
  ];

  // Data for calorie bar chart
  const calorieData: CalorieDataItem[] = [
    { name: 'Current', calories: totalCalories, fill: '#4f46e5' },
    { name: 'Target', calories: dietPlan.targetCalories, fill: '#94a3b8' }
  ];

  const renderCustomizedLabel = (props: CustomPieLabelProps) => {
    const { cx, cy, midAngle, innerRadius, outerRadius, index } = props;
    const RADIAN = Math.PI / 180;
    const radius = innerRadius + (outerRadius - innerRadius) * 0.5;
    const x = cx + radius * Math.cos(-midAngle * RADIAN);
    const y = cy + radius * Math.sin(-midAngle * RADIAN);
  
    if (index === undefined || !macroData[index]) return null;
    
    return (
      <text 
        x={x} 
        y={y} 
        fill="white" 
        textAnchor={x > cx ? 'start' : 'end'} 
        dominantBaseline="central"
        fontSize={12}
      >
        {`${macroData[index].name} ${macroData[index].value}%`}
      </text>
    );
  };

  const CustomTooltip = ({ active, payload }: CustomTooltipProps) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-white p-2 text-xs shadow-sm border border-gray-100">
          <p className="text-gray-700">{`${payload[0].name}: ${payload[0].value} calories`}</p>
        </div>
      );
    }
    return null;
  };

  return (
    <div className="border-b border-gray-100 pb-4">
      <div className="py-2 border-l-4 border-indigo-500 pl-3">
        <div className="flex justify-between items-center">
          <span className="text-xs text-gray-500">{formattedDate}</span>
          <span className="text-xs font-semibold text-gray-700">{totalCalories} / {dietPlan.targetCalories} cal</span>
        </div>
        {dietPlan.description && (
          <p className="mt-1 max-w-full text-xs text-gray-500">{dietPlan.description}</p>
        )}
      </div>
      
      <div className="mt-4">
        {/* Calorie Progress Chart */}
        <div className="mb-4">
          <span className="text-xs font-medium text-gray-700 mb-2 block">Daily Target</span>
          
          <div className="h-16">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                data={calorieData}
                layout="vertical"
                margin={{ top: 5, right: 5, bottom: 5, left: 5 }}
              >
                <XAxis type="number" hide />
                <Tooltip content={<CustomTooltip />} />
                <Bar dataKey="calories" barSize={20} radius={[4, 4, 4, 4]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
        
        {/* Macro Distribution Chart */}
        <div className="mb-4">
          <span className="text-xs font-medium text-gray-700 mb-2 block">Macro Distribution</span>
          
          <div className="h-36">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={macroData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={renderCustomizedLabel}
                  outerRadius={60}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {macroData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
              </PieChart>
            </ResponsiveContainer>
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