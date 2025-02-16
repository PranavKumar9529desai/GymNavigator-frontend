import React from 'react';
import { OnBoadingQrData } from '../../onboarding/onboardingqr/GetOnBordingQrData';

import GymQRCodeOnboarding from '@/components/gym-owner/QrCode';
export default async function page() {
  const { hash, gymname } = await OnBoadingQrData();
  const QrData = {
    hash,
    gymname,
  };
  return (
    <div className="h-screen bg-[#f0f0f0] flex justify-center items-center w-full">
      <GymQRCodeOnboarding qrdata={JSON.stringify(QrData) as string} title="" subtitle="" />
    </div>
  );
}
