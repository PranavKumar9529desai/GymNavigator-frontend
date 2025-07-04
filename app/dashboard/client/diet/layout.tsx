import type React from 'react';
import NoAssignmentMessage from '../_components/NoAssignmentMessage';
import { checkIsDietAssigned } from './_actions/is-diet-assigned';

export default async function DietLayout({
	children,
}: {
	children: React.ReactNode;
}) {
	const { isAssigned } = await checkIsDietAssigned();

	if (!isAssigned) {
		return <NoAssignmentMessage type="diet" />;
	}

	return (
		<div className="w-full max-w-full sm:container sm:mx-auto px-0 sm:px-4">
			{children}
		</div>
	);
}
