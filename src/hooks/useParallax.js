/**
 * useParallax.js — rAF-throttled scroll parallax.
 *
 * `useParallax({ speed: 0.25 })` returns a ref; attach it to the element you
 * want to drift. The hook writes a `--parallax-y` custom property so all the
 * work happens in CSS transforms (no layout thrash).
 */
import { useEffect, useRef } from 'react';

export function useParallax({ speed = 0.2, disabled = false } = {}) {
  const ref = useRef(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const prefersReduced = window.matchMedia?.('(prefers-reduced-motion: reduce)').matches;
    if (disabled || prefersReduced) {
      el.style.setProperty('--parallax-y', '0px');
      return;
    }

    let frame = 0;
    let ticking = false;

    const update = () => {
      ticking = false;
      const rect = el.parentElement?.getBoundingClientRect() ?? el.getBoundingClientRect();
      // -1 → element below the fold, 1 → element above the fold
      const progress = (rect.top + rect.height / 2 - window.innerHeight / 2) / window.innerHeight;
      const shift = -progress * speed * 100;
      el.style.setProperty('--parallax-y', `${shift.toFixed(2)}px`);
    };

    const onScroll = () => {
      if (ticking) return;
      ticking = true;
      frame = window.requestAnimationFrame(update);
    };

    update();
    window.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('resize', onScroll);
    return () => {
      window.cancelAnimationFrame(frame);
      window.removeEventListener('scroll', onScroll);
      window.removeEventListener('resize', onScroll);
    };
  }, [speed, disabled]);

  return ref;
}
