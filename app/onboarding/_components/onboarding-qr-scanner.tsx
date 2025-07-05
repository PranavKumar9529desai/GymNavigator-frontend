'use client';
import { useRouter } from 'next/navigation';
import { useEffect, useState, useRef } from 'react';
import { toast } from 'sonner';
import QrScanner from 'qr-scanner';
import { ProcessingState } from './qr-scanner-states/ProcessingState';
import { SuccessState } from './qr-scanner-states/SuccessState';
import { ScanningState } from './qr-scanner-states/ScanningState';

interface QrValueType {
	OnboardingAction: {
		gymname: string;
		gymid: string;
		hash: string;
	};
}

// Configuration for QR Scanner - Adjust DEFAULT_ZOOM to test different zoom levels
export const QR_SCANNER_CONFIG = {
	DEFAULT_ZOOM: 2.5, // Adjust this: 1.0 = no zoom, 1.5 = 1.5x zoom, 2.0 = 2x zoom, etc.
	PREFERRED_CAMERA: 'environment' as const,
	MAX_SCANS_PER_SECOND: 25,
};

export default function OnboardingQrScanner() {
	const router = useRouter();
	const [isScanning, setIsScanning] = useState(true);
	const [isProcessing, setIsProcessing] = useState(false);
	const [isSuccess, setIsSuccess] = useState(false);
	const [hasProcessed, setHasProcessed] = useState(false);
	const videoRef = useRef<HTMLVideoElement>(null);
	const qrScannerRef = useRef<QrScanner | null>(null);

	useEffect(() => {
		if (!videoRef.current || qrScannerRef.current) return;

		// Helper function to apply zoom after scanner starts
		const applyDefaultZoom = async (scanner: QrScanner) => {
			if (QR_SCANNER_CONFIG.DEFAULT_ZOOM !== 1.0) {
				try {
					// Wait a bit for the scanner to fully initialize
					await new Promise(resolve => setTimeout(resolve, 1000));
					
					// Get the video stream and apply zoom
					const video = videoRef.current;
					if (video && video.srcObject) {
						const stream = video.srcObject as MediaStream;
						const track = stream.getVideoTracks()[0];
						
						if (track && 'getCapabilities' in track) {
							const capabilities = (track as any).getCapabilities();
							if (capabilities && 'zoom' in capabilities) {
								const constraints = {
									advanced: [{ zoom: QR_SCANNER_CONFIG.DEFAULT_ZOOM }]
								};
								await (track as any).applyConstraints(constraints);
								console.log(`Applied zoom level: ${QR_SCANNER_CONFIG.DEFAULT_ZOOM}`);
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
			(result) => {
				// Prevent multiple scans
				if (hasProcessed || isProcessing) {
					return;
				}

				try {
					setHasProcessed(true);
					setIsScanning(false);
					setIsProcessing(true);

					// Parse the QR code data
					const parsedData: QrValueType = JSON.parse(result.data);

					if (parsedData.OnboardingAction) {
						const { gymname, gymid, hash } = parsedData.OnboardingAction;
						console.log('Onboarding action data:', parsedData.OnboardingAction);

						// Process successful scan
						toast.success('QR code scanned successfully');
						setIsSuccess(true);

						// Get the user's role from localStorage
						const userRole = localStorage.getItem('userRole') || 'client';

						// Navigate to the gym enrollment page
						setTimeout(() => {
							router.push(
								`/onboarding/${userRole}/attachtogym?gymname=${gymname}&hash=${hash}&gymid=${gymid}`,
							);
						}, 1000);
					} else {
						throw new Error('Invalid QR code: Not an onboarding QR code');
					}
				} catch (error) {
					console.error('Error processing QR code:', error);
					toast.error('Failed to process QR code', {
						description:
							error instanceof Error ? error.message : 'Unknown error occurred',
					});
					setIsProcessing(false);
					setIsScanning(true);
					setHasProcessed(false);
				}
			},
			{
				returnDetailedScanResult: true,
				highlightScanRegion: true,
				highlightCodeOutline: true,
				preferredCamera: QR_SCANNER_CONFIG.PREFERRED_CAMERA,
				maxScansPerSecond: QR_SCANNER_CONFIG.MAX_SCANS_PER_SECOND,
				onDecodeError: (error: unknown) => {
					if (error instanceof Error && !error.message?.includes('NotFound')) {
						console.error('QR scan error:', error);
					}
				},
			}
		);

		qrScannerRef.current = qrScanner;

		// Start scanning
		qrScanner.start()
			.then(() => {
				console.log('QR Scanner started successfully');
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
	}, [hasProcessed, isProcessing, router]);

	// Cleanup on unmount
	useEffect(() => {
		return () => {
			if (qrScannerRef.current) {
				qrScannerRef.current.destroy();
				qrScannerRef.current = null;
			}
		};
	}, []);

	if (isProcessing && !isSuccess) {
		return <ProcessingState />;
	}

	if (isSuccess) {
		return <SuccessState />;
	}

	if (isScanning && !isProcessing && !hasProcessed) {
		return <ScanningState videoRef={videoRef} zoomLevel={QR_SCANNER_CONFIG.DEFAULT_ZOOM} />;
	}

	// If none of the other states match, this is the default state
	return null;
}
