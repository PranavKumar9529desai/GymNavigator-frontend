'use client';
import { signOut } from '@/node_modules/next-auth/react';
import { m } from 'framer-motion';
import React, { useState } from 'react';

export default function Signout() {
  const [isSigningOut, setIsSigningOut] = useState(false);
  const [countdown, setCountdown] = useState(3);

  const handleSignOut = async () => {
    setIsSigningOut(true);

    // Start countdown
    const timer = setInterval(() => {
      setCountdown((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          signOut({ callbackUrl: '/signin' });
        }
        return prev - 1;
      });
    }, 1000);
  };

  return (
    <div className="text-center space-y-6">
      <m.div
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 0.5 }}
        className="space-y-4"
      >
        <h1 className="text-3xl font-bold text-gray-800">
          {isSigningOut ? 'Signing you out...' : 'Are you sure you want to sign out?'}
        </h1>
        <p className="text-gray-600 max-w-md mx-auto">
          {isSigningOut
            ? `Redirecting in ${countdown} seconds...`
            : 'You will need to sign in again to access your account.'}
        </p>
      </m.div>

      {!isSigningOut && (
        <m.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.2, duration: 0.5 }}
        >
          <button
            type="button"
            onClick={handleSignOut}
            className="px-8 py-3 bg-red-600 text-white rounded-lg font-semibold
                     hover:bg-red-700 transition-colors duration-200
                     focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2"
          >
            Sign Out
          </button>
        </m.div>
      )}

      {isSigningOut && (
        <m.div
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          className="flex justify-center"
        >
          <div className="w-12 h-12 border-4 border-red-600 border-t-transparent rounded-full animate-spin" />
        </m.div>
      )}
    </div>
  );
}
