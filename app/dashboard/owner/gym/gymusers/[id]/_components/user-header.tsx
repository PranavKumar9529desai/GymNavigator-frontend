"use client"

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"

interface UserData {
  name: string
  email: string
  phone: string
  memberSince: string
  membershipType: string
  avatar: string
}

interface UserHeaderProps {
  userData: UserData
  monthlyVisits: number
}

export function UserHeader({ userData, monthlyVisits }: UserHeaderProps) {
  return (
    <div className="mb-6">
      <div className="p-4 space-y-4 md:p-6">
        {/* Mobile Layout - Stacked */}
        <div className="flex flex-col items-center space-y-4 md:hidden">
          {/* Avatar */}
          <Avatar className="h-16 w-16 border border-gray-100 shadow-sm">
            <AvatarImage src={userData.avatar || "/placeholder.svg"} alt={userData.name} />
            <AvatarFallback className="text-lg bg-blue-50 text-blue-600 font-medium">
              {userData.name.split(' ').map(n => n[0]).join('')}
            </AvatarFallback>
          </Avatar>
          
          {/* User Info */}
          <div className="text-center space-y-2">
            <h1 className="text-xl font-bold text-gray-900 leading-tight">{userData.name}</h1>
            <p className="text-sm text-gray-600">{userData.email}</p>
            
            {/* Badge and Member Info */}
            <div className="flex flex-col items-center space-y-2">
              <Badge variant="secondary" className="bg-blue-100 text-blue-800 border-blue-200 text-xs px-2 py-1">
                {userData.membershipType}
              </Badge>
              <span className="text-xs text-gray-500">Member since {userData.memberSince}</span>
            </div>
          </div>
          
          {/* Visits Counter */}
          <div className="bg-gray-50 rounded-lg p-3 w-full max-w-[140px] text-center bg-white">
            <div className="text-lg font-bold text-gray-900">{monthlyVisits}</div>
            <div className="text-xs text-gray-600">Visits this month</div>
          </div>
        </div>

        {/* Desktop Layout - Horizontal */}
        <div className="hidden md:flex items-start space-x-6">
          <Avatar className="h-20 w-20 lg:h-24 lg:w-24 border border-gray-100 shadow-sm">
            <AvatarImage src={userData.avatar || "/placeholder.svg"} alt={userData.name} />
            <AvatarFallback className="text-xl bg-blue-50 text-blue-600 font-medium">
              {userData.name.split(' ').map(n => n[0]).join('')}
            </AvatarFallback>
          </Avatar>
          
          <div className="flex-1">
            <h1 className="text-2xl lg:text-3xl font-bold text-gray-900 mb-2">{userData.name}</h1>
            <p className="text-gray-600 mb-3">{userData.email}</p>
            <div className="flex items-center space-x-4">
              <Badge variant="secondary" className="bg-blue-100 text-blue-800 border-blue-200">
                {userData.membershipType}
              </Badge>
              <span className="text-sm text-gray-500">Member since {userData.memberSince}</span>
            </div>
          </div>
          
          <div className="bg-gray-50 rounded-lg p-4 min-w-[120px] text-center">
            <div className="text-2xl font-bold text-gray-900">{monthlyVisits}</div>
            <div className="text-sm text-gray-600">Visits this month</div>
          </div>
        </div>
      </div>
    </div>
  )
}
