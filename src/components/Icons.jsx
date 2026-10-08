/**
 * Icons.jsx — hand-rolled inline SVG icon set (no icon dependency, no network).
 * All icons share a 24x24 viewBox and inherit `currentColor`.
 */
const base = {
  width: 20,
  height: 20,
  viewBox: '0 0 24 24',
  fill: 'none',
  stroke: 'currentColor',
  strokeWidth: 1.7,
  strokeLinecap: 'round',
  strokeLinejoin: 'round',
  'aria-hidden': 'true',
  focusable: 'false',
};

const Svg = ({ size = 20, children, ...rest }) => (
  <svg {...base} width={size} height={size} {...rest}>
    {children}
  </svg>
);

export const Leaf = ({ size = 22, ...p }) => (
  <Svg size={size} {...p}>
    <path d="M12 21V10" />
    <path d="M12 12.5C11 6.5 15 2.5 21 2c.6 6-3 10.5-9 10.5Z" fill="rgba(113,138,106,.22)" />
    <path d="M12 16c-4.4-.6-7-3.6-7-8 4.6.6 7 3.6 7 8Z" fill="rgba(113,138,106,.12)" />
  </Svg>
);

export const ArrowRight = ({ size = 18, ...p }) => (
  <Svg size={size} {...p}>
    <path d="M4 12h15" />
    <path d="m13 6 6 6-6 6" />
  </Svg>
);

export const ArrowDown = ({ size = 18, ...p }) => (
  <Svg size={size} {...p}>
    <path d="M12 4v15" />
    <path d="m6 13 6 6 6-6" />
  </Svg>
);

export const ExternalLink = ({ size = 18, ...p }) => (
  <Svg size={size} {...p}>
    <path d="M14 4h6v6" />
    <path d="M20 4 11 13" />
    <path d="M18 14v5a1.8 1.8 0 0 1-1.8 1.8H5.8A1.8 1.8 0 0 1 4 19V8.6a1.8 1.8 0 0 1 1.8-1.8H10" />
  </Svg>
);

export const Github = ({ size = 18, ...p }) => (
  <Svg size={size} {...p} strokeWidth={1.6}>
    <path d="M9 19c-4.3 1.3-4.3-2.2-6-2.6m12 5.1v-3.6a3 3 0 0 0-.9-2.4c2.9-.3 5.9-1.4 5.9-6.4a4.9 4.9 0 0 0-1.4-3.4 4.5 4.5 0 0 0-.1-3.5s-1.2-.3-3.9 1.5a13.4 13.4 0 0 0-7 0C4.9 1.6 3.7 1.9 3.7 1.9a4.5 4.5 0 0 0-.1 3.5A4.9 4.9 0 0 0 2.2 8.9c0 4.9 3 6 5.9 6.4a3 3 0 0 0-.9 2.3V21" />
  </Svg>
);

export const Facebook = ({ size = 18, ...p }) => (
  <Svg size={size} {...p} strokeWidth={1.6}>
    <path d="M14.5 8.5H17V5.2h-2.6c-2.3 0-3.9 1.6-3.9 3.9v2H8.2v3.3h2.3V22h3.4v-7.6h2.4l.6-3.3h-3V9.4c0-.5.2-.9.6-.9Z" />
  </Svg>
);

export const Linkedin = ({ size = 18, ...p }) => (
  <Svg size={size} {...p} strokeWidth={1.6}>
    <rect x="3" y="3" width="18" height="18" rx="3.4" />
    <path d="M8 10.5V17M8 7.4v.2" />
    <path d="M12 17v-3.4a2.3 2.3 0 0 1 4.6 0V17" />
  </Svg>
);

export const Mail = ({ size = 18, ...p }) => (
  <Svg size={size} {...p}>
    <rect x="2.5" y="4.8" width="19" height="14.4" rx="2.6" />
    <path d="m3.6 7 7.6 5.5a1.6 1.6 0 0 0 1.6 0L20.4 7" />
  </Svg>
);

export const Download = ({ size = 18, ...p }) => (
  <Svg size={size} {...p}>
    <path d="M12 3.5v11" />
    <path d="m7.5 10 4.5 4.5L16.5 10" />
    <path d="M4.5 19.5h15" />
  </Svg>
);

export const Sparkle = ({ size = 18, ...p }) => (
  <Svg size={size} {...p}>
    <path d="M12 3.5c.9 3.7 2.4 5.2 6.1 6.1-3.7.9-5.2 2.4-6.1 6.1-.9-3.7-2.4-5.2-6.1-6.1 3.7-.9 5.2-2.4 6.1-6.1Z" />
    <path d="M18.4 16.2c.4 1.6 1 2.2 2.6 2.6-1.6.4-2.2 1-2.6 2.6-.4-1.6-1-2.2-2.6-2.6 1.6-.4 2.2-1 2.6-2.6Z" />
  </Svg>
);

export const Plus = ({ size = 18, ...p }) => (
  <Svg size={size} {...p} strokeWidth={2}>
    <path d="M12 5v14M5 12h14" />
  </Svg>
);

