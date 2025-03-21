'use server';

import { TrainerReqConfig } from '@/lib/AxiosInstance/trainerAxios';
import type { DietHistoryItem } from '../_store/diet-view-store';

export async function getDietHistory(userId: string): Promise<{ success: boolean; data?: DietHistoryItem[]; message?: string }> {
  try {
    const trainerAxios = await TrainerReqConfig();
    
    const response = await trainerAxios.get(`/diet/history/${userId}`);
    const data = response.data;
    
    if (data.success || data.msg === 'success') {
      return {
        success: true,
        data: data.history || []
      };
    }
    
    return {
      success: false,
      message: data.message || data.error || 'Failed to fetch diet history'
    };
  } catch (error) {
    console.error('Error fetching diet history:', error);
    
    return {
      success: false,
      message: 'An error occurred while fetching diet history'
    };
  }
} 