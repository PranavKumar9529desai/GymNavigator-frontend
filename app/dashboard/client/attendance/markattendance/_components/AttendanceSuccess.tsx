'use client';
import { Button } from '@/components/ui/button';
import { ArrowLeft, CheckCircle, Clock } from 'lucide-react';
import { useRouter, useSearchParams } from 'next/navigation';
import { useEffect } from 'react';

export default function AttendanceSuccess() {
	const router = useRouter();
	const searchParams = useSearchParams();
	const scanTime = searchParams.get('scanTime');

	// Parse the ISO string to a Date object only if we have a scanTime
	const attendanceTime = scanTime ? new Date(scanTime) : null;

	// useEffect(() => {
	//   const timer = setTimeout(() => {
	//     router.replace("/dashboard/myprogress/month");
	//   }, 30000);

	//   return () => clearTimeout(timer);
	// }, [router]);

	return (
		<div className="mt-10 sm:mt-4 h-screen w-full sm:flex items-center justify-center bg-gradient-to-b from-green-50 to-white dark:from-green-900/20 dark:to-gray-900 p-4 sm:p-6">
			<div className="w-full max-w-sm animate-in fade-in slide-in-from-bottom-4 duration-700">
				<div className="text-center">
					<div className="mb-8">
						<div className="relative w-24 h-24 mx-auto">
							<div className="absolute inset-0 rounded-full bg-green-100 dark:bg-green-900/30 animate-pulse" />
							<CheckCircle className="relative w-full h-full text-green-500 dark:text-green-400 animate-in zoom-in duration-700 delay-300" />
						</div>
					</div>

					<h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-3">
						Attendance Marked!
					</h1>
					<p className="text-base text-gray-600 dark:text-gray-300 mb-6">
						Your attendance has been successfully recorded
					</p>

					{attendanceTime && (
						<div className="inline-flex items-center justify-center space-x-2 px-4 py-2 bg-gray-50 dark:bg-gray-800 rounded-full mb-8">
							<Clock className="w-5 h-5 text-gray-500" />
							<time
								dateTime={attendanceTime.toISOString()}
								className="text-base text-gray-600 dark:text-gray-300"
							>
								{attendanceTime.toLocaleTimeString('en-US', {
									hour: '2-digit',
									minute: '2-digit',
									hour12: true,
								})}
							</time>
						</div>
					)}

					<div className="space-y-3 px-4 sm:px-0">
						<Button
							onClick={() =>
								router.replace('/dashboard/client/attendance/viewattendance')
							}
							className="w-full h-12 text-base bg-green-500 hover:bg-green-600 text-white"
						>
							View Monthly Progress
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

					{/* <p className="text-sm text-gray-500 mt-6">
            Redirecting in 30 seconds...
          </p> */}
				</div>
			</div>
		</div>
	);
}
