---
title: "AWS Workshop ECS Capacity Providers"
---

:::tip Workshop Links

- ECS Workshop: [Capacity Providers](https://ecsworkshop.com/capacity_providers/)

:::

:::note

I am running this from my local machine, with AWS creds and config setup with keys.

:::

## Tools Install

`apt install jq nodejs python36`

## Environment Setup

`ecsdemo-platform` we've seen from Monitoring, but `capacityproviders` is new.

```bash
cd ~/environment
git clone https://github.com/aws-containers/ecsdemo-platform
git clone https://github.com/aws-containers/ecsdemo-capacityproviders
```

### Build `platform`

```bash
cd ~/environment/ecsdemo-platform/cdk
pip install -r requirements.txt
cdk context --clear && cdk deploy --require-approval never
```

output

```bash
~/Repositories/AWSECS/environment/ecsdemo-platform/cdk on main ❯ cdk context --clear && cdk deploy --require-approval never                              at  08:59:55
All context values cleared.

✨  Synthesis time: 7.92s

ecsworkshop-base: building assets...

[0%] start: Building f75f7b3f459bf2b86416c9e442c35658b46a76de9b93b17b2d3c30f5a43758d8:current_account-us-east-1
[100%] success: Built f75f7b3f459bf2b86416c9e442c35658b46a76de9b93b17b2d3c30f5a43758d8:current_account-us-east-1

ecsworkshop-base: assets built

ecsworkshop-base: deploying... [1/1]
[0%] start: Publishing f75f7b3f459bf2b86416c9e442c35658b46a76de9b93b17b2d3c30f5a43758d8:current_account-us-east-1
[100%] success: Published f75f7b3f459bf2b86416c9e442c35658b46a76de9b93b17b2d3c30f5a43758d8:current_account-us-east-1
ecsworkshop-base: creating CloudFormation changeset...

 ✅  ecsworkshop-base

✨  Deployment time: 41.24s

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

✨  Total time: 49.16s
```

## Capacity Provider: Fargate and EC2

key points

- Fargate CP enable use of both Fargate & Fargate **Spot**, for ECS tasks
- EC2 CP enables "**Cluster Auto Scaling**" using EC2 spot instances.

## Deploy Fargate Capacity Provider

```bash
aws ecs put-cluster-capacity-providers \
--cluster container-demo \
--capacity-providers FARGATE FARGATE_SPOT \
--default-capacity-provider-strategy \
capacityProvider=FARGATE,weight=1,base=1 \
capacityProvider=FARGATE_SPOT,weight=4
```

notes

- only one provider can be `base` provider i.e. `base=1`
- `weight` designates ratio e.g. for every 1 task running on `FARGATE` cp, 4 tasks would use `FARGATE_SPOT`.

output

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
        "capacityProviders": [
            "FARGATE",
            "FARGATE_SPOT"
        ],
        "defaultCapacityProviderStrategy": [
            {
                "capacityProvider": "FARGATE",
                "weight": 1,
                "base": 1
            },
            {
                "capacityProvider": "FARGATE_SPOT",
                "weight": 4,
                "base": 0
            }
        ],
        "attachments": [],
        "attachmentsStatus": "UPDATE_IN_PROGRESS"
    }
}
```

run `cdk diff`

```bash
~/R/A/environment/ecsdemo-capacityproviders/fargate on main !1 ❯ cdk diff
jsii.errors.JavaScriptError:
  @jsii/kernel.RuntimeError: Error: Cannot retrieve value from context provider vpc-provider since account/region are not specified at the stack level. Configure "env" with an account and region when you define your stack.See https://docs.aws.amazon.com/cdk/latest/guide/environments.html for more details.
      at Kernel._Kernel_ensureSync (/tmp/tmp2tkxlbre/lib/program.js:10491:23)
      at Kernel.sinvoke (/tmp/tmp2tkxlbre/lib/program.js:9876:102)
      at KernelHost.processRequest (/tmp/tmp2tkxlbre/lib/program.js:11696:36)
      at KernelHost.run (/tmp/tmp2tkxlbre/lib/program.js:11656:22)
      at Immediate._onImmediate (/tmp/tmp2tkxlbre/lib/program.js:11657:46)
      at process.processImmediate (node:internal/timers:471:21)

The above exception was the direct cause of the following exception:

Traceback (most recent call last):
  File "/home/rxhackk/Repositories/AWSECS/environment/ecsdemo-capacityproviders/fargate/app.py", line 98, in <module />
    CapacityProviderFargateService(app, stack_name, env=_env)
