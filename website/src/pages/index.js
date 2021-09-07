import React, { useEffect, useRef, useState } from "react";
import clsx from 'clsx';

import Link from '@docusaurus/Link';
import useBaseUrl from "@docusaurus/useBaseUrl";
import useDocusaurusContext from "@docusaurus/useDocusaurusContext";
import Layout from '@theme/Layout';

import styles from './index.module.css';
import SocialLinks from "./components/_SocialLinks";

function Home() {
  const context = useDocusaurusContext();
  const { siteConfig = {} } = context;

  return (
    <Layout title="Home" description={siteConfig.tagline}>
      <header className={styles.heroBanner}>
        <div className="container">
          <div className={styles.heroBannerText}>
            <p className="colorSuccess">
              <b>Hi, my name is</b>
            </p>
            <h1>
              <span className="colorWarning">Ron</span>{" "}
              <span className="colorDanger">Amosa.</span>
            </h1>
            <p>I'm a Cloud Platform Security Engineer 💻.</p>
            <p>Part Blog. Part <a href="https://maggieappleton.com/garden-history">Digital Garden</a> 🌱.</p>
            <p>This is where I learn in public 📚.</p>
            <SocialLinks />
            <nav className={clsx("pagination-nav", styles.heroBannerButton)}>
              <div className="pagination-nav__item">
                <Link className="pagination-nav__link" to={useBaseUrl("/docs/")}>
                  <div className="pagination-nav__sublabel">ready to go?</div>
                  <div className="pagination-nav__label">Start Here</div>
                </Link>
              </div>
            </nav>
          </div>
        </div>
      </header>
    </Layout>
  );
}

export default Home;