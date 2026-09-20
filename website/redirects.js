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

  // Retired generated-index category pages -> real section hub pages.
  // engineer/ and hacker/ _category_.json used link:{type:'generated-index'},
  // which emitted emoji-mangled /docs/category/* URLs. Replaced by index.md hubs.
  { from: '/docs/category/-engineer/', to: '/docs/engineer/' },
  { from: '/docs/category/\uFE0F-hacker/', to: '/docs/hacker/' },

  // Remaining generated-index category pages retired in favour of real sub-hubs.
  { from: '/docs/category/ai/', to: '/docs/engineer/AI/' },
  { from: '/docs/category/guides/', to: '/docs/engineer/guides/' },
  { from: '/docs/category/\uFE0F-projects/', to: '/docs/engineer/Projects/' },

  // Study folders whose README carries a slug override, so the bare folder URL
  // 404s. Redirect to the study guide rather than duplicating it as a hub.
  { from: '/docs/study/CKS/', to: '/docs/study/CKS/kubernetes-security-specialist-cks-study-guide/' },
  { from: '/docs/study/CKA/', to: '/docs/study/CKA/kubernetes-administrator-cka-study-guide/' },
  { from: '/docs/study/SAA-03/', to: '/docs/study/SAA-03/aws-solutions-architect-associate-study-guide/' },

  // GA export Apr–Jul 2026: paths with traffic that 404 on current build
  ...gaRedirects,
];
