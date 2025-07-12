'use client';
import { DataCard } from '@/components/Table/UserCard';
import { DataTable } from '@/components/Table/UsersTable';
import { StatusCard } from '@/components/common/StatusCard';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { MoreActions } from '@/components/MoreAction';
import type { ColumnDef } from '@tanstack/react-table';
import {
	ArrowUpDown,
	Search,
	UserCheck,
	Users,
	UtensilsCrossed,
	ChefHat,
	UserX,
	Sparkles,
} from 'lucide-react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import React, { useState, useEffect, useMemo } from 'react';
import type { DietPlan } from '../_actions /GetallDiets';
import type { AssignedUser } from '../_actions /GetassignedUserDietInfo';

interface Props {
	users: AssignedUser[];
	dietPlans: DietPlan[];
}

// Helper function to check if health profile is complete
const isHealthProfileComplete = (healthProfile: unknown) => {
	if (!healthProfile) return false;
	
	const profile = healthProfile as {
		gender?: string;
		goal?: string;
		weight?: number;
		height?: number;
		dietaryPreference?: string;
	};
	
	const requiredFields = [
		'gender', 'goal', 'weight', 'height', 'dietaryPreference'
	];
	
	return requiredFields.every(field => {
		const value = profile[field as keyof typeof profile];
		return value !== null && 
			value !== undefined && 
			value !== '' &&
			value !== 0;
	});
};

const createColumns = (router: any): ColumnDef<AssignedUser>[] => [
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
		id: 'healthProfile',
		header: 'Health Profile',
		cell: ({ row }) => {
			const user = row.original;
			const isComplete = isHealthProfileComplete(user.HealthProfile);
			
			return (
				<Badge 
					variant="outline"
					className={isComplete ? "bg-green-50 text-green-700 border-green-200 hover:bg-green-100" : "bg-red-50 text-red-700 border-red-200 hover:bg-red-100"}
				>
					{isComplete ? 'Complete' : 'Incomplete'}
				</Badge>
			);
		},
	},
	{
		id: 'assignedDiet',
		header: 'Assigned Diet Plan',
		cell: ({ row }) => {
			const user = row.original;
			const dietPlanName = user.dietPlanName;
			
			return (
				<span className={`text-sm ${dietPlanName ? 'text-slate-800 font-medium' : 'text-slate-500'}`}>
					{dietPlanName || '-'}
				</span>
			);
		},
	},
	{
		id: 'actions',
		header: 'Actions',
		cell: ({ row }) => {
			const user = row.original;
			const hasDiet = !!user.dietPlanId;
			const isProfileComplete = isHealthProfileComplete(user.HealthProfile);
			
			const actions = [
				{
					id: 'assign-diet',
					label: hasDiet ? 'Update Diet Plan' : 'Assign Diet Plan',
					icon: ChefHat,
					onClick: () => {
						if (isProfileComplete) {
							router.push(`/dashboard/trainer/diet/assigneddiettouser?userId=${user.id}`);
						}
					},
					disabled: !isProfileComplete,
					className: !isProfileComplete 
						? 'text-gray-400 cursor-not-allowed' 
						: hasDiet 
							? 'text-amber-600 hover:bg-amber-50 hover:text-amber-700' 
							: 'text-blue-600 hover:bg-blue-50 hover:text-blue-700',
					tooltip: !isProfileComplete 
						? 'Health profile must be completed before assigning diet plans' 
						: hasDiet 
							? 'Modify the currently assigned diet plan for this user' 
							: 'Select and assign a diet plan from available options',
				},
				{
					id: 'generate-ai',
					label: 'Generate with AI',
					icon: Sparkles,
					onClick: () => {
						if (isProfileComplete) {
							router.push(`/dashboard/trainer/diet/assigndietplanwithai?userId=${user.id}`);
						}
					},
					disabled: !isProfileComplete,
					className: !isProfileComplete 
						? 'text-gray-400 cursor-not-allowed' 
						: 'text-purple-600 hover:bg-purple-50 hover:text-purple-700',
					tooltip: !isProfileComplete 
						? 'Health profile must be completed before generating AI diet plans' 
						: 'Create a personalized diet plan using AI based on user\'s health profile',
				},
			];

			return (
				<MoreActions 
					actions={actions} 
					label="Diet Actions"
				/>
			);
		},
	},
];

