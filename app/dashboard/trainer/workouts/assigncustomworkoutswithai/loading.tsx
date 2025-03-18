import { Card } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ChevronLeft } from "lucide-react";
import Link from "next/link";

export default function Loading() {
  return (
    <div className="container max-w-5xl px-4 sm:px-6 pb-16">
      <Link
        href="/dashboard/trainer/workouts"
        className="inline-flex items-center text-muted-foreground mb-8 py-2"
      >
        <ChevronLeft className="h-4 w-4 mr-1" />
        <span>Back to workouts</span>
      </Link>

      <div className="space-y-8">
        <div>
          <Skeleton className="h-9 w-3/4 max-w-md mb-2" />
          <Skeleton className="h-5 w-full max-w-2xl" />
        </div>

        <Tabs defaultValue="generate" className="space-y-6">
          <div className="bg-background sticky top-0 z-10 pb-2 pt-1 backdrop-blur-sm border-b">
            <TabsList className="w-full max-w-md mx-auto">
              <TabsTrigger value="generate" className="flex-1">Generate</TabsTrigger>
              <TabsTrigger value="history" className="flex-1">History</TabsTrigger>
            </TabsList>
          </div>

          <TabsContent value="generate" className="space-y-6 mt-6">
            <div className="grid grid-cols-1 lg:grid-cols-5 gap-8">
              {/* Client selection area */}
              <div className="lg:col-span-2">
                <Card className="overflow-hidden">
                  <div className="p-6">
                    <Skeleton className="h-7 w-40 mb-4" />
                    <div className="space-y-2">
                      <Skeleton className="h-10 w-full" />
                      <div className="mt-6">
                        <Skeleton className="h-6 w-32 mb-3" />
                        <div className="space-y-3">
                          {Array.from({ length: 4 }).map((_, i) => (
                            <div key={i} className="flex items-center gap-3">
                              <Skeleton className="h-12 w-12 rounded-full" />
                              <div className="space-y-2">
                                <Skeleton className="h-5 w-32" />
                                <Skeleton className="h-4 w-24" />
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>
                </Card>
              </div>

              {/* Workout form area */}
              <div className="lg:col-span-3">
                <Card className="overflow-hidden">
                  <div className="p-6">
                    <Skeleton className="h-7 w-48 mb-6" />
                    <div className="space-y-5">
                      <Skeleton className="h-[70px] w-full" />
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                        <Skeleton className="h-[80px] w-full" />
                        <Skeleton className="h-[80px] w-full" />
                      </div>
                      <Skeleton className="h-[80px] w-full" />
                      <Skeleton className="h-[100px] w-full" />
                      <Skeleton className="h-12 w-full" />
                    </div>
                  </div>
                </Card>
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
