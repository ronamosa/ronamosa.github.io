/**
 * GA-derived redirects (Apr 4 – Jul 2 2026).
 * Paths verified missing from production build vs Pages_and_screens export.
 * Sources: substack /p/ slugs, nested doc hub URLs, old AWS naming, legacy /documentation/.
 */

function both(path) {
  const normalized = path.startsWith('/') ? path : `/${path}`;
  const withSlash = normalized.endsWith('/') ? normalized : `${normalized}/`;
  return [withSlash];
}

function entry(from, to) {
  return { from: Array.isArray(from) ? from : both(from), to };
}

/** Substack /p/ slugs → current blog posts */
const substackRedirects = [
  entry('/p/ai-and-chatgpt-the-bullshit-generator', '/blog/ai-chatgpt-bullshit-generator-class-wars-why-do/'),
  entry('/p/the-pasifika-problem-and-the-tech', '/blog/pasifika-problem-tech-gambit/'),
  entry('/p/a-samoan-hackers-manifesto', '/blog/a-samoan-hackers-manifesto/'),
  entry('/p/the-duality-of-living-in-privilege', '/blog/duality-of-living-in-privilege-being-pasifika/'),
  entry('/p/an-origin-story-who-am-i-and-why', '/blog/origin-story-who-am-i-why-that-relevant/'),
  entry('/p/the-end-of-everything', '/blog/the-end-of-everything/'),
  entry('/p/unpacking-basecamps-exit-from-the', '/blog/unpacking-basecamp-s-exit-from-cloud/'),
  entry('/p/2023-the-end-is-the-beginning-is', '/blog/2023-end-beginning-end/'),
  entry('/p/the-ai-resistance', '/blog/the-ai-resistance/'),
  entry('/p/the-knowledge-gap-rethinking-the', '/blog/knowledge-gap-rethinking-digital-divide-for-pasifika/'),
  entry('/p/what-happened-to-the-hackers', '/blog/what-happened-to-the-hackers/'),
  entry('/p/your-language-connects-you-to-your', '/blog/your-language-connects-you-to-your-identity-super/'),
  entry('/p/a-brief-history-of-career-burnout', '/blog/brief-history-of-career-burnout-me/'),
  entry('/p/a-weekly-newsletter-about-working', '/blog/weekly-newsletter-about-working-in-tech-other-side-effects/'),
  entry('/p/from-twitch-channels-to-pasifika', '/blog/from-twitch-channels-to-pasifika-tech-networks-going/'),
  entry('/p/new-tech-eyes-open-stay-critical', '/blog/new-tech-eyes-open-stay-critical-of-tech-s-shiny-new-toys/'),
  entry('/p/pasifika-and-the-ai-opportunity', '/blog/pasifika-and-the-ai-opportunity/'),
  entry('/p/the-burden-of-knowing-navigating', '/blog/burden-of-knowing-navigating-life-in-system-built/'),
  entry('/p/the-company-is-not-your-family-and', '/blog/company-not-your-family-other-professional-insights/'),
  entry('/p/the-going-monthly-plan-that-didnt', '/blog/going-monthly-plan-that-didn-t-go-at-all/'),
  entry('/p/there-is-no-pasifika-in-tech-problem', '/blog/there-no-pasifika-in-tech-problem/'),
  entry('/p/to-live-and-die-in-the-simulation', '/blog/to-live-die-in-simulation/'),
  entry('/p/ai-is-a-conversation', '/blog/ai-is-a-conversation/'),
  entry('/p/give-us-the-ai-overlords-already-2ff', '/blog/give-us-ai-overlords-already-part-2/'),
  entry('/p/layers-of-existence', '/blog/layers-of-existence/'),
  entry('/p/liberty-to-tyranny-the-role-of-power', '/blog/liberty-to-tyranny-role-of-power-knowledge-in/'),
  entry('/p/re-host-re-factor-re-up', '/blog/re-host-re-factor-re-up/'),
  entry('/p/tech-gun-for-hire-lessons-from-a', '/blog/tech-gun-for-hire-lessons-from-pasifika-engineer-s-career/'),
  entry('/p/the-advice-i-wish-i-knew-early-in', '/blog/advice-i-would-have-given-young-me-in-tech/'),
  entry('/p/what-have-i-learned-writing-this', '/blog/what-have-i-learned-writing-this-newsletter-for/'),
  entry('/p/winter-is-coming', '/blog/winter-is-coming/'),
  entry('/p/shutting-down-the-pasifika-tech-network', '/blog/shutting-down-pasifika-tech-network/'),
  entry('/p/what-they-dont-tell-you-about-working', '/blog/what-they-don-t-tell-you-about-working-in-tech/'),
  entry('/p/invite-your-friends-to-read-the-uncommon', '/newsletter/'),
];

