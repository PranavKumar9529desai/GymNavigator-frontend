export function createQrValue(gymData: { gymname: string; gymid: number }) {
	const now = new Date();
	now.setMinutes(0, 0, 0);

	return JSON.stringify({
		AttendanceAction: {
			gymname: gymData.gymname,
			gymid: gymData.gymid,
			timestamp: now.toISOString(),
		},
	});
}
