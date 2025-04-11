"use client";
import { useQuery } from "@tanstack/react-query";
import { useSelectedLayoutSegments } from "next/navigation";
import type { ReactNode } from "react";

interface ClientLayoutProps {
  children: ReactNode;
}

export default function ClientLayout({ children }: ClientLayoutProps) {
  const segments = useSelectedLayoutSegments();

  // Check if we're in workout or diet routes based on the menu structure
  const isWorkoutRoute = segments.includes("workouts");
  const isDietRoute = segments.includes("diet");

  // Define protected workout routes
  const protectedWorkoutRoutes = ["myworkouts"];
  // Define protected diet routes
  const protectedDietRoutes = ["viewdiet", "grocerylist", "eatingoutguide"];

  // Check if current route needs protection
  const needsWorkoutProtection =
    isWorkoutRoute &&
    segments.some((segment) => protectedWorkoutRoutes.includes(segment));
  const needsDietProtection =
    isDietRoute &&
    segments.some((segment) => protectedDietRoutes.includes(segment));

  const { data: assignmentStatus } = useQuery({
    queryKey: ["assignmentStatus"],
    queryFn: () => ({ data: { workout_assigned: true, diet_assigned: true } }), // This will use the prefetched data
  });

  // Only check assignments if we're in protected routes
  if (needsWorkoutProtection || needsDietProtection) {
    // For workout routes, check workout assignment
    if (needsWorkoutProtection && !assignmentStatus?.data?.workout_assigned) {
      return (
        <div className="min-h-screen flex items-center justify-center">
          <div className="text-center">
            <p className="text-lg font-semibold mb-2">
              You don't have any workout plans assigned yet.
            </p>
            <p className="text-gray-600">
              You can explore available workouts in the "All Workouts" section.
              Contact your trainer to get a personalized workout plan.
            </p>
          </div>
        </div>
      );
    }

    // For diet routes, check diet assignment
    if (needsDietProtection && !assignmentStatus?.data?.diet_assigned) {
      return (
        <div className="min-h-screen flex items-center justify-center">
          <div className="text-center">
            <p className="text-lg font-semibold mb-2">
              You don't have any diet plans assigned yet.
            </p>
            <p className="text-gray-600">
              Please contact your trainer to get a personalized diet plan.
            </p>
          </div>
        </div>
      );
    }
  }

  return children;
}
