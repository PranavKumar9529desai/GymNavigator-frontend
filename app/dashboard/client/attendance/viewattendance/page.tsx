import AttendanceClient from './_components/AttendanceClient';
import type { Metadata } from 'next';
import { fetchAttendanceData } from './_actions/get-attendance';

export const revalidate = 60;

export const metadata: Metadata = {
	title: 'Attendance History | GymNavigator',
	description:
		'View and track your gym attendance history with detailed calendar view and progress statistics.',
};

export default async function ViewAttendancePage() {
	const data = await fetchAttendanceData();
	return <AttendanceClient attendanceData={data} />;
}
