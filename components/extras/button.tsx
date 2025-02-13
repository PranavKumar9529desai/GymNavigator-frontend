'use client';
import { signIn, signOut } from '@/node_modules/next-auth/react';
import React from 'react';

export default function Button() {
  return (
    <>
      <button
        onClick={() => {
          signIn();
        }}
      >
        {' '}
        Signin
      </button>
      <button
        onClick={() => {
          signOut();
        }}
      >
        SignOut
      </button>
    </>
  );
}
