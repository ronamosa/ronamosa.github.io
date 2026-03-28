import React from 'react';
import BlogPostItem from '@theme-original/BlogPostItem';
import {useBlogPost} from '@docusaurus/plugin-content-blog/client';
import styles from './styles.module.css';

function trackNewsletterCtaClick() {
  if (typeof window !== 'undefined' && window.gtag) {
    window.gtag('event', 'newsletter_cta_click', {
      event_category: 'newsletter_funnel',
      cta_location: 'blog_post_footer',
      page_path: window.location.pathname,
    });
  }
}

function NewsletterCta() {
  return (
    <div className={styles.newsletterCta}>
      <span className={styles.emoji}>✉️</span>
      <div className={styles.ctaContent}>
        <p className={styles.ctaText}>
          Want posts like this straight in your inbox every fortnight?
        </p>
        <a
          href="/subscribe"
          className={styles.ctaButton}
          onClick={trackNewsletterCtaClick}
        >
          Subscribe to the mailing list
        </a>
      </div>
    </div>
  );
}

export default function BlogPostItemWrapper(props) {
  const {isBlogPostPage} = useBlogPost();
  return (
    <>
      <BlogPostItem {...props} />
      {isBlogPostPage && <NewsletterCta />}
    </>
  );
}
