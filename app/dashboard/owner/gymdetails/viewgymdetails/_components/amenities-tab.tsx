"use client"

import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Dumbbell, Zap, Waves, Coffee, Shield, Wifi } from "lucide-react"

export function AmenitiesTab() {
  return (
    <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
      {/* Equipment Section */}
      <Card className="border shadow-lg">
        <CardHeader className="bg-gray-900 text-white">
          <div className="flex items-center gap-2">
            <Dumbbell className="h-5 w-5" />
            <h3 className="font-bold">Strength Training</h3>
          </div>
        </CardHeader>
        <CardContent className="p-6">
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-gray-700">Free Weights</span>
              <Badge variant="secondary" className="bg-gray-100 text-gray-700">
                50+ sets
              </Badge>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-gray-700">Cable Machines</span>
              <Badge variant="secondary" className="bg-gray-100 text-gray-700">
                12 units
              </Badge>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-gray-700">Power Racks</span>
              <Badge variant="secondary" className="bg-gray-100 text-gray-700">
                8 units
              </Badge>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-gray-700">Functional Trainers</span>
              <Badge variant="secondary" className="bg-gray-100 text-gray-700">
                6 units
              </Badge>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Cardio Section */}
      <Card className="border shadow-lg">
        <CardHeader className="bg-gray-900 text-white">
          <div className="flex items-center gap-2">
            <Zap className="h-5 w-5" />
            <h3 className="font-bold">Cardio Equipment</h3>
          </div>
        </CardHeader>
        <CardContent className="p-6">
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-gray-700">Treadmills</span>
              <Badge variant="secondary" className="bg-gray-100 text-gray-700">
                25 units
              </Badge>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-gray-700">Ellipticals</span>
              <Badge variant="secondary" className="bg-gray-100 text-gray-700">
                15 units
              </Badge>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-gray-700">Stationary Bikes</span>
              <Badge variant="secondary" className="bg-gray-100 text-gray-700">
                20 units
              </Badge>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-gray-700">Rowing Machines</span>
              <Badge variant="secondary" className="bg-gray-100 text-gray-700">
                8 units
              </Badge>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Facilities Section */}
      <Card className="border shadow-lg">
        <CardHeader className="bg-gray-900 text-white">
          <div className="flex items-center gap-2">
            <Waves className="h-5 w-5" />
            <h3 className="font-bold">Premium Facilities</h3>
          </div>
        </CardHeader>
        <CardContent className="p-6">
          <div className="space-y-3">
            <div className="flex items-center gap-2">
              <Waves className="h-4 w-4 text-gray-600" />
              <span className="text-gray-700">Sauna & Steam Room</span>
            </div>
            <div className="flex items-center gap-2">
              <Coffee className="h-4 w-4 text-gray-600" />
              <span className="text-gray-700">Juice Bar & Café</span>
            </div>
            <div className="flex items-center gap-2">
              <Shield className="h-4 w-4 text-gray-600" />
              <span className="text-gray-700">Personal Training</span>
            </div>
            <div className="flex items-center gap-2">
              <Wifi className="h-4 w-4 text-gray-600" />
              <span className="text-gray-700">Free High-Speed WiFi</span>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
