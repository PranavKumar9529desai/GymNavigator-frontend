'use client';

import dynamic from 'next/dynamic';

// Dynamically import QRScanner with no SSR since it uses browser APIs
const AttendanceQRScanner = dynamic(() => import('./QRScanner'), {
  ssr: false,
  loading: () => (
    <div className="flex items-center justify-center h-full">
      <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary" />
    </div>
  ),
});

export default function ClientQRWrapper() {
  return <AttendanceQRScanner />;
}
