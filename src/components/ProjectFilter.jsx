/**
 * ProjectFilter.jsx — animated category filter pills with live counts.
 * The sliding highlight is a single absolutely-positioned pill that moves
 * between the options, so switching filters feels smooth, not abrupt.
 */
import { useEffect, useLayoutEffect, useRef, useState } from 'react';

export default function ProjectFilter({ categories, active, counts, onChange }) {
  const listRef = useRef(null);
  const btnRefs = useRef(new Map());
  const [pill, setPill] = useState({ left: 0, width: 0, ready: false });

  const options = ['All', ...categories];

  const measure = () => {
    const btn = btnRefs.current.get(active);
    const list = listRef.current;
    if (!btn || !list) return;
    const b = btn.getBoundingClientRect();
    const l = list.getBoundingClientRect();
    setPill({ left: b.left - l.left + list.scrollLeft, width: b.width, ready: true });
  };

  useLayoutEffect(() => {
    measure();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [active, categories.length]);

  useEffect(() => {
    const onResize = () => measure();
    window.addEventListener('resize', onResize);
    return () => window.removeEventListener('resize', onResize);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [active]);

  return (
    <div className="project-filter">
      <ul className="project-filter__list" ref={listRef} role="tablist" aria-label="Filter projects by category">
        <span
          className={`project-filter__pill ${pill.ready ? 'is-ready' : ''}`}
          style={{ transform: `translateX(${pill.left}px)`, width: `${pill.width}px` }}
          aria-hidden="true"
        />
        {options.map((option) => {
          const count = option === 'All' ? counts.All : counts[option] || 0;
          const isActive = active === option;
          return (
            <li key={option}>
              <button
                type="button"
                role="tab"
                aria-selected={isActive}
                className={`project-filter__btn ${isActive ? 'is-active' : ''}`}
                ref={(el) => {
                  if (el) btnRefs.current.set(option, el);
                  else btnRefs.current.delete(option);
                }}
                onClick={() => onChange(option)}
              >
                {option}
                <span className="project-filter__count">{count}</span>
              </button>
            </li>
          );
        })}
      </ul>
    </div>
  );
}
