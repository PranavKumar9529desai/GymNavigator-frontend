'use client';

import { Button } from '@/components/ui/button';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { AlertTriangle, ArrowLeft, RefreshCw } from 'lucide-react';

interface ErrorStateProps {
  errorMessage: string;
  gymName: string | null;
  gymId: string | null;
  hash: string | null;
}

export function ErrorState({ errorMessage, gymName, gymId, hash: _hash }: ErrorStateProps) {
  const handleRetry = () => {
    window.location.reload();
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-br from-blue-50/30 via-white to-indigo-50/20">
      <div className="text-center max-w-md mx-auto p-6">
        <div className="w-16 h-16 bg-blue-50 rounded-full flex items-center justify-center mx-auto mb-4">
          <AlertTriangle className="w-8 h-8 text-blue-600" />
        </div>
        
        <h2 className="text-lg font-semibold text-slate-800 mb-2">
          Something went wrong
        </h2>
        
        <Alert variant="destructive" className="mb-6">
          <AlertTriangle className="h-4 w-4" />
          <AlertDescription>{errorMessage}</AlertDescription>
        </Alert>
        
        <div className="space-y-3">
          <Button onClick={handleRetry} className="w-full bg-gradient-to-r from-blue-400 to-indigo-400 hover:from-blue-500 hover:to-indigo-500">
            <RefreshCw className="w-4 h-4 mr-2" />
            Try Again
          </Button>
          
          <Button variant="outline" onClick={() => window.history.back()} className="w-full border-slate-200 text-slate-700 hover:bg-slate-50">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Go Back
          </Button>
        </div>
        
        {gymName && (
          <div className="mt-6 p-4 bg-slate-50 rounded-lg border border-slate-200">
            <p className="text-sm text-slate-600">
              <strong>Gym:</strong> {gymName}
            </p>
            <p className="text-sm text-slate-600">
              <strong>Gym ID:</strong> {gymId}
            </p>
          </div>
        )}
      </div>
    </div>
  );
} 