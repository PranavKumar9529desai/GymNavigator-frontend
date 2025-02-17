'use server';
import { OwnerReqConfig } from '@/lib/AxiosInstance/ownerAxios';

interface HealthProfile {
  id: number;
  height?: number;
  weight?: number;
  medical_conditions?: string;
  allergies?: string;
  current_medications?: string;
}

// Backend trainer data type
export interface TrainerFromBackend {
  id: number;
  name: string;
  email: string;
  HealthProfile: HealthProfile | null;
  trainer: boolean;
  trainerid: number | null;
  shift?: string;
  assignedUsers?: {
    id: number;
  }[];
}

// Frontend trainer data type (matching viewTrainers.tsx needs)
export interface TrainerForUI {
  id: number;
  name: string;
  assignedClients: number;
  shift: 'Morning' | 'Evening';
  image: string;
}

interface TrainerResponse {
  msg: string;
  trainers: TrainerForUI[];
}

export const getTrainerAssociatedWithGym = async (): Promise<TrainerForUI[]> => {
  const ownerAxios = await OwnerReqConfig();
  try {
    const response = await ownerAxios.get<TrainerResponse>('/trainer/fetchtrainers');
    console.log('response from fetchtrainers:', response.data);
    return response.data.trainers;
  } catch (error) {
    console.error('Error fetching trainers:', error);
    return [];
  }
};
