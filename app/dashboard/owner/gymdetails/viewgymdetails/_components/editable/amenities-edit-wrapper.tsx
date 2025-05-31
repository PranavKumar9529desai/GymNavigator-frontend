"use client";

import { useEffect, useState } from 'react';
import { AmenitiesEditForm } from './amenities-edit-form';
import { getAmenityCategories } from '../../_actions/amenity-actions';
import type { AmenityCategoryDefinition } from '@/lib/constants/amenities';
import { Skeleton } from '@/components/ui/skeleton';
import { Alert, AlertDescription } from '@/components/ui/alert';

interface AmenitiesEditWrapperProps {
  selectedAmenities: Record<string, string[]>; // categoryKey -> array of amenity keys
  onChange: (selected: Record<string, string[]>) => void;
  onSave?: () => void;
  onCancel?: () => void;
}

export function AmenitiesEditWrapper({
  selectedAmenities,
  onChange,
  onSave,
  onCancel,
}: AmenitiesEditWrapperProps) {
  const [categories, setCategories] = useState<AmenityCategoryDefinition[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchCategories() {
      try {
        setLoading(true);
        const response = await getAmenityCategories();
        setCategories(response.categories);
        setError(null);
      } catch (err) {
        console.error('Error fetching amenity categories:', err);
        setError('Failed to load amenity categories. Please try again.');
      } finally {
        setLoading(false);
      }
    }

    fetchCategories();
  }, []);

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

  return (
    <AmenitiesEditForm
      categories={categories}
      selectedAmenities={selectedAmenities}
      onChange={onChange}
      onSave={onSave}
      onCancel={onCancel}
    />
  );
}
