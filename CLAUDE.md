# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

This is a Docusaurus-based personal website for Ron Amosa (ronamosa.io), featuring a digital garden/blog space with comprehensive documentation, blog posts, and changelog tracking. The site is built using Docusaurus v3.8.1 and hosted on GitHub Pages.

## Development Commands

All development work should be done in the `website/` directory:

```bash
cd website/

# Development server
npm run start

# Production build
npm run build

# Serve built files locally
npm run serve

# Deploy to GitHub Pages
npm run deploy

# Clear Docusaurus cache
npm run clear
```

## Architecture and Structure

### Key Directories

- **`website/docs/`** - Main documentation organized by categories:
  - `engineer/` - Engineering guides and tutorials  
  - `hacker/` - Security and penetration testing content
  - `study/` - Study materials and notes
  - `books/` - Book summaries and reviews
  - `archive/` - Archived content

- **`website/blog/`** - Blog posts with date-prefixed filenames (`YYYY-MM-DD-Post-Title.md`)

- **`website/changelog/`** - Monthly changelog files organized by year (`2024/`, `2025/`)

- **`website/src/`** - Custom React components and CSS

### Docusaurus Configuration

- **Config file**: `website/docusaurus.config.js`
- **Dark mode only**: `disableSwitch: true`
- **Algolia search**: Configured with appId `9UFF3RBJQ9`
- **Dual docs plugin**: Main docs + separate changelog docs
- **GitHub Pages deployment**: Uses `gh-pages` package

### Changelog System

This project has a sophisticated changelog tracking system:

1. **Automatic changelog helper**: Use `node scripts/changelog-helper.js`
   ```bash
   # Examples:
   node scripts/changelog-helper.js docs "New Guide" "Description" "path/to/content"
   node scripts/changelog-helper.js fix "Bug Fix" "Fixed navigation issue"
   ```

2. **Manual updates**: Edit files in `website/changelog/{YEAR}/{month}.md`

3. **Categories and icons**:
   - `site` - 🛠️ Site Improvements
   - `docs` - 📚 Documentation Updates
   - `blog` - 📝 Blog Posts
   - `fix` - 🔧 Bug Fixes
   - `design` - 🎨 Design Changes
   - `perf` - ⚡ Performance Improvements
   - `security` - 🔒 Security Updates
   - `deps` - 📦 Dependencies

### Content Creation Rules

**ALWAYS update the changelog when making significant changes:**

- ✅ Adding new documentation files
- ✅ Creating new blog posts
- ✅ Site configuration changes
- ✅ Adding new features or components
- ❌ Minor typo fixes
- ❌ Formatting-only changes

**File naming conventions:**
- Documentation: `feature-name-guide.md` 
- Blog posts: `YYYY-MM-DD-Post-Title.md`
- Use kebab-case for filenames

**Content structure:**
- Always include proper frontmatter
- Use consistent heading hierarchy (h1 → h2 → h3)
- Include alt text for images
- Test all links before publishing

### Build Configuration

- **Broken links**: Set to 'warn' instead of 'throw' to allow builds
- **MDX support**: v3.1.0 with React 18
- **Prism highlighting**: Supports Ruby, HCL, Docker, YAML
- **FontAwesome icons**: Integrated for UI enhancements

## Development Workflow

1. Make changes to documentation or blog posts
2. **Before committing**: Update changelog using script or manually
3. Build and test locally: `npm run build`
4. Commit both changes and changelog updates together
5. Deploy: `npm run deploy` (if needed)

## Important Notes

- The main working directory is `website/` - not the root
- Changelog updates are critical for site value and content discovery
- Uses GitHub Pages with custom domain (ronamosa.io)
- Search is powered by Algolia with index 'ronamosa'
- Site analytics via Google Analytics (G-DMRNTVGLRC)