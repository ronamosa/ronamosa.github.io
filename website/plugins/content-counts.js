const fs = require('fs');
const path = require('path');

function countMarkdownFiles(dir) {
  let count = 0;
  if (!fs.existsSync(dir)) return count;

  const entries = fs.readdirSync(dir, { withFileTypes: true });
  for (const entry of entries) {
    const fullPath = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      count += countMarkdownFiles(fullPath);
    } else if (/\.(md|mdx)$/.test(entry.name)) {
      count++;
    }
  }
  return count;
}

function getLatestBlogPost(blogDir) {
  if (!fs.existsSync(blogDir)) return null;

  const files = fs.readdirSync(blogDir)
    .filter(f => /\.(md|mdx)$/.test(f))
    .sort()
    .reverse();

  if (files.length === 0) return null;

  const latest = files[0];
  const content = fs.readFileSync(path.join(blogDir, latest), 'utf-8');

  const frontmatterMatch = content.match(/^---\s*\n([\s\S]*?)\n---/);
  if (!frontmatterMatch) return null;

  const fm = frontmatterMatch[1];
  const titleMatch = fm.match(/^title:\s*["']?(.+?)["']?\s*$/m);
  const slugMatch = fm.match(/^slug:\s*["']?(.+?)["']?\s*$/m);

  return {
    title: titleMatch ? titleMatch[1] : latest.replace(/\.(md|mdx)$/, ''),
    slug: slugMatch ? slugMatch[1] : null,
  };
}

module.exports = function contentCountsPlugin(_context, _options) {
  return {
    name: 'content-counts',
    async contentLoaded({ actions }) {
      const blogDir = path.resolve(__dirname, '../blog');
      const docsDir = path.resolve(__dirname, '../docs');

      actions.setGlobalData({
        blogCount: countMarkdownFiles(blogDir),
        docsCount: countMarkdownFiles(docsDir),
        latestPost: getLatestBlogPost(blogDir),
      });
    },
  };
};
