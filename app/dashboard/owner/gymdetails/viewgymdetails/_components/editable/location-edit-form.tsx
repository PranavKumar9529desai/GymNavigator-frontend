"use client";

import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import type { GymData, GymLocation } from "../../types/gym-types";
import { useState, useEffect, useRef } from 'react';
import { useGetLocationFromCoordinates } from "../../get-location-from-coordinates";
import { MapPin } from 'lucide-react';

// Removed static Leaflet imports to use dynamic imports
// import L from 'leaflet';
// import 'leaflet/dist/leaflet.css'; // Remove map CSS imports
// import 'leaflet.locatecontrol';
// import 'leaflet.locatecontrol/dist/L.Control.Locate.min.css';

// Import leaflet-search CSS
// import 'leaflet-search/dist/leaflet-search.min.css'; // Remove map search CSS import

interface LocationEditFormProps {
  data: GymData;
  onDataChange: (data: GymData) => void;
}

export function LocationEditForm({ data, onDataChange }: LocationEditFormProps) {
  const [locationFormData, setLocationFormData] = useState<GymLocation>(
    {
    address: data.location?.address || '',
    city: data.location?.city || '',
    state: data.location?.state || '',
    zipCode: data.location?.zipCode || '',
    lat: data.location?.lat,
    lng: data.location?.lng,
  });

  // Remove map refs
  // const mapRef = useRef<any | null>(null); // Use any for Leaflet map instance
  // const markerRef = useRef<any | null>(null); // Use any for Leaflet marker instance
  // const mapContainerRef = useRef<HTMLDivElement>(null);

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

    // If initial data includes lat/lng, ensure map is initialized and centered
    // This might be redundant with the map effect below but can help on initial load
    // if (data.location?.lat !== undefined && data.location?.lng !== undefined && mapRef.current) {
    //    mapRef.current.setView([data.location.lat, data.location.lng], 15);
    // }

  }, [data.location]);

  // Remove map initialization effect
  // useEffect(() => {
  //   // Only run this effect on the client side and if the map hasn't been initialized
  //   if (typeof window === 'undefined' || !mapContainerRef.current || mapRef.current) {
  //     console.log('Skipping map initialization: not client-side, container not found, or map already initialized.');
  //     return;
  //   }

  //   let L: any; // Declare L variable here
  //   let LeafletSearch: any; // Declare LeafletSearch variable

  //   const loadLeafletAndInitializeMap = async () => {
  //       try {
  //         // Dynamically import Leaflet and plugins
  //         const leaflet = await import('leaflet');
  //         // Import locatecontrol to ensure its side effects run
  //         await import('leaflet.locatecontrol');
  //         const search = await import('leaflet-search');

  //         L = leaflet.default; // Assign imported L
  //         LeafletSearch = search.default; // Assign imported LeafletSearch control

  //          // Fix for default icon issue with Webpack/bundlers
  //         if (L.Icon.Default) {
  //           delete (L.Icon.Default.prototype as any)._getIconUrl;
  //           L.Icon.Default.mergeOptions({
  //             iconRetinaUrl: 'leaflet/images/marker-icon-2x.png',
  //             iconUrl: 'leaflet/images/marker-icon.png',
  //             shadowUrl: 'leaflet/images/marker-shadow.png',
  //           });
  //         }

  //         const initialLat = locationFormData.lat || 51.505;
  //         const initialLng = locationFormData.lng || -0.09;
  //         const initialZoom = (locationFormData.lat !== undefined && locationFormData.lng !== undefined) ? 15 : 2;

  //         // Initialize the map
  //         mapRef.current = L.map(mapContainerRef.current).setView([initialLat, initialLng], initialZoom);

  //         // Add tile layer
  //         L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
  //           attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
  //         }).addTo(mapRef.current);

  //         // Add locate control - Check again after import to be sure
  //         if (L.control.locate) {
  //              L.control.locate({
  //               position: 'topright',
  //               strings: {
  //                 title: 'Show my location'
  //               },
  //               flyTo: true,
  //               locateOptions: { enableHighAccuracy: true },
  //               keepCurrentZoomLevel: true,
  //               showPopup: false,
  //             }).addTo(mapRef.current);
  //         } else {
  //             console.error('Leaflet.locatecontrol not found on L.control after explicit import.');
  //         }

  //          // Add search control
  //          if (L.Control.Search) {
  //            const searchControl = new L.Control.Search({
  //              url: 'https://nominatim.openstreetmap.org/search?format=json&q={s}',
  //              jsonpParam: 'json_callback', // Not strictly needed for Nominatim JSON but good practice or for other services
  //              propertyName: 'display_name',
  //              propertyLoc: ['lat', 'lon'],
  //              marker: L.marker([0, 0]), // Temporary marker
  //              autoCollapse: true,
  //              autoType: false,
  //              minLength: 2,
  //              zoom: 15, // Zoom level after finding location
  //            });

  //            mapRef.current.addControl(searchControl);

  //            // Handle location found by search control
  //            mapRef.current.on('search:locationfound', (e: any) => {
  //               const { lat, lng } = e.latlng;
  //               // Update form data and trigger reverse geocoding
  //               updateLocation(lat, lng, true); // Pass true to indicate source is search control
  //            });

  //             mapRef.current.on('search:collapsed', (e: any) => {
  //               // Optional: remove marker when search collapses
  //               // if (markerRef.current) {
  //               //   mapRef.current.removeLayer(markerRef.current);
  //               //   markerRef.current = null;
  //               // }
  //             });

  //          } else {
  //            console.error('Leaflet-search control not found after import');
  //          }

  //         // Add a marker if initial lat/lng are present after map is initialized
  //         if (locationFormData.lat !== undefined && locationFormData.lng !== undefined) {
  //            // Ensure L is available before creating marker - it should be at this point
  //            if (L) {
  //               markerRef.current = L.marker([initialLat, initialLng]).addTo(mapRef.current);
  //            } else {
  //                console.error('Leaflet (L) not available when trying to add initial marker.');
  //            }
  //         }

  //         // Handle map clicks to set location
  //         mapRef.current.on('click', (e: any) => {
  //           const { lat, lng } = e.latlng;
  //           updateLocation(lat, lng);
  //         });

  //         // Handle location found by locate control
  //         mapRef.current.on('locationfound', (e: any) => {
  //           const { lat, lng } = e.latlng;
  //           updateLocation(lat, lng);
  //           if (mapRef.current) {
  //               mapRef.current.setView(e.latlng, mapRef.current.getZoom());
  //           }
  //         });

  //         mapRef.current.on('locationerror', (e: any) => {
  //           console.error('Location error:', e.message);
  //         });

  //       } catch (error) {
  //         console.error('Error loading Leaflet or plugins:', error);
  //       }
  //   };

  //   loadLeafletAndInitializeMap();

  //   // Cleanup function to remove the map instance
  //   return () => {
  //     if (mapRef.current) {
  //       mapRef.current.remove();
  //       mapRef.current = null;
  //     }
  //   };

  //    // Removed locationFormData.lat, locationFormData.lng from dependency array
  //    // to prevent re-initializing the map when location changes.
  //    // Map view will be updated via setView calls instead.
  // }, [mapContainerRef]); // Depend only on the map container ref

  // Remove map update logic from updateLocation, keep reverse geocoding part
  // Function to update location state and marker
  // Added optional parameter to prevent reverse geocoding if initiated by search control
  const updateLocation = async (lat: number, lng: number, fromSearch = false) => {
    // The updateLocation function now only handles state update and reverse geocoding
    // The map-related logic has been removed based on the user's request to remove the map.
    const updatedLocation: GymLocation = { ...locationFormData, lat, lng };
    // setLocationFormData(updatedLocation); // Update state after reverse geocoding
    // onDataChange({ ...data, location: updatedLocation }); // Call onDataChange after reverse geocoding

    // Remove map view and marker update logic
    // if (mapRef.current) {
    //    // Center map on the new location, maintain current zoom unless from search (then zoom to 15)
    //    const targetZoom = fromSearch ? 15 : mapRef.current.getZoom();
    //    mapRef.current.setView([lat, lng], targetZoom);

    //   // Remove existing marker if any
    //   if (markerRef.current) {
    //     mapRef.current.removeLayer(markerRef.current); // Use removeLayer
    //   }
    //   // Add new marker
    //   // Ensure L is available before creating marker
    //   // Access L from map instance if possible, or rely on the dynamically loaded L
    //   const L = (mapRef.current as any).L || (typeof window !== 'undefined' ? (window as any).L : undefined);
    //   if (L) {
    //      markerRef.current = L.marker([lat, lng]).addTo(mapRef.current);
    //   }
    // }

    // Trigger reverse geocoding ONLY if location was updated by map click or locate control,
    // NOT if it was updated by the search control (as search already gives address)
    // This logic might need adjustment depending on the new button flow
    // if (!fromSearch) { // Keep reverse geocoding logic
         // Autofill address when lat/lng are set and address is empty (or always, depending on desired behavior)
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
              city: result.city || '',
              state: result.state || '',
              zipCode: result.zipCode || '',
            };
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

  return (
    <div className="space-y-4">
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
    </div>
  );
}  