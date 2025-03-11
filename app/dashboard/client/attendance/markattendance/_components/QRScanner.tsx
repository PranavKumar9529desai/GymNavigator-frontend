"use client";
import { Skeleton } from "@/components/ui/skeleton";
import { QueryClient, useMutation, useQuery } from "@tanstack/react-query";
import {
  Html5QrcodeScanType,
  Html5QrcodeScanner,
  Html5QrcodeSupportedFormats,
} from "html5-qrcode";
import { CheckCircle2, QrCode } from "lucide-react";
import { useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { toast } from "sonner";
import { markAttendance } from "../_actions/mark-attendance";
import { checkUserAttendance } from "../_actions/check-attedance";

interface QrValueType {
  AttendanceAction: {
    gymname: string;
    gymid: number;
    timestamp: number;
  };
}

export default function AttendanceQRScanner() {
  const router = useRouter();
  const queryClient = new QueryClient();
  const [isScanning, setIsScanning] = useState(true);
  const scannerRef = useRef<Html5QrcodeScanner | null>(null);

  // Prefetch attendance status
  const { data: attendanceStatus, isLoading: isCheckingAttendance } = useQuery({
    queryKey: ["attendance-status"],
    queryFn: async () => {
      const result = await checkUserAttendance();
      if (!result.success) {
        throw new Error(result.error || "Failed to check attendance");
      }
      return result.data;
    },
  });

  // If attendance is already marked, redirect to success page
  useEffect(() => {
    if (attendanceStatus?.isMarked) {
      router.replace("/dashboard/client/attendance/success");
    }
  }, [attendanceStatus, router]);

  const markAttendanceMutation = useMutation({
    mutationFn: async () => {
      return await markAttendance();
    },
    onSuccess: (response) => {
      toast.dismiss();
      toast.success("Attendance marked successfully!");
      queryClient.invalidateQueries({ queryKey: ["attendanceDays"] });
      router.refresh();
    },
    onError: (error) => {
      toast.dismiss();
      console.error("Error marking attendance:", error);
      toast.error("Failed to mark attendance", {
        description:
          error instanceof Error ? error.message : "Unknown error occurred",
      });
      router.push("/dashboard/client/attendance/failure");
    },
  });

  useEffect(() => {
    if (typeof window !== "undefined" && isScanning && !isCheckingAttendance) {
      scannerRef.current = new Html5QrcodeScanner(
        "qr-reader",
        {
          fps: 10,
          qrbox: { width: 300, height: 300 },
          aspectRatio: 1.0,
          supportedScanTypes: [Html5QrcodeScanType.SCAN_TYPE_CAMERA],
          rememberLastUsedCamera: true,
          showTorchButtonIfSupported: false,
          formatsToSupport: [Html5QrcodeSupportedFormats.QR_CODE],
          videoConstraints: {
            facingMode: "environment",
          },
        },
        /* verbose= */ false
      );

      scannerRef.current.render(
        async (decodedText: string) => {
          try {
            setIsScanning(false);
            const parsedData: QrValueType = JSON.parse(decodedText);
            const now = new Date();
            const currentUTC = Date.UTC(
              now.getUTCFullYear(),
              now.getUTCMonth(),
              now.getUTCDate(),
              now.getUTCHours()
            );

            const scannedTime = new Date(parsedData.AttendanceAction.timestamp);
            const scannedUTC = Date.UTC(
              scannedTime.getUTCFullYear(),
              scannedTime.getUTCMonth(),
              scannedTime.getUTCDate(),
              scannedTime.getUTCHours()
            );

            const toleranceInHours = 1;
            const timeDiff =
              Math.abs(currentUTC - scannedUTC) / (1000 * 60 * 60);

            if (timeDiff <= toleranceInHours) {
              toast.loading("Marking attendance...");
              await markAttendanceMutation.mutateAsync();
              if (scannerRef.current) {
                scannerRef.current.clear();
              }
            } else {
              throw new Error("QR code has expired");
            }
          } catch (error) {
            console.error("Error processing QR code:", error);
            toast.error("Failed to process QR code", {
              description:
                error instanceof Error
                  ? error.message
                  : "Unknown error occurred",
            });
            setIsScanning(true);
          }
        },
        (error: string) => {
          if (!error.includes("NotFoundException")) {
            console.error("QR scan error:", error);
          }
        }
      );
    }

    return () => {
      if (scannerRef.current) {
        scannerRef.current.clear();
      }
    };
  }, [isScanning, markAttendanceMutation, isCheckingAttendance]);

  if (isCheckingAttendance) {
    return (
      <div className="flex items-center justify-center bg-background/95 backdrop-blur-sm p-4">
        <div className="w-full max-w-sm mx-auto">
          <div className="space-y-4">
            <div className="flex items-center justify-center space-x-2 mb-4">
              <Skeleton className="w-6 h-6 rounded" />
              <Skeleton className="h-6 w-32" />
            </div>
            <div className="relative rounded-lg overflow-hidden bg-white dark:bg-gray-900">
              <div className="aspect-square w-full max-w-xs mx-auto">
                <Skeleton className="h-full w-full" />
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex items-center justify-center bg-background/95 backdrop-blur-sm p-4">
      <div className="w-full max-w-sm mx-auto">
        <div className="space-y-4">
          <div className="flex items-center justify-center space-x-2 mb-4">
            <QrCode className="w-6 h-6 text-primary" />
            <h2 className="text-xl font-semibold">Scan QR Code</h2>
          </div>

          <div className="relative rounded-lg overflow-hidden bg-white dark:bg-gray-900">
            {isScanning && !markAttendanceMutation.isPending && (
              <div id="qr-reader" className="mx-auto" />
            )}

            {markAttendanceMutation.isPending && (
              <div className="flex flex-col items-center justify-center p-8 space-y-4">
                <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin" />
                <p className="text-sm text-muted-foreground">
                  Processing your attendance...
                </p>
              </div>
            )}

            {!isScanning && markAttendanceMutation.isSuccess && (
              <div className="flex items-center justify-center space-x-2 p-8">
                <CheckCircle2 className="w-8 h-8 text-green-500" />
                <p className="text-base font-medium">Attendance Marked!</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
