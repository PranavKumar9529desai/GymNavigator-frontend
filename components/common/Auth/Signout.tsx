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
    <div className="w-full max-w-md mx-auto backdrop-blur-md p-8 rounded-xl border border-blue-500/20 shadow-xl text-center space-y-8">
      <m.div
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 0.5 }}
        className="space-y-4"
      >
        <h1 className="text-3xl font-bold text-white">
          {isSigningOut ? 'Signing you out...' : 'Are you sure you want to sign out?'}
        </h1>
        <p className="text-gray-300 max-w-md mx-auto">
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
            className="px-8 py-3 bg-gradient-to-r from-red-500 to-red-600 text-white rounded-lg font-semibold
                     hover:from-red-600 hover:to-red-700 transition-colors duration-200
                     focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2 focus:ring-offset-blue-900"
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
          <div className="w-12 h-12 border-4 border-blue-500 border-t-transparent rounded-full animate-spin" />
        </m.div>
      )}
    </div>
  );
}
