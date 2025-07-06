"use client"

import { useState } from "react"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { UserHeader } from "./_components/user-header"
import { OverviewTab } from "./_components/overview-tab"
import { HealthTab } from "./_components/health-tab"
import { AttendanceTab } from "./_components/attendance-tab"
import { TrainerTab } from "./_components/trainer-tab"

export default function GymProfile() {
  const [activeTab, setActiveTab] = useState("overview")

  // Mock data
  const userData = {
    name: "Alex Johnson",
    email: "alex.johnson@email.com",
    phone: "+1 (555) 123-4567",
    memberSince: "January 2023",
    membershipType: "Premium",
    avatar: "/placeholder.svg?height=120&width=120",
  }

  const healthData = {
    weight: 75,
    height: 180,
    bmi: 23.1,
    bodyFat: 15,
    muscleMass: 65,
    goals: {
      weightGoal: 80,
      bodyFatGoal: 12,
    },
  }

  const trainerData = {
    name: "Sarah Mitchell",
    specialization: "Strength Training & Nutrition",
    experience: "8 years",
    rating: 4.9,
    avatar: "/placeholder.svg?height=80&width=80",
    phone: "+1 (555) 987-6543",
    email: "sarah.mitchell@gym.com",
    nextSession: "Tomorrow, 3:00 PM",
  }

  const attendanceData = [
    { month: "Jan", visits: 18 },
    { month: "Feb", visits: 22 },
    { month: "Mar", visits: 20 },
    { month: "Apr", visits: 25 },
    { month: "May", visits: 28 },
    { month: "Jun", visits: 24 },
  ]

  const weeklyAttendance = [
    { day: "Mon", attended: 1 },
    { day: "Tue", attended: 0 },
    { day: "Wed", attended: 1 },
    { day: "Thu", attended: 1 },
    { day: "Fri", attended: 0 },
    { day: "Sat", attended: 1 },
    { day: "Sun", attended: 0 },
  ]

  const workoutTypes = [
    { name: "Cardio", value: 35, color: "#ff6b6b" },
    { name: "Strength", value: 45, color: "#4ecdc4" },
    { name: "Flexibility", value: 20, color: "#45b7d1" },
  ]

  const weightProgress = [
    { date: "Jan", weight: 78 },
    { date: "Feb", weight: 77 },
    { date: "Mar", weight: 76 },
    { date: "Apr", weight: 75.5 },
    { date: "May", weight: 75 },
    { date: "Jun", weight: 75 },
  ]

  return (
    <div className="max-w-6xl mx-auto p-3 sm:p-6 space-y-4 sm:space-y-6">
      {/* Header Section */}
      <UserHeader userData={userData} monthlyVisits={24} />

      {/* Tabs Section */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
        <TabsList className="grid w-full grid-cols-2 sm:grid-cols-4 h-auto">
          {[
            { value: "overview", label: "Overview" },
            { value: "health", label: "Health" },
            { value: "attendance", label: "Attendance" },
            { value: "trainer", label: "Trainer" },
          ].map(tab => (
            <TabsTrigger
              key={tab.value}
              value={tab.value}
              className="text-xs sm:text-sm py-2 data-[state=active]:bg-blue-600 data-[state=active]:text-white"
            >
              {tab.label}
            </TabsTrigger>
          ))}
        </TabsList>

        {/* Overview Tab */}
        <TabsContent value="overview" className="space-y-6">
          <OverviewTab attendanceData={attendanceData} workoutTypes={workoutTypes} />
        </TabsContent>

        {/* Health Profile Tab */}
        <TabsContent value="health" className="space-y-6">
          <HealthTab healthData={healthData} weightProgress={weightProgress} />
        </TabsContent>

        {/* Attendance Tab */}
        <TabsContent value="attendance" className="space-y-6">
          <AttendanceTab weeklyAttendance={weeklyAttendance} />
        </TabsContent>

        {/* Trainer Tab */}
        <TabsContent value="trainer" className="space-y-6">
          <TrainerTab trainerData={trainerData} />
        </TabsContent>
      </Tabs>
    </div>
  )
}
