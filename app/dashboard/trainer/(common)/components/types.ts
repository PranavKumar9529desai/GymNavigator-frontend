export interface TrainerStats {
	totalMembers: number;
	activeWorkoutPlans: number;
	todayAttendance: number;
	gymName: string;
}

export interface RecentActivity {
	name: string;
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
	} | null;
}

export interface TrainerDashboardData {
	stats: TrainerStats;
	recentActivities: RecentActivity[];
}

export interface TrainerDashboardError {
	error: string;
	msg?: string;
}

export interface TrainerDashboardResponse {
	msg: string;
	data: TrainerDashboardData;
}

export type TrainerDashboardResult =
	| TrainerDashboardData
	| TrainerDashboardError;
