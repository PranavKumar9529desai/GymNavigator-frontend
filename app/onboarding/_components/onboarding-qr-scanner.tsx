'use client';
import { useRouter } from 'next/navigation';
import { useEffect, useState, useRef } from 'react';
import { toast } from 'sonner';
import QrScanner from 'qr-scanner';
import { ProcessingState } from './qr-scanner-states/ProcessingState';
import { SuccessState } from './qr-scanner-states/SuccessState';
import { ScanningState } from './qr-scanner-states/ScanningState';
import {
	getBackCameraDeviceIdByIndex,
	getBackCameras,
} from '@/utils/selectBestCamera';
import React from 'react';

interface QrValueType {
	OnboardingAction: {
		gymname: string;
		gymid: string;
		hash: string;
	};
}

// TODO fixing the this configuraiton
// Configuration for QR Scanner - Adjust DEFAULT_ZOOM to test different zoom levels
export const QR_SCANNER_CONFIG = {
	DEFAULT_ZOOM: 1, // Adjust this: 1.0 = no zoom, 1.5 = 1.5x zoom, 2.0 = 2x zoom, etc.
	PREFERRED_CAMERA: 'environment' as const,
	MAX_SCANS_PER_SECOND: 25,
};

export default function OnboardingQrScanner() {
	const router = useRouter();
	const [isScanning, setIsScanning] = useState(true);
	const [isProcessing, setIsProcessing] = useState(false);
	const [isSuccess, setIsSuccess] = useState(false);
	const [hasProcessed, setHasProcessed] = useState(false);
	const [debugMessages, setDebugMessages] = useState<string[]>([]);
	const [cameraIndex, setCameraIndex] = useState(0);
	const [backCameras, setBackCameras] = useState<MediaDeviceInfo[]>([]);
	const [isCameraLoading, setIsCameraLoading] = useState(false);
	const [_preferredDeviceId, setPreferredDeviceId] = useState<string | null>(
		null,
	);
	const videoRef = useRef<HTMLVideoElement>(null);
	const qrScannerRef = useRef<QrScanner | null>(null);

	const addDebugMessage = React.useCallback((msg: string) => {
		setDebugMessages((prev) => [...prev, msg]);
	}, []);

	// Fetch back cameras on mount and check for preferred deviceId
	useEffect(() => {
		getBackCameras().then((cameras) => {
			setBackCameras(cameras);
			const storedDeviceId = localStorage.getItem('preferredCameraDeviceId');
			if (storedDeviceId) {
				const idx = cameras.findIndex((cam) => cam.deviceId === storedDeviceId);
				if (idx !== -1) {
					setCameraIndex(idx);
					setPreferredDeviceId(storedDeviceId);
				}
			}
		});
	}, []);

	useEffect(() => {
		if (!videoRef.current || qrScannerRef.current) return;

		let isMounted = true;
		let destroyTimeout: NodeJS.Timeout | null = null;

		const applyDefaultZoom = async (_scanner: QrScanner) => {
			if (QR_SCANNER_CONFIG.DEFAULT_ZOOM !== 1.0) {
				try {
					await new Promise((resolve) => setTimeout(resolve, 1000));
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
									advanced: [
										{
											zoom: QR_SCANNER_CONFIG.DEFAULT_ZOOM,
										} as MediaTrackConstraintSet,
									],
								};
								await (
									track as MediaStreamTrack & {
										applyConstraints?: (
											constraints: MediaTrackConstraints,
										) => Promise<void>;
									}
								).applyConstraints?.(constraints);
								addDebugMessage(
									`Applied zoom level: ${QR_SCANNER_CONFIG.DEFAULT_ZOOM}`,
								);
							}
						}
					}
				} catch (_error) {
					addDebugMessage('Zoom not supported on this device');
				}
			}
		};

		const setupScanner = async () => {
			setIsCameraLoading(true);
			const deviceId = await getBackCameraDeviceIdByIndex(
				cameraIndex,
				addDebugMessage,
			);
			addDebugMessage(`Device id: ${deviceId}`);
			const videoElement = videoRef.current;
			if (!videoElement) {
				setIsCameraLoading(false);
				return;
			}

			const qrScanner = new QrScanner(
				videoElement,
				(result: QrScanner.ScanResult) => {
					if (hasProcessed || isProcessing) {
						return;
					}
					try {
						setHasProcessed(true);
						setIsScanning(false);
						setIsProcessing(true);
						const parsedData: QrValueType = JSON.parse(result.data);
						if (parsedData.OnboardingAction) {
							const { gymname, gymid, hash } = parsedData.OnboardingAction;
							addDebugMessage(
								`Onboarding action data: ${JSON.stringify(parsedData.OnboardingAction)}`,
							);
							toast.success('QR code scanned successfully');
							setIsSuccess(true);
							const userRole = localStorage.getItem('userRole') || 'client';
							// Store the used deviceId in localStorage
							if (deviceId) {
								localStorage.setItem('preferredCameraDeviceId', deviceId);
							}
							setTimeout(() => {
								router.push(
									`/onboarding/${userRole}/attachtogym?gymname=${gymname}&hash=${hash}&gymid=${gymid}`,
								);
							}, 1000);
						} else {
							throw new Error('Invalid QR code: Not an onboarding QR code');
						}
					} catch (error) {
						addDebugMessage(
							`Error processing QR code: ${error instanceof Error ? error.message : 'Unknown error'}`,
						);
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
				{
					returnDetailedScanResult: true,
					highlightScanRegion: true,
					highlightCodeOutline: true,
					preferredCamera: deviceId,
					maxScansPerSecond: QR_SCANNER_CONFIG.MAX_SCANS_PER_SECOND,
					onDecodeError: (error: unknown) => {
						if (
							error instanceof Error &&
							!error.message?.includes('NotFound')
						) {
							addDebugMessage(`QR scan error: ${error.message}`);
							console.error('QR scan error:', error);
						}
					},
				},
			);

			qrScannerRef.current = qrScanner;

			qrScanner
				.start()
				.then(() => {
					if (isMounted) {
						addDebugMessage('QR Scanner started successfully');
						applyDefaultZoom(qrScanner);
						setIsCameraLoading(false);
					}
				})
				.catch((error: unknown) => {
					if (isMounted) {
						addDebugMessage(
							`Failed to start QR scanner: ${error instanceof Error ? error.message : 'Unknown error'}`,
						);
						console.error('Failed to start QR scanner:', error);
						toast.error('Failed to start camera', {
							description: 'Please check camera permissions and try again',
						});
						setIsCameraLoading(false);
					}
				});
		};

		// Ensure previous scanner is destroyed before starting a new one
		if (qrScannerRef.current) {
			(qrScannerRef.current as QrScanner).destroy();
			qrScannerRef.current = null;
			// Add a small delay to ensure cleanup
			destroyTimeout = setTimeout(setupScanner, 300);
		} else {
			setupScanner();
		}

		return () => {
			isMounted = false;
			if (qrScannerRef.current) {
				qrScannerRef.current.destroy();
				qrScannerRef.current = null;
			}
			if (destroyTimeout) clearTimeout(destroyTimeout);
		};
		// cameraIndex is a dependency so scanner resets on camera change
	}, [hasProcessed, isProcessing, router, cameraIndex, addDebugMessage]);

	// Cleanup on unmount
	useEffect(() => {
		return () => {
			if (qrScannerRef.current) {
				qrScannerRef.current.destroy();
				qrScannerRef.current = null;
			}
		};
	}, []);

	// Debug overlay component
	const DebugOverlay = () => (
		<div
			style={{
				position: 'fixed',
				bottom: 0,
				left: 0,
				width: '100vw',
				background: 'rgba(0,0,0,0.7)',
				color: '#fff',
				zIndex: 9999,
				fontSize: '12px',
				padding: '8px',
				maxHeight: '30vh',
				overflowY: 'auto',
				pointerEvents: 'none',
			}}
		>
			{debugMessages.map((msg, idx) => (
				<div key={idx as number}>{msg}</div>
			))}
		</div>
	);

	// Camera switcher UI
	const CameraSwitcher = () =>
		backCameras.length > 1 ? (
			<button
				type="button"
				onClick={() => {
					setCameraIndex((prev) => (prev + 1) % backCameras.length);
					setHasProcessed(false); // reset scan state on camera switch
					setIsScanning(true);
					setIsProcessing(false);
					setIsSuccess(false);
					setDebugMessages([]);
				}}
				style={{
					position: 'absolute',
					top: 16,
					right: 16,
					zIndex: 10000,
					background: '#222',
					color: '#fff',
					border: 'none',
					borderRadius: 8,
					padding: '8px 16px',
					fontSize: 16,
					boxShadow: '0 2px 8px rgba(0,0,0,0.2)',
					cursor: 'pointer',
				}}
			>
				Next Camera
			</button>
		) : null;

	// Camera loading overlay
	const CameraLoading = () =>
		isCameraLoading ? (
			<div
				style={{
					position: 'fixed',
					top: 0,
					left: 0,
					width: '100vw',
					height: '100vh',
					background: 'rgba(0,0,0,0.5)',
					zIndex: 10001,
					display: 'flex',
					alignItems: 'center',
					justifyContent: 'center',
					color: '#fff',
					fontSize: 24,
					pointerEvents: 'auto',
				}}
			>
				Switching camera...
			</div>
		) : null;

	if (isProcessing && !isSuccess) {
		return (
			<>
				<ProcessingState />
				<CameraSwitcher />
				<CameraLoading />
				<DebugOverlay />
			</>
		);
	}

	if (isSuccess) {
		return (
			<>
				<SuccessState />
				<CameraSwitcher />
				<CameraLoading />
				<DebugOverlay />
			</>
		);
	}

	if (isScanning && !isProcessing && !hasProcessed) {
		return (
			<>
				<ScanningState
					videoRef={videoRef}
					zoomLevel={QR_SCANNER_CONFIG.DEFAULT_ZOOM}
				/>
				<CameraSwitcher />
				<CameraLoading />
				<DebugOverlay />
			</>
		);
	}

	// If none of the other states match, this is the default state
	return (
		<>
			<CameraSwitcher />
			<CameraLoading />
			<DebugOverlay />
		</>
	);
}
