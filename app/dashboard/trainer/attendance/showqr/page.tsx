import GymQRCode from '@/app/dashboard/owner/attendance/showqr/QrCode';
import React from 'react';
import { GetAttendanceQrData } from './GetAttendanceQrData';

export default async function ShowQRPage() {
  const gymData = await GetAttendanceQrData();

  if (!gymData) {
    return <div>Unable to load gym data</div>;
  }

  const qrValue = JSON.stringify({
    AttendanceAction: {
      gymname: gymData.gymname,
      gymid: gymData.gymid,
      timestamp: new Date().setMinutes(0, 0, 0),
    },
  });

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-4">
      <GymQRCode
        qrdata={qrValue}
        title="Today's Attendance"
        subtitle="Scan this QR code to mark your attendance"
      />
    </div>
  );
}
