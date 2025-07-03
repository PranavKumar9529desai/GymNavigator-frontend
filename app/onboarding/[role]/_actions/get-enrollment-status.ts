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

export async function getEnrollmentStatus(role?: string): Promise<GetEnrollmentStatusType> {
	'use server';

	try {
		let axiosInstance;
		let endpoint: string;

		// Determine which axios instance and endpoint to use based on role
		if (role === 'trainer') {
			// Import trainer axios configuration
			const { TrainerReqConfig } = await import('@/lib/AxiosInstance/trainerAxios');
			axiosInstance = await TrainerReqConfig();
			endpoint = '/enrollmentstatus';
		} else {
			// Default to client configuration for 'client' role or when no role is specified
			const { ClientReqConfig } = await import('@/lib/AxiosInstance/clientAxios');
			axiosInstance = await ClientReqConfig();
			endpoint = '/gym/enrollmentstatus';
		}

		// Make request to the enrollment status endpoint
		const response = await axiosInstance.get<EnrollmentResponse>(endpoint);

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
