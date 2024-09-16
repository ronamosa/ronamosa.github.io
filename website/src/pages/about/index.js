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
                <p>
                <h2>👋🏽 Talofa!</h2>
                <br/>
                I'm Ali'imuamua Ron Amosa, aka <a href="https://www.uncommonengineer.com/about" target="_blank" rel="noopener noreferrer">"The Uncommon Engineer"</a>.
                <br/>
                <br/>
                A Pasifika technologist with Samoan, Tuvaluan, and Chinese heritage. With over two decades of engineering experience, I currently serve as a Senior Solution Architect at AWS, specializing in AI, containers, Kubernetes, and cloud security. My journey through SRE, Cyber Security, and Solution Architecture has given me a comprehensive view of the tech stack, from infrastructure, to code, risk and business outcomes.
                </p>
                <p>
                This website is my digital lab book, mainly random, unfiltered record of experiments, technical documentation, and ongoing learnings. Here, I'll scribble down anything that I find interesting, and share my thoughts on the tech industry, when it's not already in my newsletter.
                <br/>
                <br/>
                I'm also a husband, father, a BJJ black belt, Drummer, tattoo and motorcycle enthusiast.
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