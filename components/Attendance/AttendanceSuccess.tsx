import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { m } from "framer-motion";
import { ArrowLeft, CheckCircle, Clock } from "lucide-react";
import { useEffect } from "react";
import { useRouter } from "next/navigation";

export default function AttendanceSuccess() {
  const router = useRouter();
  const currentDate = new Date();

  useEffect(() => {
    // Trigger confetti effect
    // confetti({
    //   particleCount: 100,
    //   spread: 70,
    //   origin: { y: 0.6 },
    // });

    // Auto redirect after 3 seconds
    const timer = setTimeout(() => {
      router.replace("/dashboard/myprogress/month");
    }, 30000);

    return () => clearTimeout(timer);
  }, [router]);

  return (
    <div className="min-h-[100dvh] flex items-center justify-center p-4 bg-gradient-to-b from-green-50 to-white dark:from-green-900/20 dark:to-gray-900">
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
              <div className="absolute inset-0 rounded-full bg-green-100 dark:bg-green-900/30 animate-pulse" />
              <CheckCircle className="relative w-full h-full text-green-500 dark:text-green-400" />
            </div>
          </m.div>

          <h1 className="text-xl font-bold text-gray-900 dark:text-gray-100 mb-2">
            Attendance Marked!
          </h1>
          <p className="text-sm text-gray-600 dark:text-gray-300 mb-4">
            Your attendance has been successfully recorded
          </p>

          <div className="inline-flex items-center justify-center space-x-2 px-3 py-1.5 bg-gray-50 dark:bg-gray-800 rounded-full mb-6">
            <Clock className="w-4 h-4 text-gray-500" />
            <span className="text-sm text-gray-600 dark:text-gray-300">
              {currentDate.toLocaleTimeString("en-US", {
                hour: "2-digit",
                minute: "2-digit",
                hour12: true,
              })}
            </span>
          </div>

          <div className="space-y-2">
            <Button
              onClick={() => router.replace("/dashboard/myprogress/month")}
              className="w-full bg-green-500 hover:bg-green-600 text-white"
            >
              View Monthly Progress
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
            Redirecting in 30 seconds...
          </p>
        </m.div>
      </Card>
    </div>
  );
}
