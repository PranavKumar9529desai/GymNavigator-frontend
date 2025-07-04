'use client';
import { CheckCircle2, QrCode } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { useZxing } from 'react-zxing';
import { toast } from 'sonner';
import { markAttendance } from '../_actions/mark-attendance';

interface QrValueType {
	AttendanceAction: {
		gymname: string;
		gymid: number;
		timestamp: number;
	};
}

export default function AttendanceQRScanner() {
	const router = useRouter();
	const [isScanning, setIsScanning] = useState(true);
	const [isProcessing, setIsProcessing] = useState(false);
	const [hasProcessed, setHasProcessed] = useState(false);
	const [isSuccess, setIsSuccess] = useState(false);

	const { ref } = useZxing({
		onDecodeResult: async (result) => {
			// Prevent multiple scans
			if (hasProcessed || isProcessing) {
				return;
			}

			try {
				setHasProcessed(true);
				setIsScanning(false);
				setIsProcessing(true);

				const parsedData: QrValueType = JSON.parse(result.getText());
				const now = new Date();
				const currentUTC = Date.UTC(
					now.getUTCFullYear(),
					now.getUTCMonth(),
					now.getUTCDate(),
					now.getUTCHours(),
				);

				const scannedTime = new Date(parsedData.AttendanceAction.timestamp);
				const scannedUTC = Date.UTC(
					scannedTime.getUTCFullYear(),
					scannedTime.getUTCMonth(),
					scannedTime.getUTCDate(),
					scannedTime.getUTCHours(),
				);

				const toleranceInHours = 1;
				const timeDiff =
					Math.abs(currentUTC - scannedUTC) / (1000 * 60 * 60);

				if (timeDiff <= toleranceInHours) {
					toast.loading('Marking attendance...');
					
					// Call the server action directly
					const result = await markAttendance();
					
					if (result.success) {
						toast.dismiss();
						toast.success('Attendance marked successfully!');
						setIsSuccess(true);
						
						// Redirect after a short delay to show success state
						setTimeout(() => {
							router.push('/dashboard/client/attendance/markattendance');
						}, 2000);
					} else {
						throw new Error(result.error || 'Failed to mark attendance');
					}
				} else {
					throw new Error('QR code has expired');
				}
			} catch (error) {
				console.error('Error processing QR code:', error);
				toast.error('Failed to process QR code', {
					description:
						error instanceof Error
							? error.message
							: 'Unknown error occurred',
				});
				setIsProcessing(false);
				setIsScanning(true);
				setHasProcessed(false);
			}
		},
		onError(error) {
			if (error instanceof Error && !error.message?.includes('NotFound')) {
				console.error('QR scan error:', error);
			}
		},
		constraints: {
			video: {
				facingMode: 'environment'
			}
		}
	});

	if (isProcessing) {
		return (
			<div className="flex items-center justify-center bg-background/95 backdrop-blur-sm p-4">
				<div className="w-full max-w-sm mx-auto">
					<div className="space-y-4">
						<div className="flex items-center justify-center space-x-2 mb-4">
							<QrCode className="w-6 h-6 text-primary" />
							<h2 className="text-xl font-semibold">Processing QR Code</h2>
						</div>
						<div className="relative rounded-lg overflow-hidden bg-white dark:bg-gray-900">
							<div className="flex flex-col items-center justify-center p-8 space-y-4">
								<div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin" />
								<p className="text-sm text-muted-foreground">
									Marking your attendance...
								</p>
							</div>
						</div>
					</div>
				</div>
			</div>
		);
	}

	if (isSuccess) {
		return (
			<div className="flex items-center justify-center bg-background/95 backdrop-blur-sm p-4">
				<div className="w-full max-w-sm mx-auto">
					<div className="space-y-4">
						<div className="flex items-center justify-center space-x-2 mb-4">
							<CheckCircle2 className="w-6 h-6 text-green-500" />
							<h2 className="text-xl font-semibold">Attendance Marked!</h2>
						</div>
						<div className="relative rounded-lg overflow-hidden bg-white dark:bg-gray-900">
							<div className="flex flex-col items-center justify-center p-8 space-y-4">
								<p className="text-base font-medium">
									Your attendance has been successfully recorded.
								</p>
							</div>
						</div>
					</div>
				</div>
			</div>
		);
	}

	return (
		<div className="flex items-center justify-center bg-background/95 backdrop-blur-sm p-4">
			<div className="w-full max-w-sm mx-auto">
				<div className="space-y-4">
					<div className="flex items-center justify-center space-x-2 mb-4">
						<QrCode className="w-6 h-6 text-primary" />
						<h2 className="text-xl font-semibold">Scan QR Code</h2>
					</div>

					<div className="relative rounded-lg overflow-hidden bg-white dark:bg-gray-900">
						{isScanning && !isProcessing && !hasProcessed && (
							<>
								<div className="absolute inset-0 z-10 border-4 border-dashed border-primary/40 rounded-lg animate-pulse pointer-events-none" />
								<video ref={ref} style={{ width: '100%' }} />
							</>
						)}
					</div>

					{isScanning && !isProcessing && !hasProcessed && (
						<div className="space-y-2">
							<p className="text-sm text-center text-muted-foreground">
								Scan the QR code displayed at your gym to mark your attendance.
							</p>
							<ul className="text-xs text-muted-foreground space-y-1 list-disc pl-5">
								<li>Make sure the QR code is within the scanning area</li>
								<li>Ensure good lighting for better scanning</li>
								<li>Hold your device steady while scanning</li>
							</ul>
						</div>
					)}
				</div>
			</div>
		</div>
	);
}
