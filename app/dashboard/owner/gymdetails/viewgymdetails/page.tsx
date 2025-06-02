"use client"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { TrendingUp, Dumbbell, MapPin, DollarSign, Key, Mail, Phone, Edit } from "lucide-react"
import { GymHeader } from "./_components/gym-header"
import { OverviewTab } from "./_components/tabs/overview-tab"
import { AmenitiesTab } from "./_components/tabs/amenities-tab"
import { LocationTab } from "./_components/tabs/location-tab"
import { PricingTab } from "./_components/tabs/pricing-tab"
import FetchGymDetailsSA from './_actions/GetGymDetails';
import { Button } from '@/components/ui/button';
import { useState, useEffect } from 'react';
import { EditGymDrawer } from "./_components/edit-gym-drawer"
import { EditGymSheet } from "./_components/edit-gym-sheet"
import { GymTabs } from "./_components/tabs/gym-tabs"
import { Separator } from "@/components/ui/separator"
import { getAllGymTabData, type Trainer } from "./_actions/get-gym-tab-data";
import type { AmenityCategory, GymLocation, FitnessPlan, AdditionalService } from "./types/gym-types";


interface GymInfo {
  gym_name: string;
  gym_logo: string;
  address: string;
  phone_number: string;
  Email: string;
  gymauthtoken: string;
}

export interface GymTabData {
  overview?: { trainersData?: Trainer[] };
  amenities?: { 
    categories?: AmenityCategory[]; 
    selectedAmenities?: Record<string, string[]>; 
  };
  location?: { location?: GymLocation };
  pricing?: { 
    pricingPlans?: FitnessPlan[]; 
    additionalServices?: AdditionalService[]; 
  };
  errors?: string[];
}


export default function GymLayout() {
  const [gymDetails, setGymDetails] = useState<GymInfo | null>(null);
  const [gymTabData, setGymTabData] = useState<GymTabData | null>(null);
  const [isEditSheetOpen, setIsEditSheetOpen] = useState(false);
  const [isSmallDevice, setIsSmallDevice] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      try {
        // Fetch gym details and tab data in parallel
        const [details, tabData] = await Promise.all([
          FetchGymDetailsSA(),
          getAllGymTabData()
        ]);
        
        setGymDetails(details);
        setGymTabData(tabData);
        
        // Log any errors that occurred during data fetching
        if (tabData.errors && tabData.errors.length > 0) {
          console.warn('Some gym data could not be fetched:', tabData.errors);
        }
      } catch (error) {
        console.error('Error fetching gym data:', error);
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchData();

    const handleResize = () => {
      setIsSmallDevice(window.innerWidth < 768); // Adjust breakpoint as needed (e.g., 768px for 'md')
    };

    // Initial check
    handleResize();

    // Add event listener
    window.addEventListener('resize', handleResize);

    // Cleanup event listener on component unmount
    return () => window.removeEventListener('resize', handleResize);

  }, []); // Empty dependency array means this effect runs once on mount



  const handleSave = (data: any) => {
    console.log("Saving data:", data); // Placeholder for save logic
    setIsEditSheetOpen(false);
  };


  return (
    <div className="min-h-screen p-2 md:p-6">
      <div className="mx-auto max-w-6xl">
        <div className="flex justify-end mb-4">
           <Button onClick={() => setIsEditSheetOpen(true)} variant="ghost" className="hover:text-blue-600 ">
            <Edit className="mr-2  text-blue-600 sm:text-gray-800 hover:text-blue-600" />
            <p className="hidden md:block">
            Edit Gym Details
            </p>
          </Button>
        </div>
        {gymDetails && (
          <GymHeader gymData={gymDetails} />
        )}


        {        /* Enhanced Tabs Section */}
        <div className="">
          {isLoading ? (
            <div className="flex justify-center items-center py-8">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
              <span className="ml-2 text-gray-600">Loading gym data...</span>
            </div>
          ) : (
            <GymTabs 
              overviewData={gymTabData?.overview} 
              amenitiesData={gymTabData?.amenities}
              locationData={gymTabData?.location}
              pricingData={gymTabData?.pricing}
            />
          )}
        </div>
       
      </div>

      {isSmallDevice ? (
        <EditGymDrawer
          isOpen={isEditSheetOpen}
          onClose={() => setIsEditSheetOpen(false)}
          gymData={gymDetails}
          gymTabData={gymTabData}
          onSave={handleSave}
        />
      ) : (
        <EditGymSheet
          isOpen={isEditSheetOpen}
          onClose={() => setIsEditSheetOpen(false)}
          gymData={gymDetails}
          gymTabData={gymTabData}
          onSave={handleSave}
        />
      )}

    </div>
  )
}
