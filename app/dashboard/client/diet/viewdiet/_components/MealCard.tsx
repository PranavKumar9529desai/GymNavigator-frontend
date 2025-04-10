'use client';

import React, { useState } from 'react';
import { Meal } from '../_actions/get-todays-diet';
import { ChevronDown, ChevronUp } from 'lucide-react';
import { NutritionCard } from './NutritionCard';

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
        color: 'text-blue-600',
        borderColor: 'border-blue-500'
      };
    if (timeOfDay.includes('1:00 PM')) 
      return { 
        type: 'Lunch', 
        color: 'text-amber-600',
        borderColor: 'border-amber-500'
      };
    if (timeOfDay.includes('4:00 PM')) 
      return { 
        type: 'Snack', 
        color: 'text-green-600',
        borderColor: 'border-green-500'
      };
    if (timeOfDay.includes('7:00 PM')) 
      return { 
        type: 'Dinner', 
        color: 'text-purple-600',
        borderColor: 'border-purple-500'
      };
    return { 
      type: 'Meal', 
      color: 'text-gray-600',
      borderColor: 'border-gray-500'
    };
  };

  const mealInfo = getMealTypeInfo(meal.timeOfDay);

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
    <div className={`border-b border-gray-100 pb-3`}>
      {/* Meal header */}
      <div className={`border-l-2 ${mealInfo.borderColor} pl-3 mb-2`}>
        <div className="flex items-center justify-between">
          <div>
            <h3 className={`font-medium text-sm ${mealInfo.color}`}>
              {mealInfo.type}: {meal.name}
            </h3>
            <div className="text-xs text-gray-500">
              {meal.timeOfDay}
            </div>
          </div>
          
          <button 
            onClick={() => setIsExpanded(!isExpanded)}
            className="text-gray-500 hover:bg-gray-50 rounded p-1 transition-colors"
            aria-expanded={isExpanded}
            aria-label={isExpanded ? "Collapse meal details" : "Expand meal details"}
          >
            {isExpanded ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
          </button>
        </div>
      </div>
      
      {/* Nutrition snapshot always visible */}
      <div className="py-2">
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
        <div className={`py-2 mt-2 border-t border-gray-100`}>
          {/* Ingredients */}
          <div className="mb-3">
            <h4 className="text-xs font-semibold text-gray-700 mb-1">
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
            <h4 className="text-xs font-semibold text-gray-700 mb-1">
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