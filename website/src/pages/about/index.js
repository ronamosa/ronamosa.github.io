import React from 'react';
import clsx from 'clsx';

import Link from "@docusaurus/Link";
import useBaseUrl from "@docusaurus/useBaseUrl";
import useDocusaurusContext from "@docusaurus/useDocusaurusContext";
import Layout from "@theme/Layout";

import styles from "./styles.module.css";

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
                <img src={useBaseUrl("img/profile.jpg")} />
              </div>
              <div className="col col--9">
                <h2>Talofa 👋</h2>
                <p>
                  I'm Ron, a Partner Solution Architect for the Pacific Islands, at <a href='https://aws.amazon.com/'>Amazon Web Services</a>
                </p>
                <p>
                  In a previous life I was a Platform Security Engineer at Salesforce/Heroku. And before that, an <a href="https://sre.google/">SRE</a> and DevOps Engineer building CICD environments and Production-Ready Kubernetes Infrastructure for banks and insurance companies.
                </p>
                <p>
                I am New Zealand born Samoan, Tuvalu and Chinese. 
                </p>
                <p>
                When I'm not behind a computer, I play the drums, I train <a href="https://www.instagram.com/ron.amosa/">Brazilian Jiu Jitsu</a> and ride my motorbike.
                </p>
                <p>
                  <i>
                    A big thank-you and credit for the theme for my blog goes to <a href="https://evantay.com/">Evan Tay</a> who made his blog setup available on his <a href="https://github.com/DigiPie/kaya-folio">GitHub</a> for people to use 🙏.
                  </i>
                </p>
              </div>
            </div>
          </div>
        </div>{" "}
        <section className={styles.directoryBody}>
          <div className="container">
            <h3>Continue exploring?</h3>
            <nav className="pagination-nav">
              <div className="pagination-nav__item">
                <Link
                  className="pagination-nav__link"
                  to={useBaseUrl("projects/")}
                >
                  <div className="pagination-nav__sublabel">Check out</div>
                  <div className="pagination-nav__label">My projects</div>
                </Link>
              </div>
              <div className="pagination-nav__item pagination-nav__item--next">
                <a
                  className="pagination-nav__link"
                  href={useBaseUrl("pdf/resume.pdf")}
                >
                  <div className="pagination-nav__sublabel">Download</div>
                  <div className="pagination-nav__label">My resume</div>
                </a>
              </div>
            </nav>
          </div>
        </section>
      </main>
    </Layout>
  );
}

export default About;