'use server';
import type { GymAtomType } from '@/app/state/Atoms/gymAtom';
import { TrainerReqConfig } from '@/lib/AxiosInstance/trainerAxios';
import type { AxiosResponse } from 'axios';
interface responseType {
	success: boolean;
	msg: string;
}
export const VerifyAuthToken = async (gym: GymAtomType, authToken: string) => {
	try {
		const trainerAxios = await TrainerReqConfig();
		const response: AxiosResponse<responseType> = await trainerAxios.post(
			'/authtokenverify',
			{
				gymname: gym.name,
				gymid: gym.id,
				authToken: authToken,
			},
		);
		const data = {
			msg: response.data.msg,
			success: response.data.success,
		};
		console.log('data is this', data);
		return data;
	} catch (error) {
		console.error('Error verifying token:', error);
		return { success: false, msg: 'Error verifying token' };
	}
};
