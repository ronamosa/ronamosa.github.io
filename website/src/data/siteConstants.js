/** Canonical copy and curated picks — edit here, propagate everywhere. */

export const BEEHIIV_EMBED_ID = '6098c229-772a-4563-8e9b-8e44aa11992f';

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
