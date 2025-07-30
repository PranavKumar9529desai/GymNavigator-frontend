'use client';

import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
	PieChart,
	Pie,
	Cell,
	ResponsiveContainer,
	Tooltip,
	Legend,
} from 'recharts';
import type { GymDashboardData } from '../types';

interface RevenueChartProps {
	breakdowns: GymDashboardData['breakdowns'];
}

export default function RevenueChart({ breakdowns }: RevenueChartProps) {
	const formatCurrency = (amount: number) => {
		return new Intl.NumberFormat('en-IN', {
			style: 'currency',
			currency: 'INR',
		}).format(amount);
	};

	// Beautiful color palette using react-colorful inspired colors
	const colors = [
		'#3B82F6', // Blue
		'#EF4444', // Red
		'#10B981', // Emerald
		'#F59E0B', // Amber
		'#8B5CF6', // Violet
		'#EC4899', // Pink
		'#06B6D4', // Cyan
		'#84CC16', // Lime
	];

	// Prepare data for pie chart with better colors
	const pieChartData = breakdowns.revenueByPlan.map((plan, index) => ({
		name: plan.label,
		value: plan.value,
		color: plan.color || colors[index % colors.length],
		count: plan.count || 0,
	}));

	// Custom tooltip for pie chart
	const CustomTooltip = ({
		active,
		payload,
	}: {
		active?: boolean;
		payload?: Array<{
			payload: { name: string; value: number; count: number };
		}>;
	}) => {
		if (active && payload && payload.length) {
			const data = payload[0].payload;
			return (
				<div className="bg-white p-3 border border-blue-200 rounded-lg shadow-lg">
					<p className="font-medium text-slate-800">{data.name}</p>
					<p className="text-blue-600 font-semibold">
						{formatCurrency(data.value)}
					</p>
					<p className="text-slate-600 text-sm">{data.count} members</p>
				</div>
			);
		}
		return null;
	};

	// Custom legend formatter
	const CustomLegend = ({
		payload,
	}: { payload?: Array<{ value: string; color: string }> }) => {
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

	return (
		<Card className="border-blue-200 bg-white/80 backdrop-blur-sm shadow-sm hover:shadow-md transition-shadow">
			<CardHeader>
				<CardTitle className="text-lg font-semibold text-slate-800">
					Revenue by Plan
				</CardTitle>
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
								label={({ name, percent }) =>
									`${name} ${percent ? (percent * 100).toFixed(0) : 0}%`
								}
								outerRadius={80}
								innerRadius={0}
								fill="#8884d8"
								dataKey="value"
								stroke="#ffffff"
								strokeWidth={3}
								startAngle={90}
								endAngle={-270}
							>
								{pieChartData.map((entry) => (
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
				<div className="mt-4 space-y-2">
					{breakdowns.revenueByPlan.map((plan, index) => {
						const totalRevenue = breakdowns.revenueByPlan.reduce(
							(sum, p) => sum + p.value,
							0,
						);
						const percentage =
							totalRevenue > 0 ? (plan.value / totalRevenue) * 100 : 0;
						return (
							<div
								key={plan.label}
								className="flex items-center justify-between p-2 bg-gradient-to-r from-slate-50/50 to-blue-50/50 rounded-lg border border-slate-100"
							>
								<div className="flex items-center space-x-3">
									<div
										className="w-4 h-4 rounded-full shadow-sm"
										style={{
											backgroundColor:
												plan.color || colors[index % colors.length],
										}}
									/>
									<div>
										<span className="text-sm font-medium text-slate-800">
											{plan.label}
										</span>
										<div className="text-xs text-slate-500">
											{plan.count || 0} members
										</div>
									</div>
								</div>
								<div className="text-right">
									<div className="font-semibold text-slate-800">
										{formatCurrency(plan.value)}
									</div>
									<div className="text-xs text-slate-500">
										{percentage.toFixed(1)}%
									</div>
								</div>
							</div>
						);
					})}
				</div>
			</CardContent>
		</Card>
	);
}
