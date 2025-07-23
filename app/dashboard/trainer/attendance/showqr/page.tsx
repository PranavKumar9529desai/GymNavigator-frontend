import GymQRCode from '@/components/gym-owner/QrCode';
import { GetAttendanceQrData } from './GetAttendanceQrData';

export default async function ShowQRPage() {
	// Fetch data server-side
	const qrData = await GetAttendanceQrData();

	if (!qrData) {
		return (
			<div className="min-h-screen flex flex-col items-center justify-center p-4">
				<div className="text-center space-y-4">
					<h2 className="text-2xl font-bold text-slate-800">
						Unable to Load Attendance Data
					</h2>
					<p className="text-slate-600">
						Please try again later or contact support
					</p>
				</div>
			</div>
		);
	}

	const qrValue = JSON.stringify({
		AttendanceAction: {
			gymname: qrData.gymname,
			gymid: qrData.gymid,
			timestamp: new Date().setMinutes(0, 0, 0),
		},
	});

	return (
		<div className="min-h-screen flex sm:flex-col sm:items-center justify-center p-4">
			<GymQRCode
				qrdata={qrValue}
				title="Today's Attendance"
				subtitle="Scan this QR code to mark your attendance"
			/>
		</div>
	);
}
