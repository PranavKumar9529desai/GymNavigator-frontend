'use server';

import { ClientReqConfig } from '@/lib/AxiosInstance/clientAxios';

export interface GymDetailsData {
	gym: {
		id: number;
		gym_name: string;
		gym_logo: string;
		phone_number: string;
		Email: string;
		address: {
			street: string;
			city: string;
			state: string;
			postalCode: string;
			country: string;
			latitude: number;
			longitude: number;
		} | null;
		amenities: Array<{
			amenity: {
				id: number;
				name: string;
				description: string | null;
				amenityType: {
					name: string;
					description: string | null;
				};
			};
		}>;
		plans: Array<{
			id: number;
			name: string;
			description: string | null;
			price: string;
			duration: string;
			isFeatured: boolean | null;
			color: string | null;
			icon: string | null;
			features: Array<{
				description: string;
			}>;
		}>;
		additionalServices: Array<{
			id: number;
			name: string;
			price: string;
			duration: string;
			description: string | null;
		}>;
	};
	trainer: {
		id: number;
		name: string;
		email: string;
		image: string | null;
		rating: number | null;
		specializations: string | null;
		description: string | null;
		contactNumber: string | null;
		shift: string | null;
	} | null;
	membership: {
		validPeriod: {
			startDate: string;
			endDate: string;
			shift: string;
		} | null;
	};
	attendanceHistory: Array<{
		date: string;
		attended: boolean;
		scanTime: string;
	}>;
}

export async function getGymDetails(): Promise<GymDetailsData | null> {
	try {
		const clientAxios = await ClientReqConfig();
		const response = await clientAxios.get('/dashboard/gym-details');

		if (response.status === 200) {
			return response.data;
		}

		return null;
	} catch (error) {
		console.error('Error fetching gym details:', error);
		return null;
	}
}
