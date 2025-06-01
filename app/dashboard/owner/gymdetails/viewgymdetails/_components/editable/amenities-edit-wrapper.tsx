"use client";

import { useEffect, useState } from 'react';
import { AmenitiesEditForm } from './amenities-edit-form';
import { getAmenityCategories } from '../../_actions/amenity-actions';
import { getAmenitiesData } from '../../_actions/get-gym-tab-data';
import type { AmenityCategoryDefinition } from '@/lib/constants/amenities';
import { Skeleton } from '@/components/ui/skeleton';
import { Alert, AlertDescription } from '@/components/ui/alert';

interface AmenitiesEditWrapperProps {
  selectedAmenities: Record<string, string[]>; // categoryKey -> array of amenity keys (fallback, not used)
  onChange: (selected: Record<string, string[]>) => void;
  onSave?: () => void;
  onCancel?: () => void;
}

export function AmenitiesEditWrapper({
  selectedAmenities: fallbackSelectedAmenities,
  onChange,
  onSave,
  onCancel,
}: AmenitiesEditWrapperProps) {
  const [categories, setCategories] = useState<AmenityCategoryDefinition[]>([]);
  const [selectedAmenities, setSelectedAmenities] = useState<Record<string, string[]>>({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchData() {
      try {
        setLoading(true);
        
        // Fetch both categories and current amenities data in parallel
        const [categoriesResponse, amenitiesResponse] = await Promise.all([
          getAmenityCategories(),
          getAmenitiesData()
        ]);
        
        setCategories(categoriesResponse.categories);
        
        // Use actual amenities data from API, fallback to prop if API fails
        if (amenitiesResponse.selectedAmenities) {
          console.log('✅ Fetched actual amenities data for edit form:', amenitiesResponse.selectedAmenities);
          setSelectedAmenities(amenitiesResponse.selectedAmenities);
        } else {
          console.log('⚠️ Using fallback amenities data for edit form:', fallbackSelectedAmenities);
          setSelectedAmenities(fallbackSelectedAmenities || {});
        }
        
        setError(null);
      } catch (err) {
        console.error('Error fetching amenities data:', err);
        setError('Failed to load amenities data. Please try again.');
        // Use fallback data in case of error
        setSelectedAmenities(fallbackSelectedAmenities || {});
      } finally {
        setLoading(false);
      }
    }

    fetchData();
  }, [fallbackSelectedAmenities]);

  if (loading) {
    return (
      <div className="space-y-6">
        {[1, 2, 3, 4, 5, 6].map((i) => (
          <div key={i} className="border rounded-md shadow-sm">
            <div className="bg-gray-100 px-4 py-2 rounded-t-md">
              <Skeleton className="h-6 w-48" />
            </div>
            <div className="p-4 space-y-2">
              {[1, 2, 3, 4].map((j) => (
                <Skeleton key={j} className="h-5 w-full" />
              ))}
            </div>
          </div>
        ))}
      </div>
    );
  }

  if (error) {
    return (
      <Alert variant="destructive">
        <AlertDescription>{error}</AlertDescription>
      </Alert>
    );
  }

  // Handle changes from the edit form
  const handleAmenitiesChange = (newSelectedAmenities: Record<string, string[]>) => {
    setSelectedAmenities(newSelectedAmenities);
    onChange(newSelectedAmenities);
  };

  return (
    <AmenitiesEditForm
      categories={categories}
      selectedAmenities={selectedAmenities}
      onChange={handleAmenitiesChange}
      onSave={onSave}
      onCancel={onCancel}
    />
  );
}
