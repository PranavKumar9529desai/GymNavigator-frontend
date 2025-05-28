"use client"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { TrendingUp, Dumbbell, MapPin, DollarSign, Key, Mail, Phone, Edit } from "lucide-react"
import { GymHeader } from "./_components/gym-header"
import { OverviewTab } from "./_components/overview-tab"
import { AmenitiesTab } from "./_components/amenities-tab"
import { LocationTab } from "./_components/location-tab"
import { PricingTab } from "./_components/pricing-tab"
import FetchGymDetailsSA from './_actions/GetGymDetails';
import { Button } from '@/components/ui/button';
import { useState, useEffect } from 'react';
import { EditGymSheet } from "./_components/edit-gym-sheet"


interface GymInfo {
  gym_name: string;
  gym_logo: string;
  address: string;
  phone_number: string;
  Email: string;
  gymauthtoken: string;
}


export default function GymLayout() {
  const [gymDetails, setGymDetails] = useState<GymInfo | null>(null);
  const [isEditSheetOpen, setIsEditSheetOpen] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      const details = await FetchGymDetailsSA();
      setGymDetails(details);
    };
    fetchData();
  }, []); // Empty dependency array means this effect runs once on mount



  const handleSave = (data: any) => {
    console.log("Saving data:", data); // Placeholder for save logic
    setIsEditSheetOpen(false);
  };


  return (
    <div className="min-h-screen bg-gray-50 p-4 md:p-6">
      <div className="mx-auto max-w-6xl">
        <div className="flex justify-end mb-4">
           <Button onClick={() => setIsEditSheetOpen(true)} variant="ghost" className="hover:text-blue-600">
            <Edit className="mr-2 h-4 w-4" />
            Edit Gym Details
          </Button>
        </div>
        {gymDetails && (
          <>
            <GymHeader gymData={gymDetails} />

            {/* Displaying Contact and Auth Token Details */}
           
          </>
        )}


        {/* Enhanced Tabs Section */}
        <Tabs defaultValue="" className="w-full mt-8">
          <TabsList className="grid w-full grid-cols-4 rounded-2xl p-2 bg-transparent h-16">
            <TabsTrigger
              value="general"
              className="px-4 py-3 font-semibold transition-all border-b-4  data-[state=active]:border-blue-600 data-[state=active]:text-blue-600 "
            >
              <TrendingUp className="mr-2 h-4 w-4" />
              <span>
              Overview
              </span>
            </TabsTrigger>
            <TabsTrigger
              value="amenities"
              className="px-4 py-3 font-semibold transition-all border-b-4  data-[state=active]:border-blue-600 data-[state=active]:text-blue-600"
            >
              <Dumbbell className="mr-2 h-4 w-4" />
              Amenities
            </TabsTrigger>
            <TabsTrigger
              value="address"
              className="px-4 py-3 font-semibold transition-all border-b-4  data-[state=active]:border-blue-600 data-[state=active]:text-blue-600 "
            >
              <MapPin className="mr-2 h-4 w-4" />
              Location
            </TabsTrigger>
            <TabsTrigger
              value="fees"
              className="px-4 py-3 font-semibold transition-all border-b-4  data-[state=active]:border-blue-600 data-[state=active]:text-blue-600"
            >
              <DollarSign className="mr-2 h-4 w-4" />
              Pricing
            </TabsTrigger>
          </TabsList>

          <div className="mt-8">
            <TabsContent value="general" className="mt-0">
              <OverviewTab />
            </TabsContent>

            <TabsContent value="amenities" className="mt-0">
              <AmenitiesTab />
            </TabsContent>

            <TabsContent value="address" className="mt-0">
              <LocationTab />
            </TabsContent>

            <TabsContent value="fees" className="mt-0">
              <PricingTab />
            </TabsContent>
          </div>
        </Tabs>
      </div>

       <EditGymSheet
        isOpen={isEditSheetOpen}
        onClose={() => setIsEditSheetOpen(false)}
        gymData={gymDetails}
        onSave={handleSave}
      />

    </div>
  )
}
