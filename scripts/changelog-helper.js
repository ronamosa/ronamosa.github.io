#!/usr/bin/env node

/**
 * Changelog Helper Script
 * Generates properly formatted changelog entries for ronamosa.github.io
 * 
 * Usage:
 *   node scripts/changelog-helper.js "Site Improvements" "Fixed navigation bug" "docs/guide/navigation"
 */

const fs = require('fs');
const path = require('path');

// Category mappings
const CATEGORIES = {
  'site': '🛠️ Site Improvements',
  'docs': '📚 Documentation Updates', 
  'blog': '📝 Blog Posts',
  'fix': '🔧 Bug Fixes',
  'design': '🎨 Design Changes',
  'perf': '⚡ Performance Improvements',
  'security': '🔒 Security Updates',
  'deps': '📦 Dependencies'
};

function getCurrentDate() {
  const now = new Date();
  return now.toISOString().split('T')[0]; // YYYY-MM-DD format
}

function getCurrentMonth() {
  const now = new Date();
  const months = [
    'january', 'february', 'march', 'april', 'may', 'june',
    'july', 'august', 'september', 'october', 'november', 'december'
  ];
  return {
    name: months[now.getMonth()],
    year: now.getFullYear(),
    displayName: months[now.getMonth()].charAt(0).toUpperCase() + months[now.getMonth()].slice(1)
  };
}

function generateChangelogEntry(category, title, description, linkPath) {
  const date = getCurrentDate();
  const fullCategory = CATEGORIES[category.toLowerCase()] || `🛠️ ${category}`;
  
  let entry = `## 📅 ${date}\n\n### ${fullCategory}\n- **${title}**: ${description}\n`;
  
  if (linkPath) {
    const linkText = title;
    entry += `  - **Link**: [${linkText}](/${linkPath})\n`;
  }
  
  entry += '\n---\n\n';
  
  return entry;
}

function getChangelogPath() {
  const { name, year } = getCurrentMonth();
  return path.join(__dirname, '..', 'website', 'changelog', year.toString(), `${name}.md`);
}

function createMonthlyChangelogIfNeeded() {
  const { name, year, displayName } = getCurrentMonth();
  const changelogPath = getChangelogPath();
  
  if (!fs.existsSync(changelogPath)) {
    const template = `---
sidebar_position: 1
title: ${displayName} ${year}
description: Changes and additions for ${displayName} ${year}
---

# ${displayName} ${year}

## Template for Future Entries

When adding new changelog entries, use this format:

\`\`\`markdown
## 📅 YYYY-MM-DD

### {CATEGORY}
- **Title**: Brief description of the change
  - Additional details if needed
  - Links to related content: [Link Text](URL)
\`\`\`

### Change Type Icons
- 🛠️ Site Improvements
- 📚 Documentation Updates
- 📝 Blog Posts
- 🔧 Bug Fixes
- 🎨 Design Changes
- ⚡ Performance Improvements
- 🔒 Security Updates
- 📦 Dependencies
`;
    
    // Ensure directory exists
    const dir = path.dirname(changelogPath);
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }
    
    fs.writeFileSync(changelogPath, template);
    console.log(`Created new changelog file: ${changelogPath}`);
  }
  
  return changelogPath;
}

function addChangelogEntry(category, title, description, linkPath) {
  const changelogPath = createMonthlyChangelogIfNeeded();
  const entry = generateChangelogEntry(category, title, description, linkPath);
  
  // Read existing content
  let content = fs.readFileSync(changelogPath, 'utf8');
  
  // Find where to insert (after the first heading but before any existing entries)
  const lines = content.split('\n');
  const headerEndIndex = lines.findIndex((line, index) => 
    index > 0 && line.startsWith('# ') && lines[index + 1] === ''
  );
  
  if (headerEndIndex === -1) {
    console.error('Could not find proper insertion point in changelog');
    return;
  }
  
  // Insert the new entry after the header
  lines.splice(headerEndIndex + 2, 0, entry);
  
  // Write back to file
  fs.writeFileSync(changelogPath, lines.join('\n'));
  console.log(`Added changelog entry to ${changelogPath}`);
  console.log(`Entry: ${title} (${category})`);
}

function showUsage() {
  console.log(`
Changelog Helper for ronamosa.github.io

Usage:
  node scripts/changelog-helper.js <category> <title> <description> [linkPath]

Categories:
  site     - 🛠️ Site Improvements
  docs     - 📚 Documentation Updates  
  blog     - 📝 Blog Posts
  fix      - 🔧 Bug Fixes
  design   - 🎨 Design Changes
  perf     - ⚡ Performance Improvements
  security - 🔒 Security Updates
  deps     - 📦 Dependencies

Examples:
  node scripts/changelog-helper.js docs "New AI Guide" "Added comprehensive AI deployment guide" "docs/engineer/AI/deployment-guide"
  node scripts/changelog-helper.js fix "Navigation Bug" "Fixed mobile navigation dropdown issue"
  node scripts/changelog-helper.js site "Performance Update" "Improved page load times by 30%"

The script will:
1. Create the current month's changelog file if it doesn't exist
2. Add your entry with today's date at the top
3. Format everything according to the established template
`);
}

// Main execution
if (require.main === module) {
  const args = process.argv.slice(2);
  
  if (args.length < 3) {
    showUsage();
    process.exit(1);
  }
  
  const [category, title, description, linkPath] = args;
  
  if (!CATEGORIES[category.toLowerCase()] && !category.includes(' ')) {
    console.error(`Unknown category: ${category}`);
    console.error('Valid categories:', Object.keys(CATEGORIES).join(', '));
    process.exit(1);
  }
  
  addChangelogEntry(category, title, description, linkPath);
}

module.exports = {
  generateChangelogEntry,
  addChangelogEntry,
  createMonthlyChangelogIfNeeded,
  CATEGORIES
}; 