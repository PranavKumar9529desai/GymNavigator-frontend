"use client";

import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ChevronLeft, Loader2, Sparkles, Utensils } from "lucide-react";
import { Suspense, useState } from "react";
import type { DietPlan } from "../../../_actions /GetallDiets";
import {
  type DietHistoryItem,
  useDietViewStore,
} from "../../_store/diet-view-store";
import { DietForm } from "../diet-form";
import DietResults from "../diet-result/diet-results";
import { DietHistoryProvider } from "../history/diet-history-provider";

interface GeneratedDiet {
  clientName: string;
  dietPlan: DietPlan;
}

interface DietTabsProps {
  userId: string;
  userName?: string;
  serverFallbackHistory: DietHistoryItem[]; // Updated type to match DietHistoryProvider's expected type
}

// Loading skeleton for the generate tab
function GenerateDietSkeleton() {
  return (
    <div className="space-y-6 p-6">
      {/* Form header skeleton */}
      <div className="space-y-4">
        <Skeleton className="h-8 w-48" />
        <Skeleton className="h-4 w-72" />
      </div>

      {/* Form fields skeleton */}
      <div className="space-y-4">
        {[1, 2, 3, 4, 5].map((i) => (
          <div key={`field-${i}`} className="space-y-2">
            <Skeleton className="h-4 w-24" />
            <Skeleton className="h-10 w-full" />
          </div>
        ))}
      </div>

      {/* Submit button skeleton */}
      <div className="flex justify-end">
        <Skeleton className="h-10 w-32" />
      </div>
    </div>
  );
}

