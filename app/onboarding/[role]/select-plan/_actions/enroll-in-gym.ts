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
      throw new Error('Unauthorized');
    }

    if (!gymid || !planId || !hash) {
      throw new Error('Missing required parameters');
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

    throw new Error(response.data.error || 'Failed to enroll in gym');
  } catch (error) {
    console.error('Error enrolling in gym:', error);
    throw error;
  }
} 