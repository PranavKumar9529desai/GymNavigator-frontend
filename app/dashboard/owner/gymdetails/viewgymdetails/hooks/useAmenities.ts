
import { useCallback } from 'react';
import { useAmenitiesStore } from '../store/ammenities-store';
import { getAmenitiesData } from '../_actions/amenity-actions';
import { updateGymAmenities } from '../_actions/submit-gym-tabs-form';
import { toast } from 'sonner';

/**
 * Custom hook for managing amenities functionality
 * Provides a clean interface for amenities operations
 */
export const useAmenities = () => {
  const store = useAmenitiesStore();
  
  // Load amenities data from server
  const loadAmenitiesData = useCallback(async () => {
    try {
      store.setLoading(true);
      store.setError(null);
      
      const result = await getAmenitiesData();
      
      if (result.error) {
        store.setError(result.error);
        return false;
      }
      
      const fetchedCategories = result.categories || [];
      const selectedAmenities = result.selectedAmenities || {};
      
      console.log('🔍 Fetched amenities data:', {
        categories: fetchedCategories.length,
        selectedAmenities
      });

      // Initialize state from fetched data
      const catState: Record<string, boolean> = {};
      const amenityState: Record<string, Record<string, boolean>> = {};
      
      fetchedCategories.forEach((cat) => {
        const selected = selectedAmenities[cat.key] || [];
        console.log(`📂 Category ${cat.key}:`, { selected, hasAmenities: selected.length > 0 });
        
        catState[cat.key] = selected.length > 0;
        amenityState[cat.key] = {};
        
        cat.amenities.forEach((amenity) => {
          const isSelected = selected.includes(amenity.key);
          amenityState[cat.key][amenity.key] = isSelected;
          if (isSelected) {
            console.log(`  ✅ Selected: ${amenity.key}`);
          }
        });
      });
      
      console.log('🎯 Final state:', { catState, amenityState });
      
      // Initialize the Zustand store
      store.initializeAmenities(fetchedCategories, catState, amenityState);
      return true;
      
    } catch (err) {
      console.error('Error fetching amenities data:', err);
      store.setError('Failed to load amenities data');
      return false;
    } finally {
      store.setLoading(false);
    }
  }, [store]);

  // Save amenities to server
  const saveAmenities = useCallback(async (): Promise<boolean> => {
    try {
      store.setPending(true);
      
      // Get all selected amenities using the store helper
      const allSelectedAmenities = store.getAllSelectedAmenities();
      
      await updateGymAmenities({ amenities: allSelectedAmenities });
      toast.success("Amenities updated successfully!");
      return true;
      
    } catch (error) {
      console.error('Error updating amenities:', error);
      toast.error("Failed to update amenities. Please try again.");
      return false;
    } finally {
      store.setPending(false);
    }
  }, [store]);

  // Toggle category enabled/disabled
  const toggleCategory = useCallback((categoryKey: string) => {
    console.log('🔄 Category switch triggered for:', categoryKey);
    store.toggleCategory(categoryKey);
  }, [store]);

  // Toggle individual amenity
  const toggleAmenity = useCallback((categoryKey: string, amenityKey: string) => {
    store.toggleAmenity(categoryKey, amenityKey);
  }, [store]);

  // Get computed stats
  const stats = {
    activeCategoriesCount: store.getActiveCategoriesCount(),
    totalSelectedCount: store.getTotalSelectedAmenitiesCount(),
    totalAmenitiesCount: store.categories.reduce((acc, cat) => acc + cat.amenities.length, 0),
    getSelectedForCategory: store.getSelectedAmenitiesForCategory,
  };

  return {
    // State
    categories: store.categories,
    enabledCategories: store.enabledCategories,
    checkedAmenities: store.checkedAmenities,
    isLoading: store.isLoading,
    error: store.error,
    isPending: store.isPending,
    
    // Actions
    loadAmenitiesData,
    saveAmenities,
    toggleCategory,
    toggleAmenity,
    reset: store.reset,
    
    // Computed values
    stats,
  };
};
