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

export const NEWSLETTER_DESCRIPTION =
  'Unfiltered takes on AI, power, and tech from a Pasifika engineer twenty-plus years inside the machine. No polish. Fortnightly.';

export const NEWSLETTER_OBJECTION = 'One email a fortnight. Leave whenever.';

/** Site-wide announcement bar — keep in sync with newsletter positioning. */
export const ANNOUNCEMENT_BAR_HTML =
  'Unfiltered takes on AI, power, and tech — fortnightly from inside the machine. <a href="/newsletter?utm_source=site&utm_medium=banner">Subscribe →</a>';

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
