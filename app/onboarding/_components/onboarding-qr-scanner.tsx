'use client';
import { Skeleton } from '@/components/ui/skeleton';
import { CheckCircle2, QrCode } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { toast } from 'sonner';
import { useZxing } from 'react-zxing';

interface QrValueType {
	OnboardingAction: {
		gymname: string;
		gymid: string;
		hash: string;
	};
}

export default function OnboardingQrScanner() {
	const router = useRouter();
	const [isScanning, setIsScanning] = useState(true);
	const [isProcessing, setIsProcessing] = useState(false);
	const [isSuccess, setIsSuccess] = useState(false);

	const { ref } = useZxing({
		onDecodeResult(result) {
			try {
				setIsScanning(false);
				setIsProcessing(true);

				// Parse the QR code data
				const parsedData: QrValueType = JSON.parse(result.getText());

				if (parsedData.OnboardingAction) {
					const { gymname, gymid, hash } = parsedData.OnboardingAction;
					console.log(
						'Onboarding action data:',
						parsedData.OnboardingAction,
					);

					// Process successful scan
					toast.success('QR code scanned successfully');
					setIsSuccess(true);

					// Get the user's role from localStorage or a state management solution
					const userRole = localStorage.getItem('userRole') || 'trainee'; // Default to 'trainee' if not found

					// Navigate to the gym enrollment page with the scanned parameters
					setTimeout(() => {
						router.push(
							`/onboarding/${userRole}/attachtogym?gymname=${gymname}&hash=${hash}&gymid=${gymid}`,
						);
					}, 1500);
				} else {
					throw new Error('Invalid QR code: Not an onboarding QR code');
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

	if (isProcessing && !isSuccess) {
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
									Processing your onboarding request...
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
							<h2 className="text-xl font-semibold">Onboarding QR Scanned!</h2>
						</div>
						<div className="relative rounded-lg overflow-hidden bg-white dark:bg-gray-900">
							<div className="flex flex-col items-center justify-center p-8 space-y-4">
								<p className="text-base font-medium">
									Redirecting to enrollment...
								</p>
							</div>
						</div>
					</div>
				</div>
			</div>
		);
	}

	if (isScanning && !isProcessing) {
		return (
			<div className="flex items-center justify-center bg-background/95 backdrop-blur-sm p-4">
				<div className="w-full max-w-sm mx-auto">
					<div className="space-y-4">
						<div className="flex items-center justify-center space-x-2 mb-4">
							<QrCode className="w-6 h-6 text-primary" />
							<h2 className="text-xl font-semibold">Scan Gym QR Code</h2>
						</div>

						<div className="relative rounded-lg overflow-hidden bg-white dark:bg-gray-900">
							<div className="absolute inset-0 z-10 border-4 border-dashed border-primary/40 rounded-lg animate-pulse pointer-events-none" />
							{isScanning && (
								<video ref={ref} style={{ width: '100%' }} />
							)}
						</div>

						<div className="space-y-2">
							<p className="text-sm text-center text-muted-foreground">
								Scan the QR code provided by your gym to start the onboarding
								process.
							</p>
							<ul className="text-xs text-muted-foreground space-y-1 list-disc pl-5">
								<li>Make sure the QR code is within the scanning area</li>
								<li>Ensure good lighting for better scanning</li>
								<li>Hold your device steady while scanning</li>
							</ul>
						</div>
					</div>
				</div>
			</div>
		);
	}

	// If none of the other states match, this is the default state
	return null;
}
