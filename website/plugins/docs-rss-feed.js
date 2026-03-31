const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

const MAX_ITEMS = 50;

function parseFrontmatter(content) {
  const match = content.match(/^---\s*\n([\s\S]*?)\n---/);
  if (!match) return {};

  const fm = match[1];
  const result = {};

  const titleMatch = fm.match(/^title:\s*["']?(.+?)["']?\s*$/m);
  if (titleMatch) result.title = titleMatch[1];

  const slugMatch = fm.match(/^slug:\s*["']?(.+?)["']?\s*$/m);
  if (slugMatch) result.slug = slugMatch[1];

  const descMatch = fm.match(/^description:\s*["']?(.+?)["']?\s*$/m);
  if (descMatch) result.description = descMatch[1];

  return result;
}

function getGitTimestamp(filePath) {
  try {
    const stdout = execSync(`git log -1 --format=%ct "${filePath}"`, {
      encoding: 'utf-8',
      stdio: ['pipe', 'pipe', 'ignore'],
    }).trim();
    return stdout ? parseInt(stdout, 10) * 1000 : null;
  } catch {
    return null;
  }
}

function collectDocs(dir, baseDir, results = []) {
  if (!fs.existsSync(dir)) return results;

  const entries = fs.readdirSync(dir, { withFileTypes: true });
  for (const entry of entries) {
    const fullPath = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      collectDocs(fullPath, baseDir, results);
    } else if (/\.(md|mdx)$/.test(entry.name)) {
      const relativePath = path.relative(baseDir, fullPath);
      if (relativePath === 'start-here.md' || relativePath === 'start-here.mdx') continue;

      const content = fs.readFileSync(fullPath, 'utf-8');
      const fm = parseFrontmatter(content);
      if (!fm.title) continue;

      const urlPath = relativePath
        .replace(/\.(md|mdx)$/, '')
        .replace(/\/README$/, '');

      const gitTs = getGitTimestamp(fullPath);
      const lastUpdated = gitTs || fs.statSync(fullPath).mtimeMs;

      results.push({
        title: fm.title,
        description: fm.description || '',
        permalink: fm.slug || `/docs/${urlPath}`,
        lastUpdated,
      });
    }
  }
  return results;
}

function escapeXml(str) {
  return str
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&apos;');
}

function buildRssXml(docs, siteUrl, siteTitle) {
  const feedUrl = `${siteUrl}/docs/rss.xml`;
  const items = docs
    .map((doc) => {
      const link = `${siteUrl}${doc.permalink}`;
      const pubDate = new Date(doc.lastUpdated).toUTCString();
      return `    <item>
      <title>${escapeXml(doc.title)}</title>
      <link>${escapeXml(link)}</link>
      <guid isPermaLink="true">${escapeXml(link)}</guid>
      <pubDate>${pubDate}</pubDate>
      <description>${escapeXml(doc.description)}</description>
    </item>`;
    })
    .join('\n');

  return `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom">
  <channel>
    <title>${escapeXml(siteTitle)} — Docs</title>
    <link>${escapeXml(siteUrl)}/docs</link>
    <description>Technical documentation from ${escapeXml(siteTitle)}</description>
    <language>en</language>
    <lastBuildDate>${new Date().toUTCString()}</lastBuildDate>
    <atom:link href="${escapeXml(feedUrl)}" rel="self" type="application/rss+xml"/>
${items}
  </channel>
</rss>
`;
}

module.exports = function docsRssFeedPlugin(context) {
  const { siteConfig } = context;

  return {
    name: 'docs-rss-feed',

    injectHtmlTags() {
      return {
        headTags: [
          {
            tagName: 'link',
            attributes: {
              rel: 'alternate',
              type: 'application/rss+xml',
              title: `${siteConfig.title} — Docs`,
              href: `${siteConfig.url}/docs/rss.xml`,
            },
          },
        ],
      };
    },

    async postBuild({ siteConfig: buildSiteConfig, outDir }) {
      const docsDir = path.resolve(__dirname, '../docs');
      const siteUrl = buildSiteConfig.url;
      const siteTitle = buildSiteConfig.title;

      const docs = collectDocs(docsDir, docsDir);
      docs.sort((a, b) => b.lastUpdated - a.lastUpdated);
      const recent = docs.slice(0, MAX_ITEMS);

      const rssXml = buildRssXml(recent, siteUrl, siteTitle);

      const rssDir = path.join(outDir, 'docs');
      fs.mkdirSync(rssDir, { recursive: true });
      fs.writeFileSync(path.join(rssDir, 'rss.xml'), rssXml, 'utf-8');

      console.log(
        `[docs-rss-feed] Generated /docs/rss.xml with ${recent.length} items`,
      );
    },
  };
};
