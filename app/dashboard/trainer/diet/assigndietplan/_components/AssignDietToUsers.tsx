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
import {
	ArrowUpDown,
	Search,
	UserCheck,
	Users,
	UtensilsCrossed,
} from 'lucide-react';
import Link from 'next/link';
import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { toast } from 'sonner';
import { attachDietPlanToUser } from '../_actions /AttachDietPlanToUser';
import type { DietPlan } from '../_actions /GetallDiets';
import type { AssignedUser } from '../_actions /GetassignedUserDietInfo';
import { updateAssignedDietPlan } from './updateassigneddiet';
import type { UpdateDietPlanResponse } from './updateassigneddiet';

interface Props {
	users: AssignedUser[];
	dietPlans: DietPlan[];
}

// Add interface for the common result type
interface DietAssignmentResult {
	success: boolean;
	message: string;
	dietPlan?: {
		id: number;
		name: string;
	};
}

const createColumns = (
	dietPlans: DietPlan[],
	handleAssignment: (
		userId: string,
		dietPlanId: string,
		currentPlanId?: number,
	) => Promise<void>,
): ColumnDef<AssignedUser>[] => [
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
	},
	{
		accessorKey: 'email',
		header: 'Email',
	},
	{
		accessorKey: 'diet',
		header: 'Diet Plan Management',
		cell: ({ row }) => {
			const hasDiet = !!row.original.dietPlanId;
			const currentPlan = dietPlans.find(
				(plan) => plan.id === row.original.dietPlanId,
			);

			return (
				<div className="flex flex-col gap-2">
					<Select
						defaultValue={currentPlan ? currentPlan.id.toString() : undefined}
						onValueChange={(value) => {
							handleAssignment(
								row.original.id,
								value,
								row.original.dietPlanId || undefined,
							);
						}}
					>
						<SelectTrigger
							className={`w-[200px] ${
								hasDiet
									? 'bg-green-50 border-green-200 text-green-700'
									: 'bg-red-50 border-red-200'
							}`}
						>
							<SelectValue placeholder="Select a diet plan" />
						</SelectTrigger>
						<SelectContent>
							{dietPlans.map((plan) => (
								<SelectItem
									key={plan.id}
									value={plan.id.toString()}
									className={
										currentPlan?.id === plan.id
											? 'bg-green-50 text-green-700'
											: ''
									}
								>
									{plan.name} ({plan.targetCalories} cal)
								</SelectItem>
							))}
						</SelectContent>
					</Select>
					<Link
						href={`/dashboard/trainer/diet/assigndietplan/assigndietplanwithai?userId=${row.original.id}`}
						className="flex items-center justify-center w-[200px] bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 transition-colors text-sm font-medium"
					>
						Generate Diet Plan with AI
					</Link>
				</div>
			);
		},
	},
];

