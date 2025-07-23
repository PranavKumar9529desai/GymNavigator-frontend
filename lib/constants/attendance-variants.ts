/**
 * Attendance variants for consistent styling across components
 */

// Badge variants for different attendance types
export type AttendanceVariantType =
	| 'secondary'
	| 'outline'
	| 'destructive'
	| 'default'
	| 'success'
	| null
	| undefined;

export type AttendanceType = 'present' | 'absent' | 'late';

// Badge variants mapping for use with the Badge component
export const attendanceBadgeVariants: Record<
	AttendanceType,
	AttendanceVariantType
> = {
	present: 'success',
	absent: 'destructive',
	late: 'outline',
};

// CSS class mapping for table cells or other components
export const attendanceColorClasses: Record<
	AttendanceType,
	{ bg: string; text: string }
> = {
	present: { bg: 'bg-green-100', text: 'text-green-800' },
	absent: { bg: 'bg-red-100', text: 'text-red-800' },
	late: { bg: 'bg-yellow-100', text: 'text-yellow-800' },
};

// Attendance display labels (capitalized)
export const attendanceLabels: Record<AttendanceType, string> = {
	present: 'Present',
	absent: 'Absent',
	late: 'Late',
};

// Function to determine attendance status from boolean and time
export const getAttendanceStatus = (
	isPresent: boolean,
	time: string | null,
): AttendanceType => {
	if (!isPresent) return 'absent';

	// If present but with no time recorded yet, consider as 'present'
	if (!time) return 'present';

	// You could implement late detection logic here
	// For example, checking if the time is after a certain threshold
	// For now, simply returning 'present' for any time
	return 'present';
};
