import { TabsContent , TabsList , TabsTrigger , Tabs } from "@/components/ui/tabs"
import { TrendingUp, Dumbbell, MapPin, DollarSign, type LucideIcon } from "lucide-react"
import { AmenitiesTab } from "./amenities-tab"
import { LocationTab, GymLocation } from "./location-tab"
import { OverviewTab } from "./overview-tab"
import { PricingTab } from "./pricing-tab"
import { Separator } from "@/components/ui/separator"
import { motion } from "framer-motion";

export const GymTabs = ()=>{
    return <>
     <Tabs defaultValue="" className="w-full ">
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
                <OverviewTab />
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
                <AmenitiesTab />
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
                <LocationTab location={{
                  lat: 34.0736,
                  lng: -118.4004,
                  address: "2847 Fitness Boulevard, Suite 100",
                  city: "Wellness City",
                  state: "California 90210",
                }} />
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
                <PricingTab />
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
            className="px-4 py-3 font-semibold transition-all border-b-4 border-transparent data-[state=active]:border-blue-600 data-[state=active]:text-blue-600 data-[state=active]:bg-transparent shadow-none"
            value={name}
        >
            <Icon className="mr-2 h-4 w-4" />
            <span className="text-sm font-medium">{label}</span>
        </TabsTrigger>
    );
}