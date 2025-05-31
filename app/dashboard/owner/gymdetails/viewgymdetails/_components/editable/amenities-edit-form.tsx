"use client";

import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import type { GymData, Amenity, AmenityCategory } from "../../types/gym-types";
import { useState, useEffect, useTransition } from 'react';
import { Switch } from "@/components/ui/switch";
import { Checkbox } from "@/components/ui/checkbox";
import { Button } from "@/components/ui/button";
import { updateGymAmenities } from "../../_actions/submit-gym-tabs-form";
import { toast } from "sonner";

// Types for amenities
interface AmenitiesEditFormProps {
  categories: AmenityCategory[];
  selectedAmenities: Record<string, string[]>; // categoryKey -> array of amenity keys
  onChange: (selected: Record<string, string[]>) => void;
  onSave?: () => void;
  onCancel?: () => void;
}

export function AmenitiesEditForm({
  categories,
  selectedAmenities,
  onChange,
  onSave,
  onCancel,
}: AmenitiesEditFormProps) {
  // Local state for editing
  const [enabledCategories, setEnabledCategories] = useState<Record<string, boolean>>({});
  const [checkedAmenities, setCheckedAmenities] = useState<Record<string, Record<string, boolean>>>({});
  const [isPending, startTransition] = useTransition();

  // Initialize state from props
  useEffect(() => {
    const catState: Record<string, boolean> = {};
    const amenityState: Record<string, Record<string, boolean>> = {};
    categories.forEach((cat) => {
      const selected = selectedAmenities[cat.key] || [];
      catState[cat.key] = selected.length > 0;
      amenityState[cat.key] = {};
      cat.amenities.forEach((amenity) => {
        amenityState[cat.key][amenity.key] = selected.includes(amenity.key);
      });
    });
    setEnabledCategories(catState);
    setCheckedAmenities(amenityState);
  }, [categories, selectedAmenities]);

  // Handle category switch
  const handleCategorySwitch = (categoryKey: string) => {
    setEnabledCategories((prev) => {
      const newState = { ...prev, [categoryKey]: !prev[categoryKey] };
      // If disabling, also uncheck all amenities in that category
      if (!newState[categoryKey]) {
        setCheckedAmenities((prevChecked) => ({
          ...prevChecked,
          [categoryKey]: {},
        }));
        // Update parent
        onChange({
          ...Object.fromEntries(
            Object.entries(checkedAmenities).map(([cat, ams]) => [cat, cat === categoryKey ? [] : Object.keys(ams).filter((k) => ams[k])])
          ),
        });
      }
      return newState;
    });
  };

  // Handle amenity checkbox
  const handleAmenityCheck = (categoryKey: string, amenityKey: string) => {
    setCheckedAmenities((prev) => {
      const prevCat = prev[categoryKey] || {};
      const newCat = { ...prevCat, [amenityKey]: !prevCat[amenityKey] };
      const newChecked = { ...prev, [categoryKey]: newCat };
      // Update parent
      onChange({
        ...Object.fromEntries(
          Object.entries(newChecked).map(([cat, ams]) => [cat, enabledCategories[cat] ? Object.keys(ams).filter((k) => ams[k]) : []])
        ),
      });
      return newChecked;
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    startTransition(async () => {
      try {
        // Collect all selected amenities into a flat array
        const allSelectedAmenities: string[] = [];
        Object.entries(checkedAmenities).forEach(([categoryKey, amenities]) => {
          if (enabledCategories[categoryKey]) {
            Object.entries(amenities).forEach(([amenityKey, isChecked]) => {
              if (isChecked) {
                allSelectedAmenities.push(amenityKey);
              }
            });
          }
        });
        
        await updateGymAmenities({ amenities: allSelectedAmenities });
        toast.success("Amenities updated successfully!");
        onSave?.();
      } catch (error) {
        console.error('Error updating amenities:', error);
        toast.error("Failed to update amenities. Please try again.");
      }
    });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {categories.map((category) => (
        <div key={category.key} className="border rounded-md shadow-sm">
          <div className="flex items-center justify-between bg-gray-100 px-4 py-2 rounded-t-md">
            <span className="font-semibold">{category.name}</span>
            <Switch
              checked={!!enabledCategories[category.key]}
              onCheckedChange={() => handleCategorySwitch(category.key)}
            />
          </div>
          <div className="p-4 space-y-2">
            {category.amenities.map((amenity) => (
              <div key={amenity.key} className="flex items-center gap-3">
                <Checkbox
                  checked={!!checkedAmenities[category.key]?.[amenity.key]}
                  onCheckedChange={() => handleAmenityCheck(category.key, amenity.key)}
                  disabled={!enabledCategories[category.key]}
                />
                <span className={enabledCategories[category.key] ? "text-gray-700" : "text-gray-400"}>
                  {amenity.label}
                </span>
              </div>
            ))}
          </div>
        </div>
      ))}
      <div className="flex gap-2 pt-4">
        <Button type="submit" disabled={isPending} className="flex-1">
          {isPending ? "Saving..." : "Save Amenities"}
        </Button>
        {onCancel && <Button type="button" variant="outline" onClick={onCancel}>Cancel</Button>}
      </div>
    </form>
  );
} 