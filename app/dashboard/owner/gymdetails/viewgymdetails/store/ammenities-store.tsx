
import { create } from 'zustand';
import { devtools } from 'zustand/middleware';
import type { AmenityCategory } from '../types/gym-types';

// State interface
interface AmenitiesState {
  // Data
  categories: AmenityCategory[];
  enabledCategories: Record<string, boolean>;
  checkedAmenities: Record<string, Record<string, boolean>>;
  
  // Loading and error states
  isLoading: boolean;
  error: string | null;
  isPending: boolean;
  
  // Actions
  initializeAmenities: (
    categories: AmenityCategory[], 
    enabledCategories: Record<string, boolean>, 
    checkedAmenities: Record<string, Record<string, boolean>>
  ) => void;
  toggleCategory: (categoryKey: string) => void;
  toggleAmenity: (categoryKey: string, amenityKey: string) => void;
  setLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;
  setPending: (pending: boolean) => void;
  reset: () => void;
  
  // Computed getters
  getActiveCategoriesCount: () => number;
  getTotalSelectedAmenitiesCount: () => number;
  getSelectedAmenitiesForCategory: (categoryKey: string) => number;
  getAllSelectedAmenities: () => string[];
}

const initialState = {
  categories: [],
  enabledCategories: {},
  checkedAmenities: {},
  isLoading: true,
  error: null,
  isPending: false,
};

export const useAmenitiesStore = create<AmenitiesState>()(
  devtools(
    (set, get) => ({
      ...initialState,

      // Initialize store with fetched data
      initializeAmenities: (categories, enabledCategories, checkedAmenities) => {
        console.log('🏁 Initializing amenities store', { categories: categories.length, enabledCategories, checkedAmenities });
        set({
          categories,
          enabledCategories,
          checkedAmenities,
          isLoading: false,
          error: null,
        }, false, 'initializeAmenities');
      },

      // Toggle category enabled/disabled
      toggleCategory: (categoryKey) => {
        const state = get();
        const isCurrentlyEnabled = state.enabledCategories[categoryKey];
        
        console.log(`🔄 Toggling category ${categoryKey}: ${isCurrentlyEnabled} -> ${!isCurrentlyEnabled}`);
        
        set({
          enabledCategories: {
            ...state.enabledCategories,
            [categoryKey]: !isCurrentlyEnabled,
          },
          checkedAmenities: {
            ...state.checkedAmenities,
            // Clear amenities when disabling category
            [categoryKey]: isCurrentlyEnabled ? {} : state.checkedAmenities[categoryKey] || {},
          },
        }, false, 'toggleCategory');
      },

      // Toggle individual amenity
      toggleAmenity: (categoryKey, amenityKey) => {
        const state = get();
        const currentCategoryAmenities = state.checkedAmenities[categoryKey] || {};
        const isCurrentlyChecked = currentCategoryAmenities[amenityKey];
        
        console.log(`🎯 Toggling amenity ${amenityKey} in ${categoryKey}: ${isCurrentlyChecked} -> ${!isCurrentlyChecked}`);
        
        set({
          checkedAmenities: {
            ...state.checkedAmenities,
            [categoryKey]: {
              ...currentCategoryAmenities,
              [amenityKey]: !isCurrentlyChecked,
            },
          },
        }, false, 'toggleAmenity');
      },

      // Set loading state
      setLoading: (loading) => {
        set({ isLoading: loading }, false, 'setLoading');
      },

      // Set error state
      setError: (error) => {
        set({ error }, false, 'setError');
      },

      // Set pending state (for form submission)
      setPending: (pending) => {
        set({ isPending: pending }, false, 'setPending');
      },

      // Reset store to initial state
      reset: () => {
        set(initialState, false, 'reset');
      },

      // Computed getters
      getActiveCategoriesCount: () => {
        const state = get();
        return Object.values(state.enabledCategories).filter(Boolean).length;
      },

      getTotalSelectedAmenitiesCount: () => {
        const state = get();
        let total = 0;
        Object.entries(state.checkedAmenities).forEach(([categoryKey, amenities]) => {
          if (state.enabledCategories[categoryKey]) {
            total += Object.values(amenities).filter(Boolean).length;
          }
        });
        return total;
      },

      getSelectedAmenitiesForCategory: (categoryKey) => {
        const state = get();
        return Object.values(state.checkedAmenities[categoryKey] || {}).filter(Boolean).length;
      },

      getAllSelectedAmenities: () => {
        const state = get();
        const allSelectedAmenities: string[] = [];
        Object.entries(state.checkedAmenities).forEach(([categoryKey, amenities]) => {
          if (state.enabledCategories[categoryKey]) {
            Object.entries(amenities).forEach(([amenityKey, isChecked]) => {
              if (isChecked) {
                allSelectedAmenities.push(amenityKey);
              }
            });
          }
        });
        return allSelectedAmenities;
      },
    }),
    {
      name: 'amenities-store',
    }
  )
);