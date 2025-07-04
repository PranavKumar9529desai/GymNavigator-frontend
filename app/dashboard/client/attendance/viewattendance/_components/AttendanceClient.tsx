'use client';
import type { AttendanceData } from '../_actions/get-attendance';
import CalendarSkeleton from './CalendarSkeleton';
import MonthAttendance from './MonthAttendance';

interface AttendanceClientProps {
	attendanceData: AttendanceData;
}

export default function AttendanceClient({
	attendanceData,
}: AttendanceClientProps) {
	if (!attendanceData) return <CalendarSkeleton />;

	return <MonthAttendance attendanceDays={attendanceData.attendanceDays ?? []} />;
}
