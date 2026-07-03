import React, { useEffect } from 'react';
import Layout from '@theme/Layout';
import BeehiivEmbed from '@site/src/components/BeehiivEmbed';
import {
  NEWSLETTER_DESCRIPTION,
  NEWSLETTER_OBJECTION,
} from '@site/src/data/siteConstants';
import styles from './styles.module.css';

function Newsletter() {
  useEffect(() => {
    if (typeof window !== 'undefined' && window.gtag) {
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

  return (
    <Layout
      title="The Uncommon Engineer"
      description={`${NEWSLETTER_DESCRIPTION} ${NEWSLETTER_OBJECTION}`}
    >
      <main className={styles.newsletterPage}>
        <div className={styles.newsletterContainer}>
          <h1 className={styles.title}>The Uncommon Engineer</h1>
          <p className={styles.body}>{NEWSLETTER_DESCRIPTION}</p>
          <p className={styles.objection}>{NEWSLETTER_OBJECTION}</p>

          <BeehiivEmbed utmSource="site" utmMedium="newsletter-page" height={180} />
        </div>
      </main>
    </Layout>
  );
}

export default Newsletter;
