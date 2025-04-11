'use server';

import { ClientReqConfig } from '@/lib/AxiosInstance/clientAxios';

// Types for the response
interface IsWorkoutAndDietAssignedResponse {
  diet_assigned: boolean;
  workout_assigned: boolean;
}

interface ApiResult<T> {
  success: boolean;
  data?: T;
  error?: {
    code: string;
    message: string;
  };
}

export async function getIsWorkoutAndDietAssignedStatus(): Promise<ApiResult<IsWorkoutAndDietAssignedResponse>> {
  try {
    const axiosInstance = await ClientReqConfig();
    const response = await axiosInstance.get('/gym/isworkoutanddietassigned');

    // Handle successful response
    if (response.data.success) {
      return {
        success: true,
        data: response.data.data
      };
    } 
    
    // Handle error response from API
    return {
      success: false,
      error: {
        code: 'API_ERROR',
        message: response.data.error || 'Failed to get assignment status'
      }
    };
  } catch (error: any) {
    // Handle network or unexpected errors
    console.error('Error checking workout and diet assignments:', error);
    return {
      success: false,
      error: {
        code: 'REQUEST_FAILED',
        message: error.message || 'An error occurred while fetching assignment status'
      }
    };
  }
}
