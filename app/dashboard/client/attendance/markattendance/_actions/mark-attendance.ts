'use server';

import { ClientReqConfig } from '@/lib/AxiosInstance/clientAxios';
import type { AxiosError } from 'axios';

export interface MarkAttendanceResponse {
	success: boolean;
	data?: {
		id: number;
		userId: number;
		membershipId: number;
		date: string;
		scanTime: string;
		attended: boolean;
	};
	message?: string;
	error?: string;
	details?: string;
}

export async function markAttendance(): Promise<MarkAttendanceResponse> {
	try {
		const now = new Date();
		const clientUTC = Date.UTC(
			now.getUTCFullYear(),
			now.getUTCMonth(),
			now.getUTCDate(),
			now.getUTCHours(),
		);
		const truncatedUtcDate = new Date(clientUTC);

		const clientAxios = await ClientReqConfig();
		const response = await clientAxios.post('/attendance/mark-attendance', {
			clientDate: truncatedUtcDate.toISOString(),
		});

		return {
			success: true,
			data: response.data.data,
		};
	} catch (error: unknown) {
		console.error('Error marking attendance:', error);

		// Handle Axios errors specifically
		if (error && typeof error === 'object' && 'isAxiosError' in error) {
			const axiosError = error as AxiosError<{
				message?: string;
				details?: string;
			}>;

			const statusCode = axiosError.response?.status;
			const errorMessage =
				axiosError.response?.data?.message ||
				axiosError.message ||
				'Server error';
			const errorDetails = axiosError.response?.data?.details;

			return {
				success: false,
				error: statusCode
					? `Server error (${statusCode}): ${errorMessage}`
					: errorMessage,
				details: errorDetails || 'Please try again later',
			};
		}

		// Handle other types of errors
		return {
			success: false,
			error:
				error instanceof Error ? error.message : 'Failed to mark attendance',
		};
	}
}
