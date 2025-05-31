import type { GymAmenityFromDB } from '../types/gym-types';
import { PREDEFINED_AMENITY_CATEGORIES, findAmenityByKey } from '@/lib/constants/amenities';

/**
 * Convert database amenities to frontend format for the amenities form
 * @param dbAmenities - Amenities from database
 * @returns Record<categoryKey, amenityKeys[]>
 */
export function convertDbAmenitiesToFormData(dbAmenities: GymAmenityFromDB[]): Record<string, string[]> {
  const result: Record<string, string[]> = {};

  // Initialize all categories with empty arrays
  PREDEFINED_AMENITY_CATEGORIES.forEach(category => {
    result[category.key] = [];
  });

  // Process each database amenity
  dbAmenities.forEach(gymAmenity => {
    const amenityName = gymAmenity.amenity.name;
    
    // Find the predefined amenity by key (name in DB corresponds to key in predefined)
    const predefinedAmenity = findAmenityByKey(amenityName);
    
    if (predefinedAmenity) {
      // Add to the appropriate category
      if (!result[predefinedAmenity.categoryKey]) {
        result[predefinedAmenity.categoryKey] = [];
      }
      result[predefinedAmenity.categoryKey].push(amenityName);
    } else {
      // Handle legacy or custom amenities - try to match by category name
      const categoryName = gymAmenity.amenity.amenityType.name;
      const predefinedCategory = PREDEFINED_AMENITY_CATEGORIES.find(cat => cat.key === categoryName);
      
      if (predefinedCategory) {
        if (!result[predefinedCategory.key]) {
          result[predefinedCategory.key] = [];
        }
        result[predefinedCategory.key].push(amenityName);
      } else {
        // Put in a default "other" category or create one
        if (!result['amenities-services']) {
          result['amenities-services'] = [];
        }
        result['amenities-services'].push(amenityName);
      }
    }
  });

  return result;
}

/**
 * Convert form data back to amenity keys for API submission
 * @param formData - Record<categoryKey, amenityKeys[]>
 * @returns Array of amenity keys
 */
export function convertFormDataToAmenityKeys(formData: Record<string, string[]>): string[] {
  const amenityKeys: string[] = [];
  
  Object.values(formData).forEach(categoryAmenities => {
    amenityKeys.push(...categoryAmenities);
  });
  
  return amenityKeys;
}
