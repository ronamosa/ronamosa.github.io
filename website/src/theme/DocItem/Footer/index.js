import React from 'react';
import Footer from '@theme-original/DocItem/Footer';
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
        <p className={styles.lead}>
          <strong>This guide worked? Good.</strong>
        </p>
        <p>
          I write like this every fortnight — AI, infra, security. What worked,
          what broke, what the marketing didn&apos;t mention. No polish, no hype.
          One email a fortnight. Leave whenever.
        </p>
        <p>
          <a
            href="/newsletter?utm_source=site&utm_medium=guide"
            onClick={trackNewsletterCtaClick}
          >
            Get the newsletter →
          </a>
        </p>
      </div>
    </>
  );
}
