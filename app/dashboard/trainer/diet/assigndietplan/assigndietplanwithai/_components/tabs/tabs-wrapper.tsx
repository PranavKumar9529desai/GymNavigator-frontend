'use client';

import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useQueryClient } from '@tanstack/react-query';
import React, { useState } from 'react';
import type { DietPlan } from '../../../_actions /GetallDiets';
import type { UserData } from '../../_actions/get-user-by-id';
import { useDietViewStore } from '../../_store/diet-view-store';
import type { TabType } from '../../_store/diet-view-store';
import { DietForm } from '../diet-form/diet-form';
import { DietFormSkeleton } from '../diet-form/diet-form-skeleton';
import { DietHistory } from '../diet-history/diet-history';
import { DIET_PLANS_QUERY_KEY } from '../diet-history/use-diet-history';
import DietResults from '../diet-result/diet-results';
import DietSkeleton from '../diet-result/diet-skeleton';

interface TabsWrapperProps {
  userId: string;
  userData?: UserData | null;
}

export function TabsWrapper({ userId, userData }: TabsWrapperProps) {
  const { activeTab, setActiveTab, activeDiet, setActiveDiet } = useDietViewStore();
  const [isGenerating, setIsGenerating] = useState(false);
  const queryClient = useQueryClient();

  // Handler to be passed to DietForm to set the generating state
  const handleGenerateStateChange = (generating: boolean) => {
    setIsGenerating(generating);
  };

  // Handler for when a diet is generated
  const handleDietGenerated = (_diet: { clientName: string; dietPlan: DietPlan }) => {
    // This function is called when a diet is successfully generated
    // We can prefetch the diet history data here to ensure it's up to date
    queryClient.invalidateQueries({ queryKey: [DIET_PLANS_QUERY_KEY, userId] });
  };

  // Handler for when a diet is saved
  const handleDietSaved = () => {
    // Invalidate the diet history query to refresh the data
    queryClient.invalidateQueries({ queryKey: [DIET_PLANS_QUERY_KEY] });
    // Switch to history tab after diet is saved
    setActiveTab('history');
  };

  // Handler for Generate Diet Plan button in empty state
  const handleEmptyStateGenerate = () => {
    setActiveTab('generate');
  };

  return (
    <Tabs
      value={activeTab}
      onValueChange={(value: string) => setActiveTab(value as TabType)}
      className="w-full"
    >
      <div className="sticky top-0 z-30 bg-white/95 dark:bg-gray-950/95 backdrop-blur-sm pb-6">
        <TabsList className="grid grid-cols-3 w-full">
          <TabsTrigger value="generate">Generate</TabsTrigger>
          <TabsTrigger value="diet">Diet</TabsTrigger>
          <TabsTrigger value="history">History</TabsTrigger>
        </TabsList>
      </div>

      <TabsContent value="generate">
        {isGenerating ? (
          <DietFormSkeleton />
        ) : (
          <DietForm
            userId={userId}
            userData={userData}
            onGenerateStateChange={handleGenerateStateChange}
            onDietGenerated={handleDietGenerated}
          />
        )}
      </TabsContent>

      <TabsContent value="diet">
        {isGenerating ? (
          <DietSkeleton />
        ) : activeDiet ? (
          <DietResults
            clientName={activeDiet.clientName}
            dietPlan={activeDiet.dietPlan}
            onSuccess={handleDietSaved}
            userId={userId}
          />
        ) : (
          <div className="flex flex-col items-center justify-center p-8 text-center">
            <h3 className="text-lg font-medium">No active diet plan</h3>
            <p className="text-sm text-gray-500 mt-2">Generate a new diet plan to see it here</p>
            <button
              type="button"
              onClick={handleEmptyStateGenerate}
              className="mt-4 px-4 py-2 bg-indigo-600 hover:bg-indigo-700 dark:bg-indigo-700 dark:hover:bg-indigo-600 text-white rounded-md transition-colors"
            >
              Generate Diet Plan
            </button>
          </div>
        )}
      </TabsContent>

      <TabsContent value="history">
        <DietHistory
          onSelectDiet={(diet) => {
            setActiveDiet(diet);
            setActiveTab('diet');
          }}
          userId={userId}
        />
      </TabsContent>
    </Tabs>
  );
}
