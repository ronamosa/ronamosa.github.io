/**
 * Blog (Analysis & Essays) engagement tracker.
 *
 * Fires GA4 custom events to measure multi-page sessions within /blog/:
 *
 *  - blog_section_enter   : first blog page hit in a session
 *  - blog_page_view       : every blog page view (with depth counter)
 *  - blog_deep_engagement : triggered once when a visitor views 3+ blog pages
 *
 * All state lives in sessionStorage so it resets per-session automatically.
 */

const STORAGE_KEY = 'blog_pages_viewed';

function getBlogDepth() {
  try {
    return parseInt(sessionStorage.getItem(STORAGE_KEY) || '0', 10);
  } catch {
    return 0;
  }
}

function setBlogDepth(n) {
  try {
    sessionStorage.setItem(STORAGE_KEY, String(n));
  } catch {
    // Private browsing may block sessionStorage
  }
}

function trackBlogEngagement(location) {
  if (typeof window === 'undefined' || !window.gtag) return;

  const path = location.pathname;
  if (!path.startsWith('/blog')) return;

  const depth = getBlogDepth() + 1;
  setBlogDepth(depth);

  if (depth === 1) {
    window.gtag('event', 'blog_section_enter', {
      event_category: 'blog_engagement',
      page_path: path,
    });
  }

  window.gtag('event', 'blog_page_view', {
    event_category: 'blog_engagement',
    page_path: path,
    blog_page_depth: depth,
  });

  if (depth === 3) {
    window.gtag('event', 'blog_deep_engagement', {
      event_category: 'blog_engagement',
      blog_pages_viewed: depth,
    });
  }
}

export function onRouteDidUpdate({ location }) {
  trackBlogEngagement(location);
}
