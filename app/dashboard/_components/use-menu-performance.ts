'use client';

import { useCallback, useEffect, useState } from 'react';

/**
 * Custom hook to measure and log menu rendering performance
 * This is useful for development and can be disabled in production
 */
export function useMenuPerformance(label: string = 'Menu') {
  const [renderTime, setRenderTime] = useState<number>(0);
  const [renderCount, setRenderCount] = useState<number>(0);

  // Track component renders
  useEffect(() => {
    const start = performance.now();
    
    return () => {
      const end = performance.now();
      const time = end - start;
      setRenderTime((prev) => prev + time);
      setRenderCount((prev) => prev + 1);
      
      // Only log in development
      if (process.env.NODE_ENV === 'development') {
        console.log(`[Performance] ${label} render #${renderCount + 1}: ${time.toFixed(2)}ms`);
      }
    };
  }, [label, renderCount]);

  // Log accumulated metrics
  const logMetrics = useCallback(() => {
    if (renderCount === 0) return;
    
    const avgTime = renderTime / renderCount;
    console.log(`[Performance Summary] ${label}:`);
    console.log(`  - Total renders: ${renderCount}`);
    console.log(`  - Total render time: ${renderTime.toFixed(2)}ms`);
    console.log(`  - Average render time: ${avgTime.toFixed(2)}ms`);
  }, [label, renderCount, renderTime]);

  useEffect(() => {
    // Log metrics when component unmounts
    return () => {
      if (process.env.NODE_ENV === 'development') {
        logMetrics();
      }
    };
  }, [logMetrics]);

  return { renderTime, renderCount, logMetrics };
}

/**
 * A no-op function that doesn't track performance
 * Used when performance tracking is disabled
 */
export function useMenuPerformanceDisabled() {
  return { 
    renderTime: 0, 
    renderCount: 0, 
    logMetrics: () => {} 
  };
}

/**
 * Returns the appropriate hook based on environment
 */
export const useMenuPerformanceMetrics = 
  process.env.NODE_ENV === 'development' 
    ? useMenuPerformance 
    : useMenuPerformanceDisabled;
