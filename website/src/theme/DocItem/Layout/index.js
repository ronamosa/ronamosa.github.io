import React from 'react';
import DocItemLayout from '@theme-original/DocItem/Layout';
import {useDoc} from '@docusaurus/plugin-content-docs/client';
import useDocusaurusContext from '@docusaurus/useDocusaurusContext';
import {ArticleSchema} from '@site/src/components/StructuredData';
import {SITE_URL} from '@site/src/data/geoContent';

function toAbsoluteUrl(path) {
  if (!path) return undefined;
  if (path.startsWith('http')) return path;
  return `${SITE_URL}${path.startsWith('/') ? path : `/${path}`}`;
}

export default function DocItemLayoutWrapper(props) {
  const {metadata} = useDoc();
  const {siteConfig} = useDocusaurusContext();
  const isMainDocs =
    metadata.permalink.startsWith('/docs/') &&
    !metadata.permalink.startsWith('/docs/category/');

  const pageUrl = toAbsoluteUrl(metadata.permalink);
  const dateModified = metadata.lastUpdatedAt
    ? new Date(metadata.lastUpdatedAt).toISOString().split('T')[0]
    : undefined;
  const image = metadata.frontMatter?.image
    ? toAbsoluteUrl(metadata.frontMatter.image)
    : toAbsoluteUrl(siteConfig.themeConfig?.image);

  return (
    <>
      {isMainDocs && (
        <ArticleSchema
          type="TechArticle"
          headline={metadata.title}
          description={metadata.description}
          url={pageUrl}
          dateModified={dateModified}
          image={image}
        />
      )}
      <DocItemLayout {...props} />
    </>
  );
}