export const Pencil = ({ size = 16, ...p }) => (
  <Svg size={size} {...p}>
    <path d="M4 20h4l10-10a2.5 2.5 0 0 0-3.5-3.5L4.5 16.5V20Z" />
    <path d="m13.5 7.5 3 3" />
  </Svg>
);

export const Trash = ({ size = 16, ...p }) => (
  <Svg size={size} {...p}>
    <path d="M4 7h16" />
    <path d="M9.5 7V4.8h5V7" />
    <path d="M6.5 7l.8 12.2A1.8 1.8 0 0 0 9 21h6a1.8 1.8 0 0 0 1.8-1.8L17.5 7" />
    <path d="M10.5 11v6M13.5 11v6" />
  </Svg>
);

export const Star = ({ size = 16, filled = false, ...p }) => (
  <Svg size={size} {...p} fill={filled ? 'currentColor' : 'none'}>
    <path d="m12 3.6 2.6 5.4 5.9.8-4.3 4.1 1 5.9-5.2-2.8-5.2 2.8 1-5.9L3.5 9.8l5.9-.8L12 3.6Z" />
  </Svg>
);

export const Close = ({ size = 20, ...p }) => (
  <Svg size={size} {...p} strokeWidth={2}>
    <path d="M6 6l12 12M18 6 6 18" />
  </Svg>
);

export const Image = ({ size = 18, ...p }) => (
  <Svg size={size} {...p}>
    <rect x="3" y="4.5" width="18" height="15" rx="2.6" />
    <circle cx="8.6" cy="10" r="1.6" />
    <path d="m4 17 4.6-4.3a1.7 1.7 0 0 1 2.3 0l3 2.8 2-1.8a1.7 1.7 0 0 1 2.3.1L20 15.4" />
  </Svg>
);

export const Wand = ({ size = 18, ...p }) => (
  <Svg size={size} {...p}>
    <path d="M5 19 16.5 7.5" />
    <path d="M15 4.5l.9 2.1 2.1.9-2.1.9-.9 2.1-.9-2.1-2.1-.9 2.1-.9.9-2.1Z" />
    <path d="M19.4 14.2l.5 1.2 1.2.5-1.2.5-.5 1.2-.5-1.2-1.2-.5 1.2-.5.5-1.2Z" />
  </Svg>
);

export const Menu = ({ size = 22, ...p }) => (
  <Svg size={size} {...p} strokeWidth={1.9}>
    <path d="M4 7h16M4 12h16M4 17h16" />
  </Svg>
);

export const Code = ({ size = 20, ...p }) => (
  <Svg size={size} {...p}>
    <path d="m9 8-4 4 4 4" />
    <path d="m15 8 4 4-4 4" />
  </Svg>
);

export const Layout = ({ size = 20, ...p }) => (
  <Svg size={size} {...p}>
    <rect x="3" y="4" width="18" height="16" rx="2.6" />
    <path d="M3 9.2h18M9.4 9.2V20" />
  </Svg>
);

export const Layers = ({ size = 20, ...p }) => (
  <Svg size={size} {...p}>
    <path d="m12 3.5 8.5 4.3L12 12 3.5 7.8 12 3.5Z" />
    <path d="m4.6 11.7 7.4 3.7 7.4-3.7" />
    <path d="m4.6 15.6 7.4 3.7 7.4-3.7" />
  </Svg>
);

export const Git = ({ size = 20, ...p }) => (
  <Svg size={size} {...p}>
    <circle cx="7" cy="6" r="2.4" />
    <circle cx="7" cy="18" r="2.4" />
    <circle cx="17" cy="12" r="2.4" />
    <path d="M7 8.4v7.2" />
    <path d="M14.7 10.6C12.6 9.6 9.6 8.6 9.4 6.2" />
  </Svg>
);

export const Coffee = ({ size = 20, ...p }) => (
  <Svg size={size} {...p}>
    <path d="M4 8h12v6.2A4.8 4.8 0 0 1 11.2 19H8.8A4.8 4.8 0 0 1 4 14.2V8Z" />
    <path d="M16 9.5h1.6a2.4 2.4 0 0 1 0 4.8H16" />
    <path d="M7.5 4.6c0 .7.8.9.8 1.6M11 4.6c0 .7.8.9.8 1.6" />
  </Svg>
);

export const Check = ({ size = 16, ...p }) => (
  <Svg size={size} {...p} strokeWidth={2.2}>
    <path d="m5 12.5 4.5 4.5L19 7" />
  </Svg>
);

export const Info = ({ size = 16, ...p }) => (
  <Svg size={size} {...p}>
    <circle cx="12" cy="12" r="8.6" />
    <path d="M12 11v5.4M12 7.9v.2" />
  </Svg>
);

export const Folder = ({ size = 18, ...p }) => (
  <Svg size={size} {...p}>
    <path d="M3.6 7.4a2 2 0 0 1 2-2h2.8l1.8 2h8.2a2 2 0 0 1 2 2v7.2a2 2 0 0 1-2 2H5.6a2 2 0 0 1-2-2V7.4Z" />
  </Svg>
);
