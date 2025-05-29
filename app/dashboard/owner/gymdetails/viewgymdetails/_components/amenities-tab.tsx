"use client"

import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Dumbbell, Zap, Waves, Coffee, Shield, Wifi, Check } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Switch } from "@/components/ui/switch"
import { Checkbox } from "@/components/ui/checkbox"
import { useState } from "react"
import { AmenitiesEditForm } from "./editable/amenities-edit-form"

// Define strong types for amenities
interface Amenity {
  key: string;
  label: string;
}

interface AmenityCategory {
  key: string;
  name: string;
  amenities: Amenity[];
}

interface AmenitiesTabProps {
  categories?: AmenityCategory[];
  selectedAmenities?: Record<string, string[]>; // categoryKey -> array of amenity keys
  onEdit?: (updatedAmenities: Record<string, string[]>) => void; // Modified to accept updated amenities
}

export const AMENITY_CATEGORIES: AmenityCategory[] = [
  {
    key: "workout-facilities",
    name: "Workout Facilities",
    amenities: [
      { key: "cardio-equipment", label: "Cardio Equipment" },
      { key: "strength-equipment", label: "Strength Equipment (Machines & Free Weights)" },
      { key: "functional-training", label: "Functional Training Zone" },
      { key: "group-fitness", label: "Group Fitness Rooms / Studio Spaces" },
    ],
  },
  {
    key: "training-coaching",
    name: "Training & Coaching",
    amenities: [
      { key: "personal-training", label: "Personal Training" },
      { key: "group-classes", label: "Group Classes (Yoga, Spin, HIIT, etc.)" },
      { key: "virtual-training", label: "Virtual Training / On-Demand Classes" },
      { key: "fitness-assessments", label: "Fitness Assessments / Body Scans" },
    ],
  },
  {
    key: "locker-hygiene",
    name: "Locker Room & Hygiene",
    amenities: [
      { key: "showers", label: "Showers & Changing Rooms" },
      { key: "lockers", label: "Lockers (Daily or Subscription)" },
      { key: "towel-service", label: "Towel Service" },
      { key: "toiletries", label: "Toiletries (Soap, Shampoo, Hair Dryer)" },
    ],
  },
  {
    key: "recovery-wellness",
    name: "Recovery & Wellness",
    amenities: [
      { key: "sauna", label: "Sauna / Steam Room" },
      { key: "jacuzzi", label: "Jacuzzi / Hot Tub" },
      { key: "massage", label: "Massage / Therapy Services" },
      { key: "stretching", label: "Stretching / Recovery Zone" },
    ],
  },
  {
    key: "family-lifestyle",
    name: "Family & Lifestyle",
    amenities: [
      { key: "childcare", label: "Childcare / Kids Club" },
      { key: "womens-only", label: "Women's-Only Area" },
      { key: "lounge", label: "Lounge / Social Space" },
      { key: "sports", label: "Pool / Basketball Court / Racquet Sports" },
    ],
  },
  {
    key: "food-beverage",
    name: "Food & Beverage",
    amenities: [
      { key: "water", label: "Water / Hydration Stations" },
      { key: "juice-bar", label: "Juice / Smoothie Bar" },
      { key: "vending", label: "Vending Machines / Health Snacks" },
    ],
  },
  {
    key: "technology-convenience",
    name: "Technology & Convenience",
    amenities: [
      { key: "wifi", label: "Wi-Fi Access" },
      { key: "tv", label: "TV on Equipment" },
      { key: "mobile-app", label: "Mobile App Integration / Check-in" },
      { key: "wearable", label: "Wearable Device Support" },
    ],
  },
]

export function AmenitiesTab({
  categories = AMENITY_CATEGORIES,
  selectedAmenities,
  onEdit,
}: AmenitiesTabProps) {
  // If selectedAmenities is not provided, show all amenities as selected
  const allSelected = !selectedAmenities;

  return (
    <div className="relative">
      {onEdit && (
        <Button
          className="absolute right-0 top-0 z-10"
          size="sm"
          variant="outline"
          onClick={onEdit}
        >
          Edit
        </Button>
      )}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {categories.map((category) => (
          <Card key={category.key} className="border shadow-lg">
            <CardHeader className="bg-gray-900 text-white flex flex-row items-center justify-between">
              <div className="flex items-center gap-2">
                <h3 className="font-bold">{category.name}</h3>
              </div>
            </CardHeader>
            <CardContent className="p-6">
              <div className="space-y-3">
                {category.amenities.map((amenity) => {
                  const isSelected = allSelected || selectedAmenities?.[category.key]?.includes(amenity.key);
                  return (
                    <div key={amenity.key} className="flex items-center gap-3">
                      <span className={isSelected ? "text-gray-700" : "text-gray-400 line-through"}>
                        {amenity.label}
                      </span>
                      {isSelected && <Badge variant="secondary" className="ml-auto bg-green-50 text-green-400 rounded-full"><Check /></Badge>}
                    </div>
                  );
                })}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
