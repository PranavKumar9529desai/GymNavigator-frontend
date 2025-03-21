'use server';

import { TrainerReqConfig } from '@/lib/AxiosInstance/trainerAxios';
import type { gym } from '../../_components/SelectGym';

/**
 * Fetches a gym by its ID using server actions
 */
export async function fetchGymById(gymId: string): Promise<gym | null> {
  const trainerAxios = await TrainerReqConfig();

  try {
    const response = await trainerAxios.get(`gym/${gymId}`);

    if (response.data.success) {
      return response.data.gym as gym;
    }

    console.error('Gym not found:', gymId);
    return null;
  } catch (error) {
    console.error('Error fetching gym details:', error);
    return null;
  }
}
