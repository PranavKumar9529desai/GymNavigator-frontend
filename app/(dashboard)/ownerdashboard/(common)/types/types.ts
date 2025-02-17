export interface DashboardStats {
  totalMembers: number;
  activeTrainers: number;
  todayAttendance: number;
  revenue: number;
}

export interface ValidPeriod {
  startDate: string;
  shift: string;
}

export interface RecentActivity {
  name: string;
  Validperiod: ValidPeriod | null;
}

export interface DashboardData {
  stats: DashboardStats;
  recentActivities: RecentActivity[];
}

export interface DashboardError {
  error: string;
}

export type DashboardResult = DashboardData | DashboardError;
