'use client';
import React, { useState, useMemo } from 'react';
import {
  Search,
  Users,
  Utensils,
  UtensilsCrossed,
  ChevronDown,
  Check,
} from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

interface User {
  id: number;
  name: string;
  gender: string;
  goal: string;
  assignedDietPlan: string | null;
}

interface DietPlan {
  id: number;
  name: string;
}

export default function AssignWorkout() {
  const [users, setUsers] = useState<User[]>([
    {
      id: 1,
      name: 'John Doe',
      gender: 'Male',
      goal: 'Weight Loss',
      assignedDietPlan: null,
    },
    {
      id: 2,
      name: 'Jane Smith',
      gender: 'Female',
      goal: 'Muscle Gain',
      assignedDietPlan: 'Protein Rich',
    },
    {
      id: 3,
      name: 'Alex Johnson',
      gender: 'Non-binary',
      goal: 'Maintenance',
      assignedDietPlan: null,
    },
  ]);
  const [searchTerm, setSearchTerm] = useState('');

  const dietPlans: DietPlan[] = [
    { id: 1, name: 'Keto Diet' },
    { id: 2, name: 'Vegan Plan' },
    { id: 3, name: 'Protein Rich' },
    { id: 4, name: 'Balanced Nutrition' },
  ];

  const assignDietPlan = (userId: number, planName: string) => {
    setUsers(
      users.map((user) =>
        user.id === userId
          ? { ...user, assignedDietPlan: planName || null }
          : user
      )
    );
  };

  const filteredUsers = useMemo(() => {
    return users.filter(
      (user) =>
        user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        user.gender.toLowerCase().includes(searchTerm.toLowerCase()) ||
        user.goal.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [users, searchTerm]);

  const { totalUsers, assignedUsers, unassignedUsers } = useMemo(() => {
    const total = users.length;
    const assigned = users.filter((user) => user.assignedDietPlan).length;
    return {
      totalUsers: total,
      assignedUsers: assigned,
      unassignedUsers: total - assigned,
    };
  }, [users]);

  return (
    <div className="container mx-auto p-6 pb-14">
      <h1 className="text-center lg:text-left text-2xl font-bold mb-6 text-gray-800">
        Assign Diet Plans
      </h1>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <Card>
          <CardContent className="flex items-center justify-between p-4">
            <div>
              <p className="text-sm text-gray-500">Total Users</p>
              <p className="text-2xl font-semibold text-gray-800">
                {totalUsers}
              </p>
            </div>
            <Users className="h-10 w-10 text-blue-500" />
          </CardContent>
        </Card>
        <Card>
          <CardContent className="flex items-center justify-between p-4">
            <div>
              <p className="text-sm text-gray-500">Assigned Diet Plans</p>
              <p className="text-2xl font-semibold text-gray-800">
                {assignedUsers}
              </p>
            </div>
            <Utensils className="h-10 w-10 text-green-500" />
          </CardContent>
        </Card>
        <Card>
          <CardContent className="flex items-center justify-between p-4">
            <div>
              <p className="text-sm text-gray-500">Unassigned Users</p>
              <p className="text-2xl font-semibold text-gray-800">
                {unassignedUsers}
              </p>
            </div>
            <UtensilsCrossed className="h-10 w-10 text-red-500" />
          </CardContent>
        </Card>
      </div>

      <div className="mb-6">
        <div className="relative">
          <Search
            className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
            size={20}
          />
          <Input
            type="text"
            placeholder="Search users..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>
      </div>

      <Card>
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>User Name</TableHead>
                  <TableHead>Gender</TableHead>
                  <TableHead>Goal</TableHead>
                  <TableHead>Assign Diet Plan</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredUsers.map((user) => (
                  <TableRow key={user.id}>
                    <TableCell>{user.name}</TableCell>
                    <TableCell>{user.gender}</TableCell>
                    <TableCell>{user.goal}</TableCell>
                    <TableCell>
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button
                            variant="outline"
                            className="w-[200px] justify-between"
                          >
                            {user.assignedDietPlan || 'Select a diet plan'}
                            <ChevronDown className="ml-2 h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent className="w-[200px]">
                          <DropdownMenuItem
                            onSelect={() => assignDietPlan(user.id, '')}
                          >
                            Unassign
                            {user.assignedDietPlan === null && (
                              <Check className="ml-auto h-4 w-4" />
                            )}
                          </DropdownMenuItem>
                          {dietPlans.map((plan) => (
                            <DropdownMenuItem
                              key={plan.id}
                              onSelect={() =>
                                assignDietPlan(user.id, plan.name)
                              }
                            >
                              {plan.name}
                              {user.assignedDietPlan === plan.name && (
                                <Check className="ml-auto h-4 w-4" />
                              )}
                            </DropdownMenuItem>
                          ))}
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>

          <div className="md:hidden space-y-4 p-4">
            {filteredUsers.map((user) => (
              <Card key={user.id}>
                <CardContent className="p-4 space-y-2">
                  <h3 className="font-semibold text-gray-800">{user.name}</h3>
                  <p className="text-sm text-gray-600">Gender: {user.gender}</p>
                  <p className="text-sm text-gray-600">Goal: {user.goal}</p>
                  <Label htmlFor={`diet-plan-${user.id}`}>
                    Assign Diet Plan
                  </Label>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button
                        id={`diet-plan-${user.id}`}
                        variant="outline"
                        className="w-full justify-between"
                      >
                        {user.assignedDietPlan || 'Select a diet plan'}
                        <ChevronDown className="ml-2 h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent className="w-[200px]">
                      <DropdownMenuItem
                        onSelect={() => assignDietPlan(user.id, '')}
                      >
                        Unassign
                        {user.assignedDietPlan === null && (
                          <Check className="ml-auto h-4 w-4" />
                        )}
                      </DropdownMenuItem>
                      {dietPlans.map((plan) => (
                        <DropdownMenuItem
                          key={plan.id}
                          onSelect={() => assignDietPlan(user.id, plan.name)}
                        >
                          {plan.name}
                          {user.assignedDietPlan === plan.name && (
                            <Check className="ml-auto h-4 w-4" />
                          )}
                        </DropdownMenuItem>
                      ))}
                    </DropdownMenuContent>
                  </DropdownMenu>
                </CardContent>
              </Card>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
