import { Card } from '@/components/ui/card';
import { AlertCircle, Building2, Calendar, Dumbbell, Users } from 'lucide-react';
import React from 'react';
import type { TrainerDashboardData } from './types';

interface TrainerStatsProps {
  data: TrainerDashboardData;
}

export default function TrainerStats({ data }: TrainerStatsProps) {
  const { stats, recentActivities } = data;

  // Fallback values for missing data
  const safeStats = {
    totalMembers: stats?.totalMembers ?? 0,
    activeWorkoutPlans: stats?.activeWorkoutPlans ?? 0,
    todayAttendance: stats?.todayAttendance ?? 0,
    gymName: stats?.gymName ?? 'Not Assigned',
  };

  const statCards = [
    {
      label: 'Total Members',
      value: safeStats.totalMembers.toString(),
      icon: Users,
      color: 'text-blue-500',
    },
    {
      label: 'Active Workout Plans',
      value: safeStats.activeWorkoutPlans.toString(),
      icon: Dumbbell,
      color: 'text-green-500',
    },
    {
      label: "Today's Attendance",
      value: safeStats.todayAttendance.toString(),
      icon: Calendar,
      color: 'text-purple-500',
    },
    {
      label: 'Assigned Gym',
      value: safeStats.gymName,
      icon: Building2,
      color: 'text-orange-500',
    },
  ];

  return (
    <div className="p-8 max-w-7xl mx-auto">
      <div className="space-y-8">
        {/* Welcome Header */}
        <div className="space-y-2">
          <h1 className="text-3xl font-bold tracking-tight">Welcome back, Trainer</h1>
          <p className="text-gray-500">
            Here&apos;s an overview of your members and activities today.
          </p>
        </div>

        {/* Quick Stats */}
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          {statCards.map((stat, index) => (
            <Card key={index as number} className="p-6 hover:shadow-lg transition-shadow">
              <div className="flex items-center space-x-4">
                <div className={`p-3 rounded-full bg-gray-100 ${stat.color}`}>
                  <stat.icon className="w-6 h-6" />
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-500">{stat.label}</p>
                  <h3 className="text-2xl font-bold">{stat.value}</h3>
                </div>
              </div>
            </Card>
          ))}
        </div>

        {/* Recent Activity Preview */}
        <Card className="p-6">
          <h2 className="text-xl font-semibold mb-4">Recent Member Activities</h2>
          <div className="space-y-4">
            {recentActivities && recentActivities.length > 0 ? (
              recentActivities.map((activity, index) => (
                <div key={index as number} className="flex items-center space-x-3 text-gray-600">
                  <Users className="w-4 h-4" />
                  <span>
                    {activity.name} -{' '}
                    {activity.Validperiod
                      ? `${activity.Validperiod.shift} shift`
                      : 'New member assigned'}
                  </span>
                </div>
              ))
            ) : (
              <div className="flex items-center space-x-2 text-gray-500">
                <AlertCircle className="w-4 h-4" />
                <span>No recent activities to show</span>
              </div>
            )}
          </div>
        </Card>
      </div>
    </div>
  );
}
