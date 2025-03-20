import { create } from 'zustand';
import type { WorkoutPlan } from '../_actions/generate-ai-workout';
import type { SavedWorkout } from './workout-chat-store';

type TabValue = 'generate' | 'history' | 'workout';

interface WorkoutViewStore {
  // State
  activeWorkout: SavedWorkout | null;
  isAssigning: boolean;
  assignmentError: string | null;
  showWorkoutDetails: boolean;
  activeTab: TabValue;
  
  // Actions
  setActiveWorkout: (workout: SavedWorkout | null) => void;
  setShowWorkoutDetails: (show: boolean) => void;
  setActiveTab: (tab: TabValue) => void;
  loadWorkout: (workout: SavedWorkout) => void;
  assignWorkout: (workout: SavedWorkout) => Promise<void>;
  reset: () => void;
}

export const useWorkoutViewStore = create<WorkoutViewStore>((set) => ({
  // Initial state
  activeWorkout: null,
  isAssigning: false,
  assignmentError: null,
  showWorkoutDetails: false,
  activeTab: 'generate',
  
  // Actions
  setActiveWorkout: (workout) => set({ 
    activeWorkout: workout,
    showWorkoutDetails: !!workout 
  }),
  
  setShowWorkoutDetails: (show) => set({ showWorkoutDetails: show }),
  
  setActiveTab: (tab) => set({ activeTab: tab }),
  
  // New action that combines setting the workout and changing the tab
  loadWorkout: (workout) => set({ 
    activeWorkout: workout,
    showWorkoutDetails: true,
    activeTab: 'workout'
  }),
  
  assignWorkout: async (workout) => {
    try {
      set({ isAssigning: true, assignmentError: null });
      
      // TODO: Implement the actual assignment logic here
      // This would typically involve:
      // 1. Calling an API to assign the workout
      // 2. Updating the workout status in the database
      // 3. Notifying the client
      
      // For now, we'll just simulate a delay
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      set({ isAssigning: false });
    } catch (error) {
      set({ 
        isAssigning: false,
        assignmentError: error instanceof Error ? error.message : 'Failed to assign workout'
      });
    }
  },
  
  reset: () => set({
    activeWorkout: null,
    isAssigning: false,
    assignmentError: null,
    showWorkoutDetails: false,
    // Don't reset activeTab here to preserve navigation state
  }),
})); 