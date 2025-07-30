"use client";

import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
	PieChart,
	Pie,
	Cell,
	ResponsiveContainer,
	Tooltip,
	Legend
} from 'recharts';
import type { GymDashboardData } from '../types';

interface MembershipStatusDistributionProps {
	breakdowns: GymDashboardData['breakdowns'];
	businessMetrics: GymDashboardData['businessMetrics'];
}

export default function MembershipStatusDistribution({ breakdowns, businessMetrics }: MembershipStatusDistributionProps) {
	// Color palette for membership statuses
	const statusColors = {
		'Active': '#10B981', // Green
		'Expired': '#EF4444', // Red
		'Cancelled': '#6B7280', // Gray
		'Expiring Soon': '#F59E0B', // Orange
	};

	// Prepare data for pie chart
	const pieChartData = breakdowns.membershipStatus.map((item) => ({
		name: item.label,
		value: item.value,
		color: item.color || statusColors[item.label as keyof typeof statusColors] || '#3B82F6',
		percentage: ((item.value / businessMetrics.totalMembers) * 100).toFixed(1)
	}));

	// Custom tooltip for pie chart
	const CustomTooltip = ({ active, payload }: { active?: boolean; payload?: Array<{ payload: { name: string; value: number; percentage: string } }> }) => {
		if (active && payload && payload.length) {
			const data = payload[0].payload;
			return (
				<div className="bg-white p-3 border border-blue-200 rounded-lg shadow-lg">
					<p className="font-medium text-slate-800">{data.name}</p>
					<p className="text-blue-600 font-semibold">{data.value} members</p>
					<p className="text-slate-600 text-sm">{data.percentage}% of total</p>
				</div>
			);
		}
		return null;
	};

	// Custom legend formatter
	const CustomLegend = ({ payload }: { payload?: Array<{ value: string; color: string }> }) => {
		if (!payload) return null;
		
		return (
			<div className="flex flex-wrap justify-center gap-2 mt-4">
				{payload.map((entry) => (
					<div key={entry.value} className="flex items-center space-x-1">
						<div 
							className="w-3 h-3 rounded-full" 
							style={{ backgroundColor: entry.color }}
						/>
						<span className="text-xs text-slate-600">{entry.value}</span>
					</div>
				))}
			</div>
		);
	};

	// Don't render if no data
	if (!breakdowns.membershipStatus || breakdowns.membershipStatus.length === 0) {
		return (
			<Card className="border-blue-200 bg-white/80 backdrop-blur-sm shadow-sm hover:shadow-md transition-shadow">
				<CardHeader>
					<CardTitle className="text-lg font-semibold text-slate-800">Membership Status</CardTitle>
				</CardHeader>
				<CardContent>
					<div className="h-64 flex items-center justify-center">
						<p className="text-slate-500 text-sm">No membership data available</p>
					</div>
				</CardContent>
			</Card>
		);
	}

	return (
		<Card className="border-blue-200 bg-white/80 backdrop-blur-sm shadow-sm hover:shadow-md transition-shadow">
			<CardHeader>
				<CardTitle className="text-lg font-semibold text-slate-800">Membership Status</CardTitle>
			</CardHeader>
			<CardContent>
				<div className="h-64">
					<ResponsiveContainer width="100%" height="100%">
						<PieChart>
							<Pie
								data={pieChartData}
								cx="50%"
								cy="50%"
								labelLine={false}
								label={({ percentage }) => `${percentage}%`}
								outerRadius={80}
								innerRadius={10}
								fill="#8884d8"
								dataKey="value"
								stroke="#ffffff"
								strokeWidth={3}
								startAngle={90}
								endAngle={-270}
							>
								{pieChartData.map((entry, _index) => (
									<Cell 
										key={`cell-${entry.name}`} 
										fill={entry.color}
										stroke="#ffffff"
										strokeWidth={2}
									/>
								))}
							</Pie>
							<Tooltip content={<CustomTooltip />} />
							<Legend 
								content={<CustomLegend />}
								verticalAlign="bottom" 
								height={36}
							/>
						</PieChart>
					</ResponsiveContainer>
				</div>
				
				{/* Detailed breakdown below chart */}
				<div className="mt-4 space-y-2">
					{breakdowns.membershipStatus.map((item, _index) => {
						const percentage = ((item.value / businessMetrics.totalMembers) * 100).toFixed(1);
						const color = item.color || statusColors[item.label as keyof typeof statusColors] || '#3B82F6';
						
						return (
							<div key={item.label} className="flex items-center justify-between p-2 bg-gradient-to-r from-slate-50/50 to-blue-50/50 rounded-lg border border-slate-100">
								<div className="flex items-center space-x-3">
									<div 
										className="w-4 h-4 rounded-full shadow-sm" 
										style={{ backgroundColor: color }}
									/>
									<div>
										<span className="text-sm font-medium text-slate-800">{item.label}</span>
										<div className="text-xs text-slate-500">{item.value} members</div>
									</div>
								</div>
								<div className="text-right">
									<div className="font-semibold text-slate-800">{percentage}%</div>
									<div className="text-xs text-slate-500">of total</div>
								</div>
							</div>
						);
					})}
				</div>
			</CardContent>
		</Card>
	);
} 