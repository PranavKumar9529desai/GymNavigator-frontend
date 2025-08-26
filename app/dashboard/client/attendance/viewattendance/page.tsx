import { fetchAttendanceData } from './_actions/get-attendance';
import AttendanceClient from './_components/AttendanceClient';

export default async function ViewAttendancePage() {
	const data = await fetchAttendanceData();

	return <AttendanceClient attendanceData={data} />;
}
