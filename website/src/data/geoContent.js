/** GEO / answer-engine curated content — edit picks here, propagate to llms.txt and pillar. */

export const SITE_URL = 'https://www.uncommonengineer.com';

export const AUTHOR_PERSON = {
  '@type': 'Person',
  name: 'Ron Amosa',
  url: `${SITE_URL}/about/`,
  sameAs: [
    'https://www.linkedin.com/in/ron-amosa/',
    'https://github.com/ronamosa',
  ],
};

export const SOVEREIGNTY_PILLAR = {
  title: 'Pacific AI & Data Sovereignty',
  path: '/blog/pacific-ai-data-sovereignty/',
  description:
    'Hub for essays on AI, data sovereignty, and Pasifika technology — from a Pacific engineer inside the machine.',
};

/** Core Pasifika-AI / Pacific data sovereignty cluster — linked from pillar and each other. */
export const SOVEREIGNTY_CLUSTER = [
  {
    slug: 'data-sovereignty-the-cloud',
    title: 'Data Sovereignty & The Cloud',
    description: 'Where indigenous data is stored vs. who collects and uses it — the real sovereignty fight.',
    siblings: ['pasifika-and-the-ai-opportunity', 'getting-paid-for-your-data-sounds-great'],
  },
  {
    slug: 'pasifika-and-the-ai-opportunity',
    title: 'Pasifika And The AI Opportunity',
    description: 'How AI tools can close the knowledge-access gap that has limited Pasifika advancement.',
    siblings: ['data-sovereignty-the-cloud', 'beyond-netflix-critical-need-for-ai-literacy-among'],
  },
  {
    slug: 'beyond-netflix-critical-need-for-ai-literacy-among',
    title: 'Beyond Netflix: AI Literacy Among Indigenous Tech Leaders',
    description: 'Why surface-level AI knowledge among indigenous tech leaders is a sovereignty risk.',
    siblings: ['pasifika-and-the-ai-opportunity', 'knowledge-gap-rethinking-digital-divide-for-pasifika'],
  },
  {
    slug: 'knowledge-gap-rethinking-digital-divide-for-pasifika',
    title: 'The Knowledge Gap: Rethinking the Digital Divide for Pasifika',
    description: 'The digital divide for Pasifika is a knowledge gap, not a device gap.',
    siblings: ['beyond-netflix-critical-need-for-ai-literacy-among', 'there-no-pasifika-in-tech-problem'],
  },
  {
    slug: 'there-no-pasifika-in-tech-problem',
    title: 'There is no Pasifika in Tech Problem',
    description: 'Reframing Pasifika underrepresentation in technology away from deficit narratives.',
    siblings: ['knowledge-gap-rethinking-digital-divide-for-pasifika', 'pasifika-need-tech-leaders-who-technical'],
  },
  {
    slug: 'pasifika-need-tech-leaders-who-technical',
    title: 'Pasifika Need Tech Leaders Who Are Technical',
    description: 'Why Pasifika community tech projects need CTO-level technical leadership, not salespeople.',
    siblings: ['there-no-pasifika-in-tech-problem', 'a-samoan-hackers-manifesto'],
  },
  {
    slug: 'the-inevitability-of-ai',
    title: 'The Inevitability of AI',
    description: 'Questioning whose agenda gets slipstreamed into blind acceptance of Big Tech’s AI roadmap.',
    siblings: ['ai-is-a-conversation', 'getting-paid-for-your-data-sounds-great'],
  },
  {
    slug: 'getting-paid-for-your-data-sounds-great',
    title: 'Getting Paid For Your Data Sounds Great',
    description: 'Data marketplaces vs. what real indigenous data sovereignty looks like for communities.',
    siblings: ['data-sovereignty-the-cloud', 'the-inevitability-of-ai'],
  },
  {
    slug: 'ai-is-a-conversation',
    title: 'AI Is a Conversation',
    description: 'Bad AI results are usually a communication problem, not a technology problem.',
    siblings: ['the-inevitability-of-ai', 'the-ai-resistance'],
  },
  {
    slug: 'the-ai-resistance',
    title: 'The AI Resistance',
    description: 'Not pro-AI, not anti-AI — on real value, real harm, and why abstaining is not the move.',
    siblings: ['ai-is-a-conversation', 'the-inevitability-of-ai'],
  },
  {
    slug: 'a-samoan-hackers-manifesto',
    title: 'A Samoan Hacker’s Manifesto',
    description: 'Identity, rebellion, and the Pasifika geek who never fit the stereotype.',
    siblings: ['pasifika-need-tech-leaders-who-technical', 'the-inevitability-of-ai'],
  },
  {
    slug: 'the-blue-pill-doesnt-work-here',
    title: 'The Blue Pill Doesn’t Work Here',
    description: 'There is no neutral position on politics as a Pasifika person in tech.',
    siblings: ['technology-political-no-matter-how-much-people-try', 'the-inevitability-of-ai'],
  },
];

