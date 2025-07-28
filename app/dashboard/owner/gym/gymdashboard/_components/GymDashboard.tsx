"use client";

import React from 'react';
import type { GymDashboardData } from '../types';
import DashboardHeader from './DashboardHeader';
import KeyMetrics from './KeyMetrics';
import OperationalMetrics from './OperationalMetrics';
import RevenueChart from './RevenueChart';
import MemberDistribution from './MemberDistribution';
import RecentActivities from './RecentActivities';

interface GymDashboardProps {
	data: GymDashboardData;
}

export default function GymDashboard({ data }: GymDashboardProps) {
	const { businessMetrics, operationalMetrics, breakdowns, recentActivities } = data;

	return (
		<div className="space-y-4 p-4 bg-gradient-to-br from-blue-50/40 via-white to-indigo-50/30 min-h-screen">
			{/* Header */}
			<DashboardHeader />

			{/* Key Business Metrics */}
			<KeyMetrics businessMetrics={businessMetrics} />

			{/* Operational Metrics */}
			<OperationalMetrics 
				operationalMetrics={operationalMetrics} 
				businessMetrics={businessMetrics} 
			/>

			{/* Revenue & Growth Charts */}
			<div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
				<RevenueChart breakdowns={breakdowns} />
				<MemberDistribution breakdowns={breakdowns} businessMetrics={businessMetrics} />
			</div>

			{/* Recent Activities */}
			<RecentActivities recentActivities={recentActivities} />
		</div>
	);
}
