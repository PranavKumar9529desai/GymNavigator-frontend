import React from 'react';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
	Calendar,
	Clock,
	User,
	CheckCircle,
	AlertTriangle,
	XCircle,
} from 'lucide-react';
import { cn } from '@/lib/utils';
import type { Enrollment } from './types';

const statusConfig = {
	active: {
		color:
			'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400',
		icon: CheckCircle,
		ringColor: 'ring-green-500/30',
	},
	pending: {
		color:
			'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400',
		icon: AlertTriangle,
		ringColor: 'ring-yellow-500/30',
	},
	inactive: {
		color: 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400',
		icon: XCircle,
		ringColor: 'ring-red-500/30',
	},
};

export function EnrollmentCards({
	enrollments,
}: { enrollments: Enrollment[] }) {
	return (
		<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
			{enrollments.map((enrollment: Enrollment) => {
				const StatusIcon = statusConfig[enrollment.status].icon;

				return (
					<Card
						key={enrollment.id}
						className="overflow-hidden transition-all duration-300 hover:shadow-lg border border-border dark:border-zinc-800 group"
					>
						<div
							className={cn(
								'h-1.5 w-full',
								enrollment.status === 'active'
									? 'bg-green-500'
									: enrollment.status === 'pending'
										? 'bg-yellow-500'
										: 'bg-red-500',
							)}
						/>

						<CardHeader className="pb-2">
							<CardTitle className="flex justify-between items-center text-lg">
								<div className="flex items-center gap-2">
									<div className="bg-muted rounded-full p-1.5">
										<User size={16} className="text-muted-foreground" />
									</div>
									<span className="font-medium">{enrollment.userName}</span>
								</div>
								<Badge
									className={cn(
										'flex items-center gap-1.5 px-2.5 py-1 rounded-md',
										statusConfig[enrollment.status].color,
										statusConfig[enrollment.status].ringColor,
										'ring-1',
									)}
								>
									<StatusIcon size={12} />
									<span>
										{enrollment.status.charAt(0).toUpperCase() +
											enrollment.status.slice(1)}
									</span>
								</Badge>
							</CardTitle>
						</CardHeader>

						<CardContent className="pt-2">
							<div className="space-y-3">
								<div className="flex items-center gap-2 text-sm">
									<Calendar size={14} className="text-muted-foreground" />
									<span className="text-muted-foreground">Start Date:</span>
									<span className="font-medium">
										{enrollment.startDate
											? enrollment.startDate.toLocaleDateString()
											: 'Not specified'}
									</span>
								</div>

								<div className="flex items-center gap-2 text-sm">
									<Clock size={14} className="text-muted-foreground" />
									<span className="text-muted-foreground">End Date:</span>
									<span className="font-medium">
										{enrollment.endDate
											? enrollment.endDate.toLocaleDateString()
											: 'Not specified'}
									</span>
								</div>

								<div className="h-1 w-full bg-muted rounded-full mt-4 overflow-hidden">
									<div
										className={cn(
											'h-full rounded-full transition-all',
											enrollment.status === 'active'
												? 'bg-green-500 w-3/4'
												: enrollment.status === 'pending'
													? 'bg-yellow-500 w-1/4'
													: 'bg-red-500 w-full',
										)}
									/>
								</div>
							</div>
						</CardContent>
					</Card>
				);
			})}
		</div>
	);
}
