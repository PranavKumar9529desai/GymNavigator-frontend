import { cn } from '@/lib/utils';
import { QrCode } from 'lucide-react';

interface QRCodeButtonProps {
  onClick?: () => void;
}

export default function QRCodeButton({ onClick }: QRCodeButtonProps) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="p-2 rounded-full hover:bg-gray-100 transition-colors"
    >
      <QrCode className="w-5 h-5 text-gray-600" />
    </button>
  );
}
