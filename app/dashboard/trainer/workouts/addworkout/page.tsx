import CreateWorkout from '@/components/trainer/AddWorkouts';
import React from 'react';

export default function page() {
	return (
		<>
			<div className="w-full h-screen overflow-auto flex justify-center items-center">
				<CreateWorkout />
			</div>
		</>
	);
}
