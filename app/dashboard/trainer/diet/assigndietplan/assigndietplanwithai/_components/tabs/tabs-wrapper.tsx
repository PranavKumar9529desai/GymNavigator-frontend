"use client";

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import React, { useState } from "react";
import type { DietPlan } from "../../../_actions /GetallDiets";
import { useDietViewStore } from "../../_store/diet-view-store";
import type { TabType } from "../../_store/diet-view-store";
import { DietForm } from "../diet-form/diet-form";
import { DietFormSkeleton } from "../diet-form/diet-form-skeleton";
import { DietHistory } from "../diet-history/diet-history";
import DietResults from "../diet-result/diet-results";
import DietSkeleton from "../diet-result/diet-skeleton";

interface TabsWrapperProps {
  userId: string;
}

export function TabsWrapper({ userId }: TabsWrapperProps) {
  const { activeTab, setActiveTab, activeDiet, setActiveDiet } =
    useDietViewStore();
  const [isGenerating, setIsGenerating] = useState(false);

  // Handler to be passed to DietForm to set the generating state
  const handleGenerateStateChange = (generating: boolean) => {
    setIsGenerating(generating);
  };

  // Handler for Generate Diet Plan button in empty state
  const handleEmptyStateGenerate = () => {
    setActiveTab("generate");
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
            onGenerateStateChange={handleGenerateStateChange}
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
            onSuccess={() => setActiveTab("history")}
            userId={userId}
          />
        ) : (
          <div className="flex flex-col items-center justify-center p-8 text-center">
            <h3 className="text-lg font-medium">No active diet plan</h3>
            <p className="text-sm text-gray-500 mt-2">
              Generate a new diet plan to see it here
            </p>
            <button
              type="button"
              onClick={handleEmptyStateGenerate}
              className="mt-4 px-4 py-2 bg-green-600 text-white rounded-md"
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
            setActiveTab("diet");
          }}
          userId={userId}
        />
      </TabsContent>
    </Tabs>
  );
}
