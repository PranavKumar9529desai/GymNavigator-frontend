'use client';
import { DataCard } from '@/components/Table/UserCard';
import { DataTable } from '@/components/Table/UsersTable';
import { StatusCard } from '@/components/common/StatusCard';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import type { ColumnDef } from '@tanstack/react-table';
import {
	ArrowUpDown,
	Dumbbell,
	Search,
	UserCheck,
	Users,
	UtensilsCrossed,
} from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import type { AssignedUser } from '../_actiions/GetuserassignedTotrainers';
import { AssignedUserToTrainersAction } from '../[id]/_components/assigned-users-to-trainer-action';

const columns: ColumnDef<AssignedUser>[] = [
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
			const router = useRouter();
			return (
				<div
					className="cursor-pointer hover:text-primary"
					onClick={() =>
						row.original.id &&
						router.push(
							`/dashboard/trainer/assignedusers/assignedusersroute/${row.original.id}`,
						)
					}
					onKeyUp={() =>
						row.original.id &&
						router.push(
							`/dashboard/trainer/assignedusers/assignedusersroute/${row.original.id}`,
						)
					}
				>
					{row.getValue('name')}
				</div>
			);
		},
	},
	{
		accessorKey: 'activeWorkoutPlan',
		header: 'Workout Plan',
		cell: ({ row }) => {
			const hasWorkoutPlan = row.original.hasActiveWorkoutPlan;
			const planName = row.original.activeWorkoutPlanName;

			return (
				<div className="flex items-center gap-2">
					{hasWorkoutPlan ? (
						<Badge className="bg-green-100 text-green-800 hover:bg-green-200">
							<Dumbbell className="w-3 h-3 mr-1" />
							{planName}
						</Badge>
					) : (
						<Badge variant="secondary" className="bg-gray-100 text-gray-600">
							No Active Plan
						</Badge>
					)}
				</div>
			);
		},
	},
	{
		accessorKey: 'dietPlan',
		header: 'Diet Plan',
		cell: ({ row }) => {
			const hasDietPlan = row.original.hasActiveDietPlan;
			const planName = row.original.dietPlanName;

			return (
				<div className="flex items-center gap-2">
					{hasDietPlan ? (
						<Badge className="bg-blue-100 text-blue-800 hover:bg-blue-200">
							<UtensilsCrossed className="w-3 h-3 mr-1" />
							{planName}
						</Badge>
					) : (
						<Badge variant="secondary" className="bg-gray-100 text-gray-600">
							No Diet Plan
						</Badge>
					)}
				</div>
			);
		},
	},
	{
		accessorKey: 'membershipStatus',
		header: 'Status',
		cell: ({ row }) => {
			const status = row.original.membershipStatus;
			return (
				<Badge
					className={`${
						status === 'active'
							? 'bg-green-100 text-green-800'
							: 'bg-red-100 text-red-800'
					}`}
				>
					{status}
				</Badge>
			);
		},
	},
	{
		id: 'actions',
		cell: ({ row }) => {
			const user = row.original;

			return (
				<AssignedUserToTrainersAction 	 
					user={user}
					type='horizontal'
				/>
			);
		},
	},
];

interface AssignedUserToTrainerProps {
	assignedUsers: AssignedUser[];
}

