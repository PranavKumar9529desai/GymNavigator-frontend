// Type definitions for gym data management
// Note: Data fetching is now handled server-side in page.tsx components

import type { Trainer } from '../_actions/get-gym-tab-data';
import type {
	FitnessPlan,
	AdditionalService,
	GymLocation,
	AmenityCategory,
} from '../types/gym-types';

// Define GymTabData type based on getAllGymTabData return type
export type GymTabData = {
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
};

// Legacy query keys - kept for reference but no longer used
export const gymQueryKeys = {
	all: ['gym'] as const,
	details: () => [...gymQueryKeys.all, 'details'] as const,
	tabData: () => [...gymQueryKeys.all, 'tabData'] as const,
	overview: () => [...gymQueryKeys.all, 'overview'] as const,
	amenities: () => [...gymQueryKeys.all, 'amenities'] as const,
	location: () => [...gymQueryKeys.all, 'location'] as const,
	pricing: () => [...gymQueryKeys.all, 'pricing'] as const,
} as const;
