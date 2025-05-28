"use client";

import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import type { GymData, Location } from "../types/gym-types";
import { useState, useEffect } from 'react';

interface LocationEditFormProps {
  data: GymData; // Pass the whole GymData for potential future needs
  onDataChange: (data: GymData) => void;
}

export function LocationEditForm({ data, onDataChange }: LocationEditFormProps) {
  const [locationFormData, setLocationFormData] = useState<Location>(data.location || {} as Location);

   useEffect(() => {
    setLocationFormData(data.location || {} as Location);
  }, [data.location]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { id, value } = e.target;
    const updatedLocation = {
      ...locationFormData,
      [id]: value,
    };
    setLocationFormData(updatedLocation);
    // Pass the updated full gym data back
    onDataChange({ ...data, location: updatedLocation });
  };

  return (
    <div className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="address">Street Address</Label>
        <Input id="address" value={locationFormData.address || ''} onChange={handleInputChange} placeholder="Enter street address" />
      </div>
      <div className="space-y-2">
        <Label htmlFor="city">City</Label>
        <Input id="city" value={locationFormData.city || ''} onChange={handleInputChange} placeholder="Enter city" />
      </div>
       <div className="space-y-2">
        <Label htmlFor="state">State</Label>
        <Input id="state" value={locationFormData.state || ''} onChange={handleInputChange} placeholder="Enter state" />
      </div>
       <div className="space-y-2">
        <Label htmlFor="zipCode">Zip Code</Label>
        <Input id="zipCode" value={locationFormData.zipCode || ''} onChange={handleInputChange} placeholder="Enter zip code" />
      </div>
       <div className="space-y-2">
        <Label htmlFor="neighborhood">Neighborhood</Label>
        <Input id="neighborhood" value={locationFormData.neighborhood || ''} onChange={handleInputChange} placeholder="Enter neighborhood" />
      </div>
       <div className="space-y-2">
        <Label htmlFor="parking">Parking</Label>
        <Input id="parking" value={locationFormData.parking || ''} onChange={handleInputChange} placeholder="Enter parking details" />
      </div>
       <div className="space-y-2">
        <Label htmlFor="publicTransit">Public Transit</Label>
        <Input id="publicTransit" value={locationFormData.publicTransit || ''} onChange={handleInputChange} placeholder="Enter public transit details" />
      </div>
    </div>
  );
} 