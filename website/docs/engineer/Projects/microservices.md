---
title: "Microservices Project"
---

:::info

GitHub Repo: [https://github.com/ronamosa/3-microservices](https://github.com/ronamosa/3-microservices)

:::

## Overview

A 3-microservices projects written in Golang because it's a language I want to get better at. The gist of this project is to build a microservices application, in golang, that uses gRPC, containers and CICD as a scale "best practices" model for a SDLC using these technologies.

I'm using ChatGPT to do the heavy lifting and putting the code together and debugging it to a working state. I'm asking it to explain things to me as I go, and seeing if this speeds up the "learning go" process along with debugging and troubleshooting.

## Objective

A microservices app that uses containers and CICD to develop, test and deploy to a cloud environment in other words, "feel" and build the whole process from design, build, deploy, operate.

### Documentation

I want to document the process and learnings as I go, a sort of journal of the process. Most of the notes, officially will be in the commits and docs for the project itself, but maybe a running journal of progress can go here.

## Task List

This list could change and most likely will as the project develops, but so far these are the tasks & to-do for this project

- containerise each service
- setup CICD using GitHub Actions
  - caching for go deps
  - add run unit tests
  - add CI tests
  - automated SAST scanning
  - code coverage tools
- add business logic to each service: user, product, order
- update unit tests
- add IaC to deploy infra
- deploy app to AWS

### GitHub Project Tasks

Asked ChatGPT4 to generate me a task list to complete various aspects of my project:
---

#### **Service 1**

1. **Implement Core Logic for Service 1**
    - Description: Add the core business logic for Service 1.
    - Acceptance Criteria: Core logic should be implemented, and the service should return expected results.
    - Priority: High

2. **Unit Tests for Service 1**
    - Description: Write unit tests to cover all major functionalities of Service 1.
    - Acceptance Criteria: Achieve at least 80% code coverage.
    - Priority: High

3. **Integration Tests for Service 1**
    - Description: Write integration tests to ensure Service 1 interacts correctly with other services and databases.
    - Acceptance Criteria: All tests should pass and confirm data integrity.
    - Priority: Medium

4. **Containerize Service 1**
    - Description: Create a Dockerfile to containerize Service 1.
    - Acceptance Criteria: Service 1 should be runnable as a Docker container.
    - Priority: Medium

---

#### **Service 2**

5. **Implement Core Logic for Service 2**
    - Description: Add the core business logic for Service 2.
    - Acceptance Criteria: Core logic should be implemented, and the service should return expected results.
    - Priority: High

6. **Unit Tests for Service 2**
    - Description: Write unit tests to cover all major functionalities of Service 2.
    - Acceptance Criteria: Achieve at least 80% code coverage.
    - Priority: High

7. **Integration Tests for Service 2**
    - Description: Write integration tests to ensure Service 2 interacts correctly with other services and databases.
    - Acceptance Criteria: All tests should pass and confirm data integrity.
    - Priority: Medium

8. **Containerize Service 2**
    - Description: Create a Dockerfile to containerize Service 2.
    - Acceptance Criteria: Service 2 should be runnable as a Docker container.
    - Priority: Medium

---

#### **Service 3**

9. **Implement Core Logic for Service 3**
    - Description: Add the core business logic for Service 3.
    - Acceptance Criteria: Core logic should be implemented, and the service should return expected results.
    - Priority: High

10. **Unit Tests for Service 3**
    - Description: Write unit tests to cover all major functionalities of Service 3.
    - Acceptance Criteria: Achieve at least 80% code coverage.
    - Priority: High

11. **Integration Tests for Service 3**
    - Description: Write integration tests to ensure Service 3 interacts correctly with other services and databases.
    - Acceptance Criteria: All tests should pass and confirm data integrity.
    - Priority: Medium

12. **Containerize Service 3**
    - Description: Create a Dockerfile to containerize Service 3.
    - Acceptance Criteria: Service 3 should be runnable as a Docker container.
    - Priority: Medium

---

#### **Infrastructure and Deployment**

13. **Terraform Scripts for Infrastructure**
    - Description: Write Terraform scripts to set up the infrastructure.
    - Acceptance Criteria: Infrastructure should be set up and services should be deployable.
    - Priority: High

14. **CI/CD Pipeline**
    - Description: Set up a CI/CD pipeline for automated testing and deployment.
    - Acceptance Criteria: Pipeline should automatically test and deploy the services.
    - Priority: High

---

#### **Performance and Load Testing**

15. **Performance Testing**
    - Description: Conduct performance tests on all services.
    - Acceptance Criteria: All services should meet the performance benchmarks.
    - Priority: Medium

16. **Load Testing**
    - Description: Conduct load tests to simulate high traffic.
    - Acceptance Criteria: Services should handle peak load without crashing.
    - Priority: Medium

---

#### **Additional Considerations**

- For unit and integration tests, consider using a robust testing framework like Testify.
- For containerization, you might want to look into using multi-stage builds to optimize the Docker images.
- For Terraform, consider using remote backends like AWS S3 with state locking and encryption.
- For CI/CD, consider using GitHub Actions or GitLab CI/CD for seamless integration with your code repository.
- For performance and load testing, consider using tools like Apache JMeter or Gatling.

## Log

### 📝 Aug-6-2023

I've been working on all 3 services to the point I have the skeleton of all three, `user`, `product` and `service` they each don't do anything "real" just returns what's expected.

Got user Dockerfile to finally build the thing last night, lot of dep issues trying to `docker build..` until ChatGPT decided to add `RUN go mod download` after go.sum was added in order to find all the deps. Was going round in circles for a short while.

### 📝 Aug-31-2023

Revisiting this project today. Going to setup a GitHub Project for it.
