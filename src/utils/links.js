/**
 * links.js — forgiving URL helpers.
 * People paste "github.com/me/repo", "www.site.com", or a full URL; all should work.
 */
export function normalizeUrl(raw) {
  const value = String(raw || '').trim();
  if (!value) return '';
  // already absolute (http/https/mailto/tel/data/blob)
  if (/^[a-z][a-z0-9+.-]*:/i.test(value)) return value;
  if (value.startsWith('//')) return `https:${value}`;
  return `https://${value}`;
}

export function safeHost(raw) {
  try {
    return new URL(normalizeUrl(raw)).hostname.replace(/^www\./, '');
  } catch {
    return '';
  }
}

export function prettyUrl(raw) {
  const value = String(raw || '').trim();
  if (!value) return '';
  const host = safeHost(value);
  if (!host) return value;
  try {
    const url = new URL(normalizeUrl(value));
    const path = url.pathname === '/' ? '' : url.pathname.replace(/\/$/, '');
    return `${host}${path}`;
  } catch {
    return host;
  }
}

export const isLikelyGithub = (raw) => safeHost(raw).includes('github.com');
