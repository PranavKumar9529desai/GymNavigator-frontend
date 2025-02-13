export type ShiftType = 'morning' | 'evening';
export interface AddTrainerRequest {
  name: string;
  shift: ShiftType;
  rating: number;
  image: string | File | undefined;
}
export interface UpdateTrainerRequest {
  id: number;
  shift: ShiftType;
  rating: number;
  image: string | File | undefined;
}
// Response Interfaces
export interface AddTrainerResponse {
  msg: string;
  trainer: AddTrainerTrainer;
}
export interface UpdateTrainerResponse {
  success: boolean;
  msg: string;
  trainer: UpdateTrainerTrainer;
}
export interface AddTrainerTrainer {
  id: number;
  name: string;
  email: string;
  password: string;
  gym_id: number;
  shift: string | null;
  rating: number | null;
  image: string | null;
}
export interface UpdateTrainerTrainer {
  id: number;
  name: string;
  email: string;
  shift: 'MORNING' | 'EVENING';
  image: string;
  rating: number;
  gym_id: number;
}
// Helper function to handle API requests
// app/actions/AddTrainerSA.ts
// Helper function to handle API requests
const handleApiRequest = async <T>(
  endpoint: string,
  method: string,
  data: unknown
): Promise<T> => {
  try {
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_BACKEND_URL}${endpoint}`,
      {
        method,
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      }
    );
    const result = await response.json();
    if (!response.ok) {
      throw new Error(result.msg || 'An error occurred during the request.');
    }
    return result;
  } catch (error) {
    throw new Error(
      error instanceof Error ? error.message : 'An unknown error occurred.'
    );
  }
};
/**
 * Adds a new trainer by sending a POST request to the backend API.
 *
 * @param data - The trainer data to be added.
 * @returns A promise resolving to the API response.
 */
export const addTrainer = async (
  data: AddTrainerRequest
): Promise<AddTrainerResponse> => {
  // Handle image upload if necessary
  let imageData: string | undefined = undefined;
  if (data.image instanceof File) {
    // Implement actual image upload logic here
    // For example, upload to Cloudinary and get the image URL
    // Placeholder: Replace with actual upload logic
    imageData = 'uploaded_image_url';
  } else if (typeof data.image === 'string') {
    imageData = data.image;
  }
  const payload = {
    name: data.name,
    shift: data.shift,
    rating: data.rating,
    image: imageData,
  };
  return await handleApiRequest<AddTrainerResponse>(
    '/addtrainer',
    'POST',
    payload
  );
};
/**
 * Updates an existing trainer by sending a PUT request to the backend API.
 *
 * @param data - The trainer data to be updated.
 * @returns A promise resolving to the API response.
 */
export const updateTrainer = async (
  data: UpdateTrainerRequest
): Promise<UpdateTrainerResponse> => {
  // Handle image upload if necessary
  let imageData: string | undefined = undefined;
  if (data.image instanceof File) {
    // Implement actual image upload logic here
    // For example, upload to Cloudinary and get the image URL
    // Placeholder: Replace with actual upload logic
    imageData = 'uploaded_image_url';
  } else if (typeof data.image === 'string') {
    imageData = data.image;
  }
  const payload = {
    shift: data.shift,
    rating: data.rating,
    image: imageData,
    trainerId: data.id,
  };
  return await handleApiRequest<UpdateTrainerResponse>(
    '/addtrainerdetails',
    'PUT',
    payload
  );
};
