/**
 * Decor.jsx — the little hand-drawn nature bits that give the site its
 * storybook feel: leaves, sprigs, blobs, squiggly underlines and margin notes.
 * Pure SVG so they stay crisp, recolourable and dependency-free.
 */
import './Decor.css';

/* ---------------------------------------------------------------- leaves */
export const LeafShape = ({ size = 46, className = '', style, flip = false }) => (
  <svg
    className={`leaf-shape ${className}`}
    style={{ ...style, transform: `${flip ? 'scaleX(-1) ' : ''}${style?.transform || ''}` }}
    width={size}
    height={size}
    viewBox="0 0 60 60"
    fill="none"
    aria-hidden="true"
    focusable="false"
  >
    <path
      d="M12 50C10 30 22 12 50 8c3 26-13 41-38 42Z"
      fill="rgba(113,138,106,.18)"
      stroke="rgba(63,90,72,.38)"
      strokeWidth="1.6"
      strokeLinejoin="round"
    />
    <path d="M14 49c8-10 16-19 30-32" stroke="rgba(63,90,72,.42)" strokeWidth="1.4" strokeLinecap="round" />
    <path d="M24 39c-1-4-4-6-8-7M33 30c0-4-2-7-6-9M42 21c0-4-2-7-6-9" stroke="rgba(63,90,72,.26)" strokeWidth="1.2" strokeLinecap="round" />
  </svg>
);

export const SprigShape = ({ size = 54, className = '', style }) => (
  <svg
    className={`sprig-shape ${className}`}
    style={style}
    width={size}
    height={size}
    viewBox="0 0 60 60"
    fill="none"
    aria-hidden="true"
    focusable="false"
  >
    <path d="M30 56V14" stroke="rgba(63,90,72,.4)" strokeWidth="1.6" strokeLinecap="round" />
    <path d="M30 30c-5-1-9-5-10-11 6 0 10 4 10 11Z" fill="rgba(113,138,106,.2)" stroke="rgba(63,90,72,.34)" strokeWidth="1.3" />
    <path d="M30 24c5-1 9-5 10-11-6 0-10 4-10 11Z" fill="rgba(113,138,106,.14)" stroke="rgba(63,90,72,.34)" strokeWidth="1.3" />
    <path d="M30 42c-5-1-9-5-10-11 6 0 10 4 10 11Z" fill="rgba(113,138,106,.14)" stroke="rgba(63,90,72,.34)" strokeWidth="1.3" />
    <circle cx="30" cy="10" r="3.4" fill="rgba(113,138,106,.35)" stroke="rgba(63,90,72,.35)" strokeWidth="1.2" />
  </svg>
);

export const FlowerShape = ({ size = 34, className = '', style }) => (
  <svg
    className={className}
    style={style}
    width={size}
    height={size}
    viewBox="0 0 40 40"
    fill="none"
    aria-hidden="true"
    focusable="false"
  >
    <g stroke="rgba(63,90,72,.32)" strokeWidth="1.2" fill="rgba(255,255,255,.72)">
      <circle cx="20" cy="10" r="5.4" />
      <circle cx="29.5" cy="17" r="5.4" />
      <circle cx="26" cy="28" r="5.4" />
      <circle cx="14" cy="28" r="5.4" />
      <circle cx="10.5" cy="17" r="5.4" />
    </g>
    <circle cx="20" cy="20" r="3.6" fill="rgba(232,221,200,.95)" stroke="rgba(63,90,72,.3)" strokeWidth="1.2" />
  </svg>
);

/* ----------------------------------------------------------------- blobs */
export const SoftBlob = ({ className = '', style, opacity = 0.5 }) => (
  <svg
    className={className}
    style={{ ...style, opacity }}
    viewBox="0 0 600 600"
    preserveAspectRatio="none"
    fill="none"
    aria-hidden="true"
    focusable="false"
  >
    <path
      d="M300 40c120 0 240 60 258 180s-80 220-200 258S74 486 46 372 60 130 180 76c40-18 80-36 120-36Z"
      fill="currentColor"
    />
  </svg>
);

