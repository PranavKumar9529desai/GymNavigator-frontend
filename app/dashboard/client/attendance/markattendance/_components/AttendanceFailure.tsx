'use client';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { ArrowLeft, RefreshCcw, XCircle } from 'lucide-react';
import { useRouter } from 'next/navigation';

export default function AttendanceFailure() {
  const router = useRouter();

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-gradient-to-b from-red-50 to-white dark:from-red-900/20 dark:to-gray-900 p-4 sm:p-6">
      <div className="w-full max-w-sm animate-in fade-in slide-in-from-bottom-4 duration-700">
        <div className="text-center">
          <div className="mb-8">
            <div className="relative w-24 h-24 mx-auto">
              <Skeleton className="absolute inset-0 rounded-full bg-red-100 dark:bg-red-900/30" />
              <XCircle className="relative w-full h-full text-red-500 dark:text-red-400 animate-in zoom-in duration-700 delay-300" />
            </div>
          </div>

          <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-3">
            Attendance Failed
          </h1>
          <p className="text-base text-gray-600 dark:text-gray-300 mb-8">
            Unable to mark your attendance. Please try again.
          </p>

          <div className="space-y-3 px-4 sm:px-0">
            <Button
              onClick={() => router.replace('/dashboard/client/attendance/markattendance')}
              className="w-full h-12 text-base bg-red-500 hover:bg-red-600 text-white"
            >
              <RefreshCcw className="w-5 h-5 mr-2" />
              Try Again
            </Button>
            <Button
              variant="outline"
              onClick={() => router.replace('/dashboard')}
              className="w-full h-12 text-base"
            >
              <ArrowLeft className="w-5 h-5 mr-2" />
              Back to Dashboard
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
