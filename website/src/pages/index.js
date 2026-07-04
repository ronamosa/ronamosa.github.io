import React from "react";
import Link from '@docusaurus/Link';
import Layout from '@theme/Layout';
import Head from '@docusaurus/Head';
import { usePluginData } from '@docusaurus/useGlobalData';
import BeehiivEmbed from '@site/src/components/BeehiivEmbed';
import NewsletterPitch from '@site/src/components/NewsletterPitch';
import {
  FLAGSHIP_ESSAY,
  HOMEPAGE_TITLE,
  NEWSLETTER_DESCRIPTION,
  buildHomepageDescription,
} from '@site/src/data/siteConstants';

import styles from './index.module.css';

function trackCardClick(cardName, destination) {
  if (typeof window !== 'undefined' && window.gtag) {
    window.gtag('event', 'homepage_card_click', {
      card_name: cardName,
      link_destination: destination,
      event_category: 'homepage_engagement',
      event_label: cardName,
    });
  }
}

function ContentCard({ icon, title, count, countLabel, description, linkText, linkTo, featured }) {
  return (
    <div className={styles.card}>
      <div className={styles.cardHeader}>
        <span className={styles.cardIcon} aria-hidden="true">{icon}</span>
        <span className={styles.cardCount}>{count}+ {countLabel}</span>
      </div>
      <Link
        className={styles.cardBodyLink}
        to={linkTo}
        onClick={() => trackCardClick(title, linkTo)}
      >
        <h3 className={styles.cardTitle}>{title}</h3>
        <p className={styles.cardDescription}>{description}</p>
      </Link>
      {featured && (
        <p className={styles.latestPost}>
          Featured:{' '}
          <Link
            to={featured.to}
            className={styles.featuredLink}
            onClick={() => trackCardClick(`${title} — featured`, featured.to)}
          >
            {featured.title}
          </Link>
        </p>
      )}
      <Link
        className={styles.cardLink}
        to={linkTo}
        onClick={() => trackCardClick(title, linkTo)}
      >
        {linkText} <span className={styles.arrow}>→</span>
      </Link>
    </div>
  );
}

function NewsletterCard() {
  return (
    <div className={`${styles.card} ${styles.newsletterCard}`}>
      <div className={styles.cardHeader}>
        <span className={styles.cardIcon}>📬</span>
      </div>
      <h3 className={styles.cardTitle}>Newsletter</h3>
      <p className={styles.cardDescription}>
        <NewsletterPitch
          punchlineClassName={styles.newsletterPunchline}
          taglineClassName={styles.newsletterTagline}
        />
      </p>
      <BeehiivEmbed utmSource="site" utmMedium="home" variant="compact" />
    </div>
  );
}

function Home() {
  const { displayBlogCount, displayDocsCount } = usePluginData('content-counts');
  const metaDescription = buildHomepageDescription(displayDocsCount);

  return (
    <Layout title={HOMEPAGE_TITLE} description={metaDescription}>
      <Head>
        <script type="application/ld+json">
          {JSON.stringify({
            "@context": "https://schema.org",
            "@type": "WebSite",
            "name": "The Uncommon Engineer",
            "url": "https://www.uncommonengineer.com",
            "description": metaDescription,
            "author": {
              "@type": "Person",
              "name": "Ron Amosa",
              "url": "https://www.uncommonengineer.com/about",
              "jobTitle": "Senior Solutions Architect",
              "sameAs": [
                "https://www.linkedin.com/in/ron-amosa/",
                "https://github.com/ronamosa",
                "https://www.youtube.com/@uncommonengineer"
              ]
            }
          })}
        </script>
      </Head>
      <main className={styles.mainContainer}>
        <section className={styles.heroSection}>
          <div className={styles.heroContainer}>
            <div className={styles.heroImageWrapper}>
              <img
                src="/img/profile.svg"
                alt="Ron Amosa"
                className={styles.heroImage}
              />
            </div>

            <div className={styles.heroContent}>
              <span className={styles.heroName}>Ron Amosa</span>
              <h1 className={styles.heroTitle}>The Uncommon Engineer</h1>
              <p className={styles.heroSubtitle}>
                Mastery before rebellion.
              </p>
              <p className={styles.heroTagline}>
                Builder. Anarchist. Pasifika.
              </p>
              <p className={styles.heroDescription}>
                Senior Solutions Architect and writer exploring cloud infrastructure,
                AI sovereignty, and the politics of technology through a Pacific lens.
              </p>
              <div className={styles.heroCtas}>
                <Link className={styles.heroCtaPrimary} to="/docs/">
                  Start here <span className={styles.arrow}>→</span>
                </Link>
                <a className={styles.heroCtaSecondary} href="#explore">
                  Browse the work <span className={styles.arrow}>→</span>
                </a>
              </div>
            </div>
          </div>
          <div className={styles.scrollIndicator}>
            <a href="#explore" aria-label="Scroll to content">
              <div className={styles.scrollChevron} />
            </a>
          </div>
        </section>

        <section id="explore" className={styles.cardsSection}>
          <h2 className={styles.sectionHeading}>What You&apos;ll Find Here</h2>
          <div className={styles.cardsContainer}>
            <ContentCard
              icon="📰"
              title="Analysis & Essays"
              count={displayBlogCount}
              countLabel="Essays"
              description="Deep-dive essays exploring how technology intersects with power, sovereignty, and Pacific identity."
              linkText="Browse Analysis"
              linkTo="/blog/"
              featured={FLAGSHIP_ESSAY}
            />

            <ContentCard
              icon="🔧"
              title="Technical Docs"
              count={displayDocsCount}
              countLabel="Guides"
              description="Battle-tested guides on cloud architecture, Kubernetes, security, and infrastructure automation."
              linkText="Browse Docs"
              linkTo="/docs/"
            />

            <NewsletterCard />
          </div>
        </section>
      </main>
    </Layout>
  );
}

export default Home;
