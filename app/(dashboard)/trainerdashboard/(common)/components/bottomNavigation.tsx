'use client';
import BottomNavigation from '@/components/common/Bottomnavigation/bottomnavigation';
import React from 'react';
import { menuItems } from './menuItems';

export default function TrainerDashboardBottomNavigation() {
  return <BottomNavigation menuItems={menuItems} basePath="/trainerdashboard" />;
}
