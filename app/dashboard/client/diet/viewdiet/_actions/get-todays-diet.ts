'use server';
import { ClientReqConfig } from '@/lib/AxiosInstance/clientAxios';

interface DietResponse {
  success: boolean;
  data?: {
    meals: {
      type: string;
      items: string[];
      timing: string;
    }[];
  };
  error?: string;
}

export interface TodaysDiet {
  meals: {
    type: string;
    items: string[];
    timing: string;
  }[];
}

export const fetchTodaysDiet = async (): Promise<TodaysDiet> => {
  try {
    const clientAxios = await ClientReqConfig();
    const response = await clientAxios.get<DietResponse>('/diet/today');

    if (!response.data.success || !response.data.data) {
      console.error('Failed to fetch today\'s diet:', response.data.error);
      return { meals: [] };
    }

    return { meals: response.data.data.meals };
  } catch (error) {
    console.error('Error fetching today\'s diet:', error);
    return { meals: [] };
  }
};
