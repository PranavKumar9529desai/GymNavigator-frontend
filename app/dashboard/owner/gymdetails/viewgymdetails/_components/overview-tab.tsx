"use client"

import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { Users, TrendingUp, Calendar, Target, Clock, Award, Heart } from "lucide-react"

export function OverviewTab() {
  return (
    <div className="grid gap-6 lg:grid-cols-3">
      {/* Stats Cards */}
      <div className="lg:col-span-2">
        <div className="grid gap-4 sm:grid-cols-2">
          <Card className="border shadow-lg">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-600">Daily Visitors</p>
                  <p className="text-3xl font-bold text-gray-900">342</p>
                  <p className="text-sm text-gray-500">+12% from yesterday</p>
                </div>
                <div className="rounded-full bg-gray-100 p-3">
                  <Users className="h-6 w-6 text-gray-600" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="border shadow-lg">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-600">Active Classes</p>
                  <p className="text-3xl font-bold text-gray-900">28</p>
                  <p className="text-sm text-gray-500">Running today</p>
                </div>
                <div className="rounded-full bg-gray-100 p-3">
                  <Calendar className="h-6 w-6 text-gray-600" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="border shadow-lg">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-600">Revenue Today</p>
                  <p className="text-3xl font-bold text-gray-900">$4,892</p>
                  <p className="text-sm text-gray-500">+8% from avg</p>
                </div>
                <div className="rounded-full bg-gray-100 p-3">
                  <TrendingUp className="h-6 w-6 text-gray-600" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="border shadow-lg">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-600">Equipment Usage</p>
                  <p className="text-3xl font-bold text-gray-900">87%</p>
                  <p className="text-sm text-gray-500">Peak hours</p>
                </div>
                <div className="rounded-full bg-gray-100 p-3">
                  <Target className="h-6 w-6 text-gray-600" />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Quick Info */}
      <Card className="border shadow-lg">
        <CardHeader className="pb-4">
          <h3 className="text-xl font-bold text-gray-900">Quick Info</h3>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center gap-3">
            <Clock className="h-5 w-5 text-gray-600" />
            <div>
              <p className="font-medium text-gray-900">Operating Hours</p>
              <p className="text-sm text-gray-600">5:00 AM - 11:00 PM</p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <Award className="h-5 w-5 text-gray-600" />
            <div>
              <p className="font-medium text-gray-900">Established</p>
              <p className="text-sm text-gray-600">2015 (9 years)</p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <Heart className="h-5 w-5 text-gray-600" />
            <div>
              <p className="font-medium text-gray-900">Member Satisfaction</p>
              <div className="flex items-center gap-2">
                <Progress value={94} className="flex-1" />
                <span className="text-sm font-medium text-gray-900">94%</span>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
