'use client';

import React from 'react';

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
      grid: 'grid-cols-4 gap-2',
      value: 'text-xs font-semibold',
      label: 'text-[10px]'
    },
    md: {
      grid: 'grid-cols-4 gap-3',
      value: 'text-sm font-semibold',
      label: 'text-[11px]'
    },
    lg: {
      grid: 'grid-cols-4 gap-4',
      value: 'text-base font-bold',
      label: 'text-xs'
    },
  };

  const classes = sizeClasses[size];

  return (
    <div className={`grid ${classes.grid}`}>
      {/* Calories */}
      <div className="flex flex-col text-center">
        <span className={`${classes.value} text-red-600`}>{calories}</span>
        {showLabels && <span className={`${classes.label} text-gray-500`}>calories</span>}
      </div>

      {/* Protein */}
      <div className="flex flex-col text-center">
        <span className={`${classes.value} text-purple-600`}>{protein}g</span>
        {showLabels && <span className={`${classes.label} text-gray-500`}>protein</span>}
      </div>

      {/* Carbs */}
      <div className="flex flex-col text-center">
        <span className={`${classes.value} text-amber-600`}>{carbs}g</span>
        {showLabels && <span className={`${classes.label} text-gray-500`}>carbs</span>}
      </div>

      {/* Fats */}
      <div className="flex flex-col text-center">
        <span className={`${classes.value} text-blue-600`}>{fats}g</span>
        {showLabels && <span className={`${classes.label} text-gray-500`}>fats</span>}
      </div>
    </div>
  );
};