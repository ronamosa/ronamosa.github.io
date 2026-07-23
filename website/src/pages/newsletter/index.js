import React, { useEffect, useState } from 'react';
import Layout from '@theme/Layout';
import BeehiivEmbed from '@site/src/components/BeehiivEmbed';
import NewsletterPitch from '@site/src/components/NewsletterPitch';
import {
  NEWSLETTER_DESCRIPTION,
  NEWSLETTER_OBJECTION,
} from '@site/src/data/siteConstants';
import {
  getLinkedInHostedSubscribeRedirect,
  getNewsletterEmbedUtms,
} from '@site/src/utils/newsletterAttribution';
import styles from './styles.module.css';

function Newsletter() {
  const [redirecting, setRedirecting] = useState(false);
  const [embedUtms, setEmbedUtms] = useState(null);

  useEffect(() => {
    const redirectUrl = getLinkedInHostedSubscribeRedirect(
      window.location.search,
      document.referrer,
    );

    if (redirectUrl) {
      setRedirecting(true);
      if (window.gtag) {
        window.gtag('event', 'linkedin_hosted_redirect', {
          event_category: 'newsletter_funnel',
          redirect_target: redirectUrl,
          referral_source: document.referrer || 'direct',
          attribution_medium: new URL(redirectUrl).searchParams.get('utm_medium'),
        });
        // Consistent redirect tag so GA4 filtering can exclude this off-site
        // interstitial from content engagement/bounce reports.
        window.gtag('event', 'redirect_interstitial', {
          event_category: 'redirect',
          redirect_target: 'newsletter-linkedin-inbound',
        });
      }
      window.location.replace(redirectUrl);
      return;
    }

    setEmbedUtms(getNewsletterEmbedUtms(window.location.search));

    if (window.gtag) {
      const referrer = document.referrer || 'direct';
      const source = referrer.includes(window.location.hostname)
        ? new URL(referrer).pathname
        : referrer;

      window.gtag('event', 'newsletter_page_view', {
        event_category: 'newsletter_funnel',
        referral_source: source,
      });
    }
  }, []);

  if (redirecting) {
    return (
      <Layout title="Redirect — Newsletter (LinkedIn)" description={NEWSLETTER_DESCRIPTION}>
        <main className={styles.newsletterPage}>
          <p className={styles.redirecting}>Redirecting to subscribe…</p>
        </main>
      </Layout>
    );
  }

  return (
    <Layout
      title="The Uncommon Engineer"
      description={`${NEWSLETTER_DESCRIPTION} ${NEWSLETTER_OBJECTION}`}
    >
      <main className={styles.newsletterPage}>
        <div className={styles.newsletterContainer}>
          <h1 className={styles.title}>The Uncommon Engineer</h1>
          <p className={styles.body}>
            <NewsletterPitch />
          </p>
          <p className={styles.objection}>{NEWSLETTER_OBJECTION}</p>

          {embedUtms && (
            <BeehiivEmbed
              utmSource={embedUtms.utmSource}
              utmMedium={embedUtms.utmMedium}
              height={180}
            />
          )}
        </div>
      </main>
    </Layout>
  );
}

export default Newsletter;
