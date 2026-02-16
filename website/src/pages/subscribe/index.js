import React, { useEffect } from 'react';
import useDocusaurusContext from "@docusaurus/useDocusaurusContext";
import Layout from "@theme/Layout";
import styles from "./styles.module.css";

function Subscribe() {
  const context = useDocusaurusContext();
  const { siteConfig = {} } = context;

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
    <Layout title="Subscribe" description="Subscribe to The Uncommon Engineer newsletter">
      <main className={styles.subscribePage}>
        <div className={styles.subscribeContainer}>
          <h1 className={styles.title}>Subscribe to the Newsletter</h1>
          <p className={styles.subtitle}>
            A Pacific Islander inside big tech, writing my thoughts on learning about, building, and deploying the machines that educate, empower, and exploit our society.
          </p>
          <p className={styles.subtitle}>
            A new essay in your inbox every fortnight. Free. Unsubscribe anytime.
          </p>
          
          <div className={styles.embedContainer}>
            <iframe 
              src="https://subscribe-forms.beehiiv.com/6098c229-772a-4563-8e9b-8e44aa11992f"
              className="beehiiv-embed"
              data-test-id="beehiiv-embed"
              frameBorder="0"
              scrolling="no"
              style={{
                width: '100%',
                height: '160px',
                margin: 0,
                backgroundColor: 'transparent',
              }}
            />
          </div>

          <p className={styles.note}>
            No spam. Unsubscribe anytime.
          </p>
        </div>
      </main>
    </Layout>
  );
}

export default Subscribe;

