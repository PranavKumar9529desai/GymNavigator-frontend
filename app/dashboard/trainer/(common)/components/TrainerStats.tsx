import { Card } from '@/components/ui/card';
import {
	AlertCircle,
	Building2,
	Calendar,
	Dumbbell,
	Users,
} from 'lucide-react';
import React from 'react';
import type { TrainerDashboardData } from './types';

interface TrainerStatsProps {
	data: TrainerDashboardData;
}

export default function TrainerStats({ data }: TrainerStatsProps) {
	const { stats, recentActivities } = data;

	// Fallback values for missing data
	const safeStats = {
		totalMembers: stats?.totalMembers ?? 0,
		activeWorkoutPlans: stats?.activeWorkoutPlans ?? 0,
		todayAttendance: stats?.todayAttendance ?? 0,
		gymName: stats?.gymName ?? 'Not Assigned',
	};

	const statCards = [
		{
			label: 'Total Members',
			value: safeStats.totalMembers.toString(),
			icon: Users,
			iconBg: 'from-blue-400 to-blue-500',
		},
		{
			label: 'Active Workout Plans',
			value: safeStats.activeWorkoutPlans.toString(),
			icon: Dumbbell,
			iconBg: 'from-green-400 to-green-500',
		},
		{
			label: "Today's Attendance",
			value: safeStats.todayAttendance.toString(),
			icon: Calendar,
			iconBg: 'from-purple-400 to-purple-500',
		},
		{
			label: 'Assigned Gym',
			value: safeStats.gymName,
			icon: Building2,
			iconBg: 'from-orange-400 to-orange-500',
		},
	];

	return (
		<div className="space-y-10 p-2 sm:p-6 pt-4 bg-gradient-to-br from-blue-50/30 via-white to-indigo-50/20 min-h-screen">
			<div className="max-w-7xl mx-auto space-y-10">
				{/* Welcome Header */}
				<div className="space-y-4">
					<div className="flex items-center gap-3">
						<div className="w-6 h-6 rounded-full bg-gradient-to-r from-blue-400 to-indigo-400 flex items-center justify-center">
							<Users className="h-3 w-3 text-white" />
						</div>
						<h1 className="text-2xl font-bold text-slate-800">Trainer Dashboard</h1>
					</div>
					<p className="text-slate-600">
						Here&apos;s an overview of your members and activities today.
					</p>
				</div>

				{/* Quick Stats */}
				<div className="space-y-6">
					<div className="flex items-center gap-3">
						<div className="w-6 h-6 rounded-full bg-gradient-to-r from-blue-400 to-indigo-400 flex items-center justify-center">
							<Dumbbell className="h-3 w-3 text-white" />
						</div>
						<h2 className="text-lg font-semibold text-slate-800">Quick Stats</h2>
					</div>
					<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-2">
						{statCards.map((stat) => (
							<Card
								key={stat.label}
								className="p-3 hover:bg-blue-50/30 transition-colors border-blue-100"
							>
								<div className="flex items-center gap-3">
									<div className={`w-8 h-8 rounded-full bg-gradient-to-r ${stat.iconBg} flex items-center justify-center`}>
										<stat.icon className="h-4 w-4 text-white" />
									</div>
									<div>
										<p className="text-xs font-medium text-slate-600 uppercase tracking-wide">
											{stat.label}
										</p>
										<h3 className="text-lg font-semibold text-slate-800">{stat.value}</h3>
									</div>
								</div>
							</Card>
						))}
					</div>
				</div>

				{/* Recent Activity Preview */}
				<div className="space-y-6">
					<div className="flex items-center gap-3">
						<div className="w-6 h-6 rounded-full bg-gradient-to-r from-blue-400 to-indigo-400 flex items-center justify-center">
							<Calendar className="h-3 w-3 text-white" />
						</div>
						<h2 className="text-lg font-semibold text-slate-800">Recent Member Activities</h2>
					</div>
					<div className="border-b border-slate-100">
						<div className="pb-3">
							<div className="space-y-2">
								{recentActivities && recentActivities.length > 0 ? (
									recentActivities.map((activity) => (
										<div
											key={activity.name}
											className="flex items-center gap-3 py-2 px-6 hover:bg-blue-50/30 rounded transition-colors"
										>
											<Users className="w-4 h-4 text-blue-600" />
											<span className="text-slate-700">
												{activity.name} -{' '}
												{activity.Validperiod
													? `${activity.Validperiod.shift} shift`
													: 'New member assigned'}
											</span>
										</div>
									))
								) : (
									<div className="flex items-center gap-3 py-2 px-3 text-slate-600">
										<AlertCircle className="w-4 h-4 text-blue-600" />
										<span>No recent activities to show</span>
									</div>
								)}
							</div>
						</div>
					</div>
				</div>
			</div>
		</div>
	);
}
