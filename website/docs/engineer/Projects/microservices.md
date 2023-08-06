---
title: "Microservices Project"
---

:::info

GitHub Repo: [https://github.com/ronamosa/3-microservices](https://github.com/ronamosa/3-microservices)

:::

## Overview

A 3-microservices projects written in Golang because it's a language I want to get better at. The gist of this project is to build a microservices application, in golang, that uses gRPC, containers and CICD as a scale "best practices" model for a SDLC using these technologies.

I'm using ChatGPT to do the heavy lifting and putting the code together and debugging it to a working state.

## Objective

A microservices app that uses containers and CICD to develop, test and deploy to a cloud environment.

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

## Log

### 📝 Aug-6-2023

I've been working on all 3 services to the point I have the skeleton of all three, `user`, `product` and `service` they each don't do anything "real" just returns what's expected.

Got user Dockerfile to finally build the thing last night, lot of dep issues trying to `docker build..` until ChatGPT decided to add `RUN go mod download` after go.sum was added in order to find all the deps. Was going round in circles for a short while.
