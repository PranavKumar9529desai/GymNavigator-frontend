"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle } from "@/components/ui/sheet"
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs"
import { TrendingUp, Dumbbell, MapPin, DollarSign } from "lucide-react"

import type { GymData } from "../types/gym-types"
import { AMENITY_CATEGORIES } from './tabs/amenities-tab';

// Import edit form components
import { OverviewEditForm } from './editable/overview-edit-form';
import { AmenitiesEditForm } from './editable/amenities-edit-form';
import { LocationEditForm } from './editable/location-edit-form';
import { PricingEditForm } from './editable/pricing-edit-form';

interface EditGymSheetProps {
  isOpen: boolean
  onClose: () => void
  gymData: GymData | null;
  onSave: (data: GymData) => void
}

export function EditGymSheet({ isOpen, onClose, gymData, onSave }: EditGymSheetProps) {
  const [activeTab, setActiveTab] = useState("overview");
  const [formData, setFormData] = useState<GymData>(gymData || {} as GymData);

  // Update formData when gymData prop changes
  useEffect(() => {
    setFormData(gymData || {} as GymData);
  }, [gymData]);

  if (!gymData) return null; // Don't render if no gym data

  return (
    <>
      <Sheet open={isOpen} onOpenChange={onClose} >
        <SheetContent className="w-[400px] sm:w-[540px] overflow-y-auto z-50 ">
          <SheetHeader>
            <SheetTitle>Edit Gym Details</SheetTitle>
            <SheetDescription>Select a tab to edit specific gym information.</SheetDescription>
          </SheetHeader>

          <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full mt-6">
             <TabsList className="grid w-full grid-cols-2 sm:grid-cols-4 rounded-md bg-gray-100 p-1">
                <TabsTrigger value="overview" className=" rounded-sm">
                  <TrendingUp className="mr-2 h-4 w-4" /> Overview
                </TabsTrigger>
                <TabsTrigger value="amenities" className=" rounded-sm">
                  <Dumbbell className="mr-2 h-4 w-4" /> Amenities
                </TabsTrigger>
                <TabsTrigger value="location" className=" rounded-sm">
                  <MapPin className="mr-2 h-4 w-4" /> Location
                </TabsTrigger>
                <TabsTrigger value="pricing" className=" rounded-sm">
                  <DollarSign className="mr-2 h-4 w-4" /> Pricing
                </TabsTrigger>
              </TabsList>

              <div className="mt-4">
                <TabsContent value="overview" className="mt-0">
                   <OverviewEditForm data={formData} onDataChange={setFormData} onSave={() => onClose()} />
                </TabsContent>
                <TabsContent value="amenities" className="mt-0">
                   <AmenitiesEditForm categories={AMENITY_CATEGORIES} selectedAmenities={formData.amenities || {}} onChange={(updatedAmenities) => setFormData(prev => ({ ...prev, amenities: updatedAmenities }))} onSave={() => onClose()} onCancel={() => onClose()} />
                </TabsContent>
                <TabsContent value="location" className="mt-0">
                   <LocationEditForm data={formData} onDataChange={setFormData} onSave={() => onClose()} />
                </TabsContent>
                <TabsContent value="pricing" className="mt-0">
                   <PricingEditForm data={formData} onDataChange={setFormData} onSave={() => onClose()} />
                </TabsContent>
              </div>
          </Tabs>

          {/* Removed global save/cancel buttons since each form now has its own */}

        </SheetContent>
      </Sheet>
    </>
  )
}
