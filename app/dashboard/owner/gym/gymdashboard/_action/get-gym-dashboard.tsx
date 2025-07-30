import type { GymDashboardData } from '../types';
import { OwnerReqConfig } from '@/lib/AxiosInstance/ownerAxios';
import { AxiosError, type AxiosResponse } from 'axios';

export async function getGymDashboardData(): Promise<GymDashboardData> {
	try {
		const ownerAxios = await OwnerReqConfig();
		const response = await ownerAxios.get('/dashboard/getdashboarddata');
		// biome-ignore lint/suspicious/noExplicitAny: API response is dynamic
		const data = (response as { data: { data: any } }).data?.data;
		console.log('data returned from the getdashboard route', data);

		return {
			// Enhanced Business Metrics
			businessMetrics: {
				currentMonthRevenue: data.businessMetrics?.currentMonthRevenue ?? 0,
				previousMonthRevenue: data.businessMetrics?.previousMonthRevenue ?? 0,
				monthlyGrowthRate: data.businessMetrics?.monthlyGrowthRate ?? 0,
				totalMembers: data.businessMetrics?.totalMembers ?? 0,
				newMembers: data.businessMetrics?.newMembers ?? 0,
				averageRevenuePerMember:
					data.businessMetrics?.averageRevenuePerMember ?? 0,
				todayAttendance: data.businessMetrics?.todayAttendance ?? 0,
				attendanceGrowth: data.businessMetrics?.attendanceGrowth ?? 0,
				activeTrainers: data.businessMetrics?.activeTrainers ?? 0,
				expiringMemberships: data.businessMetrics?.expiringMemberships ?? 0,
				inactiveMembers: data.businessMetrics?.inactiveMembers ?? 0,
			},

			// Operational Metrics
			operationalMetrics: {
				onboardingPipeline: {
					onboarding:
						data.operationalMetrics?.onboardingPipeline?.onboarding ?? 0,
					healthProfile:
						data.operationalMetrics?.onboardingPipeline?.healthProfile ?? 0,
					dashboard:
						data.operationalMetrics?.onboardingPipeline?.dashboard ?? 0,
					workoutPlan:
						data.operationalMetrics?.onboardingPipeline?.workoutPlan ?? 0,
					dietPlan: data.operationalMetrics?.onboardingPipeline?.dietPlan ?? 0,
				},
				unassignedUsers: data.operationalMetrics?.unassignedUsers ?? 0,
				trainerWorkload: (data.operationalMetrics?.trainerWorkload || []).map(
					(trainer: {
						id: number;
						name: string;
						userCount: number;
						specializations: string | null;
						rating: number | null;
					}) => ({
						id: trainer.id,
						name: trainer.name,
						userCount: trainer.userCount,
						specializations: trainer.specializations,
						rating: trainer.rating,
					}),
				),
				todayAttendance: data.operationalMetrics?.todayAttendance ?? 0,
				yesterdayAttendance: data.operationalMetrics?.yesterdayAttendance ?? 0,
				attendanceGrowth: data.operationalMetrics?.attendanceGrowth ?? 0,
			},

			// Enhanced Trends
			trends: {
				attendance: (data.trends?.attendance || []).map(
					(trend: { date: string; value: number }) => ({
						date: trend.date,
						value: trend.value,
					}),
				),
				memberGrowth: (data.trends?.memberGrowth || []).map(
					(trend: { date: string; value: number }) => ({
						date: trend.date,
						value: trend.value,
					}),
				),
				revenue: (data.trends?.revenue || []).map(
					(trend: { date: string; value: number }) => ({
						date: trend.date,
						value: trend.value,
					}),
				),
			},

			// Enhanced Breakdowns
			breakdowns: {
				membershipTypes: (data.breakdowns?.membershipTypes || []).map(
					(item: { label: string; value: number; color?: string }) => ({
						label: item.label,
						value: item.value,
						color: item.color,
					}),
				),
				gender: (data.breakdowns?.gender || []).map(
					(item: { label: string; value: number; color?: string }) => ({
						label: item.label,
						value: item.value,
						color: item.color,
					}),
				),
				planPopularity: (data.breakdowns?.planPopularity || []).map(
					(item: { label: string; value: number; color?: string }) => ({
						label: item.label,
						value: item.value,
						color: item.color,
					}),
				),
				revenueByPlan: (data.breakdowns?.revenueByPlan || []).map(
					(item: {
						label: string;
						value: number;
						color?: string;
						count?: number;
					}) => ({
						label: item.label,
						value: item.value,
						color: item.color,
						count: item.count,
					}),
				),
				membershipStatus: (data.breakdowns?.membershipStatus || []).map(
					(item: { label: string; value: number; color?: string }) => ({
						label: item.label,
						value: item.value,
						color: item.color,
					}),
				),
			},

			// Recent Activities
			recentActivities: {
				recentSignups: (data.recentActivities?.recentSignups || []).map(
					(signup: { id: number; name: string; createdAt: string }) => ({
						id: signup.id,
						name: signup.name,
						createdAt: signup.createdAt,
					}),
				),
				recentAttendance: (data.recentActivities?.recentAttendance || []).map(
					(att: {
						id: number;
						user: { id: number; name: string };
						scanTime: string;
					}) => ({
						id: att.id,
						user: { id: att.user.id, name: att.user.name },
						scanTime: att.scanTime,
					}),
				),
				recentTrainerAssignments: (
					data.recentActivities?.recentTrainerAssignments || []
				).map(
					(assign: {
						id: number;
						name: string;
						trainer: { name: string } | null;
						updatedAt: string;
					}) => ({
						id: assign.id,
						name: assign.name,
						trainer: assign.trainer,
						updatedAt: assign.updatedAt,
					}),
				),
			},

			// Gym Details
			gymDetails: {
				gym_name: data.gymDetails?.gym_name ?? '',
				gym_logo: data.gymDetails?.gym_logo ?? '',
				address: data.gymDetails?.address ?? null,
				phone_number: data.gymDetails?.phone_number ?? '',
				Email: data.gymDetails?.Email ?? '',
				amenities: data.gymDetails?.amenities || [],
				pricingPlans: data.gymDetails?.pricingPlans || [],
			},
		};
	} catch (error) {
		if (error instanceof AxiosError) {
			throw new Error(
				error.response?.data?.msg || 'Failed to fetch dashboard data',
			);
		}
		throw new Error('Failed to fetch dashboard data');
	}
}
