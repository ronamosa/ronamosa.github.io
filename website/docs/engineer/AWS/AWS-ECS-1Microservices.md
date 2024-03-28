---
title: "AWS Workshop ECS Microservices"
---

:::tip Workshop Links

- ECS Workshop: [Microservices](https://ecsworkshop.com/microservices/)

:::

:::note

I am running this from my local machine, with AWS creds and config setup with keys.

:::

Going the `copilot` route.

Get the repo:

```bash
cd ~/environment
git clone https://github.com/aws-containers/ecsdemo-platform
git clone https://github.com/aws-containers/ecsdemo-frontend
git clone https://github.com/aws-containers/ecsdemo-nodejs
git clone https://github.com/aws-containers/ecsdemo-crystal
```

ensure IAM `service-linked` requirements met OR create them

```bash
aws iam get-role --role-name "AWSServiceRoleForElasticLoadBalancing" || aws iam create-service-linked-role --aws-service-name "elasticloadbalancing.amazonaws.com"

aws iam get-role --role-name "AWSServiceRoleForECS" || aws iam create-service-linked-role --aws-service-name "ecs.amazonaws.com"
```

## Frontend

```bash
cd ~/ecsdemo-frontend
copilot init
```

Answers:

```text
**Application name**: ecsmicroservices
**Service Type**: Load Balanced Web Service
**What do you want to name this Load Balanced Web Service**: ecsdemo-frontend
**Dockerfile**: ./Dockerfile
```

don't deploy an environment yet, update the `manifest.yml` file first

```bash
cat << EOF >> copilot/ecsdemo-frontend/manifest.yml
variables:
  CRYSTAL_URL: "http://ecsdemo-crystal.test.ecsmicroservices.local:3000/crystal"
  NODEJS_URL: "http://ecsdemo-nodejs.test.ecsmicroservices.local:3000"
EOF
```

get the git hash as the version number:

```bash
~/ecsdemo-frontend ❯ git rev-parse --short=7 HEAD > code_hash.txt        
~/ecsdemo-frontend ❯ cat code_hash.txt
cb85859
```

now deploy the env

```bash
~/Repositories/environment/ecsdemo-frontend on main !1 ?3 ❯ copilot svc deploy 
Found only one service, defaulting to: ecsdemo-frontend
Only found one option, defaulting to: test
WARNING! Your password will be stored unencrypted in /home/rxhackk/.docker/config.json.
Configure a credential helper to remove this warning. See
https://docs.docker.com/engine/reference/commandline/login/#credentials-store

Login Succeeded
[+] Building 141.4s (11/11) FINISHED                      docker:default
 => [internal] load build definition from Dockerfile                                                                              0.1s
 => => transferring dockerfile: 982B0.0s
 => [internal] load metadata for public.ecr.aws/bitnami/ruby:2.5                                                                  3.5s
 => [internal] load .dockerignore                         0.1s
 => => transferring context: 45B    0.0s
 => [1/6] FROM public.ecr.aws/bitnami/ruby:2.5@sha256:fb00ab79006927ea50bfc1a8ed08803ec7bf8dd54e3bbeeaed7a1871c275c288           15.6s
 => => resolve public.ecr.aws/bitnami/ruby:2.5@sha256:fb00ab79006927ea50bfc1a8ed08803ec7bf8dd54e3bbeeaed7a1871c275c288            0.0s
 => => sha256:a8ad656a84c0f35e8c5f29562233783cf66436154e0578f888663000ec9df848 767B / 767B                                        1.1s
 => => sha256:48991004b3242fd50f3e5733c92f35684b4af67ca557e9541963096396a21224 178.21MB / 178.21MB                                9.0s
 => => sha256:fb00ab79006927ea50bfc1a8ed08803ec7bf8dd54e3bbeeaed7a1871c275c288 1.57kB / 1.57kB                                    0.0s
 => => sha256:5172fb39c74054babc28b7a4573db3f56724374476c11ac81ec55a6f8c957178 4.41kB / 4.41kB                                    0.0s
 => => sha256:3cc1ae8ac7e05bd9e71d854824f5bd72c0e2e2843369ae2630f98d28f70affe9 26.72MB / 26.72MB                                  2.8s
 => => sha256:c9967730b13863b874328168d5d4e56d04ba88f27fb6e6b51d42c7ca8144ff93 10.10MB / 10.10MB                                  3.3s
 => => sha256:6e9279bed9c1992e48b771708e226ac95f246684e2623a2ae12997691e0d51d9 5.21kB / 5.21kB                                    3.7s
 => => extracting sha256:3cc1ae8ac7e05bd9e71d854824f5bd72c0e2e2843369ae2630f98d28f70affe9                                         1.1s
 => => sha256:b14c5e200b023ea379586337f24e50ab7c9a033c42b907205f9a9aa5f4682695 92B / 92B                                          4.3s
 => => extracting sha256:a8ad656a84c0f35e8c5f29562233783cf66436154e0578f888663000ec9df848                                         0.0s
 => => extracting sha256:48991004b3242fd50f3e5733c92f35684b4af67ca557e9541963096396a21224                                         4.3s
 => => extracting sha256:c9967730b13863b874328168d5d4e56d04ba88f27fb6e6b51d42c7ca8144ff93                                         0.8s
 => => extracting sha256:6e9279bed9c1992e48b771708e226ac95f246684e2623a2ae12997691e0d51d9                                         0.0s
 => => extracting sha256:b14c5e200b023ea379586337f24e50ab7c9a033c42b907205f9a9aa5f4682695                                         0.0s
 => [internal] load build context   0.1s
 => => transferring context: 1.80MB 0.0s
 => [2/6] COPY Gemfile Gemfile.lock /usr/src/app/                                                                                 0.2s
 => [3/6] WORKDIR /usr/src/app      0.1s
 => [4/6] RUN apt-get update && apt-get -y install iproute2 curl jq libgmp3-dev ruby-dev build-essential sqlite libsqlite3-dev python3 python3-pip &&     gem install bundler:1.17.3 &&     bundle install &&     pip3 insta  113.9s
 => [5/6] COPY . /usr/src/app       0.2s
 => [6/6] RUN chmod +x /usr/src/app/startup-cdk.sh                                                                                0.5s
 => exporting to image              7.2s
 => => exporting layers             7.2s
 => => writing image sha256:726042323e3a3a30cc008f589bdff274d3edf41c91f685dd7c9ce1ef3526e7ad                                      0.0s
 => => naming to REDACTED.dkr.ecr.us-east-1.amazonaws.com/ecsmicroservices/ecsdemo-frontend:latest                            0.0s
The push refers to repository [REDACTED.dkr.ecr.us-east-1.amazonaws.com/ecsmicroservices/ecsdemo-frontend]
5f70bf18a086: Pushed 
66da57c7eee2: Pushed 
abe954d8444e: Pushed 
7608e2c087c3: Pushed 
097184cb5649: Pushed 
ca58e20a1e0a: Pushed 
b8f1b3c1c4cb: Pushed 
958773801523: Pushed 
caa232770d56: Pushed 
9da9c7071a76: Pushed 
latest: digest: sha256:73624356fecc960bb59c20cbf356d2d06f7a1b5fc5c6691ed12f2e7fdd916618 size: 2618
✔ Proposing infrastructure changes for stack ecsmicroservices-test-ecsdemo-frontend
- Creating the infrastructure for stack ecsmicroservices-test-ecsdemo-frontend    [create complete]     [435.9s]
  - An Addons CloudFormation Stack for your additional AWS resources              [create complete]     [245.5s]
  - Service discovery for your services to communicate within the VPC             [create complete]     [0.0s]
  - Update your environment's shared resources                                    [update complete]     [167.2s]
    - A security group for your load balancer allowing HTTP traffic               [create complete]     [2.5s]
    - An Application Load Balancer to distribute public traffic to your services  [create complete]     [158.7s]
    - A load balancer listener to route HTTP traffic                              [create in progress]  [236.9s]
  - An IAM role to update your environment stack                                  [create complete]     [16.8s]
  - An IAM Role for the Fargate agent to make AWS API calls on your behalf        [create complete]     [16.8s]
  - An HTTP listener rule for path `/` that forwards HTTP traffic to your tasks   [create complete]     [0.0s]
  - A custom resource assigning priority for HTTP listener rules                  [create complete]     [0.0s]
  - A CloudWatch log group to hold your service logs                              [create complete]     [9.6s]
  - An IAM Role to describe load balancer rules for assigning a priority          [create complete]     [16.8s]
  - An ECS service to run and maintain your tasks in the environment cluster      [create complete]     [165.3s]
    Deployments                                                                                         
               Revision  Rollout      Desired  Running  Failed  Pending                                          
      PRIMARY  1         [completed]  1        1        0       0                                                
  - A target group to connect the load balancer to your service on port 3000      [create complete]     [16.8s]
  - An ECS task definition to group your containers and run them on ECS           [create complete]     [4.1s]
  - An IAM role to control permissions for the containers in your tasks           [create complete]     [17.0s]
✔ Deployed service ecsdemo-frontend.
Recommended follow-up action:
  - Your service is accessible at http://ecsmic-Publi-zaueLaa0sVQT-274480243.us-east-1.elb.amazonaws.com over the internet.
~/Repositories/environment/ecsdemo-frontend on main !1 ?3 ❯
```

tried this command, doesn't work as per docs:

```bash
~/Repositories/environment/ecsdemo-frontend on main !1 ?3 ❯ copilot svc show -n ecsdemo-frontend --json | jq -r .routes[].url

zsh: no matches found: .routes[].url
```

this is the right command (r=raw format)

```bash
~/Repositories/environment/ecsdemo-frontend on main !1 ?3 ❯ copilot svc show -n ecsdemo-frontend --json | jq  -r '.routes[].url'
http://ecsmic-Publi-zaueLaa0sVQT-274480243.us-east-1.elb.amazonaws.com"
```

the full JSON output:

```bash
~/Repositories/environment/ecsdemo-frontend on main !1 ?3 ❯ copilot svc show -n ecsdemo-frontend --json | jq . 
{
  "service": "ecsdemo-frontend",
  "type": "Load Balanced Web Service",
  "application": "ecsmicroservices",
  "configurations": [
    {
      "environment": "test",
      "port": "3000",
      "cpu": "256",
      "memory": "512",
      "platform": "LINUX/X86_64",
      "tasks": "1"
    }
  ],
  "routes": [
    {
      "environment": "test",
      "url": "http://ecsmic-Publi-zaueLaa0sVQT-274480243.us-east-1.elb.amazonaws.com"
    }
  ],
  "serviceDiscovery": [
    {
      "environment": [
        "test"
      ],
      "endpoint": "ecsdemo-frontend.test.ecsmicroservices.local:3000"
    }
  ],
  "serviceConnect": [
    {
      "environment": [
        "test"
      ],
      "endpoint": "ecsdemo-frontend:3000"
    }
  ],
  "variables": [
    {
      "environment": "test",
      "name": "COPILOT_SERVICE_DISCOVERY_ENDPOINT",
      "value": "test.ecsmicroservices.local",
      "container": "ecsdemo-frontend"
    },
    {
      "environment": "test",
      "name": "COPILOT_LB_DNS",
      "value": "ecsmic-Publi-zaueLaa0sVQT-274480243.us-east-1.elb.amazonaws.com",
      "container": "ecsdemo-frontend"
    },
    {
      "environment": "test",
      "name": "COPILOT_APPLICATION_NAME",
      "value": "ecsmicroservices",
      "container": "ecsdemo-frontend"
    },
    {
      "environment": "test",
      "name": "COPILOT_SERVICE_NAME",
      "value": "ecsdemo-frontend",
      "container": "ecsdemo-frontend"
    },
    {
      "environment": "test",
      "name": "COPILOT_ENVIRONMENT_NAME",
      "value": "test",
      "container": "ecsdemo-frontend"
    }
  ]
}
~/Repositories/environment/ecsdemo-frontend on main !1 ?3 ❯
```

### Scale svc out

edit `manifest.yml` find the `count` and set it from `1` to `3`.

run `copilot svc deploy`...

```bash
~/Repositories/environment/ecsdemo-frontend on main !1 ?3 ❯ copilot svc deploy                                                                                                                      took  44s at  17:10:29
Found only one service, defaulting to: ecsdemo-frontend
Only found one option, defaulting to: test
WARNING! Your password will be stored unencrypted in /home/rxhackk/.docker/config.json.
Configure a credential helper to remove this warning. See
https://docs.docker.com/engine/reference/commandline/login/#credentials-store

Login Succeeded
[+] Building 5.9s (11/11) FINISHED                                                        docker:default
 => [internal] load build definition from Dockerfile                                                0.0s
 => => transferring dockerfile: 982B                                                                0.0s
 => [internal] load metadata for public.ecr.aws/bitnami/ruby:2.5                                    2.3s
 => [internal] load .dockerignore                                                                   0.0s
 => => transferring context: 45B                                                                    0.0s
 => [1/6] FROM public.ecr.aws/bitnami/ruby:2.5@sha256:fb00ab79006927ea50bfc1a8ed08803ec7bf8dd54e3bbeeaed7a1871c275c288                                                                                                          0.0s
 => [internal] load build context                                                                   0.0s
 => => transferring context: 10.47kB                                                                0.0s
 => CACHED [2/6] COPY Gemfile Gemfile.lock /usr/src/app/                                            0.0s
 => CACHED [3/6] WORKDIR /usr/src/app                                                               0.0s
 => CACHED [4/6] RUN apt-get update && apt-get -y install iproute2 curl jq libgmp3-dev ruby-dev build-essential sqlite libsqlite3-dev python3 python3-pip &&     gem install bundler:1.17.3 &&     bundle install &&     pip3   0.0s
 => [5/6] COPY . /usr/src/app                                                                       0.2s
 => [6/6] RUN chmod +x /usr/src/app/startup-cdk.sh                                                  0.5s
 => exporting to image                                                                              2.6s
 => => exporting layers                                                                             2.6s
 => => writing image sha256:700d90f515f2eaab2ce16850378ae16c53048ea3794550cc0fe418109a5c664f        0.0s
 => => naming to REDACTED.dkr.ecr.us-east-1.amazonaws.com/ecsmicroservices/ecsdemo-frontend:latest                                                                                                                          0.0s
The push refers to repository [REDACTED.dkr.ecr.us-east-1.amazonaws.com/ecsmicroservices/ecsdemo-frontend]
5f70bf18a086: Layer already exists 
6ed319876ad1: Pushed 
abe954d8444e: Layer already exists 
7608e2c087c3: Layer already exists 
097184cb5649: Layer already exists 
ca58e20a1e0a: Layer already exists 
b8f1b3c1c4cb: Layer already exists 
958773801523: Layer already exists 
caa232770d56: Layer already exists 
9da9c7071a76: Layer already exists 
latest: digest: sha256:8650ce8fdf433b90cf063d6e18b89501a9eb6a750defc27646d0adc88b932c6d size: 2618
✔ Proposing infrastructure changes for stack ecsmicroservices-test-ecsdemo-frontend
- Updating the infrastructure for stack ecsmicroservices-test-ecsdemo-frontend                         [update in progress]  [515.9s]
- Updating the infrastructure for stack ecsmicroservices-test-ecsdemo-frontend                         [update in progress]  [543.8s]
- Updating the infrastructure for stack ecsmicroservices-test-ecsdemo-frontend                         [update in progress]  [544.0s]
- Updating the infrastructure for stack ecsmicroservices-test-ecsdemo-frontend                         [update in progress]  [544.1s]
- Updating the infrastructure for stack ecsmicroservices-test-ecsdemo-frontend                         [update in progress]  [544.3s]
- Updating the infrastructure for stack ecsmicroservices-test-ecsdemo-frontend                         [update in progress]  [544.4s]
- Updating the infrastructure for stack ecsmicroservices-test-ecsdemo-frontend                         [update in progress]  [544.5s]
- Updating the infrastructure for stack ecsmicroservices-test-ecsdemo-frontend                         [update complete]  [697.8s]
  - An ECS service to run and maintain your tasks in the environment cluster                           [update complete]  [677.9s]
    Deployments                                                                                                           
               Revision  Rollout      Desired  Running  Failed  Pending 
      PRIMARY  2         [completed]  3        3        0       0       
    Latest 1 stopped task                                                                                                 
      TaskId    CurrentStatus  DesiredStatus                                                                                       
      c8f78563  STOPPED        STOPPED                                                                                             
       
    ✘ Latest 1 task stopped reason                                                                               
      - [c8f78563]: Task failed ELB health checks in (target-group arn:aws:ela                                                     
        sticloadbalancing:us-east-1:REDACTED:targetgroup/ecsmic-Targe-SMMV                                                     
        QPCVRIBS/86a54506434cfa92)                                                                                                 
       
    Troubleshoot task stopped reason                                                                                      
      1. You can run `copilot svc logs --previous` to see the logs of the last stopped task.                              
      2. You can visit this article: https://repost.aws/knowledge-center/ecs-task-stopped.                                
       
    ✘ Latest failure event                                                                                       
      - (service ecsmicroservices-test-ecsdemo-frontend-Service-e3Q1Xu14Yc1V)                                                      
        (port 3000) is unhealthy in (target-group arn:aws:elasticloadbalancing
        :us-east-1:REDACTED:targetgroup/ecsmic-Targe-SMMVQPCVRIBS/86a54506                                                     
        434cfa92) due to (reason Health checks failed).                                                                            
  - An ECS task definition to group your containers and run them on ECS                                [delete complete]  [3.9s]
✔ Deployed service ecsdemo-frontend.
Recommended follow-up action:
  - Your service is accessible at http://ecsmic-Publi-zaueLaa0sVQT-274480243.us-east-1.elb.amazonaws.com over the internet.
  ```

all seems to be up & running. curious how I can check there are three services running now?

## Backend: NodeJS

Follow same pattern as frontend, code hash etc, copilot init etc.

I get down to the deploying environment, test, and get this error:

```bash
~/R/en/ecsdemo-nodejs on main !1 ❯ copilot init                                                              at  17:30:15
Welcome to the Copilot CLI! We're going to walk you through some questions
to help you get set up with a containerized application on AWS. An application is a collection of
containerized services that operate together.

Application name: ecsmicroservices
Workload type: Backend Service
Dockerfile: ./Dockerfile
Ok great, we'll set up a Backend Service named ecsdemo-nodejs in application ecsmicroservices.

✔ Proposing infrastructure changes for stack ecsmicroservices-infrastructure-roles
✔ The directory copilot will hold service manifests for application ecsmicroservices.

✔ Wrote the manifest for service ecsdemo-nodejs at copilot/ecsdemo-nodejs/manifest.yml
Your manifest contains configurations like your container size and port.

- Update regional resources with stack set "ecsmicroservices-infrastructure"  [succeeded]           [9.6s]
  - Update resources in region "us-east-1"                                    [update complete]     [4.3s]
    - ECR container image repository for "ecsdemo-nodejs"                     [create in progress]  [3.7s]
All right, you're all set for local development.
Deploy: Yes
Environment: test
✘ read manifest for environment "test": file /home/rxhackk/Repositories/environment/ecsdemo-nodejs/copilot/environments/test/manifest.yml does not exists
```

I resumed work on the project on my macbook, **deleted** the NodeJS service and did another `init`

```bash
 ~/R/AWSECS/ecsdemo-nodejs on main ❯ copilot svc delete --name ecsdemo-nodejs                              took  16s at  17:39:31
Application: ecsmicroservices
Sure? Yes
- Update regional resources with stack set "ecsmicroservices-infrastructure"  [succeeded]                            [5.3s]
- Update regional resources with stack set "ecsmicroservices-infrastructure"  [succeeded]        [5.3s]
  - Update resources in region "us-east-1"                                    [update complete]  [2.1s]

✔ Deleted service ecsdemo-nodejs from application ecsmicroservices.
Recommended follow-up action:
  - Run `copilot pipeline deploy` to update the corresponding pipeline if it exists.
```

then reinit (remember this is a backend service)

- I had to delete it again as I chose the wrong type.
- manually deleted the `manifest.yaml` file `rm copilot/ecsdemo-nodejs/manifest.jml`
- reinit and redeploy had specific commands, see below

re init:

```bash
~ /Repos/AWSECS/ecsdemo-nodejs on main ?1 ❯ copilot svc init --name ecsdemo-nodejs
Note: It's best to run this command in the root of your workspace.
Service type: Backend Service
Dockerfile: ./Dockerfile
Note: Architecture type arm64 has been detected. We will set platform 'linux/x86_64' instead. If you'd rather build and run as architecture type arm64, please change the 'platform' field in your workload manifest to 'linux/arm64'.
✔ Wrote the manifest for service ecsdemo-nodejs at copilot/ecsdemo-nodejs/manifest.yml
Your manifest contains configurations like your container size and port.

- Update regional resources with stack set "ecsmicroservices-infrastructure"  [succeeded]        [12.9s]
  - Update resources in region "us-east-1"                                    [update complete]  [8.8s]
    - ECR container image repository for "ecsdemo-nodejs"                     [create complete]  [3.4s]
Recommended follow-up actions:
  - Update your manifest copilot/ecsdemo-nodejs/manifest.yml to change the defaults.
  - Run `copilot svc deploy --name ecsdemo-nodejs --env test` to deploy your service to a test environment.
```

deploy

```bash
~/Repos/AWSECS/ecsdemo-nodejs on main ?1 ❯ copilot svc deploy --name ecsdemo-nodejs --env test         
Login Succeeded
[+] Building 1.8s (10/10) FINISHED                                                                 docker:orbstack
 => [internal] load build definition from Dockerfile                                                          0.0s
 => => transferring dockerfile: 785B            0.0s
 => [internal] load metadata for public.ecr.aws/docker/library/ubuntu:18.04                                   1.6s
 => [internal] load .dockerignore               0.0s
 => => transferring context: 72B                0.0s
 => [1/5] FROM public.ecr.aws/docker/library/ubuntu:18.04@sha256:152dc042452c496007f07ca9127571cb9c29697f42acbfad72324b2bb2e43c98                                           0.0s
 => [internal] load build context               0.0s
 => => transferring context: 4.79kB             0.0s
 => CACHED [2/5] WORKDIR /usr/src/app           0.0s
 => CACHED [3/5] COPY package*.json ./          0.0s
 => CACHED [4/5] RUN apt-get update &&    apt install -y curl jq bash nodejs npm python3 python3-pip &&     pip3 install awscli netaddr &&     npm install &&    apt-get p  0.0s
 => [5/5] COPY . .                              0.0s
 => exporting to image                          0.0s
 => => exporting layers                         0.0s
 => => writing image sha256:6f649f55a0053d7060396369d4c22aab5c53ec522cf43ad4d54bdddda8206be8                  0.0s
 => => naming to REDACTED.dkr.ecr.us-east-1.amazonaws.com/ecsmicroservices/ecsdemo-nodejs:latest          0.0s
The push refers to repository [REDACTED.dkr.ecr.us-east-1.amazonaws.com/ecsmicroservices/ecsdemo-nodejs]
b78718e1942c: Pushed 
cd2559c3eb84: Pushed 
ebe3b449c65c: Pushed 
69440ab5b9c3: Pushed 
548a79621a42: Pushed 
latest: digest: sha256:47812e81534ec2f96cf9bb29669be5922d84f837a610b1b11de517383510f504 size: 1366
✔ Proposing infrastructure changes for stack ecsmicroservices-test-ecsdemo-nodejs
- Creating the infrastructure for stack ecsmicroservices-test-ecsdemo-nodejs  [create complete]  [239.4s]
  - Service discovery for your services to communicate within the VPC         [create complete]  [2.8s]
  - Update your environment's shared resources                                [create complete]  [3.6s]
  - An IAM role to update your environment stack                              [create complete]  [15.4s]
  - An IAM Role for the Fargate agent to make AWS API calls on your behalf    [create complete]  [15.4s]
  - A CloudWatch log group to hold your service logs                          [create complete]  [4.4s]
  - An ECS service to run and maintain your tasks in the environment cluster  [create complete]  [207.9s]
    Deployments                    
               Revision  Rollout      Desired  Running  Failed  Pending                                   
      PRIMARY  2         [completed]  1        1        0       0                                         
  - An ECS task definition to group your containers and run them on ECS       [create complete]  [0.0s]
  - An IAM role to control permissions for the containers in your tasks       [create complete]  [15.4s]
✔ Deployed service ecsdemo-nodejs.
Recommended follow-up action:
  - Your service is accessible at ecsdemo-nodejs:3000 with service connect.
```

so far so good:

```bash
~/Repos/AWSECS/ecsdemo-nodejs on main ?1 ❯ copilot env show env -n test                                                                      took  5m 13s at  18:25:49
About

  Name        test
  Region      us-east-1
  Account ID  833580871776

Workloads

  Name              Type
  ----              ----
  ecsdemo-frontend  Load Balanced Web Service
  ecsdemo-nodejs    Backend Service

Tags

  Key                  Value
  ---                  -----
  copilot-application  ecsmicroservices
  copilot-environment  test
```

:::tip

Where's my frontend URL?

Run this command to get all details:

```bash
~/R/A/ecsdemo-nodejs on main ?1 ❯ copilot svc show                                                                       at  18:31:59
Service name: ecsdemo-frontend
About

  Application  ecsmicroservices
  Name         ecsdemo-frontend
  Type         Load Balanced Web Service

Configurations

  Environment  Tasks     CPU (vCPU)  Memory (MiB)  Platform      Port
  -----------  -----     ----------  ------------  --------      ----
  test         3         0.25        512           LINUX/X86_64  3000

Routes

  Environment  URL
  -----------  ---
  test         http://ecsmic-Publi-zaueLaa0sVQT-274480243.us-east-1.elb.amazonaws.com

Internal Service Endpoints

  Endpoint                                           Environment  Type
  --------                                           -----------  ----
  ecsdemo-frontend:3000                              test         Service Connect
  ecsdemo-frontend.test.ecsmicroservices.local:3000  test         Service Discovery

Variables

  Name                                Container         Environment  Value
  ----                                ---------         -----------  -----
  COPILOT_APPLICATION_NAME            ecsdemo-frontend  test         ecsmicroservices
  COPILOT_ENVIRONMENT_NAME              "                 "          test
  COPILOT_LB_DNS                        "                 "          ecsmic-Publi-zaueLaa0sVQT-274480243.us-east-1.elb.amazonaws.com
  COPILOT_SERVICE_DISCOVERY_ENDPOINT    "                 "          test.ecsmicroservices.local
  COPILOT_SERVICE_NAME                  "                 "          ecsdemo-frontend
```

:::

scale out to 3 tasks by editing the `count` in `manifest.yml`, then check

```bash
~/R/A/ecsdemo-nodejs on main ?1 ❯ copilot svc status -n ecsdemo-nodejs                                        took  27s at  10:42:32

ecsdemo-nodejs found only in environment test
Task Summary

  Running   ██████████  3/3 desired tasks are running
  Health    ██████████  3/3 passes container health checks

Tasks

  ID        Status      Revision    Started At     Cont. Health
  --        ------      --------    ----------     ------------
  7a141ab0  RUNNING     3           6 minutes ago  HEALTHY
  a26f0cda  RUNNING     3           6 minutes ago  HEALTHY
  e853449c  RUNNING     3           6 minutes ago  HEALTHY
```

## Backend: Crystal

Do exactly the same as [NodeJS](#backend-nodejs).

- `git rev-parse --short=7 HEAD > code_hash.txt`
- `copilot init`
- `copilot svc deploy --name ecsdemo-crystal --env test`

then check with `copilot svc status`

```bash
~/Repos/AWSECS/ecsdemo-crystal on main !1 ?1 ❯ copilot svc status                                                        at  11:05:49

Service: ecsdemo-crystal
Task Summary

  Running   ██████████  1/1 desired tasks are running
  Health    ██████████  1/1 passes container health checks

Tasks

  ID        Status      Revision    Started At      Cont. Health
  --        ------      --------    ----------      ------------
  ab2c09c5  RUNNING     1           54 minutes ago  HEALTHY
```