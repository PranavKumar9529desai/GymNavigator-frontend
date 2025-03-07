'use client';

import { useEffect } from 'react';
import { Button } from '@/components/ui/button';

// biome-ignore lint/suspicious/noShadowRestrictedNames: <explanation>
export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    // Log the error to an error reporting service
    console.error('Attendance page error:', error);
  }, [error]);

  return (
    <div className="flex flex-col items-center justify-center min-h-[calc(100vh-4rem)]">
      <div className="max-w-md w-full p-6 bg-white dark:bg-gray-800 rounded-lg shadow-lg">
        <h2 className="text-2xl font-bold text-red-600 dark:text-red-400 mb-4 text-center">
          Something went wrong
        </h2>
        <p className="text-gray-600 dark:text-gray-300 mb-6 text-center">
          {error.message || 'An error occurred while loading the attendance page'}
        </p>
        <div className="flex justify-center gap-4">
          <Button
            onClick={reset}
            variant="default"
            className="bg-blue-600 hover:bg-blue-700 text-white"
          >
            Try again
          </Button>
        </div>
      </div>
    </div>
  );
} 