'use client';
import { signOut } from '@/node_modules/next-auth/react';
import React from 'react';
export default function Signout() {
  return (
    <button
      onClick={() => {
        signOut();
      }}
    >
      Sign Out
    </button>
  );
}
