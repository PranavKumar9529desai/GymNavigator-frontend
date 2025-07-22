'use client';

import { DataCard } from '@/components/Table/UserCard';
import { DataTable } from '@/components/Table/UsersTable';
import { StatusCard } from '@/components/common/StatusCard';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from '@/components/ui/select';
import type { ColumnDef } from '@tanstack/react-table';
import { ArrowUpDown, Search, UserCheck, UserX, Users } from 'lucide-react';
import { useEffect, useState, useMemo } from 'react';
import type { TodayAttendanceResponse } from './getTodayAttendance';

const formatShift = (shift: 'MORNING' | 'EVENING'): 'Morning' | 'Evening' => {
	return shift === 'MORNING' ? 'Morning' : 'Evening';
};

interface FormattedUser {
	id: number;
	name: string;
	shift: 'Morning' | 'Evening';
	todaysAttendance: boolean;
	attendanceTime: string | null;
}

interface UserAttendanceProps {
	attendanceData: TodayAttendanceResponse;
}

const columns: ColumnDef<FormattedUser>[] = [
	{
		accessorKey: 'name',
		header: ({ column }) => (
			<Button
				variant="ghost"
				onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
			>
				User Name
				<ArrowUpDown className="ml-2 h-4 w-4" />
			</Button>
		),
		cell: ({ row }) => {
			return <div className="ml-4">{row.getValue('name')}</div>;
		},
	},
	{
		accessorKey: 'attendanceTime',
		header: ({ column }) => (
			<Button
				variant="ghost"
				onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
			>
				Time
				<ArrowUpDown className="ml-2 h-4 w-4" />
			</Button>
		),
		cell: ({ row }) => {
			const time = row.getValue('attendanceTime') as string | null;
			if (!time) return <div className="flex ml-4">- -</div>;
			try {
				// Parse the UTC time and convert to IST
				const utcDate = new Date(time);
				if (Number.isNaN(utcDate.getTime())) return '-';

				// Using explicit IST timezone for conversion
				return (
					<div className="ml-4 ">
						{utcDate
							.toLocaleTimeString('en-IN', {
								hour: '2-digit',
								minute: '2-digit',
								hour12: true,
								timeZone: 'Asia/Kolkata',
							})
							.toUpperCase()}
					</div>
				);
			} catch (error) {
				console.error('Error formatting time:', error);
				return <div className="">-</div>;
			}
		},
	},
	{
		accessorKey: 'shift',
		header: 'Shift',
		cell: ({ row }) => {
			const shift = row.getValue('shift') as string;
			return <div className="">{shift}</div>;
		},
	},
	{
		accessorKey: 'todaysAttendance',
		header: 'Attendance',
		cell: ({ row }) => {
			const attendance = row.getValue('todaysAttendance') as boolean;
			return (
				<div
					className={`font-medium ${attendance ? 'text-green-600' : 'text-red-600'}`}
				>
					{attendance ? 'Present' : 'Absent'}
				</div>
			);
		},
	},
];

export default function UserAttendance({
	attendanceData,
}: UserAttendanceProps) {
	const formattedUsers: FormattedUser[] = useMemo(
		() =>
			attendanceData?.users?.map((user) => ({
				id: user.id,
				name: user.name,
				shift: formatShift(user.shift),
				todaysAttendance: user.isPresent,
				attendanceTime: user.attendanceTime,
			})) || [],
		[attendanceData],
	);

	const [searchTerm, setSearchTerm] = useState('');
	const [filteredUsers, setFilteredUsers] =
		useState<FormattedUser[]>(formattedUsers);

	// Calculate stats
	const totalUsers = formattedUsers.length;
	const presentUsers = formattedUsers.filter((u) => u.todaysAttendance).length;
	const absentUsers = totalUsers - presentUsers;

	const statusCards = [
		{
			title: 'Total Users',
			value: totalUsers,
			icon: Users,
			gradient: 'blue',
		},
		{
			title: 'Present Users',
			value: presentUsers,
			icon: UserCheck,
			gradient: 'green',
		},
		{
			title: 'Absent Users',
			value: absentUsers,
			icon: UserX,
			gradient: 'red',
		},
	] as const;

	useEffect(() => {
		const filtered = formattedUsers.filter((user) =>
			user.name.toLowerCase().includes(searchTerm.toLowerCase()),
		);
		setFilteredUsers(filtered);
	}, [searchTerm, formattedUsers]);

	if (!attendanceData?.users) {
		return <div>Failed to load attendance data</div>;
	}

	return (
		<div className="container mx-auto p-6 space-y-8">
			<h1 className="text-2xl font-bold text-center">Today's Attendance</h1>

			{/* Stats Cards */}
			<div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
				{statusCards.map((card) => (
					<StatusCard key={card.title} {...card} />
				))}
			</div>

			{/* Search */}
			<div className="flex items-center space-x-2 mb-6">
				<Search className="w-5 h-5 text-gray-400" />
				<Input
					placeholder="Search users..."
					value={searchTerm}
					onChange={(e) => setSearchTerm(e.target.value)}
					className="max-w-sm"
				/>
			</div>

			{/* Desktop View */}
			<div className="hidden md:block">
				<DataTable data={filteredUsers} columns={columns} filterColumn="name" />
			</div>

			{/* Mobile View */}
			<div className="md:hidden">
				<DataCard
					data={filteredUsers}
					renderCard={(user) => (
						<div className="p-4 space-y-2">
							<h3 className="font-medium">{user.name}</h3>
							<div className="grid grid-cols-2 gap-2 mt-2">
								<p className="text-sm">
									<span className="text-gray-600">Shift: </span>
									{user.shift}
								</p>
								<p className="text-sm">
									<span className="text-gray-600">Status: </span>
									<span
										className={
											user.todaysAttendance ? 'text-green-600' : 'text-red-600'
										}
									>
										{user.todaysAttendance ? 'Present' : 'Absent'}
									</span>
								</p>
								{user.attendanceTime && (
									<p className="text-sm col-span-2">
										<span className="text-gray-600">Time: </span>
										{new Date(user.attendanceTime).toLocaleTimeString()}
									</p>
								)}
							</div>
						</div>
					)}
				/>
			</div>
		</div>
	);
}
