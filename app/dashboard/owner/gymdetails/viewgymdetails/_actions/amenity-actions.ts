'use server';

import { OwnerReqConfig } from '@/lib/AxiosInstance/ownerAxios';
import type { AxiosResponse } from 'axios';
import type { AmenityCategory } from '../types/gym-types';

// API Response type for amenities
interface AmenitiesApiResponse {
  msg: string;
  categories: AmenityCategory[];
  selectedAmenities: Record<string, string[]>;
}

// Simplified amenities data function that fetches both categories and selected amenities
export async function getAmenitiesData(): Promise<{
  categories?: AmenityCategory[];
  selectedAmenities?: Record<string, string[]>;
  error?: string;
}> {
  try {
    const ownerAxios = await OwnerReqConfig();
    
    const response: AxiosResponse<AmenitiesApiResponse> = await ownerAxios.get('/gym/amenities');
    
    if (response.data.msg === 'success') {
      console.log('Amenities data fetched successfully:', {
        categories: response.data.categories?.length,
        selectedAmenities: response.data.selectedAmenities
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
