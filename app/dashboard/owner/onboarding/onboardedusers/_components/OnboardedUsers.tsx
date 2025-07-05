'use client';

import { DataTable } from '@/components/Table/UsersTable';
import { StatusCard } from '@/components/common/StatusCard';
import { Button } from '@/components/ui/button';
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { UserMobileCard } from './UserMobileCard';
import { UserActions } from './UserActions';
import { useToast } from '@/hooks/use-toast';
import type { ColumnDef } from '@tanstack/react-table';
import {
	ArrowUpDown,
	Search,
	User,
	UserCheck,
	Users,
} from 'lucide-react';
import { useRouter } from 'next/navigation';
import { statusColorClasses, statusLabels } from '@/lib/constants/status-variants';
import React, { useEffect, useState, useTransition } from 'react';
import { updateActivePeriod } from '../_actions/mutations';
import { Input } from '@/components/ui/input';
import { 
	Select, 
	SelectContent, 
	SelectItem, 
	SelectTrigger, 
	SelectValue 
} from '@/components/ui/select';

export interface UserType {
	id: number;
	name: string;
	startDate: Date | null;
	endDate: Date | null;
	status: 'active' | 'pending' | 'inactive';
}

interface OnboardedUsersProps {
	initialUsers: {
		id: number;
		name: string;
		startDate: Date | null;
		endDate: Date | null;
	}[];
}

const calculateStatus = (
	startDate: Date | null,
	endDate: Date | null,
): UserType['status'] => {
	if (!startDate || !endDate) {
		return 'pending';
	}
	const now = new Date();
	if (now >= new Date(startDate) && now <= new Date(endDate)) {
		return 'active';
	}
	return 'inactive';
};

const formatDate = (date: Date | null): string => {
	if (!date) return 'N/A';
	return new Date(date).toLocaleDateString('en-GB', {
		day: '2-digit',
		month: '2-digit',
		year: 'numeric',
	});
};

export default function OnboardedUsers({ initialUsers }: OnboardedUsersProps) {
	const router = useRouter();
	const { toast } = useToast();
	const [isPending, startTransition] = useTransition();
	const [nameFilter, setNameFilter] = useState('');
	const [statusFilter, setStatusFilter] = useState<UserType['status'] | 'all'>('all');

	const users: UserType[] = initialUsers.map((user) => ({
		...user,
		status: calculateStatus(user.startDate, user.endDate),
	}));

	// Apply filters to users
	const filteredUsers = users.filter((user) => {
		const nameMatch = user.name.toLowerCase().includes(nameFilter.toLowerCase());
		const statusMatch = statusFilter === 'all' || user.status === statusFilter;
		return nameMatch && statusMatch;
	});

	const handleUpdateActivePeriod = (userId: number) => {
		startTransition(async () => {
			try {
				const result = await updateActivePeriod({
					userId,
					startDate: new Date().toISOString(),
					endDate: new Date(
						new Date().setFullYear(new Date().getFullYear() + 1),
					).toISOString(),
				});

				if (result.success) {
					toast({
						title: 'User Activated',
						description: 'The user has been successfully activated for one year.',
					});
					router.refresh();
				} else {
					toast({
						variant: 'destructive',
						title: 'Activation Failed',
						description: result.error,
					});
				}
			} catch (error: unknown) {
				toast({
					variant: 'destructive',
					title: 'Activation Failed',
					description: error instanceof Error ? error.message : 'An unexpected error occurred',
				});
			}
		});
	};

	const columns: ColumnDef<UserType>[] = [
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
			accessorKey: 'startDate',
			header: 'Start Date',
			cell: ({ row }) => formatDate(row.original.startDate),
		},
		{
			accessorKey: 'endDate',
			header: 'End Date',
			cell: ({ row }) => formatDate(row.original.endDate),
		},
		{
			accessorKey: 'status',
			header: 'Status',
			cell: ({ row }) => {
				const status = row.original.status;
				const { bg, text } = statusColorClasses[status] || { bg: 'bg-gray-100', text: 'text-gray-800' };
				const label = statusLabels[status] || status;
				return (
					<span
						className={`px-2 py-1 rounded text-xs font-semibold ${bg} ${text}`}
						aria-label={label}
					>
						{label}
					</span>
				);
			},
		},
		{
			id: 'actions',
			cell: ({ row }) => {
				const user = row.original;

				return (
					<UserActions 
						user={user}
						isPending={isPending}
						type='horizontal'
						onActivate={handleUpdateActivePeriod}
					/>
				);
			},
		},
	];

	const activeUsers = users.filter((user) => user.status === 'active').length;
	const pendingUsers = users.filter((user) => user.status === 'pending').length;

	return (
		<div className="p-4">
			<div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
				<StatusCard
					title="Total Users"
					value={users.length}
					icon={Users}
					gradient="blue"
				/>
				<StatusCard
					title="Active Users"
					value={activeUsers}
					icon={UserCheck}
					gradient="green"
				/>
				<StatusCard
					title="Pending Activation"
					value={pendingUsers}
					icon={User}
					gradient="yellow"
				/>
			</div>
			<div className="mb-4">
				<div className="grid grid-cols-1 gap-4 md:grid-cols-3">
					<div className="relative">
						<Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" aria-label="Search" />
						<Input
							placeholder="Search by name..."
							value={nameFilter}
							onChange={(e) => setNameFilter(e.target.value)}
							className="pl-10"
						/>
					</div>
					<Select
						value={statusFilter}
						onValueChange={(value) => setStatusFilter(value as UserType['status'] | 'all')}
					>
						<SelectTrigger>
							<SelectValue placeholder="Filter by status" />
						</SelectTrigger>
						<SelectContent>
							<SelectItem value="all">All</SelectItem>
							<SelectItem value="active">Active</SelectItem>
							<SelectItem value="pending">Pending</SelectItem>
							<SelectItem value="inactive">Inactive</SelectItem>
						</SelectContent>
					</Select>
				</div>
			</div>
			<div className="hidden md:block">
				<DataTable columns={columns} data={filteredUsers} />
			</div>
			<div className="md:hidden space-y-4">
				{filteredUsers.map((user) => (
					<UserMobileCard 
						key={user.id}
						user={user}
						isPending={isPending}
						onActivate={handleUpdateActivePeriod}
					/>
				))}
			</div>
		</div>
	);
}
