import { useEffect, useState } from 'react';

export function debounce<T extends (...args: never[]) => void>(
  func: T,
  wait: number
): (...args: Parameters<T>) => void {
  let timeout: NodeJS.Timeout;
  return function executedFunction(...args: Parameters<T>) {
    const later = () => {
      clearTimeout(timeout);
      func(...args);
    };
    clearTimeout(timeout);
    timeout = setTimeout(later, wait);
  };
}

export function useScrollDirection(threshold = 10, delay = 100) {
  const [isVisible, setIsVisible] = useState(true);
  const [lastScrollY, setLastScrollY] = useState(0);

  useEffect(() => {
    if (typeof window === 'undefined') return;

    const scrollContainer = document.querySelector('.scroll-container');
    if (!scrollContainer) return;

    const handleScroll = (e: Event) => {
      const container = e.target as HTMLElement;
      const currentScrollY = container.scrollTop;

      if (currentScrollY < threshold) {
        setIsVisible(true);
        setLastScrollY(currentScrollY);
        return;
      }

      const isScrollingDown = currentScrollY > lastScrollY;

      if (Math.abs(currentScrollY - lastScrollY) > threshold) {
        setIsVisible(!isScrollingDown);
        setLastScrollY(currentScrollY);
      }
    };

    const debouncedHandleScroll = debounce(handleScroll, delay);
    scrollContainer.addEventListener('scroll', debouncedHandleScroll, { passive: true });

    return () => {
      scrollContainer.removeEventListener('scroll', debouncedHandleScroll);
    };
  }, [lastScrollY, threshold, delay]);

  return isVisible;
}
