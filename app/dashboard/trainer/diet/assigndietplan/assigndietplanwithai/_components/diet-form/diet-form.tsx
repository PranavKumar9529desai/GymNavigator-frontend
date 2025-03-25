'use client';

import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { zodResolver } from '@hookform/resolvers/zod';
import { Loader2, Sparkles } from 'lucide-react';
import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import type { DietPlan } from '../../../_actions /GetallDiets';
import { generateAIDiet } from '../../_actions/generate-ai-diet';
import type { UserData } from '../../_actions/get-user-by-id';
import { useDietViewStore } from '../../_store/diet-view-store';
import { dietGenerationSchema } from '../../types/dietGenerationSchema';
import type { DietGenerationParams } from '../../types/dietGenerationSchema';
import { useSaveToLocalStorageMutation } from '../diet-history/use-diet-history';

const DIET_PREFERENCES = [
  'Vegetarian',
  'Vegan',
  'Pescatarian',
  'Keto',
  'Paleo',
  'Mediterranean',
  'No Restrictions',
];

const MEDICAL_CONDITIONS = [
  'Diabetes',
  'Hypertension',
  'Celiac Disease',
  'Lactose Intolerance',
  'None',
];

interface DietFormProps {
  userId: string;
  userData?: UserData | null;
  onGenerateStateChange?: (generating: boolean) => void;
  onDietGenerated?: (diet: { clientName: string; dietPlan: DietPlan }) => void;
}

export function DietForm({
  userId,
  userData,
  onGenerateStateChange,
  onDietGenerated,
}: DietFormProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [clientName, setClientName] = useState(userData?.name || 'Client');

  const { setActiveDiet, setActiveTab } = useDietViewStore();
  
  const saveToLocalStorage = useSaveToLocalStorageMutation();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<DietGenerationParams>({
    resolver: zodResolver(dietGenerationSchema),
    defaultValues: {
      medicalConditions: [],
      dietPreference: 'No Restrictions',
    },
  });

  const onSubmit = async (data: DietGenerationParams) => {
    try {
      setIsLoading(true);
      // Update the parent component about the loading state
      if (onGenerateStateChange) {
        onGenerateStateChange(true);
      }

      // Call our server action directly with simplified error handling
      const result = await generateAIDiet(data);

      // Create diet object with client name
      const dietData = {
        clientName: clientName,
        dietPlan: result,
      };

      // Save the diet to localStorage 
      await saveToLocalStorage.mutateAsync({
        clientName: clientName,
        dietPlan: result,
        userId
      });

      // Update the store and automatically switch to the diet tab
      setActiveDiet(dietData);

      // Notify parent component about diet generation
      if (onDietGenerated) {
        onDietGenerated(dietData);
      }

      // Automatically switch to the diet tab
      setActiveTab('diet');
    } catch (error) {
      console.error('Error generating diet plan:', error, userId);
      // Handle error appropriately - you could set an error state here
    } finally {
      setIsLoading(false);
      // Update the parent component that loading is done
      if (onGenerateStateChange) {
        onGenerateStateChange(false);
      }
    }
  };

  return (
    <div className="max-w-2xl mx-auto">
      <Card className="bg-white/70 dark:bg-gray-950/70 border border-indigo-100/50 dark:border-indigo-800/30">
        <CardContent className="p-6">
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            {/* Client Name - optional field for reference */}
            <div>
              <label htmlFor="clientName" className="block text-sm font-medium mb-2">
                Client Name (Optional)
              </label>
              <input
                id="clientName"
                type="text"
                value={clientName}
                onChange={(e) => setClientName(e.target.value)}
                className="w-full p-2 border rounded focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                placeholder="Enter client name"
              />
            </div>

            {/* Diet Preference */}
            <div>
              <label htmlFor="dietPreference" className="block text-sm font-medium mb-2">
                Diet Preference <span className="text-red-500">*</span>
              </label>
              <select
                id="dietPreference"
                {...register('dietPreference')}
                className="w-full p-2 border rounded focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
              >
                {DIET_PREFERENCES.map((pref) => (
                  <option key={pref} value={pref}>
                    {pref}
                  </option>
                ))}
              </select>
              {errors.dietPreference && (
                <p className="text-red-500 text-sm mt-1">{errors.dietPreference.message}</p>
              )}
            </div>

            {/* Medical Conditions */}
            <div>
              <fieldset>
                <legend className="block text-sm font-medium mb-2">
                  Medical Conditions <span className="text-red-500">*</span>
                </legend>
                <div className="space-y-2">
                  {MEDICAL_CONDITIONS.map((condition) => {
                    const id = `condition-${condition}`;
                    return (
                      <label key={condition} htmlFor={id} className="flex items-center">
                        <input
                          id={id}
                          type="checkbox"
                          value={condition}
                          {...register('medicalConditions')}
                          className="mr-2 h-4 w-4 text-indigo-600 focus:ring-indigo-500"
                        />
                        {condition}
                      </label>
                    );
                  })}
                </div>
              </fieldset>
              {errors.medicalConditions && (
                <p className="text-red-500 text-sm mt-1">{errors.medicalConditions.message}</p>
              )}
            </div>

            {/* Location */}
            <div>
              <label htmlFor="location" className="block text-sm font-medium mb-2">
                Location <span className="text-red-500">*</span>
              </label>
              <input
                id="location"
                type="text"
                {...register('location')}
                className="w-full p-2 border rounded focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                placeholder="Enter city/region"
                required
              />
              {errors.location && (
                <p className="text-red-500 text-sm mt-1">{errors.location.message}</p>
              )}
            </div>

            {/* Country */}
            <div>
              <label htmlFor="country" className="block text-sm font-medium mb-2">
                Country <span className="text-red-500">*</span>
              </label>
              <input
                id="country"
                type="text"
                {...register('country')}
                className="w-full p-2 border rounded focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                placeholder="Enter country"
                required
              />
              {errors.country && (
                <p className="text-red-500 text-sm mt-1">{errors.country.message}</p>
              )}
            </div>

            {/* Target Calories */}
            <div>
              <label htmlFor="targetCalories" className="block text-sm font-medium mb-2">
                Target Calories <span className="text-red-500">*</span>
              </label>
              <input
                id="targetCalories"
                type="number"
                {...register('targetCalories', { valueAsNumber: true })}
                className="w-full p-2 border rounded focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                placeholder="Enter target calories"
                required
              />
              {errors.targetCalories && (
                <p className="text-red-500 text-sm mt-1">{errors.targetCalories.message}</p>
              )}
            </div>

            {/* Special Instructions */}
            <div>
              <label htmlFor="specialInstructions" className="block text-sm font-medium mb-2">
                Special Instructions (Optional)
              </label>
              <textarea
                id="specialInstructions"
                {...register('specialInstructions')}
                className="w-full p-2 border rounded focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                placeholder="Enter any special instructions or preferences"
                rows={3}
              />
              {errors.specialInstructions && (
                <p className="text-red-500 text-sm mt-1">{errors.specialInstructions.message}</p>
              )}
            </div>

            <Button
              type="submit"
              disabled={isLoading}
              className="w-full bg-gradient-to-br from-indigo-600/90 via-blue-600/80 to-indigo-700/90 hover:from-indigo-600 hover:to-blue-600 text-white py-2 px-4 rounded shadow-md disabled:opacity-50"
            >
              {isLoading ? (
                <>
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  Generating...
                </>
              ) : (
                <>
                  <Sparkles className="h-4 w-4 mr-2" />
                  Generate Diet Plan
                </>
              )}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
