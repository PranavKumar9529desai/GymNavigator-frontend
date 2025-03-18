"use client";

import { Button } from "@/components/ui/button";
import { User, UserSearch, Activity, Weight, Ruler, CalendarClock, ArrowRight } from "lucide-react";
import { useRouter } from "next/navigation";
import type { UserData } from "../_actions/get-user-by-id";
import { useState } from "react";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

interface ClientDisplayProps {
  user: UserData | null;
}

export default function ClientDisplay({ user }: ClientDisplayProps) {
  const router = useRouter();
  const [isNavigating, setIsNavigating] = useState(false);

  const handleClientSelection = () => {
    setIsNavigating(true);
    router.push('/dashboard/trainer/clients');
  };

  if (!user) {
    return (
      <Card className="overflow-hidden border-dashed">
        <CardHeader className="bg-muted/30 pb-8">
          <CardTitle className="flex items-center gap-2 text-lg">
            <User className="h-4 w-4" />
            Client Information
          </CardTitle>
        </CardHeader>
        <CardContent className="p-6 -mt-4">
          <div className="flex flex-col items-center justify-center p-6 text-center space-y-4">
            <div className="h-16 w-16 rounded-full bg-muted flex items-center justify-center">
              <User className="h-8 w-8 text-muted-foreground/60" />
            </div>
            <div className="space-y-2">
              <h3 className="font-medium">No Client Selected</h3>
              <p className="text-sm text-muted-foreground max-w-xs">
                Please select a client to create a personalized AI workout plan
              </p>
            </div>
            <Button 
              className="mt-2 w-full sm:w-auto transition-all"
              onClick={handleClientSelection}
              disabled={isNavigating}
            >
              {isNavigating ? (
                <span className="flex items-center gap-2">
                  <div className="animate-spin h-4 w-4 border-2 border-background border-t-transparent rounded-full" />
                  Navigating...
                </span>
              ) : (
                <span className="flex items-center gap-2">
                  <UserSearch className="h-4 w-4" />
                  Select Client
                  <ArrowRight className="h-4 w-4 ml-1" />
                </span>
              )}
            </Button>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader className="bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-950/20 dark:to-indigo-950/20">
        <CardTitle className="flex items-center gap-2 text-lg">
          <User className="h-4 w-4" />
          Client Information
        </CardTitle>
      </CardHeader>
      <CardContent className="p-6">
        <div className="flex flex-col sm:flex-row sm:items-center gap-4 mb-4 pb-4 border-b">
          <Avatar className="h-16 w-16 border-2 border-primary/10">
            <AvatarFallback className="bg-gradient-to-br from-blue-100 to-blue-200 text-blue-700 text-xl">
              {user.name[0]}
            </AvatarFallback>
          </Avatar>
          <div>
            <h3 className="font-medium text-lg">{user.name}</h3>
            <p className="text-sm text-muted-foreground">{user.email}</p>
            {user.hasActiveWorkoutPlan && (
              <Badge variant="secondary" className="mt-2 gap-1.5">
                <Activity className="h-3 w-3" />
                Active Plan: {user.activeWorkoutPlan?.name}
              </Badge>
            )}
          </div>
        </div>
        
        {user.healthProfile ? (
          <div className="grid grid-cols-2 gap-3">
            <div className="flex items-center gap-2 p-3 rounded-lg bg-muted/40">
              <div className="h-8 w-8 rounded-full bg-blue-100 flex items-center justify-center text-blue-600">
                <Weight className="h-4 w-4" />
              </div>
              <div>
                <div className="text-xs text-muted-foreground">Weight</div>
                <div className="font-medium">{user.healthProfile.weight ? `${user.healthProfile.weight} kg` : "—"}</div>
              </div>
            </div>
            <div className="flex items-center gap-2 p-3 rounded-lg bg-muted/40">
              <div className="h-8 w-8 rounded-full bg-green-100 flex items-center justify-center text-green-600">
                <Ruler className="h-4 w-4" />
              </div>
              <div>
                <div className="text-xs text-muted-foreground">Height</div>
                <div className="font-medium">{user.healthProfile.height ? `${user.healthProfile.height} cm` : "—"}</div>
              </div>
            </div>
            <div className="flex items-center gap-2 p-3 rounded-lg bg-muted/40">
              <div className="h-8 w-8 rounded-full bg-amber-100 flex items-center justify-center text-amber-600">
                <CalendarClock className="h-4 w-4" />
              </div>
              <div>
                <div className="text-xs text-muted-foreground">Age</div>
                <div className="font-medium">{user.healthProfile.age ? `${user.healthProfile.age} years` : "—"}</div>
              </div>
            </div>
            <div className="flex items-center gap-2 p-3 rounded-lg bg-muted/40">
              <div className="h-8 w-8 rounded-full bg-purple-100 flex items-center justify-center text-purple-600">
                <Activity className="h-4 w-4" />
              </div>
              <div>
                <div className="text-xs text-muted-foreground">Goal</div>
                <div className="font-medium">{user.healthProfile.goal || "—"}</div>
              </div>
            </div>
          </div>
        ) : (
          <div className="flex items-center gap-3 p-4 rounded-lg bg-amber-50 border border-amber-200 text-amber-800">
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="12" cy="12" r="10" />
              <line x1="12" x2="12" y1="8" y2="12" />
              <line x1="12" x2="12.01" y1="16" y2="16" />
            </svg>
            <div className="text-sm">
              <p className="font-medium">No Health Profile</p>
              <p>The AI workout will use general parameters</p>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