/** Flattened /docs/engineer/* paths missing the LAB segment */
const engineerLabShorthand = [
  entry('/docs/engineer/pihole-docker-unbound', '/docs/engineer/LAB/pihole-docker-unbound/'),
  entry('/docs/engineer/pihole-compromise', '/docs/engineer/LAB/pihole-compromise/'),
  entry('/docs/engineer/pihole-dns', '/docs/engineer/LAB/pihole-dns/'),
  entry('/docs/engineer/proxmox-hub', '/docs/engineer/LAB/proxmox-hub/'),
  entry('/docs/engineer/proxmox-packer-vm', '/docs/engineer/LAB/proxmox-packer-vm/'),
  entry('/docs/engineer/proxmox-terraform', '/docs/engineer/LAB/proxmox-terraform/'),
  entry('/docs/engineer/proxmox-cloudinit', '/docs/engineer/LAB/proxmox-cloudinit/'),
  entry('/docs/engineer/LAB/home-lab-hub', '/docs/engineer/LAB/'),
];

/** Crawler-generated nested hub URLs (parent slug + child doc slug) */
const nestedHubRedirects = [
  entry('/docs/engineer/LAB/pihole-docker-unbound/pihole-guide', '/docs/engineer/LAB/pihole-guide/'),
  entry('/docs/engineer/LAB/pihole-guide/pihole-docker-unbound', '/docs/engineer/LAB/pihole-docker-unbound/'),
  entry('/docs/engineer/LAB/pihole-docker-unbound/pihole-dns', '/docs/engineer/LAB/pihole-dns/'),
  entry('/docs/engineer/LAB/pihole-guide/pihole-dns', '/docs/engineer/LAB/pihole-dns/'),
  entry('/docs/engineer/LAB/pihole-docker-unbound/pihole-compromise', '/docs/engineer/LAB/pihole-compromise/'),
  entry('/docs/engineer/LAB/pihole-docker-unbound/pihole-servfail-unbound', '/docs/engineer/LAB/fixing-pihole-unbound-servfail-aws/'),
  entry('/docs/engineer/LAB/pihole-guide/pihole-servfail-unbound', '/docs/engineer/LAB/fixing-pihole-unbound-servfail-aws/'),
  entry('/docs/engineer/LAB/pihole-servfail-unbound', '/docs/engineer/LAB/fixing-pihole-unbound-servfail-aws/'),
  entry('/docs/engineer/LAB/pihole-dns/pihole-guide', '/docs/engineer/LAB/pihole-guide/'),
  entry('/docs/engineer/LAB/pihole-docker-unbound/proxmox-hub', '/docs/engineer/LAB/proxmox-hub/'),
  entry('/docs/engineer/LAB/pihole-docker-unbound/home-lab-hub', '/docs/engineer/LAB/'),
  entry('/docs/engineer/LAB/pihole-guide/home-lab-hub', '/docs/engineer/LAB/'),
  entry('/docs/engineer/LAB/pihole-guide/proxmox-hub', '/docs/engineer/LAB/proxmox-hub/'),
  entry('/docs/engineer/LAB/proxmox-hub/proxmox-packer-vm', '/docs/engineer/LAB/proxmox-packer-vm/'),
  entry('/docs/engineer/LAB/proxmox-hub/proxmox-cloudinit', '/docs/engineer/LAB/proxmox-cloudinit/'),
  entry('/docs/engineer/LAB/proxmox-hub/proxmox-terraform', '/docs/engineer/LAB/proxmox-terraform/'),
  entry('/docs/engineer/LAB/proxmox-hub/proxmox-lvm-mount', '/docs/engineer/LAB/proxmox-lvm-mount/'),
  entry('/docs/engineer/LAB/proxmox-hub/pihole-docker-unbound', '/docs/engineer/LAB/pihole-docker-unbound/'),
  entry('/docs/engineer/LAB/proxmox-cloudinit/proxmox-packer-vm', '/docs/engineer/LAB/proxmox-packer-vm/'),
  entry('/docs/engineer/LAB/proxmox-cloudinit/proxmox-terraform', '/docs/engineer/LAB/proxmox-terraform/'),
  entry('/docs/engineer/LAB/proxmox-packer-vm/proxmox-cloudinit', '/docs/engineer/LAB/proxmox-cloudinit/'),
  entry('/docs/engineer/LAB/proxmox-packer-vm/proxmox-lvm-mount', '/docs/engineer/LAB/proxmox-lvm-mount/'),
  entry('/docs/engineer/LAB/proxmox-packer-vm/proxmox-terraform', '/docs/engineer/LAB/proxmox-terraform/'),
  entry('/docs/engineer/LAB/proxmox-packer-vm/proxmox-hub', '/docs/engineer/LAB/proxmox-hub/'),
];

/** Old PascalCase AWS doc paths */
const awsLegacyRedirects = [
  entry('/docs/engineer/AWS/AWS-ECS-1Microservices', '/docs/engineer/AWS/ecs-1-microservices/'),
  entry('/docs/engineer/AWS/AWS-EKS-Create-Clusters', '/docs/engineer/AWS/eks-create-clusters/'),
  entry('/docs/engineer/AWS/AWS-EKS-Workshop', '/docs/engineer/AWS/eks-workshop/'),
  entry('/docs/engineer/AWS/AWS-ECS-Cats-n-Dogs', '/docs/engineer/AWS/ecs-cats-n-dogs/'),
];

