const {themes} = require('prism-react-renderer');

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
  onBrokenLinks: 'warn',
  onBrokenMarkdownLinks: 'warn',
  favicon: 'img/favicon.ico',
  organizationName: 'ronamosa', // Usually your GitHub org/user name.
  projectName: 'ronamosa.github.io', // Usually your repo name.

  themeConfig: {
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
  ],

};
