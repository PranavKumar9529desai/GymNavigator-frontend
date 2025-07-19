import type { GymDashboardData } from '../types';
import { OwnerReqConfig } from '@/lib/AxiosInstance/ownerAxios';
import { AxiosError, type AxiosResponse } from 'axios';

// TODO : see check this some actual users
export async function getGymDashboardData(): Promise<GymDashboardData> {
  try {
    const ownerAxios = await OwnerReqConfig();
    const response: AxiosResponse<any> = await ownerAxios.get('/dashboard/getdashboarddata');
    const data = response.data?.data;
    console.log("data returned from the getdashboard  route" , data);

    return {
      stats: {
        totalMembers: data.stats.totalMembers,
        activeTrainers: data.stats.activeTrainers,
        todayAttendance: data.stats.todayAttendance,
        revenue: data.stats.revenue,
        expiringMemberships: data.stats.expiringMemberships ?? 0,
        newMembers: data.stats.newMembers ?? 0,
        inactiveMembers: data.stats.inactiveMembers ?? 0,
      },
      trends: {
        attendance: [],
        memberGrowth: [],
        revenue: [],
      },
      breakdowns: {
        membershipTypes: [],
        gender: [],
        planPopularity: [],
      },
      recentActivities: {
        recentSignups: (data.recentActivities?.recentSignups || []).map((signup: any) => ({
          id: signup.id,
          name: signup.name,
          createdAt: signup.createdAt,
        })),
        recentAttendance: (data.recentActivities?.recentAttendance || []).map((att: any) => ({
          id: att.id,
          user: att.user,
          scanTime: att.scanTime,
        })),
        recentTrainerAssignments: (data.recentActivities?.recentTrainerAssignments || []).map((assign: any) => ({
          id: assign.id,
          name: assign.name,
          trainer: assign.trainer,
          updatedAt: assign.updatedAt,
        })),
      },
      gymDetails: {
        gym_name: data.gymDetails.gym_name,
        gym_logo: data.gymDetails.gym_logo,
        address: data.gymDetails.address ?? null,
        phone_number: data.gymDetails.phone_number,
        Email: data.gymDetails.Email,
        amenities: data.gymDetails.amenities || [],
        pricingPlans: data.gymDetails.pricingPlans || [],
      },
    };
  } catch (error) {
    if (error instanceof AxiosError) {
      throw new Error(error.response?.data?.msg || 'Failed to fetch dashboard data');
    }
    throw new Error('Failed to fetch dashboard data');
  }
}
