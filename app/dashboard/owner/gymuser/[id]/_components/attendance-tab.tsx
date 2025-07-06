"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import { CalendarDays } from "lucide-react"
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  ResponsiveContainer,
} from "recharts"
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart"

interface AttendanceTabProps {
  weeklyAttendance: Array<{ day: string; attended: number }>
}

export function AttendanceTab({ weeklyAttendance }: AttendanceTabProps) {
  const recentVisits = [
    { date: "Today", time: "6:30 AM", duration: "1h 30m", type: "Strength Training" },
    { date: "Yesterday", time: "7:00 AM", duration: "1h 15m", type: "Cardio" },
    { date: "2 days ago", time: "6:45 AM", duration: "1h 45m", type: "Full Body" },
    { date: "3 days ago", time: "7:15 AM", duration: "1h 20m", type: "Upper Body" },
    { date: "4 days ago", time: "6:30 AM", duration: "1h 10m", type: "Cardio" },
  ]

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Weekly Attendance</CardTitle>
            <CardDescription>This week's gym visits</CardDescription>
          </CardHeader>
          <CardContent className="px-2 sm:px-6 pb-4">
            <ChartContainer
              config={{
                attended: {
                  label: "Attended",
                  color: "hsl(var(--chart-3))",
                },
              }}
              className="h-[180px] sm:h-[200px] w-full"
            >
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={weeklyAttendance} margin={{ top: 10, right: 10, left: 0, bottom: 10 }}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="day" fontSize={10} tick={{ fontSize: 10 }} axisLine={false} tickLine={false} />
                  <YAxis fontSize={10} tick={{ fontSize: 10 }} axisLine={false} tickLine={false} width={20} />
                  <ChartTooltip content={<ChartTooltipContent />} />
                  <Bar dataKey="attended" fill="var(--color-attended)" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </ChartContainer>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Attendance Stats</CardTitle>
            <CardDescription>Your gym attendance overview</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex justify-between items-center">
              <span className="text-sm font-medium">This Week</span>
              <span className="text-2xl font-bold">4/7</span>
            </div>
            <Separator />
            <div className="flex justify-between items-center">
              <span className="text-sm font-medium">This Month</span>
              <span className="text-2xl font-bold">24/30</span>
            </div>
            <Separator />
            <div className="flex justify-between items-center">
              <span className="text-sm font-medium">Streak</span>
              <span className="text-2xl font-bold">7 days</span>
            </div>
            <Separator />
            <div className="flex justify-between items-center">
              <span className="text-sm font-medium">Best Month</span>
              <span className="text-2xl font-bold">28 visits</span>
            </div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Recent Check-ins</CardTitle>
          <CardDescription>Your last 5 gym visits</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {recentVisits.map((visit, index) => (
              <div key={index} className="flex items-center justify-between p-3 bg-muted rounded-lg">
                <div className="flex items-center space-x-3">
                  <CalendarDays className="h-4 w-4 text-muted-foreground" />
                  <div>
                    <p className="font-medium">{visit.date}</p>
                    <p className="text-sm text-muted-foreground">{visit.time}</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="font-medium">{visit.duration}</p>
                  <p className="text-sm text-muted-foreground">{visit.type}</p>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
