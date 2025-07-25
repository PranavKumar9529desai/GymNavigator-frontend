'use client';

import { useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
} from '@/components/ui/card';
import { AlertCircle, UserX, Heart, Users } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { ArrowLeft } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { UserHeader } from './user-header';
import { OverviewTab } from './overview-tab';
import { HealthTab } from './health-tab';
import { AttendanceTab } from './attendance-tab';
import { TrainerTab } from './trainer-tab';
import type { UserProfileResponse } from '../_action/get-user-profile';

interface UserProfileClientProps {
	profileData: UserProfileResponse;
	userId: string;
}

// Empty state component for missing data
function EmptyState({
	icon: Icon,
	title,
	description,
}: {
	icon: React.ComponentType<{ className?: string }>;
	title: string;
	description: string;
}) {
	return (
		<Card>
			<CardContent className="flex flex-col items-center justify-center p-8 text-center">
				<Icon className="h-12 w-12 text-gray-400 mb-4" />
				<CardTitle className="text-lg text-gray-600 mb-2">{title}</CardTitle>
				<CardDescription className="text-gray-500">
					{description}
				</CardDescription>
			</CardContent>
		</Card>
	);
}

// Error state component
function ErrorState({ error }: { error?: string }) {
	return (
		<Card className="border-red-200 bg-red-50">
			<CardContent className="flex flex-col items-center justify-center p-8 text-center">
				<AlertCircle className="h-12 w-12 text-red-500 mb-4" />
				<CardTitle className="text-lg text-red-600 mb-2">
					Unable to Load Profile
				</CardTitle>
				<CardDescription className="text-red-500">
					{error ||
						'An error occurred while loading the user profile. Please try again.'}
				</CardDescription>
			</CardContent>
		</Card>
	);
}

export function UserProfileClient({ profileData }: UserProfileClientProps) {
	const [activeTab, setActiveTab] = useState('overview');
	const router = useRouter();

	const handleBack = () => {
		router.push('/dashboard/owner/gym/gymusers');
	};

	// If there's an error and no data at all
	if (profileData.error && !profileData.userData) {
		return (
			<div className="max-w-6xl mx-auto p-3 sm:p-6 space-y-4 sm:space-y-6">
				<ErrorState error={profileData.error} />
			</div>
		);
	}

	return (
		<div className="max-w-6xl mx-auto p-3 sm:p-6 space-y-4 sm:space-y-6">
			{/* Back Button */}
			<div className="flex items-center mb-2">
				<button
					type="button"
					onClick={handleBack}
					className="flex items-center gap-2 p-2 hover:bg-blue-50/50 text-blue-600 rounded"
					aria-label="Go back to gym users list"
				>
					<ArrowLeft className="h-4 w-4" aria-hidden="true" />
					<span className="text-sm font-medium">Back to Users</span>
				</button>
			</div>
			{/* Header Section */}
			{profileData.userData && (
				<UserHeader
					userData={profileData.userData}
					monthlyVisits={profileData.overview?.stats.monthlyVisits || 0}
				/>
			)}

			{/* Show error banner if there's an error but some data exists */}
			{profileData.error && (
				<Card className="border-yellow-200 bg-yellow-50">
					<CardContent className="p-4">
						<div className="flex items-center space-x-2">
							<AlertCircle className="h-5 w-5 text-yellow-600" />
							<p className="text-yellow-800 text-sm">
								Some data may be incomplete: {profileData.error}
							</p>
						</div>
					</CardContent>
				</Card>
			)}

			{/* Tabs Section */}
			<Tabs
				value={activeTab}
				onValueChange={setActiveTab}
				className="space-y-6"
			>
				<TabsList className="grid w-full grid-cols-2 sm:grid-cols-4 h-auto">
					{[
						{ value: 'overview', label: 'Overview' },
						{ value: 'health', label: 'Health' },
						{ value: 'attendance', label: 'Attendance' },
						{ value: 'trainer', label: 'Trainer' },
					].map((tab) => (
						<TabsTrigger
							key={tab.value}
							value={tab.value}
							className="text-xs sm:text-sm py-2 data-[state=active]:bg-blue-600 data-[state=active]:text-white"
						>
							{tab.label}
						</TabsTrigger>
					))}
				</TabsList>

				{/* Overview Tab */}
				<TabsContent value="overview" className="space-y-6">
					{profileData.overview ? (
						<OverviewTab
							attendanceData={profileData.overview.attendanceData}
							workoutTypes={profileData.overview.workoutTypes}
							stats={profileData.overview.stats}
						/>
					) : (
						<EmptyState
							icon={Users}
							title="No Overview Data"
							description="Overview data is currently not available for this user."
						/>
					)}
				</TabsContent>

				{/* Health Profile Tab */}
				<TabsContent value="health" className="space-y-6">
					{profileData.health ? (
						<HealthTab
							healthData={profileData.health.healthData}
							weightProgress={profileData.health.weightProgress}
						/>
					) : (
						<EmptyState
							icon={Heart}
							title="No Health Profile"
							description="This user hasn't completed their health profile yet. Encourage them to fill out their health information to track their fitness journey."
						/>
					)}
				</TabsContent>

				{/* Attendance Tab */}
				<TabsContent value="attendance" className="space-y-6">
					{profileData.attendance ? (
						<AttendanceTab
							weeklyAttendance={profileData.attendance.weeklyAttendance}
							recentVisits={profileData.attendance.recentVisits}
							stats={profileData.overview?.stats}
						/>
					) : (
						<EmptyState
							icon={Users}
							title="No Attendance Data"
							description="Attendance data is currently not available for this user."
						/>
					)}
				</TabsContent>

				{/* Trainer Tab */}
				<TabsContent value="trainer" className="space-y-6">
					{profileData.trainer ? (
						<TrainerTab trainerData={profileData.trainer} />
					) : (
						<EmptyState
							icon={UserX}
							title="No Trainer Assigned"
							description="This user doesn't have a personal trainer assigned yet. You can assign a trainer from the gym management section."
						/>
					)}
				</TabsContent>
			</Tabs>
		</div>
	);
}
