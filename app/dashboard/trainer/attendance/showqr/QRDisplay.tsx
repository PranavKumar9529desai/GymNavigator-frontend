'use client';

import GymQRCode from '@/components/gym-owner/QrCode';

interface QRDisplayProps {
	initialData: { gymname: string; gymid: number } | null;
}

export default function QRDisplay({ initialData }: QRDisplayProps) {
	if (!initialData) {
		return <div>Unable to load gym data</div>;
	}

	const qrValue = JSON.stringify({
		AttendanceAction: {
			gymname: initialData.gymname,
			gymid: initialData.gymid,
			timestamp: new Date().setMinutes(0, 0, 0),
		},
	});

	return (
		<GymQRCode
			qrdata={qrValue}
			title="Today's Attendance"
			subtitle="Scan this QR code to mark your attendance"
		/>
	);
}
