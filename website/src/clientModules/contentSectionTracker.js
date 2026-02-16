/**
 * Content section tagging for traffic source segmentation.
 *
 * Fires a `content_section_engaged` event on every route change,
 * tagging the page with its content section so GA4 explorations
 * can cross-reference traffic source x content type.
 *
 * Sections:
 *   - analysis    : /blog/*
 *   - docs        : /docs/*
 *   - newsletter  : /subscribe*
 *   - homepage    : / (exact)
 *   - changelog   : /changelog/*
 *   - projects    : /projects/*
 *   - about       : /about*
 *   - other       : anything else
 *
 * Also tracks unique sections visited per session so you can see
 * cross-section exploration (e.g. someone who reads both analysis
 * AND docs in the same session).
 */

const SECTIONS_KEY = 'sections_visited';

function getSection(pathname) {
  if (pathname === '/') return 'homepage';
  if (pathname.startsWith('/blog')) return 'analysis';
  if (pathname.startsWith('/docs')) return 'docs';
  if (pathname.startsWith('/subscribe')) return 'newsletter';
  if (pathname.startsWith('/changelog')) return 'changelog';
  if (pathname.startsWith('/projects')) return 'projects';
  if (pathname.startsWith('/about')) return 'about';
  return 'other';
}

function getVisitedSections() {
  try {
    const raw = sessionStorage.getItem(SECTIONS_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

function addVisitedSection(section) {
  try {
    const visited = getVisitedSections();
    if (!visited.includes(section)) {
      visited.push(section);
      sessionStorage.setItem(SECTIONS_KEY, JSON.stringify(visited));
    }
    return visited;
  } catch {
    return [section];
  }
}

function trackContentSection(location) {
  if (typeof window === 'undefined' || !window.gtag) return;

  const section = getSection(location.pathname);
  const visited = addVisitedSection(section);

  window.gtag('event', 'content_section_engaged', {
    event_category: 'content_segmentation',
    content_section: section,
    page_path: location.pathname,
    sections_visited_count: visited.length,
    sections_visited: visited.join(','),
  });
}

export function onRouteDidUpdate({ location }) {
  trackContentSection(location);
}
