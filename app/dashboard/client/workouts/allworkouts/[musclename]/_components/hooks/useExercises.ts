import { useQuery } from '@tanstack/react-query';
import axios from 'axios';
import type { Excercisetype, ExerciseWithMuscle } from '../../actions/getSIngleMuscle';

async function fetchExercises(muscleName: string): Promise<Excercisetype[]> {
  const response = await axios.get(
    `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/v1/workouts/${muscleName}`,
  );

  // Transform the data to match Excercisetype
  return response.data.exercises.map((exercise: ExerciseWithMuscle) => ({
    name: exercise.name,
    img: exercise.image_url || '',
    instructions: exercise.instructions,
    videolink: exercise.video_url || '',
    MuscleGroup: {
      id: exercise.MuscleGroup.id,
      name: exercise.MuscleGroup.name,
      img: exercise.MuscleGroup.image_url || '',
      fullimage: exercise.muscle_image || '',
    },
  }));
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
