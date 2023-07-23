const internetProfiles = {
  linkedin: {
    label: "LinkedIn",
    href: "https://www.linkedin.com/in/ron-amosa/",
  },
  github: {
    label: "GitHub",
    href: "https://github.com/ronamosa/",
  },
  email: {
    label: "Email",
    href: "mailto:ron+website@cloudbuilder.io",
  },
  blog: {
    label: "Blog",
    to: "blog",
  },
  docs: {
    label: "Docs",
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
  resume: {
    label: "Resume",
    href: "https://ronamosa.github.io/pdf/resume.pdf",
  },
};

module.exports = {
  title: 'Ron Amosa',
  tagline: 'Pasifika Excellence and Leadership in Cloud, DevOps and Security Engineering.',
  url: 'https://ronamosa.io',
  baseUrl: '/',
  onBrokenLinks: 'throw',
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
      title: 'Ron Amosa',
      logo: {
        alt: 'ronamosa.io',
        src: 'img/logo.svg',
      },
      items: [
        {
          to: "docs/",
          activeBasePath: "docs",
          label: "Docs",
          position: "left",
        },
        { to: "blog/", label: "Blog", position: "left" },
        { to: "about/", label: "About", position: "right" },
        { to: "projects/", label: "Projects", position: "right" },
        {
          href: "https://ronamosa.io/pdf/resume.pdf",
          label: "Resume",
          position: "right",
        },
      ],
    },

    algolia: {
      // The application ID provided by Algolia
      appId: '9UFF3RBJQ9',

      // Public API key: it is safe to commit it
      apiKey: '1f53a6f7e7f331786250c1b092794deb',

      indexName: 'ronamosa',

    },

    footer: {
      links: [
        {
          title: "Connect",
          items: [
            internetProfiles.linkedin,
            internetProfiles.github,
            internetProfiles.email,
          ],
        },
        {
          title: "Discover",
          items: [
            internetProfiles.blog,
            internetProfiles.docs,
            internetProfiles.about,
            internetProfiles.resume,
          ],
        },
      ],
      copyright: `Last updated on ${new Date().toDateString()}`,
    },
    prism: {
      additionalLanguages: ['ruby', 'hcl', 'docker', 'yaml'],
      theme: require('prism-react-renderer/themes/nightOwl')
    }
  },

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
        },
        blog: {
          showReadingTime: true,
          editUrl:
            'https://github.com/ronamosa/ronamosa.github.io/edit/main/website/',
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
  ],

};