// Loading skeleton for the history tab
function HistorySkeleton() {
  return (
    <div className="space-y-6 p-6">
      <h3 className="text-xl font-medium">Previously Generated Diet Plans</h3>
      <div className="space-y-4">
        {[1, 2, 3].map((i) => (
          <div key={`history-${i}`} className="p-4 border rounded-lg space-y-3">
            <div className="flex justify-between items-start">
              <Skeleton className="h-6 w-1/3" />
              <Skeleton className="h-5 w-20" />
            </div>
            <Skeleton className="h-4 w-3/4" />
            <div className="flex flex-wrap gap-2">
              <Skeleton className="h-8 w-24" />
              <Skeleton className="h-8 w-32" />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default function DietTabs({
  userId,
  userName,
  serverFallbackHistory,
}: DietTabsProps) {
  // Use local state for activeTab
  const [activeTab, setActiveTab] = useState<"generate" | "history" | "diet">(
    "generate"
  );

  const { activeDiet, setShowDietDetails, reset } = useDietViewStore();

  const handleTabChange = (value: string) => {
    setActiveTab(value as "generate" | "history" | "diet");

    // If switching away from diet tab, reset the diet view
    if (value !== "diet") {
      setShowDietDetails(false);
    }
  };

  const handleBackToHistory = () => {
    setActiveTab("history");
    setShowDietDetails(false);
  };

  const handleDietGenerated = (diet: GeneratedDiet) => {
    // When a diet is generated, switch to the diet tab
    setActiveTab("diet");
    setShowDietDetails(true);
  };

  return (
    <Tabs
      value={activeTab}
      onValueChange={handleTabChange}
      className="space-y-8 "
    >
      <div className="sticky top-0 z-10 pb-4 pt-2 bg-gradient-to-b from-background via-background to-background/95 backdrop-blur-lg">
        <div className="container max-w-5xl mx-auto px-4">
          <div className="flex justify-center">
            <TabsList className="w-full max-w-md bg-gradient-to-r from-green-50/80 via-emerald-50/80 to-green-50/80 dark:from-green-950/80 dark:via-emerald-950/80 dark:to-green-950/80 border border-green-100/50 dark:border-green-800/30 shadow-md rounded-lg p-1.5">
              <TabsTrigger
                value="generate"
                className="flex-1 data-[state=active]:bg-gradient-to-br data-[state=active]:from-green-600/90 data-[state=active]:via-emerald-600/80 data-[state=active]:to-green-700/90 data-[state=active]:text-white data-[state=active]:shadow-md transition-all duration-300 rounded-md py-2"
              >
                <Sparkles className="h-4 w-4 mr-2" />
                Generate
              </TabsTrigger>
              <TabsTrigger
                value="history"
                className="flex-1 data-[state=active]:bg-gradient-to-br data-[state=active]:from-green-600/90 data-[state=active]:via-emerald-600/80 data-[state=active]:to-green-700/90 data-[state=active]:text-white data-[state=active]:shadow-md transition-all duration-300 rounded-md py-2"
              >
                <Utensils className="h-4 w-4 mr-2" />
                History
              </TabsTrigger>
              <TabsTrigger
                value="diet"
                className="flex-1 data-[state=active]:bg-gradient-to-br data-[state=active]:from-green-600/90 data-[state=active]:via-emerald-600/80 data-[state=active]:to-green-700/90 data-[state=active]:text-white data-[state=active]:shadow-md transition-all duration-300 rounded-md py-2"
              >
                <Loader2 className="h-4 w-4 mr-2" />
                Diet
              </TabsTrigger>
            </TabsList>
          </div>
        </div>
      </div>

      <TabsContent
        value="generate"
        className="space-y-6 focus-visible:outline-none focus-visible:ring-0"
      >
        <div className="container max-w-5xl mx-auto px-4">
          <Suspense fallback={<GenerateDietSkeleton />}>
            <div className="bg-gradient-to-br from-green-50/50 via-emerald-50/30 to-green-50/50 dark:from-green-950/50 dark:via-emerald-950/30 dark:to-green-950/50 p-4 rounded-lg border border-green-100/50 dark:border-green-800/20 mb-6">
              <h3 className="text-xl font-medium">Generate a Diet Plan</h3>
              <p className="text-sm text-muted-foreground mt-1">
                Fill out the form below to create a personalized diet plan
              </p>
            </div>
            <DietForm onDietGenerated={handleDietGenerated} userId={userId} />
          </Suspense>
        </div>
      </TabsContent>

      <TabsContent
        value="history"
        className="focus-visible:outline-none focus-visible:ring-0"
      >
        <div className="container max-w-5xl mx-auto px-4">
          <Suspense fallback={<HistorySkeleton />}>
            <div className="space-y-6">
              <div className="bg-gradient-to-br from-green-50/50 via-emerald-50/30 to-green-50/50 dark:from-green-950/50 dark:via-emerald-950/30 dark:to-green-950/50 p-4 rounded-lg border border-green-100/50 dark:border-green-800/20 mb-6">
                <h3 className="text-xl font-medium">
                  Previously Generated Diet Plans
                </h3>
                <p className="text-sm text-muted-foreground mt-1">
                  View and load your previously created diet plans
                </p>
              </div>
              <DietHistoryProvider
                userId={userId}
                serverFallbackHistory={serverFallbackHistory}
              />
            </div>
          </Suspense>
        </div>
      </TabsContent>

      <TabsContent
        value="diet"
        className="focus-visible:outline-none focus-visible:ring-0"
      >
        <div className="container max-w-5xl mx-auto px-4">
          {activeDiet ? (
            <div className="space-y-6">
              <div className="bg-gradient-to-br from-green-50/50 via-emerald-50/30 to-green-50/50 dark:from-green-950/50 dark:via-emerald-950/30 dark:to-green-950/50 p-4 rounded-lg border border-green-100/50 dark:border-green-800/20 flex items-center justify-between">
                <Button
                  variant="ghost"
                  size="sm"
                  className="flex items-center gap-1 text-muted-foreground hover:text-foreground"
                  onClick={handleBackToHistory}
                >
                  <ChevronLeft className="h-4 w-4" />
                  <span>Back to history</span>
                </Button>
                <div className="text-sm">
                  Diet plan for:{" "}
                  <span className="font-medium text-green-700 dark:text-green-400">
                    {activeDiet.clientName}
                  </span>
                </div>
              </div>

              <DietResults
                dietPlan={activeDiet.dietPlan}
                onSuccess={() => {
                  // After saving, you might want to go back to history
                  handleBackToHistory();
                }}
                userId={userId}
                userName={userName}
                clientName={activeDiet.clientName}
              />
            </div>
          ) : (
            <div className="bg-white/70 dark:bg-gray-950/70  border border-green-100/50 dark:border-green-800/30 rounded-lg shadow-sm">
              <div className="flex flex-col items-center justify-center py-16 text-center px-4">
                <div className="w-16 h-16 rounded-full bg-gradient-to-br from-green-100 to-emerald-100 dark:from-green-900/40 dark:to-emerald-900/40 flex items-center justify-center mb-4 shadow-inner">
                  <Utensils className="h-8 w-8 text-green-600/70 dark:text-green-400/70" />
                </div>
                <h3 className="text-xl font-medium mb-2">
                  No Diet Plan Selected
                </h3>
                <p className="text-muted-foreground max-w-md mb-6">
                  Please select a diet plan from your history or generate a new
                  one to view it here.
                </p>
                <div className="flex gap-2">
                  <Button
                    variant="outline"
                    onClick={() => setActiveTab("history")}
                    className="gap-1 border-green-200 dark:border-green-800/30"
                  >
                    <ChevronLeft className="h-4 w-4" />
                    Go to History
                  </Button>
                  <Button
                    variant="default"
                    onClick={() => setActiveTab("generate")}
                    className="gap-1 bg-gradient-to-br from-green-600/90 via-emerald-600/80 to-green-700/90 hover:from-green-600 hover:to-emerald-600 text-white shadow-md"
                  >
                    <Sparkles className="h-4 w-4" />
                    Generate New Diet Plan
                  </Button>
                </div>
              </div>
            </div>
          )}
        </div>
      </TabsContent>
    </Tabs>
  );
}
