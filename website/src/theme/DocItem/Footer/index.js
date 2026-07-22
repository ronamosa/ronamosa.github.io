import React from 'react';
import Footer from '@theme-original/DocItem/Footer';
import NewsletterPitch from '@site/src/components/NewsletterPitch';
import { NEWSLETTER_OBJECTION } from '@site/src/data/siteConstants';
import styles from './styles.module.css';

function trackNewsletterCtaClick() {
  if (typeof window !== 'undefined' && window.gtag) {
    window.gtag('event', 'newsletter_cta_click', {
      event_category: 'newsletter_funnel',
      cta_location: 'doc_footer',
      page_path: window.location.pathname,
    });
  }
}

export default function FooterWrapper(props) {
  return (
    <>
      <Footer {...props} />
      <div className={styles.newsletterCta}>
        <span className={styles.emoji} aria-hidden="true">✓</span>
        <div className={styles.ctaContent}>
          <p className={styles.lead}>
            <strong>Enjoying the docs? Good.</strong>
          </p>
          <p className={styles.body}>
            <NewsletterPitch
              context="doc"
              punchlineClassName={styles.punchline}
              taglineClassName={styles.tagline}
            />
          </p>
          <p className={styles.objection}>{NEWSLETTER_OBJECTION}</p>
          <a
            className={styles.ctaButton}
            href="/newsletter?ref=guide"
            onClick={trackNewsletterCtaClick}
          >
            Get the newsletter →
          </a>
        </div>
      </div>
    </>
  );
}
