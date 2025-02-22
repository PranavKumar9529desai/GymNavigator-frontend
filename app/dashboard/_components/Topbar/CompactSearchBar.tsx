import { cn } from '@/lib/utils';
import { Search } from 'lucide-react';
import NotificationBell from './NotificationBell';
import ProfileButton from './ProfileButton';
import QRCodeButton from './QRCodeButton';

interface CompactSearchBarProps {
  isCompact: boolean;
  onNotificationClick: () => void;
  onQRCodeClick: () => void;
  onProfileClick: () => void;
}

export default function CompactSearchBar({
  isCompact,
  onNotificationClick,
  onQRCodeClick,
  onProfileClick,
}: CompactSearchBarProps) {
  return (
    <div
      className={cn(
        'absolute inset-0 transition-all duration-300',
        'flex items-center justify-between px-4',
        !isCompact && 'opacity-0 pointer-events-none',
      )}
    >
      <div className="relative w-96">
        <input
          type="text"
          placeholder="Workouts, diet and much more..."
          className="w-full h-10 pl-10 pr-4 rounded-lg bg-gray-50/80 border border-gray-200 
                   focus:outline-none focus:ring-1 focus:ring-blue-400 focus:border-blue-400
                   text-sm text-gray-800 placeholder:text-gray-400"
        />
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
      </div>

      <div className="flex items-center gap-2">
        <NotificationBell count={2} onClick={onNotificationClick} />
        <QRCodeButton onClick={onQRCodeClick} />
        <ProfileButton name="John Doe" onClick={onProfileClick} />
      </div>
    </div>
  );
}
