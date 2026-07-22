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

  // Typo fix: "chomebook" → "chromebook". Redirect both indexed typo paths
  // (current guides/ slug + retired Misc/ slug) to the corrected canonical URL.
  { from: '/docs/engineer/guides/chomebook-terminal/', to: '/docs/engineer/guides/chromebook-terminal/' },
  { from: '/docs/engineer/Misc/chomebook-terminal/', to: '/docs/engineer/guides/chromebook-terminal/' },

  // GA export Apr–Jul 2026: paths with traffic that 404 on current build
  ...gaRedirects,
];
