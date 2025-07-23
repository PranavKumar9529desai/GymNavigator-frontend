import FetchGymDetailsSA from '../../gym/(gymdetails)/viewgymdetails/_actions/GetGymDetails';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { GetAttendanceQrData } from './GetAttendanceQrData';
import GymQRCode from '@/components/gym-owner/QrCode';
import { Suspense } from 'react';
import Loading from './loading';

export default async function AttendanceComponent() {
	// First check if gym exists
	const gymDetails = await FetchGymDetailsSA();

	if (!gymDetails) {
		return (
			<div className="h-screen flex flex-col justify-center items-center gap-6 p-4">
				<div className="text-center space-y-4">
					<h2 className="text-2xl font-bold text-gray-900">No Gym Found</h2>
					<p className="text-gray-600">Please create your gym profile first</p>
				</div>
				<Link href="/dashboard/owner/gymdetails/viewgymdetails">
					<Button
						variant="default"
						className="bg-blue-600 hover:bg-blue-700 text-white"
					>
						Create Gym Profile
					</Button>
				</Link>
			</div>
		);
	}

	// If gym exists, proceed with attendance QR
	const gymData = await GetAttendanceQrData();

	if (!gymData) {
		return <div>Unable to load attendance data</div>;
	}

	const qrValue = JSON.stringify({
		AttendanceAction: {
			gymname: gymData.gymname,
			gymid: gymData.gymid,
			timestamp: new Date().setMinutes(0, 0, 0),
		},
	});

	return (
		<div className="container mx-auto py-6">
			<GymQRCode
				qrdata={qrValue}
				title={gymData.gymname}
				subtitle="Scan this QR code to mark your attendance"
			/>
		</div>
	);
}
