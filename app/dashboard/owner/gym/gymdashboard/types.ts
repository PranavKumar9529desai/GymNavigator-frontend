export interface GymDashboardStats {
	totalMembers: number;
	activeTrainers: number;
	todayAttendance: number;
	revenue: number;
	expiringMemberships: number;
	newMembers: number;
	inactiveMembers: number;
}

export interface GymDashboardTrendPoint {
	date: string; // ISO date
	value: number;
}

export interface GymDashboardBreakdown {
	label: string;
	value: number;
	color?: string;
}

export interface GymDashboardRecentSignup {
	id: number;
	name: string;
	createdAt: string;
}

export interface GymDashboardRecentAttendance {
	id: number;
	user: { id: number; name: string };
	scanTime: string;
}

export interface GymDashboardRecentTrainerAssignment {
	id: number;
	name: string;
	trainer: { name: string } | null;
	updatedAt: string;
}

export interface GymDashboardRecentActivities {
	recentSignups: GymDashboardRecentSignup[];
	recentAttendance: GymDashboardRecentAttendance[];
	recentTrainerAssignments: GymDashboardRecentTrainerAssignment[];
}

export interface GymDashboardDetails {
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

export interface GymDashboardData {
	stats: GymDashboardStats;
	trends: {
		attendance: GymDashboardTrendPoint[];
		memberGrowth: GymDashboardTrendPoint[];
		revenue: GymDashboardTrendPoint[];
	};
	breakdowns: {
		membershipTypes: GymDashboardBreakdown[];
		gender: GymDashboardBreakdown[];
		planPopularity: GymDashboardBreakdown[];
	};
	recentActivities: GymDashboardRecentActivities;
	gymDetails: GymDashboardDetails;
}
