import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { DietFormSkeleton } from "./_components/diet-form-skeleton";

export default function Loading() {
  return (
    <div className="container mx-auto p-4">
      <div className="relative">
        {/* The sticky wrapper div */}
        <div className="sticky top-0 z-30 bg-white/95 dark:bg-gray-950/95 backdrop-blur-sm">
          <Tabs defaultValue="generate" className="w-full">
            <TabsList className="grid grid-cols-3 w-full">
              <TabsTrigger value="generate" className="bg-green-50 dark:bg-green-900/30">Generate</TabsTrigger>
              <TabsTrigger value="diet" disabled>Diet</TabsTrigger>
              <TabsTrigger value="history" disabled>History</TabsTrigger>
            </TabsList>
            
            <div className="pb-6" /> {/* Spacer */}
            
            <TabsContent value="generate">
              <DietFormSkeleton />
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  );
} 