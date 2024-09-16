import React from 'react';
import clsx from 'clsx';
import Link from "@docusaurus/Link";
import useBaseUrl from "@docusaurus/useBaseUrl";
import useDocusaurusContext from "@docusaurus/useDocusaurusContext";
import Layout from "@theme/Layout";
import styles from "./styles.module.css";
import { AboutBody, WorkItems, EducationItems } from '../../data/_About';

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
                <img src={useBaseUrl("img/profile.jpg")} alt="Profile" />
              </div>
              <div className="col col--9">
                <AboutBody />
                
                <h2>Work Experience</h2>
                {WorkItems.map((item, index) => (
                  <div key={index} className="work-item">
                    <h3><a href={item.link}>{item.location}</a></h3>
                    <p>{item.position}</p>
                    <p>{item.period}</p>
                    {item.description}
                  </div>
                ))}

                <h2>Education and Certifications</h2>
                {EducationItems.map((item, index) => (
                  <div key={index} className="education-item">
                    <h3><a href={item.link}>{item.certification}</a></h3>
                    <p>{item.period}</p>
                    {item.description}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
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