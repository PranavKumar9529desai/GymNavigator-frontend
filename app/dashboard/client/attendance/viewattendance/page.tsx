import AttendanceClient from './_components/AttendanceClient';
import { fetchAttendanceData } from './_actions/get-attendance';

export default async function ViewAttendancePage() {
	const data = await fetchAttendanceData();
	return <AttendanceClient attendanceData={data} />;
}
