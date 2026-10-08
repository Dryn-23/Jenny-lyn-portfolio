/**
 * useScrollReveal.js — IntersectionObserver-driven reveal.
 *
 *   const { ref, inView } = useScrollReveal({ threshold: 0.2 });
 *   <div ref={ref} className={inView ? 'reveal in-view' : 'reveal'} />
 *
 * Elements reveal once and then stop being observed, so nothing re-animates
 * on the way back up the page.
 */
import { useEffect, useRef, useState } from 'react';

export function useScrollReveal({ threshold = 0.18, rootMargin = '0px 0px -8% 0px', once = true } = {}) {
  const ref = useRef(null);
  const [inView, setInView] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    // No IntersectionObserver (or user prefers less motion): show content immediately.
    const prefersReduced =
      typeof window !== 'undefined' &&
      window.matchMedia?.('(prefers-reduced-motion: reduce)').matches;

    if (prefersReduced || typeof IntersectionObserver === 'undefined') {
      setInView(true);
      return;
    }

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setInView(true);
            if (once) observer.unobserve(entry.target);
          } else if (!once) {
            setInView(false);
          }
        });
      },
      { threshold, rootMargin }
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, [threshold, rootMargin, once]);

  return { ref, inView };
}
