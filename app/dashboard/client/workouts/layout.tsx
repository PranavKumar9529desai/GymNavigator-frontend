import type React from 'react';
import { checkIsWorkoutAssigned } from './_actions/isworkout-assigned';
import { WorkoutNotAssigned } from './myworkouts/_component/workout-not-assigned';

export default async function WorkoutsLayout({
	children,
}: {
	children: React.ReactNode;
}) {
	const { isAssigned } = await checkIsWorkoutAssigned();

	if (!isAssigned) {
		return <WorkoutNotAssigned />;
	}

	return <div className="container mx-auto px-4">{children}</div>;
}
