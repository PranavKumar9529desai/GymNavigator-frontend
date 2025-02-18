import type React from 'react';

export default function AttendanceLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <div className="container mx-auto px-4">{children}</div>;
}
