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
  recentVisits?: Array<{
    date: string;
    time: string;
    duration: string;
    type: string;
  }>
  stats?: {
    monthlyVisits: number;
    streak: number;
    totalWorkoutTime: number;
  }
}

export function AttendanceTab({ weeklyAttendance, recentVisits, stats }: AttendanceTabProps) {
  const defaultRecentVisits = [
    { date: "No recent visits", time: "", duration: "", type: "" },
  ]

  const visitsToShow = recentVisits && recentVisits.length > 0 ? recentVisits : defaultRecentVisits
  
  // Calculate this week's visits
  const thisWeekVisits = weeklyAttendance.reduce((sum, day) => sum + day.attended, 0)
  
  // Format workout time
  const formatWorkoutTime = (minutes: number) => {
    if (minutes >= 60) {
      return `${Math.floor(minutes / 60)}h ${minutes % 60}m`
    }
    return `${minutes}m`
  }

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
              <span className="text-2xl font-bold">{thisWeekVisits}/7</span>
            </div>
            <Separator />
            <div className="flex justify-between items-center">
              <span className="text-sm font-medium">This Month</span>
              <span className="text-2xl font-bold">
                {stats?.monthlyVisits ? stats.monthlyVisits : "-"}
              </span>
            </div>
            <Separator />
            <div className="flex justify-between items-center">
              <span className="text-sm font-medium">Current Streak</span>
              <span className="text-2xl font-bold">
                {stats?.streak ? `${stats.streak} days` : "-"}
              </span>
            </div>
            <Separator />
            <div className="flex justify-between items-center">
              <span className="text-sm font-medium">Total Workout Time</span>
              <span className="text-2xl font-bold">
                {stats?.totalWorkoutTime ? formatWorkoutTime(stats.totalWorkoutTime) : "-"}
              </span>
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
            {visitsToShow.map((visit, index) => (
              <div   key={ index as number }  className="flex items-center justify-between p-3 bg-muted rounded-lg">
                <div className="flex items-center space-x-3">
                  <CalendarDays className="h-4 w-4 text-muted-foreground" />
                  <div>
                    <p className="font-medium">{visit.date}</p>
                    {visit.time && <p className="text-sm text-muted-foreground">{visit.time}</p>}
                  </div>
                </div>
                {visit.duration && visit.type && (
                  <div className="text-right">
                    <p className="font-medium">{visit.duration}</p>
                    <p className="text-sm text-muted-foreground">{visit.type}</p>
                  </div>
                )}
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
