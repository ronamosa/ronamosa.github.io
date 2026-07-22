import { buildBeehiivHostedSubscribeUrl, LINKEDIN_NEWSLETTER_URLS } from '@site/src/data/siteConstants';

const LINKEDIN_REFERRER = /linkedin\.com|lnkd\.in/i;

const DEFAULT_NEWSLETTER_EMBED_UTMS = {
  utmSource: 'site',
  utmMedium: 'newsletter-page',
};

/**
 * UTMs for the /newsletter page embed — forwards the internal surface into the
 * Beehiiv subscribe attribution.
 *
 * Internal CTAs (announcement bar, guide footer, blog footer) pass the surface
 * via a non-utm `ref` param on purpose: a `utm_*` param on an internal link
 * makes GA4 start a fresh "site / <medium>" session on every click, fragmenting
 * the true acquisition source. `ref` is invisible to GA4, so acquisition data
 * stays intact while Beehiiv still gets source=site, medium=<surface>.
 *
 * `utm_medium` is still read as a fallback for legacy/shared links that predate
 * the `ref` switch, and `utm_source` is honoured for real external inbound.
 */
export function getNewsletterEmbedUtms(search = '') {
  const params = new URLSearchParams(search);
  const surface = params.get('ref') || params.get('utm_medium');
  return {
    utmSource: params.get('utm_source') || DEFAULT_NEWSLETTER_EMBED_UTMS.utmSource,
    utmMedium: surface || DEFAULT_NEWSLETTER_EMBED_UTMS.utmMedium,
  };
}

/**
 * Returns hosted beehiiv URL when traffic is LinkedIn-attributed; else null.
 * URL utm params take precedence over referrer sniffing.
 */
export function getLinkedInHostedSubscribeRedirect(search = '', referrer = '') {
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

export { LINKEDIN_NEWSLETTER_URLS };
