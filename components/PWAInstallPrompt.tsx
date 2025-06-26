"use client"
import React, { useEffect, useState } from 'react';
import Image from 'next/image';

const PWAInstallPrompt: React.FC = () => {
  const [deferredPrompt, setDeferredPrompt] = useState<Event | null>(null);
  const [showPrompt, setShowPrompt] = useState(false);

  useEffect(() => {
    const handler = (e: Event) => {
      e.preventDefault();
      setDeferredPrompt(e);
      setShowPrompt(true);
    };
    window.addEventListener('beforeinstallprompt', handler);
    return () => {
      window.removeEventListener('beforeinstallprompt', handler);
    };
  }, []);

  const handleInstallClick = async () => {
    if (!deferredPrompt) return;
    // @ts-ignore
    deferredPrompt.prompt();
    // @ts-ignore
    const { outcome } = await deferredPrompt.userChoice;
    if (outcome === 'accepted') {
      setShowPrompt(false);
      setDeferredPrompt(null);
    }
  };

  if (!showPrompt) return null;

  return (
    <div className="fixed top-6 left-0 right-0 flex justify-center z-[1000]">
      <div className="bg-gradient-to-r from-[#2ec4f1] to-[#a259c6] rounded-2xl px-5 py-2 flex items-center gap-3 min-w-0 border-none shadow-lg animate-fade-in">
        <div className="bg-white rounded-full w-10 h-10 flex items-center justify-center">
          <Image src="/apple-touch-icon.png" alt="GymNavigator Icon" width={32} height={32} className="rounded-full" />
        </div>
        <span className="text-white font-semibold text-base whitespace-nowrap">
          Install GymNavigator
        </span>
        <button
          onClick={handleInstallClick}
          className="bg-white text-[#2563eb] rounded-lg px-4 py-1 font-semibold text-sm cursor-pointer ml-2 shadow"
        >
          Install
        </button>
      </div>
    </div>
  );
};

export default PWAInstallPrompt; 