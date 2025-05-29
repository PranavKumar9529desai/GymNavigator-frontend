import { TabsContent , TabsList , TabsTrigger , Tabs } from "@/components/ui/tabs"
import { TrendingUp, Dumbbell, MapPin, DollarSign, LucideIcon } from "lucide-react"
import { AmenitiesTab } from "./amenities-tab"
import { LocationTab } from "./location-tab"
import { OverviewTab } from "./overview-tab"
import { PricingTab } from "./pricing-tab"

export const GymTabs = ()=>{
    return <>
     <Tabs defaultValue="" className="w-full ">
          <TabsList className="flex justify-around flex-wrap sm:flex-nowrap  w-full  rounded-2xl   h-16  bg-transparent  px-4">
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

          <div className="mt-10">
            <TabsContent value="general" >
              <OverviewTab />
            </TabsContent>

            <TabsContent value="amenities" >
              <AmenitiesTab />
            </TabsContent>

            <TabsContent value="address" >
              <LocationTab />
            </TabsContent>

            <TabsContent value="fees" >
              <PricingTab />
            </TabsContent>
          </div>
        </Tabs>
    </>
}



const  SingleTab = ( { name , label, icon } : { name : string , label: string, icon : LucideIcon})=>{
    const Icon = icon;
    return (
        <TabsTrigger
            className="px-4 py-3 font-semibold transition-all border-b-4  border-transparent data-[state=active]:border-blue-600 data-[state=active]:text-blue-600 bg-transparent shadow-none"
            value={name}
        >
            <Icon className="mr-2 h-4 w-4" />
            <span>{label}</span>
        </TabsTrigger>
    );
}