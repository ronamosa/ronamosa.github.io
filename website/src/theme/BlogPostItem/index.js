import React from 'react';
import BlogPostItem from '@theme-original/BlogPostItem';
import {useBlogPost} from '@docusaurus/plugin-content-blog/client';
import {BlogPostingSchema} from '@site/src/components/StructuredData';
import {SITE_URL} from '@site/src/data/geoContent';
import styles from './styles.module.css';

function toAbsoluteUrl(path) {
  if (!path) return undefined;
  if (path.startsWith('http')) return path;
  return `${SITE_URL}${path.startsWith('/') ? path : `/${path}`}`;
}

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
          href="/newsletter?utm_source=site&utm_medium=blog"
          className={styles.ctaButton}
          onClick={trackNewsletterCtaClick}
        >
          Get the newsletter →
        </a>
      </div>
    </div>
  );
}

export default function BlogPostItemWrapper(props) {
  const {metadata, isBlogPostPage} = useBlogPost();
  const pageUrl = toAbsoluteUrl(metadata.permalink);
  const datePublished = metadata.date
    ? new Date(metadata.date).toISOString().split('T')[0]
    : undefined;
  const image = metadata.frontMatter?.image
    ? toAbsoluteUrl(metadata.frontMatter.image)
    : toAbsoluteUrl('/img/social-card.jpg');

  return (
    <>
      {isBlogPostPage && (
        <BlogPostingSchema
          headline={metadata.title}
          description={metadata.description}
          url={pageUrl}
          datePublished={datePublished}
          dateModified={datePublished}
          image={image}
        />
      )}
      <BlogPostItem {...props} />
      {isBlogPostPage && <NewsletterCta />}
    </>
  );
}
