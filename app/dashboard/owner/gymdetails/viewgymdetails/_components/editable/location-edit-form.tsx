"use client";

import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import type { GymData } from "../../types/gym-types";
import { useState, useEffect } from 'react';
import { useGetLocationFromCoordinates } from "../../get-location-from-coordinates";

interface LocationEditFormProps {
  data: GymData;
  onDataChange: (data: GymData) => void;
}

type Location = {
  address: string;
  city: string;
  state: string;
  zipCode: string;
  lat?: number;
  lng?: number;
};

export function LocationEditForm({ data, onDataChange }: LocationEditFormProps) {
  const [locationFormData, setLocationFormData] = useState<Location>({
    address: data.location?.address || '',
    city: data.location?.city || '',
    state: data.location?.state || '',
    zipCode: data.location?.zipCode || '',
    lat: data.location?.lat,
    lng: data.location?.lng,
  });

  const { getAddress, loading: geoLoading, error: geoError } = useGetLocationFromCoordinates();

  useEffect(() => {
    setLocationFormData({
      address: data.location?.address || '',
      city: data.location?.city || '',
      state: data.location?.state || '',
      zipCode: data.location?.zipCode || '',
      lat: data.location?.lat,
      lng: data.location?.lng,
    });
  }, [data.location]);

  // Autofill address when lat/lng are set and address is empty
  useEffect(() => {
    if (
      locationFormData.lat &&
      locationFormData.lng &&
      (!locationFormData.address || !locationFormData.city || !locationFormData.state || !locationFormData.zipCode)
    ) {
      (async () => {
        const result = await getAddress(locationFormData.lat!, locationFormData.lng!);
        if (result) {
          const updatedLocation = {
            ...locationFormData,
            address: result.address,
            city: result.city,
            state: result.state,
            zipCode: result.zipCode,
          };
          setLocationFormData(updatedLocation);
          onDataChange({ ...data, location: updatedLocation });
        }
      })();
    }
  }, [locationFormData.lat, locationFormData.lng]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { id, value } = e.target;
    const updatedLocation = {
      ...locationFormData,
      [id]: value,
    };
    setLocationFormData(updatedLocation);
    onDataChange({ ...data, location: updatedLocation });
  };

  const handleUseCurrentLocation = () => {
    if (!navigator.geolocation) {
      console.log('Geolocation is not supported by your browser');
      return;
    }
    navigator.geolocation.getCurrentPosition(
      (position) => {
        const { latitude, longitude } = position.coords;
        console.log('Current location:', latitude, longitude);
        setLocationFormData(prev => ({ ...prev, lat: latitude, lng: longitude }));
        onDataChange({ ...data, location: { ...locationFormData, lat: latitude, lng: longitude } });
      },
      (error) => {
        console.log(error.message || 'Unable to retrieve your location');
      }
    );
  };

  return (
    <div className="space-y-4">
      <button
        type="button"
        className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition mb-2 disabled:opacity-60"
        onClick={handleUseCurrentLocation}
      >
        Use my Current Location
      </button>
      {/* Address fields */}
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
      {/* Optionally show lat/lng if present */}
      {locationFormData.lat && locationFormData.lng && (
        <div className="text-sm text-gray-600">Lat: {locationFormData.lat}, Lng: {locationFormData.lng}</div>
      )}
    </div>
  );
} 