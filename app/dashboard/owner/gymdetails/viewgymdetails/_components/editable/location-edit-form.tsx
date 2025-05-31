"use client";

import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import type { GymData, GymLocation } from "../../types/gym-types";
import { useState, useEffect, useRef, useTransition } from 'react';
import { useGetLocationFromCoordinates } from "../../_actions/get-location-from-coordinates";
import { MapPin } from 'lucide-react';
import { updateGymLocation } from "../../_actions/submit-gym-tabs-form";
import { toast } from "sonner";



interface LocationEditFormProps {
  data: GymData;
  onDataChange: (data: GymData) => void;
  onSave?: () => void;
}

export function LocationEditForm({ data, onDataChange, onSave }: LocationEditFormProps) {
  const [locationFormData, setLocationFormData] = useState<GymLocation>(
    {
    address: data.location?.address || '',
    city: data.location?.city || '',
    state: data.location?.state || '',
    zipCode: data.location?.zipCode || '',
    lat: data.location?.lat,
    lng: data.location?.lng,
  });
  const [isPending, startTransition] = useTransition();


  const { getAddress, loading: geoLoading, error: geoError } = useGetLocationFromCoordinates() as {  getAddress: any, loading: boolean, error: string | Error | undefined };

  // Effect to update form state when initial data changes
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

 
  const updateLocation = async (lat: number, lng: number, _fromSearch = false) => {
    // The updateLocation function now only handles state update and reverse geocoding
    // The map-related logic has been removed based on the user's request to remove the map.
    const _updatedLocation: GymLocation = { ...locationFormData, lat, lng };
    // setLocationFormData(updatedLocation); // Update state after reverse geocoding
    // onDataChange({ ...data, location: updatedLocation }); // Call onDataChange after reverse geocoding

    
        if (
          lat !== undefined &&
          lng !== undefined &&
          (typeof getAddress === 'function')
        ) {
          const result = await getAddress(lat, lng);
          if (result) {
            const updatedLocationWithAddress: GymLocation = {
              ...locationFormData,
              lat, lng,
              address: result.address || '',
              city: result.city ||  '',
              state: result.state || '',
              zipCode: result.zipCode || '',
            };
            console.log("using the inline version")
             setLocationFormData(updatedLocationWithAddress);
             onDataChange({ ...data, location: updatedLocationWithAddress });
          } else if (geoError) {
            // Check if geoError is an Error object before accessing message
            console.error('Geocoding error:', geoError instanceof Error ? geoError.message : String(geoError));
          }
        } else if (!(typeof getAddress === 'function')) {
           console.error('getAddress function is not available');
        }
    // }
  };

  // Keep handleInputChange for manual address field updates, though fields are removed from JSX now
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { id, value } = e.target;
    const updatedLocation: GymLocation = {
      ...locationFormData,
      [id]: value,
    };
    setLocationFormData(updatedLocation);
    onDataChange({ ...data, location: updatedLocation });
  };

  // Add handler for "Use my current location" button
  const handleUseMyLocationClick = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        async (position) => {
          const { latitude, longitude } = position.coords;
          console.log('Geolocation successful:', latitude, longitude);
          // Use the existing updateLocation function to trigger reverse geocoding
          // Pass false for fromSearch as this is not from the map search
          await updateLocation(latitude, longitude, false);
        },
        (error) => {
          console.error('Geolocation error:', error);
          // Handle geolocation errors, maybe update a state to show a message to the user
          // You might want to add a separate state for geolocation errors vs geocoding errors
        }
      );
    } else {
      console.error('Geolocation is not supported by this browser.');
      // Handle case where geolocation is not supported
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    startTransition(async () => {
      try {
        const locationData = {
          address: locationFormData.address || '',
          city: locationFormData.city || '',
          state: locationFormData.state || '',
          zipCode: locationFormData.zipCode || '',
          lat: locationFormData.lat,
          lng: locationFormData.lng
        };
        
        await updateGymLocation(locationData);
        toast.success("Location updated successfully!");
        onSave?.();
      } catch (error) {
        console.error('Error updating location:', error);
        toast.error("Failed to update location. Please try again.");
      }
    });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
       {/* Map container - Removed */}
      {/* <div ref={mapContainerRef} style={{ height: '400px', width: '100%' }} className="rounded-md z-0"></div> */}

    

      {/* Address fields - Make visible */}
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
        {/* Add "Use my current location" button */}
        <div className="w-full  flex justify-center">
      <Button type="button" onClick={handleUseMyLocationClick} className=" text-white bg-blue-600 max-w-[200px] border">
        <MapPin className="h-4 w-4" />
        Use my current Location
      </Button>
        </div>
      {/* Optionally show lat/lng if present */}
      {locationFormData.lat !== undefined && locationFormData.lng !== undefined && (
        <div className="text-sm text-gray-600">Lat: {locationFormData.lat.toFixed(6)}, Lng: {locationFormData.lng.toFixed(6)}</div>
      )}
       {geoLoading && <div className="text-blue-600">Fetching address...</div>}
       {geoError && <div className="text-blue-600">Error fetching address: {geoError instanceof Error ? geoError.message : String(geoError)}</div>}
      
      <div className="flex gap-2 pt-4">
        <Button type="submit" disabled={isPending} className="flex-1">
          {isPending ? "Saving..." : "Save Location"}
        </Button>
      </div>
    </form>
  );
}  