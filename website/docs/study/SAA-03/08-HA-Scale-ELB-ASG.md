---
title: High Availability, Scalability, ELB, ASG
---

:::info

These were the topics I created flashcards for (Remnote) and would revise them using spaced repetition. The formatting is an export from Remnote.

:::

- **High Availability & Scalability**
  - Why are distributed systems the basis for scalability being horizontal or vertical?
    - data writes ‒ differentiation
      - integrity = how do you ensure the data you're reading is accurate? i.e. the most up to date.
      - durability = confident our "writes" are committed to the database before continuing.
    - compute, capacity, data reads ‒ commodity
      - if its generic, the same unit type, "undifferentiated" it can be scaled
  - Active High-Availability vs Passive High-Availability
    - Active-active ~ 2 x call centre buildings with operators working at both at the same time.
    - Active-passive ~ 2 x call centre buildings with operators, 1 x is actively taking calls, the other is on standby in case building one goes down.
- Elastic Load Balancing
  - single-point of contact, distribute seamlessly across downstream instances.
  - Types
    - Classic Load Balancer
    - Application Load Balancer
      - operates at the Application Layer (Layer 7)
      - "target groups" are \{\{downstream\}\} \{\{logical\}\} groups to send traffic to.
      - health checks happens at the \{\{TARGET\}\} GROUP level.
      - target groups for ALB can be― ↓
        - IP addresses (must be private)
        - EC2 Instances
        - Lambda Function
        - ECS Task
      - protocols supported ↓
        - HTTP
        - HTTPS
        - HTTP/2
        - Websocket
    - Network Load Balancer
      - operates at Network Layer (layer 4)
      - protocols: TCP, UDP.
      - if you want "Fast'!
    - Gateway Load Balancer
  - Stick Sessions
  - Cross-Zone Load Balancing
  - SSL Certificates
  - Connection Draining
  - Auto Scaling Groups
    - Scaling Policies
