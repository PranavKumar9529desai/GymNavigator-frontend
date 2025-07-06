"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Flame, Clock, Target, Zap } from "lucide-react"
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
} from "recharts"
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart"

interface OverviewTabProps {
  attendanceData: Array<{ month: string; visits: number }>
  workoutTypes: Array<{ name: string; value: number; color: string }>
}

export function OverviewTab({ attendanceData, workoutTypes }: OverviewTabProps) {
  return (
    <div className="space-y-6">
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
        <Card>
          <CardContent className="p-3 sm:p-4">
            <div className="flex flex-col sm:flex-row items-center sm:items-start space-y-1 sm:space-y-0 sm:space-x-2">
              <Flame className="h-6 w-6 sm:h-8 sm:w-8 text-orange-500" />
              <div className="text-center sm:text-left">
                <p className="text-lg sm:text-2xl font-bold">1,247</p>
                <p className="text-xs sm:text-sm text-muted-foreground">Calories</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-3 sm:p-4">
            <div className="flex flex-col sm:flex-row items-center sm:items-start space-y-1 sm:space-y-0 sm:space-x-2">
              <Clock className="h-6 w-6 sm:h-8 sm:w-8 text-blue-500" />
              <div className="text-center sm:text-left">
                <p className="text-lg sm:text-2xl font-bold">45h</p>
                <p className="text-xs sm:text-sm text-muted-foreground">Workout Time</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-3 sm:p-4">
            <div className="flex flex-col sm:flex-row items-center sm:items-start space-y-1 sm:space-y-0 sm:space-x-2">
              <Target className="h-6 w-6 sm:h-8 sm:w-8 text-green-500" />
              <div className="text-center sm:text-left">
                <p className="text-lg sm:text-2xl font-bold">85%</p>
                <p className="text-xs sm:text-sm text-muted-foreground">Goals Achieved</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-3 sm:p-4">
            <div className="flex flex-col sm:flex-row items-center sm:items-start space-y-1 sm:space-y-0 sm:space-x-2">
              <Zap className="h-6 w-6 sm:h-8 sm:w-8 text-yellow-500" />
              <div className="text-center sm:text-left">
                <p className="text-lg sm:text-2xl font-bold">7</p>
                <p className="text-xs sm:text-sm text-muted-foreground">Streak Days</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 gap-4 sm:gap-6">
        <Card>
          <CardHeader className="pb-2 sm:pb-4">
            <CardTitle className="text-lg sm:text-xl">Monthly Attendance</CardTitle>
            <CardDescription className="text-sm">Your gym visits over the last 6 months</CardDescription>
          </CardHeader>
          <CardContent className="px-2 sm:px-6 pb-4">
            <ChartContainer
              config={{
                visits: {
                  label: "Visits",
                  color: "hsl(var(--chart-1))",
                },
              }}
              className="h-[180px] sm:h-[200px] w-full"
            >
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={attendanceData} margin={{ top: 10, right: 10, left: 0, bottom: 10 }}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="month" fontSize={10} tick={{ fontSize: 10 }} axisLine={false} tickLine={false} />
                  <YAxis fontSize={10} tick={{ fontSize: 10 }} axisLine={false} tickLine={false} width={25} />
                  <ChartTooltip content={<ChartTooltipContent />} />
                  <Line type="monotone" dataKey="visits" stroke="var(--color-visits)" strokeWidth={2} />
                </LineChart>
              </ResponsiveContainer>
            </ChartContainer>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2 sm:pb-4">
            <CardTitle className="text-lg sm:text-xl">Workout Distribution</CardTitle>
            <CardDescription className="text-sm">Types of workouts this month</CardDescription>
          </CardHeader>
          <CardContent className="px-2 sm:px-6 pb-4">
            <div className="h-[160px] sm:h-[180px] w-full flex items-center justify-center overflow-hidden">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart margin={{ top: 0, right: 0, left: 0, bottom: 0 }}>
                  <Pie
                    data={workoutTypes}
                    cx="50%"
                    cy="50%"
                    innerRadius={25}
                    outerRadius={50}
                    paddingAngle={3}
                    dataKey="value"
                  >
                    {workoutTypes.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <ChartTooltip />
                </PieChart>
              </ResponsiveContainer>
            </div>
            <div className="flex flex-col sm:flex-row justify-center space-y-2 sm:space-y-0 sm:space-x-4 mt-2">
              {workoutTypes.map((type, index) => (
                <div key={index} className="flex items-center justify-center sm:justify-start space-x-2">
                  <div className="w-3 h-3 rounded-full" style={{ backgroundColor: type.color }}></div>
                  <span className="text-sm">{type.name}</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
