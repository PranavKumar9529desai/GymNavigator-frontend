'use server';

import { ClientReqConfig } from '@/lib/AxiosInstance/clientAxios';

export interface AttendanceData {
	isMarked: boolean;
	attendance?: {
		id: number;
		userId: number;
		validPeriodId: number;
		date: string;
		scanTime: string;
		attended: boolean;
	};
}

export interface AttendanceResponse {
	success: boolean;
	data?: AttendanceData;
	error?: string;
}

export async function checkUserAttendance(): Promise<AttendanceResponse> {
	try {
		const clientAxios = await ClientReqConfig();
		const response = await clientAxios.get('/attendance/check-attendance');

		return {
			success: true,
			data: response.data.data,
		};
	} catch (error) {
		console.error('Error checking attendance:', error);
		return {
			success: false,
			error:
				error instanceof Error ? error.message : 'Failed to check attendance',
		};
	}
}
