/** Canonical copy and curated picks — edit here, propagate everywhere. */

export const BEEHIIV_EMBED_ID = '6098c229-772a-4563-8e9b-8e44aa11992f';

/**
 * Beehiiv-hosted subscribe page — use for LinkedIn (and other off-site) CTAs.
 * v2 iframe embeds strip referrer/UTM; the hosted page captures attribution.
 */
export const BEEHIIV_HOSTED_SUBSCRIBE_URL = 'https://bee.uncommonengineer.com/subscribe';

export function buildBeehiivHostedSubscribeUrl({ utmSource = 'site', utmMedium } = {}) {
  const url = new URL(BEEHIIV_HOSTED_SUBSCRIBE_URL);
  if (utmSource) url.searchParams.set('utm_source', utmSource);
  if (utmMedium) url.searchParams.set('utm_medium', utmMedium);
  return url.toString();
}

/** LinkedIn CTA URLs — point profile, featured, pinned, and post links here, not /newsletter. */
export const LINKEDIN_NEWSLETTER_URLS = {
  profile: buildBeehiivHostedSubscribeUrl({ utmSource: 'linkedin', utmMedium: 'profile' }),
  featured: buildBeehiivHostedSubscribeUrl({ utmSource: 'linkedin', utmMedium: 'featured' }),
  pinned: buildBeehiivHostedSubscribeUrl({ utmSource: 'linkedin', utmMedium: 'pinned' }),
  post: buildBeehiivHostedSubscribeUrl({ utmSource: 'linkedin', utmMedium: 'post' }),
};

/**
 * Block 9 — frozen in-body LinkedIn CTA strings (hypothesis #1 experiment).
 * One line each, ≤12 words + hosted post URL. Rotate across ≥6 posts unchanged.
 */
export const LINKEDIN_POST_CTA_STRINGS = [
  `If this landed, the newsletter will too → ${LINKEDIN_NEWSLETTER_URLS.post}`,
  `Where the long-form version of this lives → ${LINKEDIN_NEWSLETTER_URLS.post}`,
  `Fortnightly from inside the machine → ${LINKEDIN_NEWSLETTER_URLS.post}`,
];

/** Core newsletter pitch — edit segments here; formatting via NewsletterPitch component. */
export const NEWSLETTER_PITCH_SEGMENTS = {
  setup: 'The newsletter is the what... as in, ',
  punchline: 'what the f***',
  body: " — AI, power, Big Tech and the tech industry, through a Pasifika lens, from an engineer who's spent twenty-plus years working inside the machine.",
  tagline: 'Fortnightly. No filter.',
};

/** Context openers paired with the pitch ("…the how."). */
export const NEWSLETTER_CONTEXT_PREFIXES = {
  doc: { subject: 'The docs are', contrast: 'the how' },
  blog: { subject: 'This essay is', contrast: 'the how' },
  startHere: { subject: 'The guides are', contrast: 'the how' },
};

function buildNewsletterPitchPlain(context) {
  const { setup, punchline, body, tagline } = NEWSLETTER_PITCH_SEGMENTS;
  const pitch = `${setup}${punchline}${body} ${tagline}`;

  if (!context) {
    return pitch;
  }

  const { subject, contrast } = NEWSLETTER_CONTEXT_PREFIXES[context];
  return `${subject} ${contrast}. ${pitch}`;
}

/** Plain text for meta tags, SEO, llms.txt, and other non-React surfaces. */
export const NEWSLETTER_PITCH = buildNewsletterPitchPlain();

/** Default description for homepage card, /newsletter page, and meta tags. */
export const NEWSLETTER_DESCRIPTION = NEWSLETTER_PITCH;

/** Plain-text variants (legacy exports — prefer NewsletterPitch component in UI). */
export const NEWSLETTER_DOC_FOOTER_BODY = buildNewsletterPitchPlain('doc');
export const NEWSLETTER_BLOG_FOOTER_BODY = buildNewsletterPitchPlain('blog');
export const NEWSLETTER_START_HERE_BODY = buildNewsletterPitchPlain('startHere');

export const NEWSLETTER_OBJECTION = 'Leave whenever.';

/** Site-wide announcement bar — HTML allowed; keep plain-text meaning in sync with segments. */
export const ANNOUNCEMENT_BAR_HTML =
  'The <strong>what</strong>, not the <strong>how</strong> — AI, power, Big Tech, Pasifika lens. <em>Fortnightly. No filter.</em> <a href="/newsletter?ref=banner">Subscribe →</a>';

export const HOMEPAGE_TITLE =
  'Engineering Guides, AI Sovereignty & Pacific Tech | The Uncommon Engineer';

export function buildHomepageDescription(docsCount) {
  return `${docsCount}+ battle-tested guides on cloud, Kubernetes, and security. Essays on AI sovereignty and the politics of technology through a Pacific lens. By Ron Amosa — The Uncommon Engineer.`;
}

/** DECISION: Ron can swap these without touching layout code. */
export const FLAGSHIP_ESSAY = {
  title: 'The Inevitability of AI',
  to: '/blog/the-inevitability-of-ai/',
};

/** DECISION: Ron can swap these without touching layout code. */
export const CURATED_START_HERE = [
  {
    label: 'Guide',
    title: 'Proxmox Homelab Guide: Cloud-Init, Packer, Terraform, and LVM',
    to: '/docs/engineer/LAB/proxmox-hub/',
  },
  {
    label: 'Essay',
    title: 'The Inevitability of AI',
    to: '/blog/the-inevitability-of-ai/',
  },
  {
    label: 'Actual AI',
    title: 'AI Is a Conversation',
    to: '/blog/ai-is-a-conversation/',
  },
];
