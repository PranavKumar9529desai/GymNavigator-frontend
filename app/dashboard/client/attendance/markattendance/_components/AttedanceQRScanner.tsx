'use client';
import { CheckCircle2, QrCode } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useState, useEffect, useRef } from 'react';
import { toast } from 'sonner';
import QrScanner from 'qr-scanner';
import { markAttendance } from '../_actions/mark-attendance';
import { QR_SCANNER_CONFIG } from '@/app/onboarding/_components/onboarding-qr-scanner';

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
	const [preferredCameraDeviceId, setPreferredCameraDeviceId] = useState<
		string | null
	>(null);
	const videoRef = useRef<HTMLVideoElement>(null);
	const qrScannerRef = useRef<QrScanner | null>(null);

	useEffect(() => {
		const storedDeviceId = localStorage.getItem('preferredCameraDeviceId');
		if (storedDeviceId) setPreferredCameraDeviceId(storedDeviceId);
	}, []);

	useEffect(() => {
		if (!videoRef.current || qrScannerRef.current) return;

		// Helper function to apply zoom after scanner starts
		const applyDefaultZoom = async (_scanner: QrScanner) => {
			if (QR_SCANNER_CONFIG.DEFAULT_ZOOM !== 1.0) {
				try {
					// Wait a bit for the scanner to fully initialize
					await new Promise((resolve) => setTimeout(resolve, 1000));

					// Get the video stream and apply zoom
					const video = videoRef.current;
					if (video?.srcObject) {
						const stream = video.srcObject as MediaStream;
						const track = stream.getVideoTracks()[0];

						if (track && 'getCapabilities' in track) {
							const capabilities = (
								track as MediaStreamTrack & {
									getCapabilities?: () => MediaTrackCapabilities;
								}
							).getCapabilities?.();
							if (capabilities && 'zoom' in capabilities) {
								const constraints = {
									advanced: [{ zoom: QR_SCANNER_CONFIG.DEFAULT_ZOOM }],
								};
								await (
									track as MediaStreamTrack & {
										applyConstraints?: (
											constraints: MediaTrackConstraints,
										) => Promise<void>;
									}
								).applyConstraints?.({
									advanced: [{ zoom: QR_SCANNER_CONFIG.DEFAULT_ZOOM }],
								} as unknown as MediaTrackConstraints);
								console.log(
									`Applied zoom level: ${QR_SCANNER_CONFIG.DEFAULT_ZOOM}`,
								);
							}
						}
					}
				} catch (error) {
					console.log('Zoom not supported on this device:', error);
				}
			}
		};

		// Initialize QR Scanner
		const qrScanner = new QrScanner(
			videoRef.current,
			async (result) => {
				// Prevent multiple scans
				if (hasProcessed || isProcessing) {
					return;
				}

				try {
					setHasProcessed(true);
					setIsScanning(false);
					setIsProcessing(true);

					const parsedData: QrValueType = JSON.parse(result.data);
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
					const timeDiff = Math.abs(currentUTC - scannedUTC) / (1000 * 60 * 60);

					if (timeDiff <= toleranceInHours) {
						toast.loading('Marking attendance...');

						// Call the server action directly
						const attendanceResult = await markAttendance();

						// Dismiss the loading toast first
						toast.dismiss();

						if (attendanceResult.success) {
							toast.success('Attendance marked successfully!');
							setIsSuccess(true);

							// Redirect after a short delay to show success state
							setTimeout(() => {
								router.push('/dashboard/client/attendance/markattendance');
							}, 2000);
						} else {
							// Use the specific error and details from the server response
							const errorMessage =
								attendanceResult.error || 'Failed to mark attendance';
							const errorDetails = attendanceResult.details;

							const error = new Error(errorMessage);
							// Attach details to the error object for better error handling
							if (errorDetails) {
								(error as Error & { details?: string }).details = errorDetails;
							}
							throw error;
						}
					} else {
						throw new Error('QR code has expired');
					}
				} catch (error: unknown) {
					console.error('Error processing QR code:', error);

					// Dismiss any loading toast
					toast.dismiss();

					const errorMessage =
						error instanceof Error ? error.message : 'Unknown error occurred';
					const errorDetails =
						error instanceof Error && 'details' in error
							? (error as Error & { details?: string }).details
							: undefined;

					toast.error('Failed to process QR code', {
						description: errorDetails || errorMessage,
					});
					setIsProcessing(false);
					setIsScanning(true);
					setHasProcessed(false);
				}
			},
			{
				returnDetailedScanResult: true,
				highlightScanRegion: true,
				preferredCamera:
					preferredCameraDeviceId || QR_SCANNER_CONFIG.PREFERRED_CAMERA,
				maxScansPerSecond: QR_SCANNER_CONFIG.MAX_SCANS_PER_SECOND,
				onDecodeError: (error: unknown) => {
					if (error instanceof Error && !error.message?.includes('NotFound')) {
						console.error('QR scan error:', error);
					}
				},
			},
		);

		qrScannerRef.current = qrScanner;

		// Start scanning
		qrScanner
			.start()
			.then(() => {
				console.log('Attendance QR Scanner started successfully');
				// Apply default zoom after scanner starts
				applyDefaultZoom(qrScanner);
			})
			.catch((error: unknown) => {
				console.error('Failed to start QR scanner:', error);
				toast.error('Failed to start camera', {
					description: 'Please check camera permissions and try again',
				});
			});

		// Cleanup function
		return () => {
			if (qrScannerRef.current) {
				qrScannerRef.current.destroy();
				qrScannerRef.current = null;
			}
		};
	}, [hasProcessed, isProcessing, router, preferredCameraDeviceId]);

	// Cleanup on unmount
	useEffect(() => {
		return () => {
			if (qrScannerRef.current) {
				qrScannerRef.current.destroy();
				qrScannerRef.current = null;
			}
		};
	}, []);

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
								<video
									ref={videoRef}
									style={{ width: '100%' }}
									aria-label="QR Code Scanner Camera Feed"
									playsInline
									muted
								/>
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
								<li>
									Zoom level: {QR_SCANNER_CONFIG.DEFAULT_ZOOM}x (configurable)
								</li>
							</ul>
						</div>
					)}
				</div>
			</div>
		</div>
	);
}
