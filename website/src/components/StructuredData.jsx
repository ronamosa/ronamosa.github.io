import React from 'react';
import Head from '@docusaurus/Head';
import { AUTHOR_PERSON } from '@site/src/data/geoContent';

export function ArticleSchema({
  type = 'Article',
  headline,
  description,
  url,
  datePublished,
  dateModified,
  image,
}) {
  const schema = {
    '@context': 'https://schema.org',
    '@type': type,
    headline,
    author: AUTHOR_PERSON,
    ...(description && { description }),
    ...(url && { url, mainEntityOfPage: url }),
    ...(datePublished && { datePublished }),
    ...(dateModified && { dateModified }),
    ...(image && { image }),
  };

  return (
    <Head>
      <script type="application/ld+json">{JSON.stringify(schema)}</script>
    </Head>
  );
}

export function BlogPostingSchema(props) {
  return <ArticleSchema type="BlogPosting" {...props} />;
}

export function FAQSchema({ items }) {
  const schema = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    "mainEntity": items.map(({ question, answer }) => ({
      "@type": "Question",
      "name": question,
      "acceptedAnswer": {
        "@type": "Answer",
        "text": answer
      }
    }))
  };

  return (
    <Head>
      <script type="application/ld+json">{JSON.stringify(schema)}</script>
    </Head>
  );
}

export function HowToSchema({ name, description, steps }) {
  const schema = {
    "@context": "https://schema.org",
    "@type": "HowTo",
    "name": name,
    "description": description,
    "step": steps.map(({ name: stepName, text }, i) => ({
      "@type": "HowToStep",
      "position": i + 1,
      "name": stepName,
      "text": text
    }))
  };

  return (
    <Head>
      <script type="application/ld+json">{JSON.stringify(schema)}</script>
    </Head>
  );
}
