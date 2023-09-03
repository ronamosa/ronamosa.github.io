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

## Setup

:::note go modules

if you are working on each module in the same repo, you need to work on each folder (user, product, order) as the root folder for that work otherwise you're going to get reference errors when your module is looking for.

:::

### Modules

Decide if its local reference:

`go mod init 3-microservices/user`

or GitHub reference.

in mod root directory `go mod init github.com/ronamosa/3-microservices/user` creates `go.mod` with this header `module github.com/ronamosa/3-microservices/user`

you have protobuf files like `user.pb.go` under `/user/pb` which will be `package pb` or whatever, but they have to be the same.

then your `main.go` in the `/user` mod folder will be `package main` and refer to the `pb` package like this `user "github.com/ronamosa/3-microservices/user/pb"` where `user` here is an alias for your pb package.

## Commands

:::note individual modules

if you're go mod init in each service directory for independant modules:

```sh
cd 3-microservices/user
go mod init github.com/yourusername/3-microservices/user

cd 3-microservices/product
go mod init github.com/yourusername/3-microservices/product

cd 3-microservices/order
go mod init github.com/yourusername/3-microservices/order
```

install protobuf

```sh
# macos
brew install protobuf

# go mods
go install google.golang.org/protobuf/cmd/protoc-gen-go@v1.26
go install google.golang.org/grpc/cmd/protoc-gen-go-grpc@v1.1
```

### Protobuf generate

To generate the Go code, navigate to each service directory (user, product, order) and run the following command:

```sh
cd user
protoc --go_out=. --go_opt=paths=source_relative --go-grpc_out=. --go-grpc_opt=paths=source_relative *.proto
cd ..

cd product
protoc --go_out=. --go_opt=paths=source_relative --go-grpc_out=. --go-grpc_opt=paths=source_relative *.proto
cd ..

cd order
protoc --go_out=. --go_opt=paths=source_relative --go-grpc_out=. --go-grpc_opt=paths=source_relative *.proto
cd ..
```

Dependencies : `go mod tidy` in the root folder.

## Tests

in the root of each module folder run `go test` to run the `_test.go` unit tests in that folder.

## Containers

Building and running containers for each microservice

```sh
docker build -t userservice .

docker run -p 50051:50051 userservice
```


## Requirements

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

I asked ChatGPT4 to create me a list of tasks to accomplish my requirements above.

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

### 📝 Sep-01-2023

- Complete directory restructure cos I wanted to put everything under `/services` and run it as a monorepo with multiple services in it, rather than 3 individual module microservices in the same folder.
- created all tickets in a new private [Github Projects](https://github.com/users/ronamosa/projects/11).
- refactor of directory structure + added Makefile tested working on orders services, will roll out ot the others as I go.

### 📝 Sep-03-2023

- working on order service, added GORM DB work.
