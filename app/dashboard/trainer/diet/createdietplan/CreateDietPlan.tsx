'use client';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Slider } from '@/components/ui/slider';
import { Textarea } from '@/components/ui/textarea';
import { ArcElement, Chart as ChartJS, Legend, Tooltip } from 'chart.js';
import { AnimatePresence, m } from 'framer-motion';
import { ArrowRight, Save } from 'lucide-react';
import { useRouter } from 'next/navigation';
import React, { useState, useEffect } from 'react';
import { Pie } from 'react-chartjs-2';
import { toast } from 'sonner';
import { createDietPlan } from './PostDietPlan';

ChartJS.register(ArcElement, Tooltip, Legend);

interface Meal {
  name: string;
  time: string;
  calories: number;
  protein: number;
  carbs: number;
  fats: number;
  ingredients: string[];
  instructions: string;
  order: number; // Add order field
}

interface DietPlan {
  name: string;
  description: string;
  targetCalories: number;
  macroSplit: {
    protein: number;
    carbs: number;
    fats: number;
  };
  meals: Meal[];
}

const mealTimes = [
  'Breakfast (6-8 AM)',
  'Morning Snack (10-11 AM)',
  'Lunch (1-2 PM)',
  'Evening Snack (4-5 PM)',
  'Dinner (7-8 PM)',
  'Late Night (9-10 PM)',
];

