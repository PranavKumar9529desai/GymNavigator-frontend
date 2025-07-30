import React from "react";
import { getGymDashboardData } from "./_action/get-gym-dashboard";
import GymDashboard from "./_components/GymDashboard";
import { unstable_ViewTransition as ViewTransition } from "react";

export default async function GymDashboardPage() {
	// biome-ignore lint/suspicious/noExplicitAny: dashboard data is dynamic
	let data: any;
	try {
		data = await getGymDashboardData();
	} catch (_error) {
		return (
			<div className="p-6 text-center text-red-600">
				Failed to load dashboard data.
			</div>
		);
	}
	return <GymDashboard data={data} />;
}
