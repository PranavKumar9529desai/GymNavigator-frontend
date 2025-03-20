"use client";

import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ChevronLeft, Dumbbell, Loader2 } from "lucide-react";
import { Suspense } from "react";
import type { UserData } from "../../_actions/get-user-by-id";
import type { WorkoutHistoryItem } from "../../_actions/get-workout-history";
import { useWorkoutViewStore } from "../../_store/workout-view-store";
import ClientWorkoutGenerator from "../client display/client-workout-generator";
import { WorkoutHistoryProvider } from "../history/workout-history-provider";
import WorkoutResults from "../workout-result/workout-results";

interface WorkoutTabsProps {
  userId: string;
  user: UserData | null;
  serverFallbackHistory: WorkoutHistoryItem[];
}

// Loading skeleton for the generate tab
function GenerateWorkoutSkeleton() {
  return (
    <div className="space-y-6">
      {/* Form header skeleton */}
      <div className="space-y-4">
        <Skeleton className="h-8 w-48" />
        <Skeleton className="h-4 w-72" />
      </div>

      {/* Form fields skeleton */}
      <div className="space-y-4">
        {[1, 2, 3].map((i) => (
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
    <div className="space-y-6">
      <h3 className="text-xl font-medium">Previously Generated Workouts</h3>
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

export default function WorkoutTabs({
  userId,
  user,
  serverFallbackHistory,
}: WorkoutTabsProps) {
  const {
    activeTab,
    setActiveTab,
    activeWorkout,
    setShowWorkoutDetails,
    reset,
  } = useWorkoutViewStore();

  const handleTabChange = (value: string) => {
    setActiveTab(value as "generate" | "history" | "workout");
    
    // If switching away from workout tab, reset the workout view
    if (value !== "workout") {
      setShowWorkoutDetails(false);
    }
  };

  const handleBackToHistory = () => {
    setActiveTab("history");
    setShowWorkoutDetails(false);
  };

  return (
    <Tabs
      value={activeTab}
      onValueChange={handleTabChange}
      className="space-y-6"
    >
      <div className="sticky top-0 z-10 pb-2 pt-1 bg-background/80 backdrop-blur-sm border-b border-indigo-100/20">
        <div className="container max-w-5xl mx-auto px-4">
          <div className="flex justify-center">
            <TabsList className="w-full max-w-md bg-gradient-to-r from-indigo-50 to-blue-50/50 border border-indigo-100/50 shadow-sm rounded-lg">
              <TabsTrigger
                value="generate"
                className="flex-1 data-[state=active]:bg-gradient-to-r data-[state=active]:from-indigo-500 data-[state=active]:to-blue-500 data-[state=active]:text-white data-[state=active]:shadow-sm"
              >
                Generate
              </TabsTrigger>
              <TabsTrigger
                value="history"
                className="flex-1 data-[state=active]:bg-gradient-to-r data-[state=active]:from-indigo-500 data-[state=active]:to-blue-500 data-[state=active]:text-white data-[state=active]:shadow-sm"
              >
                History
              </TabsTrigger>
              <TabsTrigger
                value="workout"
                className="flex-1 data-[state=active]:bg-gradient-to-r data-[state=active]:from-indigo-500 data-[state=active]:to-blue-500 data-[state=active]:text-white data-[state=active]:shadow-sm"
              >
                Workout
              </TabsTrigger>
            </TabsList>
          </div>
        </div>
      </div>

      <TabsContent
        value="generate"
        className="space-y-6 mt-6 focus-visible:outline-none focus-visible:ring-0"
      >
        <Suspense fallback={<GenerateWorkoutSkeleton />}>
          <ClientWorkoutGenerator user={user} />
        </Suspense>
      </TabsContent>

      <TabsContent
        value="history"
        className="focus-visible:outline-none focus-visible:ring-0"
      >
        <Suspense fallback={<HistorySkeleton />}>
          <div className="space-y-6">
            <h3 className="text-xl font-medium">Previously Generated Workouts</h3>
            <WorkoutHistoryProvider
              userId={userId}
              serverFallbackHistory={serverFallbackHistory}
            />
          </div>
        </Suspense>
      </TabsContent>

      <TabsContent
        value="workout"
        className="focus-visible:outline-none focus-visible:ring-0"
      >
        {activeWorkout ? (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <Button
                variant="ghost"
                size="sm"
                className="flex items-center gap-1 text-muted-foreground hover:text-foreground"
                onClick={handleBackToHistory}
              >
                <ChevronLeft className="h-4 w-4" />
                <span>Back to history</span>
              </Button>
              <div className="text-sm text-muted-foreground">
                Workout for: <span className="font-medium">{activeWorkout.clientName}</span>
              </div>
            </div>
            
            <WorkoutResults
              workoutPlan={activeWorkout.workoutPlan}
              onSave={() => {
                // After saving, you might want to go back to history
                handleBackToHistory();
              }}
              onDiscard={handleBackToHistory}
              userId={userId}
              userName={user?.name}
            />
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center py-16 text-center">
            <div className="w-16 h-16 rounded-full bg-muted flex items-center justify-center mb-4">
              <Dumbbell className="h-8 w-8 text-muted-foreground" />
            </div>
            <h3 className="text-xl font-medium mb-2">No Workout Selected</h3>
            <p className="text-muted-foreground max-w-md mb-6">
              Please select a workout from your history or generate a new one to view it here.
            </p>
            <Button 
              variant="outline" 
              onClick={() => setActiveTab("history")}
              className="gap-1"
            >
              <ChevronLeft className="h-4 w-4" />
              Go to Workout History
            </Button>
          </div>
        )}
      </TabsContent>
    </Tabs>
  );
} 