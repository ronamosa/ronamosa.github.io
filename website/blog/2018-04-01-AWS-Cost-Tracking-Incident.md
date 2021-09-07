---
title: "A Runaway AWS EC2 Instance Blows up My Cloud Costs."
author: Ron Amosa
author_title: Platform Security Engineer @ Salesforce U.S.
author_url: https://github.com/ronamosa
author_image_url: https://github.com/ronamosa.png
tags: [cloud, aws]
---

AWS have this little note on their "[Avoiding Unexpected Charges](https://docs.aws.amazon.com/awsaccountbilling/latest/aboutv2/checklistforunwantedcharges.html)" page that reads...

:::note

If you close your account or unsubscribe from a service, make sure that you take the appropriate steps for every region in which you've allocated AWS resources.

:::

The part that says ominously _"...appropriate steps for every region..."_ is funny because it sounds like AWS is telling you if you don't know what you're doing, good luck to you.

<!--truncate-->

And that's kind of what happend to me when my cost explorer said I had been running an EC2 instance for the last 6 months..

## Bill-Shock Scenario

okay I'm being dramatic. It wasn't shocking in the sense that it was a kabillion dollar$$ and could ruin me financially. I was just shocked I had been running an EC2 instance in the aws account I use for study and training, that I had finished and shutdown 6 months ago.

I login to my cost explorer to see this...

I'm not even running any EC2 instances though? (so I thought)

I have a look on the AWS GUI and can't find anything.

But that's for N. Virgina region. And there's a bunch of regions to look through.

Being the kind of engineer I am, I want to automate this work i.e. write a script that does all the heavy lifting for me.

I do a Google search on how to list all instances running in _all_ regions for my AWS account.

Bingo! 

I find this [post with a script on StackOverflow](https://stackoverflow.com/questions/42086712/how-to-see-all-running-amazon-ec2-instances-across-all-regions/42087018)

_note: you'll need the [aws cli](https://aws.amazon.com/cli/) installed if you want to follow this._

I make myself a little [bash script](https://gist.github.com/ronamosa/0475a52a3798ffbaad75f53c1ae06426) from the info from the post, modify it a little bit:

```bash
#!/usr/bin/env bash

for region in `aws ec2 describe-regions --query Regions[*].[RegionName] --output text`
do
     echo -e "\nListing Instances in region:'$region'..."
     aws ec2 describe-instances --region $region
done
```

I check my AWS credentials under `~/.aws/credentials` have permission to query my aws account.

Then I run my script.

And look what I found.

```json
Listing Instances in region:'ap-south-1'...
{
    "Reservations": []
}

Listing Instances in region:'eu-west-3'...
{
    "Reservations": []
}

Listing Instances in region:'eu-west-2'...
{
    "Reservations": [
        {
            "OwnerId": "872504604641",
            "ReservationId": "r-05eda9ce25134f5d0",
            "Groups": [],
            "Instances": [
                {
                    "Monitoring": {
                        "State": "disabled"
                    },
                    "PublicDnsName": "ec2-52-56-207-206.eu-west-2.compute.amazonaws.com",
                    "RootDeviceType": "ebs",
                    "State": {
                        "Code": 16,
                        "Name": "running"
                    },
                    "EbsOptimized": false,
                    "LaunchTime": "2017-07-23T23:05:19.000Z",
                    "PublicIpAddress": "52.56.207.206",
                    "PrivateIpAddress": "172.31.2.60",
                    "ProductCodes": [],
                    "VpcId": "vpc-2c1c9645",
                    "StateTransitionReason": "",
                    "InstanceId": "i-0e7586db9aa49a0f7",
                    "EnaSupport": true,
                    "ImageId": "ami-ed100689",
                    "PrivateDnsName": "ip-172-31-2-60.eu-west-2.compute.internal",
                    "KeyName": "MyLondonDMZ",
                    "SecurityGroups": [

```

A rogue instance eu-west-2 (Europe West 2nd Region) with a keyname of "MyLondonDMZ".

I immediately remember this from my online course studying for my ['AWS Solution Architect - Associate' Certificate](https://aws.amazon.com/certification/certified-solutions-architect-associate/) with [ACloudGuru](https://acloud.guru/).

Now I can log into the GUI and go to the right region (ah look, its London):

Click through to see more details about the rogue instance (not really rogue, just that I missed shutting it down.... 6 months ago)

So I terminate the instance

And all is right with the world....

But this makes me remember all the headlines I had seen about moving to the cloud, companys underestimating the need to design and stay on top of their AWS resources.

This isn't easy. And certainly shouldn't be underestimated. And also inspired me to write another blog post about it [here](2018-04-02-AWS-Cloud-Cost-Management.md)
