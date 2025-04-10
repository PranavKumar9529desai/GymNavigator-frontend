'use client';

import React from 'react';
import { FlameIcon, Droplets, Beef, Cookie } from 'lucide-react';

interface NutritionCardProps {
  calories: number;
  protein: number;
  carbs: number;
  fats: number;
  size?: 'sm' | 'md' | 'lg';
  showLabels?: boolean;
}

export const NutritionCard = ({
  calories,
  protein,
  carbs,
  fats,
  size = 'md',
  showLabels = true,
}: NutritionCardProps) => {
  // Determine the size classes
  const sizeClasses = {
    sm: {
      container: 'p-1.5',
      grid: 'grid-cols-4 gap-1',
      icon: 'h-3.5 w-3.5',
      value: 'text-xs font-semibold',
      label: 'text-[10px]'
    },
    md: {
      container: 'p-2',
      grid: 'grid-cols-4 gap-1.5',
      icon: 'h-4 w-4',
      value: 'text-sm font-semibold',
      label: 'text-[11px]'
    },
    lg: {
      container: 'p-3',
      grid: 'grid-cols-4 gap-2',
      icon: 'h-5 w-5',
      value: 'text-base font-bold',
      label: 'text-xs'
    },
  };

  const classes = sizeClasses[size];

  return (
    <div className={`bg-white ${classes.container}`}>
      <div className={`grid ${classes.grid}`}>
        {/* Calories */}
        <div className="flex flex-col items-center justify-center">
          <div className="flex items-center justify-center rounded-full bg-red-50 p-1.5 mb-0.5">
            <FlameIcon className={`text-red-500 ${classes.icon}`} />
          </div>
          <span className={`${classes.value} text-gray-800`}>{calories}</span>
          {showLabels && <span className={`${classes.label} text-gray-500`}>cal</span>}
        </div>

        {/* Protein */}
        <div className="flex flex-col items-center justify-center">
          <div className="flex items-center justify-center rounded-full bg-purple-50 p-1.5 mb-0.5">
            <Beef className={`text-purple-500 ${classes.icon}`} />
          </div>
          <span className={`${classes.value} text-gray-800`}>{protein}g</span>
          {showLabels && <span className={`${classes.label} text-gray-500`}>prot</span>}
        </div>

        {/* Carbs */}
        <div className="flex flex-col items-center justify-center">
          <div className="flex items-center justify-center rounded-full bg-amber-50 p-1.5 mb-0.5">
            <Cookie className={`text-amber-500 ${classes.icon}`} />
          </div>
          <span className={`${classes.value} text-gray-800`}>{carbs}g</span>
          {showLabels && <span className={`${classes.label} text-gray-500`}>carb</span>}
        </div>

        {/* Fats */}
        <div className="flex flex-col items-center justify-center">
          <div className="flex items-center justify-center rounded-full bg-blue-50 p-1.5 mb-0.5">
            <Droplets className={`text-blue-500 ${classes.icon}`} />
          </div>
          <span className={`${classes.value} text-gray-800`}>{fats}g</span>
          {showLabels && <span className={`${classes.label} text-gray-500`}>fat</span>}
        </div>
      </div>
    </div>
  );
}; 