"use client";
import { DataCard } from "@/components/Table/UserCard";
import { DataTable } from "@/components/Table/UsersTable";
import { StatusCard } from "@/components/common/StatusCard";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import type { ColumnDef } from "@tanstack/react-table";
import { ArrowUpDown, Search, UserCheck, Users, Dumbbell } from "lucide-react";
import { useEffect, useState } from "react";
import type { AssignedUser } from "../_actiions/GetuserassignedTotrainers";
import { getUsersAssignedToTrainer } from "../_actiions/GetuserassignedTotrainers";
import { useQuery } from "@tanstack/react-query";
import { useRouter } from "next/navigation";

const columns: ColumnDef<AssignedUser>[] = [
  {
    accessorKey: "name",
    header: ({ column }) => (
      <Button
        variant="ghost"
        onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
      >
        User Name
        <ArrowUpDown className="ml-2 h-4 w-4" />
      </Button>
    ),
    cell: ({ row }) => {
      const router = useRouter();
      return (
        <div className="cursor-pointer hover:text-primary" onClick={() => row.original.id && router.push(`/dashboard/trainer/assignedusers/assignedusersroute/${row.original.id}`)}>
          {row.getValue("name")}
        </div>
      );
    },
  },
  {
    accessorKey: "email",
    header: "Email",
  },
  {
    accessorKey: "gender",
    header: "Gender",
    cell: ({ row }) => {
      const gender = row.original.gender;
      return (
        <div
          className={`text-sm ${
            gender !== "Not specified" ? "text-gray-900" : "text-gray-500"
          }`}
        >
          {gender}
        </div>
      );
    },
  },
  {
    accessorKey: "dietaryPreference",
    header: "Dietary Preference",
    cell: ({ row }) => {
      const diet = row.original.dietaryPreference;
      return (
        <div
          className={`text-sm ${
            diet !== "Not specified" ? "text-gray-900" : "text-gray-500"
          }`}
        >
          {diet}
        </div>
      );
    },
  },
  {
    accessorKey: "activeWorkoutPlan",
    header: "Workout Plan",
    cell: ({ row }) => {
      const hasWorkoutPlan = row.original.hasActiveWorkoutPlan;
      const planName = row.original.activeWorkoutPlanName;

      return (
        <div className="flex items-center gap-2">
          {hasWorkoutPlan ? (
            <Badge className="bg-green-100 text-green-800 hover:bg-green-200">
              <Dumbbell className="w-3 h-3 mr-1" />
              {planName}
            </Badge>
          ) : (
            <Badge variant="secondary" className="bg-gray-100 text-gray-600">
              No Active Plan
            </Badge>
          )}
        </div>
      );
    },
  },
  {
    accessorKey: "membershipStatus",
    header: "Status",
    cell: ({ row }) => {
      const status = row.original.membershipStatus;
      return (
        <Badge
          className={`${
            status === "active"
              ? "bg-green-100 text-green-800"
              : "bg-red-100 text-red-800"
          }`}
        >
          {status}
        </Badge>
      );
    },
  },
];

export default function AssignedUserToTrainer() {
  const router = useRouter();
  const { data: users = [] } = useQuery({
    queryKey: ["assigned-users"],
    queryFn: getUsersAssignedToTrainer,
  });

  const [searchTerm, setSearchTerm] = useState("");
  const [filteredUsers, setFilteredUsers] = useState<AssignedUser[]>(users);

  // Calculate stats
  const totalUsers = users.length;
  const activeUsers = users.filter(
    (u) => u.membershipStatus === "active"
  ).length;
  const usersWithWorkoutPlan = users.filter(
    (u) => u.hasActiveWorkoutPlan
  ).length;

  const statusCards = [
    {
      title: "Total Assigned Users",
      value: totalUsers,
      icon: Users,
      gradient: "blue",
    },
    {
      title: "Active Users",
      value: activeUsers,
      icon: UserCheck,
      gradient: "green",
    },
    {
      title: "Users with Workout Plan",
      value: usersWithWorkoutPlan,
      icon: Dumbbell,
      gradient: "blue",
    },
  ] as const;

  useEffect(() => {
    const filtered = users.filter(
      (user) =>
        user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        user.email.toLowerCase().includes(searchTerm.toLowerCase())
    );
    setFilteredUsers(filtered);
  }, [searchTerm, users]);

  return (
    <div className="container mx-auto p-6 space-y-8">
      <div className="flex flex-col items-center justify-between gap-4 md:flex-row">
        <h1 className="text-3xl font-bold text-gray-900 text-center w-full">
          Assigned Users
        </h1>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        {statusCards.map((card) => (
          <StatusCard key={card.title} {...card} />
        ))}
      </div>
      <div className="flex items-center space-x-2">
        <Search className="w-5 h-5 text-gray-400" />
        <Input
          placeholder="Search users..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full md:w-[300px]"
        />
      </div>
      {/* Desktop View */}
      <div className="hidden md:block rounded-lg border bg-card">
        <DataTable data={filteredUsers} columns={columns} filterColumn="name" />
      </div>

      {/* Mobile View */}
      <div className="md:hidden space-y-4">
        <DataCard
          data={filteredUsers}
          renderCard={(user) => (
            <div 
              className="p-4 space-y-3 bg-white rounded-lg border cursor-pointer hover:border-primary transition-colors"
              onClick={() => user.id && router.push(`/dashboard/trainer/assignedusers/assignedusersroute/${user.id}`)}
            >
              <div className="flex items-center justify-between">
                <h3 className="font-medium text-lg">{user.name}</h3>
                <Badge
                  className={`${
                    user.membershipStatus === "active"
                      ? "bg-green-100 text-green-800"
                      : "bg-red-100 text-red-800"
                  }`}
                >
                  {user.membershipStatus}
                </Badge>
              </div>

              <p className="text-sm text-gray-600">{user.email}</p>

              <div className="grid grid-cols-2 gap-y-2">
                <div className="text-sm">
                  <span className="text-gray-600">Gender: </span>
                  <span
                    className={
                      user.gender !== "Not specified"
                        ? "text-gray-900"
                        : "text-gray-500"
                    }
                  >
                    {user.gender}
                  </span>
                </div>
                <div className="text-sm">
                  <span className="text-gray-600">Diet: </span>
                  <span
                    className={
                      user.dietaryPreference !== "Not specified"
                        ? "text-gray-900"
                        : "text-gray-500"
                    }
                  >
                    {user.dietaryPreference}
                  </span>
                </div>
              </div>

              <div className="pt-2 border-t">
                <p className="text-sm text-gray-600 mb-2">Workout Plan:</p>
                {user.hasActiveWorkoutPlan ? (
                  <Badge className="bg-green-100 text-green-800">
                    <Dumbbell className="w-3 h-3 mr-1" />
                    {user.activeWorkoutPlanName}
                  </Badge>
                ) : (
                  <Badge
                    variant="secondary"
                    className="bg-gray-100 text-gray-600"
                  >
                    No Active Plan
                  </Badge>
                )}
              </div>
            </div>
          )}
        />
      </div>
    </div>
  );
}
