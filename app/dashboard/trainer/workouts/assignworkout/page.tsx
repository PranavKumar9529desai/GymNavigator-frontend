import { Suspense } from "react";
import { HydrationBoundary, dehydrate } from "@tanstack/react-query";
import { queryClient } from "@/app/queryClient";
import { Loader2 } from "lucide-react";
import UserWorkoutAssignment from "./_components/UserWorkoutAssignment";
import { getAssignableUsers } from "./_actions/get-assignable-users";
import { getWorkoutPlans } from "./_actions/get-workout-plans";

function LoadingSpinner() {
	return (
		<div className="flex h-screen w-full items-center justify-center">
			<Loader2 className="h-8 w-8 animate-spin text-primary" />
		</div>
	);
}

export default async function AssignWorkoutPage() {
	const [users, workoutPlans] = await Promise.all([
		queryClient.fetchQuery({
			queryKey: ["assignable-users"],
			queryFn: getAssignableUsers,
			staleTime: 1000 * 60 * 5, // 5 minutes
		}),
		queryClient.fetchQuery({
			queryKey: ["workout-plans"],
			queryFn: getWorkoutPlans,
			staleTime: 1000 * 60 * 15, // 15 minutes
		}),
	]);

	return (
		<div className="min-h-screen bg-gray-50">
			<Suspense fallback={<LoadingSpinner />}>
				<HydrationBoundary state={dehydrate(queryClient)}>
					<UserWorkoutAssignment 
						initialUsers={users} 
						initialWorkoutPlans={workoutPlans} 
					/>
				</HydrationBoundary>
			</Suspense>
		</div>
	);
}
