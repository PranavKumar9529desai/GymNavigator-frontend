'use client';

import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { cn } from '@/lib/utils';
import { Calendar, ChevronDown, Clock, MapPin, QrCode, Smartphone, TrendingUp, User, Zap } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import { useState } from 'react';
import type { DashboardOverviewData } from '../_actions/get-dashboard-overview';

interface DashboardOverviewProps {
  data: DashboardOverviewData;
}

export function DashboardOverview({ data }: DashboardOverviewProps) {
  const { user, gym, trainer, membership, attendance } = data;
  const [expandedSections, setExpandedSections] = useState({
    actions: true,
    trainer: true,
    attendance: false,
  });

  const toggleSection = (section: keyof typeof expandedSections) => {
    setExpandedSections(prev => ({
      ...prev,
      [section]: !prev[section],
    }));
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
    });
  };

  const _getStatusColor = (daysRemaining: number) => {
    if (daysRemaining <= 7) return 'bg-red-400';
    if (daysRemaining <= 30) return 'bg-yellow-400';
    return 'bg-blue-400';
  };

  const _getStatusBadgeVariant = (daysRemaining: number) => {
    if (daysRemaining <= 7) return 'destructive';
    if (daysRemaining <= 30) return 'secondary';
    return 'default';
  };

  return (
    <div className="space-y-10 p-3 sm:p-6 pt-6 bg-gradient-to-br from-blue-50/30 via-white to-indigo-50/20 min-h-screen">
      {/* Welcome Section */}
      <div className="space-y-6">
        <div className="space-y-2">
          <h1 className="text-2xl font-bold text-slate-800">Welcome back, {user.name}!</h1>
          <p className="text-slate-600">
            {new Date().toLocaleDateString('en-US', {
              weekday: 'long',
              year: 'numeric',
              month: 'long',
              day: 'numeric',
            })}
          </p>
          {gym && (
            <div className="flex items-center gap-2 text-sm text-slate-600">
              <div className="w-6 h-6 rounded-full bg-gradient-to-r from-blue-400 to-indigo-400 flex items-center justify-center">
                <MapPin className="h-3 w-3 text-white" />
              </div>
              <span className="font-medium">{gym.gym_name}</span>
            </div>
          )}
        </div>

        {/* Quick Stats Cards */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {/* Membership Status */}
          <div className="p-4 rounded-lg bg-background border hover:shadow-sm transition-shadow">
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <div className="w-6 h-6 rounded-full bg-gradient-to-r from-purple-400 to-violet-400 flex items-center justify-center">
                  <Calendar className="h-3 w-3 text-white" />
                </div>
                <p className="text-xs text-slate-600 font-medium uppercase tracking-wide">Membership</p>
              </div>
              <div className="space-y-1">
                <p className="text-2xl font-bold text-slate-800">{membership.daysRemaining}</p>
                <p className="text-xs text-slate-600">days remaining</p>
                <Badge 
                  variant="outline" 
                  className={cn(
                    "border-blue-200 text-blue-700 text-xs",
                    membership.daysRemaining <= 7 && "border-red-200 text-red-700",
                    membership.daysRemaining <= 30 && membership.daysRemaining > 7 && "border-yellow-200 text-yellow-700"
                  )}
                >
                  {membership.daysRemaining <= 7 ? 'Expires Soon' : 
                   membership.daysRemaining <= 30 ? 'Expiring' : 'Active'}
                </Badge>
              </div>
            </div>
          </div>

          {/* Attendance Streak */}
          <div className="p-4 rounded-lg bg-background border hover:shadow-sm transition-shadow">
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <div className="w-6 h-6 rounded-full bg-gradient-to-r from-orange-400 to-red-400 flex items-center justify-center">
                  <Zap className="h-3 w-3 text-white" />
                </div>
                <p className="text-xs text-slate-600 font-medium uppercase tracking-wide">Streak</p>
              </div>
              <div className="space-y-1">
                <p className="text-2xl font-bold text-slate-800">{attendance.currentStreak}</p>
                <p className="text-xs text-slate-600">consecutive days</p>
                <Badge variant="outline" className="border-blue-200 text-blue-700 text-xs">
                  {attendance.currentStreak > 0 ? 'On Fire! 🔥' : 'Start Today'}
                </Badge>
              </div>
            </div>
          </div>

          {/* Monthly Attendance */}
          <div className="p-4 rounded-lg bg-background border hover:shadow-sm transition-shadow">
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <div className="w-6 h-6 rounded-full bg-gradient-to-r from-green-400 to-emerald-400 flex items-center justify-center">
                  <TrendingUp className="h-3 w-3 text-white" />
                </div>
                <p className="text-xs text-slate-600 font-medium uppercase tracking-wide">This Month</p>
              </div>
              <div className="space-y-2">
                <p className="text-2xl font-bold text-slate-800">{attendance.monthlyPercentage}%</p>
                <Progress value={attendance.monthlyPercentage} className="h-2 bg-blue-100" />
                <Badge variant="outline" className="border-blue-200 text-blue-700 text-xs">
                  {attendance.monthlyPercentage >= 80 ? 'Excellent' : 
                   attendance.monthlyPercentage >= 60 ? 'Good' : 'Keep Going'}
                </Badge>
              </div>
            </div>
          </div>

          {/* Today Status */}
          <div className="p-4 rounded-lg bg-background border hover:shadow-sm transition-shadow">
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <div className={cn(
                  'w-6 h-6 rounded-full flex items-center justify-center',
                  attendance.todayCheckedIn 
                    ? 'bg-gradient-to-r from-cyan-400 to-blue-400' 
                    : 'bg-gradient-to-r from-amber-400 to-orange-400'
                )}>
                  <QrCode className="h-3 w-3 text-white" />
                </div>
                <p className="text-xs text-slate-600 font-medium uppercase tracking-wide">Today</p>
              </div>
              <div className="space-y-1">
                <p className="text-lg font-semibold text-slate-800">
                  {attendance.todayCheckedIn ? 'Checked In' : 'Not Checked In'}
                </p>
                <Badge 
                  variant="outline" 
                  className={cn(
                    "text-xs",
                    attendance.todayCheckedIn 
                      ? "border-green-200 text-green-700" 
                      : "border-slate-200 text-slate-700"
                  )}
                >
                  {attendance.todayCheckedIn ? '✓ Present' : 'Pending'}
                </Badge>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Quick Actions Section */}
      <div className="border-b border-slate-100">
        <button  type="button" 
          onClick={() => toggleSection('actions')}
          className="w-full flex items-center justify-between py-2 hover:bg-blue-50/50 transition-colors"
        >
          <div className="flex items-center gap-3">
            <div className="w-6 h-6 rounded-full bg-gradient-to-r from-blue-400 to-indigo-400 flex items-center justify-center">
              <Zap className="h-3 w-3 text-white" />
            </div>
            <h2 className="text-lg font-semibold text-slate-800">Quick Actions</h2>
            <span className="text-xs text-blue-600 bg-blue-50 px-2 py-1 rounded">4</span>
          </div>
          <ChevronDown className={cn("h-4 w-4 text-blue-600 transition-transform", !expandedSections.actions && "rotate-180")} />
        </button>
        {expandedSections.actions && (
          <div className="pb-3">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
              <Button  
                className="h-20 flex-col gap-2 border-blue-200 text-blue-600 hover:bg-blue-50"
              >
                <QrCode className="h-6 w-6" />
                <span className="text-xs">Scan QR</span>
              </Button>
              
              {trainer && (
                <Button 
                  variant="outline" 
                  className="h-20 flex-col gap-2 border-blue-200 text-blue-600 hover:bg-blue-50"
                >
                  <Smartphone className="h-6 w-6" />
                  <span className="text-xs">Contact Trainer</span>
                </Button>
              )}
              
              <Button 
                variant="outline" 
                className="h-20 flex-col gap-2 border-blue-200 text-blue-600 hover:bg-blue-50" 
                asChild
              >
                <Link href="/dashboard/client/home/gym">
                  <MapPin className="h-6 w-6" />
                  <span className="text-xs">Gym Details</span>
                </Link>
              </Button>
              
              <Button 
                variant="outline" 
                className="h-20 flex-col gap-2 border-blue-200 text-blue-600 hover:bg-blue-50"
              >
                <Calendar className="h-6 w-6" />
                <span className="text-xs">Schedule</span>
              </Button>
            </div>
          </div>
        )}
      </div>

      {/* Recent Activity Section */}
      <div className="border-b border-slate-100">
        <button  type="button" 
          onClick={() => toggleSection('attendance')}
          className="w-full flex items-center justify-between py-2 hover:bg-blue-50/50 transition-colors"
        >
          <div className="flex items-center gap-3">
            <div className="w-6 h-6 rounded-full bg-gradient-to-r from-blue-400 to-indigo-400 flex items-center justify-center">
              <TrendingUp className="h-3 w-3 text-white" />
            </div>
            <h2 className="text-lg font-semibold text-slate-800">Recent Attendance</h2>
            <span className="text-xs text-blue-600 bg-blue-50 px-2 py-1 rounded">
              {attendance.recentAttendances.length}
            </span>
          </div>
          <ChevronDown className={cn("h-4 w-4 text-blue-600 transition-transform", !expandedSections.attendance && "rotate-180")} />
        </button>
        {expandedSections.attendance && (
          <div className="pb-3">
            <div className="space-y-1">
              {attendance.recentAttendances.length > 0 ? (
                attendance.recentAttendances.map((record, index) => (
                  <div   key={ index as number }  className="flex items-center justify-between p-2 hover:bg-blue-50/30 rounded transition-colors">
                    <div className="flex items-center gap-3">
                      <div className={cn(
                        'w-2 h-2 rounded-full', 
                        record.attended ? 'bg-green-400' : 'bg-red-400'
                      )} />
                      <span className="font-medium text-slate-700">{formatDate(record.date)}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Badge 
                        variant="outline" 
                        className={cn(
                          "text-xs",
                          record.attended 
                            ? "border-green-200 text-green-700" 
                            : "border-red-200 text-red-700"
                        )}
                      >
                        {record.attended ? 'Present' : 'Absent'}
                      </Badge>
                      {record.attended && record.scanTime && (
                        <span className="text-xs text-slate-600 flex items-center gap-1">
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
                <div className="text-slate-600 text-center py-8 text-sm">
                  No attendance records found
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
