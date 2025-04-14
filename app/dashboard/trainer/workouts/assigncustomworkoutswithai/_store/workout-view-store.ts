import { create } from 'zustand';
import type { WorkoutPlan } from '../_actions/generate-ai-workout';
import type { SavedWorkout } from './workout-chat-store';

interface WorkoutViewStore {
	// State
	currentWorkout: SavedWorkout | WorkoutPlan | null; // Holds either saved or newly generated plan
	isAssigning: boolean; // Keep assignment state if needed globally, though it's local in WorkoutResults now
	assignmentError: string | null; // Keep if needed globally
	showWorkoutDetails: boolean; // Keep for controlling visibility/tab

	// Actions
	loadGeneratedPlan: (plan: WorkoutPlan) => void; // Load a newly generated plan
	loadSavedWorkout: (workout: SavedWorkout) => void; // Load a plan from history
	setShowWorkoutDetails: (show: boolean) => void;
	reset: () => void;
}

export const useWorkoutViewStore = create<WorkoutViewStore>((set) => ({
	// Initial state
	currentWorkout: null,
	isAssigning: false,
	assignmentError: null,
	showWorkoutDetails: false,

	// Actions
	loadGeneratedPlan: (plan) =>
		set({
			currentWorkout: plan, // Store the raw WorkoutPlan
			showWorkoutDetails: true,
			isAssigning: false, // Reset assignment state
			assignmentError: null,
		}),

	loadSavedWorkout: (workout) =>
		set({
			currentWorkout: workout, // Store the full SavedWorkout object
			showWorkoutDetails: true,
			isAssigning: false,
			assignmentError: null,
		}),

	setShowWorkoutDetails: (show) => set({ showWorkoutDetails: show }),

	reset: () =>
		set({
			currentWorkout: null,
			isAssigning: false,
			assignmentError: null,
			showWorkoutDetails: false,
		}),
}));
