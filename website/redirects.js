/**
 * Legacy path redirects for client-side stubs (GitHub Pages has no server redirects).
 * Add paths from GA4 "Page Not Found" and Search Console 404 reports.
 * Note: do not duplicate paths handled by createRedirects in docusaurus.config.js.
 */
module.exports = [
  // Retired subscribe page → unified newsletter landing
  { from: '/subscribe/', to: '/newsletter/' },

  // Old ronamosa.io-era /documentation/ paths → docs hub
  { from: '/documentation/', to: '/docs/' },

  // Common stale blog URL patterns → blog index
  { from: '/blog/category/all/', to: '/blog/' },
];
