import React from "react";
import DashboardStats from "./(common)/components/DashboardStats";
import ErrorScreen from "./(common)/components/ErrorScreen";
import { GetDashboardData } from "./(common)/components/GetDashboardData";
import SetupScreen from "./(common)/components/SetupScreen";
import type { DashboardData, DashboardError } from "./(common)/types/types";

type DashboardResponse = DashboardData | DashboardError;

export default async function Page() {
	const dashboardData = await GetDashboardData();

	const isError = (data: DashboardResponse): data is DashboardError => {
		return "error" in data;
	};

	if (isError(dashboardData) && dashboardData.error === "NO_GYM_FOUND") {
		return <SetupScreen />;
	}

	if (isError(dashboardData)) {
		return <ErrorScreen error={dashboardData.error} />;
	}

	// Transform the data to match the expected type
	const transformedData = {
		...dashboardData,
		recentActivities: dashboardData.recentActivities.map((activity) => ({
			...activity,
			Validperiod: activity.Validperiod || undefined,
		})),
	};

	return <DashboardStats data={transformedData} />;
}
