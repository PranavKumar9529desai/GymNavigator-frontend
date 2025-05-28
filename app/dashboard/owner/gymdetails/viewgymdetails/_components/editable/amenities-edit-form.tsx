"use client";

import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import type { GymData, Amenity } from "../types/gym-types";
import { useState, useEffect } from 'react';

interface AmenitiesEditFormProps {
  data: GymData; // Pass the whole GymData for potential future needs, but focus on amenities
  onDataChange: (data: GymData) => void;
}

export function AmenitiesEditForm({ data, onDataChange }: AmenitiesEditFormProps) {
  // Assuming amenities is an array within GymData
  const [amenitiesFormData, setAmenitiesFormData] = useState<Amenity[]>(data.amenities || []);

  useEffect(() => {
    setAmenitiesFormData(data.amenities || []);
  }, [data.amenities]);

  const handleAmenityChange = (index: number, field: keyof Amenity, value: any) => {
    const updatedAmenities = amenitiesFormData.map((amenity, i) =>
      i === index ? { ...amenity, [field]: value } : amenity
    );
    setAmenitiesFormData(updatedAmenities);
    // Pass the updated full gym data back
    onDataChange({ ...data, amenities: updatedAmenities });
  };

  // This is a simplified example. A real implementation might need adding/removing amenities.

  return (
    <div className="space-y-4">
      <p className="text-sm text-gray-500">Edit existing amenities. Adding/removing not yet supported.</p>
       {amenitiesFormData.length === 0 && <p>No amenities found.</p>}
      {amenitiesFormData.map((amenity, index) => (
        <div key={amenity.id} className="border p-4 rounded-md space-y-2">
          <div className="space-y-1">
            <Label htmlFor={`amenity-name-${index}`}>Name</Label>
            <Input
              id={`amenity-name-${index}`}
              value={amenity.name}
              onChange={(e) => handleAmenityChange(index, 'name', e.target.value)}
              placeholder="Amenity name"
            />
          </div>
           <div className="space-y-1">
            <Label htmlFor={`amenity-description-${index}`}>Description</Label>
            <Input
              id={`amenity-description-${index}`}
              value={amenity.description}
              onChange={(e) => handleAmenityChange(index, 'description', e.target.value)}
              placeholder="Amenity description"
            />
          </div>
          {/* Add other editable amenity fields as needed, e.g., quantity, category, available */}
        </div>
      ))}
    </div>
  );
} 