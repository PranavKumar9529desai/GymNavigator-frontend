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
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

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

  // Helper to parse address from Nominatim
  function parseAddress(address: any) {
    // Compose street address from house_number and road (if available)
    let street = '';
    if (address.house_number && address.road) {
      street = `${address.house_number} ${address.road}`;
    } else if (address.road) {
      street = address.road;
    } else if (address.pedestrian) {
      street = address.pedestrian;
    } else if (address.footway) {
      street = address.footway;
    } else if (address.cycleway) {
      street = address.cycleway;
    } else if (address.path) {
      street = address.path;
    } else if (address.house_number) {
      street = address.house_number;
    }
    return {
      address: street,
      city: address.city || address.town || address.village || address.hamlet || '',
      state: address.state || '',
      zipCode: address.postcode || '',
    };
  }

  // Handler for geolocation
  const handleUseCurrentLocation = () => {
    setError(null);
    setSuccess(false);
    setLoading(true);
    if (!navigator.geolocation) {
      setError('Geolocation is not supported by your browser');
      setLoading(false);
      return;
    }
    navigator.geolocation.getCurrentPosition(
      async (position) => {
        const { latitude, longitude } = position.coords;
        console.log('Current location:', latitude, longitude);
        // Reverse geocode using Nominatim
        try {
          const response = await fetch(
            `https://nominatim.openstreetmap.org/reverse?format=jsonv2&lat=${latitude}&lon=${longitude}`,
            {
              headers: {
                'User-Agent': 'GymNavigator/1.0 (your@email.com)',
                'Accept-Language': 'en',
              },
            }
          );
          if (!response.ok) throw new Error('Failed to fetch address');
          const data = await response.json();
          const address = data.address || {};
          const parsed = parseAddress(address);
          if (!parsed.address && !parsed.city && !parsed.state && !parsed.zipCode) {
            throw new Error('Could not parse address from location.');
          }
          const updatedLocation = {
            ...locationFormData,
            lat: latitude,
            lng: longitude,
            ...parsed,
          };
          setLocationFormData(updatedLocation);
          onDataChange({ ...data, location: updatedLocation });
          setSuccess(true);
        } catch (err: any) {
          setError(err.message || 'Could not fetch address from location.');
        } finally {
          setLoading(false);
        }
      },
      (error) => {
        setError(error.message || 'Unable to retrieve your location');
        setLoading(false);
        console.error(error);
      }
    );
  };

  return (
    <div className="space-y-4">
      <button
        type="button"
        className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition mb-2 disabled:opacity-60"
        onClick={handleUseCurrentLocation}
        disabled={loading}
      >
        {loading ? (
          <span className="flex items-center gap-2"><svg className="animate-spin h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z"></path></svg>Detecting...</span>
        ) : (
          'Use my Current Location'
        )}
      </button>
      {error && <div className="text-red-600 text-sm mb-2">{error}</div>}
      {success && <div className="text-green-600 text-sm mb-2">Location autofilled!</div>}
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
   
    </div>
  );
} 