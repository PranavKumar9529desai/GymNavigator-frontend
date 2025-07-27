export interface DashboardStats {
	totalMembers: number;
	activeTrainers: number;
	todayAttendance: number;
	revenue: number;
}

export interface Membership {
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
}

export interface User {
	id: number;
	name: string;
	email: string;
	img?: string;
	isverified: boolean;
	isallowed: boolean;
	createdAt: string;
	userStatus: string;
	membership: Membership | null;
}

export interface RecentActivity {
	name: string;
	membership: Membership | null;
}

export interface DashboardData {
	stats: DashboardStats;
	recentActivities: RecentActivity[];
}

export interface DashboardError {
	error: string;
}

export type DashboardResult = DashboardData | DashboardError;
