'use server';
import { OwnerReqConfig } from '@/lib/AxiosInstance/ownerAxios';
import type { AxiosResponse } from 'axios';

interface UpdateUserResponseType {
	msg: string;
	user: {
		id: number;
		name: string;
		isallowed: boolean;
		Validperiod: {
			id: number;
			shift: string;
			startDate: Date;
			endDate: Date;
		} | null;
	};
}

export const UpdateUserActivePeriod = async ({
	userId,
	startDate,
	endDate,
	shift,
}: {
	userId: number;
	startDate: Date;
	endDate: Date;
	shift: string;
}) => {
	const OwnerAxios = await OwnerReqConfig();
	try {
		const response: AxiosResponse<UpdateUserResponseType> =
			await OwnerAxios.post('/updateuservalidity', {
				userId,
				startDate,
				endDate,
				shift,
			});
		console.log(response.data);
		return response.data;
	} catch (error) {
		console.error(error);
		return { msg: 'Error', user: null };
	}
};
