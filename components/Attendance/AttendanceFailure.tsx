import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { m } from "framer-motion";
import { ArrowLeft, RefreshCcw, XCircle } from "lucide-react";
import { useEffect } from "react";
import { useRouter } from "next/navigation";

export default function AttendanceFailure() {
  const router = useRouter();

  useEffect(() => {
    // Auto redirect after 30 seconds
    const timer = setTimeout(() => {
      router.replace("/dashboard");
    }, 30000);

    return () => clearTimeout(timer);
  }, [router]);

  return (
    <div className="min-h-[100dvh] flex items-center justify-center p-4 bg-gradient-to-b from-red-50 to-white dark:from-red-900/20 dark:to-gray-900">
      <Card className="w-full max-w-md bg-white/80 dark:bg-gray-900/80 backdrop-blur-sm shadow-lg">
        <m.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.3 }}
          className="p-6 text-center"
        >
          <m.div
            initial={{ scale: 0.8 }}
            animate={{ scale: 1 }}
            transition={{ type: "spring", duration: 0.4 }}
            className="mb-6"
          >
            <div className="relative w-20 h-20 mx-auto">
              <div className="absolute inset-0 rounded-full bg-red-100 dark:bg-red-900/30 animate-pulse" />
              <XCircle className="relative w-full h-full text-red-500 dark:text-red-400" />
            </div>
          </m.div>

          <h1 className="text-xl font-bold text-gray-900 dark:text-gray-100 mb-2">
            Attendance Failed
          </h1>
          <p className="text-sm text-gray-600 dark:text-gray-300 mb-6">
            Unable to mark your attendance. Please try again.
          </p>

          <div className="space-y-2">
            <Button
              onClick={() => router.replace("/dashboard/attendance/qrscanner")}
              className="w-full bg-red-500 hover:bg-red-600 text-white"
            >
              <RefreshCcw className="w-4 h-4 mr-2" />
              Try Again
            </Button>
            <Button
              variant="outline"
              onClick={() => router.replace("/dashboard")}
              className="w-full"
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Dashboard
            </Button>
          </div>

          <p className="text-xs text-gray-500 mt-4">
            Redirecting to dashboard in 30 seconds...
          </p>
        </m.div>
      </Card>
    </div>
  );
}
