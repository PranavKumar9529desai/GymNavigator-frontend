'use client';

import { DataCard } from '@/components/Table/UserCard';
import { DataTable } from '@/components/Table/UsersTable';
import type { ColumnDropdownConfig } from '@/components/Table/table.types';
import { StatusCard } from '@/components/common/StatusCard';
import { Input } from '@/components/ui/input';
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from '@/components/ui/select';
import type { ColumnDef } from '@tanstack/react-table';
import { UserCheck, UserX, Users } from 'lucide-react';
import { useMemo, useState } from 'react';
import { Toaster, toast } from 'react-hot-toast';
import { AssignTrainerToUsers } from './AssignTrainerToUsers';
interface UserTraienerAssignmentProps {
	users: UserType[];
	trainers: TrainerType[];
}

export default function TrainerAssignment({
	users,
	trainers,
}: UserTraienerAssignmentProps) {
	const [assignedTrainers, setAssignedTrainers] = useState<
		Record<number, number>
	>(() => {
		const initialAssignments: Record<number, number> = {};
		for (const user of users) {
			if (user.trainerid) {
				initialAssignments[user.id] = user.trainerid;
			}
		}
		return initialAssignments;
	});

	const handleTrainerAssignment = async (
		rowId: number | string,
		trainerId: string,
	) => {
		const userId = typeof rowId === 'string' ? Number.parseInt(rowId) : rowId;
		try {
			await AssignTrainerToUsers(userId.toString(), trainerId);
			setAssignedTrainers((prev) => ({
				...prev,
				[userId]: Number(trainerId),
			}));
			toast.success('Trainer assigned successfully');
		} catch (error) {
			console.error('Error assigning trainer:', error);
			toast.error('Failed to assign trainer');
		}
	};

	const columns: ColumnDef<UserType>[] = [
		{
			accessorKey: 'name',
			header: 'User Name',
		},
		{
			accessorKey: 'HealthProfile.fullname',
			header: 'Full Name',
		},
		{
			accessorKey: 'HealthProfile.goal',
			header: 'Goal',
			cell: ({ row }) => {
				const goal = row.original.HealthProfile?.goal;
				return <div className="text-gray-600">{goal || 'Not given'}</div>;
			},
		},
		{
			accessorKey: 'trainerid',
			header: 'Assigned Trainer',
			cell: ({ row }) => {
				const currentTrainerId = row.getValue('trainerid') as number | null;
				const hasTrainer =
					currentTrainerId || assignedTrainers[row.original.id];

				return (
					<div
						className={`w-fit rounded-lg ${
							hasTrainer
								? 'bg-green-50/80 border-green-200'
								: 'bg-red-50/80 border-red-200'
						} border`}
					>
						<Select
							value={
								assignedTrainers[row.original.id]?.toString() ||
								currentTrainerId?.toString() ||
								''
							}
							onValueChange={(value) =>
								handleTrainerAssignment(row.original.id, value)
							}
						>
							<SelectTrigger className=" border-none bg-transparent hover:bg-white/50 transition-colors">
								<SelectValue
									placeholder={hasTrainer ? 'Change Trainer' : 'Assign Trainer'}
								/>
							</SelectTrigger>
							<SelectContent>
								{trainers.map((trainer) => (
									<SelectItem key={trainer.id} value={trainer.id.toString()}>
										{trainer.name}
									</SelectItem>
								))}
							</SelectContent>
						</Select>
					</div>
				);
			},
		},
	];

	// Update dropdownConfig to match column cell
	const dropdownConfig: ColumnDropdownConfig = {
		columnId: 'trainerid',
		options: trainers.map((trainer) => ({
			id: trainer.id,
			label: trainer.name,
			value: trainer.id.toString(),
		})),
		onSelect: handleTrainerAssignment,
	};
	const stats = {
		totalUsers: users.length,
		assignedUsers: users.filter(
			(user) => user.trainerid || assignedTrainers[user.id],
		).length,
		unassignedUsers: users.filter(
			(user) => !user.trainerid && !assignedTrainers[user.id],
		).length,
	};

	const statusCards = [
		{
			title: 'Total Users',
			value: stats.totalUsers,
			icon: Users,
			gradient: 'blue',
		},
		{
			title: 'Assigned Users',
			value: stats.assignedUsers,
			icon: UserCheck,
			gradient: 'green',
		},
		{
			title: 'Unassigned Users',
			value: stats.unassignedUsers,
			icon: UserX,
			gradient: 'red',
		},
	] as const;

	// Add new state
	const [searchTerm, setSearchTerm] = useState('');
	const [filterStatus, setFilterStatus] = useState<
		'all' | 'assigned' | 'unassigned'
	>('all');

	// Add filtered users logic
	const filteredUsers = useMemo(() => {
		return users.filter((user) => {
			const matchesSearch =
				user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
				user.HealthProfile?.fullname
					?.toLowerCase()
					.includes(searchTerm.toLowerCase());

			const isAssigned = user.trainerid || assignedTrainers[user.id];

			if (filterStatus === 'assigned') return matchesSearch && isAssigned;
			if (filterStatus === 'unassigned') return matchesSearch && !isAssigned;
			return matchesSearch;
		});
	}, [users, searchTerm, filterStatus, assignedTrainers]);

	// Update return JSX
	return (
		<div className="container mx-auto p-6 space-y-8">
			<h1 className="text-2xl font-bold text-center">
				User-Trainer Assignment
			</h1>

			<Toaster position="top-right" />
			<div className="grid grid-cols-1 md:grid-cols-3 gap-6">
				{statusCards.map((card) => (
					<StatusCard key={card.title} {...card} />
				))}
			</div>

			<div className="flex flex-col md:flex-row gap-4">
				<Input
					placeholder="Search users..."
					value={searchTerm}
					onChange={(e) => setSearchTerm(e.target.value)}
					className="max-w-sm"
				/>
				<Select
					value={filterStatus}
					onValueChange={(value: 'all' | 'assigned' | 'unassigned') =>
						setFilterStatus(value)
					}
				>
					<SelectTrigger className="w-[180px]">
						<SelectValue placeholder="Filter by status" />
					</SelectTrigger>
					<SelectContent>
						<SelectItem value="all">All Users</SelectItem>
						<SelectItem value="assigned">Assigned Users</SelectItem>
						<SelectItem value="unassigned">Unassigned Users</SelectItem>
					</SelectContent>
				</Select>
			</div>

			<div className="hidden md:block">
				<DataTable
					data={filteredUsers}
					columns={columns}
					filterColumn="name"
					dropdownConfig={dropdownConfig}
				/>
			</div>

			<div className="md:hidden">
				<DataCard
					data={users}
					dropdownConfig={dropdownConfig}
					renderCard={(user) => {
						const hasTrainer = user.trainerid || assignedTrainers[user.id];

						return (
							<div className="p-4 space-y-3">
								<h3 className="font-medium">{user.name}</h3>
								<p className="text-sm text-gray-500">
									{user.HealthProfile?.fullname}
								</p>
								<div
									className={`rounded-lg ${
										hasTrainer
											? 'bg-green-50/80 border-green-200'
											: 'bg-red-50/80 border-red-200'
									} border`}
								>
									<Select
										value={
											assignedTrainers[user.id]?.toString() ||
											user.trainerid?.toString()
										}
										onValueChange={(value) =>
											handleTrainerAssignment(user.id, value)
										}
									>
										<SelectTrigger className="w-full border-none bg-transparent hover:bg-white/50 transition-colors">
											<SelectValue
												placeholder={
													hasTrainer ? 'Change Trainer' : 'Assign Trainer'
												}
											/>
										</SelectTrigger>
										<SelectContent>
											{trainers.map((trainer) => (
												<SelectItem
													key={trainer.id}
													value={trainer.id.toString()}
												>
													{trainer.name}
												</SelectItem>
											))}
										</SelectContent>
									</Select>
								</div>
							</div>
						);
					}}
				/>
			</div>
		</div>
	);
}
