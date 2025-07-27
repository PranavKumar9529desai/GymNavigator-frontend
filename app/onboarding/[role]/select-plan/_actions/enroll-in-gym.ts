'use server';

import { auth } from '@/app/(auth)/auth';
import { ClientReqConfig } from '@/lib/AxiosInstance/clientAxios';

interface EnrollmentResponse {
  message: string;
  membership: {
    id: number;
    startDate: string;
    endDate: string;
    status: string;
    plan: {
      id: number;
      name: string;
      price: string;
      duration: string;
    };
  };
}

export async function enrollInGym(
  gymid: string, 
  planId: string, 
  hash: string, 
  startDate?: string
): Promise<EnrollmentResponse> {
  try {
    const session = await auth();
    
    if (!session?.user?.id) {
      throw new Error('Unauthorized - Please sign in again');
    }

    if (!gymid || !planId || !hash) {
      throw new Error('Missing required parameters - Please try again');
    }

    const clientAxios = await ClientReqConfig();
    const response = await clientAxios.post('/gym/enroll', { 
      gymid, 
      planId, 
      hash,
      startDate: startDate || new Date().toISOString()
    });

    if (response.status === 200 && response.data.success) {
      return response.data.data;
    }

    // Handle specific error messages from the backend
    const errorMessage = response.data.error || 'Failed to enroll in gym';
    
    // Provide user-friendly error messages
    if (errorMessage.includes('already has an active membership')) {
      throw new Error('You already have an active membership at this gym. Please contact support if you need to change plans.');
    }
    
    if (errorMessage.includes('Invalid gym credentials')) {
      throw new Error('Invalid gym credentials. Please scan the QR code again.');
    }
    
    if (errorMessage.includes('Plan not found')) {
      throw new Error('Selected plan is no longer available. Please choose a different plan.');
    }
    
    if (errorMessage.includes('Gym not found')) {
      throw new Error('Gym not found. Please scan a valid QR code.');
    }
    
    throw new Error(errorMessage);
  } catch (error) {
    console.error('Error enrolling in gym:', error);
    
    // Handle network errors
    if (error instanceof Error) {
      if (error.message.includes('Network Error') || error.message.includes('timeout')) {
        throw new Error('Network error. Please check your connection and try again.');
      }
      
      if (error.message.includes('500')) {
        throw new Error('Server error. Please try again in a few moments.');
      }
    }
    
    throw error;
  }
} 