export default function CreateDietPlan() {
  const router = useRouter();
  const [currentStep, setCurrentStep] = useState(() => {
    if (typeof window !== 'undefined') {
      return Number.parseInt(localStorage.getItem('dietPlanStep') || '1');
    }
    return 1;
  });

  const [dietPlan, setDietPlan] = useState<DietPlan>(() => {
    if (typeof window !== 'undefined') {
      const savedPlan = localStorage.getItem('dietPlanData');
      return savedPlan
        ? JSON.parse(savedPlan)
        : {
            name: '',
            description: '',
            targetCalories: 2000,
            macroSplit: {
              protein: 30,
              carbs: 40,
              fats: 30,
            },
            meals: [],
          };
    }
    return {
      name: '',
      description: '',
      targetCalories: 2000,
      macroSplit: {
        protein: 30,
        carbs: 40,
        fats: 30,
      },
      meals: [],
    };
  });

  const [currentMeal, setCurrentMeal] = useState<Meal>(() => {
    if (typeof window !== 'undefined') {
      const savedMeal = localStorage.getItem('currentMealData');
      return savedMeal
        ? JSON.parse(savedMeal)
        : {
            name: '',
            time: '',
            calories: 0,
            protein: 0,
            carbs: 0,
            fats: 0,
            ingredients: [],
            instructions: '',
            order: 0,
          };
    }
    return {
      name: '',
      time: '',
      calories: 0,
      protein: 0,
      carbs: 0,
      fats: 0,
      ingredients: [],
      instructions: '',
      order: 0,
    };
  });

  // Save to localStorage whenever data changes
  useEffect(() => {
    localStorage.setItem('dietPlanStep', currentStep.toString());
    localStorage.setItem('dietPlanData', JSON.stringify(dietPlan));
    localStorage.setItem('currentMealData', JSON.stringify(currentMeal));
  }, [currentStep, dietPlan, currentMeal]);

  const [newIngredient, setNewIngredient] = useState('');

  // Add checkpoint saving logic
  const saveCheckpoint = (meal: Meal) => {
    const checkpoints = JSON.parse(localStorage.getItem('dietPlanCheckpoints') || '[]');
    checkpoints.push({
      step: currentStep,
      meal: meal,
      timestamp: new Date().toISOString(),
    });
    localStorage.setItem('dietPlanCheckpoints', JSON.stringify(checkpoints));
    toast.success('Progress saved');
  };

  const addMeal = () => {
    if (currentMeal.name && currentMeal.time) {
      setDietPlan((prev) => ({
        ...prev,
        meals: [...prev.meals, currentMeal],
      }));
      // Save checkpoint after adding meal
      saveCheckpoint(currentMeal);
      setCurrentMeal({
        name: '',
        time: '',
        calories: 0,
        protein: 0,
        carbs: 0,
        fats: 0,
        ingredients: [],
        instructions: '',
        order: 0,
      });
    }
  };

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

  const removeMeal = (index: number) => {
    setDietPlan((prev) => ({
      ...prev,
      meals: prev.meals.filter((_, i) => i !== index),
    }));
  };

  const chartData = {
    labels: ['Protein', 'Carbs', 'Fats'],
    datasets: [
      {
        data: [dietPlan.macroSplit.protein, dietPlan.macroSplit.carbs, dietPlan.macroSplit.fats],
        backgroundColor: ['#22c55e', '#3b82f6', '#ef4444'],
        borderWidth: 0,
      },
    ],
  };

  const handleSubmit = async () => {
    try {
      // Validate required fields
      if (!dietPlan.name) {
        toast.error('Please enter a plan name');
        return;
      }

      if (dietPlan.meals.length === 0) {
        toast.error('Please add at least one meal');
        return;
      }

      const total =
        dietPlan.macroSplit.protein + dietPlan.macroSplit.carbs + dietPlan.macroSplit.fats;
      if (total !== 100) {
        toast.error('Macro split percentages must add up to 100%');
        return;
      }

      // Prepare data for submission
      const dietPlanData = {
        name: dietPlan.name,
        description: dietPlan.description,
        targetCalories: dietPlan.targetCalories,
        proteinRatio: dietPlan.macroSplit.protein,
        carbsRatio: dietPlan.macroSplit.carbs,
        fatsRatio: dietPlan.macroSplit.fats,
        meals: dietPlan.meals.map((meal, index) => ({
          name: meal.name,
          timeOfDay: meal.time,
          calories: meal.calories,
          protein: meal.protein,
          carbs: meal.carbs,
          fats: meal.fats,
          instructions: meal.instructions,
          order: index + 1, // Add order based on array index
          ingredients: meal.ingredients.map((ingredient) => ({
            name: ingredient,
            quantity: 1, // Default quantity
            unit: 'serving', // Default unit
            calories: 0, // These will be updated later if needed
            protein: 0,
            carbs: 0,
            fats: 0,
          })),
        })),
      };

      const result = await createDietPlan(dietPlanData);

      if (result.success) {
        // Clear all stored data
        localStorage.removeItem('dietPlanCheckpoints');
        localStorage.removeItem('dietPlanStep');
        localStorage.removeItem('dietPlanData');
        localStorage.removeItem('currentMealData');

        toast.success(result.message);
        router.push('/trainerdashboard/diet/assigndietplan');
      } else {
        toast.error(result.message);
      }
    } catch (error) {
      console.error('Error submitting diet plan:', error);
      toast.error('Failed to create diet plan');
    }
  };

  // Add restore checkpoint function

  return (
    <div className="container mx-auto p-6">
      <m.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-4xl mx-auto"
      >
        {/* Progress Steps */}
        <div className="flex justify-between mb-8">
          {[1, 2, 3].map((step) => (
            <div
              key={step}
              className={`flex items-center ${
                currentStep >= step ? 'text-green-600' : 'text-gray-400'
              }`}
            >
              <div
                className={`w-8 h-8 rounded-full flex items-center justify-center border-2 
                  ${currentStep >= step ? 'border-green-600 bg-green-50' : 'border-gray-300'}`}
              >
                {step}
              </div>
              {step < 3 && (
                <div
                  className={`flex-1 h-1 mx-4 ${
                    currentStep > step ? 'bg-green-600' : 'bg-gray-300'
                  }`}
                />
              )}
            </div>
          ))}
        </div>

        <AnimatePresence mode="wait">
          {/* Step 1: Basic Information */}
          {currentStep === 1 && (
            <m.div
              key="step1"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 20 }}
              className="space-y-6"
            >
              {/* ... Step 1 content ... */}
              <h2 className="text-2xl font-bold">Diet Plan Basics</h2>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium mb-2" htmlFor="plan-name">
                    Plan Name
                  </label>
                  <Input
                    value={dietPlan.name}
                    onChange={(e) => setDietPlan((prev) => ({ ...prev, name: e.target.value }))}
                    placeholder="e.g., Weight Loss Meal Plan"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2" htmlFor="plan-description">
                    Description
                  </label>
                  <Textarea
                    value={dietPlan.description}
                    onChange={(e) =>
                      setDietPlan((prev) => ({
                        ...prev,
                        description: e.target.value,
                      }))
                    }
                    placeholder="Describe the goals and features of this diet plan..."
                    rows={4}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2" htmlFor="plan-target-calories">
                    Target Daily Calories: {dietPlan.targetCalories}
                  </label>
                  <Slider
                    defaultValue={[dietPlan.targetCalories]}
                    max={4000}
                    min={1200}
                    step={100}
                    onValueChange={([value]) =>
                      setDietPlan((prev) => ({
                        ...prev,
                        targetCalories: value,
                      }))
                    }
                  />
                </div>
              </div>
            </m.div>
          )}

          {/* Step 2: Macro Split */}
          {currentStep === 2 && (
            <m.div
              key="step2"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 20 }}
              className="space-y-6"
            >
              <h2 className="text-2xl font-bold">Macro Split</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="space-y-6">
                  <div>
                    <label className="block text-sm font-medium mb-2" htmlFor="plan-protein">
                      Protein: {dietPlan.macroSplit.protein}%
                    </label>
                    <Slider
                      defaultValue={[dietPlan.macroSplit.protein]}
                      max={60}
                      min={10}
                      step={5}
                      onValueChange={([value]) =>
                        setDietPlan((prev) => ({
                          ...prev,
                          macroSplit: { ...prev.macroSplit, protein: value },
                        }))
                      }
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-2" htmlFor="plan-carbs">
                      Carbs: {dietPlan.macroSplit.carbs}%
                    </label>
                    <Slider
                      defaultValue={[dietPlan.macroSplit.carbs]}
                      max={60}
                      min={10}
                      step={5}
                      onValueChange={([value]) =>
                        setDietPlan((prev) => ({
                          ...prev,
                          macroSplit: { ...prev.macroSplit, carbs: value },
                        }))
                      }
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-2" htmlFor="plan-fats">
                      Fats: {dietPlan.macroSplit.fats}%
                    </label>
                    <Slider
                      defaultValue={[dietPlan.macroSplit.fats]}
                      max={60}
                      min={10}
                      step={5}
                      onValueChange={([value]) =>
                        setDietPlan((prev) => ({
                          ...prev,
                          macroSplit: { ...prev.macroSplit, fats: value },
                        }))
                      }
                    />
                  </div>
                </div>
                <div className="flex items-center justify-center">
                  <div className="w-64 h-64">
                    <Pie data={chartData} />
                  </div>
                </div>
              </div>
            </m.div>
          )}

          {/* Step 3: Meal Planning */}
          {currentStep === 3 && (
            <m.div
              key="step3"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 20 }}
              className="space-y-6"
            >
              <h2 className="text-2xl font-bold">Meal Planning</h2>

              {/* Current Meal Form */}
              <div className="bg-white p-6 rounded-lg border border-gray-200 space-y-4">
                <h3 className="text-lg font-semibold">Add New Meal</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium mb-2" htmlFor="plan-name">
                      Meal Name
                    </label>
                    <Input
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
                    <label className="block text-sm font-medium mb-2" htmlFor="plan-time">
                      Time of Day
                    </label>
                    <Select
                      onValueChange={(value) =>
                        setCurrentMeal((prev) => ({ ...prev, time: value }))
                      }
                    >
                      <SelectTrigger>
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
                    <label className="block text-sm font-medium mb-2" htmlFor="plan-calories">
                      Calories
                    </label>
                    <Input
                      type="number"
                      value={currentMeal.calories}
                      onChange={(e) =>
                        setCurrentMeal((prev) => ({
                          ...prev,
                          calories: Number.parseInt(e.target.value),
                        }))
                      }
                      placeholder="Calories"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-2" htmlFor="plan-protein">
                      Protein (g)
                    </label>
                    <Input
                      type="number"
                      value={currentMeal.protein}
                      onChange={(e) =>
                        setCurrentMeal((prev) => ({
                          ...prev,
                          protein: Number.parseInt(e.target.value),
                        }))
                      }
                      placeholder="Protein in grams"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-2" htmlFor="plan-carbs">
                      Carbs (g)
                    </label>
                    <Input
                      type="number"
                      value={currentMeal.carbs}
                      onChange={(e) =>
                        setCurrentMeal((prev) => ({
                          ...prev,
                          carbs: Number.parseInt(e.target.value),
                        }))
                      }
                      placeholder="Carbs in grams"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-2" htmlFor="plan-fats">
                      Fats (g)
                    </label>
                    <Input
                      type="number"
                      value={currentMeal.fats}
                      onChange={(e) =>
                        setCurrentMeal((prev) => ({
                          ...prev,
                          fats: Number.parseInt(e.target.value),
                        }))
                      }
                      placeholder="Fats in grams"
                    />
                  </div>
                </div>

                {/* Ingredients Section */}
                <div className="space-y-3">
                  <label className="block text-sm font-medium mb-2" htmlFor="plan-ingredients">
                    Ingredients
                  </label>
                  <div className="flex gap-2">
                    <Input
                      value={newIngredient}
                      onChange={(e) => setNewIngredient(e.target.value)}
                      placeholder="Add ingredient"
                      onKeyPress={(e) => e.key === 'Enter' && addIngredient()}
                    />
                    <Button onClick={addIngredient} type="button">
                      Add
                    </Button>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {currentMeal.ingredients.map((ingredient, index) => (
                      <div
                        key={index as number}
                        className="bg-gray-100 px-3 py-1 rounded-full flex items-center gap-2"
                      >
                        <span>{ingredient}</span>
                        <button
                          onClick={() => removeIngredient(index)}
                          className="text-gray-500 hover:text-red-500"
                          type="button"
                        >
                          ×
                        </button>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Instructions */}
                <div>
                  <label className="block text-sm font-medium mb-2" htmlFor="plan-instructions">
                    Instructions
                  </label>
                  <Textarea
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

                <Button onClick={addMeal} className="w-full">
                  Add Meal to Plan
                </Button>
              </div>

              {/* Meals List */}
              <div className="space-y-4">
                <h3 className="text-lg font-semibold">Planned Meals</h3>
                {dietPlan.meals.map((meal, index) => (
                  <m.div
                    key={index as number}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="bg-white p-4 rounded-lg border border-gray-200"
                  >
                    <div className="flex justify-between items-start">
                      <div>
                        <h4 className="font-medium">{meal.name}</h4>
                        <p className="text-sm text-gray-600">{meal.time}</p>
                        <p className="text-sm">
                          Calories: {meal.calories} | P: {meal.protein}g | C: {meal.carbs}g | F:{' '}
                          {meal.fats}g
                        </p>
                        {meal.ingredients.length > 0 && (
                          <div className="mt-2">
                            <p className="text-sm font-medium">Ingredients:</p>
                            <p className="text-sm text-gray-600">{meal.ingredients.join(', ')}</p>
                          </div>
                        )}
                        {meal.instructions && (
                          <div className="mt-2">
                            <p className="text-sm font-medium">Instructions:</p>
                            <p className="text-sm text-gray-600">{meal.instructions}</p>
                          </div>
                        )}
                      </div>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => removeMeal(index)}
                        className="text-red-500 hover:text-red-700"
                      >
                        Remove
                      </Button>
                    </div>
                  </m.div>
                ))}
              </div>
            </m.div>
          )}
        </AnimatePresence>

        {/* Navigation Buttons */}
        <div className="flex justify-between mt-8">
          <Button
            onClick={() => setCurrentStep((current) => Math.max(current - 1, 1))}
            disabled={currentStep === 1}
          >
            Previous
          </Button>
          {currentStep === 3 ? (
            <Button onClick={handleSubmit} variant="default">
              <Save className="w-4 h-4 mr-2" />
              Save Diet Plan
            </Button>
          ) : (
            <Button onClick={() => setCurrentStep((current) => Math.min(current + 1, 3))}>
              Next
              <ArrowRight className="w-4 h-4 ml-2" />
            </Button>
          )}
        </div>
      </m.div>
    </div>
  );
}
