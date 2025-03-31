'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
	type LucideIcon,
	UserCheck,
	ClockIcon as UserClock,
	Users,
} from 'lucide-react';
import { useState } from 'react';
import { EnrollmentCards } from './enrollmentcard';
import { EnrollmentTable } from './enrollmenttable';
import type { Enrollment } from './types';

export default function GymManagement() {
	const [enrollments, setEnrollments] = useState<Enrollment[]>([
		{
			id: '1',
			userName: 'John Doe',
			startDate: new Date('2023-06-01'),
			endDate: new Date('2023-12-31'),
			status: 'active',
		},
		{
			id: '2',
			userName: 'Jane Smith',
			startDate: new Date('2023-06-15'),
			endDate: new Date('2023-12-31'),
			status: 'pending',
		},
		{
			id: '3',
			userName: 'Bob Johnson',
			startDate: new Date('2023-07-01'),
			endDate: new Date('2024-01-31'),
			status: 'inactive',
		},
	]);

	const totalUsers = enrollments.length;
	const allowedUsers = enrollments.filter((e) => e.status === 'active').length;
	const pendingUsers = enrollments.filter((e) => e.status === 'pending').length;

	return (
		<div className="container mx-auto p-6 space-y-8">
			<h1 className="text-3xl font-bold text-center mb-8">
				Gym Enrollment Management
			</h1>

			<div className="grid grid-cols-1 md:grid-cols-3 gap-6">
				<StatCard
					title="Total Users"
					value={totalUsers}
					icon={Users}
					gradient="from-blue-500 to-blue-600"
				/>
				<StatCard
					title="Allowed Users"
					value={allowedUsers}
					icon={UserCheck}
					gradient="from-green-500 to-green-600"
				/>
				<StatCard
					title="Pending Users"
					value={pendingUsers}
					icon={UserClock}
					gradient="from-yellow-500 to-yellow-600"
				/>
			</div>

			<div className="hidden md:block">
				<EnrollmentTable
					enrollments={enrollments}
					setEnrollments={setEnrollments}
				/>
			</div>

			<div className="md:hidden">
				<EnrollmentCards enrollments={enrollments} />
			</div>
		</div>
	);
}

function StatCard({
	title,
	value,
	icon: Icon,
	gradient,
}: {
	title: string;
	value: number;
	icon: LucideIcon;
	gradient: string;
}) {
	return (
		<Card className={`bg-gradient-to-br ${gradient} text-white`}>
			<CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
				<CardTitle className="text-sm font-medium">{title}</CardTitle>
				<Icon className="h-8 w-8 opacity-75 text-white" />
			</CardHeader>
			<CardContent>
				<div className="text-2xl font-bold">{value}</div>
			</CardContent>
		</Card>
	);
}
