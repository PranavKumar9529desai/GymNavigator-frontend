'use client';

import React, { useState } from 'react';
import { Meal } from '../_actions/get-todays-diet';
import { Clock, ChevronDown, ChevronUp, List, UtensilsCrossed } from 'lucide-react';
import { NutritionCard } from './NutritionCard';

// Import meal icon components
import {
  BreakfastIcon,
  DefaultMealIcon,
  DinnerIcon,
  LunchIcon,
  SnackIcon,
} from './MealIcons';

interface MealCardProps {
  meal: Meal;
  index: number;
}

export const MealCard = ({ meal, index }: MealCardProps) => {
  const [isExpanded, setIsExpanded] = useState(false);

  // Determine meal type from timeOfDay
  const getMealTypeInfo = (timeOfDay: string) => {
    if (timeOfDay.includes('7:00 AM')) 
      return { 
        type: 'Breakfast', 
        icon: BreakfastIcon, 
        color: 'from-blue-500 to-blue-400', 
        bgColor: 'bg-blue-50',
        borderColor: 'border-blue-100',
        textColor: 'text-blue-700'
      };
    if (timeOfDay.includes('1:00 PM')) 
      return { 
        type: 'Lunch', 
        icon: LunchIcon, 
        color: 'from-amber-500 to-amber-400',
        bgColor: 'bg-amber-50',
        borderColor: 'border-amber-100',
        textColor: 'text-amber-700'
      };
    if (timeOfDay.includes('4:00 PM')) 
      return { 
        type: 'Snack', 
        icon: SnackIcon, 
        color: 'from-green-500 to-green-400',
        bgColor: 'bg-green-50',
        borderColor: 'border-green-100',
        textColor: 'text-green-700'
      };
    if (timeOfDay.includes('7:00 PM')) 
      return { 
        type: 'Dinner', 
        icon: DinnerIcon, 
        color: 'from-purple-500 to-purple-400',
        bgColor: 'bg-purple-50',
        borderColor: 'border-purple-100',
        textColor: 'text-purple-700'
      };
    return { 
      type: 'Meal', 
      icon: DefaultMealIcon, 
      color: 'from-gray-500 to-gray-400',
      bgColor: 'bg-gray-50',
      borderColor: 'border-gray-100',
      textColor: 'text-gray-700'
    };
  };

  const mealInfo = getMealTypeInfo(meal.timeOfDay);
  const MealIcon = mealInfo.icon;

  // Parse ingredients and instructions for display
  const ingredientsList = meal.ingredients.length > 0 
    ? meal.ingredients 
    : [{ name: 'No ingredients listed', quantity: null }];

  // Parse instructions into items for display
  const instructionItems = meal.instructions
    ? meal.instructions
        .split(/[.;]/)
        .map(item => item.trim())
        .filter(item => item.length > 0)
    : ['No specific instructions provided'];

  return (
    <div className={`bg-white overflow-hidden mb-3 border-l-4 ${mealInfo.borderColor}`}>
      {/* Card header with gradient */}
      <div className={`bg-gradient-to-r ${mealInfo.color} px-3 py-2`}>
        <div className="flex items-center justify-between">
          <div className="flex items-center">
            <div className="bg-white rounded-full p-1 mr-2 shadow-sm">
              <MealIcon size={18} className={mealInfo.textColor} />
            </div>
            <div>
              <h3 className="font-medium text-sm text-white">
                {mealInfo.type}: {meal.name}
              </h3>
              <div className="flex items-center text-xs text-white/80">
                <Clock size={10} className="mr-1" />
                {meal.timeOfDay}
              </div>
            </div>
          </div>
          
          <button 
            onClick={() => setIsExpanded(!isExpanded)}
            className="text-white hover:bg-white/10 rounded-full p-1 transition-colors"
            aria-expanded={isExpanded}
            aria-label={isExpanded ? "Collapse meal details" : "Expand meal details"}
          >
            {isExpanded ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
          </button>
        </div>
      </div>
      
      {/* Nutrition snapshot always visible */}
      <div className="px-3 py-2">
        <NutritionCard 
          calories={meal.calories}
          protein={meal.protein}
          carbs={meal.carbs}
          fats={meal.fats}
          size="sm"
        />
      </div>
      
      {/* Expandable content */}
      {isExpanded && (
        <div className={`px-3 py-2 ${mealInfo.bgColor} border-t border-gray-100`}>
          {/* Ingredients */}
          <div className="mb-3">
            <h4 className="text-xs font-semibold text-gray-700 mb-1 flex items-center">
              <UtensilsCrossed size={14} className="mr-1" />
              Ingredients
            </h4>
            <ul className="space-y-1">
              {ingredientsList.map((ingredient, idx) => (
                <li key={`${meal.id}-ingredient-${idx}`} className="text-xs text-gray-600 flex items-start">
                  <span className="inline-block w-1 h-1 rounded-full bg-gray-400 mr-1.5 mt-1.5" />
                  <span>
                    {ingredient.name}
                    {ingredient.quantity && <span className="text-gray-500 ml-1">({ingredient.quantity})</span>}
                  </span>
                </li>
              ))}
            </ul>
          </div>
          
          {/* Instructions */}
          <div>
            <h4 className="text-xs font-semibold text-gray-700 mb-1 flex items-center">
              <List size={14} className="mr-1" />
              Instructions
            </h4>
            <ol className="space-y-1 list-decimal pl-4">
              {instructionItems.map((instruction, idx) => (
                <li key={`${meal.id}-instruction-${idx}`} className="text-xs text-gray-600">
                  {instruction}
                </li>
              ))}
            </ol>
          </div>
        </div>
      )}
    </div>
  );
}; 