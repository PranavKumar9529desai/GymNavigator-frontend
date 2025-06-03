"use client"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { TrendingUp, Dumbbell, MapPin, DollarSign, Key, Mail, Phone, Edit } from "lucide-react"
import { GymHeader } from "./_components/gym-header"
import { OverviewTab } from "./_components/tabs/overview-tab"
import { AmenitiesTab } from "./_components/tabs/amenities-tab"
import { LocationTab } from "./_components/tabs/location-tab"
import { PricingTab } from "./_components/tabs/pricing-tab"
import { Button } from '@/components/ui/button';
import { useState, useEffect } from 'react';
import { EditGymDrawer } from "./_components/edit-gym-drawer"
import { EditGymSheet } from "./_components/edit-gym-sheet"
import { GymTabs } from "./_components/tabs/gym-tabs"
import { Separator } from "@/components/ui/separator"
import { useGymOperations } from "./hooks/useGymData";
import { Loader2 } from "lucide-react";
import type { AmenityCategory, GymLocation, FitnessPlan, AdditionalService } from "./types/gym-types";
import type { Trainer } from "./_actions/get-gym-tab-data";


interface GymInfo {
  gym_name: string;
  gym_logo: string;
  address: string;
  phone_number: string;
  Email: string;
  gymauthtoken: string;
}

export default function GymLayout() {
  const [isEditSheetOpen, setIsEditSheetOpen] = useState(false);
  const [isSmallDevice, setIsSmallDevice] = useState(false);
  
  // Use React Query hooks for data management
  const {
    gymDetails,
    gymTabData,
    isLoading,
    error,
    isMutating,
    updateOverview,
    updateAmenities,
    updateLocation,
    updatePricing
  } = useGymOperations();

  // Handle responsive design
  useState(() => {
    const handleResize = () => {
      setIsSmallDevice(window.innerWidth < 768);
    };

    // Initial check
    handleResize();

    // Add event listener
    window.addEventListener('resize', handleResize);

    // Cleanup event listener on component unmount
    return () => window.removeEventListener('resize', handleResize);
  });

  const handleSave = (data: any) => {
    console.log("Saving data:", data);
    setIsEditSheetOpen(false);
  };


  return (
    <div className="min-h-screen p-2 md:p-6">
      <div className="mx-auto max-w-6xl">
        <div className="flex justify-end mb-4">
           <Button 
             onClick={() => setIsEditSheetOpen(true)} 
             variant="ghost" 
             className="hover:text-blue-600"
             disabled={isMutating}
           >
            <Edit className="mr-2  text-blue-600 sm:text-gray-800 hover:text-blue-600" />
            <p className="hidden md:block">
              {isMutating ? 'Saving...' : 'Edit Gym Details'}
            </p>
          </Button>
        </div>
        
        {/* Error state */}
        {error && (
          <div className="mb-4 p-4 bg-red-50 border border-red-200 rounded-lg">
            <p className="text-red-800">Error loading gym data: {error.message}</p>
          </div>
        )}
        
        {gymDetails.data && (
          <GymHeader gymData={gymDetails.data} />
        )}

        {/* Enhanced Tabs Section */}
        <div className="">
          {isLoading ? (
            <div className="flex justify-center items-center py-8">
              <Loader2 className="h-8 w-8 animate-spin text-blue-600" />
              <span className="ml-2 text-gray-600">Loading gym data...</span>
            </div>
          ) : (
            <GymTabs 
              overviewData={gymTabData.data?.overview} 
              amenitiesData={gymTabData.data?.amenities}
              locationData={gymTabData.data?.location}
              pricingData={gymTabData.data?.pricing}
            />
          )}
        </div>
       
      </div>

      {isSmallDevice ? (
        <EditGymDrawer
          isOpen={isEditSheetOpen}
          onClose={() => setIsEditSheetOpen(false)}
          gymData={gymDetails.data}
          gymTabData={gymTabData.data}
          onSave={handleSave}
          mutations={{
            updateOverview,
            updateAmenities,
            updateLocation,
            updatePricing
          }}
        />
      ) : (
        <EditGymSheet
          isOpen={isEditSheetOpen}
          onClose={() => setIsEditSheetOpen(false)}
          gymData={gymDetails.data}
          gymTabData={gymTabData.data}
          onSave={handleSave}
          mutations={{
            updateOverview,
            updateAmenities,
            updateLocation,
            updatePricing
          }}
        />
      )}

    </div>
  )
}
