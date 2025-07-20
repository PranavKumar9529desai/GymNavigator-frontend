import AttendanceClient from './_components/AttendanceClient';
import type { Metadata } from 'next';
import { fetchAttendanceData } from './_actions/get-attendance';

export const revalidate = 60;



export default async function ViewAttendancePage() {
	const data = await fetchAttendanceData();
	return <AttendanceClient attendanceData={data} />;
}
