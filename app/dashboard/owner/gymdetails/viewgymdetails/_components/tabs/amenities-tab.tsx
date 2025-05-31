"use client"

import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Check } from "lucide-react"
import { Button } from "@/components/ui/button"
import { PREDEFINED_AMENITY_CATEGORIES, type AmenityCategoryDefinition } from "@/lib/constants/amenities"

interface AmenitiesTabProps {
  categories?: AmenityCategoryDefinition[];
  selectedAmenities?: Record<string, string[]>; // categoryKey -> array of amenity keys
  onEdit?: (updatedAmenities: Record<string, string[]>) => void;
}

export function AmenitiesTab({
  categories = PREDEFINED_AMENITY_CATEGORIES,
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
          onClick={() => onEdit({})}
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
                        {amenity.name}
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
