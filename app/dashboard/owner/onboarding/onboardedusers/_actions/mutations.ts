import { OwnerReqConfig } from '@/lib/AxiosInstance/ownerAxios';
import type { AxiosResponse } from 'axios';

interface UpdateActivePeriodData {
	userId: number;
	startDate: string | null;
	endDate: string | null;
}

interface UpdateActivePeriodResponse {
	msg: string;
	user: {
		id: number;
		name: string;
		startDate: string | null;
		endDate: string | null;
	};
}

type UpdateActivePeriodResult = 
	| { success: true; data: UpdateActivePeriodResponse }
	| { success: false; error: string };

export const updateActivePeriod = async (data: UpdateActivePeriodData): Promise<UpdateActivePeriodResult> => {
	const ownerAxios = await OwnerReqConfig();
	try {
		const response: AxiosResponse<UpdateActivePeriodResponse> =
			await ownerAxios.patch(`/onboarding/users/${data.userId}/activeperiod`, {
				startDate: data.startDate,
				endDate: data.endDate,
			});

		return { success: true, data: response.data };
	} catch (error: unknown) {
		console.error('Error updating active period:', error);
		return { 
			success: false, 
			error: error instanceof Error ? error.message : 'An unexpected error occurred'
		};
	}
};
