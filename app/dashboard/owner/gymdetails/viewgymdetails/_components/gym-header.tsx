"use client"

import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Mail, Phone, User, Users, Star, Edit3, Dumbbell, UserCheck, Globe, MapPin, Key, Trophy, Crown } from "lucide-react"

import type { GymData, FitnessPlan, Amenity, StaffMember, Equipment } from "../types/gym-types"

interface GymHeaderProps {
  gymData: GymData | null;
}

export function GymHeader({ gymData }: GymHeaderProps) {

  if (!gymData) {
    return null; // Or render a loading/placeholder state if needed
  }

  return (
    <>
      {/* Enhanced Header Section */}
      <div className="relative mb-8  ">
        {/* Hero Section */}
        <div className=" p-8">
          <div className="flex flex-col gap-6 lg:flex-row lg:items-center lg:gap-8">
            {/* Left side - Enhanced Logo */}
            <div className="flex justify-center lg:justify-start">
              <div className="relative group">
                <Avatar className="h-24 w-24 border-4 border-gray-200 shadow-xl lg:h-28 lg:w-28 transition-all group-hover:shadow-2xl">
                  <AvatarFallback className="bg-black text-2xl font-black text-white">
                    {gymData.gym_logo}
                  </AvatarFallback>
                </Avatar>
              
              </div>
            </div>

            {/* Right side - Enhanced Gym Details */}
            <div className="flex-1 text-center lg:text-left">
              <div className="mb-2 flex flex-wrap items-center justify-center gap-2 lg:justify-start relative">
                <div className="relative inline-block">
                  <h1 className="text-5xl text-gray-900 lg:text-4xl font-[var(--font-productSans)-900] ">
                    {gymData.gym_name}
                  </h1>
                  <Crown className="absolute -top-3 -right-5 w-6 h-6 text-yellow-400 drop-shadow-md rotate-45"/>
                </div>
              </div>

          
              {/* Basic Address Info */}
              <div className="flex items-center justify-center lg:justify-start text-gray-600 gap-2 mt-2">
                {gymData.address && (
                  <div className="flex items-center gap-1">
                    <MapPin className="w-4 h-4" />
                    <span className="text-sm">{gymData.address}</span>
                  </div>
                )}
              
              </div>

              {/* Contact and Auth Token Info */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mt-4 text-gray-700">
               {gymData.Email && (
                <div className="flex items-center gap-3">
                  <Mail className="h-6 w-6 text-gray-600" />
                  <div>
                    <p className="text-xs text-gray-500 text-left">Email Address</p>
                    <p className="font-medium break-all">{gymData.Email}</p>
                  </div>
                </div>
               )}
               {gymData.phone_number && (
                <div className="flex items-center gap-3">
                  <Phone className="h-6 w-6 text-gray-600" />
                  <div>
                    <p className="text-xs text-gray-500 text-left">Phone Number</p>
                    <p className="font-medium">{gymData.phone_number}</p>
                  </div>
                </div>
               )}
               {gymData.gymauthtoken && (
                <div 
                  className="text-left flex items-center gap-3 col-span-1 sm:col-span-2 lg:col-span-1 cursor-pointer hover:bg-gray-50 p-2 rounded-md transition-colors"
                  onClick={() => {
                    navigator.clipboard.writeText(gymData.gymauthtoken);
                    // Optional: Add toast notification here
                  }}
                >
                  <Key className="h-6 w-6 text-gray-600" /> 
                  <div>
                    <p className="text-xs text-gray-500">Auth Token</p>
                    <p className="font-mono text-sm truncate">{gymData.gymauthtoken}</p>
                  </div>
                </div>
               )}
            </div>


            </div>
          </div>
        </div>

      </div>
    </>
  )
}
