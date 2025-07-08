'use client';

import { Mail, MapPin, Phone } from 'lucide-react';
import Image from 'next/image';
import type { GymDetailsData } from '../_actions/get-gym-details';

interface GymHeaderProps {
  gym: GymDetailsData['gym'];
}

export function GymHeader({ gym }: GymHeaderProps) {
  return (
    <div className="space-y-4">
      <div className="flex items-start gap-4">
        {gym.gym_logo && (
          <div className="relative">
            <Image
              src={gym.gym_logo}
              alt={gym.gym_name}
              width={60}
              height={60}
              className="rounded-lg"
            />
          </div>
        )}
        <div className="flex-1 space-y-2">
          <div>
            <h1 className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
              {gym.gym_name}
            </h1>
            {gym.address && (
              <p className="text-slate-600 flex items-center gap-2 mt-1">
                <MapPin className="h-4 w-4 text-blue-400" />
                <span className="text-sm">
                  {gym.address.street}, {gym.address.city}, {gym.address.state} {gym.address.postalCode}
                </span>
              </p>
            )}
          </div>
          
          {/* Contact Information */}
          <div className="flex flex-wrap gap-3">
            <div className="flex items-center gap-2 px-2 py-1 bg-blue-50 rounded text-sm">
              <Phone className="h-3 w-3 text-blue-500" />
              <span className="text-slate-700">{gym.phone_number}</span>
            </div>
            <div className="flex items-center gap-2 px-2 py-1 bg-blue-50 rounded text-sm">
              <Mail className="h-3 w-3 text-blue-500" />
              <span className="text-slate-700">{gym.Email}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
