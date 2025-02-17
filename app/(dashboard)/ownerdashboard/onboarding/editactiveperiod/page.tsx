'use client';
import { Suspense } from 'react';
import EditActivePeriodWrapper from './EditActivePeriodWrapper';

export default function Page() {
  return (
    <div className="container flex justify-center lg:h-screen py-10">
      <Suspense fallback={<div>Loading...</div>}>
        <EditActivePeriodWrapper />
      </Suspense>
    </div>
  );
}
