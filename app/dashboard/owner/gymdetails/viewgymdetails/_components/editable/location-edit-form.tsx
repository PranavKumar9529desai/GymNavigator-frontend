"use client";

import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import type { GymData } from "../../types/gym-types";
import { useState, useEffect, useRef } from 'react';
import { useGetLocationFromCoordinates } from "../../get-location-from-coordinates";

// Removed static Leaflet imports to use dynamic imports
// import L from 'leaflet';
// import 'leaflet/dist/leaflet.css';
// import 'leaflet.locatecontrol';
// import 'leaflet.locatecontrol/dist/L.Control.Locate.min.css';

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

  const mapRef = useRef<any | null>(null); // Use any for Leaflet map instance
  const markerRef = useRef<any | null>(null); // Use any for Leaflet marker instance
  const mapContainerRef = useRef<HTMLDivElement>(null);

  // Explicitly type geoError to include Error object possibility
  const { getAddress, loading: geoLoading, error: geoError } = useGetLocationFromCoordinates() as { getAddress: any, loading: boolean, error: string | Error | undefined };

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

  // Effect to initialize and manage the map with dynamic imports
  useEffect(() => {
    let L: any; // Declare L variable here

    const loadLeaflet = async () => {
      if (typeof window !== 'undefined' && mapContainerRef.current && !mapRef.current) {
        try {
          // Dynamically import Leaflet and plugin
          const leaflet = await import('leaflet');
          const locate = await import('leaflet.locatecontrol');
          L = leaflet.default; // Assign imported L

          // Apply the icon fix here after L is loaded
          if (L.Icon.Default) {
            delete (L.Icon.Default.prototype as any)._getIconUrl;
            L.Icon.Default.mergeOptions({
              iconRetinaUrl: 'leaflet/images/marker-icon-2x.png',
              iconUrl: 'leaflet/images/marker-icon.png',
              shadowUrl: 'leaflet/images/marker-shadow.png',
            });
          }

          // Apply plugin to L object
          if (locate && locate.default) {
             // The plugin should ideally attach itself to L.control
             // If it doesn't automatically, we might need a specific import or setup.
             // For now, we assume the import 'leaflet.locatecontrol' handles this.
             // If L.control.locate is still not found, the plugin might require explicit initialization.
             // The previous error suggests L.control.locate is not being added correctly.
             // Let's try to ensure the plugin is imported and its side effects run.
          }

          const initialLat = locationFormData.lat || 51.505;
          const initialLng = locationFormData.lng || -0.09;
          const initialZoom = (locationFormData.lat !== undefined && locationFormData.lng !== undefined) ? 15 : 2;

          mapRef.current = L.map(mapContainerRef.current).setView([initialLat, initialLng], initialZoom);

          L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
            attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          }).addTo(mapRef.current);

          // Add locate control - check if locate is available on L.control
          if (L.control.locate) {
               L.control.locate({
                position: 'topright',
                strings: {
                  title: 'Show my location'
                },
                flyTo: true,
                locateOptions: { enableHighAccuracy: true },
                keepCurrentZoomLevel: true,
                showPopup: false,
              }).addTo(mapRef.current);
          } else {
              console.error('Leaflet.locatecontrol not found on L.control');
          }

          // Add a marker if initial lat/lng are present
          if (locationFormData.lat !== undefined && locationFormData.lng !== undefined) {
             markerRef.current = L.marker([initialLat, initialLng]).addTo(mapRef.current);
          }

          // Handle map clicks to set location
          mapRef.current.on('click', (e: any) => {
            const { lat, lng } = e.latlng;
            updateLocation(lat, lng);
          });

          // Handle location found by locate control
          mapRef.current.on('locationfound', (e: any) => {
            const { lat, lng } = e.latlng;
            updateLocation(lat, lng);
            if (mapRef.current) {
                mapRef.current.setView(e.latlng, mapRef.current.getZoom());
            }
          });

          mapRef.current.on('locationerror', (e: any) => {
            console.error('Location error:', e.message);
          });

        } catch (error) {
          console.error('Error loading Leaflet or plugins:', error);
        }
      }
    };

    loadLeaflet();

    // Cleanup function
    return () => {
      if (mapRef.current) {
        mapRef.current.remove();
        mapRef.current = null;
      }
    };
  }, [locationFormData.lat, locationFormData.lng]); // Re-run effect if initial lat/lng change

  // Function to update location state and marker
  const updateLocation = async (lat: number, lng: number) => {
    const updatedLocation = { ...locationFormData, lat, lng };
    setLocationFormData(updatedLocation);
    onDataChange({ ...data, location: updatedLocation });

    // Wait for map to be initialized before adding marker
    if (mapRef.current) {
      // Remove existing marker if any
      if (markerRef.current) {
        mapRef.current.removeLayer(markerRef.current); // Use removeLayer
      }
      // Add new marker
      // Ensure L is available before creating marker
      if (typeof window !== 'undefined' && mapRef.current.L) {
         markerRef.current = mapRef.current.L.marker([lat, lng]).addTo(mapRef.current);
      }
    }
  };

  // Autofill address when lat/lng are set and address is empty
  useEffect(() => {
    if (
      locationFormData.lat !== undefined &&
      locationFormData.lng !== undefined &&
      (!locationFormData.address || !locationFormData.city || !locationFormData.state || !locationFormData.zipCode)
    ) {
      (async () => {
        // Check if getAddress is a function before calling
        if (typeof getAddress === 'function') {
           const result = await getAddress(locationFormData.lat, locationFormData.lng);
           if (result) {
             const updatedLocation = {
               ...locationFormData,
               address: result.address || '',
               city: result.city || '',
               state: result.state || '',
               zipCode: result.zipCode || '',
             };
             setLocationFormData(updatedLocation);
             onDataChange({ ...data, location: updatedLocation });
           } else if (geoError) {
             // Check if geoError is an Error object before accessing message
             console.error('Geocoding error:', geoError instanceof Error ? geoError.message : geoError);
           }
        } else {
            console.error('getAddress function is not available');
        }
      })();
    }
  }, [locationFormData.lat, locationFormData.lng, getAddress, geoError, onDataChange]); // Include all dependencies


  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { id, value } = e.target;
    const updatedLocation = {
      ...locationFormData,
      [id]: value,
    };
    setLocationFormData(updatedLocation);
    onDataChange({ ...data, location: updatedLocation });
  };

  return (
    <div className="space-y-4">
       {/* Map container */}
      {/* Add key to force re-render when lat/lng changes? May not be needed. */}
      <div ref={mapContainerRef} style={{ height: '400px', width: '100%' }} className="rounded-md"></div>

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
      {locationFormData.lat !== undefined && locationFormData.lng !== undefined && (
        <div className="text-sm text-gray-600">Lat: {locationFormData.lat.toFixed(6)}, Lng: {locationFormData.lng.toFixed(6)}</div>
      )}
       {geoLoading && <div className="text-blue-600">Fetching address...</div>}
       {geoError && <div className="text-red-600">Error fetching address: {geoError instanceof Error ? geoError.message : String(geoError)}</div>}
    </div>
  );
} 