export const dynamic = 'force-dynamic';
import React from 'react';
import UserAttendance from './UserAttendance';
import { TodayAttendance } from './getTodayAttendance';

const formatShift = (shift: 'MORNING' | 'EVENING'): 'Morning' | 'Evening' => {
	return shift === 'MORNING' ? 'Morning' : 'Evening';
};

export default async function AttendancePage() {
	const attendanceData = await TodayAttendance();

	if (!attendanceData.users) {
		return <div>Failed to load attendance data</div>;
	}

	const formattedUsers = attendanceData.users.map((user) => ({
		id: user.id,
		name: user.name,
		shift: formatShift(user.shift),
		todaysAttendance: user.isPresent,
		attendanceTime: user.attendanceTime,
	}));

	return <UserAttendance initialUsers={formattedUsers} />;
}
