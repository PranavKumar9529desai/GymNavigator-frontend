import { Suspense } from "react";
import { Card } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import ClientWorkoutGenerator from "./_components/client-workout-generator";
import { getUserById } from "./_actions/get-user-by-id";
import { ChevronLeft } from "lucide-react";
import Link from "next/link";
import type { UserData } from "./_actions/get-user-by-id";
import { Skeleton } from "@/components/ui/skeleton";

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
    <div className="container max-w-5xl px-4 sm:px-6 pb-16">
      {/* Navigation with improved mobile tap target */}
      <Link
        href="/dashboard/trainer/workouts"
        className="inline-flex items-center text-muted-foreground hover:text-foreground mb-8 py-2 transition-colors"
      >
        <ChevronLeft className="h-4 w-4 mr-1" />
        <span>Back to workouts</span>
      </Link>

      <div className="space-y-8">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight mb-2">
            Assign AI-Generated Workouts
          </h1>
          <p className="text-muted-foreground max-w-2xl">
            Create personalized workout plans with AI assistance tailored to your client's fitness goals and experience level
          </p>
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
