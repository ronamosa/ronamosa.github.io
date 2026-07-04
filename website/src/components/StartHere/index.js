import React from 'react';
import Link from '@docusaurus/Link';
import { usePluginData } from '@docusaurus/useGlobalData';
import BeehiivEmbed from '@site/src/components/BeehiivEmbed';
import {
  CURATED_START_HERE,
  NEWSLETTER_DESCRIPTION,
  NEWSLETTER_OBJECTION,
} from '@site/src/data/siteConstants';
import styles from './styles.module.css';

function formatDate(dateStr) {
  const d = new Date(dateStr + 'T00:00:00');
  return d.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
}

export function Hero() {
  return (
    <div className={styles.hero}>
      <h2 className={styles.heroGreeting}>Talofa.</h2>
      <p className={styles.heroBio}>
        I'm Ron Amosa — Senior Solutions Architect at AWS, writer, and
        Pasifika technologist with 20+ years across SRE, cyber security,
        and solution architecture. Focused on AI, containers, Kubernetes,
        and cloud security.
      </p>
      <p className={styles.heroBio}>
        This site is a working lab book. Technical docs from the field, essays
        on power and technology, and the occasional rant about what the tech
        industry gets wrong.
      </p>
      <p className={styles.heroTagline}>Mastery before rebellion.</p>
    </div>
  );
}

export function SiteStats() {
  const { displayBlogCount, displayDocsCount } = usePluginData('content-counts');

  return (
    <div className={styles.stats}>
      <div className={styles.stat}>
        <span className={styles.statNumber}>{displayDocsCount}+</span>
        <span className={styles.statLabel}>Technical Guides</span>
      </div>
      <div className={styles.stat}>
        <span className={styles.statNumber}>{displayBlogCount}+</span>
        <span className={styles.statLabel}>Essays &amp; Analysis</span>
      </div>
    </div>
  );
}

export function CuratedStartHere() {
  return (
    <div className={styles.section}>
      <div className={styles.sectionHeader}>
        <h3 className={styles.sectionTitle}>Start with these</h3>
      </div>
      <div className={styles.curatedGrid}>
        {CURATED_START_HERE.map((item, i) => (
          <Link key={i} to={item.to} className={styles.curatedCard}>
            <span className={styles.curatedLabel}>{item.label}</span>
            <span className={styles.curatedTitle}>{item.title}</span>
          </Link>
        ))}
      </div>
    </div>
  );
}

export function RecentPosts() {
  const { recentPosts } = usePluginData('content-counts');
  if (!recentPosts?.length) return null;

  return (
    <div className={styles.section}>
      <div className={styles.sectionHeader}>
        <h3 className={styles.sectionTitle}>Latest Writing</h3>
        <Link to="/blog" className={styles.viewAll}>
          All essays <span className={styles.arrow}>&rarr;</span>
        </Link>
      </div>
      <div className={styles.postGrid}>
        {recentPosts.map((post, i) => (
          <Link key={i} to={post.permalink} className={styles.postCard}>
            <div className={styles.postMeta}>
              <span className={styles.postDate}>{formatDate(post.date)}</span>
            </div>
            <h4 className={styles.postTitle}>{post.title}</h4>
            {post.description && (
              <p className={styles.postDesc}>{post.description}</p>
            )}
          </Link>
        ))}
      </div>
    </div>
  );
}

export function Pathways() {
  const paths = [
    {
      label: 'Engineer',
      title: 'Cloud & Infrastructure',
      desc: 'AWS, Kubernetes, AI, security, and architecture projects.',
      to: '/docs/engineer/LAB/',
    },
    {
      label: 'Essays',
      title: 'Analysis & Essays',
      desc: 'AI sovereignty, digital colonialism, Pacific identity.',
      to: '/blog/',
    },
    {
      label: 'AI',
      title: 'AI & ML Projects',
      desc: 'LLM deployment, Bedrock, private AI, and agentic RAG.',
      to: '/docs/engineer/AI/',
    },
    {
      label: 'Homelab',
      title: 'Proxmox Hub',
      desc: 'The complete guide collection for Proxmox virtualization.',
      to: '/docs/engineer/LAB/proxmox-hub/',
    },
  ];

  return (
    <div className={styles.pathways}>
      {paths.map((p, i) => (
        <Link key={i} to={p.to} className={styles.pathway}>
          <div className={styles.pathwayLabel}>{p.label}</div>
          <div className={styles.pathwayTitle}>{p.title}</div>
          <div className={styles.pathwayDesc}>{p.desc}</div>
        </Link>
      ))}
    </div>
  );
}

export function RecentDocs() {
  const { recentDocs } = usePluginData('content-counts');
  if (!recentDocs?.length) return null;

  return (
    <div className={styles.section}>
      <div className={styles.sectionHeader}>
        <h3 className={styles.sectionTitle}>Recently Updated</h3>
        <Link to="/docs/" className={styles.viewAll}>
          All docs <span className={styles.arrow}>&rarr;</span>
        </Link>
      </div>
      <div className={styles.docGrid}>
        {recentDocs.map((doc, i) => (
          <Link key={i} to={doc.permalink} className={styles.docCard}>
            <span className={styles.docTitle}>{doc.title}</span>
            {doc.tags?.length > 0 && (
              <div className={styles.tags}>
                {doc.tags.slice(0, 4).map((tag, j) => (
                  <span key={j} className={styles.tag}>{tag}</span>
                ))}
              </div>
            )}
          </Link>
        ))}
      </div>
    </div>
  );
}

export function NewsletterCapture() {
  return (
    <div className={styles.newsletterSection}>
      <p className={styles.newsletterDescription}>{NEWSLETTER_DESCRIPTION}</p>
      <p className={styles.newsletterObjection}>{NEWSLETTER_OBJECTION}</p>
      <BeehiivEmbed utmSource="site" utmMedium="start" height={160} />
    </div>
  );
}
