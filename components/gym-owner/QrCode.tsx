import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { QRCodeSVG } from 'qrcode.react';
import type React from 'react';

interface GymQRCodeOnboardingProps {
	qrdata: string;
	title: string;
	subtitle: string;
}

interface GymQRCodeAttendanceProps {
	qrdata: string;
	title: string;
	subtitle: string;
}

// Unified QR Code component for both onboarding and attendance
// This component can be used for both onboarding and attendance QR codes
const GymQRCode: React.FC<
	GymQRCodeOnboardingProps | GymQRCodeAttendanceProps
> = ({ qrdata, title, subtitle }) => {
	return (
		<Card className="w-full max-w-md mx-auto rounded-lg overflow-hidden md:min-h-0 bg-transparent border-0">
			<CardHeader className="text-blue-600 text-center py-2">
				<CardTitle className="text-3xl font-bold">{title}</CardTitle>
			</CardHeader>

			<CardContent className="flex flex-col items-center justify-center p-2 md:p-12">
				{/* QR Code container with accessible labels */}
				<div
					className="bg-white p-4 rounded-lg mb-4"
					role="img"
					aria-label="QR Code for scanning"
				>
					<div className="sm:hidden">
						{/* Mobile QR (displayed below sm breakpoint) */}
						<QRCodeSVG
							value={qrdata}
							size={280}
							bgColor="#ffffff"
							fgColor="#000000"
							level="H" // Highest error correction
							includeMargin={true}
							title="Scan this QR code"
						/>
					</div>
					<div className="hidden sm:block">
						{/* Desktop QR (displayed sm breakpoint and above) */}
						<QRCodeSVG
							value={qrdata}
							size={500}
							bgColor="#ffffff"
							fgColor="#000000"
							level="H" // Highest error correction
							includeMargin={true}
							title="Scan this QR code"
						/>
					</div>
				</div>

				<div className="space-y-4 w-full max-w-sm text-center">
					<p className="text-lg text-gray-700 font-medium px-4">{subtitle}</p>

					<div className="pt-4 border-t border-gray-200">
						<p className="text-sm text-gray-500">
							Having trouble? Position your camera 6-12 inches from the code in
							good lighting
						</p>
					</div>
				</div>
			</CardContent>
		</Card>
	);
};

export default GymQRCode;