/* ------------------------------------------------------- squiggly accents */
export const Squiggle = ({ width = 160, className = '', flip = false }) => (
  <svg
    className={`squiggle ${className}`}
    style={flip ? { transform: 'scaleX(-1)' } : undefined}
    width={width}
    height={16}
    viewBox="0 0 160 16"
    fill="none"
    aria-hidden="true"
    focusable="false"
  >
    <path
      d="M2 11c14-9 27-9 40 0s27 9 40 0 27-9 40 0"
      stroke="currentColor"
      strokeWidth="2.4"
      strokeLinecap="round"
    />
  </svg>
);

/* --------------------------------------------------- hand-written margin note */
export const Note = ({ text, rotate = 0, arrow = 'curve', className = '', style }) => (
  <figure className={`note-wrap ${className}`} style={{ ...style, '--note-rot': `${rotate}deg` }}>
    <blockquote className="note">{text}</blockquote>
    {arrow === 'curve' && (
      <svg className="note__curve" width="96" height="46" viewBox="0 0 96 46" fill="none" aria-hidden="true">
        <path
          d="M4 6c26 2 44 12 52 32"
          stroke="currentColor"
          strokeWidth="1.6"
          strokeLinecap="round"
          strokeDasharray="1 6"
        />
        <path d="M50 32.5 56.5 41l2.5-10.5" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    )}
    {arrow === 'down' && (
      <svg className="note__curve" width="80" height="40" viewBox="0 0 80 40" fill="none" aria-hidden="true">
        <path d="M12 4c14 6 22 16 24 30" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
        <path d="M31 29.5 36 37l3-9.5" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    )}
  </figure>
);

/* -------------------------------------------- layered mountain range divider */
export const MountainDivider = ({ className = '', flip = false }) => (
  <div className={`mountain-divider ${flip ? 'is-flipped' : ''} ${className}`} aria-hidden="true">
    <svg viewBox="0 0 1440 220" preserveAspectRatio="none" focusable="false">
      <path
        d="M0 190c120-8 176-42 262-96 40-25 62-24 96 6 52 46 92 92 168 96 62 3 108-32 168-84 46-40 76-42 118-6 56 48 104 78 196 82 74 3 128-24 190-58 44-24 70-20 112 14 42 34 74 44 130 46v30H0Z"
        fill="rgba(113,138,106,.18)"
      />
      <path
        d="M0 208c104-10 168-38 248-84 44-26 72-22 108 10 48 42 96 74 168 78 56 3 104-26 156-70 48-40 84-40 128-6 52 40 108 66 190 70 70 4 122-18 182-50 40-22 66-18 104 12 34 28 60 36 104 40v22H0Z"
        fill="rgba(63,90,72,.16)"
      />
    </svg>
  </div>
);

/* ---------------------------------------------------- small helper marquee */
export const GrassStrip = ({ className = '' }) => (
  <svg
    className={className}
    viewBox="0 0 1440 90"
    preserveAspectRatio="none"
    fill="none"
    aria-hidden="true"
    focusable="false"
  >
    <path
      d="M0 90V64c30 6 48-10 66-30 8-9 14-6 16 6 4 24 22 34 44 30 16-3 24-16 30-34 4-12 10-12 16 0 10 22 26 34 48 32 20-1 30-14 36-32 4-12 12-14 20-3 16 20 34 30 58 26 20-3 32-16 40-34 5-11 12-12 18-1 13 21 30 32 52 31 22 0 35-13 44-32 5-11 12-12 18-1 14 22 34 33 58 30 20-3 32-15 40-33 5-11 12-12 18-1 13 22 32 33 55 31 22-2 34-14 43-33 5-11 12-12 18-1 13 22 33 33 56 31 21-2 33-14 42-33 5-11 12-12 18-1 13 22 34 33 57 31 21-2 33-15 42-33 5-11 12-12 18-1 14 22 34 33 57 31 21-2 33-15 42-33 5-11 12-12 18-1 13 22 33 33 56 31 21-2 33-14 42-33 5-11 12-12 18-1 14 22 34 33 57 31 21-2 30-16 40-34 4-9 12-10 17-1 12 21 30 32 52 32 22 0 36-13 46-33 5-11 12-12 18-1 14 22 33 34 56 33 22-1 34-14 43-33 5-11 12-12 18-1 13 22 33 33 56 31 21-2 33-14 42-33 5-11 12-12 18-1 14 22 34 33 57 31 21-2 20-8 26-20V90Z"
      fill="currentColor"
    />
  </svg>
);
