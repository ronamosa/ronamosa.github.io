# Scripts for ronamosa.github.io

This directory contains automation scripts to help maintain the website.

## Changelog Helper (`changelog-helper.js`)

Automatically generates properly formatted changelog entries.

### Quick Usage

```bash
# Add a documentation update
node scripts/changelog-helper.js docs "New AI Guide" "Added comprehensive AI deployment guide" "docs/engineer/AI/deployment-guide"

# Add a bug fix
node scripts/changelog-helper.js fix "Navigation Bug" "Fixed mobile navigation dropdown issue"

# Add a site improvement
node scripts/changelog-helper.js site "Performance Update" "Improved page load times by 30%"
```

### Categories

- `site` - 🛠️ Site Improvements  
- `docs` - 📚 Documentation Updates
- `blog` - 📝 Blog Posts
- `fix` - 🔧 Bug Fixes
- `design` - 🎨 Design Changes
- `perf` - ⚡ Performance Improvements
- `security` - 🔒 Security Updates
- `deps` - 📦 Dependencies

### What the script does:

1. **Auto-creates monthly changelog files** if they don't exist
2. **Adds entries with proper formatting** and today's date
3. **Inserts at the top** (newest entries first)
4. **Includes links** to new content when provided

### Workflow Integration

The best practice is to run this script whenever you:
- Add new documentation
- Write blog posts  
- Make site improvements
- Fix bugs
- Update dependencies

### Example Output

```markdown
## 📅 2025-02-17

### 📚 Documentation Updates
- **New AI Guide**: Added comprehensive AI deployment guide
  - **Link**: [New AI Guide](/docs/engineer/AI/deployment-guide)
```

## Using with Cursor

The `.cursorrules` file in the root directory provides guidelines for when and how to use this script during development.

## Manual Changelog Updates

If you prefer to update manually, follow the format in any existing changelog file:

1. Open `website/changelog/{YEAR}/{month}.md`
2. Add entry at the top with today's date
3. Use the proper category icon and format
4. Include links to new content

The script just automates this process! 