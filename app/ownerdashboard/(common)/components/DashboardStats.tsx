import React from 'react';
import { Card } from '@/components/ui/card';
import { Users, Dumbbell, Calendar, TrendingUp } from 'lucide-react';

interface DashboardStatsProps {
  data: {
    stats: {
      totalMembers: number;
      activeTrainers: number;
      todayAttendance: number;
      revenue: number;
    };
    recentActivities: Array<{
      name: string;
      Validperiod?: {
        startDate: string;
        shift: string;
      };
    }>;
  };
}

export default function DashboardStats({ data }: DashboardStatsProps) {
  const { stats, recentActivities } = data;

  const statCards = [
    {
      label: 'Total Members',
      value: stats.totalMembers.toString(),
      icon: Users,
      color: 'text-blue-500',
    },
    {
      label: 'Active Trainers',
      value: stats.activeTrainers.toString(),
      icon: Dumbbell,
      color: 'text-green-500',
    },
    {
      label: "Today's Attendance",
      value: stats.todayAttendance.toString(),
      icon: Calendar,
      color: 'text-purple-500',
    },
    {
      label: 'Active Gyms',
      value: `1`,
      icon: TrendingUp,
      color: 'text-orange-500',
    },
  ];

  return (
    <div className="p-8 max-w-7xl mx-auto">
      <div className="space-y-8">
        {/* Welcome Header */}
        <div className="space-y-2">
          <h1 className="text-3xl font-bold tracking-tight">
            Welcome back, Owner
          </h1>
          <p className="text-gray-500">
            Here&apos;s what&apos;s happening across your fitness empire today.
          </p>
        </div>

        {/* Quick Stats */}
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          {statCards.map((stat, index) => (
            <Card key={index} className="p-6 hover:shadow-lg transition-shadow">
              <div className="flex items-center space-x-4">
                <div className={`p-3 rounded-full bg-gray-100 ${stat.color}`}>
                  <stat.icon className="w-6 h-6" />
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-500">
                    {stat.label}
                  </p>
                  <h3 className="text-2xl font-bold">{stat.value}</h3>
                </div>
              </div>
            </Card>
          ))}
        </div>

        {/* Recent Activity Preview */}
        <Card className="p-6">
          <h2 className="text-xl font-semibold mb-4">Recent Activities</h2>
          <div className="space-y-4">
            {recentActivities.map((activity, index) => (
              <div
                key={index}
                className="flex items-center space-x-3 text-gray-600"
              >
                <Calendar className="w-4 h-4" />
                <span>
                  {activity.name} -{' '}
                  {activity.Validperiod
                    ? `Joined ${new Date(activity.Validperiod.startDate).toLocaleDateString()} (${activity.Validperiod.shift} shift)`
                    : 'New member added'}
                </span>
              </div>
            ))}
          </div>
        </Card>
      </div>
    </div>
  );
}
