'use server';

import type { Excercisetype } from '../actions/getSIngleMuscle';
import axios from 'axios';

// Define interface for the API response exercise structure
interface ExerciseApiResponse {
	name: string;
	image_url?: string;
	instructions?: string;
	video_url?: string;
	MuscleGroup?: {
		id?: number;
		name?: string;
		image_url?: string;
	};
	muscle_image?: string;
}

export async function fetchExercises(
	muscleName: string,
): Promise<Excercisetype[]> {
	try {
		const response = await axios.get(
			`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/v1/workouts/${muscleName}`,
		);

		if (!response.data || !response.data.success) {
			console.error('API returned error response:', response.data);
			return [];
		}

		if (!response.data.data || !response.data.data.exercises) {
			console.error('Missing exercises in API response:', response.data);
			return [];
		}

		const exercises = response.data.data.exercises;

		return exercises.map((exercise: ExerciseApiResponse) => ({
			name: exercise.name || 'Unknown Exercise',
			img: exercise.image_url || '',
			instructions: exercise.instructions || 'No instructions available',
			videolink: exercise.video_url || '',
			MuscleGroup: {
				id: exercise.MuscleGroup?.id || 0,
				name: exercise.MuscleGroup?.name || muscleName,
				img: exercise.MuscleGroup?.image_url || '',
				fullimage: exercise.muscle_image || '',
			},
		}));
	} catch (error) {
		console.error(`Error fetching exercises for ${muscleName}:`, error);
		return [];
	}
}
