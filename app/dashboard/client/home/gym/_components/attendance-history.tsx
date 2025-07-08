'use client';

import { cn } from '@/lib/utils';
import { Calendar } from 'lucide-react';
import type { GymDetailsData } from '../_actions/get-gym-details';

interface AttendanceHistoryProps {
  attendanceHistory: GymDetailsData['attendanceHistory'];
}

export function AttendanceHistory({ attendanceHistory }: AttendanceHistoryProps) {
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    });
  };

  const calculateAttendanceStats = () => {
    const totalDays = attendanceHistory.length;
    const attendedDays = attendanceHistory.filter(record => record.attended).length;
    const percentage = totalDays > 0 ? Math.round((attendedDays / totalDays) * 100) : 0;
    
    return { totalDays, attendedDays, percentage };
  };

  const attendanceStats = calculateAttendanceStats();

  return (
    <div className="space-y-3">
      <div className="flex items-center gap-2">
        <div className="w-5 h-5 rounded-full bg-gradient-to-r from-blue-400 to-indigo-400 flex items-center justify-center">
          <Calendar className="h-3 w-3 text-white" />
        </div>
        <h2 className="text-lg font-semibold text-slate-800">Attendance History</h2>
        <span className="ml-auto text-xs text-blue-700 bg-blue-50 px-2 py-1 rounded">
          {attendanceStats.percentage}% attendance
        </span>
      </div>
      
      <div className="border-l-2 border-blue-200 pl-4">
        <div className="grid grid-cols-7 gap-1">
          {attendanceHistory.slice(0, 28).map((record, index) => (
            <div
              key={index}
              className={cn(
                'aspect-square rounded text-xs font-medium flex items-center justify-center',
                record.attended
                  ? 'bg-emerald-100 text-emerald-800'
                  : 'bg-red-100 text-red-800'
              )}
              title={`${formatDate(record.date)} - ${record.attended ? 'Present' : 'Absent'}`}
            >
              {new Date(record.date).getDate()}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