export default function DietAssignedUsers({ users, dietPlans }: Props) {
	const router = useRouter();
	const [searchTerm, setSearchTerm] = useState('');
	const [filteredUsers, setFilteredUsers] = useState(users);

	// Calculate stats
	const totalUsers = users.length;
	const usersWithDiet = users.filter((u) => u.dietPlanId).length;
	const usersWithoutDiet = totalUsers - usersWithDiet;
	const usersWithIncompleteProfile = users.filter((u) => !isHealthProfileComplete(u.HealthProfile)).length;

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
		{
			title: 'Incomplete Profiles',
			value: usersWithIncompleteProfile,
			icon: UserX,
			gradient: 'yellow',
		},
	] as const;

	const columns = useMemo(
		() => createColumns(router),
		[router],
	);

	useEffect(() => {
		const filtered = users.filter(
			(user) =>
				user.name.toLowerCase().includes(searchTerm.toLowerCase()),
		);
		setFilteredUsers(filtered);
	}, [searchTerm, users]);

	return (
		<div className="container mx-auto p-6 space-y-8">
			<h1 className="text-2xl font-bold text-center">Diet Plan Assignment</h1>

			{/* Stats Cards */}
			<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
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
					renderCard={(user) => {
						const isProfileComplete = isHealthProfileComplete(user.HealthProfile);
						const hasDiet = !!user.dietPlanId;
						
						const actions = [
							{
								id: 'assign-diet',
								label: hasDiet ? 'Update Diet Plan' : 'Assign Diet Plan',
								icon: ChefHat,
								onClick: () => {
									if (isProfileComplete) {
										router.push(`/dashboard/trainer/diet/assigneddiettouser?userId=${user.id}`);
									}
								},
								disabled: !isProfileComplete,
								className: !isProfileComplete 
									? 'text-gray-400 cursor-not-allowed' 
									: hasDiet 
										? 'text-amber-600 hover:bg-amber-50 hover:text-amber-700' 
										: 'text-blue-600 hover:bg-blue-50 hover:text-blue-700',
								tooltip: !isProfileComplete 
									? 'Health profile must be completed before assigning diet plans' 
									: hasDiet 
										? 'Modify the currently assigned diet plan for this user' 
										: 'Select and assign a diet plan from available options',
							},
							{
								id: 'generate-ai',
								label: 'Generate with AI',
								icon: Sparkles,
								onClick: () => {
									if (isProfileComplete) {
										router.push(`/dashboard/trainer/diet/assigndietplanwithai?userId=${user.id}`);
									}
								},
								disabled: !isProfileComplete,
								className: !isProfileComplete 
									? 'text-gray-400 cursor-not-allowed' 
									: 'text-purple-600 hover:bg-purple-50 hover:text-purple-700',
								tooltip: !isProfileComplete 
									? 'Health profile must be completed before generating AI diet plans' 
									: 'Create a personalized diet plan using AI based on user\'s health profile',
							},
						];
						
						return (
							<div className="p-4 space-y-3 bg-white rounded-lg border border-slate-100 hover:border-blue-200 transition-colors shadow-sm hover:shadow-md">
								{/* Header with name and actions */}
								<div className="flex justify-between items-start">
									<h3 className="font-medium text-lg text-slate-800">{user.name}</h3>
									<MoreActions 
										actions={actions} 
										label="Diet Actions"
									/>
								</div>

								{/* Health Profile Status */}
								<div className="flex items-center gap-2">
									<span className="text-sm text-slate-600 font-medium">Health Profile:</span>
									<Badge 
										variant="outline"
										className={isProfileComplete ? "bg-green-50 text-green-700 border-green-200 hover:bg-green-100" : "bg-red-50 text-red-700 border-red-200 hover:bg-red-100"}
									>
										{isProfileComplete ? 'Complete' : 'Incomplete'}
									</Badge>
								</div>

								{/* Assigned Diet Plan */}
								<div className="flex items-center gap-2">
									<span className="text-sm text-slate-600 font-medium">Assigned Diet Plan:</span>
									<span className={`text-sm ${user.dietPlanName ? 'text-slate-800 font-medium' : 'text-slate-500'}`}>
										{user.dietPlanName || '-'}
									</span>
								</div>
							</div>
						);
					}}
				/>
			</div>
		</div>
	);
}
