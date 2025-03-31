import { create } from 'zustand';
import type { WorkoutPlan } from '../_actions/generate-ai-workout';
import type { SavedWorkout } from './workout-chat-store';

interface WorkoutViewStore {
	// State
	activeWorkout: SavedWorkout | null;
	isAssigning: boolean;
	assignmentError: string | null;
	showWorkoutDetails: boolean;

	// Actions
	setActiveWorkout: (workout: SavedWorkout | null) => void;
	setShowWorkoutDetails: (show: boolean) => void;
	assignWorkout: (workout: SavedWorkout) => Promise<void>;
	loadWorkout: (workout: {
		clientName: string;
		workoutPlan: WorkoutPlan;
	}) => void;
	reset: () => void;
}

export const useWorkoutViewStore = create<WorkoutViewStore>((set) => ({
	// Initial state
	activeWorkout: null,
	isAssigning: false,
	assignmentError: null,
	showWorkoutDetails: false,

	// Actions
	setActiveWorkout: (workout) =>
		set({
			activeWorkout: workout,
			showWorkoutDetails: !!workout,
		}),

	setShowWorkoutDetails: (show) => set({ showWorkoutDetails: show }),

	loadWorkout: (workout) => {
		// Convert the workout format to SavedWorkout format and set as active
		const savedWorkout: SavedWorkout = {
			id: Date.now().toString(), // Generate a temporary ID
			clientName: workout.clientName,
			workoutPlan: workout.workoutPlan,
			createdAt: new Date().toISOString(),
			clientId: '', // Default empty client ID
			conversationHistory: [], // Default empty conversation history
		};

		set({
			activeWorkout: savedWorkout,
			showWorkoutDetails: true,
		});
	},

	assignWorkout: async (_workout) => {
		try {
			set({ isAssigning: true, assignmentError: null });

			// TODO: Implement the actual assignment logic here
			// This would typically involve:
			// 1. Calling an API to assign the workout
			// 2. Updating the workout status in the database
			// 3. Notifying the client

			// For now, we'll just simulate a delay
			await new Promise((resolve) => setTimeout(resolve, 1000));

			set({ isAssigning: false });
		} catch (error) {
			set({
				isAssigning: false,
				assignmentError:
					error instanceof Error ? error.message : 'Failed to assign workout',
			});
		}
	},

	reset: () =>
		set({
			activeWorkout: null,
			isAssigning: false,
			assignmentError: null,
			showWorkoutDetails: false,
		}),
}));
