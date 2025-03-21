import { Card } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Apple, ChevronLeft, Salad, Utensils } from "lucide-react";
import Link from "next/link";
import React from "react";
import { Suspense } from "react";
import { getUserById } from "./_actions/get-user-by-id";
import { DietHistoryProvider } from "./_components/diet-history/diet-history-provider";
import { TabsWrapper } from "./_components/tabs-wrapper";
import UserProfileCard from "./_components/user-profile-card";

// Pre-generate decoration positions
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

export default async function AssignDietPlanWithAI({
  searchParams,
}: {
  searchParams: { userId?: string };
}) {
  // Get userId from search params
  const userId = await searchParams.userId || "defaultUserId";

  // Fetch user data
  const response = await getUserById(userId);
  const user = response.success && response.data ? response.data : null;

  return (
    <DietHistoryProvider>
      <div className="container max-w-5xl pb-16">
        {/* Navigation */}
        <Link
          href="/dashboard/trainer/diet/assigndietplan"
          className="inline-flex items-center text-muted-foreground hover:text-foreground mb-8 py-2 transition-colors"
        >
          <ChevronLeft className="h-4 w-4 mr-1" />
          <span>Back to diet plans</span>
        </Link>

        <div className="space-y-8">
          {/* Hero Banner */}
          <div className="relative overflow-hidden rounded-xl bg-gradient-to-br from-green-600/90 via-emerald-600/80 to-green-700/90 p-8 border border-green-500/20 shadow-lg text-white">
            {/* Decorative background patterns */}
            <div className="absolute inset-0 opacity-5">
              <div className="absolute top-0 right-0 transform rotate-45 translate-x-1/3 -translate-y-1/2">
                <Apple className="h-48 w-48" strokeWidth={0.5} />
              </div>
              <div className="absolute bottom-0 left-0 transform -rotate-12 -translate-x-1/4 translate-y-1/3">
                <Salad className="h-40 w-40" strokeWidth={0.5} />
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
                    <Utensils className="h-8 w-8" strokeWidth={1} />
                  </div>
                ))}
              </div>
            </div>

            {/* Glowing effects */}
            <div className="absolute top-1/2 right-1/4 h-40 w-40 rounded-full bg-green-400/30 blur-3xl" />
            <div className="absolute bottom-0 left-1/4 h-32 w-32 rounded-full bg-emerald-300/20 blur-3xl" />

            <div className="relative z-10">
              <div className="inline-flex items-center gap-2 bg-white/20 backdrop-blur-sm text-white px-4 py-1.5 rounded-full text-sm font-medium mb-4 shadow-sm">
                <Utensils className="h-4 w-4" />
                AI-Powered Diet Planner
              </div>

              <h1 className="text-3xl sm:text-4xl font-bold tracking-tight mb-3 drop-shadow-sm">
                Create{" "}
                <span className="text-green-200">Perfect Diet Plans</span> in
                Seconds
              </h1>

              <p className="max-w-2xl text-base text-green-100/90 sm:text-lg">
                Let our AI design personalized nutrition plans tailored to your
                client's specific needs and health goals — turning hours of
                planning into moments.
              </p>

              {/* Decorative icons */}
              <div className="absolute right-8 bottom-6 hidden lg:flex items-center gap-3">
                <div className="h-10 w-10 rounded-full bg-white/10 backdrop-blur-sm flex items-center justify-center">
                  <Apple className="h-5 w-5 text-white" />
                </div>
                <div className="h-10 w-10 rounded-full bg-white/10 backdrop-blur-sm flex items-center justify-center">
                  <Salad className="h-5 w-5 text-white" />
                </div>
                <div className="h-10 w-10 rounded-full bg-white/10 backdrop-blur-sm flex items-center justify-center">
                  <Utensils className="h-5 w-5 text-white" />
                </div>
              </div>
            </div>
          </div>

          {/* Two-column layout */}
          <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
            {/* Left column - User Profile */}
            <div className="md:col-span-4">
              <Suspense fallback={<UserProfileSkeleton />}>
                <UserProfileCard user={user} />
              </Suspense>
            </div>

            {/* Right column - Diet Form */}
            <div className="md:col-span-8">
              <TabsWrapper userId={userId} />
            </div>
          </div>
        </div>
      </div>
    </DietHistoryProvider>
  );
}

function UserProfileSkeleton() {
  return (
    <Card className="p-6 h-full">
      <div className="space-y-4">
        <Skeleton className="h-4 w-3/4" />
        <Skeleton className="h-10 w-full" />
        <Skeleton className="h-4 w-1/2" />
        <div className="py-2">
          <Skeleton className="h-4 w-full" />
          <Skeleton className="h-4 w-full mt-2" />
          <Skeleton className="h-4 w-3/4 mt-2" />
        </div>
        <div className="flex flex-col gap-2">
          <Skeleton className="h-6 w-1/3" />
          <div className="grid grid-cols-2 gap-2">
            <Skeleton className="h-10 w-full" />
            <Skeleton className="h-10 w-full" />
          </div>
        </div>
      </div>
    </Card>
  );
}