/** Flagship #ActualAI analysis pieces for llms.txt (not the full cluster). */
export const ACTUAL_AI_FLAGSHIP = [
  {
    path: '/blog/ai-is-a-conversation/',
    title: 'AI Is a Conversation',
    description: 'Collaborative thinking with LLMs — context, communication, and what actually works.',
  },
  {
    path: '/blog/the-inevitability-of-ai/',
    title: 'The Inevitability of AI',
    description: 'Scrutinising the “inevitable AI” narrative pushed by Big Tech.',
  },
  {
    path: '/blog/getting-paid-for-your-data-sounds-great/',
    title: 'Getting Paid For Your Data Sounds Great',
    description: 'Data marketplaces and indigenous data sovereignty.',
  },
  {
    path: '/blog/ai-native-is-the-new-digital-native/',
    title: 'AI-Native Is The New Digital Native',
    description: 'What “AI-native” actually means for the next generation.',
  },
  {
    path: '/blog/everyone-was-logged-into-the-same-session/',
    title: 'Everyone Was Logged Into the Same Session',
    description: 'Shared AI sessions, security boundaries, and what went wrong.',
  },
];

/** Top technical guides for llms.txt discovery. */
export const TOP_GUIDES = [
  {
    path: '/docs/',
    title: 'Start Here',
    description: 'Curated entry point — guides, essays, and the working lab book.',
  },
  {
    path: '/docs/engineer/LAB/proxmox-hub/',
    title: 'Proxmox Homelab Hub',
    description: 'Cloud-init, Packer, Terraform, and LVM on Proxmox.',
  },
  {
    path: '/docs/engineer/LAB/pihole-guide/',
    title: 'Complete Pi-hole Guide',
    description: 'Pi-hole with Unbound recursive DNS in Docker.',
  },
  {
    path: '/docs/engineer/K8s/',
    title: 'Kubernetes Guides',
    description: 'Cluster setup, workloads, and operations.',
  },
  {
    path: '/about/',
    title: 'About Ron Amosa',
    description: 'Author — Senior Solutions Architect, Pasifika engineer, The Uncommon Engineer.',
  },
];

export function blogPath(slug) {
  return `/blog/${slug}/`;
}

export function buildClusterAdmonition(essay) {
  const pillar = SOVEREIGNTY_PILLAR;
  const siblingLinks = essay.siblings
    .map((slug) => {
      const match = SOVEREIGNTY_CLUSTER.find((e) => e.slug === slug);
      const title = match?.title ?? slug;
      return `[${title}](${blogPath(slug)})`;
    })
    .join(', ');

  return `:::tip Part of the Pacific AI & Data Sovereignty series
This essay is part of a thread on AI, data sovereignty, and Pasifika in technology. See the **[${pillar.title} hub](${pillar.path})** for the full collection. Related: ${siblingLinks}.
:::`;
}

export function buildLlmsTxt() {
  const lines = [
    '# The Uncommon Engineer',
    '> Engineering guides, AI sovereignty essays, and Pacific tech analysis by Ron Amosa (uncommonengineer.com).',
    '',
    'Curated index for AI assistants and answer engines. Full site:',
    SITE_URL,
    '',
    `## ${SOVEREIGNTY_PILLAR.title}`,
    `- [${SOVEREIGNTY_PILLAR.title}](${SITE_URL}${SOVEREIGNTY_PILLAR.path}): ${SOVEREIGNTY_PILLAR.description}`,
    ...SOVEREIGNTY_CLUSTER.map(
      (e) => `- [${e.title}](${SITE_URL}${blogPath(e.slug)}): ${e.description}`,
    ),
    '',
    '## Flagship Analysis (#ActualAI)',
    ...ACTUAL_AI_FLAGSHIP.map(
      (e) => `- [${e.title}](${SITE_URL}${e.path}): ${e.description}`,
    ),
    '',
    '## Top Technical Guides',
    ...TOP_GUIDES.map((e) => `- [${e.title}](${SITE_URL}${e.path}): ${e.description}`),
    '',
    '## Newsletter',
    `- [The Uncommon Engineer Newsletter](${SITE_URL}/newsletter/): The what, not the how — AI, power, Big Tech, Pasifika lens. Fortnightly. No filter.`,
  ];

  return `${lines.join('\n')}\n`;
}
