"use client";

import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { UserPlus, Activity, UserCheck } from 'lucide-react';
import type { GymDashboardData } from '../types';

interface RecentActivitiesProps {
	recentActivities: GymDashboardData['recentActivities'];
}

export default function RecentActivities({ recentActivities }: RecentActivitiesProps) {
	return (
		<Card className="border-blue-200 bg-white/80 backdrop-blur-sm shadow-sm hover:shadow-md transition-shadow">
			<CardHeader>
				<CardTitle className="text-lg font-semibold text-slate-800">Recent Activities</CardTitle>
			</CardHeader>
			<CardContent>
				<div className="grid grid-cols-1 md:grid-cols-3 gap-4">
					<div>
						<h4 className="font-medium text-slate-800 mb-2">Recent Signups</h4>
						<div className="space-y-2">
							{recentActivities.recentSignups.slice(0, 5).map((signup) => (
								<div key={signup.id} className="flex items-center space-x-2 p-2 bg-gradient-to-r from-emerald-50/50 to-teal-50/50 rounded border border-emerald-100">
									<UserPlus className="h-4 w-4 text-emerald-600" />
									<div>
										<div className="text-sm font-medium text-slate-800">{signup.name}</div>
										<div className="text-xs text-slate-600">
											{new Date(signup.createdAt).toLocaleDateString()}
										</div>
									</div>
								</div>
							))}
						</div>
					</div>

					<div>
						<h4 className="font-medium text-slate-800 mb-2">Recent Attendance</h4>
						<div className="space-y-2">
							{recentActivities.recentAttendance.slice(0, 5).map((attendance) => (
								<div key={attendance.id} className="flex items-center space-x-2 p-2 bg-gradient-to-r from-blue-50/50 to-indigo-50/50 rounded border border-blue-100">
									<Activity className="h-4 w-4 text-blue-600" />
									<div>
										<div className="text-sm font-medium text-slate-800">{attendance.user.name}</div>
										<div className="text-xs text-slate-600">
											{new Date(attendance.scanTime).toLocaleTimeString()}
										</div>
									</div>
								</div>
							))}
						</div>
					</div>

					<div>
						<h4 className="font-medium text-slate-800 mb-2">Trainer Assignments</h4>
						<div className="space-y-2">
							{recentActivities.recentTrainerAssignments.slice(0, 5).map((assignment) => (
								<div key={assignment.id} className="flex items-center space-x-2 p-2 bg-gradient-to-r from-purple-50/50 to-pink-50/50 rounded border border-purple-100">
									<UserCheck className="h-4 w-4 text-purple-600" />
									<div>
										<div className="text-sm font-medium text-slate-800">{assignment.name}</div>
										<div className="text-xs text-slate-600">
											{assignment.trainer?.name || 'Unassigned'}
										</div>
									</div>
								</div>
							))}
						</div>
					</div>
				</div>
			</CardContent>
		</Card>
	);
} 