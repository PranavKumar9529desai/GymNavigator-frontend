'use server';
import { OwnerReqConfig } from '@/lib/AxiosInstance/ownerAxios';
import type { AxiosResponse } from 'axios';

interface GymResponse {
	msg: string;
	gym: {
		gym_name: string;
		gym_logo: string;
		address: string;
		phone_number: string;
		Email: string;
	};
}

export default async function UpdateGymDetails(
	formData: string,
	image: string,
) {
	try {
		const formdata = JSON.parse(formData);
		const ownerAxios = await OwnerReqConfig();
		const payload = {
			gym_name: formdata.gym_name,
			gym_logo: image,
			address: formdata.address,
			phone_number: formdata.phone_number,
			Email: formdata.Email,
		};

		const response: AxiosResponse<GymResponse> = await ownerAxios.put(
			'/gym/updategymdetails',
			payload,
			{
				headers: {
					'Content-Type': 'application/json',
				},
			},
		);

		if (response.status === 200) {
			return response.data.gym;
		}
		return null;
	} catch (error) {
		console.error('Error updating gym details:', error);
		return null;
	}
}
