'use client';

import GymQRCode from '@/app/dashboard/owner/attendance/showqr/QrCode';
import { useQuery } from '@tanstack/react-query';
import { GetAttendanceQrData } from './GetAttendanceQrData';

export default function QRDisplay() {
  const { data: gymData } = useQuery({
    queryKey: ['attendance-qr'],
    queryFn: GetAttendanceQrData,
  });

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
    <GymQRCode
      qrdata={qrValue}
      title="Today's Attendance"
      subtitle="Scan this QR code to mark your attendance"
    />
  );
} 