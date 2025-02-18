'use client';
import { useSession } from '@/node_modules/next-auth/react';
import { ArrowRight, Loader2 } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useState } from 'react';

type CustomButtonProps = {
  className?: string;
  text?: string;
};

export default function CustomButton({ className = '', text = 'Get Started' }: CustomButtonProps) {
  const router = useRouter();
  const { data: session, status } = useSession();
  const [isLoading, setIsLoading] = useState(false);

  const handleClick = async () => {
    setIsLoading(true);

    console.log('session from the custom button', session);
    if (status === 'authenticated' && session?.role) {
      router.push(`/dashboard/${session.role}`);
    } else {
      router.push('/signin');
    }
  };
  return (
    <button
      type="button"
      className={`flex items-center justify-center gap-2 bg-gradient-to-r from-blue-500 to-blue-700 text-white font-bold py-2 px-6 rounded-full transition-all duration-300 hover:shadow-lg hover:shadow-blue-500/30 ${className}`}
      onClick={handleClick}
      disabled={isLoading}
    >
      {isLoading ? (
        <Loader2 className="h-5 w-5 animate-spin" />
      ) : (
        <>
          {text}
          <ArrowRight className="h-5 w-5" />
        </>
      )}
    </button>
  );
}
