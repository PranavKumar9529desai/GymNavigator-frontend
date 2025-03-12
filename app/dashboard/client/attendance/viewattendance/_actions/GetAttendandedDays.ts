'use server';
import { ClientReqConfig } from '@/lib/AxiosInstance/clientAxios';
import { unstable_cache } from 'next/cache';

interface AttendanceDaysResponse {
  success: boolean;
  data?: string[]; // API returns date strings
  error?: string;
  details?: string;
}

// Base function to fetch attendance data
export const fetchAttendanceData = async (): Promise<Date[]> => {
  try {
    const clientAxios = await ClientReqConfig();
    const response = await clientAxios.post<AttendanceDaysResponse>('/userprogress');

    if (!response.data.success || !response.data.data) {
      console.error('Failed to fetch attendance days:', response.data.error);
      return [];
    }

    // Convert string dates to Date objects
    return response.data.data.map((dateStr) => new Date(dateStr));
  } catch (error) {
    console.error('Error fetching attendance days:', error);
    return [];
  }
};
