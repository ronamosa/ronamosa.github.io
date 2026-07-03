import { buildBeehiivHostedSubscribeUrl, LINKEDIN_NEWSLETTER_URLS } from '@site/src/data/siteConstants';

const LINKEDIN_REFERRER = /linkedin\.com|lnkd\.in/i;

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
