'use server';
import { ClientReqConfig } from '@/lib/AxiosInstance/clientAxios';

interface IsDietAssignedResponse {
	success: boolean;
	msg: string;
	data?: {
		isAssigned: boolean;
	};
	error?: string;
}

export interface IsDietAssignedData {
	isAssigned: boolean;
}

export const checkIsDietAssigned = async (): Promise<IsDietAssignedData> => {
	try {
		const clientAxios = await ClientReqConfig();
		const response =
			await clientAxios.get<IsDietAssignedResponse>('/diet/is-assigned');

		if (
			!response.data.success ||
			typeof response.data.data?.isAssigned === 'undefined'
		) {
			console.error(
				'Failed to fetch diet assignment status:',
				response.data.error,
			);
			return { isAssigned: false };
		}

		return { isAssigned: response.data.data.isAssigned };
	} catch (error) {
		console.error('Error fetching diet assignment status:', error);
		return { isAssigned: false };
	}
};