export default function AssignedUserToTrainer({
	assignedUsers,
}: AssignedUserToTrainerProps) {
	const router = useRouter();
	const [filteredUsers, setFilteredUsers] = useState(assignedUsers);
	const [searchTerm, setSearchTerm] = useState('');

	// Calculate stats
	const totalUsers = assignedUsers.length;
	const activeUsers = assignedUsers.filter(
		(u) => u.membershipStatus === 'active',
	).length;
	const usersWithWorkoutPlan = assignedUsers.filter(
		(u) => u.hasActiveWorkoutPlan,
	).length;
	const usersWithDietPlan = assignedUsers.filter(
		(u) => u.hasActiveDietPlan,
	).length;

	const statusCards = [
		{
			title: 'Total Assigned Users',
			value: totalUsers,
			icon: Users,
			gradient: 'blue',
		},
		{
			title: 'Active Users',
			value: activeUsers,
			icon: UserCheck,
			gradient: 'green',
		},
		{
			title: 'With Workout Plan',
			value: usersWithWorkoutPlan,
			icon: Dumbbell,
			gradient: 'yellow',
		},
		{
			title: 'With Diet Plan',
			value: usersWithDietPlan,
			icon: UtensilsCrossed,
			gradient: 'red',
		},
	] as const;

	useEffect(() => {
		const lowercasedTerm = searchTerm.toLowerCase();
		const filtered = assignedUsers.filter(
			(user) =>
				user.name.toLowerCase().includes(lowercasedTerm) ||
				user.activeWorkoutPlanName?.toLowerCase().includes(lowercasedTerm) ||
				user.dietPlanName?.toLowerCase().includes(lowercasedTerm),
		);
		setFilteredUsers(filtered);
	}, [searchTerm, assignedUsers]);

	return (
		<div className="container mx-auto p-6 space-y-8">
			<div className="flex flex-col items-center justify-between gap-4 md:flex-row">
				<h1 className="text-3xl font-bold text-gray-900 text-center w-full">
					Assigned Users
				</h1>
			</div>

			{/* Stats Cards */}
			<div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
				{statusCards.map((card) => (
					<StatusCard key={card.title} {...card} />
				))}
			</div>
			<div className="flex items-center space-x-2">
				<Search className="w-5 h-5 text-gray-400" />
				<Input
					placeholder="Search users..."
					value={searchTerm}
					onChange={(e) => setSearchTerm(e.target.value)}
					className="w-full md:w-[300px]"
				/>
			</div>
			{/* Desktop View */}
			<div className="hidden md:block rounded-lg border bg-card">
				<DataTable data={filteredUsers} columns={columns} filterColumn="name" />
			</div>

			{/* Mobile View */}
			<div className="md:hidden space-y-4">
				<DataCard
					data={filteredUsers}
					renderCard={(user) => (
						<div className="bg-white rounded-xl border border-gray-200 shadow-sm hover:shadow-md transition-all duration-200 overflow-hidden">
							{/* Header Section */}
							<div className="p-4 border-b border-gray-100">
								<div className="flex items-center justify-between">
									<div className="flex-1">
										<h3 
											className="font-semibold text-lg text-gray-900 cursor-pointer hover:text-blue-600 transition-colors"
											onClick={() =>
												user.id &&
												router.push(`/dashboard/trainer/assignedusers/${user.id}`)
											}
											onKeyDown={(e) => {
												if (e.key === 'Enter' || e.key === ' ') {
													e.preventDefault()
													user.id &&
													router.push(`/dashboard/trainer/assignedusers/${user.id}`)
												}
											}}
										>
											{user.name}
										</h3>
										<p className="text-sm text-gray-500 mt-1">{user.email}</p>
									</div>
									<div className="flex items-center gap-2">
										<Badge
											className={`${
												user.membershipStatus === 'active'
													? 'bg-green-100 text-green-800 border-green-200'
													: 'bg-red-100 text-red-800 border-red-200'
											} border`}
										>
											{user.membershipStatus}
										</Badge>
										<AssignedUserToTrainersAction 
											user={user}
											type='vertical'
											triggerVariant='ghost'
										/>
									</div>
								</div>
							</div>

							{/* Content Section */}
							<div className="p-4 space-y-4">
								{/* Workout Plan Section */}
								<div className="flex items-center justify-between p-3 bg-gradient-to-r from-green-50 to-emerald-50 rounded-lg border border-green-100">
									<div className="flex items-center gap-2">
										<div className="p-1.5 bg-green-100 rounded-full">
											<Dumbbell className="w-4 h-4 text-green-600" />
										</div>
										<div>
											<p className="text-xs font-medium text-green-700 uppercase tracking-wide">
												Workout Plan
											</p>
											{user.hasActiveWorkoutPlan ? (
												<p className="text-sm font-semibold text-green-800">
													{user.activeWorkoutPlanName}
												</p>
											) : (
												<p className="text-sm text-green-600">
													No Active Plan
												</p>
											)}
										</div>
									</div>
									{user.hasActiveWorkoutPlan && (
										<Badge className="bg-green-200 text-green-800 border-green-300">
											Active
										</Badge>
									)}
								</div>

								{/* Diet Plan Section */}
								<div className="flex items-center justify-between p-3 bg-gradient-to-r from-blue-50 to-cyan-50 rounded-lg border border-blue-100">
									<div className="flex items-center gap-2">
										<div className="p-1.5 bg-blue-100 rounded-full">
											<UtensilsCrossed className="w-4 h-4 text-blue-600" />
										</div>
										<div>
											<p className="text-xs font-medium text-blue-700 uppercase tracking-wide">
												Diet Plan
											</p>
											{user.hasActiveDietPlan ? (
												<p className="text-sm font-semibold text-blue-800">
													{user.dietPlanName}
												</p>
											) : (
												<p className="text-sm text-blue-600">
													No Diet Plan
												</p>
											)}
										</div>
									</div>
									{user.hasActiveDietPlan && (
										<Badge className="bg-blue-200 text-blue-800 border-blue-300">
											Active
										</Badge>
									)}
								</div>

								{/* Quick Actions */}
								<div className="flex gap-2 pt-2">
									<button
										onClick={() =>
											user.id &&
											router.push(`/dashboard/trainer/assignedusers/${user.id}`)
										}
										onKeyDown={(e) => {
											if (e.key === 'Enter' || e.key === ' ') {
												e.preventDefault()
												user.id &&
												router.push(`/dashboard/trainer/assignedusers/${user.id}`)
											}
										}}
										className="flex-1 px-3 py-2 text-sm font-medium text-blue-600 bg-blue-50 hover:bg-blue-100 rounded-lg transition-colors border border-blue-200"
									>
										View Profile
									</button>
								</div>
							</div>
						</div>
					)}
				/>
			</div>
		</div>
	);
}
