import { useEffect, useState } from "react";

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
    const scrollContainer = document.querySelector('.overflow-y-auto.relative');
    if (!scrollContainer) return;

    let timeoutId: NodeJS.Timeout;
    
    const handleScroll = () => {
      const currentScrollY = scrollContainer.scrollTop;
      
      if (timeoutId) clearTimeout(timeoutId);
      timeoutId = setTimeout(() => {
        const isAtBottom = scrollContainer.scrollHeight - (scrollContainer.scrollTop + scrollContainer.clientHeight) < threshold;
        
        if (currentScrollY < threshold || isAtBottom) {
          setIsVisible(true);
          return;
        }

        const isScrollingDown = currentScrollY > lastScrollY;
        setIsVisible(!isScrollingDown);
        setLastScrollY(currentScrollY);
      }, delay);
    };

    scrollContainer.addEventListener('scroll', handleScroll, { passive: true });
    return () => {
      scrollContainer.removeEventListener('scroll', handleScroll);
      if (timeoutId) clearTimeout(timeoutId);
    };
  }, [lastScrollY, threshold, delay]);

  return isVisible;
}
