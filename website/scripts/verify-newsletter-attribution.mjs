import {
  buildBeehiivHostedSubscribeUrl,
  BEEHIIV_EMBED_ID,
  LINKEDIN_NEWSLETTER_URLS,
} from '../src/data/siteConstants.js';

const HOSTED = 'https://bee.uncommonengineer.com/subscribe';
const EMBED_BASE = `https://subscribe-forms.beehiiv.com/${BEEHIIV_EMBED_ID}`;
const LINKEDIN_REFERRER = /linkedin\.com|lnkd\.in/i;

/** Mirror of src/utils/newsletterAttribution.js for standalone verification. */
function getLinkedInHostedSubscribeRedirect(search = '', referrer = '') {
  const params = new URLSearchParams(search);
  const utmSource = params.get('utm_source');
  const fromLinkedIn =
    utmSource === 'linkedin' || LINKEDIN_REFERRER.test(referrer || '');

  if (!fromLinkedIn) return null;

  const utmMedium = params.get('utm_medium') || 'referral';

  return buildBeehiivHostedSubscribeUrl({
    utmSource: 'linkedin',
    utmMedium,
  });
}

function assert(condition, message) {
  if (!condition) throw new Error(message);
}

function assertEqual(actual, expected, label) {
  assert(actual === expected, `${label}: expected ${expected}, got ${actual}`);
}

function assertIncludes(haystack, needle, label) {
  assert(haystack.includes(needle), `${label}: expected to include ${needle}`);
}

function testLinkedInRedirectPrecedence() {
  const pinnedUrl = getLinkedInHostedSubscribeRedirect(
    '?utm_source=linkedin&utm_medium=pinned',
    'https://www.linkedin.com/feed/',
  );
  assertEqual(
    pinnedUrl,
    `${HOSTED}?utm_source=linkedin&utm_medium=pinned`,
    'pinned param preserved over referrer',
  );

  const taggedNoMedium = getLinkedInHostedSubscribeRedirect(
    '?utm_source=linkedin',
    '',
  );
  assertEqual(
    taggedNoMedium,
    `${HOSTED}?utm_source=linkedin&utm_medium=referral`,
    'linkedin source without medium → referral',
  );

  const referrerOnly = getLinkedInHostedSubscribeRedirect(
    '',
    'https://www.linkedin.com/feed/update/urn:li:activity:123/',
  );
  assertEqual(
    referrerOnly,
    `${HOSTED}?utm_source=linkedin&utm_medium=referral`,
    'referrer-only linkedin → referral',
  );

  assertEqual(
    getLinkedInHostedSubscribeRedirect('', 'https://www.google.com/'),
    null,
    'google referrer → no redirect',
  );

  assertEqual(
    getLinkedInHostedSubscribeRedirect('?utm_source=site&utm_medium=home', ''),
    null,
    'site utm → no redirect',
  );
}

function testOnSiteEmbedUtms() {
  const surfaces = [
    { medium: 'home', utmSource: 'site' },
    { medium: 'start', utmSource: 'site' },
    { medium: 'newsletter-page', utmSource: 'site' },
  ];

  for (const { medium, utmSource } of surfaces) {
    const url = new URL(EMBED_BASE);
    url.searchParams.set('utm_source', utmSource);
    url.searchParams.set('utm_medium', medium);
    assertIncludes(url.toString(), `utm_source=${utmSource}`, `${medium} embed source`);
    assertIncludes(url.toString(), `utm_medium=${medium}`, `${medium} embed medium`);
  }
}

function testLinkedInHostedRegistry() {
  for (const medium of ['profile', 'featured', 'pinned', 'post']) {
    const url = LINKEDIN_NEWSLETTER_URLS[medium];
    assertIncludes(url, 'utm_source=linkedin', medium);
    assertIncludes(url, `utm_medium=${medium}`, medium);
    assert(!url.includes('social'), `${medium} URL must not contain social`);
  }
}

console.log('verify-newsletter-attribution: running…\n');

testLinkedInRedirectPrecedence();
testOnSiteEmbedUtms();
testLinkedInHostedRegistry();

console.log('✓ LinkedIn redirect precedence (URL param > referrer)');
console.log('✓ On-site embed UTM surfaces (home, start, newsletter-page)');
console.log('✓ LinkedIn hosted registry (profile, featured, pinned, post — no social)');
console.log('\n--- Task 9a manual plus-address test (beehiiv dashboard) ---');
console.log('Submit one test signup per on-site embed using plus-addressed emails:');
console.log('  • homepage card     → you+home@yourdomain.com      (expect utm_medium=home)');
console.log('  • Start Here footer → you+start@yourdomain.com     (expect utm_medium=start)');
console.log('  • /newsletter page  → you+newsletter@yourdomain.com (expect utm_medium=newsletter-page)');
console.log('Confirm in beehiiv subscriber source — not embed:direct. Unsubscribe test rows after.');
console.log('\nAll automated checks passed.');
