'use client';

import { useEffect, useState } from 'react';
import type { WorkoutHistoryItem } from '../../_actions/get-workout-history';
import { useWorkoutChatStore } from '../../_store/workout-chat-store';
import WorkoutHistory from './workout-history';

interface WorkoutHistoryProviderProps {
  userId: string;
  serverFallbackHistory: WorkoutHistoryItem[];
}

export function WorkoutHistoryProvider({
  userId,
  serverFallbackHistory,
}: WorkoutHistoryProviderProps) {
  const [isLoading, setIsLoading] = useState(true);
  const [history, setHistory] = useState<WorkoutHistoryItem[]>(serverFallbackHistory);
  const { getSavedWorkouts, initializeConversation, reset } = useWorkoutChatStore();

  // biome-ignore lint/correctness/useExhaustiveDependencies: <explanation>
  useEffect(() => {
    // This runs on client-side only
    try {
      // Get saved workouts from localStorage
      const savedWorkouts = getSavedWorkouts(userId);

      // If we have saved workouts, use those instead of the server fallback
      if (savedWorkouts && savedWorkouts.length > 0) {
        setHistory(savedWorkouts);
      }
    } catch (error) {
      console.error('Error fetching saved workouts:', error);
    } finally {
      setIsLoading(false);
    }
  }, [userId, getSavedWorkouts, serverFallbackHistory]);

  // Handle view workout functionality
  const handleViewWorkout = (workout: WorkoutHistoryItem) => {
    try {
      // Reset the current conversation first
      reset();

      // If conversation history exists, restore it
      if (workout.conversationHistory && workout.conversationHistory.length > 0) {
        // Load the conversation history
        for (const message of workout.conversationHistory) {
          if (message.type === 'ai' && message.workout) {
            initializeConversation(message.workout);
            break; // We only need the last workout from AI
          }
        }
      } else {
        // Fallback to just initializing with the workout plan
        initializeConversation(workout.workoutPlan);
      }
    } catch (error) {
      console.error('Error viewing workout:', error);
    }
  };

  return (
    <>
      {/* Show debug info about data source */}
      {/* <div className="text-xs text-muted-foreground mb-4">
        Showing {history.length} workout(s)
        {history.length > 0 && history[0].id.startsWith("workout-")
          ? " from localStorage"
          : " from server"}
      </div> */}

      <WorkoutHistory
        history={history}
        isLoading={isLoading}
        onViewWorkout={handleViewWorkout}
        dataSource={history.length > 0 && history[0].id.startsWith('workout-') ? 'local' : 'server'}
      />
    </>
  );
}
