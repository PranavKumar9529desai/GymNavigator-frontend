"use client";

import AttendanceFailure from "@/components/Attendance/AttendanceFailure";
import AttendanceSuccess from "@/components/Attendance/AttendanceSuccess";
import { notFound } from "next/navigation";
import { Suspense, useEffect, useState } from "react";
import { checkUserAttendance } from "../_actions/CheckUserAttendance";
import AttendanceQRScanner from "./QRScanner";
import MarkAttendanceLoading from "../loading";

interface AttendanceState {
  isMarked: boolean;
  attendance?: {
    id: number;
    userId: number;
    validPeriodId: number;
    date: string;
    scanTime: string;
    attended: boolean;
  };
}

export default function AttendanceContent() {
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [attendanceData, setAttendanceData] = useState<AttendanceState | null>(null);

  useEffect(() => {
    async function checkAttendance() {
      try {
        setIsLoading(true);
        const result = await checkUserAttendance();
        
        if (!result.success) {
          throw new Error(result.error || "Failed to check attendance");
        }

        setAttendanceData(result.data || null);
        setError(null);
      } catch (err) {
        const errorMessage = err instanceof Error ? err.message : "Unknown error";
        console.error("Error in MarkAttendancePage:", errorMessage);
        setError(errorMessage);
      } finally {
        setIsLoading(false);
      }
    }

    checkAttendance();

    // Refresh attendance check every 30 seconds
    const intervalId = setInterval(checkAttendance, 30000);
    return () => clearInterval(intervalId);
  }, []);

  if (isLoading) {
    return <MarkAttendanceLoading />;
  }

  if (error) {
    if (error.includes("not found")) {
      notFound();
    }
    return <AttendanceFailure />;
  }

  if (attendanceData?.isMarked) {
    return <AttendanceSuccess />;
  }

  return (
    <main className="min-h-[calc(100vh-4rem)] bg-gray-50 dark:bg-gray-900">
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold text-center mb-8 text-gray-900 dark:text-gray-100">
          Mark Your Attendance
        </h1>
        <Suspense fallback={<MarkAttendanceLoading />}>
          <AttendanceQRScanner />
        </Suspense>
      </div>
    </main>
  );
}
