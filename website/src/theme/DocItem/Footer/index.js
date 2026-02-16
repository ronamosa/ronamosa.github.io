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
        <p>
          <span className={styles.emoji}>📬</span> I also write a fortnightly newsletter — my thoughts on the machines that educate, empower, and exploit our society.{' '}
          <a href="/subscribe" onClick={trackNewsletterCtaClick}>Subscribe here.</a>
        </p>
      </div>
    </>
  );
}
