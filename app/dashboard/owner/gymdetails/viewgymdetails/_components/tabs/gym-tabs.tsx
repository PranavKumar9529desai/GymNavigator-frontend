import { TabsContent , TabsList , TabsTrigger , Tabs } from "@/components/ui/tabs"
import { TrendingUp, Dumbbell, MapPin, DollarSign, type LucideIcon } from "lucide-react"
import { AmenitiesTab } from "./amenities-tab"
import { LocationTab } from "./location-tab"
import { OverviewTab } from "./overview-tab"
import { PricingTab } from "./pricing-tab"
import { Separator } from "@/components/ui/separator"
import { motion } from "framer-motion";
import type { AmenityCategory, FitnessPlan, AdditionalService, GymLocation } from "../../types/gym-types"
import type { Trainer } from "../../_actions/get-gym-tab-data"

interface GymTabsProps {
  overviewData?: { trainersData?: Trainer[] };
  amenitiesData?: { 
    categories?: AmenityCategory[]; 
    selectedAmenities?: Record<string, string[]>; 
  };
  locationData?: { location?: GymLocation };
  pricingData?: { 
    pricingPlans?: FitnessPlan[]; 
    additionalServices?: AdditionalService[]; 
  };
}

export const GymTabs = ({ 
  overviewData, 
  amenitiesData, 
  locationData, 
  pricingData 
}: GymTabsProps) => {
  // Debug logging
  console.log('GymTabs received locationData:', locationData);
  
  return <>
     <Tabs defaultValue="general" className="w-full ">
          <TabsList className="flex justify-around flex-wrap sm:flex-nowrap w-full rounded-lg p-1 bg-gray-100 dark:bg-gray-800">
            <SingleTab
              name="general"
              label="Overview"
              icon={TrendingUp}
            />
            <SingleTab
              name="amenities"
              label="Amenities"
              icon={Dumbbell}
            />
            <SingleTab
              name="address"
              label="Location"
              icon={MapPin}
            />
            <SingleTab
              name="fees"
              label="Pricing"
              icon={DollarSign}
            />
          </TabsList>
<Separator className="hidden md:block" />
          <div className="mt-20">
            <TabsContent value="general" >
              <motion.div
                key="general"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 10 }}
                transition={{ duration: 0.3 }}
              >
                <OverviewTab trainersData={overviewData?.trainersData} />
              </motion.div>
            </TabsContent>

            <TabsContent value="amenities" >
              <motion.div
                key="amenities"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 10 }}
                transition={{ duration: 0.3 }}
              >
                <AmenitiesTab 
                  categories={amenitiesData?.categories}
                  selectedAmenities={amenitiesData?.selectedAmenities}
                />
              </motion.div>
            </TabsContent>

            <TabsContent value="address" >
              <motion.div
                key="address"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 10 }}
                transition={{ duration: 0.3 }}
              >
                <LocationTab location={locationData?.location} />
              </motion.div>
            </TabsContent>

            <TabsContent value="fees" >
              <motion.div
                key="fees"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 10 }}
                transition={{ duration: 0.3 }}
              >
                <PricingTab 
                  pricingPlans={pricingData?.pricingPlans}
                  additionalServices={pricingData?.additionalServices}
                />
              </motion.div>
            </TabsContent>
          </div>
        </Tabs>
    </>
}



export const  SingleTab = ( { name , label, icon } : { name : string , label: string, icon : LucideIcon})=>{
    const Icon = icon;
    return (
        <TabsTrigger
            value={name}
            className="inline-flex items-center justify-center whitespace-nowrap rounded-md px-4 py-2 text-sm font-medium ring-offset-background transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 data-[state=active]:bg-blue-600 data-[state=active]:text-white data-[state=active]:shadow-sm"
        >
            <Icon className="mr-2 h-4 w-4" />
            {label}
        </TabsTrigger>
    );
}