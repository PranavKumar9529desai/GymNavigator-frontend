'use client';

import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Separator } from '@/components/ui/separator';
import { cn } from '@/lib/utils';
import { Calendar, Clock, MapPin, QrCode, Smartphone, Zap } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import type { DashboardOverviewData } from '../_actions/get-dashboard-overview';

interface DashboardOverviewProps {
  data: DashboardOverviewData;
}

export function DashboardOverview({ data }: DashboardOverviewProps) {
  const { user, gym, trainer, membership, attendance } = data;

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
    });
  };

  const getStatusColor = (daysRemaining: number) => {
    if (daysRemaining <= 7) return 'bg-red-500';
    if (daysRemaining <= 30) return 'bg-yellow-500';
    return 'bg-green-500';
  };

  return (
    <div className="space-y-6 p-4">
      {/* Welcome Section */}
      <div className="space-y-2">
        <h1 className="text-2xl font-bold">Welcome back, {user.name}!</h1>
        <p className="text-muted-foreground">
          {new Date().toLocaleDateString('en-US', {
            weekday: 'long',
            year: 'numeric',
            month: 'long',
            day: 'numeric',
          })}
        </p>
        {gym && (
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <MapPin className="h-4 w-4" />
            <span>{gym.gym_name}</span>
          </div>
        )}
      </div>

      {/* Quick Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Membership Status */}
        <div className="p-4 rounded-lg bg-background border">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-muted-foreground">Membership</p>
              <p className="text-2xl font-bold">{membership.daysRemaining}</p>
              <p className="text-xs text-muted-foreground">days remaining</p>
            </div>
            <div className={cn('w-3 h-3 rounded-full', getStatusColor(membership.daysRemaining))} />
          </div>
        </div>

        {/* Attendance Streak */}
        <div className="p-4 rounded-lg bg-background border">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-muted-foreground">Current Streak</p>
              <p className="text-2xl font-bold">{attendance.currentStreak}</p>
              <p className="text-xs text-muted-foreground">days</p>
            </div>
            <Zap className="h-5 w-5 text-orange-500" />
          </div>
        </div>

        {/* Monthly Attendance */}
        <div className="p-4 rounded-lg bg-background border">
          <div className="space-y-2">
            <p className="text-sm text-muted-foreground">This Month</p>
            <p className="text-2xl font-bold">{attendance.monthlyPercentage}%</p>
            <Progress value={attendance.monthlyPercentage} className="h-2" />
          </div>
        </div>

        {/* Today Status */}
        <div className="p-4 rounded-lg bg-background border">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-muted-foreground">Today</p>
              <p className="text-lg font-semibold">
                {attendance.todayCheckedIn ? 'Checked In' : 'Not Checked In'}
              </p>
            </div>
            <div className={cn('w-3 h-3 rounded-full', attendance.todayCheckedIn ? 'bg-green-500' : 'bg-gray-300')} />
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="space-y-4">
        <h2 className="text-lg font-semibold">Quick Actions</h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          <Button variant="outline" className="h-20 flex-col gap-2">
            <QrCode className="h-6 w-6" />
            <span className="text-xs">Scan QR</span>
          </Button>
          
          {trainer && (
            <Button variant="outline" className="h-20 flex-col gap-2">
              <Smartphone className="h-6 w-6" />
              <span className="text-xs">Contact Trainer</span>
            </Button>
          )}
          
          <Button variant="outline" className="h-20 flex-col gap-2" asChild>
            <Link href="/dashboard/client/home/gym">
              <MapPin className="h-6 w-6" />
              <span className="text-xs">Gym Details</span>
            </Link>
          </Button>
          
          <Button variant="outline" className="h-20 flex-col gap-2">
            <Calendar className="h-6 w-6" />
            <span className="text-xs">Schedule</span>
          </Button>
        </div>
      </div>

      {/* Trainer Info */}
      {trainer && (
        <div className="space-y-4">
          <h2 className="text-lg font-semibold">My Trainer</h2>
          <div className="p-4 rounded-lg bg-background border">
            <div className="flex items-center gap-4">
              {trainer.image ? (
                <Image
                  src={trainer.image}
                  alt={trainer.name}
                  width={48}
                  height={48}
                  className="rounded-full"
                />
              ) : (
                <div className="w-12 h-12 rounded-full bg-muted flex items-center justify-center">
                  <span className="text-lg font-semibold">{trainer.name.charAt(0)}</span>
                </div>
              )}
              <div className="flex-1">
                <h3 className="font-semibold">{trainer.name}</h3>
                {trainer.specializations && (
                  <p className="text-sm text-muted-foreground">{trainer.specializations}</p>
                )}
                {trainer.rating && (
                  <div className="flex items-center gap-1 mt-1">
                    <span className="text-sm">⭐</span>
                    <span className="text-sm">{trainer.rating}/5</span>
                  </div>
                )}
              </div>
              <Button size="sm">Contact</Button>
            </div>
          </div>
        </div>
      )}

      {/* Recent Activity */}
      <div className="space-y-4">
        <h2 className="text-lg font-semibold">Recent Attendance</h2>
        <div className="space-y-2">
          {attendance.recentAttendances.length > 0 ? (
            attendance.recentAttendances.map((record, index) => (
              <div key={index} className="flex items-center justify-between p-3 rounded-lg bg-background border">
                <div className="flex items-center gap-3">
                  <div className={cn('w-2 h-2 rounded-full', record.attended ? 'bg-green-500' : 'bg-red-500')} />
                  <span className="font-medium">{formatDate(record.date)}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Badge variant={record.attended ? 'default' : 'secondary'}>
                    {record.attended ? 'Present' : 'Absent'}
                  </Badge>
                  {record.attended && record.scanTime && (
                    <span className="text-xs text-muted-foreground flex items-center gap-1">
                      <Clock className="h-3 w-3" />
                      {new Date(record.scanTime).toLocaleTimeString('en-US', {
                        hour: '2-digit',
                        minute: '2-digit',
                      })}
                    </span>
                  )}
                </div>
              </div>
            ))
          ) : (
            <p className="text-muted-foreground text-center py-8">No attendance records found</p>
          )}
        </div>
      </div>
    </div>
  );
}
