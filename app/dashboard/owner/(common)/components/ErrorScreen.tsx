'use client';
import { Card } from '@/components/ui/card';
import { ArrowRight, Building2 } from 'lucide-react';

interface ErrorScreenProps {
  error?: string;
}

export default function ErrorScreen({ error }: ErrorScreenProps) {
  return (
    <div className="min-h-[80vh] flex items-center justify-center p-4">
      <Card className="max-w-md w-full p-8 text-center space-y-4">
        <div className="mx-auto w-16 h-16 bg-red-50 rounded-full flex items-center justify-center">
          <Building2 className="w-8 h-8 text-red-500" />
        </div>

        <h2 className="text-xl font-semibold text-gray-800">Unable to Load Dashboard</h2>
        <p className="text-gray-600">
          {error || 'There was an error loading your dashboard data. Please try again later.'}
        </p>

        <button
          onClick={() => window.location.reload()}
          className="inline-flex items-center gap-2 px-4 py-2 text-sm text-blue-600 hover:text-blue-700"
          type="button"
        >
          <span>Refresh Page</span>
          <ArrowRight className="w-4 h-4" />
        </button>
      </Card>
    </div>
  );
}
