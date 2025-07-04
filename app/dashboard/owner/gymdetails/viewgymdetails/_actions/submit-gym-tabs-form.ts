'use server';

import { OwnerReqConfig } from '@/lib/AxiosInstance/ownerAxios';
import type { AxiosResponse } from 'axios';
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
		return response.data;
	} catch (error) {
		console.error('Error updating gym amenities:', error);
		throw error;
	}
}

// Location section update
export async function updateGymLocation(data: {
	address: string;
	city: string;
	state: string;
	zipCode: string;
	country?: string;
	lat?: number;
	lng?: number;
}) {
	try {
		const ownerAxios = await OwnerReqConfig();
		const response = await ownerAxios.put('/gym/update-location', data);
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
		return response.data;
	} catch (error) {
		console.error('Error updating gym pricing:', error);
		throw error;
	}
}
