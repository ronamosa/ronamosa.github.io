import React from 'react';
import Footer from '@theme-original/DocItem/Footer';
import styles from './styles.module.css';

export default function FooterWrapper(props) {
  return (
    <>
      <Footer {...props} />
      <div className={styles.newsletterCta}>
        <p>
          <span className={styles.emoji}>📧</span> I also write a fortnightly newsletter — deeper takes on tech, power, and what we're actually building.{' '}
          <a href="/subscribe">Subscribe here.</a>
        </p>
      </div>
    </>
  );
}
