"use client"

import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { Users, TrendingUp, Calendar, Target, Clock, Award, Heart, User, Dumbbell, UserCheck } from "lucide-react"
import { TrainerUserBarChart, Trainer } from "./charts/trainer-user-bar-chart"

function UserCard ({ type , number   } : { type : "trainers" | "users" , number : number}){
  return (
    <Card className="w-full max-w-xs shadow-sm  h-20 flex items-center justify-center" >
      <div className="flex items-center justify-center h-28 p-4 gap-2 ">
        <div className="bg-blue-100 rounded-full p-2 mb-1">
          {type === "trainers" ? (
            <UserCheck className="text-blue-500 size-8" />
          ) : (
            <User className="text-blue-500 size-8" />
          )}
        </div>
        <div className="">

        <p className="capitalize text-gray-700 text-sm">{type}</p>
        <p className="font-bold text-gray-950 text-lg">{number}</p>
        </div>
      </div>
    </Card>
  )
}

export function OverviewTab() {
  // Dummy data for trainers and their assigned clients
  const trainers: Trainer[] = [
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

  return (
    <div className="flex gap-10">

    <div className="max-w-sm flex flex-wrap gap-4 flex-shrink-0">
      <UserCard type="trainers" number={10} />
      <UserCard type="users" number={10} />
    </div>
   <div className="w-full ">
     <TrainerUserBarChart trainers={trainers}/>
   </div>
    </div>
      
  )
}
