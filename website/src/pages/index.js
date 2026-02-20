import React from "react";
import Link from '@docusaurus/Link';
import useDocusaurusContext from "@docusaurus/useDocusaurusContext";
import Layout from '@theme/Layout';
import Head from '@docusaurus/Head';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faLinkedin, faGithub, faYoutube } from "@fortawesome/free-brands-svg-icons";
import { usePluginData } from '@docusaurus/useGlobalData';

import styles from './index.module.css';

const SUBSCRIBER_COUNT = 180;

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

function ContentCard({ icon, title, count, countLabel, description, linkText, linkTo, latestLabel }) {
  return (
    <Link
      className={styles.card}
      to={linkTo}
      onClick={() => trackCardClick(title, linkTo)}
    >
      <div className={styles.cardHeader}>
        <span className={styles.cardIcon}>{icon}</span>
        <span className={styles.cardCount}>{count}+ {countLabel}</span>
      </div>
      <h3 className={styles.cardTitle}>{title}</h3>
      <p className={styles.cardDescription}>{description}</p>
      {latestLabel && (
        <p className={styles.latestPost}>Latest: {latestLabel}</p>
      )}
      <span className={styles.cardLink}>
        {linkText} <span className={styles.arrow}>→</span>
      </span>
    </Link>
  );
}

function NewsletterCard() {
  const openSubscribePopup = () => {
    trackCardClick('Newsletter', '/subscribe');
    window.open(
      '/subscribe',
      'subscribe',
      'width=550,height=650,scrollbars=yes'
    );
  };

  return (
    <div
      className={styles.card}
      onClick={openSubscribePopup}
      role="button"
      tabIndex={0}
      onKeyDown={(e) => { if (e.key === 'Enter') openSubscribePopup(); }}
      style={{ cursor: 'pointer' }}
    >
      <div className={styles.cardHeader}>
        <span className={styles.cardIcon}>📬</span>
        <span className={styles.cardCount}>{SUBSCRIBER_COUNT}+ Subscribers</span>
      </div>
      <h3 className={styles.cardTitle}>Newsletter</h3>
      <p className={styles.cardDescription}>
        Fortnightly analysis on tech, culture, and power -- delivered to your inbox.
      </p>
      <span className={styles.cardLink}>
        Subscribe <span className={styles.arrow}>→</span>
      </span>
    </div>
  );
}

function SocialIcons() {
  const socials = [
    { icon: faLinkedin, url: "https://www.linkedin.com/in/ron-amosa/", label: "LinkedIn" },
    { icon: faGithub, url: "https://github.com/ronamosa", label: "GitHub" },
    { icon: faYoutube, url: "https://www.youtube.com/@uncommonengineer", label: "YouTube" },
  ];

  return (
    <div className={styles.socialIcons}>
      {socials.map((social, idx) => (
        <a 
          key={idx}
          href={social.url} 
          target="_blank" 
          rel="noopener noreferrer"
          className={styles.socialIcon}
          aria-label={social.label}
        >
          <FontAwesomeIcon icon={social.icon} />
        </a>
      ))}
    </div>
  );
}

function Home() {
  const context = useDocusaurusContext();
  const { siteConfig = {} } = context;
  const { blogCount, docsCount, latestPost } = usePluginData('content-counts');

  return (
    <Layout
      title="Cloud Engineering, Kubernetes Guides & Political Analysis"
      description="170+ technical guides on cloud architecture, Kubernetes, and infrastructure security. 56+ essays on AI sovereignty, digital colonialism, and Pacific identity. By Ron Amosa."
    >
      <Head>
        <script type="application/ld+json">
          {JSON.stringify({
            "@context": "https://schema.org",
            "@type": "WebSite",
            "name": "The Uncommon Engineer",
            "url": "https://www.uncommonengineer.com",
            "description": "Technical guides on cloud engineering and Kubernetes, plus essays on AI sovereignty, digital colonialism, and Pacific identity.",
            "author": {
              "@type": "Person",
              "name": "Ron Amosa",
              "url": "https://www.uncommonengineer.com/about",
              "jobTitle": "Platform Engineer",
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
        {/* Hero Section */}
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
                Platform engineer and writer exploring cloud infrastructure,
                AI sovereignty, and the politics of technology through a Pacific lens.
              </p>
              <SocialIcons />
              <a className={styles.heroCta} href="#explore">
                Explore my work <span className={styles.arrow}>→</span>
              </a>
            </div>
          </div>
          <div className={styles.scrollIndicator}>
            <a href="#explore" aria-label="Scroll to content">
              <div className={styles.scrollChevron} />
            </a>
          </div>
        </section>

        {/* Cards Section */}
        <section id="explore" className={styles.cardsSection}>
          <h2 className={styles.sectionHeading}>What You'll Find Here</h2>
          <div className={styles.cardsContainer}>
            <ContentCard
              icon="📰"
              title="Analysis & Essays"
              count={blogCount}
              countLabel="Essays"
              description="Deep-dive essays exploring how technology intersects with power, sovereignty, and Pacific identity."
              linkText="Browse Analysis"
              linkTo="/blog"
              latestLabel={latestPost?.title}
            />

            <ContentCard
              icon="🔧"
              title="Technical Docs"
              count={docsCount}
              countLabel="Guides"
              description="Battle-tested guides on cloud architecture, Kubernetes, security, and infrastructure automation."
              linkText="Browse Docs"
              linkTo="/docs"
            />

            <NewsletterCard />
          </div>
        </section>
      </main>
    </Layout>
  );
}

export default Home;
