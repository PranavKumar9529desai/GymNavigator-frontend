"use client";

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import React from "react";
import type { DietPlan } from "../../_actions /GetallDiets";
import { useDietViewStore } from "../_store/diet-view-store";
import type { TabType } from "../_store/diet-view-store";
import { DietForm } from "./diet-form";
import { DietHistory } from "./diet-history/diet-history";
import DietResults from "./diet-result/diet-results";

interface TabsWrapperProps {
  userId: string;
}

export function TabsWrapper({ userId }: TabsWrapperProps) {
  const { activeTab, setActiveTab, activeDiet, setActiveDiet } =
    useDietViewStore();

  return (
    <Tabs value={activeTab} onValueChange={(value: string) => setActiveTab(value as TabType)} className="w-full">
      <TabsList className="grid grid-cols-3 mb-6">
        <TabsTrigger value="generate">Generate</TabsTrigger>
        <TabsTrigger value="diet">Diet</TabsTrigger>
        <TabsTrigger value="history">History</TabsTrigger>
      </TabsList>

      <TabsContent value="generate">
        <DietForm userId={userId} />
      </TabsContent>

      <TabsContent value="diet">
        {activeDiet ? (
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
              onClick={() => setActiveTab("generate")}
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
