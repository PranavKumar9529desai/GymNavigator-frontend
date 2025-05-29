"use client"

import { TrendingUp } from "lucide-react"
import { Bar, BarChart, CartesianGrid, XAxis, Tooltip } from "recharts"
import { ReactNode } from "react"

import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart"

// Define the prop types
export type Trainer = {
  id: string | number
  name: string
  assignedClients: { id: string | number; name: string }[]
}

interface TrainerUserBarChartProps {
  trainers: Trainer[]
  title?: ReactNode
  description?: ReactNode
}

export function TrainerUserBarChart({
  trainers,
  title = "Trainer Client Assignment",
  description = "Number of clients assigned to each trainer",
}: TrainerUserBarChartProps) {
  // Transform trainers to chart data
  const chartData = trainers.map((trainer) => ({
    name: trainer.name,
    clientCount: trainer.assignedClients.length,
  }))

  // Calculate dynamic min-width for the chart container
  const minBarWidth = 60; // px per bar
  const chartMinWidth = Math.max(chartData.length * minBarWidth, 320); // fallback to 320px if few bars

  const averageClients =
    chartData.length > 0
      ? (chartData.reduce((sum, t) => sum + t.clientCount, 0) / chartData.length).toFixed(1)
      : 0

  const chartConfig = {
    clientCount: {
      label: "Assigned Clients",
      color: "#2563eb", // Tailwind blue-600
    },
  } satisfies ChartConfig

  return (
    <Card className="bg-transparent">
      
      <CardContent>
        <div
          className="w-full overflow-x-auto"
          style={{ minWidth: chartMinWidth, minHeight: 220 }}
        >
          <ChartContainer config={chartConfig}>
            <BarChart accessibilityLayer data={chartData}>
              <CartesianGrid vertical={false} />
              <XAxis
                dataKey="name"
                tickLine={false}
                tickMargin={10}
                axisLine={false}
                tickFormatter={(value) => value}
              />
              <Tooltip cursor={false} />
              <Bar dataKey="clientCount" fill="#2563eb" radius={8} />
            </BarChart>
          </ChartContainer>
        </div>
      </CardContent>
      <CardFooter className="flex-col items-start gap-2 text-sm">
        <div className="flex items-center gap-2 leading-none text-muted-foreground">
          <span>Average clients per trainer:</span>
          <span className="ml-2 rounded bg-primary/10 px-2 py-0.5 text-primary font-semibold text-xs">
            <span className="font-bold">{averageClients}</span>
          </span>
        </div>
      </CardFooter>
    </Card>
  )
}
