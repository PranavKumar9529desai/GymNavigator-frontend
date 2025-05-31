"use client"

import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { Users, TrendingUp, Calendar, Target, Clock, Award, Heart, User, Dumbbell, UserCheck } from "lucide-react"
import { TrainerUserBarChart, type Trainer } from "../charts/trainer-user-bar-chart"

function UserCard ({ type , number   } : { type : "trainers" | "users" , number : number}){
  return (
    <Card className="w-full max-w-xs shadow-md h-24 flex items-center justify-center bg-gradient-to-br from-blue-50 to-white border-blue-100 dark:from-blue-950 dark:to-gray-900 dark:border-blue-900">
      <div className="flex items-center justify-center h-20 p-3 gap-3 w-full">
        <div className="bg-blue-200 dark:bg-blue-900 rounded-full p-3 flex items-center justify-center shadow-md">
          {type === "trainers" ? (
            <UserCheck className="text-blue-500 size-8 sm:size-10" />
          ) : (
            <User className="text-blue-500 size-8 sm:size-10" />
          )}
        </div>
        <div className="flex flex-col justify-center ml-2">
          <p className="capitalize text-gray-700 dark:text-gray-200 text-xs sm:text-sm font-medium tracking-wide">{type}</p>
          <p className="font-bold text-gray-950 dark:text-white text-xl sm:text-2xl">{number}</p>
        </div>
      </div>
    </Card>
  )
}

// Dummy data for trainers and their assigned clients (default data)
const defaultTrainersData: Trainer[] = [
  {
    id: 1,
    name: "Trainer 1",
    assignedClients: [
      { id: 1, name: "Client A" },
      { id: 2, name: "Client B" },
    ],
  },
  {
    id: 2,
    name: "Trainer 2",
    assignedClients: [
      { id: 3, name: "Client C" },
    ],
  },
  {
    id: 3,
    name: "Trainer 3",
    assignedClients: [
      { id: 4, name: "Client D" },
      { id: 5, name: "Client E" },
      { id: 6, name: "Client F" },
    ],
  },
  {
    id: 3,
    name: "Trainer 3",
    assignedClients: [

    ],
  },
  {
    id: 3,
    name: "Trainer 3",
    assignedClients: [
      { id: 6, name: "Client F" },
    ],
  },
  {
    id: 3,
    name: "Trainer 3",
    assignedClients: [
      { id: 4, name: "Client D" },
      { id: 5, name: "Client E" },
    ],
  },
]

interface OverviewTabProps {
  trainersData?: Trainer[];
}

export function OverviewTab({
  trainersData = defaultTrainersData,
}: OverviewTabProps) {
  // Calculate totals from actual data
  const totalTrainers = trainersData.length;
  const totalUsers = trainersData.reduce((total, trainer) => total + trainer.assignedClients.length, 0);

  return (
    <section className="w-full   sm:p-8">
      <div className="flex flex-col lg:flex-row gap-6 lg:gap-10 w-full">
        <div className="flex flex-row lg:flex-col gap-4 w-full max-w-full lg:max-w-xs mb-2 lg:mb-0">
          <UserCard type="trainers" number={totalTrainers} />
          <UserCard type="users" number={totalUsers} />
        </div>
        <div className="w-full ">
          <div className="min-w-0 ">
            <TrainerUserBarChart trainers={trainersData}/>
          </div>
        </div>
      </div>
    </section>
  )
}
