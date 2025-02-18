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
import { ArrowUpDown, Clock, UserCheck, Users } from 'lucide-react';
import React, { useState, useEffect } from 'react';

interface TrainerType {
  id: number;
  name: string;
  assignedClients: number;
  shift: 'Morning' | 'Evening';
  image: string;
}

interface ViewTrainersListProps {
  Trainers: TrainerType[];
}

const columns: ColumnDef<TrainerType>[] = [
  {
    accessorKey: 'name',
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
        >
          Trainer Name
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      );
    },
  },
  {
    accessorKey: 'assignedClients',
    header: 'Assigned Clients',
  },
  {
    accessorKey: 'shift',
    header: 'Shift',
  },
];

export default function ViewTrainersList({ Trainers }: ViewTrainersListProps) {
  const [searchTerm, setSearchTerm] = useState('');
  const [shiftFilter, setShiftFilter] = useState<'Morning' | 'Evening' | 'All'>('All');
  const [filteredTrainers, setFilteredTrainers] = useState<TrainerType[]>(Trainers);

  // Calculate stats
  const totalTrainers = Trainers.length || 0;
  const morningShift = Trainers.filter((t) => t.shift === 'Morning').length;
  const eveningShift = Trainers.filter((t) => t.shift === 'Evening').length;

  const statusCards = [
    {
      title: 'Total Trainers',
      value: totalTrainers,
      icon: Users,
      gradient: 'blue',
    },
    {
      title: 'Morning Shift',
      value: morningShift,
      icon: UserCheck,
      gradient: 'green',
    },
    {
      title: 'Evening Shift',
      value: eveningShift,
      icon: Clock,
      gradient: 'yellow',
    },
  ] as const;

  useEffect(() => {
    const filtered = Trainers.filter(
      (trainer) =>
        trainer.name.toLowerCase().includes(searchTerm.toLowerCase()) &&
        (shiftFilter === 'All' || trainer.shift === shiftFilter),
    );
    setFilteredTrainers(filtered);
  }, [searchTerm, shiftFilter, Trainers]);

  // const handleTrainerClick = (trainer: Trainer) => {
  //   router.push(
  //     `addtrainers?id=${trainer.id}&name=${encodeURIComponent(
  //       trainer.name
  //     )}&shift=${trainer.shift}&image=${trainer.image}`
  //   );
  // };

  return (
    <div className="container mx-auto p-6 space-y-8">
      <h1 className="text-2xl font-bold text-center">Gym Trainers</h1>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        {statusCards.map((card) => (
          <StatusCard key={card.title} {...card} />
        ))}
      </div>

      {/* Filters */}
      <div className="flex flex-col md:flex-row gap-4 mb-6">
        <Input
          placeholder="Search trainers..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="max-w-sm"
        />
        <Select
          value={shiftFilter}
          onValueChange={(value: 'Morning' | 'Evening' | 'All') => setShiftFilter(value)}
        >
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Select shift" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="All">All Shifts</SelectItem>
            <SelectItem value="Morning">Morning</SelectItem>
            <SelectItem value="Evening">Evening</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Desktop View */}
      <div className="hidden md:block">
        <DataTable data={filteredTrainers} columns={columns} filterColumn="name" />
      </div>

      {/* Mobile View */}
      <div className="md:hidden">
        <DataCard
          data={filteredTrainers}
          renderCard={(trainer) => (
            <div className="p-4">
              <h3 className="font-medium">{trainer.name}</h3>
              <p className="text-sm text-gray-500">Assigned Clients: {trainer.assignedClients}</p>
              <p className="text-sm text-gray-500">Shift: {trainer.shift}</p>
            </div>
          )}
        />
      </div>
    </div>
  );
}
