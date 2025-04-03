interface GetEnrollmentStatusType {
	msg: string;
	isEnrolled: boolean;
}

interface GymDetails {
	id: number;
	name: string;
	logo: string;
}

interface EnrollmentResponse {
	success: boolean;
	data?: {
		isEnrolled: boolean;
		gymDetails: GymDetails | null;
		msg: string;
	};
	error?: string;
}

export async function getEnrollmentStatus(): Promise<GetEnrollmentStatusType> {
	'use server';

	try {
		// Import client axios configuration
		const { ClientReqConfig } = await import('@/lib/AxiosInstance/clientAxios');

		// Initialize client axios
		const clientAxios = await ClientReqConfig();

		// Make request to the enrollment status endpoint
		const response = await clientAxios.get<EnrollmentResponse>(
			'/gym/enrollmentstatus',
		);

		if (!response.data.success || !response.data.data) {
			console.error('Failed to fetch enrollment status:', response.data.error);
			return {
				isEnrolled: false,
				msg: response.data.error || 'Failed to check enrollment status',
			};
		}

		// Return the enrollment status and message
		return {
			isEnrolled: response.data.data.isEnrolled,
			msg: response.data.data.msg,
		};
	} catch (error) {
		console.error('Error fetching enrollment status:', error);
		return {
			isEnrolled: false,
			msg: 'Failed to connect to server to check enrollment status',
		};
	}
}
