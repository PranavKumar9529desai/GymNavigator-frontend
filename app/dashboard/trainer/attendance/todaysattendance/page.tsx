export const dynamic = "force-dynamic";
import { Loader2 } from "lucide-react";
import { Suspense } from "react";
import UserAttendance from "./UserAttendance";
import { TodayAttendance, type TodayAttendanceResponse } from "./getTodayAttendance";

function Spinner() {
  return (
    <div className="flex h-screen w-full items-center justify-center">
      <Loader2 className="h-8 w-8 animate-spin text-primary" />
    </div>
  );
}

export default async function AttendancePage() {
	const attendanceData: TodayAttendanceResponse = await TodayAttendance();

	return (
		<Suspense fallback={<Spinner />}>
			<UserAttendance attendanceData={attendanceData} />
		</Suspense>
	);
}
