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
	const [_debugMessages, setDebugMessages] = useState<string[]>([]);
	const [cameraIndex, setCameraIndex] = useState(0);
	const [backCameras, setBackCameras] = useState<MediaDeviceInfo[]>([]);
	const [isCameraLoading, setIsCameraLoading] = useState(false);
	const [_preferredDeviceId, setPreferredDeviceId] = useState<string | null>(
		null,
	);
	const [_hasUsedSavedCamera, setHasUsedSavedCamera] = useState(false);
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
					setHasUsedSavedCamera(true);
					// Show toast after a short delay to ensure camera is set up
					setTimeout(() => {
						toast.info(
							"Using previously selected camera. Click 'Next Camera' to switch.",
						);
					}, 1000);
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
								const userRole = localStorage.getItem('userRole') || 'client';
								if (userRole === 'trainer') {
									router.push(
										`/onboarding/trainer/auth-token/${gymid}?gymname=${gymname}&hash=${hash}`,
									);
								} else {
									router.push(
										`/onboarding/${userRole}/select-plan?gymname=${gymname}&hash=${hash}&gymid=${gymid}`,
									);
								}
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
			// --- FIX: Explicitly clear the video element's srcObject ---
			if (videoRef.current) {
				videoRef.current.srcObject = null;
			}
			// Add a longer delay to ensure cleanup
			destroyTimeout = setTimeout(setupScanner, 600);
		} else {
			setupScanner();
		}

		return () => {
			isMounted = false;
			if (qrScannerRef.current) {
				qrScannerRef.current.destroy();
				qrScannerRef.current = null;
				// --- FIX: Explicitly clear the video element's srcObject on cleanup ---
				if (videoRef.current) {
					videoRef.current.srcObject = null;
				}
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

	// Debug overlay component - COMMENTED OUT FOR PRODUCTION (keep for debugging)
	// const DebugOverlay = () => (
	// 	<div
	// 		style={{
	// 			position: 'fixed',
	// 			bottom: 0,
	// 			left: 0,
	// 			width: '100vw',
	// 			background: 'rgba(0,0,0,0.7)',
	// 			color: '#fff',
	// 			zIndex: 9999,
	// 			fontSize: '12px',
	// 			padding: '8px',
	// 			maxHeight: '30vh',
	// 			overflowY: 'auto',
	// 			pointerEvents: 'none',
	// 		}}
	// 	>
	// 		{debugMessages.map((msg, idx) => (
	// 			<div key={idx as number}>{msg}</div>
	// 		))}
	// 	</div>
	// );

	// Camera switcher UI with improved styling and tooltip
	const CameraSwitcher = () =>
		backCameras.length > 1 ? (
			<div className="group relative" title="Switch to next available camera">
				<button
					type="button"
					onClick={() => {
						const newIndex = (cameraIndex + 1) % backCameras.length;
						setCameraIndex(newIndex);
						// Save the new deviceId to localStorage when user manually switches
						const newDeviceId = backCameras[newIndex].deviceId;
						localStorage.setItem('preferredCameraDeviceId', newDeviceId);
						toast.success(
							'Camera switched successfully. Your preference has been saved.',
						);

						// Reset scan states
						setHasProcessed(false);
						setIsScanning(true);
						setIsProcessing(false);
						setIsSuccess(false);
						setDebugMessages([]);
					}}
					className="relative flex items-center gap-2 px-4 py-2.5 bg-white/90 backdrop-blur-sm border border-gray-200 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105 text-gray-700 hover:text-gray-900 font-medium text-sm"
					style={{
						position: 'absolute',
						top: 16,
						right: 16,
						zIndex: 10000,
					}}
				>
					{/* Camera icon */}
					<svg
						className="w-4 h-4"
						fill="none"
						stroke="currentColor"
						viewBox="0 0 24 24"
						xmlns="http://www.w3.org/2000/svg"
						aria-label="Camera icon"
						role="img"
					>
						<title>Camera</title>
						<path
							strokeLinecap="round"
							strokeLinejoin="round"
							strokeWidth={2}
							d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z"
						/>
					</svg>
					<span>Switch Camera</span>

					{/* Camera count indicator */}
					<span className="ml-1 px-1.5 py-0.5 bg-blue-100 text-blue-600 text-xs font-semibold rounded-full">
						{cameraIndex + 1}/{backCameras.length}
					</span>
				</button>

				{/* Tooltip */}
				<div className="absolute right-0 top-12 w-64 p-3 bg-gray-900 text-white text-xs rounded-lg shadow-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none z-10001">
					<div className="flex items-start gap-2">
						<div className="flex-shrink-0 mt-0.5">
							<svg
								className="w-3 h-3 text-blue-400"
								fill="currentColor"
								viewBox="0 0 20 20"
								aria-label="Information icon"
								role="img"
							>
								<title>Information</title>
								<path
									fillRule="evenodd"
									d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z"
									clipRule="evenodd"
								/>
							</svg>
						</div>
						<div>
							<p className="font-medium mb-1">Switch Camera</p>
							<p className="text-gray-300 leading-relaxed">
								Click to switch between available cameras. Your preference will
								be saved for future use.
							</p>
						</div>
					</div>
					{/* Tooltip arrow */}
					<div className="absolute -top-1 right-4 w-2 h-2 bg-gray-900 transform rotate-45" />
				</div>
			</div>
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
				{/* <DebugOverlay /> */}
			</>
		);
	}

	if (isSuccess) {
		return (
			<>
				<SuccessState />
				<CameraSwitcher />
				<CameraLoading />
				{/* <DebugOverlay /> */}
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
				{/* <DebugOverlay /> */}
			</>
		);
	}

	// If none of the other states match, this is the default state
	return (
		<>
			<CameraSwitcher />
			<CameraLoading />
			{/* <DebugOverlay /> */}
		</>
	);
}
