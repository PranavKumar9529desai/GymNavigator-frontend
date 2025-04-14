'use server';

import { TrainerReqConfig } from '@/lib/AxiosInstance/trainerAxios';
import { revalidatePath } from 'next/cache';
import type { WorkoutPlan } from './generate-ai-workout';

// Keep this if used elsewhere for assigning non-custom plans by ID
export async function assignWorkoutPlan(userId: string, workoutPlanId: number) {
	const trainerAxios = await TrainerReqConfig();

	try {
		// Assuming backend expects number for userId here, adjust if needed
		const numericUserId = Number.parseInt(userId, 10);
		if (Number.isNaN(numericUserId)) {
			throw new Error('Invalid User ID format');
		}

		const response = await trainerAxios.post('/workouts/assignworkoutplan', {
			userId: numericUserId,
			workoutPlanId,
		});

		if (response.data.success) {
			revalidatePath('/dashboard/trainer/workouts/assigncustomworkoutswithai');
			return {
				success: true,
				msg: response.data.msg,
				previousPlan: response.data.previousPlan,
				newPlan: response.data.newPlan,
			};
		}

		throw new Error(response.data.error || 'Failed to assign workout plan');
	} catch (error) {
		console.error('Error assigning workout plan:', error);
		return {
			success: false,
			error: error instanceof Error ? error.message : 'Unknown error',
		};
	}
}

interface WorkoutPlanInfo {
	id: number;
	name: string;
	description: string | null;
}

// Response type for assigning an existing plan
export interface AssignExistingWorkoutResponse {
	success: boolean;
	msg: string;
	error?: string;
	previousPlan: WorkoutPlanInfo | null;
	newPlan: WorkoutPlanInfo;
}

// Response type for creating/updating a plan
export interface CreateOrUpdateWorkoutResponse {
	success: boolean;
	msg: string;
	workoutPlanId: number;
	workoutPlanName: string; // Added for toast message
	error?: string;
}

/**
 * Creates or updates a custom AI-generated workout plan in the backend.
 * Returns the ID of the created/updated plan.
 */
export async function createOrUpdateCustomWorkoutPlan(
	workoutPlan: WorkoutPlan,
): Promise<CreateOrUpdateWorkoutResponse> {
	const trainerAxios = await TrainerReqConfig();

	try {
		// Prepare payload for backend
		const payload = {
			id: workoutPlan.id, // Include ID if updating an existing plan
			name: workoutPlan.name,
			description: workoutPlan.description,
			schedules: workoutPlan.schedules.map((schedule) => ({
				dayOfWeek: schedule.dayOfWeek,
				muscleTarget: schedule.muscleTarget,
				duration: schedule.duration,
				calories: schedule.calories,
				exercises: schedule.exercises.map((exercise) => ({
					name: exercise.name,
					sets: exercise.sets,
					reps: exercise.reps,
					description: exercise.description,
					order: exercise.order,
				})),
			})),
		};

		const response = await trainerAxios.post(
			'/workouts/create-custom-workout',
			payload,
		);

		if (!response.data.success) {
			throw new Error(
				response.data.error || 'Failed to create or update custom workout plan',
			);
		}

		// No revalidation needed here as it only creates/updates the plan definition
		// Revalidation happens upon assignment

		return {
			success: true,
			workoutPlanId: response.data.workoutPlanId,
			workoutPlanName: response.data.workoutPlanName,
			msg: response.data.msg,
		};
	} catch (error) {
		console.error('Error creating/updating custom workout plan:', error);
		return {
			success: false,
			workoutPlanId: -1,
			workoutPlanName: '',
			msg: 'Failed to save workout plan',
			error: error instanceof Error ? error.message : 'Unknown error',
		};
	}
}

/**
 * Assigns an existing workout plan (by ID) to a user.
 */
export async function assignExistingWorkoutPlan(
	userId: string,
	workoutPlanId: number,
): Promise<AssignExistingWorkoutResponse> {
	const trainerAxios = await TrainerReqConfig();

	try {
		const response = await trainerAxios.post('/workouts/assign-custom-workout', {
			userId, // Send as string
			workoutPlanId,
		});

		if (!response.data.success) {
			throw new Error(
				response.data.error || 'Failed to assign existing workout plan',
			);
		}

		// Revalidate the path to update UI if necessary
		revalidatePath('/dashboard/trainer/workouts/assigncustomworkoutswithai');
		revalidatePath(`/dashboard/trainer/clients/${userId}`); // Revalidate client page too

		return {
			success: true,
			msg: response.data.msg,
			previousPlan: response.data.previousPlan,
			newPlan: response.data.newPlan,
		};
	} catch (error) {
		console.error('Error assigning existing workout plan:', error);
		return {
			success: false,
			msg: 'Failed to assign workout plan',
			error: error instanceof Error ? error.message : 'Unknown error',
			previousPlan: null,
			// biome-ignore lint/style/noNonNullAssertion: <explanation>
			newPlan: null!, // Provide a default or handle null case appropriately
		};
	}
}
