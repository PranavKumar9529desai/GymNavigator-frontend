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
import { useToast } from '@/hooks/use-toast';
import type { ColumnDef } from '@tanstack/react-table';
import {
	ArrowUpDown,
	MoreVertical,
	User,
	UserCheck,
	Users,
} from 'lucide-react';
import { redirect, useRouter } from 'next/navigation';
import React, { useTransition } from 'react';
import { updateActivePeriod } from '../_actions/mutations';

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

	const users: UserType[] = initialUsers.map((user) => ({
		...user,
		status: calculateStatus(user.startDate, user.endDate),
	}));

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
		},
		{
			id: 'actions',
			cell: ({ row }) => {
				const user = row.original;

				return (
					<DropdownMenu>
						<DropdownMenuTrigger asChild>
							<Button variant="ghost" className="h-8 w-8 p-0" disabled={isPending}>
								<span className="sr-only">Open menu</span>
								<MoreVertical className="h-4 w-4" />
							</Button>
						</DropdownMenuTrigger>
						<DropdownMenuContent align="end">
							<DropdownMenuItem
								onClick={() => {
									redirect('/dashboard/owner/onboarding/editactiveperiod');
								}}
								disabled={isPending || user.status === 'active'}
							>
								Edit Active Period
							</DropdownMenuItem>
						</DropdownMenuContent>
					</DropdownMenu>
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
			<div className="hidden md:block">
				<DataTable columns={columns} data={users} />
			</div>
			<div className="md:hidden space-y-4">
				{users.map((user) => (
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
