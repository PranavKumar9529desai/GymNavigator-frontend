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

  const averageClients =
    chartData.length > 0
      ? (chartData.reduce((sum, t) => sum + t.clientCount, 0) / chartData.length).toFixed(1)
      : 0

  const chartConfig = {
    clientCount: {
      label: "Assigned Clients",
      color: "hsl(var(--chart-1))",
    },
  } satisfies ChartConfig

  return (
    <Card>
      <CardHeader>
        {/* <CardTitle>{title}</CardTitle>
        <CardDescription>{description}</CardDescription> */}
      </CardHeader>
      <CardContent>
        <ChartContainer config={chartConfig}>
          <BarChart accessibilityLayer data={chartData} width={200} height={250}>
            <CartesianGrid vertical={false} />
            <XAxis
              dataKey="name"
              tickLine={false}
              tickMargin={10}
              axisLine={false}
              tickFormatter={(value) => value}
            />
            <Tooltip cursor={false} />
            <Bar dataKey="clientCount" fill="var(--color-desktop)" radius={8} />
          </BarChart>
        </ChartContainer>
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
