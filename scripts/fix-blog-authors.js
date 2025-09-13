#!/usr/bin/env node

/**
 * Blog Authors Fix Script
 * Converts inline author information to author key references for ronamosa.github.io
 */

const fs = require('fs');
const path = require('path');

const BLOG_DIR = path.join(__dirname, '../website/blog');

function fixBlogPost(filePath) {
  try {
    const content = fs.readFileSync(filePath, 'utf8');
    
    // Check if this post has inline author information
    if (!content.includes('author:') && !content.includes('author_title:')) {
      return false; // No changes needed
    }
    
    // Split frontmatter and content
    const parts = content.split('---');
    if (parts.length < 3) {
      return false; // No valid frontmatter
    }
    
    let frontmatter = parts[1];
    const postContent = parts.slice(2).join('---');
    
    // Remove old author fields and add new authors array
    frontmatter = frontmatter
      .replace(/^author:.*$/gm, '')
      .replace(/^author_title:.*$/gm, '')
      .replace(/^author_url:.*$/gm, '')
      .replace(/^author_image_url:.*$/gm, '');
    
    // Add authors field if not already present
    if (!frontmatter.includes('authors:')) {
      frontmatter = frontmatter.trim() + '\nauthors: [ronamosa]';
    }
    
    // Reconstruct the file
    const newContent = `---${frontmatter}\n---${postContent}`;
    
    fs.writeFileSync(filePath, newContent);
    return true;
  } catch (error) {
    console.error(`Error processing ${filePath}:`, error.message);
    return false;
  }
}

function main() {
  const files = fs.readdirSync(BLOG_DIR);
  let fixed = 0;
  
  for (const file of files) {
    if (file.endsWith('.md') && file !== 'authors.yml') {
      const filePath = path.join(BLOG_DIR, file);
      if (fixBlogPost(filePath)) {
        console.log(`Fixed: ${file}`);
        fixed++;
      }
    }
  }
  
  console.log(`\nFixed ${fixed} blog posts`);
}

if (require.main === module) {
  main();
}