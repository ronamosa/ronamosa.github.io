const {themes} = require('prism-react-renderer');
const legacyRedirects = require('./redirects');
const {ANNOUNCEMENT_BAR_HTML} = require('./src/data/siteConstants.js');

const internetProfiles = {
  linkedin: {
    label: "LinkedIn",
    href: "https://www.linkedin.com/in/ron-amosa/",
  },
  github: {
    label: "GitHub",
    href: "https://github.com/ronamosa/",
  },
  youtube: {
    label: "YouTube",
    href: "https://www.youtube.com/@uncommonengineer",
  },

  blog: {
    label: "Analysis & Essays",
    to: "blog",
  },
  docs: {
    label: "Technical",
    to: "docs",
  },
  about: {
    label: "About",
    to: "about",
  },
  projects: {
    label: "Projects",
    to: "projects",
  },
};

module.exports = {
  title: 'The Uncommon Engineer',
  tagline: 'Mastery before rebellion. Builder. Anarchist. Pasifika.',
  url: 'https://www.uncommonengineer.com',
  baseUrl: '/',
  // GitHub Pages 301-redirects non-slash URLs to their trailing-slash form and
  // serves that as the 200 response. Enforce trailingSlash so Docusaurus emits
  // canonical/og:url/sitemap URLs that match the served URL (no canonical->301
  // mismatch) and normalises every page to a single URL form site-wide.
  trailingSlash: true,
  onBrokenLinks: 'warn',
  onBrokenMarkdownLinks: 'warn',
  favicon: 'img/favicon.ico',
  organizationName: 'ronamosa', // Usually your GitHub org/user name.
  projectName: 'ronamosa.github.io', // Usually your repo name.

  markdown: {
    mermaid: true,
  },
  themes: ['@docusaurus/theme-mermaid'],

  clientModules: [
    require.resolve('./src/clientModules/blogEngagementTracker.js'),
    require.resolve('./src/clientModules/contentSectionTracker.js'),
  ],

  themeConfig: {
    announcementBar: {
      id: 'newsletter-2026-07-v2',
      content: ANNOUNCEMENT_BAR_HTML,
      isCloseable: true,
    },
    image: 'img/social-card.jpg',
    metadata: [
      { name: 'twitter:card', content: 'summary_large_image' },
      { property: 'og:type', content: 'website' },
      { property: 'og:site_name', content: 'The Uncommon Engineer' },
      { property: 'og:locale', content: 'en_US' },
    ],
    colorMode: {
      defaultMode: "dark",
      disableSwitch: true,
      respectPrefersColorScheme: false,
    },
    navbar: {
      title: 'Uncommon Engineer',
      logo: {
        alt: 'The Uncommon Engineer',
        src: 'img/profile.svg',
      },
      items: [
        {
          to: "docs/",
          activeBasePath: "docs",
          label: "Technical",
          position: "left",
        },
        { to: "blog/", label: "Analysis & Essays", position: "left" },
        {
          to: "hackathon/",
          activeBasePath: "hackathon",
          label: "Hackathon",
          position: "left",
        },
        { to: "about/", label: "About", position: "right" },
        { to: "projects/", label: "Projects", position: "right" },
        { to: "changelog/", label: "Changelog", position: "right" },
      ],
    },

    algolia: {
      // The application ID provided by Algolia
      appId: '9UFF3RBJQ9',

      // Public API key: it is safe to commit it
      apiKey: '11dc3d0610ed31a45de0fbf30160d945',

      indexName: 'uncommonengineer.com',

    },

    footer: {
      links: [
        {
          title: "Connect",
          items: [
            internetProfiles.linkedin,
            internetProfiles.github,
            internetProfiles.youtube,
          ],
        },
        {
          title: "Discover",
          items: [
            internetProfiles.blog,
            internetProfiles.docs,
            internetProfiles.about,
          ],
        },
      ],
      copyright: `Last updated on ${new Date().toDateString()}`,
    },
    prism: {
      additionalLanguages: ['ruby', 'hcl', 'docker', 'yaml'],
      theme: themes.nightOwl
    },
  },

  // Safety stub: ensure `window.gtag` is always defined, so the gtag plugin's
  // clientModule never throws "window.gtag is not a function" — covers ad
  // blockers, offline dev, and stale .docusaurus cache after a prod build.
  // The real gtag (loaded by the plugin in production) overwrites this.
  headTags: [
    {
      tagName: 'script',
      attributes: {},
      innerHTML: `window.dataLayer=window.dataLayer||[];window.gtag=window.gtag||function(){window.dataLayer.push(arguments);};`,
    },
    {
      tagName: 'link',
      attributes: {
        rel: 'alternate',
        type: 'text/plain',
        href: '/llms.txt',
        title: 'LLM Content Map',
      },
    },
  ],

  scripts: [
    {
      src: '/js/console-clue.js',
      async: false,
    },
    {
      src: '/js/metricool.js',
      async: false,
    },
    {
      src: 'https://subscribe-forms.beehiiv.com/embed.js',
      async: true,
    },
  ],

  presets: [
    [
      '@docusaurus/preset-classic',
      {
        docs: {
          sidebarPath: require.resolve('./sidebars.js'),
          disableVersioning: false,
          editCurrentVersion: false,
          editUrl:
            'https://github.com/ronamosa/ronamosa.github.io/edit/main/website/',
          showLastUpdateTime: true,
          showLastUpdateAuthor: true,
        },
        blog: {
          showReadingTime: true,
          editUrl:
            'https://github.com/ronamosa/ronamosa.github.io/edit/main/website/',
          postsPerPage: 10,
          blogSidebarTitle: 'All Posts',
          blogSidebarCount: 'ALL',
        },
        theme: {
          customCss: require.resolve('./src/css/custom.css'),
        },
      },
    ],
  ],

  plugins: [
    require.resolve('./plugins/content-counts'),
    require.resolve('./plugins/docs-rss-feed'),
    [
      '@docusaurus/plugin-google-gtag',
      {
        trackingID: 'G-DMRNTVGLRC',
        anonymizeIP: true,
      },
    ],
    [
      '@docusaurus/plugin-content-docs',
      {
        id: 'changelog',
        path: 'changelog',
        routeBasePath: 'changelog',
        sidebarPath: require.resolve('./sidebars-changelog.js'),
        editUrl: 'https://github.com/ronamosa/ronamosa.github.io/edit/main/website/',
        showLastUpdateAuthor: true,
        showLastUpdateTime: true,
        breadcrumbs: false,
      },
    ],
    [
      '@docusaurus/plugin-content-docs',
      {
        id: 'hackathon',
        path: 'hackathon',
        routeBasePath: 'hackathon',
        sidebarPath: require.resolve('./sidebars-hackathon.js'),
        editUrl: 'https://github.com/ronamosa/ronamosa.github.io/edit/main/website/',
        showLastUpdateAuthor: true,
        showLastUpdateTime: true,
        breadcrumbs: true,
      },
    ],
    [
      '@docusaurus/plugin-client-redirects',
      {
        redirects: legacyRedirects,
        createRedirects(existingPath) {
          if (existingPath === '/docs/bulk-delete-outlook-rules-powershell-macos/') {
            return ['/docs/engineer/Misc/bulk-delete-outlook-rules-powershell-macos/'];
          }
          if (existingPath.startsWith('/docs/engineer/guides/')) {
            return [existingPath.replace('/docs/engineer/guides/', '/docs/engineer/Misc/')];
          }
          if (existingPath === '/docs/category/guides/') {
            return ['/docs/category/misc/'];
          }
          return undefined;
        },
      },
    ],
  ],

};
