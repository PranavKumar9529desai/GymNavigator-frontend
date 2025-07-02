import type React from 'react';
import NoAssignmentMessage from '../_components/NoAssignmentMessage';
import { checkIsWorkoutAssigned } from './_actions/isworkout-assigned';

export default async function WorkoutsLayout({
	children,
}: {
	children: React.ReactNode;
}) {
	const { isAssigned } = await checkIsWorkoutAssigned();

	if (!isAssigned) {
		return <NoAssignmentMessage type="workout" />;
	}

	return <div className="container mx-auto px-4">{children}</div>;
}
