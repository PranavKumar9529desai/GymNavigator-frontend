"use client";

import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import type { AmenityCategory } from "../../types/gym-types";
import { useState, useEffect, useTransition } from 'react';
import { Switch } from "@/components/ui/switch";
import { Checkbox } from "@/components/ui/checkbox";
import { Button } from "@/components/ui/button";
import { updateGymAmenities } from "../../_actions/submit-gym-tabs-form";
import { getAmenitiesData } from "../../_actions/amenity-actions";
import { toast } from "sonner";
import { Check, Loader2 } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

// Simplified props interface
interface AmenitiesEditFormProps {
  onSave?: () => void;
  onCancel?: () => void;
}

export function AmenitiesEditForm({
  onSave,
  onCancel,
}: AmenitiesEditFormProps) {
  // Local state for editing
  const [categories, setCategories] = useState<AmenityCategory[]>([]);
  const [enabledCategories, setEnabledCategories] = useState<Record<string, boolean>>({});
  const [checkedAmenities, setCheckedAmenities] = useState<Record<string, Record<string, boolean>>>({});
  const [isPending, startTransition] = useTransition();
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Fetch amenities data on component mount
  useEffect(() => {
    const fetchAmenitiesData = async () => {
      try {
        setIsLoading(true);
        setError(null);
        
        const result = await getAmenitiesData();
        
        if (result.error) {
          setError(result.error);
          return;
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
              console.log(`✅ Amenity ${amenity.key} is selected in category ${cat.key}`);
            }
          });
        });
        
        console.log('🎯 Final state:', { catState, amenityState });
        setCategories(fetchedCategories);
        setEnabledCategories(catState);
        setCheckedAmenities(amenityState);
        
      } catch (err) {
        console.error('Error fetching amenities data:', err);
        setError('Failed to load amenities data');
      } finally {
        setIsLoading(false);
      }
    };

    fetchAmenitiesData();
  }, []); // Only run once on mount

  // Handle category switch
  const handleCategorySwitch = (categoryKey: string) => {
    setEnabledCategories((prev) => {
      const newState = { ...prev, [categoryKey]: !prev[categoryKey] };
      return newState;
    });
    
    // If disabling category, also uncheck all amenities in that category
    setCheckedAmenities((prev) => {
      const newAmenities = { ...prev };
      if (!enabledCategories[categoryKey]) {
        // Category is being enabled, keep current amenities
        return newAmenities;
      } else {
        // Category is being disabled, clear all amenities
        newAmenities[categoryKey] = {};
        return newAmenities;
      }
    });
  };

  // Handle amenity checkbox
  const handleAmenityCheck = (categoryKey: string, amenityKey: string) => {
    setCheckedAmenities((prev) => {
      const prevCat = prev[categoryKey] || {};
      const newCat = { ...prevCat, [amenityKey]: !prevCat[amenityKey] };
      return { ...prev, [categoryKey]: newCat };
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    startTransition(async () => {
      try {
        // Collect all selected amenities into a flat array
        const allSelectedAmenities: string[] = [];
        Object.entries(checkedAmenities).forEach(([categoryKey, amenities]) => {
          if (enabledCategories[categoryKey]) {
            Object.entries(amenities).forEach(([amenityKey, isChecked]) => {
              if (isChecked) {
                allSelectedAmenities.push(amenityKey);
              }
            });
          }
        });
        
        await updateGymAmenities({ amenities: allSelectedAmenities });
        toast.success("Amenities updated successfully!");
        onSave?.();
      } catch (error) {
        console.error('Error updating amenities:', error);
        toast.error("Failed to update amenities. Please try again.");
      }
    });
  };

  // Loading state
  if (isLoading) {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-center py-12">
          <Loader2 className="h-8 w-8 animate-spin text-blue-600" />
          <span className="ml-2 text-gray-600">Loading amenities...</span>
        </div>
      </div>
    );
  }

  // Error state
  if (error) {
    return (
      <div className="space-y-6">
        <div className="bg-red-50 border border-red-200 rounded-lg p-6 text-center">
          <p className="text-red-600 mb-4">{error}</p>
          <Button 
            onClick={() => window.location.reload()} 
            variant="outline"
            className="border-red-200 text-red-600 hover:bg-red-50"
          >
            Retry
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Summary Stats */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-gradient-to-r from-blue-50 to-purple-50 border border-blue-200 rounded-xl p-6"
      >
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="text-center">
            <div className="text-2xl font-bold text-blue-600">
              {Object.values(enabledCategories).filter(Boolean).length}
            </div>
            <div className="text-sm text-blue-700">Active Categories</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-purple-600">
              {categories.reduce((acc, cat) => acc + cat.amenities.length, 0)}
            </div>
            <div className="text-sm text-purple-700">Total Amenities</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-green-600">
              {Object.entries(checkedAmenities).reduce((acc, [catKey, amenities]) => 
                acc + (enabledCategories[catKey] ? Object.values(amenities).filter(Boolean).length : 0), 0
              )}
            </div>
            <div className="text-sm text-green-700">Selected</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-orange-600">
              {categories.reduce((acc, cat) => acc + cat.amenities.length, 0) - 
               Object.entries(checkedAmenities).reduce((acc, [catKey, amenities]) => 
                 acc + (enabledCategories[catKey] ? Object.values(amenities).filter(Boolean).length : 0), 0
               )}
            </div>
            <div className="text-sm text-orange-700">Not Selected</div>
          </div>
        </div>
      </motion.div>

      <form onSubmit={handleSubmit} className="space-y-6">
      {categories.map((category) => {
        const isEnabled = enabledCategories[category.key];
        const selectedCount = Object.values(checkedAmenities[category.key] || {}).filter(Boolean).length;
        const totalCount = category.amenities.length;
        
        return (
          <motion.div 
            key={category.key} 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="border rounded-lg shadow-sm overflow-hidden"
          >
            <div className={`flex items-center justify-between px-4 py-3 transition-colors ${
              isEnabled 
                ? 'bg-gradient-to-r from-blue-50 to-purple-50 border-b border-blue-200' 
                : 'bg-gray-100 border-b border-gray-200'
            }`}>
              <div className="flex items-center gap-3">
                <span className={`font-semibold transition-colors ${
                  isEnabled ? 'text-gray-900' : 'text-gray-500'
                }`}>
                  {category.name}
                </span>
                {isEnabled && selectedCount > 0 && (
                  <Badge variant="secondary" className="bg-blue-100 text-blue-700 border-blue-200">
                    {selectedCount} of {totalCount}
                  </Badge>
                )}
              </div>
              <Switch
                checked={isEnabled}
                onCheckedChange={() => handleCategorySwitch(category.key)}
              />
            </div>
          <div className="p-4 space-y-3">
            <AnimatePresence>
              {category.amenities.map((amenity, amenityIndex) => {
                const isChecked = !!checkedAmenities[category.key]?.[amenity.key];
                const isEnabled = enabledCategories[category.key];
                
                return (
                  <motion.div
                    key={amenity.key}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                    transition={{ duration: 0.2, delay: amenityIndex * 0.03 }}
                    className={`flex items-center gap-3 p-3 rounded-lg transition-all duration-200 hover:shadow-md group cursor-pointer ${
                      isEnabled 
                        ? isChecked
                          ? 'bg-green-50 border border-green-200 shadow-sm hover:bg-green-100' 
                          : 'bg-gray-50 border border-gray-200 hover:bg-gray-100'
                        : 'bg-gray-50 border border-gray-200 opacity-40'
                    }`}
                    onClick={() => isEnabled && handleAmenityCheck(category.key, amenity.key)}
                  >
                    <Checkbox
                      checked={isChecked}
                      onCheckedChange={() => handleAmenityCheck(category.key, amenity.key)}
                      disabled={!isEnabled}
                      className="flex-shrink-0"
                    />
                    
                    <div className={`flex-shrink-0 w-2 h-2 rounded-full transition-colors ${
                      isEnabled 
                        ? isChecked ? 'bg-green-500' : 'bg-gray-300'
                        : 'bg-gray-200'
                    }`} />
                    
                    <div className="flex-1 min-w-0">
                      <span className={`block font-medium transition-colors ${
                        isEnabled 
                          ? isChecked ? 'text-gray-900' : 'text-gray-600'
                          : 'text-gray-400'
                      }`}>
                        {amenity.name}
                      </span>
                      {amenity.description && (
                        <span className={`block text-xs mt-1 transition-colors ${
                          isEnabled 
                            ? isChecked ? 'text-gray-600' : 'text-gray-500'
                            : 'text-gray-400'
                        }`}>
                          {amenity.description}
                        </span>
                      )}
                    </div>
                    
                    {isEnabled && isChecked && (
                      <motion.div
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        exit={{ scale: 0 }}
                        transition={{ type: "spring", stiffness: 500, damping: 30 }}
                      >
                        <Badge variant="secondary" className="bg-green-100 text-green-700 border-green-200">
                          <Check className="w-3 h-3 mr-1" />
                          Selected
                        </Badge>
                      </motion.div>
                    )}
                  </motion.div>
                );
              })}
            </AnimatePresence>
          </div>
        </motion.div>
        );
      })}
      <div className="flex gap-2 pt-4">
        <Button type="submit" disabled={isPending} className="flex-1">
          {isPending ? "Saving..." : "Save Amenities"}
        </Button>
        {onCancel && <Button type="button" variant="outline" onClick={onCancel}>Cancel</Button>}
      </div>
    </form>
    </div>
  );
}