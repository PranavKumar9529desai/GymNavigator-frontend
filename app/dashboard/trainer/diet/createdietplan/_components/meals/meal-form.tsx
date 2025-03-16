import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { useState } from 'react';
import { type MealInterface, mealTimes } from '../diet-plan-types';

interface MealFormProps {
  currentMeal: MealInterface;
  setCurrentMeal: React.Dispatch<React.SetStateAction<MealInterface>>;
  addMeal: () => void;
}

export default function MealForm({ currentMeal, setCurrentMeal, addMeal }: MealFormProps) {
  const [newIngredient, setNewIngredient] = useState('');

  const addIngredient = () => {
    if (newIngredient.trim()) {
      setCurrentMeal((prev) => ({
        ...prev,
        ingredients: [...prev.ingredients, newIngredient.trim()],
      }));
      setNewIngredient('');
    }
  };

  const removeIngredient = (index: number) => {
    setCurrentMeal((prev) => ({
      ...prev,
      ingredients: prev.ingredients.filter((_, i) => i !== index),
    }));
  };

  return (
    <div className="bg-white p-6 rounded-lg border border-gray-200 space-y-4">
      <h3 className="text-lg font-semibold">Add New Meal</h3>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium mb-2" htmlFor="meal-name">
            Meal Name
          </label>
          <Input
            id="meal-name"
            value={currentMeal.name}
            onChange={(e) =>
              setCurrentMeal((prev) => ({
                ...prev,
                name: e.target.value,
              }))
            }
            placeholder="e.g., Breakfast"
          />
        </div>
        <div>
          <label className="block text-sm font-medium mb-2" htmlFor="meal-time">
            Time of Day
          </label>
          <Select
            onValueChange={(value) =>
              setCurrentMeal((prev) => ({ ...prev, time: value }))
            }
            value={currentMeal.time || undefined}
          >
            <SelectTrigger id="meal-time">
              <SelectValue placeholder="Select time" />
            </SelectTrigger>
            <SelectContent>
              {mealTimes.map((time) => (
                <SelectItem key={time} value={time}>
                  {time}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <div>
          <label className="block text-sm font-medium mb-2" htmlFor="meal-calories">
            Calories
          </label>
          <Input
            id="meal-calories"
            type="number"
            value={currentMeal.calories || ''}
            onChange={(e) =>
              setCurrentMeal((prev) => ({
                ...prev,
                calories: Number.parseInt(e.target.value) || 0,
              }))
            }
            placeholder="Calories"
          />
        </div>
        <div>
          <label className="block text-sm font-medium mb-2" htmlFor="meal-protein">
            Protein (g)
          </label>
          <Input
            id="meal-protein"
            type="number"
            value={currentMeal.protein || ''}
            onChange={(e) =>
              setCurrentMeal((prev) => ({
                ...prev,
                protein: Number.parseInt(e.target.value) || 0,
              }))
            }
            placeholder="Protein in grams"
          />
        </div>
        <div>
          <label className="block text-sm font-medium mb-2" htmlFor="meal-carbs">
            Carbs (g)
          </label>
          <Input
            id="meal-carbs"
            type="number"
            value={currentMeal.carbs || ''}
            onChange={(e) =>
              setCurrentMeal((prev) => ({
                ...prev,
                carbs: Number.parseInt(e.target.value) || 0,
              }))
            }
            placeholder="Carbs in grams"
          />
        </div>
        <div>
          <label className="block text-sm font-medium mb-2" htmlFor="meal-fats">
            Fats (g)
          </label>
          <Input
            id="meal-fats"
            type="number"
            value={currentMeal.fats || ''}
            onChange={(e) =>
              setCurrentMeal((prev) => ({
                ...prev,
                fats: Number.parseInt(e.target.value) || 0,
              }))
            }
            placeholder="Fats in grams"
          />
        </div>
      </div>

      {/* Ingredients Section */}
      <div className="space-y-3">
        <label className="block text-sm font-medium mb-2" htmlFor="meal-ingredients">
          Ingredients
        </label>
        <div className="flex gap-2">
          <Input
            id="meal-ingredients"
            value={newIngredient}
            onChange={(e) => setNewIngredient(e.target.value)}
            placeholder="Add ingredient"
            onKeyDown={(e) => e.key === 'Enter' && (e.preventDefault(), addIngredient())}
          />
          <Button onClick={addIngredient} type="button">
            Add
          </Button>
        </div>
        <div className="flex flex-wrap gap-2 mt-2">
          {currentMeal.ingredients.map((ingredient, index) => (
            <div
              key={`ingredient-${index}`}
              className="bg-gray-100 px-3 py-1 rounded-full flex items-center gap-2"
            >
              <span>{ingredient}</span>
              <button
                onClick={() => removeIngredient(index)}
                className="text-gray-500 hover:text-red-500"
                type="button"
                aria-label={`Remove ${ingredient}`}
              >
                ×
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* Instructions */}
      <div>
        <label className="block text-sm font-medium mb-2" htmlFor="meal-instructions">
          Instructions
        </label>
        <Textarea
          id="meal-instructions"
          value={currentMeal.instructions}
          onChange={(e) =>
            setCurrentMeal((prev) => ({
              ...prev,
              instructions: e.target.value,
            }))
          }
          placeholder="Add preparation instructions"
          rows={3}
        />
      </div>

      <Button 
        onClick={addMeal} 
        className="w-full"
        disabled={!currentMeal.name || !currentMeal.time}
      >
        Add Meal to Plan
      </Button>
    </div>
  );
}
