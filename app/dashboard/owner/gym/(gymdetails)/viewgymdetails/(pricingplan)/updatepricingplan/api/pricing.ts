'use server';
import { OwnerReqConfig } from '@/lib/AxiosInstance/ownerAxios';
import type { AxiosResponse } from 'axios';
import type {
	GymData,
	FitnessPlan,
	AdditionalService,
} from '../types/pricing-types';

// Fetch gym details
export async function fetchGymDetails(): Promise<GymData | null> {
	try {
		const ownerAxios = await OwnerReqConfig();
		const response: AxiosResponse<{ msg: string; gym: GymData }> =
			await ownerAxios.get('/gym/gymdetails');
		return response.data.gym;
	} catch (err) {
		console.error('Error fetching gym details:', err);
		return null;
	}
}

// Fetch pricing data
export async function fetchPricingData(): Promise<{
	pricingPlans?: FitnessPlan[];
	additionalServices?: AdditionalService[];
	error?: string;
}> {
	try {
		const ownerAxios = await OwnerReqConfig();
		const response: AxiosResponse<{
			msg: string;
			plans: FitnessPlan[];
			additionalServices: AdditionalService[];
		}> = await ownerAxios.get('/gym/pricing');
		if (response.data.msg === 'success') {
			return {
				pricingPlans: response.data.plans,
				additionalServices: response.data.additionalServices,
			};
		}
		return { error: 'Failed to fetch pricing data' };
	} catch (error) {
		console.error('Error fetching pricing data:', error);
		return { error: 'An error occurred while fetching pricing data' };
	}
}
