import { Card } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Activity, ChevronLeft, Dumbbell, Zap } from "lucide-react";
import Link from "next/link";
import { Suspense } from "react";
import { getUserById } from "./_actions/get-user-by-id";
import type { UserData } from "./_actions/get-user-by-id";
import ClientWorkoutGenerator from "./_components/client display/client-workout-generator";

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

  return (
    <div className="container max-w-5xl  pb-16">
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
              {Array.from({ length: 12 }).map((_, i) => (
                <div 
                  key={i} 
                  className="flex items-center justify-center opacity-20"
                  style={{ 
                    transform: `translate(${Math.random() * 100 - 50}%, ${Math.random() * 100 - 50}%)`,
                    position: 'absolute',
                    left: `${(i % 4) * 25}%`,
                    top: `${Math.floor(i / 4) * 33}%`
                  }}
                >
                  <Dumbbell className="h-8 w-8" strokeWidth={1} />
                </div>
              ))}
            </div>
          </div>
          
          {/* Glowing effects */}
          <div className="absolute top-1/2 right-1/4 h-40 w-40 rounded-full bg-blue-400/30 blur-3xl"></div>
          <div className="absolute bottom-0 left-1/4 h-32 w-32 rounded-full bg-indigo-300/20 blur-3xl"></div>
          
          <div className="relative z-10">
            <div className="inline-flex items-center gap-2 bg-white/20 backdrop-blur-sm text-white px-4 py-1.5 rounded-full text-sm font-medium mb-4 shadow-sm">
              <Zap className="h-4 w-4" />
              AI-Powered Workout Builder
            </div>
            
            <h1 className="text-3xl sm:text-4xl font-bold tracking-tight mb-3 drop-shadow-sm">
              Craft <span className="text-blue-200">Perfect Workouts</span> in Seconds
            </h1>
            
            <p className="max-w-2xl text-base text-indigo-100/90 sm:text-lg">
              Let our AI design personalized workout plans tailored to your client's specific goals
              and fitness level — turning hours of planning into moments.
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

        <Tabs defaultValue="generate" className="space-y-6">
          <div className="bg-background sticky top-0 z-10 pb-2 pt-1 backdrop-blur-sm border-b">
            <TabsList className="w-full max-w-md mx-auto">
              <TabsTrigger value="generate" className="flex-1">Generate</TabsTrigger>
              <TabsTrigger value="history" className="flex-1">History</TabsTrigger>
            </TabsList>
          </div>

          <TabsContent value="generate" className="space-y-6 mt-6 focus-visible:outline-none focus-visible:ring-0">
            <Suspense fallback={
              <div className="space-y-4">
                <Skeleton className="h-8 w-64" />
                <Skeleton className="h-64 w-full" />
              </div>
            }>
              <ClientWorkoutGenerator user={user} />
            </Suspense>
          </TabsContent>

          <TabsContent value="history" className="focus-visible:outline-none focus-visible:ring-0">
            <Card className="p-6 sm:p-8">
              <h3 className="text-xl font-medium mb-4">
                Previously Generated Workouts
              </h3>
              {/* Workout history UI will be implemented later */}
              <div className="py-12 text-center bg-muted/20 rounded-lg">
                <div className="inline-flex h-12 w-12 items-center justify-center rounded-full bg-muted mb-4">
                  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-muted-foreground">
                    <rect width="18" height="18" x="3" y="4" rx="2" ry="2" />
                    <line x1="16" x2="16" y1="2" y2="6" />
                    <line x1="8" x2="8" y1="2" y2="6" />
                    <line x1="3" x2="21" y1="10" y2="10" />
                    <path d="M8 14h.01" />
                    <path d="M12 14h.01" />
                    <path d="M16 14h.01" />
                    <path d="M8 18h.01" />
                    <path d="M12 18h.01" />
                    <path d="M16 18h.01" />
                  </svg>
                </div>
                <p className="text-muted-foreground">
                  You haven't generated any workouts yet.
                </p>
              </div>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
