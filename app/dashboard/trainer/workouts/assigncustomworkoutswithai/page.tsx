import { Card } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Activity, ChevronLeft, Dumbbell, Zap } from "lucide-react";
import Link from "next/link";
import { Suspense } from "react";
import { getUserById } from "./_actions/get-user-by-id";
import type { UserData } from "./_actions/get-user-by-id";
import { getWorkoutHistory } from "./_actions/get-workout-history";
import { WorkoutHistoryProvider } from "./_components/history/workout-history-provider";
import WorkoutTabs from "./_components/tabs/workout-tabs";

// Pre-generate decoration positions instead of using map with index
const decorations = [
  { left: "0%", top: "0%", transform: "translate(20%, 30%)" },
  { left: "25%", top: "0%", transform: "translate(-10%, 40%)" },
  { left: "50%", top: "0%", transform: "translate(15%, -20%)" },
  { left: "75%", top: "0%", transform: "translate(5%, 25%)" },
  { left: "0%", top: "33%", transform: "translate(-5%, 10%)" },
  { left: "25%", top: "33%", transform: "translate(25%, -15%)" },
  { left: "50%", top: "33%", transform: "translate(-20%, 20%)" },
  { left: "75%", top: "33%", transform: "translate(10%, -10%)" },
  { left: "0%", top: "66%", transform: "translate(15%, -25%)" },
  { left: "25%", top: "66%", transform: "translate(-15%, 5%)" },
  { left: "50%", top: "66%", transform: "translate(25%, 15%)" },
  { left: "75%", top: "66%", transform: "translate(-5%, -5%)" },
];

export default async function AssignCustomWorkoutsWithAI({
  searchParams,
}: {
  searchParams: { userId?: string };
}) {
  // Next.js 15.2 requires awaiting searchParams before accessing properties
  const params = await searchParams;
  const userId = params.userId || "defaultUserId";

  const response = await getUserById(userId);
  // Fix type error by ensuring user is strictly UserData | null (not undefined)
  const user: UserData | null =
    response.success && response.data ? response.data : null;

  // Get server fallback history data for passing to client component
  const historyResponse = await getWorkoutHistory(userId);
  const serverFallbackHistory =
    historyResponse.success && historyResponse.data ? historyResponse.data : [];

  return (
    <div className="container max-w-5xl pb-16">
      {/* Navigation with improved mobile tap target */}
      <Link
        href="/dashboard/trainer/workouts"
        className="inline-flex items-center text-muted-foreground hover:text-foreground mb-8 py-2 transition-colors"
      >
        <ChevronLeft className="h-4 w-4 mr-1" />
        <span>Back to workouts</span>
      </Link>

      <div className="space-y-8">
        <div className="relative overflow-hidden rounded-xl bg-gradient-to-br from-indigo-600/90 via-blue-600/80 to-indigo-700/90 p-8 border border-indigo-500/20 shadow-lg text-white">
          {/* Decorative background patterns */}
          <div className="absolute inset-0 opacity-5">
            <div className="absolute top-0 right-0 transform rotate-45 translate-x-1/3 -translate-y-1/2">
              <Dumbbell className="h-48 w-48" strokeWidth={0.5} />
            </div>
            <div className="absolute bottom-0 left-0 transform -rotate-12 -translate-x-1/4 translate-y-1/3">
              <Activity className="h-40 w-40" strokeWidth={0.5} />
            </div>
            <div className="grid grid-cols-8 grid-rows-8 h-full w-full">
              {decorations.map((style, i) => (
                <div
                  key={`deco-${i}-${style.left}-${style.top}`}
                  className="flex items-center justify-center opacity-20"
                  style={{
                    position: "absolute",
                    left: style.left,
                    top: style.top,
                    transform: style.transform,
                  }}
                >
                  <Dumbbell className="h-8 w-8" strokeWidth={1} />
                </div>
              ))}
            </div>
          </div>

          {/* Glowing effects */}
          <div className="absolute top-1/2 right-1/4 h-40 w-40 rounded-full bg-blue-400/30 blur-3xl" />
          <div className="absolute bottom-0 left-1/4 h-32 w-32 rounded-full bg-indigo-300/20 blur-3xl" />

          <div className="relative z-10">
            <div className="inline-flex items-center gap-2 bg-white/20 backdrop-blur-sm text-white px-4 py-1.5 rounded-full text-sm font-medium mb-4 shadow-sm">
              <Zap className="h-4 w-4" />
              AI-Powered Workout Builder
            </div>

            <h1 className="text-3xl sm:text-4xl font-bold tracking-tight mb-3 drop-shadow-sm">
              Craft <span className="text-blue-200">Perfect Workouts</span> in
              Seconds
            </h1>

            <p className="max-w-2xl text-base text-indigo-100/90 sm:text-lg">
              Let our AI design personalized workout plans tailored to your
              client's specific goals and fitness level — turning hours of
              planning into moments.
            </p>

            {/* Decorative icons */}
            <div className="absolute right-8 bottom-6 hidden lg:flex items-center gap-3">
              <div className="h-10 w-10 rounded-full bg-white/10 backdrop-blur-sm flex items-center justify-center">
                <Dumbbell className="h-5 w-5 text-white" />
              </div>
              <div className="h-10 w-10 rounded-full bg-white/10 backdrop-blur-sm flex items-center justify-center">
                <Activity className="h-5 w-5 text-white" />
              </div>
              <div className="h-10 w-10 rounded-full bg-white/10 backdrop-blur-sm flex items-center justify-center">
                <Zap className="h-5 w-5 text-white" />
              </div>
            </div>
          </div>
        </div>

        {/* Use the new WorkoutTabs component */}
        <WorkoutTabs
          userId={userId}
          user={user}
          serverFallbackHistory={serverFallbackHistory}
        />
      </div>
    </div>
  );
}

// TabsHistoryContent has been removed as it's now handled internally by the WorkoutTabs component

