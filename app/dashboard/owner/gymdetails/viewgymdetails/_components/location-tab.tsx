"use client"

import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { MapPin, Car, Shield } from "lucide-react"
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet"
import "leaflet/dist/leaflet.css"
import L from "leaflet"

// Type for location prop
export type GymLocation = {
  lat: number
  lng: number
  address: string
  city: string
  state: string
  neighborhood?: string
}

// Custom marker icon (fixes missing marker issue in Leaflet)
const markerIcon = new L.Icon({
  iconUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png",
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
  shadowSize: [41, 41],
})

// Accept location as prop
export function LocationTab({ location }: { location: GymLocation }) {
  return (
    <div className="flex flex-col gap-4 md:gap-6">
      {/* Map on top, full width */}
      <div className="w-full h-[250px] sm:h-[300px] md:h-[350px] rounded-xl overflow-hidden border shadow-lg z-40">
        <MapContainer
          center={[location.lat, location.lng]}
          zoom={16}
          scrollWheelZoom={false}
          style={{ width: "100%", height: "100%" }}
        >
          <TileLayer
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          />
          <Marker position={[location.lat, location.lng]} icon={markerIcon}>
            <Popup>
              {location.address}<br />{location.city}, {location.state}
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
          <div className="flex flex-col lg:flex-row lg:items-center lg:gap-8 space-y-2 md:space-y-4 lg:space-y-0">
            <div>
              <p className="font-semibold text-gray-900">Street Address</p>
              <p className="text-gray-600">{location.address}</p>
            </div>
            <div>
              <p className="font-semibold text-gray-900">City & State</p>
              <p className="text-gray-600">{location.city}, {location.state}</p>
            </div>
            {location.neighborhood && (
              <div>
                <p className="font-semibold text-gray-900">Neighborhood</p>
                <p className="text-gray-600">{location.neighborhood}</p>
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
