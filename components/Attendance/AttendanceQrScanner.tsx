"use client";

import { Alert, AlertDescription } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import type { CustomToasterProps } from "@/types/toaster";
import { Scanner } from "@yudiel/react-qr-scanner";
import type { Result } from "@yudiel/react-qr-scanner";
import { AlertCircle, QrCode } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { toast } from "sonner";

interface QrValueType {
  AttendanceAction: {
    gymname: string;
    gymid: number;
    timestamp: string;
  };
}

const toastConfig: Partial<CustomToasterProps> = {
  position: "top-center",
  closeButton: true,
  richColors: true,
};

export default function AttendanceQRScanner() {
  const router = useRouter();
  const [error, setError] = useState<string | null>(null);
  const [isScanning, setIsScanning] = useState(true);

  async function handleAttendanceAction(data: QrValueType) {
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
        // Show loading message
        toast.loading("Marking attendance...", {
          description: "Please wait while we process your attendance",
        });

        const response = await fetch("/api/attendance/mark", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(data.AttendanceAction),
        });

        if (!response.ok) throw new Error("Failed to mark attendance");

        toast.success("Attendance marked successfully!", {
          description: `Marked attendance for ${data.AttendanceAction.gymname}`
        });
        router.push("/dashboard/attendance/success");
      } else {
        throw new Error("QR code has expired");
      }
    } catch (error) {
      console.error("Error marking attendance:", error);
      setError(
        error instanceof Error ? error.message : "Failed to mark attendance"
      );
      toast.error("Failed to mark attendance", {
        description: error instanceof Error ? error.message : "An unknown error occurred"
      });
    }
  }

  const handleRetry = () => {
    setError(null);
    setIsScanning(true);
  };

  return (
    <Card className="w-full max-w-sm mx-auto bg-white rounded-xl shadow-lg overflow-hidden">
      <CardHeader className="bg-primary text-primary-foreground space-y-1 p-6">
        <CardTitle className="text-xl font-semibold text-center flex items-center justify-center gap-2">
          <QrCode className="w-6 h-6" />
          <span>Scan Attendance QR</span>
        </CardTitle>
        <p className="text-sm text-center opacity-90">
          Position the QR code within the frame
        </p>
      </CardHeader>

      <CardContent className="p-6">
        {error ? (
          <Alert variant="destructive" className="mb-4">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        ) : null}

        <div className="relative aspect-square w-full max-w-xs mx-auto">
          {isScanning && (
            <>
              <div className="absolute inset-0 z-10 border-[3px] border-primary rounded-lg">
                <div className="absolute top-0 left-0 w-4 h-4 border-t-4 border-l-4 border-primary rounded-tl-lg" />
                <div className="absolute top-0 right-0 w-4 h-4 border-t-4 border-r-4 border-primary rounded-tr-lg" />
                <div className="absolute bottom-0 left-0 w-4 h-4 border-b-4 border-l-4 border-primary rounded-bl-lg" />
                <div className="absolute bottom-0 right-0 w-4 h-4 border-b-4 border-r-4 border-primary rounded-br-lg" />
              </div>
              <Scanner
                onScan={(detectedCodes: IDetectedBarcode[]) => {
                  const code = detectedCodes[0];
                  if (code?.rawValue) {
                    try {
                      const parsedData: QrValueType = JSON.parse(code.rawValue);
                      if (parsedData.AttendanceAction) {
                        handleAttendanceAction(parsedData);
                      }
                    } catch (error) {
                      setError("Invalid QR code format");
                    }
                  }
                }}
                onError={(error: unknown) => {
                  console.error("Scanner error:", error);
                  setError("Failed to access camera");
                }}
                styles={{
                  video: {
                    borderRadius: "0.5rem",
                    width: "100%",
                    height: "100%",
                  },
                }}
              />
            </>
          )}
        </div>

        {error && (
          <Button
            onClick={handleRetry}
            variant="secondary"
            className="w-full mt-4"
          >
            Try Again
          </Button>
        )}
      </CardContent>

      <CardFooter className="bg-muted/10 p-4">
        <p className="text-sm text-muted-foreground w-full text-center">
          Powered by GymNavigator
        </p>
      </CardFooter>
    </Card>
  );
}
