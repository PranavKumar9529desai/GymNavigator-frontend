import { cn } from '@/lib/utils';
import Image from 'next/image';

interface ProfileButtonProps {
  imageUrl?: string;
  name: string;
  onClick?: () => void;
}

export default function ProfileButton({ imageUrl, name, onClick }: ProfileButtonProps) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="flex items-center justify-center w-8 h-8 rounded-full overflow-hidden hover:ring-2 hover:ring-gray-200 transition-all"
    >
      {imageUrl ? (
        <Image
          src={imageUrl}
          alt={`${name}'s profile`}
          width={32}
          height={32}
          className="object-cover"
        />
      ) : (
        <div className="w-full h-full bg-blue-500 text-white flex items-center justify-center text-sm font-medium">
          {name.charAt(0).toUpperCase()}
        </div>
      )}
    </button>
  );
}
