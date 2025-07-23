'use server';

import { ClientReqConfig } from '@/lib/AxiosInstance/clientAxios';

export interface DashboardOverviewData {
	user: {
		id: number;
		name: string;
	};
	gym: {
		id: number;
		gym_name: string;
		gym_logo: string;
	} | null;
	trainer: {
		id: number;
		name: string;
		image: string | null;
		rating: number | null;
		specializations: string | null;
	} | null;
	membership: {
		validPeriod: {
			startDate: string;
			endDate: string;
			shift: string;
		} | null;
		daysRemaining: number;
	};
	attendance: {
		recentAttendances: Array<{
			date: string;
			attended: boolean;
			scanTime: string;
		}>;
		monthlyPercentage: number;
		currentStreak: number;
		todayCheckedIn: boolean;
	};
}

export async function getDashboardOverview(): Promise<DashboardOverviewData | null> {
	try {
		const clientAxios = await ClientReqConfig();
		const response = await clientAxios.get('/dashboard/dashboard-overview');

		if (response.status === 200) {
			return response.data;
		}

		return null;
	} catch (error) {
		console.error('Error fetching dashboard overview:', error);
		return null;
	}
}
