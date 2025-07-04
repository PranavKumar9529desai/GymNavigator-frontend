'use server';
import { ClientReqConfig } from '@/lib/AxiosInstance/clientAxios';

interface IsWorkoutAssignedResponse {
	success: boolean;
	msg: string;
	data?: {
		isAssigned: boolean;
	};
	error?: string;
}

export interface IsWorkoutAssignedData {
	isAssigned: boolean;
}

export const checkIsWorkoutAssigned =
	async (): Promise<IsWorkoutAssignedData> => {
		try {
			const clientAxios = await ClientReqConfig();
			const response = await clientAxios.get<IsWorkoutAssignedResponse>(
				'/workout/myworkouts/is-assigned',
			);

			if (
				!response.data.success ||
				typeof response.data.data?.isAssigned === 'undefined'
			) {
				console.error(
					'Failed to fetch workout assignment status:',
					response.data.error,
				);
				return { isAssigned: false };
			}

			return { isAssigned: response.data.data.isAssigned };
		} catch (error) {
			console.error('Error fetching workout assignment status:', error);
			return { isAssigned: false };
		}
	};
