'use client';

import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
	Users,
	Activity,
	UserCheck,
	UserPlus,
	ArrowUpRight,
	ArrowDownRight,
	IndianRupee,
} from 'lucide-react';
import type { GymDashboardData } from '../types';

interface KeyMetricsProps {
	businessMetrics: GymDashboardData['businessMetrics'];
}

export default function KeyMetrics({ businessMetrics }: KeyMetricsProps) {
	const formatCurrency = (amount: number) => {
		return new Intl.NumberFormat('en-IN', {
			style: 'currency',
			currency: 'INR',
		}).format(amount);
	};

	const formatPercentage = (value: number) => {
		return `${value > 0 ? '+' : ''}${value.toFixed(1)}%`;
	};

	const getTrendIcon = (value: number) => {
		return value >= 0 ? (
			<ArrowUpRight className="h-4 w-4 text-emerald-600" />
		) : (
			<ArrowDownRight className="h-4 w-4 text-red-600" />
		);
	};

	return (
		<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3">
			<Card className="border-blue-200 bg-white/80 backdrop-blur-sm shadow-sm hover:shadow-md transition-shadow">
				<CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
					<CardTitle className="text-sm font-medium text-slate-600">
						Monthly Revenue
					</CardTitle>
					<div className="w-8 h-8 rounded-full bg-gradient-to-r from-blue-500 to-indigo-500 flex items-center justify-center">
						<IndianRupee className="h-4 w-4 text-white" />
					</div>
				</CardHeader>
				<CardContent>
					<div className="text-2xl font-bold text-slate-800">
						{formatCurrency(businessMetrics.currentMonthRevenue)}
					</div>
					<div className="flex items-center text-xs text-slate-600 mt-1">
						{getTrendIcon(businessMetrics.monthlyGrowthRate)}
						<span className="ml-1">
							{formatPercentage(businessMetrics.monthlyGrowthRate)} from last
							month
						</span>
					</div>
				</CardContent>
			</Card>

			<Card className="border-blue-200 bg-white/80 backdrop-blur-sm shadow-sm hover:shadow-md transition-shadow">
				<CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
					<CardTitle className="text-sm font-medium text-slate-600">
						Total Members
					</CardTitle>
					<div className="w-8 h-8 rounded-full bg-gradient-to-r from-emerald-500 to-teal-500 flex items-center justify-center">
						<Users className="h-4 w-4 text-white" />
					</div>
				</CardHeader>
				<CardContent>
					<div className="text-2xl font-bold text-slate-800">
						{businessMetrics.totalMembers}
					</div>
					<div className="flex items-center text-xs text-slate-600 mt-1">
						<UserPlus className="h-3 w-3 mr-1" />
						<span>+{businessMetrics.newMembers} this month</span>
					</div>
				</CardContent>
			</Card>

			<Card className="border-blue-200 bg-white/80 backdrop-blur-sm shadow-sm hover:shadow-md transition-shadow">
				<CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
					<CardTitle className="text-sm font-medium text-slate-600">
						Today's Attendance
					</CardTitle>
					<div className="w-8 h-8 rounded-full bg-gradient-to-r from-orange-500 to-red-500 flex items-center justify-center">
						<Activity className="h-4 w-4 text-white" />
					</div>
				</CardHeader>
				<CardContent>
					<div className="text-2xl font-bold text-slate-800">
						{businessMetrics.todayAttendance}
					</div>
					<div className="flex items-center text-xs text-slate-600 mt-1">
						{getTrendIcon(businessMetrics.attendanceGrowth)}
						<span className="ml-1">
							{formatPercentage(businessMetrics.attendanceGrowth)} from
							yesterday
						</span>
					</div>
				</CardContent>
			</Card>

			<Card className="border-blue-200 bg-white/80 backdrop-blur-sm shadow-sm hover:shadow-md transition-shadow">
				<CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
					<CardTitle className="text-sm font-medium text-slate-600">
						Active Trainers
					</CardTitle>
					<div className="w-8 h-8 rounded-full bg-gradient-to-r from-purple-500 to-pink-500 flex items-center justify-center">
						<UserCheck className="h-4 w-4 text-white" />
					</div>
				</CardHeader>
				<CardContent>
					<div className="text-2xl font-bold text-slate-800">
						{businessMetrics.activeTrainers}
					</div>
					<div className="text-xs text-slate-600 mt-1">
						Managing {businessMetrics.totalMembers} members
					</div>
				</CardContent>
			</Card>
		</div>
	);
}
