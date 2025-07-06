"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { Users, Phone, Mail, MapPin, Clock, TrendingUp } from "lucide-react"

interface TrainerData {
  name: string
  specialization: string
  experience: string
  rating: number
  avatar: string
  phone: string
  email: string
  nextSession?: string
}

interface TrainerTabProps {
  trainerData: TrainerData
}

export function TrainerTab({ trainerData }: TrainerTabProps) {
  // Helper function to safely display data or show fallback
  const displayData = (value: string | number | undefined, fallback: string = "-") => {
    if (value === undefined || value === null || value === "" || value === 0) {
      return fallback;
    }
    return value;
  };

  // Format rating display
  const formatRating = (rating: number) => {
    if (!rating || rating === 0) return "-";
    return `${rating}/5.0`;
  };
  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Your Personal Trainer</CardTitle>
          <CardDescription>Get to know your fitness coach</CardDescription>
        </CardHeader>
        <CardContent className="p-4 sm:p-6">
          <div className="flex flex-col sm:flex-row items-center sm:items-start space-y-4 sm:space-y-0 sm:space-x-6">
            <Avatar className="h-16 w-16 sm:h-20 sm:w-20">
              <AvatarImage src={trainerData.avatar || "/placeholder.svg"} alt={trainerData.name || "Trainer"} />
              <AvatarFallback>
                {trainerData.name 
                  ? trainerData.name.split(' ').map(n => n[0]).join('').toUpperCase()
                  : "T"
                }
              </AvatarFallback>
            </Avatar>
            <div className="flex-1 text-center sm:text-left">
              <h3 className="text-lg sm:text-xl font-semibold">
                {displayData(trainerData.name, "Unknown Trainer")}
              </h3>
              <p className="text-muted-foreground mb-2 text-sm">
                {displayData(trainerData.specialization, "General Fitness")}
              </p>
              <div className="flex flex-col sm:flex-row items-center sm:items-start space-y-1 sm:space-y-0 sm:space-x-4 text-sm">
                <span className="flex items-center">
                  <Users className="h-4 w-4 mr-1" />
                  {displayData(trainerData.experience, "Experience not available")}
                </span>
                <span className="flex items-center">
                  <TrendingUp className="h-4 w-4 mr-1" />
                  {formatRating(trainerData.rating)}
                </span>
              </div>
            </div>
            <div className="flex flex-row sm:flex-col space-x-2 sm:space-x-0 sm:space-y-2">
              <Button size="sm" className="text-xs">
                <Phone className="h-3 w-3 mr-1" />
                Call
              </Button>
              <Button variant="outline" size="sm" className="text-xs bg-transparent">
                <Mail className="h-3 w-3 mr-1" />
                Message
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 md:grid-cols-1 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Contact Information</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="flex items-center space-x-3">
              <Phone className="h-4 w-4 text-muted-foreground" />
              <span>{displayData(trainerData.phone, "Phone not available")}</span>
            </div>
            <div className="flex items-center space-x-3">
              <Mail className="h-4 w-4 text-muted-foreground" />
              <span>{displayData(trainerData.email, "Email not available")}</span>
            </div>
            
          </CardContent>
        </Card>

      </div>

      
    </div>
  )
}
