import type { GymUsersApiResponse, GymUser, GymTrainer } from './GymUsersClient';
import { useState } from 'react';
import { DataTable } from '@/components/Table/UsersTable';
import { StatusCard } from '@/components/common/StatusCard';
import { User, UserCheck, Users, Dumbbell, User as UserIcon } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { GymUserMobileCard } from './GymUserMobileCard';
import { MoreActions } from '@/components/MoreAction';
import { useRouter } from 'next/navigation';
import { Input } from '@/components/ui/input';

interface GymUsersViewProps {
  data: GymUsersApiResponse;
  role: 'trainer' | 'client';
  setRole: (role: 'trainer' | 'client') => void;
}

export default function GymUsersView({ data, role, setRole }: GymUsersViewProps) {
  // Local filtering
  let filteredUsers: GymUser[] = [];
  let filteredTrainers: GymTrainer[] = [];
  if (role === 'trainer') {
    filteredUsers = [];
    filteredTrainers = data.trainers;
  } else if (role === 'client') {
    filteredUsers = data.users;
    filteredTrainers = [];
  }

  // Search filter state
  const [search, setSearch] = useState('');

  // Filter by search (name or email, case-insensitive)
  const searchFilter = (item: { name: string; email: string }) => {
    const q = search.trim().toLowerCase();
    return (
      item.name.toLowerCase().includes(q) ||
      item.email.toLowerCase().includes(q)
    );
  };

  const visibleUsers = filteredUsers.filter(searchFilter);
  const visibleTrainers = filteredTrainers.filter(searchFilter);

  // Table columns for users
  const userColumns = [
    {
      accessorKey: 'name',
      header: 'Name',
    },
    {
      accessorKey: 'email',
      header: 'Email',
    },
    {
      accessorKey: 'isverified',
      header: 'Verified',
      cell: ({ row }: any) => row.original.isverified ? 'Yes' : 'No',
    },
    {
      accessorKey: 'userStatus',
      header: 'Status',
    },
    {
      accessorKey: 'createdAt',
      header: 'Joined',
      cell: ({ row }: any) => new Date(row.original.createdAt).toLocaleDateString(),
    },
    {
      id: 'actions',
      header: 'Actions',
      cell: ({ row }: any) => {
        const router = useRouter();
        const user = row.original;
        const actions = [
          {
            id: 'view-profile',
            label: 'View Profile',
            icon: UserIcon,
            onClick: () => router.push(`/dashboard/owner/gym/gymusers/${user.id}`),
            // className: 'text-blue-600 hover:bg-blue-50 hover:text-blue-700',
            tooltip: `View ${user.name}'s profile`,
          },
          // Add more actions here if needed
        ];
        return (
          <MoreActions
            actions={actions}
            label="User Actions"
          />
        );
      },
      enableSorting: false,
      enableHiding: false,
    },
  ];

  // Table columns for trainers
  const trainerColumns = [
    {
      accessorKey: 'name',
      header: 'Name',
    },
    {
      accessorKey: 'email',
      header: 'Email',
    },
    {
      accessorKey: 'isverified',
      header: 'Verified',
      cell: ({ row }: any) => row.original.isverified ? 'Yes' : 'No',
    },
    {
      accessorKey: 'assignedClients',
      header: 'Clients',
    },
    {
      accessorKey: 'createdAt',
      header: 'Joined',
      cell: ({ row }: any) => new Date(row.original.createdAt).toLocaleDateString(),
    },
    {
      id: 'actions',
      header: 'Actions',
      cell: ({ row }: any) => {
        const router = useRouter();
        const trainer = row.original;
        const actions = [
          {
            id: 'view-profile',
            label: 'View Profile',
            icon: UserIcon,
            onClick: () => router.push(`/dashboard/owner/gym/gymusers/${trainer.id}`),
            className: "text-black",
            tooltip: `View ${trainer.name}'s profile`,
          },
          // Add more actions here if needed
        ];
        return (
          <MoreActions
            actions={actions}
            label="Trainer Actions"
          />
        );
      },
      enableSorting: false,
      enableHiding: false,
    },
  ];

  return (
    <div className="p-4">
      {/* Status cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
        <StatusCard title="Total Users" value={data.counts.totalUsers} icon={Users} gradient="blue" />
        <StatusCard title="Trainers" value={data.counts.totalTrainers} icon={Dumbbell} gradient="green" />
        <StatusCard title="Clients" value={data.counts.totalClients} icon={User} gradient="yellow" />
      </div>
      {/* Filter controls */}
      <div className="mb-4 flex flex-col md:flex-row gap-3 md:gap-4 items-stretch">
        {/* Search input on the left */}
        <Input
          value={search}
          onChange={e => setSearch(e.target.value)}
          placeholder={`Search ${role === 'trainer' ? 'trainers' : 'users'} by name or email`}
          className="w-full md:max-w-xs"
          aria-label="Search users or trainers"
        />
        {/* Role filter next to search on desktop, below on mobile */}
        <div className="w-full md:w-auto">
          <Select value={role} onValueChange={v => setRole(v as 'trainer' | 'client')}>
            <SelectTrigger className="w-full md:w-48">
              <SelectValue placeholder="Filter by type" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="trainer">Trainers</SelectItem>
              <SelectItem value="client">Clients</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>
      {/* Table view for desktop, card view for mobile */}
      <div className="hidden md:block">
        {role === 'trainer' ? (
          <DataTable columns={trainerColumns} data={visibleTrainers} />
        ) : (
          <DataTable columns={userColumns} data={visibleUsers} />
        )}
      </div>
      <div className="md:hidden space-y-4">
        {role === 'trainer'
          ? visibleTrainers.map(trainer => (
              <GymUserMobileCard key={trainer.id} user={trainer} type="trainer" />
            ))
          : visibleUsers.map(user => (
              <GymUserMobileCard key={user.id} user={user} type="user" />
            ))}
      </div>
    </div>
  );
} 