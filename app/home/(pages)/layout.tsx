import Navbar from '@/app/(home)/_sections/Navbar/Navbar';
import type React from 'react';
export default function PagesLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <main className="bg-gradient-to-b from-gray-950 via-gray-900 to-black text-white min-h-screen overflow-hidden">
      <Navbar />
      {children}
    </main>
  );
}
