'use client';

import { m } from 'framer-motion';
import React from 'react';

type StatsProps = {
  stat: {
    number: string;
    label: string;
  };
  index: number;
};

export const ClientAnimatedStats = ({ stat, index }: StatsProps) => {
  return (
    <m.div
      initial={{ opacity: 0, scale: 0.9 }}
      whileInView={{ opacity: 1, scale: 1 }}
      transition={{ delay: index * 0.1 }}
      className="text-center p-4 bg-gray-800/50 rounded-lg border border-gray-700"
    >
      <div className="text-2xl font-bold text-blue-400">{stat.number}</div>
      <div className="text-sm text-gray-400">{stat.label}</div>
    </m.div>
  );
};
