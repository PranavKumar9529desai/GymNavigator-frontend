'use client';
import { DataCard } from '@/components/Table/UserCard';
import { DataTable } from '@/components/Table/UsersTable';
import { StatusCard } from '@/components/common/StatusCard';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from '@/components/ui/select';
import type { ColumnDef } from '@tanstack/react-table';
import { ArrowUpDown, Search, UserCheck, Users, Dumbbell, UserX } from 'lucide-react';
import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { toast } from 'sonner';
import { attachWorkoutPlanToUser } from './AttachWorkoutplantoUser';
import type { WorkoutPlan } from './Getworkout';

// Update StatusCardProps interface
interface StatusCardProps {
	title: string;
	value: number;
	iconName: string;
	gradient: string;
}

// Update UserType to exactly match AssignedUser from GetuserassignedTotrainers
interface UserType {
	id: string;
	name: string;
	email: string;
	gender: string;
	goal: string;
	membershipStatus: string;
	activeWorkoutPlanId: number | null;
	activeWorkoutPlanName: string | null;
	hasActiveWorkoutPlan: boolean;
}

interface UserWorkoutAssignmentProps {
	Users: UserType[];
	workoutPlans: WorkoutPlan[];
}

// Update the Select component in the columns definition to use workoutPlans
const createColumns = (
	workoutPlans: WorkoutPlan[],
	handleWorkoutAssignment: (
		userId: string,
		workoutPlanId: string,
	) => Promise<void>, // Changed userId to string
): ColumnDef<UserType>[] => [
	{
		accessorKey: 'name',
		header: ({ column }) => {
			return (
				<Button
					variant="ghost"
					onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
				>
					User Name
					<ArrowUpDown className="ml-2 h-4 w-4" />
				</Button>
			);
		},
	},
	{
		accessorKey: 'goal',
		header: 'Fitness Goal',
		cell: ({ row }) => (
			<Badge variant="secondary" className="bg-purple-100 text-purple-800">
				{row.getValue('goal')}
			</Badge>
		),
	},
	{
		accessorKey: 'gender',
		header: 'Gender',
		cell: ({ row }) => (
			<Badge variant="secondary" className="bg-gray-100 text-gray-800">
				{row.getValue('gender')}
			</Badge>
		),
	},
	{
		accessorKey: 'assignedWorkout',
		header: 'Workout Plan',
		cell: ({ row }) => {
			const user = row.original;

			return (
				<div className="flex flex-col gap-1">
					<Select
						value={user.activeWorkoutPlanId?.toString() || undefined}
						onValueChange={(value) => handleWorkoutAssignment(user.id, value)}
					>
						<SelectTrigger
							className={`w-[200px] ${
								user.hasActiveWorkoutPlan
									? 'bg-green-100 text-green-800 border-green-200'
									: 'bg-gray-100 text-gray-600 border-gray-200'
							}`}
						>
							<SelectValue
								placeholder={
									user.hasActiveWorkoutPlan
										? user.activeWorkoutPlanName
										: 'No workout assigned'
								}
							/>
						</SelectTrigger>
						<SelectContent>
							{workoutPlans.map((plan) => (
								<SelectItem
									key={plan.id}
									value={plan.id.toString()}
									className={
										plan.id === user.activeWorkoutPlanId ? 'bg-green-50' : ''
									}
								>
									{plan.name}
									{plan.id === user.activeWorkoutPlanId && (
										<span className="ml-2 text-green-600">•</span>
									)}
								</SelectItem>
							))}
						</SelectContent>
					</Select>
				</div>
			);
		},
	},
];

