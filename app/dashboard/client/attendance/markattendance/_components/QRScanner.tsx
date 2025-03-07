"use client";

import { Card } from "@/components/ui/card";
import { Scanner, type Result } from "@yudiel/react-qr-scanner";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { toast } from "sonner";

interface QrValueType {
  AttendanceAction: {
    gymname: string;
    gymid: number;
    timestamp: number;
  };
}

export default function AttendanceQRScanner() {
  const router = useRouter();
  const [isScanning, setIsScanning] = useState(true);

  async function handleQRScan(data: QrValueType) {
    try {
      setIsScanning(false);
      const now = new Date();
      const currentUTC = Date.UTC(
        now.getUTCFullYear(),
        now.getUTCMonth(),
        now.getUTCDate(),
        now.getUTCHours()
      );

      const scannedTime = new Date(data.AttendanceAction.timestamp);
      const scannedUTC = Date.UTC(
        scannedTime.getUTCFullYear(),
        scannedTime.getUTCMonth(),
        scannedTime.getUTCDate(),
        scannedTime.getUTCHours()
      );

      const toleranceInHours = 1;
      const timeDiff = Math.abs(currentUTC - scannedUTC) / (1000 * 60 * 60);

      if (timeDiff <= toleranceInHours) {
        toast.loading("Marking attendance...");
        
        // if (markAttendanceMutation.isSuccess) {
        //   toast.success("Attendance marked successfully!");
        //   setTimeout(() => {
        //     router.push("/dashboard/client/attendance/success");
        //   }, 1000);
        // }
      } else {
        throw new Error("QR code has expired");
      }
    } catch (error) {
      console.error("Error processing QR code:", error);
      toast.error("Failed to process QR code", {
        description:
          error instanceof Error ? error.message : "Unknown error occurred",
      });
      setTimeout(() => {
        router.push("/dashboard/client/attendance/failure");
      }, 1000);
    }
  }

  return (
    <Card className="w-full max-w-sm mx-auto bg-white/80 dark:bg-gray-900/80 backdrop-blur-lg shadow-xl overflow-hidden">
      <div className="p-6">
        <h2 className="text-xl font-semibold text-center mb-4">Scan QR Code</h2>
        <div className="aspect-square w-full">
          {isScanning && (
            <Scanner
              onResult={(result: Result) =>
                handleQRScan(JSON.parse(result.getText()))
              }
              onError={(error: Error) => console.error("QR scan error:", error)}
            />
          )}
        </div>
      </div>
    </Card>
  );
}
