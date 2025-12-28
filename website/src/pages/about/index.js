import React from 'react';
import clsx from 'clsx';
import useBaseUrl from "@docusaurus/useBaseUrl";
import useDocusaurusContext from "@docusaurus/useDocusaurusContext";
import Layout from "@theme/Layout";
import styles from "./styles.module.css";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faLinkedin, faYoutube, faTwitter } from '@fortawesome/free-brands-svg-icons';

function About() {
  const context = useDocusaurusContext();
  const { siteConfig = {} } = context;

  return (
    <Layout title="About" description={siteConfig.tagline}>
      <header className={styles.aboutHeader}>
        <h2 className="underlineColorSuccess">About me</h2>
      </header>
      <main id="main">
        <div className={styles.aboutBody}>
          <div className="container">
            <div className="row padding-bottom--lg">
              <div className={clsx("col col--3", styles.profilePic)}>
                <img src={useBaseUrl("img/profile.svg")} alt="Profile" />
              </div>
              <div className="col col--9">
                <h2>👋🏽 Talofa!</h2>
                <p>
                I'm Ali'imuamua Ron Amosa — <strong>The Uncommon Engineer</strong>.
                </p>
                <p>
                I'm a Pasifika technologist of Samoan, Tuvaluan, and Chinese heritage. For more than two decades I've worked across SRE, cyber security, and solution architecture. Today I'm a Senior Solutions Architect at AWS, focused on AI, containers, Kubernetes, and cloud security — the full stack from infrastructure and code, through risk, governance, and business outcomes.
                </p>
                <h3>This site is my working lab book.</h3>
                <p>
                It's where I document experiments, random projects, lab builds, hacking walk-throughs, hard-won technical lessons, things I'm still figuring out, and thoughts on the tech industry, which is usually part of my newsletter.
                </p>
                <p>
                Outside of work, I'm a husband and father, a BJJ black belt, drummer, and a tattoo and motorcycle enthusiast.
                </p>
                <div className={styles.socialIcons}>
                  <a href="https://www.linkedin.com/in/ron-amosa/" target="_blank" rel="noopener noreferrer" className={styles.socialIcon}>
                    <FontAwesomeIcon icon={faLinkedin} size="2x" />
                  </a>
                  <a href="https://www.youtube.com/@uncommonengineer" target="_blank" rel="noopener noreferrer" className={styles.socialIcon}>
                    <FontAwesomeIcon icon={faYoutube} size="2x" />
                  </a>
                  <a href="https://x.com/uncommonengneer" target="_blank" rel="noopener noreferrer" className={styles.socialIcon}>
                    <FontAwesomeIcon icon={faTwitter} size="2x" />
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </Layout>
  );
}

export default About;
