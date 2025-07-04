import { Loader2 } from 'lucide-react';
import { Suspense } from 'react';
import { GetAttendanceQrData } from './GetAttendanceQrData';
import QRDisplay from './QRDisplay';

function Spinner() {
	return (
		<div className="flex h-screen w-full items-center justify-center">
			<Loader2 className="h-8 w-8 animate-spin text-primary" />
		</div>
	);
}

export default async function ShowQRPage() {
	// Fetch data server-side
	const qrData = await GetAttendanceQrData();

	return (
		<div className="min-h-screen flex flex-col items-center justify-center p-4">
			<Suspense fallback={<Spinner />}>
				<QRDisplay initialData={qrData} />
			</Suspense>
		</div>
	);
}
