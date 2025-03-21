'use client';

import { m } from 'framer-motion';
import { CheckCircle2, Loader2 } from 'lucide-react';
import Image from 'next/image';
import type { gym } from '../../_components/SelectGym';

interface AuthTokenSuccessProps {
  gym: gym;
  redirectingTo: string;
}

export function AuthTokenSuccess({ gym, redirectingTo }: AuthTokenSuccessProps) {
  return (
    <m.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="flex flex-col items-center justify-center p-6 text-center"
    >
      <div className="mb-6">
        <m.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ type: 'spring', stiffness: 200, damping: 15 }}
          className="bg-green-100 rounded-full p-3"
        >
          <CheckCircle2 className="h-12 w-12 text-green-600" />
        </m.div>
      </div>

      <div className="flex items-center space-x-4 mb-6">
        <div className="relative w-16 h-16 rounded-full overflow-hidden flex-shrink-0">
          <Image
            src={gym.img}
            alt={gym.name}
            layout="fill"
            objectFit="cover"
            className="rounded-full"
          />
        </div>
        <div>
          <h3 className="text-lg font-semibold text-gray-900">{gym.name}</h3>
          <p className="text-sm text-gray-500">Authentication successful</p>
        </div>
      </div>

      <div className="space-y-4">
        <h2 className="text-xl font-bold text-green-600">Token Verified!</h2>
        <p className="text-gray-600">Your gym connection has been successfully established.</p>

        <div className="flex items-center justify-center space-x-2 text-blue-600">
          <Loader2 className="h-4 w-4 animate-spin" />
          <span>Redirecting to {redirectingTo}...</span>
        </div>

        <div className="w-full bg-gray-200 h-1.5 rounded-full mt-4 overflow-hidden">
          <m.div
            className="h-full bg-blue-600 rounded-full"
            initial={{ width: '0%' }}
            animate={{ width: '100%' }}
            transition={{ duration: 1.5 }}
          />
        </div>
      </div>
    </m.div>
  );
}
