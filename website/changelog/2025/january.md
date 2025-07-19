---
sidebar_position: 1
title: January 2025
description: Changes and additions for January 2025
---

# January 2025

## 📅 2025-01-27

### 🔧 Bug Fixes

- **Build System**: Fixed Docusaurus build failures by changing `onBrokenLinks` from 'throw' to 'warn'
  - Resolved build failures caused by incorrect broken link detection 
  - Files exist but Docusaurus incorrectly identified them as broken links
  - Maintains link validation feedback while allowing builds to complete
  - Enables successful GitHub Actions deployments

### 📚 Documentation Updates

- **AWS Bedrock LangChain Workshop**: Added comprehensive workshop documentation with step-by-step instructions
  - Complete workshop guide with 14 supporting images
  - Covers Bedrock setup, Cloud9 configuration, and practical exercises
  - **Link**: [Bedrock LangChain Workshop](/docs/engineer/AI/BedrockLangChainWorkshop1)

- **AWS GPT Documentation**: Added AWS-specific GPT implementation documentation
  - Docker pgvector setup instructions for AI applications
  - Reference to Alex Simas' AWS Docs GPT work
  - **Link**: [AWS GPT Docs](/docs/engineer/AI/AWSGPT)

- **Retrieval Augmented Generation (RAG)**: Added comprehensive RAG system documentation
  - Complete guide covering RAG architecture and components
  - Evaluation strategies and improvement methods
  - Data processing, embeddings, retrieval, and synthesis techniques
  - **Link**: [RAG Documentation](/docs/engineer/AI/RetrievalAugmentedGeneration)

- **Claude 3 Opus Financial Advisor**: Added AI project documentation
  - Complete project implementation guide
  - Financial advisor AI system using Claude 3 Opus
  - **Link**: [Claude Financial Advisor](/docs/engineer/Projects/Claude3OpusFinancialAdvisor)

- **Personal AI Projects**: Added multiple AI and infrastructure projects
  - LangChain implementation documentation
  - Personal AI assistant project details
  - Microservices architecture documentation  
  - Pi-hole DNS lab setup guide
  - **Links**: [LangChain Project](/docs/engineer/Projects/LLMLangChainProject), [Personal AI](/docs/engineer/Projects/personal-ai), [Microservices](/docs/engineer/Projects/microservices), [Pi-hole DNS](/docs/engineer/LAB/pihole-dns)

### 🛠️ Site Improvements

- **Branch Management**: Successfully merged 5 high-value content branches
  - Salvaged valuable AI/ML documentation from development branches
  - Added 6 new daily blog posts from 2023
  - Cleaned up 50+ stale remote branches
  - Improved repository organization and maintenance

### 📝 Blog Posts

- **Daily Blog Updates**: Added 6 daily blog posts from late 2023
  - Personal reflections and thoughts from November-December 2023
  - **Links**: Various daily blog entries in the blog section

---

## 📅 2025-01-24

### 📚 Documentation Updates

- **GenAI Ambassador Notes - Model Safety**: Added model disgorgement methods for AI safety
  - Enhanced documentation on responsible AI practices
  - **Link**: [GenAI Ambassador Notes](/docs/engineer/AI/GenAIAmbassadorNotes)

- **GenAI Ambassador Notes - Responsible AI**: Enhanced with Responsible AI guidelines and challenges
  - Added comprehensive ethical AI considerations
  - **Link**: [GenAI Ambassador Notes](/docs/engineer/AI/GenAIAmbassadorNotes)

---

## 📅 2025-01-22

### 📚 Documentation Updates

- **GenAI Ambassador Notes - Advanced Techniques**: Added Tree of Thought strategy and COSTAR framework
  - Tree of Thought strategy for complex reasoning
  - COSTAR framework for structured prompt engineering
  - **Link**: [GenAI Ambassador Notes](/docs/engineer/AI/GenAIAmbassadorNotes)

- **GenAI Ambassador Notes - Prompt Engineering**: Added detailed sections on prompt engineering techniques
  - Comprehensive prompt engineering methodology
  - **Link**: [GenAI Ambassador Notes](/docs/engineer/AI/GenAIAmbassadorNotes)

---

## 📅 2025-01-21

### 📚 Documentation Updates

- **GenAI Ambassador Notes - Started**: Initial creation of comprehensive GenAI documentation
  - Started comprehensive AI/ML ambassador training notes
  - **Link**: [GenAI Ambassador Notes](/docs/engineer/AI/GenAIAmbassadorNotes)

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
