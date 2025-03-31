'use server';
import { TrainerReqConfig } from '@/lib/AxiosInstance/trainerAxios';

interface ExerciseInput {
	name: string;
	sets: number;
	reps: string;
	description: string;
	order: number;
}

interface ScheduleInput {
	dayOfWeek: string;
	muscleTarget: string;
	duration: number;
	calories: number;
	exercises: ExerciseInput[];
}

interface WorkoutPlanInput {
	name: string;
	description?: string;
	schedules: ScheduleInput[];
}

interface WorkoutPlanResponse {
	success: boolean;
	message: string;
	workoutPlan?: {
		id: number;
		name: string;
		description?: string;
		createdByTrainerId: number;
		schedules: Array<{
			id: number;
			dayOfWeek: string;
			muscleTarget: string;
			duration: number;
			calories: number;
			exercises: Array<{
				id: number;
				name: string;
				sets: number;
				reps: string;
				description: string;
				order: number;
			}>;
		}>;
	};
}

export const createWorkoutPlan = async (
	workoutPlan: WorkoutPlanInput,
): Promise<WorkoutPlanResponse> => {
	const trainerAxios = await TrainerReqConfig();

	try {
		const response = await trainerAxios.post(
			'/workouts/createworkoutplans',
			workoutPlan,
		);

		if (response.status === 201) {
			return {
				success: true,
				message: 'Workout plan created successfully',
				workoutPlan: response.data.workoutPlan,
			};
		}

		return {
			success: false,
			message: response.data.msg || 'Failed to create workout plan',
		};
	} catch (error: unknown) {
		console.error('Error creating workout plan:', error);
		return {
			success: false,
			message:
				error instanceof Error
					? error.message
					: 'Failed to create workout plan',
		};
	}
};
