import AttendanceFailure from "@/app/dashboard/client/attendance/markattendance/_components/AttendanceFailure";
import AttendanceSuccess from "@/app/dashboard/client/attendance/markattendance/_components/AttendanceSuccess";
import { notFound } from "next/navigation";
import { Suspense } from "react";
import { checkUserAttendance } from "./_actions/CheckUserAttendance";
import ClientQRWrapper from "./_components/ClientQRWrapper";
import MarkAttendanceLoading from "./loading";

export default async function MarkAttendancePage() {
  const result = await checkUserAttendance();

  if (!result.success) {
    if (result.error?.includes("not found")) {
      notFound();
    }
    return <AttendanceFailure />;
  }

  if (result.data?.isMarked) {
    return <AttendanceSuccess />;
  }

  return (
    <main className="min-h-[calc(100vh-4rem)] bg-gray-50 dark:bg-gray-900">
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold text-center mb-8 text-gray-900 dark:text-gray-100">
          Mark Your Attendance
        </h1>
        <Suspense fallback={<MarkAttendanceLoading />}>
          <ClientQRWrapper />
        </Suspense>
      </div>
    </main>
  );
}
