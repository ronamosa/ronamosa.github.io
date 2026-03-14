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

function parseFrontmatter(content) {
  const match = content.match(/^---\s*\n([\s\S]*?)\n---/);
  if (!match) return {};

  const fm = match[1];
  const result = {};

  const titleMatch = fm.match(/^title:\s*["']?(.+?)["']?\s*$/m);
  if (titleMatch) result.title = titleMatch[1];

  const slugMatch = fm.match(/^slug:\s*["']?(.+?)["']?\s*$/m);
  if (slugMatch) result.slug = slugMatch[1];

  const dateMatch = fm.match(/^date:\s*["']?(.+?)["']?\s*$/m);
  if (dateMatch) result.date = dateMatch[1];

  const descMatch = fm.match(/^description:\s*["']?(.+?)["']?\s*$/m);
  if (descMatch) result.description = descMatch[1];

  const tagsMatch = fm.match(/^tags:\s*\[([^\]]*)\]/m);
  if (tagsMatch) {
    result.tags = tagsMatch[1]
      .split(',')
      .map(t => t.trim().replace(/["']/g, ''))
      .filter(Boolean);
  }

  return result;
}

function getRecentBlogPosts(blogDir, count = 5) {
  if (!fs.existsSync(blogDir)) return [];

  const files = fs.readdirSync(blogDir)
    .filter(f => /\.(md|mdx)$/.test(f))
    .sort()
    .reverse();

  const posts = [];
  for (const file of files) {
    if (posts.length >= count) break;

    const content = fs.readFileSync(path.join(blogDir, file), 'utf-8');
    const fm = parseFrontmatter(content);
    if (!fm.title) continue;

    posts.push({
      title: fm.title,
      date: fm.date || file.slice(0, 10),
      permalink: `/blog/${fm.slug || file.replace(/\.(md|mdx)$/, '').replace(/^\d{4}-\d{2}-\d{2}[-\s]*/, '')}`,
      description: fm.description || null,
    });
  }

  return posts;
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

      const stat = fs.statSync(fullPath);
      const content = fs.readFileSync(fullPath, 'utf-8');
      const fm = parseFrontmatter(content);

      const urlPath = relativePath
        .replace(/\.(md|mdx)$/, '')
        .replace(/\/README$/, '');

      results.push({
        title: fm.title || entry.name.replace(/\.(md|mdx)$/, ''),
        permalink: fm.slug || `/docs/${urlPath}`,
        tags: fm.tags || [],
        mtime: stat.mtimeMs,
      });
    }
  }
  return results;
}

function getRecentDocs(docsDir, count = 5) {
  const allDocs = collectDocs(docsDir, docsDir);
  return allDocs
    .sort((a, b) => b.mtime - a.mtime)
    .slice(0, count)
    .map(({ title, permalink, tags }) => ({ title, permalink, tags }));
}

module.exports = function contentCountsPlugin(_context, _options) {
  return {
    name: 'content-counts',
    async contentLoaded({ actions }) {
      const blogDir = path.resolve(__dirname, '../blog');
      const docsDir = path.resolve(__dirname, '../docs');

      const recentPosts = getRecentBlogPosts(blogDir, 5);

      actions.setGlobalData({
        blogCount: countMarkdownFiles(blogDir),
        docsCount: countMarkdownFiles(docsDir),
        latestPost: recentPosts[0] || null,
        recentPosts,
        recentDocs: getRecentDocs(docsDir, 5),
      });
    },
  };
};
