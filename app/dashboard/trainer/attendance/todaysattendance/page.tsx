export const dynamic = 'force-dynamic';
import { Loader2 } from 'lucide-react';
import { Suspense } from 'react';
import UserAttendance from './UserAttendance';
import {
	TodayAttendance,
	type TodayAttendanceResponse,
} from './getTodayAttendance';

export default async function AttendancePage() {
	const attendanceData: TodayAttendanceResponse = await TodayAttendance();

	return <UserAttendance attendanceData={attendanceData} />;
}
