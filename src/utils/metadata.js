/**
 * metadata.js — best-effort "paste a link, get a preview card" helper.
 *
 * How it works
 * ------------
 * 1. Try a direct `fetch()` of the page. Sites that send permissive CORS
 *    headers (many do) return their HTML straight away.
 * 2. If that is blocked by the browser, retry through a couple of public CORS
 *    relays. They are free services, so they can be slow or unavailable — every
 *    attempt has a timeout and the function simply moves on.
 * 3. Whatever HTML we get is parsed with DOMParser for <title>, meta
 *    description, Open Graph / Twitter image and the favicon link.
 *
 * Because steps 1–2 can legitimately fail for private or bot-protected sites,
 * the UI always keeps manual fields available — nothing here is required.
 */
import { normalizeUrl } from './links.js';

const REQUEST_TIMEOUT = 9000;

const RELAYS = [
  (url) => `https://api.allorigins.win/raw?url=${encodeURIComponent(url)}`,
  (url) => `https://api.codetabs.com/v1/proxy?quest=${encodeURIComponent(url)}`,
  (url) => `https://corsproxy.io/?url=${encodeURIComponent(url)}`,
  (url) => `https://r.jina.ai/${url}`,
];

async function fetchText(url, timeout = REQUEST_TIMEOUT) {
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), timeout);
  try {
    const res = await fetch(url, {
      signal: controller.signal,
      headers: { Accept: 'text/html,application/xhtml+xml,text/plain;q=0.9,*/*;q=0.8' },
    });
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    return await res.text();
  } finally {
    clearTimeout(timer);
  }
}

function pickMeta(doc, selectors) {
  for (const selector of selectors) {
    const el = doc.querySelector(selector);
    const value = el?.getAttribute('content') || el?.textContent;
    if (value && value.trim()) return value.trim();
  }
  return '';
}

function absolutize(href, base) {
  if (!href) return '';
  try {
    return new URL(href, base).href;
  } catch {
    return '';
  }
}

/** Parse an HTML (or r.jina.ai markdown-ish) blob into preview metadata. */
export function parseMetadata(html, baseUrl) {
  const base = normalizeUrl(baseUrl);
  const out = { title: '', description: '', image: '', favicon: '', siteName: '' };

  // r.jina.ai returns plain text starting with "Title: ..." — handle it cheaply.
  if (/^Title:/im.test(html) && !/<html/i.test(html)) {
    const t = html.match(/^Title:\s*(.+)$/im);
    const d = html.match(/^(?:Description|Summary):\s*(.+)$/im);
    out.title = t ? t[1].trim() : '';
    out.description = d ? d[1].trim() : '';
    return out;
  }

  let doc;
  try {
    doc = new DOMParser().parseFromString(html, 'text/html');
  } catch {
    return out;
  }

  out.title =
    pickMeta(doc, [
      'meta[property="og:title"]',
      'meta[name="twitter:title"]',
      'meta[name="title"]',
    ]) ||
    doc.querySelector('title')?.textContent?.trim() ||
    '';

  out.description = pickMeta(doc, [
    'meta[property="og:description"]',
    'meta[name="twitter:description"]',
    'meta[name="description"]',
  ]);

  out.image = absolutize(
    pickMeta(doc, [
      'meta[property="og:image:secure_url"]',
      'meta[property="og:image"]',
      'meta[name="twitter:image"]',
      'meta[name="twitter:image:src"]',
    ]),
    base
  );

  out.siteName = pickMeta(doc, ['meta[property="og:site_name"]', 'meta[name="application-name"]']);

  const iconHref =
    doc.querySelector('link[rel="icon"]')?.getAttribute('href') ||
    doc.querySelector('link[rel="shortcut icon"]')?.getAttribute('href') ||
    doc.querySelector('link[rel="apple-touch-icon"]')?.getAttribute('href') ||
    doc.querySelector('link[rel="apple-touch-icon-precomposed"]')?.getAttribute('href') ||
    '';

  out.favicon = absolutize(iconHref, base) || `${new URL(base).origin}/favicon.ico`;
  if (!out.siteName) out.siteName = new URL(base).hostname.replace(/^www\./, '');

  return out;
}

/**
 * GitHub repositories get first-class treatment: the public REST API allows
 * cross-origin reads, so we can pull a real name, description, homepage,
 * language and social preview image without any relay.
 */
export async function fetchGithubRepoInfo(rawUrl) {
  const url = normalizeUrl(rawUrl);
  const match = url.match(/github\.com\/([^/]+)\/([^/?#]+)/i);
  if (!match) return null;

  const [, owner, repo] = match;
  try {
    const res = await fetch(`https://api.github.com/repos/${owner}/${repo.replace(/\.git$/, '')}`, {
      headers: { Accept: 'application/vnd.github+json' },
    });
    if (!res.ok) return null;
    const data = await res.json();
    return {
      title: data.name ? data.name.replace(/[-_]/g, ' ') : '',
      description: data.description || '',
      liveUrl: data.homepage || '',
      githubUrl: data.html_url || url,
      image: data.owner?.avatar_url
        ? `https://opengraph.githubassets.com/1/${data.full_name}`
        : '',
      technologies: data.language ? [data.language] : [],
      year: data.created_at ? new Date(data.created_at).getFullYear() : undefined,
    };
  } catch {
    return null;
  }
}

/**
 * Gather preview metadata for a URL.
 * Resolves with `{ ok, meta, source, tried }` — never throws.
 */
export async function fetchUrlMetadata(rawUrl) {
  const url = normalizeUrl(rawUrl);
  const tried = [];

  // 1) direct
  try {
    const html = await fetchText(url);
    const meta = parseMetadata(html, url);
    if (meta.title || meta.image || meta.description) {
      return { ok: true, meta, source: 'direct', tried };
    }
    tried.push('direct (no metadata found)');
  } catch (error) {
    tried.push(`direct (${error.name === 'AbortError' ? 'timeout' : error.message})`);
  }

  // 2) relays
  for (const build of RELAYS) {
    const relayUrl = build(url);
    const label = new URL(relayUrl).hostname;
    try {
      const html = await fetchText(relayUrl);
      const meta = parseMetadata(html, url);
      if (meta.title || meta.image || meta.description) {
        return { ok: true, meta, source: label, tried };
      }
      tried.push(`${label} (no metadata found)`);
    } catch (error) {
      tried.push(`${label} (${error.name === 'AbortError' ? 'timeout' : error.message})`);
    }
  }

  return { ok: false, meta: null, source: null, tried };
}
