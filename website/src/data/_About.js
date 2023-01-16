import React from "react";

export function AboutBody() {
  return (
    <>
      <h1>Ron Amosa</h1>
      <p>
        Hi, I'm Ron, a Solution Architect, Security and DevOps Engineer, 
        based in Auckland, New Zealand.
      </p>
    </>
  );
}

export const WorkItems = [
  {
    location: "Amazon Web Services",
    link: "https://aws.amazon.com",
    position: "Partner Solution Architect",
    period: "June 2022 - Present.",
    description: (
      <>
        Partner Solution Architect for the Pacific Islands.
      </>
    ),
  },
];

export const EducationItems = [
  {
    link: "https://aws.amazon.com/certification/certified-solutions-architect-associate/?ch=sec&sec=rmg&d=1s",
    certification: "AWS Certified Solutions Architect - Associates",
    period: "2022 - 2025.",
    description: (
      <>
        <b>Certification</b>
        <div data-iframe-width="150" data-iframe-height="270" data-share-badge-id="f4219435-7c98-47d0-9839-fdf39c7c21d2" data-share-badge-host="https://www.credly.com"></div><script type="text/javascript" async src="//cdn.credly.com/assets/utilities/embed.js"></script>
        <p>
        <b>Description</b>
        AWS Certified Solutions Architect - Associate showcases knowledge and skills in AWS technology, across a wide range of AWS services. The focus of this certification is on the design of cost and performance optimized solutions, demonstrating a strong understanding of the AWS Well-Architected Framework. This certification can enhance the career profile and earnings of certified individuals and increase your credibility and confidence in stakeholder and customer interactions.
        </p>
      </>
    ),
  },
  {
    link: "https://aws.amazon.com/certification/certified-cloud-practitioner/",
    certification: "AWS Certified Cloud Practitioner",
    period: "2022 - 2025.",
    description: (
      <>
        <b>Certification</b>
        <div data-iframe-width="150" data-iframe-height="270" data-share-badge-id="f576459e-0c5c-49f7-8b68-cd5e6213fd28" data-share-badge-host="https://www.credly.com"></div><script type="text/javascript" async src="//cdn.credly.com/assets/utilities/embed.js"></script>
        <p>
        <b>Description</b>
        The AWS Certified Cloud Practitioner offers a foundational understanding of AWS Cloud concepts, services, and terminology. This is a good starting point for individuals in non-technical roles with no prior IT or cloud experience or for those with on-premises IT experience looking for basic AWS Cloud fluency. This certification can give candidates the confidence to tackle role-based AWS Certifications.
        </p>
      </>
    ),
  },
  {
    link: "https://training.linuxfoundation.org/certification/certified-kubernetes-security-specialist/",
    certification: "CKS: Certified Kubernetes Security Specialist",
    period: "2021 - 2023.",
    description: (
      <>
        <b>Certification</b>
        <div data-iframe-width="150" data-iframe-height="270" data-share-badge-id="1fe5f731-1d6a-48c1-8d2c-60db0ca73f88" data-share-badge-host="https://www.credly.com"></div><script type="text/javascript" async src="//cdn.credly.com/assets/utilities/embed.js"></script>
        <p>
        <b>Description</b>
        The Certified Kubernetes Security Specialist (CKS) program provides assurance that a CKS has the skills, knowledge, and competence on a broad range of best practices for securing container-based applications and Kubernetes platforms during build, deployment and runtime. CKA certification is required to sit for this exam.
        </p>
      </>
    ),
  },
  {
    link: "https://training.linuxfoundation.org/certification/certified-kubernetes-administrator-cka/",
    certification: "CKA: Certified Kubernetes Administrator",
    period: "2021 - 2024.",
    description: (
      <>
        <b>Certification</b>
        <div data-iframe-width="150" data-iframe-height="270" data-share-badge-id="ffeeb3bd-7506-4154-8730-943867fca56f" data-share-badge-host="https://www.credly.com"></div><script type="text/javascript" async src="//cdn.credly.com/assets/utilities/embed.js"></script>
        <p>
        <b>Description</b>
        The Certified Kubernetes Administrator (CKA) program provides assurance that CKAs have the skills, knowledge, and competency to perform the responsibilities of Kubernetes administrators.
        </p>
      </>
    ),
  },
];
