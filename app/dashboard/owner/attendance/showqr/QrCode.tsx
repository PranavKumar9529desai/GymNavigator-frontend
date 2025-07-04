import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
} from '@/components/ui/card';
import { QRCodeSVG } from 'qrcode.react';
import type React from 'react';

interface GymQRCodeOnboardingProps {
	qrdata: string;
	title: string;
	subtitle: string; // Add subtitle prop
}

const GymQRCode: React.FC<GymQRCodeOnboardingProps> = ({
	qrdata,
	title: _title,
	subtitle,
}) => {
	return (
		<Card className="w-full max-w-md mx-auto  rounded-lg overflow-hidden min-h-[90vh] md:min-h-0">
			<CardHeader className="bg-gradient-to-r from-blue-600 to-blue-800 text-white text-center py-8">
				{/* <CardTitle className="text-3xl font-bold">{title}</CardTitle> */}
				<CardDescription className="text-blue-100 mt-3 text-xl font-semibold tracking-[0.5px]">
					Scan the QR code to mark attendance
				</CardDescription>
			</CardHeader>

			<CardContent className="flex flex-col items-center justify-center p-8 md:p-12">
				<QRCodeSVG
					value={qrdata}
					size={300}
					bgColor={'#ffffff'}
					fgColor={'#000000'}
					level={'M'}
					includeMargin={true}
				/>

				<div className="space-y-4 w-full max-w-sm text-center">
					<p className="text-lg text-gray-700 font-medium px-4">
						{subtitle} {/* Use the passed subtitle */}
					</p>

					<div className="pt-4 border-t border-gray-200">
						<p className="text-sm text-gray-500">
							Having trouble? Contact our support team
						</p>
					</div>
				</div>
			</CardContent>
		</Card>
	);
};

export default GymQRCode;
