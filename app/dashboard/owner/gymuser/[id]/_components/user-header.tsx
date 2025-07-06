"use client"

import { Card, CardContent } from "@/components/ui/card"
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
    <Card className="border-0">
      <CardContent className="p-4 sm:p-6">
        <div className="flex flex-col sm:flex-row items-center sm:items-start space-y-4 sm:space-y-0 sm:space-x-6">
          <Avatar className="h-20 w-20 sm:h-24 sm:w-24 border-2 border-gray-200">
            <AvatarImage src={userData.avatar || "/placeholder.svg"} alt={userData.name} />
            <AvatarFallback className="text-xl bg-blue-50 text-blue-600">
              {userData.name.split(' ').map(n => n[0]).join('')}
            </AvatarFallback>
          </Avatar>
          <div className="flex-1 text-center sm:text-left">
            <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">{userData.name}</h1>
            <p className="text-gray-600 mb-2 text-sm sm:text-base">{userData.email}</p>
            <div className="flex flex-col sm:flex-row items-center sm:items-start space-y-2 sm:space-y-0 sm:space-x-4">
              <Badge variant="secondary" className="bg-blue-100 text-blue-800 border-blue-200">
                {userData.membershipType}
              </Badge>
              <span className="text-xs sm:text-sm text-gray-500">Member since {userData.memberSince}</span>
            </div>
          </div>
          <div className="text-center bg-gray-50 rounded-lg p-3 sm:p-4 min-w-[100px]">
            <div className="text-xl sm:text-2xl font-bold text-gray-900">{monthlyVisits}</div>
            <div className="text-xs sm:text-sm text-gray-600">Visits this month</div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