```

I checked line 98 in `ecsdemo-capacityproviders/fargate/app.py` and found this:

```bash
_env = cdk.Environment(account=getenv('AWS_ACCOUNT_ID'), region=getenv('AWS_DEFAULT_REGION'))
environment = "ecsworkshop"
stack_name = "{}-capacityproviders-fargate".format(environment)
app = cdk.App()
CapacityProviderFargateService(app, stack_name, env=_env)
```

It is looking for `AWS_ACCOUNT_ID` and `AWS_DEFAULT_REGION` where previous cdk environments have run on `AWS_DEFAULT_ACCOUNT` not `ACCOUNT_ID` so this is dumb.

I changed `AWS_ACCOUNT_ID` to `AWS_DEFAULT_ACCOUNT` in `app.py` and re-ran.

successful diff

```bash
~/R/A/e/ecsdemo-capacityproviders/fargate on main !2 ❯ cdk diff
Stack ecsworkshop-capacityproviders-fargate
IAM Statement Changes
┌───┬────────────────────────────────────────────────┬────────┬────────────────────────────────────────────────┬─────────────────────────────────────────────────┬───────────┐
│   │ Resource                                       │ Effect │ Action                                         │ Principal                                       │ Condition │
├───┼────────────────────────────────────────────────┼────────┼────────────────────────────────────────────────┼─────────────────────────────────────────────────┼───────────┤
│ + │ $\{FargateCapacityProviderService/TaskDef/Execu │ Allow  │ sts:AssumeRole                                 │ Service:ecs-tasks.amazonaws.com                 │           │
│   │ tionRole.Arn}                                  │        │                                                │                                                 │           │
├───┼────────────────────────────────────────────────┼────────┼────────────────────────────────────────────────┼─────────────────────────────────────────────────┼───────────┤
│ + │ $\{FargateCapacityProviderService/TaskDef/TaskR │ Allow  │ sts:AssumeRole                                 │ Service:ecs-tasks.amazonaws.com                 │           │
│   │ ole.Arn}                                       │        │                                                │                                                 │           │
├───┼────────────────────────────────────────────────┼────────┼────────────────────────────────────────────────┼─────────────────────────────────────────────────┼───────────┤
│ + │ $\{FargateCapacityProviderService/TaskDef/web/L │ Allow  │ logs:CreateLogStream                           │ AWS:$\{FargateCapacityProviderService/TaskDef/Ex │           │
│   │ ogGroup.Arn}                                   │        │ logs:PutLogEvents                              │ ecutionRole}                                    │           │
├───┼────────────────────────────────────────────────┼────────┼────────────────────────────────────────────────┼─────────────────────────────────────────────────┼───────────┤
│ + │ *                                              │ Allow  │ ecs:DescribeTasks                              │ AWS:$\{FargateCapacityProviderService/TaskDef/Ta │           │
│   │                                                │        │ ecs:ListTasks                                  │ skRole}                                         │           │
└───┴────────────────────────────────────────────────┴────────┴────────────────────────────────────────────────┴─────────────────────────────────────────────────┴───────────┘
Security Group Changes
┌───┬─────────────────────────────────────────────────────────────────┬─────┬────────────┬─────────────────────────────────────────────────────────────────┐
│   │ Group                                                           │ Dir │ Protocol   │ Peer                                                            │
├───┼─────────────────────────────────────────────────────────────────┼─────┼────────────┼─────────────────────────────────────────────────────────────────┤
│ + │ $\{FargateCapacityProviderService/LB/SecurityGroup.GroupId}      │ In  │ TCP 80     │ Everyone (IPv4)                                                 │
│ + │ $\{FargateCapacityProviderService/LB/SecurityGroup.GroupId}      │ Out │ TCP 5000   │ $\{FargateCapacityProviderService/Service/SecurityGroup.GroupId} │
├───┼─────────────────────────────────────────────────────────────────┼─────┼────────────┼─────────────────────────────────────────────────────────────────┤
│ + │ $\{FargateCapacityProviderService/Service/SecurityGroup.GroupId} │ In  │ TCP 5000   │ $\{FargateCapacityProviderService/LB/SecurityGroup.GroupId}      │
│ + │ $\{FargateCapacityProviderService/Service/SecurityGroup.GroupId} │ Out │ Everything │ Everyone (IPv4)                                                 │
└───┴─────────────────────────────────────────────────────────────────┴─────┴────────────┴─────────────────────────────────────────────────────────────────┘
(NOTE: There may be security-related changes not in this list. See https://github.com/aws/aws-cdk/issues/1299)

Parameters
[+] Parameter BootstrapVersion BootstrapVersion: {"Type":"AWS::SSM::Parameter::Value<String />","Default":"/cdk-bootstrap/hnb659fds/version","Description":"Version of the CDK Bootstrap resources in this environment, automatically retrieved from SSM Parameter Store. [cdk:skip]"}

Resources
[+] AWS::ElasticLoadBalancingV2::LoadBalancer FargateCapacityProviderService/LB FargateCapacityProviderServiceLB3C8F1707
[+] AWS::EC2::SecurityGroup FargateCapacityProviderService/LB/SecurityGroup FargateCapacityProviderServiceLBSecurityGroupA31B6195
[+] AWS::EC2::SecurityGroupEgress FargateCapacityProviderService/LB/SecurityGroup/to ecsworkshopcapacityprovidersfargateFargateCapacityProviderServiceSecurityGroup90410566:5000 FargateCapacityProviderServiceLBSecurityGrouptoecsworkshopcapacityprovidersfargateFargateCapacityProviderServiceSecurityGroup904105665000197B1D89
[+] AWS::ElasticLoadBalancingV2::Listener FargateCapacityProviderService/LB/PublicListener FargateCapacityProviderServiceLBPublicListener81ED71E7
[+] AWS::ElasticLoadBalancingV2::TargetGroup FargateCapacityProviderService/LB/PublicListener/ECSGroup FargateCapacityProviderServiceLBPublicListenerECSGroup64EDCBC8
[+] AWS::IAM::Role FargateCapacityProviderService/TaskDef/TaskRole FargateCapacityProviderServiceTaskDefTaskRole240ABAF7
[+] AWS::IAM::Policy FargateCapacityProviderService/TaskDef/TaskRole/DefaultPolicy FargateCapacityProviderServiceTaskDefTaskRoleDefaultPolicy88C80793
[+] AWS::ECS::TaskDefinition FargateCapacityProviderService/TaskDef FargateCapacityProviderServiceTaskDefB0B80EC1
[+] AWS::Logs::LogGroup FargateCapacityProviderService/TaskDef/web/LogGroup FargateCapacityProviderServiceTaskDefwebLogGroup9A7D3AC7
[+] AWS::IAM::Role FargateCapacityProviderService/TaskDef/ExecutionRole FargateCapacityProviderServiceTaskDefExecutionRoleF572264B
[+] AWS::IAM::Policy FargateCapacityProviderService/TaskDef/ExecutionRole/DefaultPolicy FargateCapacityProviderServiceTaskDefExecutionRoleDefaultPolicy83908004
[+] AWS::ECS::Service FargateCapacityProviderService/Service/Service FargateCapacityProviderService6E87B372
[+] AWS::EC2::SecurityGroup FargateCapacityProviderService/Service/SecurityGroup FargateCapacityProviderServiceSecurityGroupF0D9098B
[+] AWS::EC2::SecurityGroupIngress FargateCapacityProviderService/Service/SecurityGroup/from ecsworkshopcapacityprovidersfargateFargateCapacityProviderServiceLBSecurityGroupE024A5C0:5000 FargateCapacityProviderServiceSecurityGroupfromecsworkshopcapacityprovidersfargateFargateCapacityProviderServiceLBSecurityGroupE024A5C050001D9B585F

Outputs
[+] Output FargateCapacityProviderService/LoadBalancerDNS FargateCapacityProviderServiceLoadBalancerDNS1BE52BC6: {"Value":{"Fn::GetAtt":["FargateCapacityProviderServiceLB3C8F1707","DNSName"]\}\}
[+] Output FargateCapacityProviderService/ServiceURL FargateCapacityProviderServiceServiceURL128E9753: {"Value":{"Fn::Join":["",["http://",{"Fn::GetAtt":["FargateCapacityProviderServiceLB3C8F1707","DNSName"]}]]\}\}

Other Changes
[+] Unknown Rules: {"CheckBootstrapVersion":{"Assertions":[{"Assert":{"Fn::Not":[{"Fn::Contains":[["1","2","3","4","5"],{"Ref":"BootstrapVersion"}]}]},"AssertDescription":"CDK bootstrap stack version 6 required. Please run 'cdk bootstrap' with a recent version of the CDK CLI."}]\}\}


✨  Number of stacks with differences: 1
```

now you deploy the changes: `cdk deploy --require-approval never`

```bash
~/R/A/environment/ecsdemo-capacityproviders/fargate on main !2 ❯ cdk deploy --require-approval never                                                     at  09:55:47

✨  Synthesis time: 4.03s

ecsworkshop-capacityproviders-fargate:  start: Building e50504156dfaebec0bdd50ee904ea799570a057eaaa20001683e3796b809bf2d:REDACTED-us-east-1
ecsworkshop-capacityproviders-fargate:  success: Built e50504156dfaebec0bdd50ee904ea799570a057eaaa20001683e3796b809bf2d:REDACTED-us-east-1
ecsworkshop-capacityproviders-fargate:  start: Publishing e50504156dfaebec0bdd50ee904ea799570a057eaaa20001683e3796b809bf2d:REDACTED-us-east-1
ecsworkshop-capacityproviders-fargate:  success: Published e50504156dfaebec0bdd50ee904ea799570a057eaaa20001683e3796b809bf2d:REDACTED-us-east-1
ecsworkshop-capacityproviders-fargate: deploying... [1/1]
ecsworkshop-capacityproviders-fargate: creating CloudFormation changeset...

 ✅  ecsworkshop-capacityproviders-fargate

✨  Deployment time: 240.84s

Outputs:
ecsworkshop-capacityproviders-fargate.FargateCapacityProviderServiceLoadBalancerDNS1BE52BC6 = ecswor-Farga-7IuUzA1K0m0c-1594881063.us-east-1.elb.amazonaws.com
ecsworkshop-capacityproviders-fargate.FargateCapacityProviderServiceServiceURL128E9753 = http://ecswor-Farga-7IuUzA1K0m0c-1594881063.us-east-1.elb.amazonaws.com
Stack ARN:
arn:aws:cloudformation:us-east-1:REDACTED:stack/ecsworkshop-capacityproviders-fargate/cee34de0-ee0e-11ee-828d-123f5209faef

✨  Total time: 244.88s
```

success.

now curl that endpoint to get the app output of "ARNs of all tasks running":

```bash
~/R/A/e/ecsdemo-capacityproviders/fargate on main !2 ❯ curl -s http://ecswor-Farga-7IuUzA1K0m0c-1594881063.us-east-1.elb.amazonaws.com | jq
{
  "ALL_TASKS": {
    "arn:aws:ecs:us-east-1:REDACTED:task/container-demo/05dba4e68c42462a891d988b71db3216": "NON_DEFAULT",
    "arn:aws:ecs:us-east-1:REDACTED:task/container-demo/4f67f206eb074640ab5c1144e41cfe0b": "FARGATE",
    "arn:aws:ecs:us-east-1:REDACTED:task/container-demo/8257ba58fe664ccaa9d5fd4a3f1d69b8": "NON_DEFAULT",
    "arn:aws:ecs:us-east-1:REDACTED:task/container-demo/845c8b305f2a4774a5504d7af2744254": "FARGATE_SPOT",
    "arn:aws:ecs:us-east-1:REDACTED:task/container-demo/8599c12591a446fe835b1b8601fb8a6d": "NON_DEFAULT",
    "arn:aws:ecs:us-east-1:REDACTED:task/container-demo/873b9bcd04754785926828a03a298715": "FARGATE_SPOT",
    "arn:aws:ecs:us-east-1:REDACTED:task/container-demo/8acf82da96cb4f57a6e05e6faa3604ae": "FARGATE_SPOT",
    "arn:aws:ecs:us-east-1:REDACTED:task/container-demo/b4fa297cbadb4f8999a6767e86f651fd": "FARGATE",
    "arn:aws:ecs:us-east-1:REDACTED:task/container-demo/d268bc8f86c840c881cd43b8d43422f8": "FARGATE_SPOT",
    "arn:aws:ecs:us-east-1:REDACTED:task/container-demo/e5dff1e8a027499289c840eda2611493": "FARGATE",
    "arn:aws:ecs:us-east-1:REDACTED:task/container-demo/f0a65d4cf0e74f0c8c654b6ac0a1bdb7": "FARGATE_SPOT",
    "arn:aws:ecs:us-east-1:REDACTED:task/container-demo/f6f10c7633ff42c3866d9786a5f1fef0": "FARGATE_SPOT",
    "arn:aws:ecs:us-east-1:REDACTED:task/container-demo/fd8e007f93f1447bb9f0b0604ffd60ee": "FARGATE_SPOT"
  },
  "MY_ARN": "arn:aws:ecs:us-east-1:REDACTED:task/container-demo/4f67f206eb074640ab5c1144e41cfe0b",
  "MY_STRATEGY": "FARGATE"
}
```

Done.

### Clean Up

`cdk destroy -f` inside the fargate folder.

## Deploy ECS Cluster Auto Scaling

:::note

I did not destroy  the `ecsdemo-platform` code from previous section, I plan to just do `cdk diff` and deploy deltas to save time.

:::

- changed to `/ecsdemo-platform/cdk` and edited `app.py`
- uncommented the `#### CAPACITY PROVIDERS SECTION` for EC2
- run `cdk diff`
- deploy with `cdk deploy --require-approval never`

output for deploy from diff

```bash
~/R/A/environment/ecsdemo-platform/cdk on main !1 ❯ cdk diff                                                                                  took  12s at  11:05:53
Stack ecsworkshop-base
Hold on while we create a read-only change set to get a diff with accurate replacement information (use --no-change-set to use a less accurate but faster template-only diff)
IAM Statement Changes
┌───┬───────────────────────────────────────┬────────┬───────────────────────────────────────┬───────────────────────────────────────┬───────────────────────────────────────┐
│   │ Resource                              │ Effect │ Action                                │ Principal                             │ Condition                             │
├───┼───────────────────────────────────────┼────────┼───────────────────────────────────────┼───────────────────────────────────────┼───────────────────────────────────────┤
│ + │ $\{ECSCluster.Arn}                     │ Allow  │ ecs:DeregisterContainerInstance       │ AWS:$\{ECSCluster/ECSEC2Capacity/Insta │                                       │
│   │                                       │        │ ecs:RegisterContainerInstance         │ nceRole}                              │                                       │
│   │                                       │        │ ecs:Submit*                           │                                       │                                       │
│ + │ $\{ECSCluster.Arn}                     │ Allow  │ ecs:ListContainerInstances            │ AWS:$\{ECSCluster/ECSEC2Capacity/Drain │                                       │
│   │                                       │        │ ecs:SubmitContainerStateChange        │ ECSHook/Function/ServiceRole}         │                                       │
│   │                                       │        │ ecs:SubmitTaskStateChange             │                                       │                                       │
├───┼───────────────────────────────────────┼────────┼───────────────────────────────────────┼───────────────────────────────────────┼───────────────────────────────────────┤
│ + │ $\{ECSCluster/ECSEC2Capacity/DrainECSH │ Allow  │ lambda:InvokeFunction                 │ Service:sns.amazonaws.com             │ "ArnLike": {                          │
│   │ ook/Function.Arn}                     │        │                                       │                                       │   "AWS:SourceArn": "$\{ECSCluster/ECSE │
│   │                                       │        │                                       │                                       │ C2Capacity/LifecycleHookDrainHook/Top │
│   │                                       │        │                                       │                                       │ ic}"                                  │
│   │                                       │        │                                       │                                       │ }                                     │
├───┼───────────────────────────────────────┼────────┼───────────────────────────────────────┼───────────────────────────────────────┼───────────────────────────────────────┤
│ + │ $\{ECSCluster/ECSEC2Capacity/DrainECSH │ Allow  │ sts:AssumeRole                        │ Service:lambda.amazonaws.com          │                                       │
│   │ ook/Function/ServiceRole.Arn}         │        │                                       │                                       │                                       │
├───┼───────────────────────────────────────┼────────┼───────────────────────────────────────┼───────────────────────────────────────┼───────────────────────────────────────┤
│ + │ $\{ECSCluster/ECSEC2Capacity/InstanceR │ Allow  │ sts:AssumeRole                        │ Service:ec2.amazonaws.com             │                                       │
│   │ ole.Arn}                              │        │                                       │                                       │                                       │
├───┼───────────────────────────────────────┼────────┼───────────────────────────────────────┼───────────────────────────────────────┼───────────────────────────────────────┤
│ + │ $\{ECSCluster/ECSEC2Capacity/Lifecycle │ Allow  │ sts:AssumeRole                        │ Service:autoscaling.amazonaws.com     │                                       │
│   │ HookDrainHook/Role.Arn}               │        │                                       │                                       │                                       │
├───┼───────────────────────────────────────┼────────┼───────────────────────────────────────┼───────────────────────────────────────┼───────────────────────────────────────┤
│ + │ $\{ECSCluster/ECSEC2Capacity/Lifecycle │ Allow  │ sns:Publish                           │ AWS:$\{ECSCluster/ECSEC2Capacity/Lifec │                                       │
│   │ HookDrainHook/Topic}                  │        │                                       │ ycleHookDrainHook/Role}               │                                       │
├───┼───────────────────────────────────────┼────────┼───────────────────────────────────────┼───────────────────────────────────────┼───────────────────────────────────────┤
│ + │ *                                     │ Allow  │ ecs:Poll                              │ AWS:$\{ECSCluster/ECSEC2Capacity/Insta │ "ArnEquals": {                        │
│   │                                       │        │ ecs:StartTelemetrySession             │ nceRole}                              │   "ecs:cluster": "$\{ECSCluster.Arn}"  │
│   │                                       │        │                                       │                                       │ }                                     │
│ + │ *                                     │ Allow  │ ecr:GetAuthorizationToken             │ AWS:$\{ECSCluster/ECSEC2Capacity/Insta │                                       │
│   │                                       │        │ ecs:DiscoverPollEndpoint              │ nceRole}                              │                                       │
│   │                                       │        │ logs:CreateLogStream                  │                                       │                                       │
│   │                                       │        │ logs:PutLogEvents                     │                                       │                                       │
│ + │ *                                     │ Allow  │ ec2:DescribeHosts                     │ AWS:$\{ECSCluster/ECSEC2Capacity/Drain │                                       │
│   │                                       │        │ ec2:DescribeInstanceAttribute         │ ECSHook/Function/ServiceRole}         │                                       │
│   │                                       │        │ ec2:DescribeInstanceStatus            │                                       │                                       │
│   │                                       │        │ ec2:DescribeInstances                 │                                       │                                       │
│ + │ *                                     │ Allow  │ ecs:DescribeContainerInstances        │ AWS:$\{ECSCluster/ECSEC2Capacity/Drain │ "ArnEquals": {                        │
│   │                                       │        │ ecs:DescribeTasks                     │ ECSHook/Function/ServiceRole}         │   "ecs:cluster": "$\{ECSCluster.Arn}"  │
│   │                                       │        │                                       │                                       │ }                                     │
│ + │ *                                     │ Allow  │ ecs:ListTasks                         │ AWS:$\{ECSCluster/ECSEC2Capacity/Drain │ "ArnEquals": {                        │
│   │                                       │        │ ecs:UpdateContainerInstancesState     │ ECSHook/Function/ServiceRole}         │   "ecs:cluster": "$\{ECSCluster.Arn}"  │
│   │                                       │        │                                       │                                       │ }                                     │
├───┼───────────────────────────────────────┼────────┼───────────────────────────────────────┼───────────────────────────────────────┼───────────────────────────────────────┤
│ + │ arn:$\{AWS::Partition}:autoscaling:us- │ Allow  │ autoscaling:CompleteLifecycleAction   │ AWS:$\{ECSCluster/ECSEC2Capacity/Drain │                                       │
│   │ east-1:$\{AWS::AccountId}:autoScalingG │        │                                       │ ECSHook/Function/ServiceRole}         │                                       │
│   │ roup:*:autoScalingGroupName/$\{ECSClus │        │                                       │                                       │                                       │
│   │ ter/ECSEC2Capacity/ASG}               │        │                                       │                                       │                                       │
└───┴───────────────────────────────────────┴────────┴───────────────────────────────────────┴───────────────────────────────────────┴───────────────────────────────────────┘
IAM Policy Changes
┌───┬────────────────────────────────────────────────────────────────┬────────────────────────────────────────────────────────────────────────────────┐
│   │ Resource                                                       │ Managed Policy ARN                                                             │
├───┼────────────────────────────────────────────────────────────────┼────────────────────────────────────────────────────────────────────────────────┤
│ + │ $\{ECSCluster/ECSEC2Capacity/DrainECSHook/Function/ServiceRole} │ arn:$\{AWS::Partition}:iam::aws:policy/service-role/AWSLambdaBasicExecutionRole │
└───┴────────────────────────────────────────────────────────────────┴────────────────────────────────────────────────────────────────────────────────┘
Security Group Changes
┌───┬────────────────────────────────────────────────────────────┬─────┬────────────┬─────────────────┐
│   │ Group                                                      │ Dir │ Protocol   │ Peer            │
├───┼────────────────────────────────────────────────────────────┼─────┼────────────┼─────────────────┤
│ + │ $\{ECSCluster/ECSEC2Capacity/InstanceSecurityGroup.GroupId} │ Out │ Everything │ Everyone (IPv4) │
└───┴────────────────────────────────────────────────────────────┴─────┴────────────┴─────────────────┘
(NOTE: There may be security-related changes not in this list. See https://github.com/aws/aws-cdk/issues/1299)

Parameters
[+] Parameter SsmParameterValue:--aws--service--ecs--optimized-ami--amazon-linux-2--recommended--image_id:C96584B6-F00A-464E-AD19-53AFF4B05118.Parameter SsmParameterValueawsserviceecsoptimizedamiamazonlinux2recommendedimageidC96584B6F00A464EAD1953AFF4B05118Parameter: {"Type":"AWS::SSM::Parameter::Value<AWS::EC2::Image::Id />","Default":"/aws/service/ecs/optimized-ami/amazon-linux-2/recommended/image_id"}

Resources
[+] AWS::EC2::SecurityGroup ECSCluster/ECSEC2Capacity/InstanceSecurityGroup ECSClusterECSEC2CapacityInstanceSecurityGroupDAADD78F
[+] AWS::IAM::Role ECSCluster/ECSEC2Capacity/InstanceRole ECSClusterECSEC2CapacityInstanceRole5C2EC45B
[+] AWS::IAM::Policy ECSCluster/ECSEC2Capacity/InstanceRole/DefaultPolicy ECSClusterECSEC2CapacityInstanceRoleDefaultPolicy204B9A6A
[+] AWS::IAM::InstanceProfile ECSCluster/ECSEC2Capacity/InstanceProfile ECSClusterECSEC2CapacityInstanceProfileB82D3818
[+] AWS::AutoScaling::LaunchConfiguration ECSCluster/ECSEC2Capacity/LaunchConfig ECSClusterECSEC2CapacityLaunchConfigC81E218C
[+] AWS::AutoScaling::AutoScalingGroup ECSCluster/ECSEC2Capacity/ASG ECSClusterECSEC2CapacityASG0360B1DE
[+] AWS::IAM::Role ECSCluster/ECSEC2Capacity/DrainECSHook/Function/ServiceRole ECSClusterECSEC2CapacityDrainECSHookFunctionServiceRole8F3CBCE3
[+] AWS::IAM::Policy ECSCluster/ECSEC2Capacity/DrainECSHook/Function/ServiceRole/DefaultPolicy ECSClusterECSEC2CapacityDrainECSHookFunctionServiceRoleDefaultPolicyBD54F91C
[+] AWS::Lambda::Function ECSCluster/ECSEC2Capacity/DrainECSHook/Function ECSClusterECSEC2CapacityDrainECSHookFunctionBC271921
[+] AWS::Lambda::Permission ECSCluster/ECSEC2Capacity/DrainECSHook/Function/AllowInvoke:ecsworkshopbaseECSClusterECSEC2CapacityLifecycleHookDrainHookTopic6CB57177 ECSClusterECSEC2CapacityDrainECSHookFunctionAllowInvokeecsworkshopbaseECSClusterECSEC2CapacityLifecycleHookDrainHookTopic6CB5717791CA5D6C
[+] AWS::SNS::Subscription ECSCluster/ECSEC2Capacity/DrainECSHook/Function/Topic ECSClusterECSEC2CapacityDrainECSHookFunctionTopicECD58342
[+] AWS::SNS::Topic ECSCluster/ECSEC2Capacity/LifecycleHookDrainHook/Topic ECSClusterECSEC2CapacityLifecycleHookDrainHookTopicCA6236FC
[+] AWS::IAM::Role ECSCluster/ECSEC2Capacity/LifecycleHookDrainHook/Role ECSClusterECSEC2CapacityLifecycleHookDrainHookRoleA957F608
[+] AWS::IAM::Policy ECSCluster/ECSEC2Capacity/LifecycleHookDrainHook/Role/DefaultPolicy ECSClusterECSEC2CapacityLifecycleHookDrainHookRoleDefaultPolicy94FDFE21
[+] AWS::AutoScaling::LifecycleHook ECSCluster/ECSEC2Capacity/LifecycleHookDrainHook ECSClusterECSEC2CapacityLifecycleHookDrainHook247A252F

Outputs
[+] Output EC2AutoScalingGroupName EC2AutoScalingGroupName: {"Value":{"Ref":"ECSClusterECSEC2CapacityASG0360B1DE"},"Export":{"Name":"EC2ASGName"\}\}
[~] Output ECSClusterSecGrp ECSClusterSecGrp: {"Value":"[]","Export":{"Name":"ECSSecGrpList"\}\} to {"Value":{"Fn::GetAtt":["ECSClusterECSEC2CapacityInstanceSecurityGroupDAADD78F","GroupId"]},"Export":{"Name":"ECSSecGrpList"\}\}


✨  Number of stacks with differences: 1
```

deploy it

```bash
~/R/A/environment/ecsdemo-platform/cdk on main !1 ❯ cdk deploy --require-approval never                                                       took  36s at  11:06:30

✨  Synthesis time: 4.31s

ecsworkshop-base:  start: Building d68465c701bd94c7cbb8e20a0e2c5c976d6b2f15809bc2863698ac8a0fe8f5a3:current_account-us-east-1
ecsworkshop-base:  success: Built d68465c701bd94c7cbb8e20a0e2c5c976d6b2f15809bc2863698ac8a0fe8f5a3:current_account-us-east-1
ecsworkshop-base:  start: Publishing d68465c701bd94c7cbb8e20a0e2c5c976d6b2f15809bc2863698ac8a0fe8f5a3:current_account-us-east-1
ecsworkshop-base:  success: Published d68465c701bd94c7cbb8e20a0e2c5c976d6b2f15809bc2863698ac8a0fe8f5a3:current_account-us-east-1
ecsworkshop-base: deploying... [1/1]
ecsworkshop-base: creating CloudFormation changeset...

 ✅  ecsworkshop-base

✨  Deployment time: 234.63s

Outputs:
ecsworkshop-base.EC2AutoScalingGroupName = ecsworkshop-base-ECSClusterECSEC2CapacityASG0360B1DE-xEFw4dFsjW1P
ecsworkshop-base.ECSClusterName = container-demo
ecsworkshop-base.ECSClusterSecGrp = sg-0d4e883de3f665308
ecsworkshop-base.FE2BESecGrp = sg-08ad8552ab5a42e2d
ecsworkshop-base.NSArn = arn:aws:servicediscovery:us-east-1:REDACTED:namespace/ns-qbclwxxkojytxj2w
ecsworkshop-base.NSId = ns-qbclwxxkojytxj2w
ecsworkshop-base.NSName = service.local
ecsworkshop-base.ServicesSecGrp = sg-08ad8552ab5a42e2d
ecsworkshop-base.StressToolEc2Id = i-0b5aa0dca21ce4bec
ecsworkshop-base.StressToolEc2Ip = 10.0.0.188
Stack ARN:
arn:aws:cloudformation:us-east-1:REDACTED:stack/ecsworkshop-base/ca39eeb0-ed8d-11ee-b7f5-0affd09b0077

✨  Total time: 238.94s
```

## Enable Cluster Auto Scaling

cd to `/ecsdemo-capacityproviders/ec2`

this cli command will get us our variables and create capacity providers

```bash
# Get the required cluster values needed when creating the capacity provider
export asg_name=$(aws cloudformation describe-stacks --stack-name ecsworkshop-base --query 'Stacks[*].Outputs[?ExportName==`EC2ASGName`].OutputValue' --output text)
export asg_arn=$(aws autoscaling describe-auto-scaling-groups --auto-scaling-group-names $asg_name --query 'AutoScalingGroups[].AutoScalingGroupARN' --output text)
export capacity_provider_name=$(echo "EC2$(date +'%s')")
# Creating capacity provider
aws ecs create-capacity-provider \
     --name $capacity_provider_name \
     --auto-scaling-group-provider autoScalingGroupArn="$asg_arn",managedScaling=\{status="ENABLED",targetCapacity=80\},managedTerminationProtection="DISABLED" \
     --region $AWS_DEFAULT_REGION
```

note I changed `--region $AWS_REGION` to `--region $AWS_DEFAULT_REGION` for consistency with the rest of the workshop.

run export commands first, check with `env` command:

```bash
asg_name=ecsworkshop-base-ECSClusterECSEC2CapacityASG0360B1DE-xEFw4dFsjW1P
asg_arn=arn:aws:autoscaling:us-east-1:REDACTED:autoScalingGroup:a0d50b0e-2c73-4e46-96b6-b2ddd87e7c4f:autoScalingGroupName/ecsworkshop-base-ECSClusterECSEC2CapacityASG0360B1DE-xEFw4dFsjW1P
capacity_provider_name=EC21711750959
```

run the `aws ecs create-capacity-provider...` command

output

```bash
{
    "capacityProvider": {
        "capacityProviderArn": "arn:aws:ecs:us-east-1:REDACTED:capacity-provider/EC21711750959",
        "name": "EC21711750959",
        "status": "ACTIVE",
        "autoScalingGroupProvider": {
            "autoScalingGroupArn": "arn:aws:autoscaling:us-east-1:REDACTED:autoScalingGroup:a0d50b0e-2c73-4e46-96b6-b2ddd87e7c4f:autoScalingGroupName/ecsworkshop-base-ECSClusterECSEC2CapacityASG0360B1DE-xEFw4dFsjW1P",
            "managedScaling": {
                "status": "ENABLED",
                "targetCapacity": 80,
                "minimumScalingStepSize": 1,
                "maximumScalingStepSize": 10000,
                "instanceWarmupPeriod": 300
            },
            "managedTerminationProtection": "DISABLED",
            "managedDraining": "ENABLED"
        },
        "tags": []
    }
}
```

### associate with ecs cluster

```bash
aws ecs put-cluster-capacity-providers \
--cluster container-demo \
--capacity-providers $capacity_provider_name \
--default-capacity-provider-strategy capacityProvider=$capacity_provider_name,weight=1,base=1
```

output

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
        "capacityProviders": [
            "EC21711750959"
        ],
        "defaultCapacityProviderStrategy": [
            {
                "capacityProvider": "EC21711750959",
                "weight": 1,
                "base": 1
            }
        ],
        "attachments": [
            {
                "id": "3535c39c-3023-4831-8095-1ef0fff4ca73",
                "type": "as_policy",
                "status": "PRECREATED",
                "details": [
                    {
                        "name": "capacityProviderName",
                        "value": "EC21711750959"
                    },
                    {
                        "name": "scalingPolicyName",
                        "value": "ECSManagedAutoScalingPolicy-94cad5b7-6c97-46c9-afd9-d9c29966cd3d"
                    }
                ]
            },
            {
                "id": "d169fff6-30d3-453e-b9c9-8ae22cb8868b",
                "type": "managed_draining",
                "status": "PRECREATED",
                "details": [
                    {
                        "name": "capacityProviderName",
                        "value": "EC21711750959"
                    },
                    {
                        "name": "autoScalingLifecycleHookName",
                        "value": "ecs-managed-draining-termination-hook"
                    }
                ]
            }
        ],
        "attachmentsStatus": "UPDATE_IN_PROGRESS"
    }
}
```

run `cdk diff`

:::warning

the environment vars in `app.py` are again inconsistent with the other environments, using `AWS_ACCOUNT_ID` instead of `AWS_DEFAULT_ACCOUNT`. change this and re-run.

:::

our diff at this point

```bash
~/R/A/environment/ecsdemo-capacityproviders/ec2 on main !3 ❯ cdk diff                                                                                    at  11:32:29
Stack ecsworkshop-capacityproviders-ec2
IAM Statement Changes
┌───┬────────────────────────────────────────────────┬────────┬────────────────────────────────────────────────┬─────────────────────────────────────────────────┬───────────┐
│   │ Resource                                       │ Effect │ Action                                         │ Principal                                       │ Condition │
├───┼────────────────────────────────────────────────┼────────┼────────────────────────────────────────────────┼─────────────────────────────────────────────────┼───────────┤
│ + │ $\{EC2CapacityProviderService/TaskDef/Execution │ Allow  │ sts:AssumeRole                                 │ Service:ecs-tasks.amazonaws.com                 │           │
│   │ Role.Arn}                                      │        │                                                │                                                 │           │
├───┼────────────────────────────────────────────────┼────────┼────────────────────────────────────────────────┼─────────────────────────────────────────────────┼───────────┤
│ + │ $\{EC2CapacityProviderService/TaskDef/TaskRole. │ Allow  │ sts:AssumeRole                                 │ Service:ecs-tasks.amazonaws.com                 │           │
│   │ Arn}                                           │        │                                                │                                                 │           │
├───┼────────────────────────────────────────────────┼────────┼────────────────────────────────────────────────┼─────────────────────────────────────────────────┼───────────┤
│ + │ $\{EC2CapacityProviderService/TaskDef/web/LogGr │ Allow  │ logs:CreateLogStream                           │ AWS:$\{EC2CapacityProviderService/TaskDef/Execut │           │
│   │ oup.Arn}                                       │        │ logs:PutLogEvents                              │ ionRole}                                        │           │
├───┼────────────────────────────────────────────────┼────────┼────────────────────────────────────────────────┼─────────────────────────────────────────────────┼───────────┤
│ + │ *                                              │ Allow  │ ecs:DescribeTasks                              │ AWS:$\{EC2CapacityProviderService/TaskDef/TaskRo │           │
│   │                                                │        │ ecs:ListTasks                                  │ le}                                             │           │
└───┴────────────────────────────────────────────────┴────────┴────────────────────────────────────────────────┴─────────────────────────────────────────────────┴───────────┘
Security Group Changes
┌───┬────────────────────────────────────────────────────────┬─────┬─────────────────┬────────────────────────────────────────────────────────┐
│   │ Group                                                  │ Dir │ Protocol        │ Peer                                                   │
├───┼────────────────────────────────────────────────────────┼─────┼─────────────────┼────────────────────────────────────────────────────────┤
│ + │ $\{EC2CapacityProviderService/LB/SecurityGroup.GroupId} │ In  │ TCP 80          │ Everyone (IPv4)                                        │
│ + │ $\{EC2CapacityProviderService/LB/SecurityGroup.GroupId} │ Out │ TCP 32768-65535 │ {"Fn::ImportValue":"ECSSecGrpList"}                    │
├───┼────────────────────────────────────────────────────────┼─────┼─────────────────┼────────────────────────────────────────────────────────┤
│ + │ {"Fn::ImportValue":"ECSSecGrpList"}                    │ In  │ TCP 32768-65535 │ $\{EC2CapacityProviderService/LB/SecurityGroup.GroupId} │
└───┴────────────────────────────────────────────────────────┴─────┴─────────────────┴────────────────────────────────────────────────────────┘
(NOTE: There may be security-related changes not in this list. See https://github.com/aws/aws-cdk/issues/1299)

Parameters
[+] Parameter BootstrapVersion BootstrapVersion: {"Type":"AWS::SSM::Parameter::Value<String />","Default":"/cdk-bootstrap/hnb659fds/version","Description":"Version of the CDK Bootstrap resources in this environment, automatically retrieved from SSM Parameter Store. [cdk:skip]"}

Resources
[+] AWS::EC2::SecurityGroupIngress ecsworkshop-capacityproviders-ec2/ClusterSecGrp/from ecsworkshopcapacityprovidersec2EC2CapacityProviderServiceLBSecurityGroup97DF3EC1:32768-65535 ecsworkshopcapacityprovidersec2ClusterSecGrpfromecsworkshopcapacityprovidersec2EC2CapacityProviderServiceLBSecurityGroup97DF3EC13276865535377BCE64
[+] AWS::ElasticLoadBalancingV2::LoadBalancer EC2CapacityProviderService/LB EC2CapacityProviderServiceLBDC92E31F
[+] AWS::EC2::SecurityGroup EC2CapacityProviderService/LB/SecurityGroup EC2CapacityProviderServiceLBSecurityGroup1FC0A81A
[+] AWS::EC2::SecurityGroupEgress EC2CapacityProviderService/LB/SecurityGroup/to ecsworkshopcapacityprovidersec2ClusterSecGrp2FAA1878:32768-65535 EC2CapacityProviderServiceLBSecurityGrouptoecsworkshopcapacityprovidersec2ClusterSecGrp2FAA187832768655354D60F766
[+] AWS::ElasticLoadBalancingV2::Listener EC2CapacityProviderService/LB/PublicListener EC2CapacityProviderServiceLBPublicListenerD5E769DC
[+] AWS::ElasticLoadBalancingV2::TargetGroup EC2CapacityProviderService/LB/PublicListener/ECSGroup EC2CapacityProviderServiceLBPublicListenerECSGroupFB7C9653
[+] AWS::IAM::Role EC2CapacityProviderService/TaskDef/TaskRole EC2CapacityProviderServiceTaskDefTaskRoleE63CB5D4
[+] AWS::IAM::Policy EC2CapacityProviderService/TaskDef/TaskRole/DefaultPolicy EC2CapacityProviderServiceTaskDefTaskRoleDefaultPolicyD8AD577A
[+] AWS::ECS::TaskDefinition EC2CapacityProviderService/TaskDef EC2CapacityProviderServiceTaskDefEF5CC3D5
[+] AWS::Logs::LogGroup EC2CapacityProviderService/TaskDef/web/LogGroup EC2CapacityProviderServiceTaskDefwebLogGroupADF50DEA
[+] AWS::IAM::Role EC2CapacityProviderService/TaskDef/ExecutionRole EC2CapacityProviderServiceTaskDefExecutionRole8EC4417E
[+] AWS::IAM::Policy EC2CapacityProviderService/TaskDef/ExecutionRole/DefaultPolicy EC2CapacityProviderServiceTaskDefExecutionRoleDefaultPolicyECD3E026
[+] AWS::ECS::Service EC2CapacityProviderService/Service/Service EC2CapacityProviderServiceF75CB01B

Outputs
[+] Output EC2CapacityProviderService/LoadBalancerDNS EC2CapacityProviderServiceLoadBalancerDNS3B55F46D: {"Value":{"Fn::GetAtt":["EC2CapacityProviderServiceLBDC92E31F","DNSName"]\}\}
[+] Output EC2CapacityProviderService/ServiceURL EC2CapacityProviderServiceServiceURL81036241: {"Value":{"Fn::Join":["",["http://",{"Fn::GetAtt":["EC2CapacityProviderServiceLBDC92E31F","DNSName"]}]]\}\}

Other Changes
[+] Unknown Rules: {"CheckBootstrapVersion":{"Assertions":[{"Assert":{"Fn::Not":[{"Fn::Contains":[["1","2","3","4","5"],{"Ref":"BootstrapVersion"}]}]},"AssertDescription":"CDK bootstrap stack version 6 required. Please run 'cdk bootstrap' with a recent version of the CDK CLI."}]\}\}


✨  Number of stacks with differences: 1
```

deploy changes: `cdk deploy --require-approval never`

```bash
~/R/A/e/ecsdemo-capacityproviders/ec2 on main !3 ❯ cdk deploy --require-approval never                                                        took  20s at  11:32:52

✨  Synthesis time: 4.4s

ecsworkshop-capacityproviders-ec2:  start: Building ab7a872fe0b5ea93e4f3b2c6cf19703f2465644c60cb1cc942578cd17ef35c97:REDACTED-us-east-1
ecsworkshop-capacityproviders-ec2:  success: Built ab7a872fe0b5ea93e4f3b2c6cf19703f2465644c60cb1cc942578cd17ef35c97:REDACTED-us-east-1
ecsworkshop-capacityproviders-ec2:  start: Publishing ab7a872fe0b5ea93e4f3b2c6cf19703f2465644c60cb1cc942578cd17ef35c97:REDACTED-us-east-1
ecsworkshop-capacityproviders-ec2:  success: Published ab7a872fe0b5ea93e4f3b2c6cf19703f2465644c60cb1cc942578cd17ef35c97:REDACTED-us-east-1
ecsworkshop-capacityproviders-ec2: deploying... [1/1]
ecsworkshop-capacityproviders-ec2: creating CloudFormation changeset...

 ✅  ecsworkshop-capacityproviders-ec2

✨  Deployment time: 240.24s

Outputs:
ecsworkshop-capacityproviders-ec2.EC2CapacityProviderServiceLoadBalancerDNS3B55F46D = ecswor-EC2Ca-wrQjekI8GOdK-91492963.us-east-1.elb.amazonaws.com
ecsworkshop-capacityproviders-ec2.EC2CapacityProviderServiceServiceURL81036241 = http://ecswor-EC2Ca-wrQjekI8GOdK-91492963.us-east-1.elb.amazonaws.com
Stack ARN:
arn:aws:cloudformation:us-east-1:REDACTED:stack/ecsworkshop-capacityproviders-ec2/818cd710-ee1c-11ee-9632-12aa7a2ddd5f

✨  Total time: 244.64s
```

check in console

![ec2 asg](/img/ecsworkshop-capacityproviders-asg.png)

### scale out 1 to 10

edit `app.py` change count from `1` to `10` and redeploy.

From the notes, understand what will happen. The capacity provider (CP) is set to maintain "total cluster capacity" at 80% and below. If the CP detects we're going to blow that, it'll trigger the autoscaling event and scale EC2's until "total cluster capacity" is 80% and below again.

change in `app.py`

```bash
        self.load_balanced_service = aws_ecs_patterns.ApplicationLoadBalancedEc2Service(
            self, "EC2CapacityProviderService",
            service_name='ecsdemo-capacityproviders-ec2',
            cluster=self.base_platform.ecs_cluster,
            cpu=256,
            memory_limit_mib=512,
            #desired_count=1,
            desired_count=10,
            public_load_balancer=True,
            task_image_options=self.task_image,
        )
```

output

```bash
~/R/A/e/ecsdemo-capacityproviders/ec2 on main !3 ❯ cdk deploy --require-approval never                                                        took  29s at  12:28:34

✨  Synthesis time: 4.7s

ecsworkshop-capacityproviders-ec2:  start: Building d0479eaf8688429dd4e51bfc4154dcf5d34a599cb48341ad8cc82555f02567ce:REDACTED-us-east-1
ecsworkshop-capacityproviders-ec2:  success: Built d0479eaf8688429dd4e51bfc4154dcf5d34a599cb48341ad8cc82555f02567ce:REDACTED-us-east-1
ecsworkshop-capacityproviders-ec2:  start: Publishing d0479eaf8688429dd4e51bfc4154dcf5d34a599cb48341ad8cc82555f02567ce:REDACTED-us-east-1
ecsworkshop-capacityproviders-ec2:  success: Published d0479eaf8688429dd4e51bfc4154dcf5d34a599cb48341ad8cc82555f02567ce:REDACTED-us-east-1
ecsworkshop-capacityproviders-ec2: deploying... [1/1]
ecsworkshop-capacityproviders-ec2: creating CloudFormation changeset...

 ✅  ecsworkshop-capacityproviders-ec2

✨  Deployment time: 231.23s

Outputs:
ecsworkshop-capacityproviders-ec2.EC2CapacityProviderServiceLoadBalancerDNS3B55F46D = ecswor-EC2Ca-wrQjekI8GOdK-91492963.us-east-1.elb.amazonaws.com
ecsworkshop-capacityproviders-ec2.EC2CapacityProviderServiceServiceURL81036241 = http://ecswor-EC2Ca-wrQjekI8GOdK-91492963.us-east-1.elb.amazonaws.com
Stack ARN:
arn:aws:cloudformation:us-east-1:REDACTED:stack/ecsworkshop-capacityproviders-ec2/818cd710-ee1c-11ee-9632-12aa7a2ddd5f

✨  Total time: 235.93s
```

check console

![asg scale](/img/ecsworkshop-capacityproviders-asg-scale.png)

## Clean Up EC2

You can scale it back down, change cound to `1` and `cdk deploy...` again, then clean up with `cdk destroy -f` inside the `/ec2` folder.

Done.
