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
      message: data.message || data.error || 'Failed to fetch diet history from server'
    };
  } catch (error) {
    console.error('Error fetching diet history:', error);
    
    // Create a more informative error message based on the type of error
    let errorMessage = 'Unable to connect to the server. Your diet plans are still available locally.';
    
    // Check if it's a network error
    if (error && typeof error === 'object' && 'message' in error) {
      const errMsg = error.message as string;
      if (errMsg.includes('Network Error') || errMsg.includes('timeout')) {
        errorMessage = 'Network connection issue. Your diet plans are still available locally.';
      }
    }
    
    return {
      success: false,
      message: errorMessage
    };
  }
} 