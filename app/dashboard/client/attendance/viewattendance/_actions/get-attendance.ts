'use server';
import { ClientReqConfig } from '@/lib/AxiosInstance/clientAxios';

interface AttendanceDaysResponse {
	success: boolean;
	data?: string[]; // API returns date strings
	error?: string;
	details?: string;
}

export interface AttendanceData {
	attendanceDays: Date[];
}

export const fetchAttendanceData = async (): Promise<AttendanceData> => {
	try {
		const clientAxios = await ClientReqConfig();

		// Add a cache key to improve caching behavior
		const response = await clientAxios.post<AttendanceDaysResponse>(
			'/attendance/monthlyattendance',
			{},
			{
				headers: {
					'Cache-Control': 'max-age=300', // 5 minute cache
				},
			},
		);

		if (!response.data.success || !response.data.data) {
			console.error('Failed to fetch attendance days:', response.data.error);
			return { attendanceDays: [] };
		}

		// Convert string dates to Date objects
		const attendanceDays = response.data.data.map(
			(dateStr) => new Date(dateStr),
		);
		return { attendanceDays };
	} catch (error) {
		console.error('Error fetching attendance days:', error);
		return { attendanceDays: [] };
	}
};
