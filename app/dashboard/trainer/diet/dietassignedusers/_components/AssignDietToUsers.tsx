'use client';
import { DataCard } from '@/components/Table/UserCard';
import { DataTable } from '@/components/Table/UsersTable';
import { StatusCard } from '@/components/common/StatusCard';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { MoreActions } from '@/components/MoreAction';
import type { ColumnDef } from '@tanstack/react-table';
import {
	ArrowUpDown,
	Search,
	UserCheck,
	Users,
	UtensilsCrossed,
	ChefHat,
} from 'lucide-react';
import Link from 'next/link';
import React, { useState, useEffect, useMemo } from 'react';
import type { DietPlan } from '../_actions /GetallDiets';
import type { AssignedUser } from '../_actions /GetassignedUserDietInfo';

interface Props {
	users: AssignedUser[];
	dietPlans: DietPlan[];
}

const createColumns = (): ColumnDef<AssignedUser>[] => [
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
		id: 'actions',
		header: 'Actions',
		cell: ({ row }) => {
			const user = row.original;
			const hasDiet = !!user.dietPlanId;
			
			const actions = [
				{
					id: 'assign-diet',
					label: hasDiet ? 'Update Diet Plan' : 'Assign Diet Plan',
					icon: ChefHat,
					onClick: () => {
						console.log('Assign diet clicked for user:', user.name);
					},
					className: hasDiet 
						? 'text-amber-600 hover:bg-amber-50 hover:text-amber-700' 
						: 'text-blue-600 hover:bg-blue-50 hover:text-blue-700',
					tooltip: hasDiet 
						? 'Update existing diet plan' 
						: 'Assign a new diet plan',
				},
			];

			return (
				<MoreActions 
					actions={actions} 
					label="Diet Actions"
					statusBadge={hasDiet ? {
						text: 'Has Diet',
						className: 'text-green-600'
					} : {
						text: 'No Diet',
						className: 'text-red-600'
					}}
				/>
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

	const columns = useMemo(
		() => createColumns(),
		[],
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
						<div className="p-4 space-y-4 bg-white rounded-lg border border-slate-100 hover:border-blue-200 transition-colors shadow-sm hover:shadow-md">
							<div className="flex justify-between items-start">
								<div>
									<h3 className="font-medium text-lg text-slate-800">{user.name}</h3>
									<p className="text-sm text-slate-600">{user.email}</p>
								</div>
								<div
									className={`px-3 py-1.5 rounded-full text-xs font-medium flex items-center gap-1.5 ${
										user.dietPlanId
											? 'bg-green-50 text-green-700 border border-green-200'
											: 'bg-red-50 text-red-700 border border-red-200'
									}`}
								>
									<div className={`w-2 h-2 rounded-full ${
										user.dietPlanId ? 'bg-green-500' : 'bg-red-500'
									}`} />
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
								<Button
									variant="outline"
									onClick={() => {
										console.log('Assign diet clicked for user:', user.name);
									}}
									className={`w-full flex items-center gap-2 py-3 transition-all duration-200 ${
										user.dietPlanId
											? 'border-amber-200 text-amber-700 bg-amber-50/50 hover:bg-amber-100 hover:border-amber-300'
											: 'border-blue-200 text-blue-700 bg-blue-50/50 hover:bg-blue-100 hover:border-blue-300'
									}`}
								>
									<ChefHat className="h-4 w-4" />
									<span className="font-medium">
										{user.dietPlanId ? 'Update Diet Plan' : 'Assign Diet Plan'}
									</span>
								</Button>

								<Link
									href={`/dashboard/trainer/diet/assigndietplan/assigndietplanwithai?userId=${user.id}`}
									className="flex items-center justify-center gap-2 w-full bg-gradient-to-r from-blue-600 to-indigo-600 text-white py-3 px-4 rounded-md hover:from-blue-700 hover:to-indigo-700 transition-all duration-200 text-sm font-medium shadow-sm hover:shadow-md"
								>
									<div className="w-4 h-4 rounded-full bg-white/20 flex items-center justify-center">
										<span className="text-xs">✨</span>
									</div>
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
