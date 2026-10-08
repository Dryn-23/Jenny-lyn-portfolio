/**
 * image.js — image helpers.
 * - `fileToCompressedDataUrl` keeps uploaded screenshots small enough to live
 *   comfortably in localStorage (max width 1280px, JPEG/WebP quality 0.82).
 * - `placeholderFor(title)` builds a deterministic sage/cream gradient + initial
 *   so a card still looks intentional when it has no image (or one fails to load).
 */

const PALETTES = [
  ['#D9E2CF', '#8FA987', '#3F5A48'],
  ['#EFE9DA', '#C9BFA4', '#4D6154'],
  ['#CFE0D6', '#718A6A', '#26352C'],
  ['#E8DDC8', '#B6C4A6', '#3F5A48'],
  ['#DDE7D4', '#A8BC9B', '#4D6154'],
  ['#EDE4D2', '#9FB391', '#26352C'],
];

function hash(text = '') {
  let h = 0;
  for (let i = 0; i < text.length; i += 1) {
    h = (h * 31 + text.charCodeAt(i)) % 100000;
  }
  return h;
}

/** Deterministic gradient string for a project title. */
export function gradientFor(title = '') {
  const [a, b] = PALETTES[hash(title) % PALETTES.length];
  return `linear-gradient(135deg, ${a} 0%, ${b} 100%)`;
}

/** Inline SVG data-URI placeholder with the project's initial. */
export function placeholderFor(title = '') {
  const [a, b, ink] = PALETTES[hash(title) % PALETTES.length];
  const initial = (title.trim()[0] || '?').toUpperCase();
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 800 450">
  <defs>
    <linearGradient id="g" x1="0" y1="0" x2="1" y2="1">
      <stop offset="0" stop-color="${a}"/><stop offset="1" stop-color="${b}"/>
    </linearGradient>
  </defs>
  <rect width="800" height="450" fill="url(#g)"/>
  <g opacity=".28" fill="none" stroke="${ink}" stroke-width="3" stroke-linecap="round">
    <path d="M-20 400c120-30 220-60 330-140S520 120 820 90"/>
    <path d="M-20 430c130-26 240-58 350-140S540 150 820 118"/>
  </g>
  <circle cx="660" cy="120" r="52" fill="none" stroke="${ink}" stroke-width="3" opacity=".22"/>
  <text x="400" y="258" text-anchor="middle" font-family="Georgia,serif" font-size="150" fill="${ink}" opacity=".55">${initial}</text>
</svg>`;
  return `data:image/svg+xml;utf8,${encodeURIComponent(svg)}`;
}

/** Read a File into a downscaled data URL. Rejects on unsupported images. */
export function fileToCompressedDataUrl(file, { maxWidth = 1280, quality = 0.82 } = {}) {
  return new Promise((resolve, reject) => {
    if (!file || !file.type.startsWith('image/')) {
      reject(new Error('Please choose an image file.'));
      return;
    }

    const reader = new FileReader();
    reader.onerror = () => reject(new Error('Could not read that file.'));
    reader.onload = () => {
      const img = new window.Image();
      img.onerror = () => reject(new Error('That image could not be decoded.'));
      img.onload = () => {
        const scale = Math.min(1, maxWidth / img.width);
        const canvas = document.createElement('canvas');
        canvas.width = Math.round(img.width * scale);
        canvas.height = Math.round(img.height * scale);
        const ctx = canvas.getContext('2d');
        ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
        const prefersPng = file.type === 'image/png' && file.size < 220_000;
        resolve(canvas.toDataURL(prefersPng ? 'image/png' : 'image/jpeg', quality));
      };
      img.src = reader.result;
    };
    reader.readAsDataURL(file);
  });
}
