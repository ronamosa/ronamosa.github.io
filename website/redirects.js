/**
 * Legacy path redirects for client-side stubs (GitHub Pages has no server redirects).
 * Manual entries + GA-derived mappings in ga-redirects.js.
 */
const gaRedirects = require('./ga-redirects');

module.exports = [
  // Retired subscribe page → unified newsletter landing
  { from: '/subscribe/', to: '/newsletter/' },

  // Old ronamosa.io-era /documentation/ paths → docs hub
  { from: '/documentation/', to: '/docs/' },

  // Common stale blog URL patterns → blog index
  { from: '/blog/category/all/', to: '/blog/' },

  // GA export Apr–Jul 2026: paths with traffic that 404 on current build
  ...gaRedirects,
];
