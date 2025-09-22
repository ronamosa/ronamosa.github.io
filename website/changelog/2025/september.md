---
sidebar_position: 1
title: September 2025
description: Changes and additions for September 2025
---

# September 2025

## 📅 2025-09-22

### 🔧 Bug Fixes

- **Pi-hole Docker Unbound Configuration**: Comprehensive fix for custom Unbound configuration not loading in Pi-hole Docker setup. Updated volume mount to `./unbound:/etc/unbound/custom.conf.d` to match official klutchell/unbound-docker example. Fixed configuration file paths, removed problematic logfile directives, and added troubleshooting section explaining common warnings (buffer size, root hints, subnetcache). Added verification tips to confirm custom configs are loading properly. Thanks to @MrLIVB for identifying the incorrect mount path in issue #299.
  - **Link**: [Pi-hole Docker Unbound Guide](/docs/engineer/LAB/pihole-docker-unbound)
  - **Fixes**: [Issue #299](https://github.com/ronamosa/ronamosa.github.io/issues/299)

## 📅 2025-09-13

### 🔧 Bug Fixes

- **Blog Authors Configuration**: Created centralized authors.yml file and updated blog posts to use author keys instead of inline author information, resolving Docusaurus warnings about author configuration

---

## 📅 2025-09-13

### 🛠️ Site Improvements

- **SEO Optimization**: Comprehensive SEO improvements including enhanced frontmatter metadata, optimized image alt text, strategic internal linking, and topic hub landing pages for better search visibility and user navigation

### 🔧 Bug Fixes

- **Blog Authors Configuration**: Created centralized `authors.yml` file and updated blog posts to use author keys instead of inline author information, resolving Docusaurus warnings about author configuration

---

## Template for Future Entries

When adding new changelog entries, use this format:

```markdown
## 📅 YYYY-MM-DD

### {CATEGORY}
- **Title**: Brief description of the change
  - Additional details if needed
  - Links to related content: [Link Text](URL)
```

### Change Type Icons

- 🛠️ Site Improvements
- 📚 Documentation Updates
- 📝 Blog Posts
- 🔧 Bug Fixes
- 🎨 Design Changes
- ⚡ Performance Improvements
- 🔒 Security Updates
- 📦 Dependencies
