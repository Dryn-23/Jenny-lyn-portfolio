/**
 * useScrollSpy.js — highlights the nav link for the section currently in view.
 * Uses IntersectionObserver (cheap) and keeps the top-most visible section active.
 */
import { useEffect, useState } from 'react';

export function useScrollSpy(ids, { offset = 120 } = {}) {
  const [active, setActive] = useState(ids[0] ?? null);

  useEffect(() => {
    const sections = ids
      .map((id) => document.getElementById(id))
      .filter(Boolean);

    if (!sections.length || typeof IntersectionObserver === 'undefined') return;

    const visible = new Map();

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) visible.set(entry.target.id, entry.intersectionRatio);
          else visible.delete(entry.target.id);
        });

        if (visible.size) {
          const top = [...visible.entries()].sort((a, b) => {
            const elA = document.getElementById(a[0]);
            const elB = document.getElementById(b[0]);
            return elA.offsetTop - elB.offsetTop;
          })[0];
          setActive(top[0]);
        }
      },
      { rootMargin: `-${offset}px 0px -55% 0px`, threshold: [0.05, 0.25, 0.5] }
    );

    sections.forEach((s) => observer.observe(s));
    return () => observer.disconnect();
  }, [ids, offset]);

  return active;
}
