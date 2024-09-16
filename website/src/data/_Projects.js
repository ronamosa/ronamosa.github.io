import React from "react";

const projects = [
  {
    category: "Community",
    title: "Pasifika Technology Education Charity",
    slug: "#pasifika-tech-charity",
    imageUrl: "img/projects/ptec.png",
    subtitle:
      "Providing hands-on information technology learning and education for the Pasifika community.",
    period: "EST. 2019",
    tech: "Google Classroom, Scratch, Microbit, Raspberry Pi",
    description: (
      <>
        <p>
        The Pasifika Technology Education Charity is an organisation set up to provide opportunities for Pasifika to learn, up-skill and pursue knowledge in technology and of the technology sector.
        </p>
        <p>
          PTEC.
        </p>
      </>
    ),
    links: [
      {
        name: "Pasifika Technology Education Charity",
        link: "https://pasifikateched.net",
      },
    ],
  },
  {
    category: "Community",
    title: "Pasifika Tech Network (Archived)",
    slug: "#pasifika-tech-network",
    imageUrl: "img/projects/ptn.png",
    subtitle:
      "An online and in-person network of Pasifika technology professionals, students and learners.",
    period: "2021 - 2023",
    tech: "Discord",
    description: (
      <>
        <p>
          <em>Note: This project has been discontinued as of 2024.</em>
        </p>
        <p>
          The Pasifika Tech Network brought together Pasifika from across the technology industry in technical and non-technical roles to share knowledge, collaborate and support our community currently in the industry, and for the incoming generation.
        </p>
      </>
    ),
    links: [
      {
        name: "Project Archive",
        link: "https://web.archive.org/web/20230513020536/https://pasifikatechnetwork.github.io/s",
      },
    ],
  },
];

export default projects;
