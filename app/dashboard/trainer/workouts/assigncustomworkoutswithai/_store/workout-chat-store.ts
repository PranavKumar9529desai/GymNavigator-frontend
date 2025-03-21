import { create } from 'zustand';
import type { WorkoutPlan } from '../_actions/generate-ai-workout';

// Define types for alternative property names that might exist in API responses
interface WorkoutPlanWithAlternativeNames extends Partial<WorkoutPlan> {
  title?: string; // Alternative to 'name'
}

interface WorkoutScheduleWithAlternativeNames {
  focus?: string; // Alternative to 'muscleTarget'
}

// Define the shape of a chat message
export interface ChatMessage {
  type: 'ai' | 'user';
  message: string;
  workout?: WorkoutPlan;
  timestamp: Date;
}

// Interface for saved workout history - using WorkoutPlan from generate-ai-workout.ts
export interface SavedWorkout {
  id: string;
  workoutPlan: WorkoutPlan; // Using the imported type
  createdAt: string;
  clientId: string;
  clientName: string;
  conversationHistory: ChatMessage[];
}

// Define the shape of our store
interface WorkoutChatStore {
  // State
  conversationHistory: ChatMessage[];
  isSubmittingFeedback: boolean;
  feedbackError: string | null;
  showFeedbackChat: boolean;

  // Actions
  initializeConversation: (workoutPlan: WorkoutPlan) => void;
  addUserMessage: (message: string) => void;
  addAIMessage: (message: string, workoutPlan?: WorkoutPlan) => void;
  setSubmittingFeedback: (isSubmitting: boolean) => void;
  setFeedbackError: (error: string | null) => void;
  toggleFeedbackChat: () => void;
  setShowFeedbackChat: (show: boolean) => void;
  reset: () => void;

  // Storage actions
  saveWorkoutToHistory: (workout: WorkoutPlan, userId: string, userName: string) => string;
  getSavedWorkouts: (userId: string) => SavedWorkout[];
  clearWorkoutHistory: () => void;
}

// Helper to generate a unique ID
const generateId = () => `workout-${Date.now()}-${Math.random().toString(36).substring(2, 9)}`;

// Helper to safely parse JSON with date handling
const parseWithDates = (jsonString: string) => {
  return JSON.parse(jsonString, (_key, value) => {
    // Convert ISO date strings back to Date objects
    if (typeof value === 'string' && /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}.\d{3}Z$/.test(value)) {
      return new Date(value);
    }
    return value;
  });
};

// Create the store
export const useWorkoutChatStore = create<WorkoutChatStore>((set, get) => ({
  // Initial state
  conversationHistory: [],
  isSubmittingFeedback: false,
  feedbackError: null,
  showFeedbackChat: false,

  // Actions
  initializeConversation: (workoutPlan) =>
    set({
      conversationHistory: [
        {
          type: 'ai',
          message:
            "Here's your personalized workout plan. Let me know if you'd like any modifications!",
          workout: workoutPlan,
          timestamp: new Date(),
        },
      ],
      feedbackError: null,
    }),

  addUserMessage: (message) =>
    set((state) => ({
      conversationHistory: [
        ...state.conversationHistory,
        {
          type: 'user',
          message,
          timestamp: new Date(),
        },
      ],
    })),

  addAIMessage: (message, workoutPlan) =>
    set((state) => ({
      conversationHistory: [
        ...state.conversationHistory,
        {
          type: 'ai',
          message,
          workout: workoutPlan,
          timestamp: new Date(),
        },
      ],
    })),

  setSubmittingFeedback: (isSubmitting) => set({ isSubmittingFeedback: isSubmitting }),

  setFeedbackError: (error) => set({ feedbackError: error }),

  toggleFeedbackChat: () =>
    set((state) => ({
      showFeedbackChat: !state.showFeedbackChat,
    })),

  setShowFeedbackChat: (show) => set({ showFeedbackChat: show }),

  reset: () =>
    set({
      conversationHistory: [],
      isSubmittingFeedback: false,
      feedbackError: null,
      showFeedbackChat: false,
    }),

  // Storage actions
  saveWorkoutToHistory: (workoutPlan, userId, userName) => {
    const workoutId = generateId();
    const { conversationHistory } = get();

    // Ensure workoutPlan conforms to WorkoutPlan interface
    const normalizedWorkoutPlan: WorkoutPlan = {
      ...workoutPlan,
      // If name is missing, use title or default
      name:
        workoutPlan.name ||
        (workoutPlan as WorkoutPlanWithAlternativeNames).title ||
        'Untitled Workout',
      // Force description to be a string
      description: workoutPlan.description || '',
      // Ensure schedules use the correct fields
      schedules: workoutPlan.schedules.map((schedule) => ({
        ...schedule,
        // If muscleTarget is missing, use focus or default
        muscleTarget:
          schedule.muscleTarget ||
          (schedule as WorkoutScheduleWithAlternativeNames).focus ||
          'General',
        // Ensure duration and calories exist
        duration: schedule.duration || 0,
        calories: schedule.calories || 0,
        // Ensure exercises have all required fields
        exercises: schedule.exercises.map((exercise, idx) => ({
          ...exercise,
          order: exercise.order !== undefined ? exercise.order : idx,
          description: exercise.description || '',
        })),
      })),
    };

    // Create the workout history item with normalized workoutPlan
    const workoutHistoryItem: SavedWorkout = {
      id: workoutId,
      workoutPlan: normalizedWorkoutPlan,
      conversationHistory: [...conversationHistory],
      createdAt: new Date().toISOString(),
      clientId: userId,
      clientName: userName,
    };

    // Save to localStorage - in a real app this would be a database call
    if (typeof window !== 'undefined') {
      try {
        // Get existing saved workouts
        const savedWorkoutsStr = localStorage.getItem('gym-navigator-saved-workouts') || '[]';
        const savedWorkouts = JSON.parse(savedWorkoutsStr);

        // Add the new workout
        savedWorkouts.push(workoutHistoryItem);

        // Save back to localStorage
        localStorage.setItem('gym-navigator-saved-workouts', JSON.stringify(savedWorkouts));
      } catch (error) {
        console.error('Failed to save workout to localStorage:', error);
      }
    }

    return workoutId;
  },

  getSavedWorkouts: (userId) => {
    if (typeof window === 'undefined') return [];

    try {
      const savedWorkoutsStr = localStorage.getItem('gym-navigator-saved-workouts');
      if (!savedWorkoutsStr) return [];

      const allSavedWorkouts = parseWithDates(savedWorkoutsStr) as SavedWorkout[];
      console.log('Found saved workouts in localStorage:', allSavedWorkouts.length);

      // Filter by user ID if provided
      return userId
        ? allSavedWorkouts.filter((workout) => workout.clientId === userId)
        : allSavedWorkouts;
    } catch (error) {
      console.error('Failed to retrieve saved workouts:', error);
      return [];
    }
  },

  clearWorkoutHistory: () => {
    if (typeof window !== 'undefined') {
      try {
        localStorage.removeItem('gym-navigator-saved-workouts');
      } catch (error) {
        console.error('Failed to clear workout history:', error);
      }
    }
  },
}));
