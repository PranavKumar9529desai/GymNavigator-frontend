'use client';

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import FetchGymDetailsSA from '../_actions/GetGymDetails';
import { getAllGymTabData } from '../_actions/get-gym-tab-data';
import type { Trainer } from '../_actions/get-gym-tab-data';
import { 
  updateGymOverview, 
  updateGymAmenities, 
  updateGymLocation, 
  updateGymPricing 
} from '../_actions/submit-gym-tabs-form';
import type { 
  UpdateAmenitiesRequest, 
  FitnessPlan, 
  AdditionalService,
  GymLocation,
  AmenityCategory
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

// Query Keys
export const gymQueryKeys = {
  all: ['gym'] as const,
  details: () => [...gymQueryKeys.all, 'details'] as const,
  tabData: () => [...gymQueryKeys.all, 'tabData'] as const,
  overview: () => [...gymQueryKeys.all, 'overview'] as const,
  amenities: () => [...gymQueryKeys.all, 'amenities'] as const,
  location: () => [...gymQueryKeys.all, 'location'] as const,
  pricing: () => [...gymQueryKeys.all, 'pricing'] as const,
} as const;

// Hook for gym basic details
export function useGymDetails() {
  return useQuery({
    queryKey: gymQueryKeys.details(),
    queryFn: FetchGymDetailsSA,
    staleTime: 1000 * 60 * 5, // 5 minutes
    refetchOnWindowFocus: false,
  });
}

// Hook for all gym tab data
export function useGymTabData() {
  return useQuery({
    queryKey: gymQueryKeys.tabData(),
    queryFn: getAllGymTabData,
    staleTime: 1000 * 60 * 2, // 2 minutes
    refetchOnWindowFocus: false,
  });
}

// Hook for updating gym overview with optimistic updates
export function useUpdateGymOverview() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: updateGymOverview,
    onMutate: async (newData) => {
      // Cancel outgoing refetches
      await queryClient.cancelQueries({ queryKey: gymQueryKeys.details() });

      // Snapshot previous value
      const previousData = queryClient.getQueryData(gymQueryKeys.details());

      // Optimistically update to the new value
      queryClient.setQueryData(gymQueryKeys.details(), (old: any) => ({
        ...old,
        ...newData,
      }));

      return { previousData };
    },
    onError: (err, newData, context) => {
      // Rollback on error
      if (context?.previousData) {
        queryClient.setQueryData(gymQueryKeys.details(), context.previousData);
      }
      // Toast will be handled by the form component
    },
    onSuccess: () => {
      // Toast will be handled by the form component
    },
    onSettled: () => {
      // Always refetch after error or success
      queryClient.invalidateQueries({ queryKey: gymQueryKeys.details() });
      queryClient.invalidateQueries({ queryKey: gymQueryKeys.tabData() });
    },
  });
}

// Hook for updating amenities with optimistic updates
export function useUpdateAmenities() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: updateGymAmenities,
    onMutate: async (newAmenities: UpdateAmenitiesRequest) => {
      // Cancel outgoing refetches
      await queryClient.cancelQueries({ queryKey: gymQueryKeys.tabData() });

      // Snapshot previous value
      const previousData = queryClient.getQueryData(gymQueryKeys.tabData());

      // Optimistically update amenities
      queryClient.setQueryData(gymQueryKeys.tabData(), (old: GymTabData | undefined) => {
        if (!old) return old;
        return {
          ...old,
          amenities: {
            ...old.amenities,
            selectedAmenities: convertAmenityKeysToFormData(newAmenities.amenities),
          },
        };
      });

      return { previousData };
    },
    onError: (err, newData, context) => {
      // Rollback on error
      if (context?.previousData) {
        queryClient.setQueryData(gymQueryKeys.tabData(), context.previousData);
      }
      // Toast will be handled by the form component
    },
    onSuccess: () => {
      // Toast will be handled by the form component
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: gymQueryKeys.tabData() });
    },
  });
}

// Hook for updating location with optimistic updates
export function useUpdateLocation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: updateGymLocation,
    onMutate: async (newLocation: GymLocation) => {
      await queryClient.cancelQueries({ queryKey: gymQueryKeys.tabData() });

      const previousData = queryClient.getQueryData(gymQueryKeys.tabData());

      // Optimistically update location
      queryClient.setQueryData(gymQueryKeys.tabData(), (old: GymTabData | undefined) => {
        if (!old) return old;
        return {
          ...old,
          location: {
            location: newLocation,
          },
        };
      });

      return { previousData };
    },
    onError: (err, newData, context) => {
      if (context?.previousData) {
        queryClient.setQueryData(gymQueryKeys.tabData(), context.previousData);
      }
      // Toast will be handled by the form component
    },
    onSuccess: () => {
      // Toast will be handled by the form component
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: gymQueryKeys.tabData() });
    },
  });
}

// Hook for updating pricing with optimistic updates
export function useUpdatePricing() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: updateGymPricing,
    onMutate: async (newPricing: { plans?: FitnessPlan[]; additionalServices?: AdditionalService[] }) => {
      await queryClient.cancelQueries({ queryKey: gymQueryKeys.tabData() });

      const previousData = queryClient.getQueryData(gymQueryKeys.tabData());

      // Optimistically update pricing
      queryClient.setQueryData(gymQueryKeys.tabData(), (old: GymTabData | undefined) => {
        if (!old) return old;
        return {
          ...old,
          pricing: {
            pricingPlans: newPricing.plans || old.pricing?.pricingPlans || [],
            additionalServices: newPricing.additionalServices || old.pricing?.additionalServices || [],
          },
        };
      });

      return { previousData };
    },
    onError: (err, newData, context) => {
      if (context?.previousData) {
        queryClient.setQueryData(gymQueryKeys.tabData(), context.previousData);
      }
      // Toast will be handled by the form component
    },
    onSuccess: () => {
      // Toast will be handled by the form component
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: gymQueryKeys.tabData() });
    },
  });
}

// Helper function to convert amenity keys back to form data format
function convertAmenityKeysToFormData(amenityKeys: string[]): Record<string, string[]> {
  // This would need to be implemented based on your amenity structure
  // For now, returning a simple mapping
  const result: Record<string, string[]> = {};
  
  // You'll need to implement the logic to group amenity keys by category
  // This is a placeholder implementation
  amenityKeys.forEach(key => {
    const category = 'amenities-services'; // Default category
    if (!result[category]) {
      result[category] = [];
    }
    result[category].push(key);
  });
  
  return result;
}

// Combined hook for all gym data operations
export function useGymOperations() {
  const gymDetails = useGymDetails();
  const gymTabData = useGymTabData();
  const updateOverview = useUpdateGymOverview();
  const updateAmenities = useUpdateAmenities();
  const updateLocation = useUpdateLocation();
  const updatePricing = useUpdatePricing();

  return {
    // Data
    gymDetails,
    gymTabData,
    
    // Mutations
    updateOverview,
    updateAmenities,
    updateLocation,
    updatePricing,
    
    // Combined loading state
    isLoading: gymDetails.isLoading || gymTabData.isLoading,
    
    // Combined error state
    error: gymDetails.error || gymTabData.error,
    
    // Any mutations pending
    isMutating: updateOverview.isPending || updateAmenities.isPending || 
                updateLocation.isPending || updatePricing.isPending,
  };
}
