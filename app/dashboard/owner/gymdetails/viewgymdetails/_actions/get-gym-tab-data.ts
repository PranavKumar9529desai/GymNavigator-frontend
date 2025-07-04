'use server';

import { OwnerReqConfig } from '@/lib/AxiosInstance/ownerAxios';
import type { AxiosResponse } from 'axios';
import type {
	FitnessPlan,
	AdditionalService,
	AmenityCategory,
	GymLocation,
} from '../types/gym-types';

// Define types for trainers based on the overview tab requirements
export interface TrainerClient {
	id: string | number;
	name: string;
}

export interface Trainer {
	id: string | number;
	name: string;
	assignedClients: TrainerClient[];
}

// API Response types
interface TrainersApiResponse {
	msg: string;
	trainers: {
		id: number;
		name: string;
		assignedClients: number;
		shift: 'Morning' | 'Evening';
		image: string;
		users?: { id: number; name: string }[];
	}[];
}

interface AmenitiesApiResponse {
	msg: string;
	categories: AmenityCategory[];
	selectedAmenities: Record<string, string[]>;
}

interface LocationApiResponse {
	msg: string;
	location: GymLocation;
}

interface PricingApiResponse {
	msg: string;
	pricingPlans: FitnessPlan[];
	additionalServices: AdditionalService[];
}

// Overview data - Get trainers and their assigned clients
export async function getOverviewData(): Promise<{
	trainersData?: Trainer[];
	error?: string;
}> {
	try {
		const ownerAxios = await OwnerReqConfig();

		// Fetch trainers with their assigned users
		const response: AxiosResponse<TrainersApiResponse> = await ownerAxios.get(
			'/trainer/fetchtrainers',
		);

		if (response.data.msg === 'success' && response.data.trainers) {
			// Transform the API response to match the expected format
			const trainersData: Trainer[] = response.data.trainers.map((trainer) => ({
				id: trainer.id,
				name: trainer.name,
				assignedClients:
					trainer.users?.map((user) => ({
						id: user.id,
						name: user.name,
					})) || [],
			}));

			return { trainersData };
		}

		return { error: 'Failed to fetch trainers data' };
	} catch (error) {
		console.error('Error fetching overview data:', error);
		return { error: 'An error occurred while fetching overview data' };
	}
}

// Amenities data - Get categories and selected amenities
export async function getAmenitiesData(): Promise<{
	categories?: AmenityCategory[];
	selectedAmenities?: Record<string, string[]>;
	error?: string;
}> {
	try {
		const ownerAxios = await OwnerReqConfig();

		const response: AxiosResponse<AmenitiesApiResponse> =
			await ownerAxios.get('/gym/amenities');

		// console.log('Amenities API response:', response.data);

		if (response.data.msg === 'success') {
			console.log('Amenities data fetched successfully:', {
				categories: response.data.categories?.length,
				selectedAmenities: response.data.selectedAmenities,
			});
			return {
				categories: response.data.categories,
				selectedAmenities: response.data.selectedAmenities,
			};
		}

		return { error: 'Failed to fetch amenities data' };
	} catch (error) {
		console.error('Error fetching amenities data:', error);
		return { error: 'An error occurred while fetching amenities data' };
	}
}

// Location data - Get gym location details
export async function getLocationData(): Promise<{
	location?: GymLocation;
	error?: string;
}> {
	try {
		const ownerAxios = await OwnerReqConfig();

		const response: AxiosResponse<LocationApiResponse> =
			await ownerAxios.get('/gym/location');

		console.log('Location API response:', response.data);

		if (response.data.msg === 'success' && response.data.location) {
			console.log(
				'Location data fetched successfully:',
				response.data.location,
			);
			return { location: response.data.location };
		}

		console.log('Location API returned success but no location data');
		return { error: 'Failed to fetch location data' };
	} catch (error) {
		console.error('Error fetching location data:', error);
		return { error: 'An error occurred while fetching location data' };
	}
}

// Pricing data - Get fitness plans and additional services
export async function getPricingData(): Promise<{
	pricingPlans?: FitnessPlan[];
	additionalServices?: AdditionalService[];
	error?: string;
}> {
	try {
		const ownerAxios = await OwnerReqConfig();

		const response: AxiosResponse<PricingApiResponse> =
			await ownerAxios.get('/gym/pricing');

		if (response.data.msg === 'success') {
			return {
				pricingPlans: response.data.pricingPlans,
				additionalServices: response.data.additionalServices,
			};
		}
		console.log('Pricing API returned', response.data);
		return { error: 'Failed to fetch pricing data' };
	} catch (error) {
		console.error('Error fetching pricing data:', error);
		return { error: 'An error occurred while fetching pricing data' };
	}
}

// Combined function to get all gym tab data
export async function getAllGymTabData(): Promise<{
	overview?: { trainersData?: Trainer[] };
	amenities?: {
		categories?: AmenityCategory[];
		selectedAmenities?: Record<string, string[]>;
	};
	location?: { location?: GymLocation };
	pricing?: {
		pricingPlans?: FitnessPlan[];
		additionalServices?: AdditionalService[];
	};
	errors?: string[];
}> {
	try {
		// Fetch all data in parallel for better performance
		const [overviewResult, amenitiesResult, locationResult, pricingResult] =
			await Promise.all([
				getOverviewData(),
				getAmenitiesData(),
				getLocationData(),
				getPricingData(),
			]);

		const errors: string[] = [];
		// biome-ignore lint/suspicious/noExplicitAny: Result object has dynamic structure based on different tab data
		const result: any = {};

		// Process overview data
		if (overviewResult.error) {
			errors.push(`Overview: ${overviewResult.error}`);
		} else {
			result.overview = { trainersData: overviewResult.trainersData };
		}

		// Process amenities data
		if (amenitiesResult.error) {
			errors.push(`Amenities: ${amenitiesResult.error}`);
		} else {
			result.amenities = {
				categories: amenitiesResult.categories,
				selectedAmenities: amenitiesResult.selectedAmenities,
			};
		}

		// Process location data
		if (locationResult.error) {
			errors.push(`Location: ${locationResult.error}`);
		} else {
			result.location = { location: locationResult.location };
		}

		// Process pricing data
		if (pricingResult.error) {
			console.error('Pricing data error:', pricingResult.error);
			errors.push(`Pricing: ${pricingResult.error}`);
		} else {
			result.pricing = {
				pricingPlans: pricingResult.pricingPlans,
				additionalServices: pricingResult.additionalServices,
			};
		}

		if (errors.length > 0) {
			result.errors = errors;
		}
		console.log('All gym tab data fetched successfully:', result);
		return result;
	} catch (error) {
		console.error('Error fetching all gym tab data:', error);
		return {
			errors: ['An unexpected error occurred while fetching gym data'],
		};
	}
}
