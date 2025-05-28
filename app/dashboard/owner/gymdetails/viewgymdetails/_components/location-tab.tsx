"use client"

import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { MapPin, Car, Shield } from "lucide-react"

export function LocationTab() {
  return (
    <div className="grid gap-6 lg:grid-cols-2">
      <Card className="border shadow-lg">
        <CardHeader className="bg-gray-900 text-white">
          <div className="flex items-center gap-2">
            <MapPin className="h-5 w-5" />
            <h3 className="font-bold">Location Details</h3>
          </div>
        </CardHeader>
        <CardContent className="p-6">
          <div className="space-y-4">
            <div>
              <p className="font-semibold text-gray-900">Street Address</p>
              <p className="text-gray-600">2847 Fitness Boulevard, Suite 100</p>
            </div>
            <div>
              <p className="font-semibold text-gray-900">City & State</p>
              <p className="text-gray-600">Wellness City, California 90210</p>
            </div>
            <div>
              <p className="font-semibold text-gray-900">Neighborhood</p>
              <p className="text-gray-600">Downtown Fitness District</p>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card className="border shadow-lg">
        <CardHeader className="bg-gray-900 text-white">
          <div className="flex items-center gap-2">
            <Car className="h-5 w-5" />
            <h3 className="font-bold">Accessibility</h3>
          </div>
        </CardHeader>
        <CardContent className="p-6">
          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <Car className="h-5 w-5 text-gray-600" />
              <div>
                <p className="font-medium text-gray-900">Parking</p>
                <p className="text-sm text-gray-600">300+ free spaces</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <MapPin className="h-5 w-5 text-gray-600" />
              <div>
                <p className="font-medium text-gray-900">Public Transit</p>
                <p className="text-sm text-gray-600">Metro Blue Line - 0.2 miles</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <Shield className="h-5 w-5 text-gray-600" />
              <div>
                <p className="font-medium text-gray-900">Accessibility</p>
                <p className="text-sm text-gray-600">ADA compliant facility</p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
