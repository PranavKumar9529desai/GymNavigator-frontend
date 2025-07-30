'use client';

import React from 'react';
import { Button } from '@/components/ui/button';
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { QrCode, MoreHorizontal, Users, Calendar } from 'lucide-react';
import Link from 'next/link';

export default function DashboardHeader() {
	return (
		<div className="flex items-center justify-between">
			<div>
				<h1 className="text-2xl font-bold text-slate-800">Gym Dashboard</h1>
				<p className="text-slate-600">
					Welcome back! Here's your gym overview.
				</p>
			</div>
			<DropdownMenu>
				<DropdownMenuTrigger asChild>
					<Button
						variant="outline"
						size="sm"
						className="hover:bg-blue-50/50 border-blue-200"
					>
						<MoreHorizontal className="h-4 w-4 mr-2" />
						Quick Actions
					</Button>
				</DropdownMenuTrigger>
				<DropdownMenuContent
					align="end"
					className="w-56 bg-white border-blue-100 shadow-lg"
				>
					<DropdownMenuItem asChild>
						<Link
							href="/dashboard/owner/onboarding/onboardingqr"
							className="flex items-center cursor-pointer"
						>
							<QrCode className="h-4 w-4 mr-2 text-blue-600" />
							Show Onboarding QR
						</Link>
					</DropdownMenuItem>
					<DropdownMenuItem asChild>
						<Link
							href="/dashboard/owner/trainers/userstrainersassignment"
							className="flex items-center cursor-pointer"
						>
							<Users className="h-4 w-4 mr-2 text-indigo-600" />
							View Users to Trainer
						</Link>
					</DropdownMenuItem>
					<DropdownMenuItem asChild>
						<Link
							href="/dashboard/owner/attendance/showqr"
							className="flex items-center cursor-pointer"
						>
							<QrCode className="h-4 w-4 mr-2 text-blue-600" />
							View Attendance QR
						</Link>
					</DropdownMenuItem>
					<DropdownMenuItem asChild>
						<Link
							href="/dashboard/owner/attendance/todaysattendance"
							className="flex items-center cursor-pointer"
						>
							<Calendar className="h-4 w-4 mr-2 text-indigo-600" />
							View Today's Attendance
						</Link>
					</DropdownMenuItem>
				</DropdownMenuContent>
			</DropdownMenu>
		</div>
	);
}
