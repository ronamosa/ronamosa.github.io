import React from 'react';
import {
  NEWSLETTER_CONTEXT_PREFIXES,
  NEWSLETTER_PITCH_SEGMENTS,
} from '@site/src/data/siteConstants';
import styles from './styles.module.css';

/**
 * Formatted newsletter pitch — use anywhere React renders the copy.
 * @param {'doc'|'blog'|'startHere'} [context] — optional "the how" opener
 */
export default function NewsletterPitch({
  context,
  className,
  punchlineClassName,
  taglineClassName,
}) {
  const { setup, punchline, body, tagline } = NEWSLETTER_PITCH_SEGMENTS;
  const prefix = context ? NEWSLETTER_CONTEXT_PREFIXES[context] : null;

  return (
    <span className={className}>
      {prefix && (
        <>
          {prefix.subject} <strong>{prefix.contrast}</strong>.{' '}
        </>
      )}
      {setup}
      <strong className={punchlineClassName || styles.punchline}>{punchline}</strong>
      {body}{' '}
      <em className={taglineClassName || styles.tagline}>{tagline}</em>
    </span>
  );
}
