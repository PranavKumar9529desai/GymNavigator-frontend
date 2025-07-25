'use server';

import { OwnerReqConfig } from '@/lib/AxiosInstance/ownerAxios';
import type { AxiosResponse } from 'axios';
import { revalidatePath } from 'next/cache';
import type {
	FitnessPlan,
	UpdateAmenitiesRequest,
	UpdateAmenitiesResponse,
	PricingFormData,
} from '../types/gym-types';

// Overview section update
export async function updateGymOverview(data: {
	gym_name: string;
	gym_logo: string;
	Email: string;
	phone_number: string;
}) {
	try {
		const ownerAxios = await OwnerReqConfig();
		const response = await ownerAxios.put('/gym/update-overview', data);

		// Revalidate the gym details pages
		revalidatePath('/dashboard/owner/gymdetails/viewgymdetails');
		revalidatePath('/dashboard/owner/gymdetails');

		return response.data;
	} catch (error) {
		console.error('Error updating gym overview:', error);
		throw error;
	}
}

// Amenities section update
export async function updateGymAmenities(
	data: UpdateAmenitiesRequest,
): Promise<UpdateAmenitiesResponse> {
	try {
		const ownerAxios = await OwnerReqConfig();
		const response: AxiosResponse<UpdateAmenitiesResponse> =
			await ownerAxios.put('/gym/update-amenities', data);

		// Revalidate the gym details pages
		revalidatePath('/dashboard/owner/gymdetails/viewgymdetails');
		revalidatePath('/dashboard/owner/gymdetails');

		return response.data;
	} catch (error) {
		console.error('Error updating gym amenities:', error);
		throw error;
	}
}

// Location section update
export async function updateGymLocation(data: {
	street: string;
	city: string;
	state: string;
	postalCode: string;
	country: string;
	latitude: number;
	longitude: number;
}) {
	try {
		const ownerAxios = await OwnerReqConfig();
		const response = await ownerAxios.put('/gym/update-location', data);

		// Revalidate the gym details pages
		revalidatePath('/dashboard/owner/gymdetails/viewgymdetails');
		revalidatePath('/dashboard/owner/gymdetails');

		return response.data;
	} catch (error) {
		console.error('Error updating gym location:', error);
		throw error;
	}
}

// Pricing section update
export async function updateGymPricing(data: PricingFormData) {
	try {
		const ownerAxios = await OwnerReqConfig();
		const response = await ownerAxios.put('/gym/update-pricing', data);

		// Revalidate the gym details pages
		revalidatePath('/dashboard/owner/gymdetails/viewgymdetails');
		revalidatePath('/dashboard/owner/gymdetails');
		revalidatePath('/dashboard/owner/gymdetails/viewgymdetails/pricing');

		return response.data;
	} catch (error) {
		console.error('Error updating gym pricing:', error);
		throw error;
	}
}
