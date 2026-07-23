import React, { useEffect } from 'react';
import Layout from '@theme/Layout';
import { LINKEDIN_NEWSLETTER_URLS } from '@site/src/data/siteConstants';
import styles from '../styles.module.css';

/** Vanity path for LinkedIn post bodies — on-domain link → hosted form with medium=post. */
export default function LinkedInNewsletterRedirect() {
  useEffect(() => {
    if (window.gtag) {
      window.gtag('event', 'linkedin_hosted_redirect', {
        event_category: 'newsletter_funnel',
        redirect_target: LINKEDIN_NEWSLETTER_URLS.post,
        referral_source: document.referrer || 'direct',
        cta_surface: 'newsletter-linkedin-vanity',
        attribution_medium: 'post',
      });
      // Consistent redirect tag so GA4 filtering can exclude this off-site
      // interstitial from content engagement/bounce reports.
      window.gtag('event', 'redirect_interstitial', {
        event_category: 'redirect',
        redirect_target: 'newsletter-linkedin-vanity',
      });
    }
    window.location.replace(LINKEDIN_NEWSLETTER_URLS.post);
  }, []);

  return (
    <Layout title="Redirect — Newsletter (LinkedIn)" description="The Uncommon Engineer newsletter">
      <main className={styles.newsletterPage}>
        <p className={styles.redirecting}>Redirecting to subscribe…</p>
      </main>
    </Layout>
  );
}
