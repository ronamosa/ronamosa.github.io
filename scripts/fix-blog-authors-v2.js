#!/usr/bin/env node

/**
 * Blog Authors Fix Script v2
 * Properly converts inline author information to author key references
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
    
    // Split content properly
    const lines = content.split('\n');
    let inFrontmatter = false;
    let frontmatterEnd = -1;
    
    // Find frontmatter boundaries
    for (let i = 0; i < lines.length; i++) {
      if (lines[i].trim() === '---') {
        if (!inFrontmatter) {
          inFrontmatter = true;
        } else {
          frontmatterEnd = i;
          break;
        }
      }
    }
    
    if (frontmatterEnd === -1) {
      return false; // No valid frontmatter found
    }
    
    // Process frontmatter lines
    const frontmatterLines = [];
    let hasAuthorsField = false;
    
    for (let i = 1; i < frontmatterEnd; i++) {
      const line = lines[i];
      
      // Skip old author fields
      if (line.startsWith('author:') || 
          line.startsWith('author_title:') || 
          line.startsWith('author_url:') || 
          line.startsWith('author_image_url:')) {
        continue;
      }
      
      // Check if authors field already exists
      if (line.startsWith('authors:')) {
        hasAuthorsField = true;
      }
      
      frontmatterLines.push(line);
    }
    
    // Add authors field if not present
    if (!hasAuthorsField) {
      frontmatterLines.push('authors: [ronamosa]');
    }
    
    // Reconstruct the file
    const newLines = [
      '---',
      ...frontmatterLines,
      '---',
      ...lines.slice(frontmatterEnd + 1)
    ];
    
    const newContent = newLines.join('\n');
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