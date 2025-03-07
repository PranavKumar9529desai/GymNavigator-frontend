import axios, { type AxiosResponse } from "axios";

export interface MuscleGroupType {
  id: number;
  name: string;
  img: string;
  fullimage: string;
  image_url?: string;
}

export interface Exercise {
  id: number;
  name: string;
  muscleGroupId: number;
  image_url?: string;
  video_url?: string;
  instructions: string;
  muscle_group: string;
  muscle_image?: string;
}

export interface ExerciseWithMuscle extends Exercise {
  MuscleGroup: MuscleGroupType & {
    exercises: Exercise[];
  };
}

export interface SingleExerciseResponse {
  msg: string;
  exercises: ExerciseWithMuscle[];
}

export interface Excercisetype {
  name: string;
  img: string;
  instructions: string;
  videolink: string;
  MuscleGroup: {
    id: number;
    name: string;
    img: string;
    fullimage: string;
  };
}

interface ResponseType {
  msg: string;
  Excercises: Excercisetype[];
}

export const getSingleMuscle = async (muscle: string): Promise<Excercisetype[]> => {
  try {
    const response: AxiosResponse<SingleExerciseResponse> = await axios.get(
      `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/v1/workouts/${muscle}`
    );

    // Transform the data to match Excercisetype
    return response.data.exercises.map((exercise) => ({
      name: exercise.name,
      img: exercise.image_url || "",
      instructions: exercise.instructions,
      videolink: exercise.video_url || "",
      MuscleGroup: {
        id: exercise.MuscleGroup.id,
        name: exercise.MuscleGroup.name,
        img: exercise.MuscleGroup.image_url || "",
        fullimage: exercise.muscle_image || "",
      },
    }));
  } catch (error) {
    console.log("error from the getSingleMuscle", error);
    return [];
  }
};
