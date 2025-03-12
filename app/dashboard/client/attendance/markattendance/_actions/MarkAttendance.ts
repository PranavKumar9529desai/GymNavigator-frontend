'use server';

import { ClientReqConfig } from '@/lib/AxiosInstance/clientAxios';

interface AttendanceResponse {
  success: boolean;
  data?: {
    id: number;
    userId: number;
    validPeriodId: number;
    date: string;
    scanTime: string;
    attended: boolean;
  };
  error?: string;
  details?: string;
}

export async function markAttendance(): Promise<AttendanceResponse> {
  try {
    const now = new Date();
    const clientUTC = Date.UTC(
      now.getUTCFullYear(),
      now.getUTCMonth(),
      now.getUTCDate(),
      now.getUTCHours(),
    );
    const truncatedUtcDate = new Date(clientUTC);

    const clientAxios = await ClientReqConfig();
    const response = await clientAxios.post('/mark-attendance', {
      clientDate: truncatedUtcDate.toISOString(),
    });

    return {
      success: true,
      data: response.data.data,
    };
  } catch (error) {
    console.error('Error marking attendance:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Failed to mark attendance',
    };
  }
}
