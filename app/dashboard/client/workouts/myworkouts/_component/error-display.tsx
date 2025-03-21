'use client';

import { AlertTriangle } from 'lucide-react';

interface ErrorDisplayProps {
  errorMessage: string;
}

export const ErrorDisplay = ({ errorMessage }: ErrorDisplayProps) => {
  return (
    <div className="w-full">
      <div className="relative mb-6 rounded-2xl overflow-hidden">
        <div className="bg-gradient-to-r from-red-500 to-orange-600 p-6">
          <div className="flex items-center gap-3 mb-2">
            <div className="bg-white/20 p-2 rounded-full">
              <AlertTriangle className="w-5 h-5 text-white" />
            </div>
            <h2 className="text-2xl font-bold text-white">Error Loading Data</h2>
          </div>
          <p className="text-red-100">{errorMessage}</p>
        </div>
      </div>

      <div className="bg-white rounded-xl border border-gray-100 p-6">
        <div className="text-center">
          <p className="text-gray-600 mb-4">
            We encountered an error while trying to load your data. Please try again later.
          </p>
          <button
            type="button"
            onClick={() => window.location.reload()}
            className="inline-flex items-center px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
          >
            Try Again
          </button>
        </div>
      </div>
    </div>
  );
}; 