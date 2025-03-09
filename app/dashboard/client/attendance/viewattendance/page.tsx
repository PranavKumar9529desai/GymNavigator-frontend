import type { Metadata } from "next";
import { Suspense } from "react";
import {
  fetchAttendanceData,
} from "./_actions/GetAttendandedDays";
import CalendarSkeleton from "./_components/CalendarSkeleton";
import MonthAttendance from "./_components/MonthAttendance";

export const metadata: Metadata = {
  title: "Attendance History | GymNavigator",
  description:
    "View and track your gym attendance history with detailed calendar view and progress statistics.",
};

export default async function ViewAttendancePage() {
  // Fetch data on the server
  const attendanceDates = await fetchAttendanceData();

  // Convert Date objects to ISO strings for serialization
  const serializedDates = attendanceDates.map((date) => date.toISOString());

  return (
    <main className="py-4">
      {/* <header className="mb-8">
        <h1 className="text-3xl font-bold bg-gradient-to-r from-gray-900 to-gray-600 dark:from-gray-100 dark:to-gray-400 bg-clip-text text-transparent text-center">
          Gym Attendance
        </h1>
      </header> */}

      <section className="">
        <Suspense fallback={<CalendarSkeleton />}>
          <MonthAttendance initialAttendanceDates={serializedDates} />
        </Suspense>
      </section>
    </main>
  );
}
