"use client";

import { AssignedUser } from "../_actions/GetuserassignedTotrainers";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useRouter } from "next/navigation";
import { ScrollArea } from "@/components/ui/scroll-area";
import { 
	User, 
	Dumbbell, 
	Utensils,
	ChevronRight 
} from "lucide-react";

interface UserWorkoutListProps {
	users: AssignedUser[];
}

export default function UserWorkoutList({ users }: UserWorkoutListProps) {
	const router = useRouter();

	const handleUserClick = (userId: string) => {
		router.push(`/dashboard/trainer/workouts/assignworkout/${userId}`);
	};

	return (
		<ScrollArea className="h-[calc(100vh-200px)]">
			<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 p-2">
				{users.map((user) => (
					<Card
						key={user.id}
						className="p-4 hover:shadow-lg transition-shadow cursor-pointer relative group"
						onClick={() => handleUserClick(user.id)}
					>
						<div className="flex items-start justify-between">
							<div className="flex items-center space-x-3">
								<div className="bg-primary/10 p-2 rounded-full">
									<User className="h-5 w-5 text-primary" />
								</div>
								<div>
									<h3 className="font-semibold text-lg">{user.name}</h3>
									<p className="text-sm text-muted-foreground">{user.email}</p>
								</div>
							</div>
							<ChevronRight className="h-5 w-5 text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity" />
						</div>

						<div className="mt-4 space-y-2">
							<div className="flex items-center justify-between">
								<div className="flex items-center space-x-2">
									<Dumbbell className="h-4 w-4 text-muted-foreground" />
									<span className="text-sm">Workout Plan:</span>
								</div>
								<Badge variant={user.hasActiveWorkoutPlan ? "default" : "secondary"}>
									{user.hasActiveWorkoutPlan ? user.activeWorkoutPlanName || "Active" : "Not Assigned"}
								</Badge>
							</div>

							<div className="flex items-center justify-between">
								<div className="flex items-center space-x-2">
									<Utensils className="h-4 w-4 text-muted-foreground" />
									<span className="text-sm">Diet Plan:</span>
								</div>
								<Badge variant={user.hasActiveDietPlan ? "default" : "secondary"}>
									{user.hasActiveDietPlan ? user.dietPlanName || "Active" : "Not Assigned"}
								</Badge>
							</div>
						</div>

						<div className="mt-4 flex flex-wrap gap-2">
							<Badge variant="outline" className="text-xs">
								{user.gender}
							</Badge>
							<Badge variant="outline" className="text-xs">
								{user.dietaryPreference}
							</Badge>
							<Badge 
								variant={user.membershipStatus === "active" ? "success" : "destructive"}
								className="text-xs"
							>
								{user.membershipStatus}
							</Badge>
						</div>
					</Card>
				))}
			</div>
		</ScrollArea>
	);
}
