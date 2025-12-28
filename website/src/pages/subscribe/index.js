import React from 'react';
import useDocusaurusContext from "@docusaurus/useDocusaurusContext";
import Layout from "@theme/Layout";
import styles from "./styles.module.css";

function Subscribe() {
  const context = useDocusaurusContext();
  const { siteConfig = {} } = context;

  return (
    <Layout title="Subscribe" description="Subscribe to The Uncommon Engineer newsletter">
      <main className={styles.subscribePage}>
        <div className={styles.subscribeContainer}>
          <h1 className={styles.title}>Subscribe to the Newsletter</h1>
          <p className={styles.subtitle}>
            Fortnightly analysis from inside Big Tech. AI sovereignty, infrastructure patterns, digital colonialism.
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

