import React from "react";

const projects = [
  {
    category: "Project",
    title: "Azure Kubernetes Starter Cluster",
    slug: "#nodejs-mysql-cloudformation",
    subtitle:
      "A basic AKS cluster setup using Terraform",
    period: "August 2020",
    tech: "Azure, Terraform",
    description: (
      <>
        <p>
          At the time I was always in need of a quick AKS cluster for testing or demonstrating various things, it made sense to create a simple base terraform setup to use as a complete setup, or the base for something more complex to add on.
        </p>
        <p>
          This example will create a storage account backend for secure terraform state management, ssh keys for access and a separate virtual network for the cluster.
        </p>
        <p>
          A <a href="https://github.com/ronamosa/aks-starter-cluster/blob/master/terraform/Makefile">Makefile</a> is provided to make life easier but after all that you can then spin up a simple <a href="https://azure.microsoft.com/en-us/services/kubernetes-service/">Azure Kubernetes Service</a> and ssh into it as needed.
        </p>
      </>
    ),
    links: [
      {
        name: "GitHub",
        link: "https://github.com/ronamosa/aks-starter-cluster",
      },
    ],
  },
];

export default projects;
