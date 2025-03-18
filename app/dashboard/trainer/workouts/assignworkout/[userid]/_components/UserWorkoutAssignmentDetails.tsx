"use client";

import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import { toast } from "sonner";
import type { AssignedUser } from "../../../../assignedusers/GetuserassignedTotrainers";
import { assignWorkoutPlan } from "../../_actions/assign-workout-plan";
import type { WorkoutPlan } from "../../_actions/get-workout-plans";
import CreateWOrkoutImaage from "../_assests/gemini-logo.png";
import WorkoutSearchFilters from "./workout-search-filters";
interface Props {
  user: AssignedUser;
  workoutPlans: WorkoutPlan[];
}

export default function UserWorkoutAssignmentDetails({
  user,
  workoutPlans,
}: Props) {
  const [selectedPlan, setSelectedPlan] = useState<number | null>(null);
  const [isAssigning, setIsAssigning] = useState(false);
  const [filteredWorkouts, setFilteredWorkouts] =
    useState<WorkoutPlan[]>(workoutPlans);

  const handleAssignWorkout = async () => {
    if (!selectedPlan) {
      toast.error("Please select a workout plan");
      return;
    }

    try {
      setIsAssigning(true);
      await assignWorkoutPlan(user.id, selectedPlan);
      toast.success("Workout plan assigned successfully");
    } catch (error) {
      toast.error("Failed to assign workout plan");
      console.error("Error assigning workout plan:", error);
    } finally {
      setIsAssigning(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* User Profile Section */}
      <div className="bg-white rounded-lg shadow-md p-6">
        <div className="flex flex-col sm:flex-row sm:items-center gap-4 mb-6">
          <h2 className="text-xl font-semibold">User Profile</h2>
          <Link
            href={`/dashboard/trainer/workouts/assigncustomworkoutswithai?userId=${user.id}`}
            className="group relative flex items-center gap-3 px-4 py-3 bg-gradient-to-r from-violet-500 to-purple-600 text-white text-sm font-medium rounded-md hover:from-violet-600 hover:to-purple-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-violet-500 transition-all sm:ml-auto w-full sm:w-auto justify-center sm:justify-start overflow-hidden shadow-lg hover:shadow-xl"
          >
            <div className="relative z-10 flex items-center gap-3">
              <div className="relative flex items-center justify-center w-8 h-8 rounded-full bg-white/10 backdrop-blur-sm">
                <Image
                  src={CreateWOrkoutImaage}
                  alt="AI Workout"
                  className="w-5 h-5 object-contain brightness-0 invert opacity-90"
                />
              </div>
              <span className="font-medium tracking-wide">
                Custom Workout with AI
              </span>
            </div>
            <div className="absolute inset-0 bg-gradient-to-r from-violet-400/20 to-purple-500/20 backdrop-blur-[1px]" />
          </Link>
        </div>
        <div className="space-y-4">
          <div className="flex items-center space-x-4">
            <div className="w-20 h-20 bg-gradient-to-br from-blue-100 to-blue-50 rounded-full flex items-center justify-center shadow-inner">
              <span className="text-2xl text-blue-600 font-semibold">
                {user.name[0]}
              </span>
            </div>
            <div>
              <h3 className="font-medium text-lg">{user.name}</h3>
              <p className="text-gray-600">{user.email}</p>
            </div>
          </div>

          <div className="border-t pt-4 mt-4">
            <h4 className="font-medium mb-4 text-gray-900">Health Profile</h4>
            {user.HealthProfile ? (
              <div className="grid grid-cols-2 gap-6">
                <div className="bg-gray-50 p-3 rounded-lg">
                  <p className="text-sm text-gray-600 mb-1">Height</p>
                  <p className="font-medium text-gray-900">
                    {user.HealthProfile.height} cm
                  </p>
                </div>
                <div className="bg-gray-50 p-3 rounded-lg">
                  <p className="text-sm text-gray-600 mb-1">Weight</p>
                  <p className="font-medium text-gray-900">
                    {user.HealthProfile.weight} kg
                  </p>
                </div>
                <div className="bg-gray-50 p-3 rounded-lg">
                  <p className="text-sm text-gray-600 mb-1">Gender</p>
                  <p className="font-medium text-gray-900">
                    {user.HealthProfile.gender}
                  </p>
                </div>
                <div className="bg-gray-50 p-3 rounded-lg">
                  <p className="text-sm text-gray-600 mb-1">Goal</p>
                  <p className="font-medium text-gray-900">
                    {user.HealthProfile.goal || "Not specified"}
                  </p>
                </div>
              </div>
            ) : (
              <p className="text-gray-500">No health profile available</p>
            )}
          </div>
        </div>
      </div>

      {/* Search and Filters */}
      <WorkoutSearchFilters
        workoutPlans={workoutPlans}
        onFilterChange={setFilteredWorkouts}
      />

      {/* Workout Plans Section */}
      <div className="bg-white rounded-lg shadow-md p-6">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-xl font-semibold">Available Workout Plans</h2>
            <p className="text-sm text-gray-600 mt-1">
              Select a plan to assign to {user.name}
            </p>
          </div>
          <div className="flex items-center gap-2">
            <span className="hidden md:inline text-sm text-gray-600">
              Total:
            </span>
            <span className="px-2.5 py-1 bg-blue-50 text-blue-700 rounded-full text-sm font-medium">
              {filteredWorkouts.length}
            </span>
          </div>
        </div>

        <div className="space-y-4">
          {filteredWorkouts.length === 0 ? (
            <div className="text-center py-8">
              <p className="text-gray-500">
                No workout plans match your filters
              </p>
            </div>
          ) : (
            filteredWorkouts.map((plan) => (
              <button
                key={plan.id}
                type="button"
                className={`group w-full text-left p-4 border rounded-lg transition-all ${
                  selectedPlan === plan.id
                    ? "border-blue-500 bg-blue-50 ring-2 ring-blue-200"
                    : "border-gray-200 hover:border-blue-300 hover:bg-gray-50"
                }`}
                onClick={() => setSelectedPlan(plan.id)}
              >
                <div className="flex flex-col sm:flex-row sm:items-start gap-3">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between">
                      <h3 className="font-medium text-gray-900 truncate pr-4">
                        {plan.name}
                      </h3>
                      <div className="flex items-center gap-2 sm:hidden">
                        <span className="shrink-0 inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-50 text-blue-700">
                          {plan.schedules.length}
                          <span className="ml-1 hidden xs:inline">days</span>
                        </span>
                      </div>
                    </div>
                    {plan.description && (
                      <p className="text-sm text-gray-600 mt-1 line-clamp-2">
                        {plan.description}
                      </p>
                    )}
                  </div>
                  <div className="hidden sm:block shrink-0">
                    <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-blue-50 text-blue-700">
                      {plan.schedules.length} days
                    </span>
                  </div>
                </div>

                <div className="mt-3 flex flex-wrap gap-1.5">
                  {plan.schedules.map((schedule) => (
                    <span
                      key={schedule.id}
                      className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-700 group-hover:bg-gray-200 transition-colors"
                    >
                      <span className="w-[1.125rem] h-[1.125rem] flex items-center justify-center rounded-full bg-gray-700 text-white mr-1.5">
                        {schedule.dayOfWeek[0]}
                      </span>
                      {schedule.muscleTarget}
                    </span>
                  ))}
                </div>
              </button>
            ))
          )}
        </div>

        <div className="mt-6 flex items-center justify-between">
          <Link
            href="/dashboard/trainer/workouts/createworkout"
            className="text-blue-600 hover:text-blue-700 text-sm font-medium inline-flex items-center group"
          >
            <span className="w-5 h-5 mr-2 rounded-full bg-blue-100 text-blue-600 inline-flex items-center justify-center group-hover:bg-blue-200 transition-colors">
              <svg
                className="w-3.5 h-3.5"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
                aria-hidden="true"
              >
                <title>Create new plan icon</title>
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 4v16m8-8H4"
                />
              </svg>
            </span>
            Create New Plan
          </Link>
          <button
            type="button"
            onClick={handleAssignWorkout}
            disabled={!selectedPlan || isAssigning}
            className={`px-6 py-2.5 rounded-md text-white font-medium transition-all ${
              !selectedPlan || isAssigning
                ? "bg-gray-400 cursor-not-allowed"
                : "bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            }`}
          >
            {isAssigning ? (
              <span className="inline-flex items-center">
                <svg
                  className="animate-spin -ml-1 mr-2 h-4 w-4 text-white"
                  fill="none"
                  viewBox="0 0 24 24"
                  aria-hidden="true"
                >
                  <title>Loading spinner</title>
                  <circle
                    className="opacity-25"
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="currentColor"
                    strokeWidth="4"
                  />
                  <path
                    className="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                  />
                </svg>
                Assigning...
              </span>
            ) : (
              "Assign Workout Plan"
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
