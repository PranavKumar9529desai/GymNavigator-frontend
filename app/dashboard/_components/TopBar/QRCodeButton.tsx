"use client";

import { QrCode } from "lucide-react";
import { useRouter } from "next/navigation";
import { type FC } from "react";

interface QRCodeButtonProps {
  userRole?: string;
}

const QRCodeButton: FC<QRCodeButtonProps> = ({ userRole }) => {
  const router = useRouter();

  const handleClick = () => {
    if (userRole === "client") {
      router.push("/dashboard/client/attendance/markattendance");
    }
  };

  return (
    <button
      type="button"
      onClick={handleClick}
      className="p-2 rounded-full hover:bg-gray-100 transition flex items-center justify-center"
      aria-label="QR Code"
    >
      <QrCode className="h-5 w-5" />
    </button>
  );
};

export default QRCodeButton;
