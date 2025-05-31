'use server';

import { OwnerReqConfig } from '@/lib/AxiosInstance/ownerAxios';
import type { AmenityCategoryDefinition } from '@/lib/constants/amenities';

export interface GetAmenityCategoriesResponse {
  msg: string;
  categories: AmenityCategoryDefinition[];
}

export async function getAmenityCategories(): Promise<GetAmenityCategoriesResponse> {
  try {
    const ownerAxios = await OwnerReqConfig();
    const response = await ownerAxios.get('/gym/amenity-categories');
    return response.data;
  } catch (error) {
    console.error('Error fetching amenity categories:', error);
    throw error;
  }
}
