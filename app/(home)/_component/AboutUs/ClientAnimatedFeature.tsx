'use client';

import React from 'react';
import { m } from 'framer-motion';
import type { ReactNode } from 'react';

type FeatureProps = {
  feature: {
    icon: ReactNode;
    title: string;
    description: string;
  };
  index: number;
};

export const ClientAnimatedFeature = ({ feature, index }: FeatureProps) => {
  return (
    <m.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.2 }}
      className="bg-gray-800/50 backdrop-blur-lg rounded-xl p-6 border border-gray-700"
    >
      <div className="text-blue-400 mb-4">{feature.icon}</div>
      <h3 className="text-xl font-semibold text-white mb-2">{feature.title}</h3>
      <p className="text-gray-400">{feature.description}</p>
    </m.div>
  );
};
