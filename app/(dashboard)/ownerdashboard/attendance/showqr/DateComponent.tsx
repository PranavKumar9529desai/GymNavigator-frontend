'use client';
import React from 'react';
import { useState } from 'react';
export default function DateComponent() {
  const [currentDate] = useState(
    new Date().toLocaleDateString('en-GB', {
      day: '2-digit',
      month: 'short',
      year: 'numeric',
    })
  );

  return (
    <>
      <div className="text-xl font-semibold text-primary bg-primary-foreground px-4 py-2 rounded-full">
        {currentDate}
      </div>
    </>
  );
}
