---
title: "AWS Workshop: CI/CD for Amazon ECS"
---

:::tip Workshop Links

- AWS Workshop: [CI/CD](https://catalog.us-east-1.prod.workshops.aws/workshops/869f7eee-d3a2-490b-bf9a-ac90a8fb2d36/en-US)

:::

:::note

I am running this from a Cloud9 instance in my staff AWS account.

:::

## Architecural Diagram

This is essentially what we're building.

In the top half, the CICD environment, in the bottom half, the production blue/green deployment.

![architectural diagram](/img/AWS-CICD-ECS-arch1.png)

## Workshop Setup

:::caution IMDSv1 & IMDSv2

If you're not getting any response when doing `curl http://169.254.169.254/latest/meta-data/` it means you're using IMDSv2 and need to do this instead 

```bash
TOKEN=`curl -X PUT "http://169.254.169.254/latest/api/token" -H "X-aws-ec2-metadata-token-ttl-seconds: 21600"` \
&& curl -H "X-aws-ec2-metadata-token: $TOKEN" http://169.254.169.254/latest/meta-data/
```

Or just export set variable:

```bash
export TOKEN=`curl -X PUT "http://169.254.169.254/latest/api/token" -H "X-aws-ec2-metadata-token-ttl-seconds: 21600"`
```

*Read [more](https://docs.aws.amazon.com/AWSEC2/latest/UserGuide/instancedata-data-retrieval.html)*.

:::

### Configure Region

```bash
# IMDSv2
export TOKEN=`curl -X PUT "http://169.254.169.254/latest/api/token" -H "X-aws-ec2-metadata-token-ttl-seconds: 21600"`

save_var AWS_REGION $(curl -s 169.254.169.254/latest/dynamic/instance-identity/document | jq -r .region)
aws configure set default.region ${AWS_REGION}
aws configure get default.region
```


## Troubleshooting

### Cloud9

running into issues using Cloud9, IMDSv2 issues, sts to get aws cli creds issues.

```bash
cloudbuilderio:~/environment $ save_var AWS_ACCOUNT_ID $(aws sts get-caller-identity --query Account --output text)

Invalid endpoint: https://sts..amazonaws.com
cloudbuilderio:~/environment $ aws s3 ls

Invalid endpoint: https://s3..amazonaws.com
cloudbuilderio:~/environment $ aws 

usage: aws [options] <command> <subcommand> [<subcommand> ...] [parameters]
To see help text, you can run:

  aws help
  aws <command> help
  aws <command> <subcommand> help

aws: error: the following arguments are required: command

cloudbuilderio:~/environment $ aws configure
AWS Access Key ID [****************RRMF]: 
AWS Secret Access Key [****************17Mu]: 
Default region name [us-east-1]: 
Default output format [None]: 
cloudbuilderio:~/environment $ aws s3 ls

Invalid endpoint: https://s3..amazonaws.com
cloudbuilderio:~/environment $ 
```