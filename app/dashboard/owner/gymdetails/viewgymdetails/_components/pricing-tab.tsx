"use client"

import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"

export function PricingTab() {
  return (
    <div className="space-y-6">
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {/* Basic Plan */}
        <Card className="border shadow-lg">
          <CardHeader className="bg-gray-900 text-white">
            <h3 className="text-xl font-bold">Basic</h3>
            <p className="text-gray-300">Perfect for beginners</p>
          </CardHeader>
          <CardContent className="p-6">
            <div className="mb-6">
              <span className="text-4xl font-black text-gray-900">$29.99</span>
              <span className="text-gray-500">/month</span>
            </div>
            <div className="space-y-3">
              <div className="flex items-center gap-2">
                <div className="h-2 w-2 rounded-full bg-black"></div>
                <span className="text-sm text-gray-700">Gym equipment access</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="h-2 w-2 rounded-full bg-black"></div>
                <span className="text-sm text-gray-700">Locker room access</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="h-2 w-2 rounded-full bg-black"></div>
                <span className="text-sm text-gray-700">Free WiFi</span>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Premium Plan */}
        <Card className="border-2 border-black shadow-lg">
      
          <CardHeader className="bg-gray-900 text-white">
            <h3 className="text-xl font-bold">Premium</h3>
            <p className="text-gray-300">Everything you need</p>
          </CardHeader>
          <CardContent className="p-6">
            <div className="mb-6">
              <span className="text-4xl font-black text-gray-900">$49.99</span>
              <span className="text-gray-500">/month</span>
            </div>
            <div className="space-y-3">
              <div className="flex items-center gap-2">
                <div className="h-2 w-2 rounded-full bg-black"></div>
                <span className="text-sm text-gray-700">All Basic features</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="h-2 w-2 rounded-full bg-black"></div>
                <span className="text-sm text-gray-700">Group classes included</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="h-2 w-2 rounded-full bg-black"></div>
                <span className="text-sm text-gray-700">Sauna & steam room</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="h-2 w-2 rounded-full bg-black"></div>
                <span className="text-sm text-gray-700">Guest privileges (2/month)</span>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Elite Plan */}
        <Card className="border shadow-lg">
          <CardHeader className="bg-gray-900 text-white">
            <h3 className="text-xl font-bold">Elite</h3>
            <p className="text-gray-300">Ultimate experience</p>
          </CardHeader>
          <CardContent className="p-6">
            <div className="mb-6">
              <span className="text-4xl font-black text-gray-900">$79.99</span>
              <span className="text-gray-500">/month</span>
            </div>
            <div className="space-y-3">
              <div className="flex items-center gap-2">
                <div className="h-2 w-2 rounded-full bg-black"></div>
                <span className="text-sm text-gray-700">All Premium features</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="h-2 w-2 rounded-full bg-black"></div>
                <span className="text-sm text-gray-700">Personal training (2/month)</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="h-2 w-2 rounded-full bg-black"></div>
                <span className="text-sm text-gray-700">Nutrition consultation</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="h-2 w-2 rounded-full bg-black"></div>
                <span className="text-sm text-gray-700">Priority booking</span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Additional Fees */}
      <Card className="border shadow-lg">
        <CardHeader>
          <h3 className="text-xl font-bold text-gray-900">Additional Services</h3>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            <div className="text-center">
              <p className="font-semibold text-gray-900">Registration Fee</p>
              <p className="text-2xl font-bold text-gray-900">$25</p>
              <p className="text-sm text-gray-500">One-time only</p>
            </div>
            <div className="text-center">
              <p className="font-semibold text-gray-900">Personal Training</p>
              <p className="text-2xl font-bold text-gray-900">$75</p>
              <p className="text-sm text-gray-500">Per session</p>
            </div>
            <div className="text-center">
              <p className="font-semibold text-gray-900">Day Pass</p>
              <p className="text-2xl font-bold text-gray-900">$20</p>
              <p className="text-sm text-gray-500">Single visit</p>
            </div>
            <div className="text-center">
              <p className="font-semibold text-gray-900">Guest Pass</p>
              <p className="text-2xl font-bold text-gray-900">$15</p>
              <p className="text-sm text-gray-500">Per guest</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
