/**
 * Site-embedded beehiiv iframe — for on-site capture only (homepage, Start Here, /newsletter).
 * LinkedIn and other off-site CTAs must use BEEHIIV_HOSTED_SUBSCRIBE_URL / LINKEDIN_NEWSLETTER_URLS
 * in siteConstants.js — iframe embeds strip referrer and UTM attribution.
 */
import React from 'react';
import { BEEHIIV_EMBED_ID } from '@site/src/data/siteConstants';
import styles from './styles.module.css';

function buildEmbedSrc({ utmSource, utmMedium }) {
  const url = new URL(`https://subscribe-forms.beehiiv.com/${BEEHIIV_EMBED_ID}`);
  if (utmSource) url.searchParams.set('utm_source', utmSource);
  if (utmMedium) url.searchParams.set('utm_medium', utmMedium);
  return url.toString();
}

export default function BeehiivEmbed({
  utmSource = 'site',
  utmMedium,
  height = 160,
  variant = 'default',
  className,
}) {
  const isCompact = variant === 'compact';

  return (
    <div
      className={[
        styles.embedContainer,
        isCompact && styles.embedCompact,
        className,
      ]
        .filter(Boolean)
        .join(' ')}
    >
      <iframe
        src={buildEmbedSrc({ utmSource, utmMedium })}
        className="beehiiv-embed"
        data-test-id="beehiiv-embed"
        title="Newsletter signup form"
        frameBorder="0"
        scrolling="no"
        style={{
          width: '100%',
          height: isCompact ? undefined : `${height}px`,
          margin: 0,
          backgroundColor: 'transparent',
        }}
      />
    </div>
  );
}