export default function AssignDietToUsers({ users, dietPlans }: Props) {
	const [searchTerm, setSearchTerm] = useState('');
	const [filteredUsers, setFilteredUsers] = useState(users);

	// Calculate stats
	const totalUsers = users.length;
	const usersWithDiet = users.filter((u) => u.dietPlanId).length;
	const usersWithoutDiet = totalUsers - usersWithDiet;

	const statusCards = [
		{
			title: 'Total Users',
			value: totalUsers,
			icon: Users,
			gradient: 'blue',
		},
		{
			title: 'Users with Diet Plan',
			value: usersWithDiet,
			icon: UserCheck,
			gradient: 'green',
		},
		{
			title: 'Users without Diet Plan',
			value: usersWithoutDiet,
			icon: UtensilsCrossed,
			gradient: 'red',
		},
	] as const;

	const handleDietAssignment = useCallback(
		async (
			userId: string,
			dietPlanId: string,
			currentUserDietPlanId?: number,
		) => {
			try {
				let result: DietAssignmentResult;

				if (currentUserDietPlanId) {
					const updateResult = await updateAssignedDietPlan({
						userDietPlanId: currentUserDietPlanId,
						newDietPlanId: Number.parseInt(dietPlanId),
						userId: Number.parseInt(userId),
					});
					result = {
						success: updateResult.success,
						message: updateResult.message,
						dietPlan: updateResult.dietPlan,
					};
				} else {
					const attachResult = await attachDietPlanToUser(userId, dietPlanId);
					result = {
						success: attachResult.success,
						message: attachResult.message,
						dietPlan: attachResult.dietPlan,
					};
				}

				if (result.success) {
					toast.success(result.message);
					setFilteredUsers((prev) =>
						prev.map((user) =>
							user.id === userId
								? {
										...user,
										dietPlanId: Number.parseInt(dietPlanId),
										dietPlanName: dietPlans.find(
											(p) => p.id === Number.parseInt(dietPlanId),
										)?.name,
										userDietPlanId: result.dietPlan?.id,
									}
								: user,
						),
					);
				} else {
					toast.error(result.message || 'Failed to update diet plan');
				}
			} catch (error) {
				console.error('Error managing diet plan:', error);
				toast.error('Error managing diet plan');
			}
		},
		[dietPlans],
	);

	const columns = useMemo(
		() => createColumns(dietPlans, handleDietAssignment),
		[dietPlans, handleDietAssignment],
	);

	useEffect(() => {
		const filtered = users.filter(
			(user) =>
				user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
				user.email.toLowerCase().includes(searchTerm.toLowerCase()),
		);
		setFilteredUsers(filtered);
	}, [searchTerm, users]);

	return (
		<div className="container mx-auto p-6 space-y-8">
			<h1 className="text-2xl font-bold text-center">Diet Plan Assignment</h1>

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
						<div className="p-4 space-y-4 bg-white rounded-lg shadow">
							<div className="flex justify-between items-start">
								<div>
									<h3 className="font-medium text-lg">{user.name}</h3>
									<p className="text-sm text-gray-500">{user.email}</p>
								</div>
								<div
									className={`px-3 py-1 rounded-full text-sm ${
										user.dietPlanId
											? 'bg-green-100 text-green-800'
											: 'bg-red-100 text-red-800'
									}`}
								>
									{user.dietPlanId ? 'Has Diet Plan' : 'No Diet Plan'}
								</div>
							</div>

							<div className="grid grid-cols-2 gap-2">
								<p className="text-sm">
									<span className="text-gray-600">Gender: </span>
									<span
										className={
											user.HealthProfile?.gender
												? 'text-gray-900'
												: 'text-gray-500'
										}
									>
										{user.HealthProfile?.gender || 'Not Updated'}
									</span>
								</p>
								<p className="text-sm">
									<span className="text-gray-600">Goal: </span>
									<span
										className={
											user.HealthProfile?.goal
												? 'text-gray-900'
												: 'text-gray-500'
										}
									>
										{user.HealthProfile?.goal || 'Not Updated'}
									</span>
								</p>
								<p className="text-sm">
									<span className="text-gray-600">Weight: </span>
									<span
										className={
											user.HealthProfile?.weight
												? 'text-gray-900'
												: 'text-gray-500'
										}
									>
										{user.HealthProfile?.weight
											? `${user.HealthProfile.weight} kg`
											: 'Not Updated'}
									</span>
								</p>
								<p className="text-sm">
									<span className="text-gray-600">Height: </span>
									<span
										className={
											user.HealthProfile?.height
												? 'text-gray-900'
												: 'text-gray-500'
										}
									>
										{user.HealthProfile?.height
											? `${user.HealthProfile.height} cm`
											: 'Not Updated'}
									</span>
								</p>
							</div>

							<div className="space-y-2">
								<Select
									defaultValue={user.dietPlanId?.toString()}
									onValueChange={(value) => {
										handleDietAssignment(
											user.id,
											value,
											user.dietPlanId || undefined,
										);
									}}
								>
									<SelectTrigger
										className={`w-full ${
											user.dietPlanId
												? 'bg-green-50 border-green-200 text-green-700'
												: 'bg-red-50 border-red-200'
										}`}
									>
										<SelectValue placeholder="Select a diet plan" />
									</SelectTrigger>
									<SelectContent>
										{dietPlans.map((plan) => (
											<SelectItem
												key={plan.id}
												value={plan.id.toString()}
												className={
													user.dietPlanId === plan.id
														? 'bg-green-50 text-green-700'
														: ''
												}
											>
												{plan.name} ({plan.targetCalories} cal)
											</SelectItem>
										))}
									</SelectContent>
								</Select>

								<Link
									href={`/dashboard/trainer/diet/assigndietplan/assigndietplanwithai?userId=${user.id}`}
									className="flex items-center justify-center w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 transition-colors text-sm font-medium"
								>
									Generate Diet Plan with AI
								</Link>
							</div>
						</div>
					)}
				/>
			</div>
		</div>
	);
}
