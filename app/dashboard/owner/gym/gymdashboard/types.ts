// Business Metrics
export interface GymDashboardBusinessMetrics {
	currentMonthRevenue: number;
	previousMonthRevenue: number;
	monthlyGrowthRate: number;
	totalMembers: number;
	newMembers: number;
	averageRevenuePerMember: number;
	todayAttendance: number;
	attendanceGrowth: number;
	activeTrainers: number;
	expiringMemberships: number;
	inactiveMembers: number;
}

// Operational Metrics
export interface GymDashboardOperationalMetrics {
	onboardingPipeline: {
		onboarding: number;
		healthProfile: number;
		dashboard: number;
		workoutPlan: number;
		dietPlan: number;
	};
	unassignedUsers: number;
	trainerWorkload: Array<{
		id: number;
		name: string;
		userCount: number;
		specializations: string | null;
		rating: number | null;
	}>;
	todayAttendance: number;
	yesterdayAttendance: number;
	attendanceGrowth: number;
}

export interface GymDashboardTrendPoint {
	date: string; // ISO date
	value: number;
}

export interface GymDashboardBreakdown {
	label: string;
	value: number;
	color?: string;
	count?: number;
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
	businessMetrics: GymDashboardBusinessMetrics;
	operationalMetrics: GymDashboardOperationalMetrics;
	trends: {
		attendance: GymDashboardTrendPoint[];
		memberGrowth: GymDashboardTrendPoint[];
		revenue: GymDashboardTrendPoint[];
	};
	breakdowns: {
		membershipTypes: GymDashboardBreakdown[];
		gender: GymDashboardBreakdown[];
		planPopularity: GymDashboardBreakdown[];
		revenueByPlan: GymDashboardBreakdown[];
	};
	recentActivities: GymDashboardRecentActivities;
	gymDetails: GymDashboardDetails;
}
