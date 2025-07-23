"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  ResponsiveContainer,
} from "recharts"
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart"

interface HealthData {
  weight: number
  height: number
  bmi: number
  bodyFat: number
  muscleMass: number
  goals: {
    weightGoal: number
    bodyFatGoal: number
  }
}

interface HealthTabProps {
  healthData: HealthData
  weightProgress: Array<{ date: string; weight: number }>
}

export function HealthTab({ healthData, weightProgress }: HealthTabProps) {
  // Helper function to safely display data or show fallback
  const displayData = (value: number | undefined, unit = "", fallback = "-") => {
    if (value === undefined || value === null || value === 0) {
      return fallback;
    }
    return `${value}${unit}`;
  };

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
        <Card>
          <CardContent className="p-3 sm:p-4">
            <div className="text-center">
              <p className="text-xl sm:text-2xl font-bold">{displayData(healthData.weight, " kg")}</p>
              <p className="text-xs sm:text-sm text-muted-foreground">Weight</p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-3 sm:p-4">
            <div className="text-center">
              <p className="text-xl sm:text-2xl font-bold">{displayData(healthData.height, " cm")}</p>
              <p className="text-xs sm:text-sm text-muted-foreground">Height</p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-3 sm:p-4">
            <div className="text-center">
              <p className="text-xl sm:text-2xl font-bold">{displayData(healthData.bmi)}</p>
              <p className="text-xs sm:text-sm text-muted-foreground">BMI</p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-3 sm:p-4">
            <div className="text-center">
              <p className="text-xl sm:text-2xl font-bold">{displayData(healthData.bodyFat, "%")}</p>
              <p className="text-xs sm:text-sm text-muted-foreground">Body Fat</p>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Weight Progress</CardTitle>
            <CardDescription>Your weight journey over time</CardDescription>
          </CardHeader>
          <CardContent className="px-2 sm:px-6 pb-4">
            {weightProgress && weightProgress.length > 0 ? (
              <ChartContainer
                config={{
                  weight: {
                    label: "Weight (kg)",
                    color: "hsl(var(--chart-2))",
                  },
                }}
                className="h-[180px] sm:h-[200px] w-full"
              >
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={weightProgress} margin={{ top: 10, right: 10, left: 0, bottom: 10 }}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="date" fontSize={10} tick={{ fontSize: 10 }} axisLine={false} tickLine={false} />
                    <YAxis fontSize={10} tick={{ fontSize: 10 }} axisLine={false} tickLine={false} width={30} />
                    <ChartTooltip content={<ChartTooltipContent />} />
                    <Line type="monotone" dataKey="weight" stroke="var(--color-weight)" strokeWidth={2} />
                  </LineChart>
                </ResponsiveContainer>
              </ChartContainer>
            ) : (
              <div className="h-[180px] sm:h-[200px] flex items-center justify-center text-muted-foreground">
                No weight progress data available
              </div>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Goals Progress</CardTitle>
            <CardDescription>Track your fitness goals</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <div className="flex justify-between text-sm mb-2">
                <span>Weight Goal</span>
                <span>
                  {displayData(healthData.weight, "kg")} / {displayData(healthData.goals?.weightGoal, "kg")}
                </span>
              </div>
              <Progress 
                value={
                  healthData.weight && healthData.goals?.weightGoal 
                    ? (healthData.weight / healthData.goals.weightGoal) * 100 
                    : 0
                } 
                className="h-2" 
              />
            </div>
            <div>
              <div className="flex justify-between text-sm mb-2">
                <span>Body Fat Goal</span>
                <span>
                  {displayData(healthData.bodyFat, "%")} / {displayData(healthData.goals?.bodyFatGoal, "%")}
                </span>
              </div>
              <Progress
                value={
                  healthData.bodyFat && healthData.goals?.bodyFatGoal 
                    ? ((healthData.bodyFat - healthData.goals.bodyFatGoal) / healthData.bodyFat) * 100 
                    : 0
                }
                className="h-2"
              />
            </div>
            <div>
              <div className="flex justify-between text-sm mb-2">
                <span>Muscle Mass</span>
                <span>{displayData(healthData.muscleMass, "kg")}</span>
              </div>
              <Progress value={healthData.muscleMass ? 75 : 0} className="h-2" />
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
