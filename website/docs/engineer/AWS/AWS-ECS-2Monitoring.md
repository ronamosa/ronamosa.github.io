---
title: "AWS Workshop ECS Monitoring"
---

:::tip Workshop Links

- ECS Workshop: [Monitoring](https://ecsworkshop.com/monitoring/)

:::

:::note

I am running this from my local machine, with AWS creds and config setup with keys.

:::

## Tools Install

All good, nothing new.

## Environment Setup

Following [this](https://ecsworkshop.com/monitoring/container_insights/build_environment/).

From the same setup as [Microservices](/website/docs/engineer/AWS/AWS-ECS-1Microservices.md), you now setup the the app via CDK scripts instead.

:::warning

I didn't delete from the previous section, so I needed to run `copilot app delete` to clear the way for the cdk commands in this part.

:::

### install cdk cli

`sudo npm install -g aws-cdk`

### clear context & deploy

```bash
cdk context --clear && cdk deploy --require-approval never                                                at  18:24:05
All context values cleared.


✨  Synthesis time: 2.48s

current credentials could not be used to assume 'arn:aws:iam::REDACTED:role/cdk-hnb659fds-deploy-role-REDACTED-us-east-1', but are for the right account. Proceeding anyway.

 ❌ Deployment failed: Error: ecsworkshop-base: SSM parameter /cdk-bootstrap/hnb659fds/version not found. Has the environment been bootstrapped? Please run 'cdk bootstrap' (see https://docs.aws.amazon.com/cdk/latest/guide/bootstrapping.html)
    at Deployments.validateBootstrapStackVersion (/usr/local/lib/node_modules/aws-cdk/lib/index.js:436:12032)
    at process.processTicksAndRejections (node:internal/process/task_queues:95:5)
    at async Deployments.buildSingleAsset (/usr/local/lib/node_modules/aws-cdk/lib/index.js:436:10797)
    at async Object.buildAsset (/usr/local/lib/node_modules/aws-cdk/lib/index.js:436:196976)
    at async /usr/local/lib/node_modules/aws-cdk/lib/index.js:436:180802

ecsworkshop-base: SSM parameter /cdk-bootstrap/hnb659fds/version not found. Has the environment been bootstrapped? Please run 'cdk bootstrap' (see https://docs.aws.amazon.com/cdk/latest/guide/bootstrapping.html)
```

because I am running it from my local machine and not in AWS Cloud9, I need to `bootstrap` my environment

```bash
~/Repos/AWSECS/ecsdemo-platform/cdk on main ?3 ❯ cdk bootstrap                                                                                             at  18:29:30
 ⏳  Bootstrapping environment aws://REDACTED/us-east-1...
Trusted accounts for deployment: (none)
Trusted accounts for lookup: (none)
Using default execution policy of 'arn:aws:iam::aws:policy/AdministratorAccess'. Pass '--cloudformation-execution-policies' to customize.
CDKToolkit: creating CloudFormation changeset...
[██████████████████████████████████████▋···················] (8/12)

6:29:59 PM | CREATE_IN_PROGRESS   | AWS::CloudFormation::Stack | CDKToolkit
6:30:24 PM | CREATE_IN_PROGRESS   | AWS::IAM::Policy        | ImagePublishingRoleDefaultPolicy
6:30:29 PM | CREATE_IN_PROGRESS   | AWS::IAM::Policy        | FilePublishingRoleDefaultPolicy
6:30:30 PM | CREATE_IN_PROGRESS   | AWS::IAM::Role          | DeploymentActionRole
```

if successful you'll see this:

```bash
~/Repos/AWSECS/ecsdemo-platform/cdk on main ?3 ❯ cdk bootstrap                                                                                             at  18:29:30
 ⏳  Bootstrapping environment aws://REDACTED/us-east-1...
Trusted accounts for deployment: (none)
Trusted accounts for lookup: (none)
Using default execution policy of 'arn:aws:iam::aws:policy/AdministratorAccess'. Pass '--cloudformation-execution-policies' to customize.
CDKToolkit: creating CloudFormation changeset...
 ✅  Environment aws://REDACTED/us-east-1 bootstrapped.
```

Deploy again

```bash
~/Repos/AWSECS/ecsdemo-platform/cdk on main ?3 ❯ cdk context --clear && cdk deploy --require-approval never                                  took  1m 12s at  18:30:54
All context values cleared.


✨  Synthesis time: 2.73s

ecsworkshop-base:  start: Building 501b12cada059b8a002436a2e40130542e4fe93c4911af529bf4b243ef2a1f88:REDACTED-current_region
ecsworkshop-base:  success: Built 501b12cada059b8a002436a2e40130542e4fe93c4911af529bf4b243ef2a1f88:REDACTED-current_region
ecsworkshop-base:  start: Publishing 501b12cada059b8a002436a2e40130542e4fe93c4911af529bf4b243ef2a1f88:REDACTED-current_region
ecsworkshop-base:  success: Published 501b12cada059b8a002436a2e40130542e4fe93c4911af529bf4b243ef2a1f88:REDACTED-current_region
ecsworkshop-base: deploying... [1/1]
ecsworkshop-base: creating CloudFormation changeset...

 ✅  ecsworkshop-base

✨  Deployment time: 189.54s

Outputs:
ecsworkshop-base.ECSClusterName = container-demo
ecsworkshop-base.ECSClusterSecGrp = []
ecsworkshop-base.FE2BESecGrp = sg-08ad8552ab5a42e2d
ecsworkshop-base.NSArn = arn:aws:servicediscovery:us-east-1:REDACTED:namespace/ns-qbclwxxkojytxj2w
ecsworkshop-base.NSId = ns-qbclwxxkojytxj2w
ecsworkshop-base.NSName = service.local
ecsworkshop-base.ServicesSecGrp = sg-08ad8552ab5a42e2d
ecsworkshop-base.StressToolEc2Id = i-0b5aa0dca21ce4bec
ecsworkshop-base.StressToolEc2Ip = 10.0.0.188
Stack ARN:
arn:aws:cloudformation:us-east-1:REDACTED:stack/ecsworkshop-base/ca39eeb0-ed8d-11ee-b7f5-0affd09b0077

✨  Total time: 192.27s
```

### frontend cdk

Running commands from the workshop as is gets me an error

```bash
~/Repos/AWSECS/ecsdemo-frontend/cdk on main ❯              
cdk context --clear && cdk deploy --require-approval never
All context values cleared.

jsii.errors.JavaScriptError: 
  @jsii/kernel.RuntimeError: Error: Cannot retrieve value from context provider vpc-provider since account/region are not specified at the stack level. Configure "env" with an account and region when you define your stack.See https://docs.aws.amazon.com/cdk/latest/guide/environments.html for more details.
      at Kernel._Kernel_ensureSync (/private/var/folders/kd/2pwbps0n4tl4cz7km7wm63100000gn/T/tmpdqe_wrcc/lib/program.js:10491:23)
      at Kernel.sinvoke (/private/var/folders/kd/2pwbps0n4tl4cz7km7wm63100000gn/T/tmpdqe_wrcc/lib/program.js:9876:102)
      at KernelHost.processRequest (/private/var/folders/kd/2pwbps0n4tl4cz7km7wm63100000gn/T/tmpdqe_wrcc/lib/program.js:11696:36)
      at KernelHost.run (/private/var/folders/kd/2pwbps0n4tl4cz7km7wm63100000gn/T/tmpdqe_wrcc/lib/program.js:11656:22)
      at Immediate._onImmediate (/private/var/folders/kd/2pwbps0n4tl4cz7km7wm63100000gn/T/tmpdqe_wrcc/lib/program.js:11657:46)
      at process.processImmediate (node:internal/timers:476:21)
```

CDK contexts need to be set to specify the account number and region.

3 Options to fix context

#### cdk.json

update `cdk.json` to this

```json
{
  "app": "python3 app.py",
  "context": {
    "@aws-cdk/core:account": "123456789012",
    "@aws-cdk/core:region": "us-east-1"
  }
}
```

#### aws cli

run cdk command with args: `cdk deploy -c account=123456789012 -c region=us-east-1`

#### env vars

```bash
export CDK_DEFAULT_ACCOUNT=123456789012
export CDK_DEFAULT_REGION=us-east-1
```

:::warning

None of these methods worked for me.

What did work was setting `export AWS_DEFAULT_REGION=us-east-1` and `export AWS_DEFAULT_ACCOUNT=123456789` and re-running the cdk deploy command.

:::

Then `cdk deploy`

```bash
~/Repos/AWSECS/ecsdemo-frontend/cdk on main !1 ❯ cdk context --clear && cdk deploy --require-approval never                                                at  20:04:32
All context values cleared.

[Warning at /ecsworkshop-frontend/FrontendFargateLBService/Service/SecurityGroup] Ignoring Egress rule since 'allowAllOutbound' is set to true; To add customized rules, set allowAllOutbound=false on the SecurityGroup

✨  Synthesis time: 10.53s

ecsworkshop-frontend:  start: Building 9379029ed2b9b951adc00b294eed2fd4990bfbc465d165aec5fa17bae49202f1:REDACTED-us-east-1
ecsworkshop-frontend:  success: Built 9379029ed2b9b951adc00b294eed2fd4990bfbc465d165aec5fa17bae49202f1:REDACTED-us-east-1
ecsworkshop-frontend:  start: Publishing 9379029ed2b9b951adc00b294eed2fd4990bfbc465d165aec5fa17bae49202f1:REDACTED-us-east-1
ecsworkshop-frontend:  success: Published 9379029ed2b9b951adc00b294eed2fd4990bfbc465d165aec5fa17bae49202f1:REDACTED-us-east-1
ecsworkshop-frontend: deploying... [1/1]
ecsworkshop-frontend: creating CloudFormation changeset...
[███████████████████████████████████████████████████▌······] (16/18)

8:08:00 PM | CREATE_IN_PROGRESS   | AWS::ECS::Service                         | FrontendFargateLBService/Service/Service
8:08:00 PM | CREATE_IN_PROGRESS   | AWS::CloudFormation::Stack                | ecsworkshop-frontend
```

success looks like

```bash
~/Repos/AWSECS/ecsdemo-frontend/cdk on main !1 ❯ cdk context --clear && cdk deploy --require-approval never                                                at  20:04:32
All context values cleared.

[Warning at /ecsworkshop-frontend/FrontendFargateLBService/Service/SecurityGroup] Ignoring Egress rule since 'allowAllOutbound' is set to true; To add customized rules, set allowAllOutbound=false on the SecurityGroup

✨  Synthesis time: 10.53s

ecsworkshop-frontend:  start: Building 9379029ed2b9b951adc00b294eed2fd4990bfbc465d165aec5fa17bae49202f1:REDACTED-us-east-1
ecsworkshop-frontend:  success: Built 9379029ed2b9b951adc00b294eed2fd4990bfbc465d165aec5fa17bae49202f1:REDACTED-us-east-1
ecsworkshop-frontend:  start: Publishing 9379029ed2b9b951adc00b294eed2fd4990bfbc465d165aec5fa17bae49202f1:REDACTED-us-east-1
ecsworkshop-frontend:  success: Published 9379029ed2b9b951adc00b294eed2fd4990bfbc465d165aec5fa17bae49202f1:REDACTED-us-east-1
ecsworkshop-frontend: deploying... [1/1]
ecsworkshop-frontend: creating CloudFormation changeset...

 ✅  ecsworkshop-frontend

✨  Deployment time: 306.42s

Outputs:
ecsworkshop-frontend.FrontendFargateLBServiceLoadBalancerDNSAFFB8F0B = ecswor-Front-gwdgFnVMYQrg-1215657672.us-east-1.elb.amazonaws.com
ecsworkshop-frontend.FrontendFargateLBServiceServiceURL55F424CF = http://ecswor-Front-gwdgFnVMYQrg-1215657672.us-east-1.elb.amazonaws.com
Stack ARN:
arn:aws:cloudformation:us-east-1:REDACTED:stack/ecsworkshop-frontend/ab06cc40-ed9a-11ee-b8c6-125c14dde269

✨  Total time: 316.95s
```

### backend nodejs

:::note

looking back, I may have missed the `pip install -r requirements.txt` command for frontend.

:::

same again, cd into `nodejs/cdk` folder and build: `pip install -r requirements.txt && cdk context --clear && cdk deploy --require-approval never`

```bash
...
All context values cleared.


✨  Synthesis time: 10.31s

ecsworkshop-nodejs:  start: Building 2460045766487d8fe8ff85e38ecad876f151c9dc40247319cf9e5d8cc956fb65:REDACTED-us-east-1
ecsworkshop-nodejs:  success: Built 2460045766487d8fe8ff85e38ecad876f151c9dc40247319cf9e5d8cc956fb65:REDACTED-us-east-1
ecsworkshop-nodejs:  start: Publishing 2460045766487d8fe8ff85e38ecad876f151c9dc40247319cf9e5d8cc956fb65:REDACTED-us-east-1
ecsworkshop-nodejs:  success: Published 2460045766487d8fe8ff85e38ecad876f151c9dc40247319cf9e5d8cc956fb65:REDACTED-us-east-1
ecsworkshop-nodejs: deploying... [1/1]
ecsworkshop-nodejs: creating CloudFormation changeset...

 ✅  ecsworkshop-nodejs

✨  Deployment time: 129.83s

Stack ARN:
arn:aws:cloudformation:us-east-1:REDACTED:stack/ecsworkshop-nodejs/ed498c60-ed9e-11ee-9f71-0ee2a4991b27

✨  Total time: 140.14s
```

completed successfully.

### backend crystal

same again.

successfully completed.

```bash
All context values cleared.


✨  Synthesis time: 10.15s

ecsworkshop-crystal:  start: Building 6e41ad25c27668a10872892a146d52c57ceda0b352303125ff4c9ce5e73f37ce:REDACTED-us-east-1
ecsworkshop-crystal:  success: Built 6e41ad25c27668a10872892a146d52c57ceda0b352303125ff4c9ce5e73f37ce:REDACTED-us-east-1
ecsworkshop-crystal:  start: Publishing 6e41ad25c27668a10872892a146d52c57ceda0b352303125ff4c9ce5e73f37ce:REDACTED-us-east-1
ecsworkshop-crystal:  success: Published 6e41ad25c27668a10872892a146d52c57ceda0b352303125ff4c9ce5e73f37ce:REDACTED-us-east-1
ecsworkshop-crystal: deploying... [1/1]
ecsworkshop-crystal: creating CloudFormation changeset...

 ✅  ecsworkshop-crystal

✨  Deployment time: 100.67s

Stack ARN:
arn:aws:cloudformation:us-east-1:REDACTED:stack/ecsworkshop-crystal/98faa490-ed9f-11ee-833b-0affe12f9d3b

✨  Total time: 110.82s
```

## Container Insights

### cluster name

setup variables

```bash
~/Repos/AWSECS/ecsdemo-crystal/cdk on main !1 ?1 ❯ 
cluster_arn=$(aws ecs list-clusters | jq -r '.clusterArns[] | select(contains("container-demo"))')
clustername=$(aws ecs describe-clusters --clusters $cluster_arn | jq -r '.clusters[].clusterName')

~/Repos/AWSECS/ecsdemo-crystal/cdk on main !1 ?1 ❯
```

check

```bash
~/Repos/AWSECS/ecsdemo-crystal/cdk on main !1 ?1 ❯ echo ${cluster_arn}                                                                                     at  20:46:50
arn:aws:ecs:us-east-1:REDACTED:cluster/container-demo
~/Repos/AWSECS/ecsdemo-crystal/cdk on main !1 ?1 ❯ echo ${clustername}                                                                                     at  20:47:20
container-demo
~/Repos/AWSECS/ecsdemo-crystal/cdk on main !1 ?1 ❯
```

### enable container insights

command: `aws ecs update-cluster-settings --cluster ${clustername}  --settings name=containerInsights,value=enabled --region ${AWS_DEFAULT_REGION}`

```bash
{
    "cluster": {
        "clusterArn": "arn:aws:ecs:us-east-1:REDACTED:cluster/container-demo",
        "clusterName": "container-demo",
        "status": "ACTIVE",
        "registeredContainerInstancesCount": 0,
        "runningTasksCount": 0,
        "pendingTasksCount": 0,
        "activeServicesCount": 0,
        "statistics": [],
        "tags": [],
        "settings": [
            {
                "name": "containerInsights",
                "value": "enabled"
            }
        ],
        "capacityProviders": [],
        "defaultCapacityProviderStrategy": [],
        "attachments": []
    }
}
```

### enable instance insights

```bash
aws cloudformation create-stack --stack-name CWAgentECS-$clustername-${AWS_DEFAULT_REGION} --template-body "$(curl -Ls https://raw.githubusercontent.com/aws-samples/amazon-cloudwatch-container-insights/latest/ecs-task-definition-templates/deployment-mode/daemon-service/cwagent-ecs-instance-metric/cloudformation-quickstart/cwagent-ecs-instance-metric-cfn.json)" --parameters ParameterKey=ClusterName,ParameterValue=$clustername ParameterKey=CreateIAMRoles,ParameterValue=True --capabilities CAPABILITY_NAMED_IAM --region ${AWS_DEFAULT_REGION}
```

output

```bash
{
    "StackId": "arn:aws:cloudformation:us-east-1:REDACTED:stack/CWAgentECS-container-demo-us-east-1/3904fd90-eda1-11ee-aa77-0e0e5a47e273"
}
```

### verify enabled

command: `aws ecs describe-clusters --cluster ${clustername} --include SETTINGS`

```bash
{
    "clusters": [
        {
            "clusterArn": "arn:aws:ecs:us-east-1:REDACTED:cluster/container-demo",
            "clusterName": "container-demo",
            "status": "ACTIVE",
            "registeredContainerInstancesCount": 0,
            "runningTasksCount": 3,
            "pendingTasksCount": 0,
            "activeServicesCount": 4,
            "statistics": [],
            "tags": [],
            "settings": [
                {
                    "name": "containerInsights",
                    "value": "enabled"
                }
            ],
            "capacityProviders": [],
            "defaultCapacityProviderStrategy": []
        }
    ],
    "failures": []
}
```

## Check CloudWatch

Instructions are bit shit, they mash a couple of steps together e.g. in order to "Scroll down to see all the Containers that are part of the Tasks in the Service", you change the drop down menu from `ECS Clusters` to `ECS Services` and then scroll down.

## Load Test with Siege

I'm on macos locally, so install is : `brew install siege`

### get ALB URL

```bash
alb_url=$(aws cloudformation describe-stacks --stack-name container-demo-alb --query 'Stacks[0].Outputs[?OutputKey==`ExternalUrl`].OutputValue' --output text 2> /dev/null || aws cloudformation describe-stacks --stack-name ecsworkshop-frontend | jq -r '.Stacks[].Outputs[] | select(.OutputKey | contains("FrontendFargateLBServiceServiceURL")) | .OutputValue')
```

check

```bash
~/Repos/AWSECS/ecsdemo-crystal/cdk on   main !1 ?1 ❯ echo ${alb_url}
http://ecswor-Front-gwdgFnVMYQrg-1215657672.us-east-1.elb.amazonaws.com
```

### siege it

`siege -c 200 -i $alb_url`

watch it for 20-30 seconds, ctrl+c to kill it, then go through your container insights on cloudwatch.
