'use client';

import { Button } from '@/components/ui/button';
import { Edit } from 'lucide-react';
import { useState, useEffect } from 'react';
import { EditGymDrawer } from './edit-gym-drawer';
import { EditGymSheet } from './edit-gym-sheet';
import type { GymData } from '../types/gym-types';
import type { GymTabData } from '../hooks/useGymData';
import { useRouter } from 'next/navigation';

interface ViewGymDetailsClientProps {
	gymData: GymData | null;
	gymTabData: GymTabData | null;
}

export function ViewGymDetailsClient({ 
	gymData, 
	gymTabData 
}: ViewGymDetailsClientProps) {
	const [isEditSheetOpen, setIsEditSheetOpen] = useState(false);
	const [isSmallDevice, setIsSmallDevice] = useState(false);
	const router = useRouter();

	// Handle responsive design
	useEffect(() => {
		const handleResize = () => {
			setIsSmallDevice(window.innerWidth < 768);
		};

		// Initial check
		handleResize();

		// Add event listener
		window.addEventListener('resize', handleResize);

		// Cleanup event listener on component unmount
		return () => window.removeEventListener('resize', handleResize);
	}, []);

	const handleSave = (data: unknown) => {
		console.log('Saving data:', data);
		setIsEditSheetOpen(false);
		// Refresh the page to get updated data
		router.refresh();
	};

	return (
		<>
			<div className="flex justify-end mb-4">
				<Button
					onClick={() => setIsEditSheetOpen(true)}
					variant="ghost"
					className="hover:text-blue-600"
				>
					<Edit className="mr-2 text-blue-600 sm:text-gray-800 hover:text-blue-600" />
					<p className="hidden md:block">Edit Gym Details</p>
				</Button>
			</div>

			{isSmallDevice ? (
				<EditGymDrawer
					isOpen={isEditSheetOpen}
					onClose={() => setIsEditSheetOpen(false)}
					gymData={gymData}
					gymTabData={gymTabData}
					onSave={handleSave}
				/>
			) : (
				<EditGymSheet
					isOpen={isEditSheetOpen}
					onClose={() => setIsEditSheetOpen(false)}
					gymData={gymData}
					gymTabData={gymTabData}
					onSave={handleSave}
				/>
			)}
		</>
	);
}
