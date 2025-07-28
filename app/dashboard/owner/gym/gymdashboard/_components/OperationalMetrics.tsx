"use client";

import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import Link from 'next/link';
import type { GymDashboardData } from '../types';

interface OperationalMetricsProps {
	operationalMetrics: GymDashboardData['operationalMetrics'];
	businessMetrics: GymDashboardData['businessMetrics'];
}

export default function OperationalMetrics({ operationalMetrics, businessMetrics }: OperationalMetricsProps) {
	return (
		<div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
			{/* Onboarding Pipeline */}
			<Card className="border-blue-200 bg-white/80 backdrop-blur-sm shadow-sm hover:shadow-md transition-shadow">
				<CardHeader>
					<CardTitle className="text-lg font-semibold text-slate-800">Onboarding Pipeline</CardTitle>
				</CardHeader>
				<CardContent className="space-y-3">
					<div className="space-y-2">
						<div className="flex justify-between items-center">
							<span className="text-sm text-slate-600">Onboarding</span>
							<Badge variant="secondary" className="bg-blue-50 text-blue-600 border-blue-100">
								{operationalMetrics.onboardingPipeline.onboarding}
							</Badge>
						</div>
						<Progress value={(operationalMetrics.onboardingPipeline.onboarding / businessMetrics.totalMembers) * 100} className="h-2 bg-blue-100" />
						
						<div className="flex justify-between items-center">
							<span className="text-sm text-slate-600">Health Profile</span>
							<Badge variant="secondary" className="bg-indigo-50 text-indigo-600 border-indigo-100">
								{operationalMetrics.onboardingPipeline.healthProfile}
							</Badge>
						</div>
						<Progress value={(operationalMetrics.onboardingPipeline.healthProfile / businessMetrics.totalMembers) * 100} className="h-2 bg-indigo-100" />
						
						<div className="flex justify-between items-center">
							<span className="text-sm text-slate-600">Ready for Assignment</span>
							<Badge variant="secondary" className="bg-emerald-50 text-emerald-600 border-emerald-100">
								{operationalMetrics.onboardingPipeline.dashboard}
							</Badge>
						</div>
						<Progress value={(operationalMetrics.onboardingPipeline.dashboard / businessMetrics.totalMembers) * 100} className="h-2 bg-emerald-100" />
						
						<div className="flex justify-between items-center">
							<span className="text-sm text-slate-600">Fully Onboarded</span>
							<Badge variant="secondary" className="bg-teal-50 text-teal-600 border-teal-100">
								{operationalMetrics.onboardingPipeline.dietPlan}
							</Badge>
						</div>
						<Progress value={(operationalMetrics.onboardingPipeline.dietPlan / businessMetrics.totalMembers) * 100} className="h-2 bg-teal-100" />
					</div>
				</CardContent>
			</Card>

			{/* Trainer Workload */}
			<Card className="border-blue-200 bg-white/80 backdrop-blur-sm shadow-sm hover:shadow-md transition-shadow">
				<CardHeader>
					<CardTitle className="text-lg font-semibold text-slate-800">Trainer Workload</CardTitle>
				</CardHeader>
				<CardContent>
					<div className="space-y-2">
						{operationalMetrics.trainerWorkload.map((trainer) => (
							<div key={trainer.id} className="flex items-center justify-between p-2 bg-gradient-to-r from-blue-50/50 to-indigo-50/50 rounded-lg border border-blue-100">
								<div>
									<div className="font-medium text-slate-800">{trainer.name}</div>
									<div className="text-xs text-slate-600">{trainer.specializations || 'General'}</div>
								</div>
								<div className="text-right">
									<div className="font-semibold text-slate-800">{trainer.userCount} clients</div>
									<div className="text-xs text-slate-600">
										{trainer.rating ? `★ ${trainer.rating}/5` : 'No rating'}
									</div>
								</div>
							</div>
						))}
						{operationalMetrics.unassignedUsers > 0 && (
							<div className="mt-3 p-2 bg-orange-50 border border-orange-200 rounded-lg">
								<div className="flex items-center justify-between">
									<span className="text-sm font-medium text-orange-800">Unassigned Users</span>
									<Badge variant="destructive">{operationalMetrics.unassignedUsers}</Badge>
								</div>
								<Link href="/dashboard/owner/trainers/userstrainersassignment">
									<Button size="sm" className="mt-2 w-full" variant="outline">
										Assign to Trainers
									</Button>
								</Link>
							</div>
						)}
					</div>
				</CardContent>
			</Card>
		</div>
	);
} 