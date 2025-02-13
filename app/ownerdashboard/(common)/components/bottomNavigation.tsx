'use client';
import BottomNavigation from '@/components/common/bottomnavigation';
import React from 'react';
import { menuItems } from './sidebar';

export default function OwnerDashboardBottomNavigation() {
  return <BottomNavigation menuItems={menuItems} />;
}
