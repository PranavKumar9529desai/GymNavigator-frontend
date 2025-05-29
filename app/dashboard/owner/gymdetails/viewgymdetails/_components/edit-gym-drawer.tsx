"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Drawer, DrawerContent, DrawerDescription, DrawerHeader, DrawerTitle } from "@/components/ui/drawer"
import { ConfirmDialog } from "./confirm-dialog"
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs"
import { TrendingUp, Dumbbell, MapPin, DollarSign } from "lucide-react"

import type { GymData } from "../types/gym-types"
import { AMENITY_CATEGORIES } from './amenities-tab';
import { SingleTab } from "./gym-tabs";

// Import edit form components
import { OverviewEditForm } from './editable/overview-edit-form';
import { AmenitiesEditForm } from './editable/amenities-edit-form';
import { LocationEditForm } from './editable/location-edit-form';
import { PricingEditForm } from './editable/pricing-edit-form';

interface EditGymDrawerProps {
  isOpen: boolean
  onClose: () => void
  gymData: GymData | null;
  onSave: (data: GymData) => void
}

export function EditGymDrawer({ isOpen, onClose, gymData, onSave }: EditGymDrawerProps) {
  const [activeTab, setActiveTab] = useState("overview");
  const [formData, setFormData] = useState<GymData>(gymData || {} as GymData);
  const [showConfirm, setShowConfirm] = useState(false);

   // Update formData when gymData prop changes
  useEffect(() => {
    setFormData(gymData || {} as GymData);
  }, [gymData]);

  const handleSaveClick = () => {
    setShowConfirm(true);
  };

  const handleConfirmSave = () => {
     // formData is already updated by the individual form components
    onSave(formData);
    setShowConfirm(false);
  };

  const handleCancel = () => {
     // Optionally reset formData to original gymData here if needed
    onClose();
  };

  if (!gymData) return null; // Don't render if no gym data

  return (
    <>
      <Drawer open={isOpen} onOpenChange={onClose}>
        <DrawerContent className="h-[90%] overflow-y-auto">
           <DrawerHeader>
            <DrawerTitle>Edit Gym Details</DrawerTitle>
            <DrawerDescription>Select a tab to edit specific gym information.</DrawerDescription>
          </DrawerHeader>

           <div className="px-4">
            <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full mt-2">
               <TabsList className="grid w-full grid-cols-2 sm:grid-cols-4 rounded-md bg-gray-100 p-1">
                  <SingleTab
                    name="overview"
                    label="Overview"
                    icon={TrendingUp}
                  />
                  <SingleTab
                    name="amenities"
                    label="Amenities"
                    icon={Dumbbell}
                  />
                  <SingleTab
                    name="location"
                    label="Location"
                    icon={MapPin}
                  />
                  <SingleTab
                    name="pricing"
                    label="Pricing"
                    icon={DollarSign}
                  />
                </TabsList>

                <div className="px-4 mt-24 h-[calc(100vh-350px)] overflow-y-auto">
                  <TabsContent value="overview" className="mt-0">
                     <OverviewEditForm data={formData} onDataChange={setFormData} />
                  </TabsContent>
                  <TabsContent value="amenities" className="mt-0">
                     <AmenitiesEditForm categories={AMENITY_CATEGORIES} selectedAmenities={formData.amenities || {}} onChange={(updatedAmenities) => setFormData(prev => ({ ...prev, amenities: updatedAmenities }))} onSave={() => { /* Handle save within the form if needed */ }} onCancel={() => { /* Handle cancel within the form if needed */ }} />
                  </TabsContent>
                  <TabsContent value="location" className="mt-0">
                     <LocationEditForm data={formData} onDataChange={setFormData} />
                  </TabsContent>
                  <TabsContent value="pricing" className="mt-0">
                     <PricingEditForm data={formData} onDataChange={setFormData} />
                  </TabsContent>
                </div>
            </Tabs>
             <div className="flex gap-3 pt-4 px-4">
              <Button type="button" className="flex-1" onClick={handleSaveClick}>
                Save Changes asdasd
              </Button>
              <Button type="button" variant="outline" onClick={handleCancel}>
                Cancel
              </Button>
            </div>
          </div>
        </DrawerContent>
      </Drawer>

       <ConfirmDialog
        isOpen={showConfirm}
        onClose={() => setShowConfirm(false)}
        onConfirm={handleConfirmSave}
        title="Save Changes"
        description="Are you sure you want to save these changes?"
      />
    </>
  )
}
