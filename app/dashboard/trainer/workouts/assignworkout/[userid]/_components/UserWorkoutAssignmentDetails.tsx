"use client";

import Link from "next/link";
import { useState } from "react";
import { toast } from "sonner";
import type { AssignedUser } from "../../../../assignedusers/GetuserassignedTotrainers";
import { assignWorkoutPlan } from "../../_actions/assign-workout-plan";
import type { WorkoutPlan } from "../../_actions/get-workout-plans";
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
  const [filteredWorkouts, setFilteredWorkouts] = useState<WorkoutPlan[]>(workoutPlans);

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
        <div className="flex justify-between items-start mb-6">
          <h2 className="text-xl font-semibold">User Profile</h2>
          <Link
            href="/dashboard/trainer/workouts/createworkout"
            className="inline-flex items-center px-4 py-2 bg-gradient-to-r from-purple-600 to-indigo-600 text-white text-sm font-medium rounded-md hover:from-purple-700 hover:to-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500 transition-all"
          >
            <svg
              className="w-4 h-4 mr-2"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
              aria-hidden="true"
            >
              <title>Add icon</title>
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 4v16m8-8H4"
              />
            </svg>
            Create Custom Plan
          </Link>
        </div>
        <div className="space-y-4">
          <div className="flex items-center space-x-4">
            <div className="w-20 h-20 bg-gradient-to-br from-blue-100 to-blue-50 rounded-full flex items-center justify-center shadow-inner">
              <span className="text-2xl text-blue-600 font-semibold">{user.name[0]}</span>
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
                  <p className="font-medium text-gray-900">{user.HealthProfile.height} cm</p>
                </div>
                <div className="bg-gray-50 p-3 rounded-lg">
                  <p className="text-sm text-gray-600 mb-1">Weight</p>
                  <p className="font-medium text-gray-900">{user.HealthProfile.weight} kg</p>
                </div>
                <div className="bg-gray-50 p-3 rounded-lg">
                  <p className="text-sm text-gray-600 mb-1">Gender</p>
                  <p className="font-medium text-gray-900">{user.HealthProfile.gender}</p>
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
          <span className="px-3 py-1 bg-blue-50 text-blue-700 rounded-full text-sm font-medium">
            {filteredWorkouts.length} plans found
          </span>
        </div>

        <div className="space-y-4">
          {filteredWorkouts.length === 0 ? (
            <div className="text-center py-8">
              <p className="text-gray-500">No workout plans match your filters</p>
            </div>
          ) : (
            filteredWorkouts.map((plan) => (
              <button
                key={plan.id}
                type="button"
                className={`w-full text-left p-4 border rounded-lg transition-all ${
                  selectedPlan === plan.id
                    ? "border-blue-500 bg-blue-50 ring-2 ring-blue-200"
                    : "border-gray-200 hover:border-blue-300 hover:bg-gray-50"
                }`}
                onClick={() => setSelectedPlan(plan.id)}
              >
                <div className="flex justify-between items-start">
                  <div>
                    <h3 className="font-medium text-gray-900">{plan.name}</h3>
                    <p className="text-sm text-gray-600 mt-1">{plan.description}</p>
                  </div>
                  <span className="text-sm font-medium text-blue-600 bg-blue-50 px-3 py-1 rounded-full">
                    {plan.schedules.length} days
                  </span>
                </div>
                
                <div className="mt-3 flex flex-wrap gap-2">
                  {plan.schedules.map((schedule) => (
                    <span
                      key={schedule.id}
                      className="inline-flex items-center px-2.5 py-1 rounded-full bg-gray-100 text-xs font-medium text-gray-700"
                    >
                      {schedule.dayOfWeek} • {schedule.muscleTarget}
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
            className="text-blue-600 hover:text-blue-700 text-sm font-medium inline-flex items-center"
          >
            <svg
              className="w-4 h-4 mr-1"
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
                d="M12 6v6m0 0v6m0-6h6m-6 0H6"
              />
            </svg>
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
