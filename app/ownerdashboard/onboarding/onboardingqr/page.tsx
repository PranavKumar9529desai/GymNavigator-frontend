import GymQRCodeOnboarding from '@/components/gym-owner/QrCode';
import { Button } from '@/components/ui/button';
import FetchGymDetailsSA from '../../(common)/GetGymDetails';
import { OnBoadingQrData } from './GetOnBordingQrData';

import Link from 'next/link';
export const dynamic = 'force-dynamic';
export default async function Page() {
  const gymDetails = await FetchGymDetailsSA();

  if (!gymDetails) {
    return (
      <div className="h-screen flex flex-col justify-center items-center gap-6 p-4">
        <div className="text-center space-y-4">
          <h2 className="text-2xl font-bold text-gray-900">No Gym Found</h2>
          <p className="text-gray-600">Please create your gym profile first</p>
        </div>
        <Link href="/ownerdashboard/gymdetails/viewgymdetails">
          <Button
            variant="default"
            className="bg-blue-600 hover:bg-blue-700 text-white"
          >
            Create Gym Profile
          </Button>
        </Link>
      </div>
    );
  }

  const { hash, gymname, gymid } = await OnBoadingQrData();
  const QrData = {
    OnboardingAction: {
      hash: hash,
      gymname: gymname,
      gymid: gymid,
    },
  };

  return (
    <div className="h-screen flex justify-center items-center w-full p-4">
      <GymQRCodeOnboarding
        qrdata={JSON.stringify(QrData)}
        title=""
        subtitle="Please scan the QR code to complete your onboarding process"
      />
    </div>
  );
}
