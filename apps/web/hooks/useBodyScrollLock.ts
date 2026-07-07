import { useEffect } from 'react';

/**
 * Locks body scroll when `locked` is true.
 * Compensates for scrollbar width to avoid layout shift.
 */
export function useBodyScrollLock(locked: boolean) {
  useEffect(() => {
    if (!locked) return;

    // Measure the scrollbar width before hiding it
    const scrollbarWidth = window.innerWidth - document.documentElement.clientWidth;

    document.body.style.overflow = 'hidden';
    // Prevent content jump when scrollbar disappears
    document.body.style.paddingRight = `${scrollbarWidth}px`;

    return () => {
      document.body.style.overflow = '';
      document.body.style.paddingRight = '';
    };
  }, [locked]);
}
