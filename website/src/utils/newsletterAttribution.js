import { buildBeehiivHostedSubscribeUrl, LINKEDIN_NEWSLETTER_URLS } from '@site/src/data/siteConstants';

const LINKEDIN_REFERRER = /linkedin\.com|lnkd\.in/i;

const DEFAULT_NEWSLETTER_EMBED_UTMS = {
  utmSource: 'site',
  utmMedium: 'newsletter-page',
};

/**
 * UTMs for the /newsletter page embed — forwards URL params from link hops
 * (guide footer, announcement bar, blog footer) before falling back to defaults.
 */
export function getNewsletterEmbedUtms(search = '') {
  const params = new URLSearchParams(search);
  return {
    utmSource: params.get('utm_source') || DEFAULT_NEWSLETTER_EMBED_UTMS.utmSource,
    utmMedium: params.get('utm_medium') || DEFAULT_NEWSLETTER_EMBED_UTMS.utmMedium,
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
