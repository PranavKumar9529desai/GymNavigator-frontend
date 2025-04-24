'use client';
import { useQuery } from '@tanstack/react-query';
import { useSelectedLayoutSegments } from 'next/navigation';
import type { ReactNode } from 'react';
import NoAssignmentMessage from './NoAssignmentMessage';

interface ClientLayoutProps {
	children: ReactNode;
}

export default function ClientLayout({ children }: ClientLayoutProps) {
	const segments = useSelectedLayoutSegments();

	// Check if we're in workout or diet routes based on the menu structure
	const isWorkoutRoute = segments.includes('workouts');
	const isDietRoute = segments.includes('diet');

	// Define protected workout routes
	const protectedWorkoutRoutes = ['myworkouts'];
	// Define protected diet routes
	const protectedDietRoutes = ['viewdiet', 'grocerylist', 'eatingoutguide'];

	// Check if current route needs protection
	const needsWorkoutProtection =
		isWorkoutRoute &&
		segments.some((segment) => protectedWorkoutRoutes.includes(segment));
	const needsDietProtection =
		isDietRoute &&
		segments.some((segment) => protectedDietRoutes.includes(segment));

	const { data: assignmentStatus } = useQuery({
		queryKey: ['assignmentStatus'],
		queryFn: () => ({ data: { workout_assigned: true, diet_assigned: true } }), // This will use the prefetched data
	});

	// Only check assignments if we're in protected routes
	if (needsWorkoutProtection || needsDietProtection) {
		// For workout routes, check workout assignment
		if (needsWorkoutProtection && !assignmentStatus?.data?.workout_assigned) {
			return <NoAssignmentMessage type="workout" />;
		}

		// For diet routes, check diet assignment
		if (needsDietProtection && !assignmentStatus?.data?.diet_assigned) {
			return <NoAssignmentMessage type="diet" />;
		}
	}

	return children;
}
