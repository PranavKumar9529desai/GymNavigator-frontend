import { Suspense } from "react";
import MarkAttendanceLoading from "./loading";
import AttendanceContent from "./_components/AttendanceContent";

// This remains a server component
export default function MarkAttendancePage() {
  return (
    <Suspense fallback={<MarkAttendanceLoading />}>
      <AttendanceContent />
    </Suspense>
  );
}
