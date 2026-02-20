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

module.exports = function contentCountsPlugin(_context, _options) {
  return {
    name: 'content-counts',
    async contentLoaded({ actions }) {
      const blogDir = path.resolve(__dirname, '../blog');
      const docsDir = path.resolve(__dirname, '../docs');

      actions.setGlobalData({
        blogCount: countMarkdownFiles(blogDir),
        docsCount: countMarkdownFiles(docsDir),
      });
    },
  };
};
