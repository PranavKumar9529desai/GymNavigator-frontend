'use server';

import { OwnerReqConfig } from '@/lib/AxiosInstance/ownerAxios';
import type { AxiosError } from 'axios';

export interface PricingPlanFeature {
	description: string;
}

export interface PlanTimeSlot {
	startTime: string;
	endTime: string;
}

export interface PricingPlan {
	id?: number;
	name: string;
	description: string;
	price: string;
	duration: string;
	features: string[];
	isFeatured?: boolean;
	color?: string;
	icon?: string;
	maxMembers?: number;
	sortOrder?: number;
	popular?: boolean;
	sessionDuration?: number; // in minutes
	genderCategory?: 'MALE' | 'FEMALE' | 'OTHER' | 'ALL';
	minAge?: number;
	maxAge?: number;
	categories?: string[];
	planTimeSlots?: PlanTimeSlot[];
}

export interface AdditionalService {
	name: string;
	price: string;
	duration: string;
	description?: string;
}

export interface PricingFormData {
	plans?: PricingPlan[];
	additionalServices?: AdditionalService[];
}

export interface ApiResponse<T = unknown> {
	success: boolean;
	data?: T;
	error?: string;
}

export async function createPricingPlan(
	pricingData: PricingFormData,
): Promise<ApiResponse> {
	'use server';

	const ownerAxios = await OwnerReqConfig();

	try {
		const response = await ownerAxios.post('/gym/create-pricing', pricingData);

		if (response.status === 200) {
			return {
				success: true,
				data: response.data,
			};
		}
		throw new Error(response.data.msg || 'Failed to create pricing plan');
	} catch (error: unknown) {
		const axiosError = error as AxiosError<{ msg: string }>;
		console.error('Error creating pricing plan:', axiosError);
		return {
			success: false,
			error: axiosError.response?.data?.msg || 'Failed to create pricing plan',
		};
	}
}

export async function updatePricingPlan(
	pricingData: PricingFormData,
): Promise<ApiResponse> {
	'use server';

	const ownerAxios = await OwnerReqConfig();

	try {
		const response = await ownerAxios.put('/gym/update-pricing', pricingData);

		if (response.status === 200) {
			return {
				success: true,
				data: response.data,
			};
		}
		throw new Error(response.data.msg || 'Failed to update pricing plan');
	} catch (error: unknown) {
		const axiosError = error as AxiosError<{ msg: string }>;
		console.error('Error updating pricing plan:', axiosError);
		return {
			success: false,
			error: axiosError.response?.data?.msg || 'Failed to update pricing plan',
		};
	}
}
