'use client';

import { useMemo } from 'react';
import * as LucideIcons from 'lucide-react';
import type { LucideIcon } from 'lucide-react';

/**
 * Custom hook for efficiently accessing Lucide icons by name
 * This allows us to create an optimized cache of icon components
 */
export function useLucideIcons() {
  // Create a memoized map of icon names to components
  // This ensures we only create this mapping once per component instance
  const iconMap = useMemo(() => {
    return new Map(
      Object.entries(LucideIcons)
        .filter(([_, value]) => typeof value === 'function')
        .map(([name, component]) => [name, component as LucideIcon])
    );
  }, []);

  /**
   * Get an icon component by its name
   * @param iconName The name of the Lucide icon
   * @returns The icon component or a fallback icon
   */
  const getIconByName = (iconName: string): LucideIcon => {
    return iconMap.get(iconName) || LucideIcons.HelpCircle;
  };

  return {
    getIconByName
  };
}
