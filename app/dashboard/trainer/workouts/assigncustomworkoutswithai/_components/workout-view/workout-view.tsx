"use client";

import { useWorkoutViewStore } from "../../_store/workout-view-store";
import WorkoutResults from "../workout-result/workout-results";

interface WorkoutViewProps {
  userId: string;
  userName?: string;
}

export default function WorkoutView({ userId, userName }: WorkoutViewProps) {
  const { activeWorkout, showWorkoutDetails, setShowWorkoutDetails } = useWorkoutViewStore();

  if (!showWorkoutDetails || !activeWorkout) return null;

  return (
    <div className="mt-8">
      <WorkoutResults
        workoutPlan={activeWorkout.workoutPlan}
        onSave={() => {
          setShowWorkoutDetails(false);
        }}
        onDiscard={() => {
          setShowWorkoutDetails(false);
        }}
        userId={userId}
        userName={userName}
      />
    </div>
  );
} 