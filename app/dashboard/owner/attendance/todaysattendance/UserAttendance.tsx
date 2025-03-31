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
import { ArrowUpDown, UserCheck, UserX, Users } from 'lucide-react';
import { useEffect, useState } from 'react';

interface AttendanceUser {
	id: number;
	name: string;
	shift: 'Morning' | 'Evening';
	todaysAttendance: boolean;
	attendanceTime: string | null;
}

interface UserAttendanceProps {
	initialUsers: AttendanceUser[];
}

const columns: ColumnDef<AttendanceUser>[] = [
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

export default function UserAttendance({ initialUsers }: UserAttendanceProps) {
	const [users] = useState<AttendanceUser[]>(initialUsers);
	const [searchTerm, setSearchTerm] = useState('');
	const [shiftFilter, setShiftFilter] = useState<'Morning' | 'Evening' | 'All'>(
		'All',
	);
	const [filteredUsers, setFilteredUsers] =
		useState<AttendanceUser[]>(initialUsers);

	// Calculate stats
	const totalUsers = users.length;
	const presentUsers = users.filter((user) => user.todaysAttendance).length;
	const absentUsers = totalUsers - presentUsers;

	const statusCards = [
		{
			title: 'Total Users',
			value: totalUsers,
			icon: Users,
			gradient: 'blue',
		},
		{
			title: 'Present Today',
			value: presentUsers,
			icon: UserCheck,
			gradient: 'green',
		},
		{
			title: 'Absent Today',
			value: absentUsers,
			icon: UserX,
			gradient: 'red',
		},
	] as const;

	useEffect(() => {
		const filtered = users.filter(
			(user) =>
				user.name.toLowerCase().includes(searchTerm.toLowerCase()) &&
				(shiftFilter === 'All' || user.shift === shiftFilter),
		);
		setFilteredUsers(filtered);
	}, [searchTerm, shiftFilter, users]);

	return (
		<div className="container mx-auto p-6 space-y-8">
			<h1 className="text-3xl font-bold text-center">
				Today&apos;s Attendance
			</h1>

			{/* Stats Cards */}
			<div className="grid grid-cols-1 md:grid-cols-3 gap-6">
				{statusCards.map((card) => (
					<StatusCard key={card.title} {...card} />
				))}
			</div>

			{/* Filters */}
			<div className="flex flex-col md:flex-row gap-4 mb-6">
				<Input
					placeholder="Search users..."
					value={searchTerm}
					onChange={(e) => setSearchTerm(e.target.value)}
					className="max-w-sm"
				/>
				<Select
					value={shiftFilter}
					onValueChange={(value: 'Morning' | 'Evening' | 'All') =>
						setShiftFilter(value)
					}
				>
					<SelectTrigger className="w-[180px]">
						<SelectValue placeholder="Select shift" />
					</SelectTrigger>
					<SelectContent>
						<SelectItem value="All">All Shifts</SelectItem>
						<SelectItem value="Morning">Morning</SelectItem>
						<SelectItem value="Evening">Evening</SelectItem>
					</SelectContent>
				</Select>
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
						<div className="p-4 space-y-1">
							<h3 className="font-medium">{user.name}</h3>
							<p className="text-sm text-gray-500">Shift: {user.shift}</p>
							<p
								className={`text-sm font-medium ${
									user.todaysAttendance ? 'text-green-600' : 'text-red-600'
								}`}
							>
								Status: {user.todaysAttendance ? 'Present' : 'Absent'}
							</p>
						</div>
					)}
				/>
			</div>
		</div>
	);
}
