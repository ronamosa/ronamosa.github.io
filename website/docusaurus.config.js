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
    href: "mailto:contact@ronamosa.io",
  },
  blog: {
    label: "Blog",
    to: "blog",
  },
  docs: {
    label: "Docs",
    to: "docs",
  },
  projects: {
    label: "Projects",
    to: "projects",
  },
  about: {
    label: "About",
    to: "about",
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
        { to: "projects/", label: "Projects", position: "right" },
        { to: "about/", label: "About", position: "right" },
        {
          href: "https://ronamosa.io/pdf/resume.pdf",
          label: "Resume",
          position: "right",
        },
      ],
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
            internetProfiles.projects,
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
            'https://github.com/ronamosa/ronamosa.github.io/edit/main/docs/',
        },
        blog: {
          showReadingTime: true,
          editUrl:
            'https://github.com/ronamosa/ronamosa.github.io/edit/main/blog/',
        },
        theme: {
          customCss: require.resolve('./src/css/custom.css'),
        },
      },
    ],
  ],
};