/** ronamosa.io /documentation/ and other legacy paths */
const legacySiteRedirects = [
  entry('/documentation/2020-11-19-Ubiquiti-Home-Network-Part1', '/docs/archive/2020-11-19-Ubiquiti-Home-Network-Part1/'),
  entry('/documentation/2020-11-28-Ubiquiti-Home-Network-Part2', '/docs/archive/2020-11-28-Ubiquiti-Home-Network-Part2/'),
  entry('/docs/engineer/2018-06-23-Apache-Reverse-Proxy-TLSv1-2', '/docs/archive/2018-06-23-Apache-Reverse-Proxy-TLSv1-2/'),
  entry('/bulk-delete-outlook-rules-powershell-macos', '/docs/bulk-delete-outlook-rules-powershell-macos/'),
  entry('/proxmox-homelab-guide-cloud-init-packer-terraform-and-lvm', '/docs/engineer/LAB/proxmox-hub/'),
  entry('/articles/privategpt-local-setup-chat-with-documents-privately', '/docs/engineer/AI/PrivateGPT/'),
  entry('/engineer/AI', '/docs/engineer/AI/'),
  entry('/authors', '/blog/authors/'),
  entry('/contact', '/about/'),
  entry('/subsribe', '/newsletter/'),
  entry('/hackathon/getstarted', '/hackathon/get-started/'),
  entry('/hackthon/get-started', '/hackathon/get-started/'),
  entry('/docs/hacker/tryhackme-mr-robot-ctf-all-3-keys', '/docs/hacker/tryhackme/mr_robot/'),
  entry('/docs/engineer/AI/DeployLLMToSageMaker', '/docs/engineer/AI/deploy-llm-sagemaker-manual-guide/'),
  entry('/docs/engineer/AI/ai-projects-hub', '/docs/engineer/AI/'),
  entry('/docs/engineer/AI/DeepLearning.AI', '/docs/engineer/AI/'),
  entry('/docs/engineer/AI/ZGVidWdnaW', '/docs/engineer/AI/'),
  entry('/docs/engineer/Projects/Claude3OpusFinancialAdvisor', '/docs/engineer/AI/Claude3OpusFinancialAdvisor/'),
  entry('/docs/engineer/Projects/LLMLangChainProject', '/docs/engineer/AI/LLMLangChainProject/'),
  entry('/docs/engineer/LAB/gnome-desktop-shortcut', '/docs/engineer/LAB/setup-cursorai-appimage-gnome/'),
  { from: '/hackathon/mentor-guide/"/', to: '/hackathon/mentor-guide/' },
  { from: '/docs/hacker/tryhackme/mr_robot/ vuln hub/', to: '/docs/hacker/tryhackme/mr_robot/' },
];

/** Removed or migrated blog URLs → blog index */
const deadBlogRedirects = [
  entry('/blog/2021/02/01/Security-Tech-Talks-for-Developer-Spaces', '/blog/'),
  entry('/blog/2021/02/10/Purpose-Not-Happiness', '/blog/'),
  entry('/blog/2021/03/11/Do-The-Work', '/blog/'),
  entry('/blog/2019/01/19/New-Year-Review-Resolution', '/blog/'),
  entry('/blog/2020/05/29/AI-Bot-Pipeline', '/blog/'),
  entry('/blog/2022/08/13/Daily-Blog-49', '/blog/'),
  entry('/blog/2023/01/17/Daily-Blog-58', '/blog/'),
  entry('/blog/2022/07/06/Daily-Blog-37', '/blog/'),
  entry('/blog/2023/03/31/Daily-Blog-88', '/blog/'),
  entry('/blog/2023/11/09/Daily-Blog-109', '/blog/'),
  entry('/blog/2022/06/22/Daily-Blog-25', '/blog/'),
  entry('/blog/2022/06/25/Daily-Blog-28', '/blog/'),
  entry('/blog/2022/06/26/Daily-Blog-29', '/blog/'),
  entry('/blog/2022/06/27/Daily-Blog-31', '/blog/'),
  entry('/blog/2022/06/30/Daily-Blog-34', '/blog/'),
  entry('/blog/2022/07/05/Daily-Blog-36', '/blog/'),
  entry('/blog/2022/07/08/Daily-Blog-39', '/blog/'),
  entry('/blog/2022/07/09/Daily-Blog-40', '/blog/'),
  entry('/blog/2022/07/11/Daily-Blog-42', '/blog/'),
  entry('/blog/2022/07/12/Daily-Blog-43', '/blog/'),
  entry('/blog/2025/02/25/agentic-ai-part-1', '/blog/2025/02/12/agentic-ai-part-1/'),
  entry('/blog/tags/politics', '/blog/tags/tech-politics/'),
  entry('/blog/page/8', '/blog/'),
  entry('/blog/page/9', '/blog/'),
  entry('/blog/page/10', '/blog/'),
];

module.exports = [
  ...substackRedirects,
  ...engineerLabShorthand,
  ...nestedHubRedirects,
  ...awsLegacyRedirects,
  ...legacySiteRedirects,
  ...deadBlogRedirects,
];
