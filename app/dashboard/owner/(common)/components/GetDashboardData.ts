'use server';
import { OwnerReqConfig } from '@/lib/AxiosInstance/ownerAxios';
import { AxiosError, type AxiosResponse } from 'axios';

interface DashboardStats {
	totalMembers: number;
	activeTrainers: number;
	todayAttendance: number;
	revenue: number;
	expiringMemberships: number;
	newMembers: number;
	inactiveMembers: number;
}

interface RecentSignup {
	id: number;
	name: string;
	createdAt: string;
}

interface RecentAttendance {
	id: number;
	user: { id: number; name: string };
	scanTime: string;
}

interface RecentTrainerAssignment {
	id: number;
	name: string;
	trainer: { name: string } | null;
	updatedAt: string;
}

interface RecentActivities {
	recentSignups: RecentSignup[];
	recentAttendance: RecentAttendance[];
	recentTrainerAssignments: RecentTrainerAssignment[];
}

interface GymDetails {
	gym_name: string;
	gym_logo: string;
	address: {
		street: string;
		city: string;
		state: string;
		postalCode: string;
		country: string;
		latitude: number;
		longitude: number;
	} | null;
	phone_number: string;
	Email: string;
	amenities: string[];
	pricingPlans: Array<{
		name: string;
		price: string;
		duration: string;
		isFeatured?: boolean;
		color?: string;
		icon?: string;
	}>;
}

export interface OwnerDashboardData {
	stats: DashboardStats;
	recentActivities: RecentActivities;
	gymDetails: GymDetails;
}

interface DashboardResponse {
	msg: string;
	data: OwnerDashboardData;
}

interface DashboardError {
	error: string;
	msg?: string;
}

type DashboardResult = OwnerDashboardData | DashboardError;

export async function GetDashboardData(): Promise<DashboardResult> {
	try {
		const ownerAxios = await OwnerReqConfig();
		const response: AxiosResponse<DashboardResponse> = await ownerAxios.get(
			'/dashboard/getdashboarddata',
		);

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
