import { Search } from 'lucide-react';
import Image from 'next/image';
import NotificationBell from './NotificationBell';
import ProfileButton from './ProfileButton';
import QRCodeButton from './QRCodeButton';

interface FullTopBarProps {
  onNotificationClick: () => void;
  onQRCodeClick: () => void;
  onProfileClick: () => void;
}

export default function FullTopBar({
  onNotificationClick,
  onQRCodeClick,
  onProfileClick,
}: FullTopBarProps) {
  return (
    <div className="flex flex-col gap-4 py-2">
      {/* Top Row - Logo and Actions */}
      <div className="flex items-center justify-between h-12">
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2">
            <Image
              src="/apple-touch-icon.png"
              alt="GymNavigator Logo"
              width={32}
              height={32}
              className="object-contain"
            />
            <div className="flex flex-col">
              <h1 className="text-lg font-semibold text-gray-800">GymNavigator</h1>
              <p className="text-sm text-gray-500">Gym management</p>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center gap-2">
          <NotificationBell count={2} onClick={onNotificationClick} />
          <QRCodeButton onClick={onQRCodeClick} />
          <ProfileButton name="John Doe" onClick={onProfileClick} />
        </div>
      </div>

      {/* Search Bar */}
      <div className="relative max-w-2xl mx-auto w-full">
        <input
          type="text"
          placeholder="Workouts, diet and much more..."
          className="w-full h-12 pl-12 pr-4 rounded-lg bg-gray-50 border border-gray-200 
                   focus:outline-none focus:ring-1 focus:ring-blue-400 focus:border-blue-400
                   text-sm text-gray-800 placeholder:text-gray-500"
        />
        <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
      </div>
    </div>
  );
}
