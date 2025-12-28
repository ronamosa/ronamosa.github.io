import React from "react";
import Link from '@docusaurus/Link';
import useDocusaurusContext from "@docusaurus/useDocusaurusContext";
import Layout from '@theme/Layout';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faLinkedin, faGithub, faYoutube } from "@fortawesome/free-brands-svg-icons";

import styles from './index.module.css';

// Dynamic counts
const CONTENT_COUNTS = {
  essays: 56,
  docs: 170,
  subscribers: 180,
};

function ContentCard({ icon, title, count, countLabel, description, linkText, linkTo }) {
  return (
    <Link className={styles.card} to={linkTo}>
      <div className={styles.cardHeader}>
        <span className={styles.cardIcon}>{icon}</span>
        <span className={styles.cardCount}>{count}+ {countLabel}</span>
      </div>
      <h3 className={styles.cardTitle}>{title}</h3>
      <p className={styles.cardDescription}>{description}</p>
      <span className={styles.cardLink}>
        {linkText} <span className={styles.arrow}>→</span>
      </span>
    </Link>
  );
}

function NewsletterCard() {
  const openSubscribePopup = () => {
    window.open(
      '/subscribe',
      'subscribe',
      'width=550,height=650,scrollbars=yes'
    );
  };

  return (
    <div className={styles.card + ' ' + styles.newsletterCard}>
      <div className={styles.cardHeader}>
        <span className={styles.cardIcon}>📬</span>
        <span className={styles.cardCount}>{CONTENT_COUNTS.subscribers}+ Subscribers</span>
      </div>
      <h3 className={styles.cardTitle}>Newsletter</h3>
      <p className={styles.cardDescription}>
        Fortnightly analysis delivered to your inbox.
      </p>
      <button 
        onClick={openSubscribePopup}
        className={styles.subscribeButton}
      >
        Subscribe <span className={styles.arrow}>→</span>
      </button>
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

  return (
    <Layout title="Home" description={siteConfig.tagline}>
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
              <SocialIcons />
            </div>
          </div>
        </section>

        {/* Cards Section */}
        <section className={styles.cardsSection}>
          <div className={styles.cardsContainer}>
            <ContentCard
              icon="📰"
              title="Analysis & Essays"
              count={CONTENT_COUNTS.essays}
              countLabel="Essays"
              description="Political analysis, AI sovereignty, digital colonialism."
              linkText="Browse Analysis"
              linkTo="/blog"
            />

            <ContentCard
              icon="🔧"
              title="Technical Docs"
              count={CONTENT_COUNTS.docs}
              countLabel="Guides"
              description="Cloud architecture, Kubernetes, security, infrastructure."
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