export default function UserWorkoutAssignment({
	Users,
	workoutPlans,
}: UserWorkoutAssignmentProps) {
	const [searchTerm, setSearchTerm] = useState('');
	const [genderFilter, setGenderFilter] = useState<'Male' | 'Female' | 'All'>(
		'All',
	);
	const [assignmentFilter, setAssignmentFilter] = useState<
		'all' | 'assigned' | 'unassigned'
	>('all');
	const [filteredUsers, setFilteredUsers] = useState<UserType[]>(Users);

	// Update handleWorkoutAssignment to use string ID
	const handleWorkoutAssignment = useCallback(
		async (userId: string, workoutPlanId: string) => {
			try {
				const previousPlan = Users.find(
					(u) => u.id === userId,
				)?.activeWorkoutPlanName;
				const newPlan = workoutPlans.find(
					(p) => p.id === Number.parseInt(workoutPlanId),
				);

				await attachWorkoutPlanToUser(userId, workoutPlanId);

				// Update local state
				setFilteredUsers((current) =>
					current.map((user) =>
						user.id === userId
							? {
									...user,
									activeWorkoutPlanId: Number.parseInt(workoutPlanId),
									activeWorkoutPlanName: newPlan?.name || '',
									hasActiveWorkoutPlan: true,
								}
							: user,
					),
				);

				toast.success(
					previousPlan
						? `Workout plan updated from "${previousPlan}" to "${newPlan?.name}"`
						: `Workout plan "${newPlan?.name}" assigned successfully`,
					{
						description: "The user's workout plan has been updated.",
					},
				);
			} catch (error) {
				console.error('Error assigning workout plan:', error);
				toast.error('Failed to assign workout plan', {
					description:
						'Please try again or contact support if the issue persists.',
				});
			}
		},
		[Users, workoutPlans],
	);

	const columns = useMemo(
		() => createColumns(workoutPlans, handleWorkoutAssignment),
		[handleWorkoutAssignment, workoutPlans],
	);

	// Calculate stats
	const totalUsers = Users.length;
	const assignedUsers = Users.filter((u) => u.hasActiveWorkoutPlan).length;
	const unassignedUsers = totalUsers - assignedUsers;
	const activeUsers = Users.filter((u) => u.membershipStatus === 'active').length;

	const statusCards = [
		{
			title: 'Total Users',
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
			title: 'Assigned Plans',
			value: assignedUsers,
			icon: Dumbbell,
			gradient: 'yellow',
		},
		{
			title: 'Unassigned Users',
			value: unassignedUsers,
			icon: UserX,
			gradient: 'red',
		},
	] as const;

	useEffect(() => {
		const filtered = Users.filter(
			(user) =>
				user.name.toLowerCase().includes(searchTerm.toLowerCase()) &&
				(genderFilter === 'All' || user.gender === genderFilter) &&
				(assignmentFilter === 'all' ||
					(assignmentFilter === 'assigned' && user.hasActiveWorkoutPlan) ||
					(assignmentFilter === 'unassigned' && !user.hasActiveWorkoutPlan)),
		);
		setFilteredUsers(filtered);
	}, [searchTerm, genderFilter, assignmentFilter, Users]);

	return (
		<div className="container mx-auto p-6 space-y-8">
			<div className="flex flex-col items-center justify-between gap-4 md:flex-row">
				<h1 className="text-3xl font-bold text-gray-900 text-center w-full">
					Workout Plan Assignment
				</h1>
			</div>

			{/* Stats Cards */}
			<div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
				{statusCards.map((card) => (
					<StatusCard key={card.title} {...card} />
				))}
			</div>

			<div className="flex flex-col md:flex-row gap-4">
				<div className="flex items-center space-x-2">
					<Search className="w-5 h-5 text-gray-400" />
					<Input
						placeholder="Search users..."
						value={searchTerm}
						onChange={(e) => setSearchTerm(e.target.value)}
						className="w-full md:w-[300px]"
					/>
				</div>

				<Select
					value={genderFilter}
					onValueChange={(value: 'Male' | 'Female' | 'All') =>
						setGenderFilter(value)
					}
				>
					<SelectTrigger className="w-[180px]">
						<SelectValue placeholder="Filter by gender" />
					</SelectTrigger>
					<SelectContent>
						<SelectItem value="All">All Genders</SelectItem>
						<SelectItem value="Male">Male</SelectItem>
						<SelectItem value="Female">Female</SelectItem>
					</SelectContent>
				</Select>

				<Select
					value={assignmentFilter}
					onValueChange={(value: 'all' | 'assigned' | 'unassigned') =>
						setAssignmentFilter(value)
					}
				>
					<SelectTrigger className="w-[180px]">
						<SelectValue placeholder="Filter by status" />
					</SelectTrigger>
					<SelectContent>
						<SelectItem value="all">All Users</SelectItem>
						<SelectItem value="assigned">With Plan</SelectItem>
						<SelectItem value="unassigned">Without Plan</SelectItem>
					</SelectContent>
				</Select>
			</div>

			{/* Desktop View */}
			<div className="hidden md:block rounded-lg border bg-card">
				<DataTable data={filteredUsers} columns={columns} filterColumn="name" />
			</div>

			{/* Mobile View */}
			<div className="md:hidden">
				<DataCard
					data={filteredUsers}
					renderCard={(user) => (
						<div className="p-4 space-y-3 bg-white rounded-lg border hover:border-primary transition-colors">
							<div className="flex items-center justify-between">
								<h3 className="font-medium text-lg">{user.name}</h3>
								<Badge
									variant="secondary"
									className="bg-gray-100 text-gray-800"
								>
									{user.gender}
								</Badge>
							</div>

							<div className="space-y-3">
								<div className="p-3 bg-gray-50 rounded-lg">
									<p className="text-sm font-medium text-gray-600 mb-2">
										Fitness Goal
									</p>
									<Badge className="bg-purple-100 text-purple-800">
										{user.goal}
									</Badge>
								</div>

								<div className="p-3 bg-gray-50 rounded-lg">
									<p className="text-sm font-medium text-gray-600 mb-2">
										Workout Plan
									</p>
									<Select
										value={user.activeWorkoutPlanId?.toString()}
										onValueChange={(value) =>
											handleWorkoutAssignment(user.id, value)
										}
									>
										<SelectTrigger
											className={`w-full ${
												user.hasActiveWorkoutPlan
													? 'bg-green-100 text-green-800 border-green-200'
													: 'bg-gray-100 text-gray-600 border-gray-200'
											}`}
										>
											<SelectValue
												placeholder={
													user.hasActiveWorkoutPlan
														? user.activeWorkoutPlanName
														: 'No workout assigned'
												}
											/>
										</SelectTrigger>
										<SelectContent>
											{workoutPlans.map((plan) => (
												<SelectItem
													key={plan.id}
													value={plan.id.toString()}
													className={
														plan.id === user.activeWorkoutPlanId
															? 'bg-green-50'
															: ''
													}
												>
													{plan.name}
													{plan.id === user.activeWorkoutPlanId && (
														<span className="ml-2 text-green-600">•</span>
													)}
												</SelectItem>
											))}
										</SelectContent>
									</Select>
								</div>
							</div>
						</div>
					)}
				/>
			</div>
		</div>
	);
}
