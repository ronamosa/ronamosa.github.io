#!/usr/bin/env node

/**
 * Fix malformed frontmatter script
 */

const fs = require('fs');
const path = require('path');

const BLOG_DIR = path.join(__dirname, '../website/blog');

function fixFrontmatter(filePath) {
  try {
    const content = fs.readFileSync(filePath, 'utf8');
    
    // Check if frontmatter is malformed (starts with ---title: instead of proper format)
    if (!content.startsWith('---title:')) {
      return false; // File is fine
    }
    
    const lines = content.split('\n');
    const newLines = ['---'];
    let i = 0;
    
    // Process first line to extract title
    const firstLine = lines[0];
    if (firstLine.startsWith('---title:')) {
      const titlePart = firstLine.replace('---title:', 'title:');
      newLines.push(titlePart);
      i = 1;
    }
    
    // Skip empty lines and add the rest of frontmatter
    while (i < lines.length) {
      const line = lines[i].trim();
      
      if (line === '---') {
        // End of frontmatter
        newLines.push('---');
        i++;
        break;
      } else if (line === '') {
        // Skip empty lines in frontmatter
        i++;
        continue;
      } else {
        // Add non-empty lines
        newLines.push(lines[i]);
        i++;
      }
    }
    
    // Add the rest of the content
    while (i < lines.length) {
      newLines.push(lines[i]);
      i++;
    }
    
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
      if (fixFrontmatter(filePath)) {
        console.log(`Fixed frontmatter: ${file}`);
        fixed++;
      }
    }
  }
  
  console.log(`\nFixed frontmatter in ${fixed} blog posts`);
}

if (require.main === module) {
  main();
}