'use client';
import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { ColumnDef } from '@tanstack/react-table';
import { ArrowUpDown, LucideIcon } from 'lucide-react';
import { DataTable } from '@/components/Table/UsersTable';
import { DataCard } from '@/components/Table/UserCard';
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
import { WorkoutPlan } from './Getworkout';
import * as LucideIcons from 'lucide-react';
import { attachWorkoutPlanToUser } from './AttachWorkoutplantoUser';
import { toast } from 'sonner';

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
  statusCards: StatusCardProps[];
  workoutPlans: WorkoutPlan[];
}

// Update the Select component in the columns definition to use workoutPlans
const createColumns = (
  workoutPlans: WorkoutPlan[],
  handleWorkoutAssignment: (
    userId: string,
    workoutPlanId: string
  ) => Promise<void> // Changed userId to string
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
    accessorKey: 'gender',
    header: 'Gender',
  },
  {
    accessorKey: 'goal',
    header: 'Fitness Goal',
  },
  {
    accessorKey: 'assignedWorkout',
    header: 'Assign Workout',
    cell: ({ row }) => {
      const user = row.original;
      console.log('Rendering workout for user:', user); // Debug log

      return (
        <div className="flex flex-col gap-1">
          <Select
            value={user.activeWorkoutPlanId?.toString() || undefined}
            onValueChange={(value) => handleWorkoutAssignment(user.id, value)}
          >
            <SelectTrigger
              className={`w-[200px] ${
                user.hasActiveWorkoutPlan
                  ? 'bg-green-50 border-green-200 text-green-700'
                  : 'bg-red-50 border-red-200 text-red-700'
              }`}
            >
              <SelectValue
                placeholder={
                  user.hasActiveWorkoutPlan
                    ? `Current: ${user.activeWorkoutPlanName}`
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
          {user.hasActiveWorkoutPlan && (
            <p className="text-xs text-green-600">
              Active Plan: {user.activeWorkoutPlanName}
            </p>
          )}
        </div>
      );
    },
  },
];

export default function UserWorkoutAssignment({
  Users,
  statusCards,
  workoutPlans,
}: UserWorkoutAssignmentProps) {
  const [searchTerm, setSearchTerm] = useState('');
  const [genderFilter, setGenderFilter] = useState<'Male' | 'Female' | 'All'>(
    'All'
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
          (u) => u.id === userId
        )?.activeWorkoutPlanName;
        const newPlan = workoutPlans.find(
          (p) => p.id === parseInt(workoutPlanId)
        );

        await attachWorkoutPlanToUser(userId, workoutPlanId);

        // Update local state
        setFilteredUsers((current) =>
          current.map((user) =>
            user.id === userId
              ? {
                  ...user,
                  activeWorkoutPlanId: parseInt(workoutPlanId),
                  activeWorkoutPlanName: newPlan?.name || '',
                  hasActiveWorkoutPlan: true,
                }
              : user
          )
        );

        toast.success(
          previousPlan
            ? `Workout plan updated from "${previousPlan}" to "${newPlan?.name}"`
            : `Workout plan "${newPlan?.name}" assigned successfully`,
          {
            description: "The user's workout plan has been updated.",
          }
        );
      } catch (error) {
        console.error('Error assigning workout plan:', error);
        toast.error('Failed to assign workout plan', {
          description:
            'Please try again or contact support if the issue persists.',
        });
      }
    },
    [Users, workoutPlans]
  );

  const columns = useMemo(
    () => createColumns(workoutPlans, handleWorkoutAssignment),
    [handleWorkoutAssignment, workoutPlans]
  );

  // Helper function to get icon component
  const getIcon = (iconName: string): LucideIcon => {
    const Icon = LucideIcons[
      iconName as keyof typeof LucideIcons
    ] as LucideIcon;
    return Icon || (LucideIcons.HelpCircle as LucideIcon);
  };

  // Calculate stats

  useEffect(() => {
    const filtered = Users.filter(
      (user) =>
        user.name.toLowerCase().includes(searchTerm.toLowerCase()) &&
        (genderFilter === 'All' || user.gender === genderFilter) &&
        (assignmentFilter === 'all' ||
          (assignmentFilter === 'assigned' && user.hasActiveWorkoutPlan) ||
          (assignmentFilter === 'unassigned' && !user.hasActiveWorkoutPlan))
    );
    setFilteredUsers(filtered);
  }, [searchTerm, genderFilter, assignmentFilter, Users]);

  return (
    <div className="container mx-auto p-6 space-y-8">
      <h1 className="text-2xl font-bold text-center">Workout Assignment</h1>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        {statusCards.map((card) => {
          const IconComponent = getIcon(card.iconName);
          return (
            <StatusCard
              key={card.title}
              title={card.title}
              value={card.value}
              icon={IconComponent}
              gradient={card.gradient as 'blue' | 'green' | 'red'}
            />
          );
        })}
      </div>

      <div className="flex flex-col md:flex-row gap-4 mb-6">
        <Input
          placeholder="Search users..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="max-w-sm"
        />
        <Select
          value={genderFilter}
          onValueChange={(value: 'Male' | 'Female' | 'All') =>
            setGenderFilter(value)
          }
        >
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Select gender" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="All">All</SelectItem>
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
            <SelectValue placeholder="Filter by assignment" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Users</SelectItem>
            <SelectItem value="assigned">Assigned</SelectItem>
            <SelectItem value="unassigned">Unassigned</SelectItem>
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
          renderCard={(user) => {
            const hasWorkout = user.hasActiveWorkoutPlan;

            return (
              <div className="p-4 space-y-2">
                <h3 className="font-medium">{user.name}</h3>
                <p className="text-sm text-gray-500">Gender: {user.gender}</p>
                <p className="text-sm text-gray-500">Goal: {user.goal}</p>
                <Select
                  value={user.activeWorkoutPlanId?.toString()}
                  onValueChange={(value) =>
                    handleWorkoutAssignment(user.id, value)
                  }
                >
                  <SelectTrigger
                    className={`w-full ${
                      hasWorkout
                        ? 'bg-green-50 border-green-200 text-green-700'
                        : 'bg-red-50 border-red-200 text-red-700'
                    }`}
                  >
                    <SelectValue
                      placeholder={
                        hasWorkout
                          ? `Current: ${user.activeWorkoutPlanName}`
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
                {hasWorkout && (
                  <p className="text-xs text-green-600">
                    Active Plan: {user.activeWorkoutPlanName}
                  </p>
                )}
              </div>
            );
          }}
        />
      </div>
    </div>
  );
}
