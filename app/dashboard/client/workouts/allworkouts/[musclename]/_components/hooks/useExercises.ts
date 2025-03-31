import { useQuery } from '@tanstack/react-query';
import axios from 'axios';
import type { Excercisetype } from '../../actions/getSIngleMuscle';

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

async function fetchExercises(muscleName: string): Promise<Excercisetype[]> {
	try {
		const response = await axios.get(
			`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/v1/workouts/${muscleName}`,
		);

		// Log the raw response for debugging
		console.log(`Client-side API response for ${muscleName}:`, response.data);

		// Check basic response structure
		if (!response.data || !response.data.success) {
			console.error('API returned error response:', response.data);
			return [];
		}

		// Check for nested data structure
		if (!response.data.data || !response.data.data.exercises) {
			console.error('Missing exercises in API response:', response.data);
			return [];
		}

		const exercises = response.data.data.exercises;
		console.log(`Found ${exercises.length} exercises for ${muscleName}`);

		// Transform data with robust error handling
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

export function useExercises(muscleName: string) {
	return useQuery({
		queryKey: ['exercises', muscleName],
		queryFn: () => fetchExercises(muscleName),
		staleTime: 5 * 60 * 1000, // Data stays fresh for 5 minutes
		gcTime: 10 * 60 * 1000, // Keep unused data in cache for 10 minutes
		initialData: [], // Start with empty array to prevent undefined errors
	});
}
