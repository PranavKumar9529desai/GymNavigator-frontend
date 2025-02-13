'use server';
import { AxiosResponse, AxiosError } from 'axios';
import { OwnerReqConfig } from '@/lib/AxiosInstance/ownerAxios';

interface DashboardStats {
  totalMembers: number;
  activeTrainers: number;
  todayAttendance: number;
  revenue: number;
}

interface RecentActivity {
  name: string;
  createdAt: string;
  Validperiod: {
    startDate: string;
    shift: string;
  } | null;
}

interface DashboardData {
  stats: DashboardStats;
  recentActivities: RecentActivity[];
}

interface DashboardResponse {
  msg: string;
  data: DashboardData;
}

interface DashboardError {
  error: string;
  msg?: string;
}

type DashboardResult = DashboardData | DashboardError;

export async function GetDashboardData(): Promise<DashboardResult> {
  try {
    const ownerAxios = await OwnerReqConfig();
    const response: AxiosResponse<DashboardResponse> =
      await ownerAxios.get(`/getdashboarddata`);

    if (response.data.data) {
      return response.data.data;
    }

    return {
      error: 'Failed to fetch dashboard data',
    };
  } catch (err) {
    if (err instanceof AxiosError) {
      // Handle specific API errors
      if (err.response?.status === 404) {
        return {
          error: 'NO_GYM_FOUND',
          msg: 'No gym profile found. Please create your gym profile to continue.',
        };
      }

      return {
        error:
          err.response?.data?.msg ||
          'An error occurred while fetching dashboard data',
      };
    }

    return {
      error: 'An unexpected error occurred',
    };
  }
}
