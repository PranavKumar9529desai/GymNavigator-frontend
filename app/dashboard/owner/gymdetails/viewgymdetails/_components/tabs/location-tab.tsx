"use client"

import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { MapPin, Car, Shield } from "lucide-react"
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet"
import "leaflet/dist/leaflet.css"
import L from "leaflet"
import type { GymLocation } from "../../types/gym-types"

// Define a default location value
const defaultLocation: GymLocation = {
  lat: 34.0522,
  lng: -118.2437,
  address: "123 Main St",
  city: "Los Angeles",
  state: "CA",
  zipCode: "90210",
  country: "USA",
};

// Custom marker icon (fixes missing marker issue in Leaflet)
const markerIcon = new L.Icon({
  iconUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png",
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
  shadowSize: [41, 41],
})

// Accept location as prop with optional coordinates
export function LocationTab({
  location = defaultLocation,
}: { location?: GymLocation }) {
  // Debug logging
  console.log('LocationTab received location:', location);
  
  // Use default coordinates if not provided - ensure they're always numbers
  const displayLocation = {
    lat: (location?.lat ?? defaultLocation.lat) as number,
    lng: (location?.lng ?? defaultLocation.lng) as number,
    address: location?.address || defaultLocation.address,
    city: location?.city || defaultLocation.city,
    state: location?.state || defaultLocation.state,
    zipCode: location?.zipCode || defaultLocation.zipCode,
    country: location?.country || defaultLocation.country,
  };

  return (
    <div className="flex flex-col gap-4 md:gap-6">
      {/* Map on top, full width */}
      <div className="w-full h-[250px] sm:h-[300px] md:h-[350px] rounded-xl overflow-hidden border shadow-lg z-30">
        <MapContainer
          center={[displayLocation.lat, displayLocation.lng]}
          zoom={16}
          scrollWheelZoom={false}
          style={{ width: "100%", height: "100%" }}
        >
          <TileLayer
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          />
          <Marker position={[displayLocation.lat, displayLocation.lng]} icon={markerIcon}>
            <Popup>
              {displayLocation.address}<br />{displayLocation.city}, {displayLocation.state} {displayLocation.zipCode}
            </Popup>
          </Marker>
        </MapContainer>
      </div>

      {/* Card below map, horizontal on large screens */}
      <Card className="border shadow-lg w-full">
        <CardHeader className="bg-gray-900 text-white">
          <div className="flex items-center gap-2">
            <MapPin className="h-5 w-5" />
            <h3 className="font-bold">Location Details</h3>
          </div>
        </CardHeader>
        <CardContent className="p-4 md:p-6">
          <div className="flex flex-col lg:flex-row lg:items-start lg:gap-8 space-y-2 md:space-y-4 lg:space-y-0">
            <div>
              <p className="font-semibold text-gray-900">Street Address</p>
              <p className="text-gray-600">{displayLocation.address}</p>
            </div>
            <div>
              <p className="font-semibold text-gray-900">City & State</p>
              <p className="text-gray-600">{displayLocation.city}, {displayLocation.state}</p>
            </div>
            <div>
              <p className="font-semibold text-gray-900">Zip Code</p>
              <p className="text-gray-600">{displayLocation.zipCode}</p>
            </div>
            {displayLocation.country && (
              <div>
                <p className="font-semibold text-gray-900">Country</p>
                <p className="text-gray-600">{displayLocation.country}</p>
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
