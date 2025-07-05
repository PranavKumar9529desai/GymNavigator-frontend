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
import { cn } from '@/lib/utils';
import type { ColumnDef } from '@tanstack/react-table';
import { m } from 'framer-motion';
import { UserCheck, UserX, Users } from 'lucide-react';
import { useMemo, useState } from 'react';
import { Toaster, toast } from 'react-hot-toast';
import { AssignTrainerToUsers } from './AssignTrainerToUsers';
interface UserTrainerAssignmentProps {
	users: UserType[];
	trainers: TrainerType[];
}

export default function TrainerAssignment({
	users,
	trainers,
}: UserTrainerAssignmentProps) {
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

	const [loadingAssignments, setLoadingAssignments] = useState<Record<string, boolean>>({});

	const handleTrainerAssignment = async (
		rowId: number | string,
		trainerId: string,
	) => {
		const userId = typeof rowId === 'string' ? Number.parseInt(rowId) : rowId;
		const assignmentKey = `${userId}-${trainerId}`;
		
		// Don't allow multiple simultaneous assignments for the same user
		if (loadingAssignments[assignmentKey]) return;
		
		try {
			setLoadingAssignments(prev => ({ ...prev, [assignmentKey]: true }));
			await AssignTrainerToUsers(userId.toString(), trainerId);
			
			// Update state with new assignment
			setAssignedTrainers((prev) => ({
				...prev,
				[userId]: Number(trainerId),
			}));
			
			toast.success('Trainer assigned successfully');
		} catch (error: unknown) {
			console.error('Error assigning trainer:', error);
			const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred';
			toast.error(`Assignment failed: ${errorMessage}`);
		} finally {
			setLoadingAssignments(prev => {
				const newState = { ...prev };
				delete newState[assignmentKey];
				return newState;
			});
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
				const userId = row.original.id;
				const currentTrainerId = row.getValue('trainerid') as number | null;
				const assignedTrainerId = assignedTrainers[userId];
				const hasTrainer = currentTrainerId || assignedTrainerId;
				
				// Determine if this cell is in loading state
				const isLoading = Object.keys(loadingAssignments).some(key => 
					key.startsWith(`${userId}-`)
				);
				
				const selectedValue = assignedTrainerId?.toString() || 
					currentTrainerId?.toString() || 
					'';

				return (
					<div
						className={`w-fit rounded-lg ${
							hasTrainer
								? 'bg-green-50/80 border-green-200'
								: 'bg-red-50/80 border-red-200'
						} border transition-colors duration-200`}
					>
						<Select
							value={selectedValue}
							onValueChange={(value) =>
								handleTrainerAssignment(userId, value)
							}
							disabled={isLoading}
						>
							<SelectTrigger 
								className="border-none bg-transparent hover:bg-white/50 transition-colors"
								aria-label={hasTrainer ? "Change trainer" : "Assign trainer"}
							>
								{isLoading ? (
									<div className="flex items-center">
										<svg className="animate-spin -ml-1 mr-3 h-4 w-4 text-primary" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
											<circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
											<path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
										</svg>
										<span>Assigning...</span>
									</div>
								) : (
									<SelectValue
										placeholder={hasTrainer ? 'Change Trainer' : 'Assign Trainer'}
									/>
								)}
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

	// Animation variants
	const containerVariants = {
		hidden: { opacity: 0 },
		show: {
			opacity: 1,
			transition: {
				staggerChildren: 0.1
			}
		}
	};

	const itemVariants = {
		hidden: { opacity: 0, y: 20 },
		show: { opacity: 1, y: 0 }
	};

	// Handle no trainers scenario
	if (trainers.length === 0) {
		return (
			<m.div
				className="container mx-auto p-6 space-y-8 text-center"
				initial="hidden"
				animate="show"
				variants={containerVariants}
			>
				<m.h1 className="text-2xl font-bold" variants={itemVariants}>
					User-Trainer Assignment
				</m.h1>
				
				<m.div 
					className="py-10 text-center space-y-4" 
					variants={itemVariants}
				>
					<Users className="h-16 w-16 mx-auto text-muted-foreground/60" />
					<h2 className="text-xl font-medium">No Trainers Available</h2>
					<p className="text-muted-foreground max-w-md mx-auto">
						You need to add trainers to your gym before you can assign them to users.
					</p>
				</m.div>
			</m.div>
		);
	}

	// Handle no users scenario
	if (users.length === 0) {
		return (
			<m.div
				className="container mx-auto p-6 space-y-8 text-center"
				initial="hidden"
				animate="show"
				variants={containerVariants}
			>
				<m.h1 className="text-2xl font-bold" variants={itemVariants}>
					User-Trainer Assignment
				</m.h1>
				
				<m.div 
					className="py-10 text-center space-y-4" 
					variants={itemVariants}
				>
					<UserX className="h-16 w-16 mx-auto text-muted-foreground/60" />
					<h2 className="text-xl font-medium">No Users Available</h2>
					<p className="text-muted-foreground max-w-md mx-auto">
						There are no users in your gym yet. Users will appear here once they register.
					</p>
				</m.div>
			</m.div>
		);
	}

	// Return JSX with animations
	return (
		<m.div
			className="container mx-auto p-6 space-y-8"
			initial="hidden"
			animate="show"
			variants={containerVariants}
		>
			<m.h1 
				className="text-2xl font-bold text-center"
				variants={itemVariants}
			>
				User-Trainer Assignment
			</m.h1>

			<Toaster position="top-right" />
			<m.div 
				className="grid grid-cols-1 md:grid-cols-3 gap-6"
				variants={itemVariants}
			>
				{statusCards.map((card, index) => (
					<m.div key={card.title} variants={itemVariants} custom={index}>
						<StatusCard {...card} />
					</m.div>
				))}
			</m.div>

			<m.div 
				className="flex flex-col md:flex-row gap-4 items-start"
				variants={itemVariants}
			>
				<Input
					placeholder="Search users by name..."
					value={searchTerm}
					onChange={(e) => setSearchTerm(e.target.value)}
					className="max-w-sm w-full"
					aria-label="Search users"
				/>
				<Select
					value={filterStatus}
					onValueChange={(value: 'all' | 'assigned' | 'unassigned') =>
						setFilterStatus(value)
					}
				>
					<SelectTrigger className="w-[180px]" aria-label="Filter users by assignment status">
						<SelectValue placeholder="Filter by status" />
					</SelectTrigger>
					<SelectContent>
						<SelectItem value="all">All Users</SelectItem>
						<SelectItem value="assigned">Assigned Users</SelectItem>
						<SelectItem value="unassigned">Unassigned Users</SelectItem>
					</SelectContent>
				</Select>
				<div className="text-sm text-muted-foreground ml-auto">
					Showing {filteredUsers.length} of {users.length} users
				</div>
			</m.div>

			<m.div 
				className="hidden md:block" 
				variants={itemVariants}
			>
				<DataTable
					data={filteredUsers}
					columns={columns}
					filterColumn="name"
					dropdownConfig={dropdownConfig}
				/>
			</m.div>

			<m.div 
				className="md:hidden"
				variants={itemVariants}
			>
				{filteredUsers.length === 0 ? (
					<div className="py-8 text-center text-muted-foreground">
						No users match your search criteria
					</div>
				) : (
					<DataCard
						data={filteredUsers}
						dropdownConfig={dropdownConfig}
						renderCard={(user) => {
							const userId = user.id;
							const hasTrainer = user.trainerid || assignedTrainers[userId];
							const isLoading = Object.keys(loadingAssignments).some(key => 
								key.startsWith(`${userId}-`)
							);
							
							return (
								<div className="p-4 space-y-3">
									<h3 className="font-medium">{user.name}</h3>
									<p className="text-sm text-muted-foreground">
										{user.HealthProfile?.fullname || "No full name provided"}
									</p>
									{user.HealthProfile?.goal && (
										<p className="text-xs text-muted-foreground bg-muted px-2 py-1 rounded inline-block">
											Goal: {user.HealthProfile.goal}
										</p>
									)}
									<div
										className={cn(
											"rounded-lg border transition-colors duration-200",
											hasTrainer
												? "bg-green-50/80 border-green-200"
												: "bg-red-50/80 border-red-200"
										)}
									>
										<Select
											value={
												assignedTrainers[userId]?.toString() ||
												user.trainerid?.toString() ||
												''
											}
											onValueChange={(value) =>
												handleTrainerAssignment(userId, value)
											}
											disabled={isLoading}
										>
											<SelectTrigger 
												className="w-full border-none bg-transparent hover:bg-white/50 transition-colors"
												aria-label={hasTrainer ? "Change trainer" : "Assign trainer"}
											>
												{isLoading ? (
													<div className="flex items-center">
														<svg className="animate-spin -ml-1 mr-3 h-4 w-4 text-primary" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
															<circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
															<path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
														</svg>
														<span>Assigning...</span>
													</div>
												) : (
													<SelectValue
														placeholder={hasTrainer ? 'Change Trainer' : 'Assign Trainer'}
													/>
												)}
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
				)}
			</m.div>
		</m.div>
	);
}
