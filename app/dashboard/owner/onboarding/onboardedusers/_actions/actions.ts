'use server';

import { OwnerReqConfig } from '@/lib/AxiosInstance/ownerAxios';
import { revalidatePath } from 'next/cache';

interface UpdateActivePeriodData {
	userId: number;
	startDate: string | null;
	endDate: string | null;
}

export const updateActivePeriod = async (data: UpdateActivePeriodData) => {
	try {
		const ownerAxios = await OwnerReqConfig();
		await ownerAxios.patch(`/onboarding/users/${data.userId}/activeperiod`, {
			startDate: data.startDate,
			endDate: data.endDate,
		});
		revalidatePath('/dashboard/owner/onboarding/onboardedusers');
		return { success: true };
	} catch (error) {
		console.error('Error updating active period:', error);
		return { success: false, error: 'Failed to update active period.' };
	}
};
