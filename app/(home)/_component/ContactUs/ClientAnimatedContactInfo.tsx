'use client';

import React from 'react';
import { m } from 'framer-motion';
import type { ReactNode } from 'react';

type ContactInfoProps = {
  info: {
    icon: ReactNode;
    title: string;
    detail: string;
  };
  index: number;
};

export const ClientAnimatedContactInfo = ({ info, index }: ContactInfoProps) => {
  return (
    <m.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.1 }}
      className="bg-gray-800/50 backdrop-blur-lg rounded-xl p-6 border border-gray-700"
    >
      <div className="text-blue-400 mb-4">{info.icon}</div>
      <h3 className="text-xl font-semibold text-white mb-2">{info.title}</h3>
      <p className="text-gray-400">{info.detail}</p>
    </m.div>
  );
};
