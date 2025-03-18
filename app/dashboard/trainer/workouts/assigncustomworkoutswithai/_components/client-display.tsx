"use client";

import { Button } from "@/components/ui/button";
import { User, UserSearch } from "lucide-react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import type { UserData } from "../_actions/get-user-by-id";
import { useState } from "react";

interface ClientDisplayProps {
  user: UserData | null;
}

export default function ClientDisplay({ user }: ClientDisplayProps) {
  const router = useRouter();
  const [isNavigating, setIsNavigating] = useState(false);

  if (!user) {
    return (
      <div className="space-y-4">
        <div className="text-sm text-amber-600 bg-amber-50 p-3 rounded-md border border-amber-200">
          No client selected. Please select a client to create a personalized workout plan.
        </div>
        
        <Button 
          variant="outline" 
          className="w-full h-14 justify-between font-normal text-muted-foreground"
          onClick={() => {
            setIsNavigating(true);
            router.push('/dashboard/trainer/clients');
          }}
          disabled={isNavigating}
        >
          <div className="flex items-center gap-2">
            <UserSearch className="h-4 w-4" />
            <span>Browse clients</span>
          </div>
          {isNavigating ? (
            <div className="animate-spin h-4 w-4 border-2 border-primary border-t-transparent rounded-full" />
          ) : null}
        </Button>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-4">
        <div className="flex h-12 w-12 items-center justify-center rounded-full bg-blue-100 text-blue-600 text-xl font-semibold">
          {user.name[0]}
        </div>
        <div>
          <h3 className="font-medium">{user.name}</h3>
          <p className="text-sm text-muted-foreground">{user.email}</p>
        </div>
      </div>
      
      {user.healthProfile ? (
        <div className="grid grid-cols-2 gap-2 mt-4 text-sm">
          <div className="border rounded-md p-2">
            <div className="text-xs text-muted-foreground">Height</div>
            <div>{user.healthProfile.height ? `${user.healthProfile.height} cm` : "Not set"}</div>
          </div>
          <div className="border rounded-md p-2">
            <div className="text-xs text-muted-foreground">Weight</div>
            <div>{user.healthProfile.weight ? `${user.healthProfile.weight} kg` : "Not set"}</div>
          </div>
          <div className="border rounded-md p-2">
            <div className="text-xs text-muted-foreground">Goal</div>
            <div>{user.healthProfile.goal || "Not specified"}</div>
          </div>
          <div className="border rounded-md p-2">
            <div className="text-xs text-muted-foreground">Gender</div>
            <div>{user.healthProfile.gender || "Not specified"}</div>
          </div>
        </div>
      ) : (
        <div className="text-sm text-amber-600 bg-amber-50 p-3 rounded-md border border-amber-200">
          This client doesn't have a health profile yet. The AI workout will be based on general parameters.
        </div>
      )}
      
      {user.hasActiveWorkoutPlan && (
        <div className="bg-blue-50 border-blue-200 border p-3 rounded-md text-sm text-blue-700">
          <div className="font-medium">Current active workout plan:</div>
          <div>{user.activeWorkoutPlan?.name}</div>
        </div>
      )}
    </div>
  );
}
