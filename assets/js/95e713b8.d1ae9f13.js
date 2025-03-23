"use strict";(self.webpackChunkronamosa_github_io=self.webpackChunkronamosa_github_io||[]).push([[82043],{15680:(e,n,r)=>{r.d(n,{xA:()=>c,yg:()=>g});var a=r(96540);function t(e,n,r){return n in e?Object.defineProperty(e,n,{value:r,enumerable:!0,configurable:!0,writable:!0}):e[n]=r,e}function o(e,n){var r=Object.keys(e);if(Object.getOwnPropertySymbols){var a=Object.getOwnPropertySymbols(e);n&&(a=a.filter((function(n){return Object.getOwnPropertyDescriptor(e,n).enumerable}))),r.push.apply(r,a)}return r}function i(e){for(var n=1;n<arguments.length;n++){var r=null!=arguments[n]?arguments[n]:{};n%2?o(Object(r),!0).forEach((function(n){t(e,n,r[n])})):Object.getOwnPropertyDescriptors?Object.defineProperties(e,Object.getOwnPropertyDescriptors(r)):o(Object(r)).forEach((function(n){Object.defineProperty(e,n,Object.getOwnPropertyDescriptor(r,n))}))}return e}function l(e,n){if(null==e)return{};var r,a,t=function(e,n){if(null==e)return{};var r,a,t={},o=Object.keys(e);for(a=0;a<o.length;a++)r=o[a],n.indexOf(r)>=0||(t[r]=e[r]);return t}(e,n);if(Object.getOwnPropertySymbols){var o=Object.getOwnPropertySymbols(e);for(a=0;a<o.length;a++)r=o[a],n.indexOf(r)>=0||Object.prototype.propertyIsEnumerable.call(e,r)&&(t[r]=e[r])}return t}var s=a.createContext({}),p=function(e){var n=a.useContext(s),r=n;return e&&(r="function"==typeof e?e(n):i(i({},n),e)),r},c=function(e){var n=p(e.components);return a.createElement(s.Provider,{value:n},e.children)},u="mdxType",d={inlineCode:"code",wrapper:function(e){var n=e.children;return a.createElement(a.Fragment,{},n)}},m=a.forwardRef((function(e,n){var r=e.components,t=e.mdxType,o=e.originalType,s=e.parentName,c=l(e,["components","mdxType","originalType","parentName"]),u=p(r),m=t,g=u["".concat(s,".").concat(m)]||u[m]||d[m]||o;return r?a.createElement(g,i(i({ref:n},c),{},{components:r})):a.createElement(g,i({ref:n},c))}));function g(e,n){var r=arguments,t=n&&n.mdxType;if("string"==typeof e||t){var o=r.length,i=new Array(o);i[0]=m;var l={};for(var s in n)hasOwnProperty.call(n,s)&&(l[s]=n[s]);l.originalType=e,l[u]="string"==typeof e?e:t,i[1]=l;for(var p=2;p<o;p++)i[p]=r[p];return a.createElement.apply(null,i)}return a.createElement.apply(null,r)}m.displayName="MDXCreateElement"},83601:(e,n,r)=>{r.r(n),r.d(n,{assets:()=>s,contentTitle:()=>i,default:()=>d,frontMatter:()=>o,metadata:()=>l,toc:()=>p});var a=r(58168),t=(r(96540),r(15680));const o={slug:"terraform-aws-1",title:"Part 1 - Accounts, Single Deployment"},i=void 0,l={unversionedId:"archive/terraform-aws-ec2/2018-04-02-Terraform-AWS-EC2-Deployment-Part1",id:"archive/terraform-aws-ec2/2018-04-02-Terraform-AWS-EC2-Deployment-Part1",title:"Part 1 - Accounts, Single Deployment",description:"I found myself wanting to convert a cloudformation config file to terraform and realised I haven't worked with terraform before.",source:"@site/docs/archive/terraform-aws-ec2/2018-04-02-Terraform-AWS-EC2-Deployment-Part1.md",sourceDirName:"archive/terraform-aws-ec2",slug:"/archive/terraform-aws-ec2/terraform-aws-1",permalink:"/docs/archive/terraform-aws-ec2/terraform-aws-1",draft:!1,editUrl:"https://github.com/ronamosa/ronamosa.github.io/edit/main/website/docs/archive/terraform-aws-ec2/2018-04-02-Terraform-AWS-EC2-Deployment-Part1.md",tags:[],version:"current",frontMatter:{slug:"terraform-aws-1",title:"Part 1 - Accounts, Single Deployment"},sidebar:"docsSidebar",previous:{title:"Part 3 - NGINX SSL Frontend, Docker Compose and Demo.",permalink:"/docs/archive/docker-wordpress/docker-wordpress-3"},next:{title:"Part 2 - Clusters, Launch Config, Auto-Scaling Groups.",permalink:"/docs/archive/terraform-aws-ec2/terraform-aws-2"}},s={},p=[{value:"Setup",id:"setup",level:2},{value:"AWS Account",id:"aws-account",level:3},{value:"Install Terraform",id:"install-terraform",level:3},{value:"Initialize Terraform",id:"initialize-terraform",level:3},{value:"A Single Instance Deployment",id:"a-single-instance-deployment",level:2},{value:"Terraform Plan",id:"terraform-plan",level:3},{value:"Terraform Apply",id:"terraform-apply",level:3},{value:"Update plan and re-apply",id:"update-plan-and-re-apply",level:3},{value:"Deploy a Single Web Server",id:"deploy-a-single-web-server",level:2},{value:"outputs.tf",id:"outputstf",level:3},{value:"References",id:"references",level:2}],c={toc:p},u="wrapper";function d(e){let{components:n,...r}=e;return(0,t.yg)(u,(0,a.A)({},c,r,{components:n,mdxType:"MDXLayout"}),(0,t.yg)("p",null,"I found myself wanting to convert a cloudformation config file to terraform and realised I haven't worked with terraform before."),(0,t.yg)("p",null,"So let's fix that by finding a beginner's guide to getting your hands dirty with Terrafom."),(0,t.yg)("p",null,"I found and started following @gruntwork's ",(0,t.yg)("a",{parentName:"p",href:"https://blog.gruntwork.io/an-introduction-to-terraform-f17df9c6d180"},'"Introduction to Terraform"'),". "),(0,t.yg)("p",null,"Admittedly its from 2016 and was bit outdated, but I was already halfway through it before I checked how current it was :)"),(0,t.yg)("p",null,"No matter, learning is learning so here are my notes getting started with ",(0,t.yg)("a",{parentName:"p",href:"https://www.terraform.io"},"Terraform")," from my laptop."),(0,t.yg)("h2",{id:"setup"},"Setup"),(0,t.yg)("p",null,"Before you can do anything, you need the following"),(0,t.yg)("admonition",{title:"Pre-requisites",type:"info"},(0,t.yg)("ol",{parentName:"admonition"},(0,t.yg)("li",{parentName:"ol"},"AWS account"),(0,t.yg)("li",{parentName:"ol"},(0,t.yg)("inlineCode",{parentName:"li"},"iam")," user with limited permissions (",(0,t.yg)("inlineCode",{parentName:"li"},"AmazonEC2FullAccess"),")"),(0,t.yg)("li",{parentName:"ol"},(0,t.yg)("inlineCode",{parentName:"li"},"AWS_SECRET_KEY")," and ",(0,t.yg)("inlineCode",{parentName:"li"},"AWS_ACCESS_KEY")," of your iam user"),(0,t.yg)("li",{parentName:"ol"},(0,t.yg)("inlineCode",{parentName:"li"},"terraform")," installed"))),(0,t.yg)("h3",{id:"aws-account"},"AWS Account"),(0,t.yg)("p",null,"Setup your AWS user account"),(0,t.yg)("ul",null,(0,t.yg)("li",{parentName:"ul"},"you need programmatic access",(0,t.yg)("ul",{parentName:"li"},(0,t.yg)("li",{parentName:"ul"},"download the credentials.csv with your ",(0,t.yg)("inlineCode",{parentName:"li"},"KEY")," and ",(0,t.yg)("inlineCode",{parentName:"li"},"SECRET"),"."))),(0,t.yg)("li",{parentName:"ul"},"minimum '",(0,t.yg)("inlineCode",{parentName:"li"},"AmazonEC2FullAccess"),"' permissions"),(0,t.yg)("li",{parentName:"ul"},"DONT use your root account, create another user account with min. privileges to play around with.")),(0,t.yg)("h3",{id:"install-terraform"},"Install Terraform"),(0,t.yg)("p",null,"make sure you've got terraform installed"),(0,t.yg)("pre",null,(0,t.yg)("code",{parentName:"pre",className:"language-bash"},"$ terraform\nUsage: terraform [--version] [--help] <command> [args]\n\nThe available commands for execution are listed below.\nThe most common, useful commands are shown first, followed by\nless common or more advanced commands. If you're just getting\nstarted with Terraform, stick with the common commands. For the\nother commands, please read the help and docs before usage.\n\nCommon commands:\n    apply              Builds or changes infrastructure\n    console            Interactive console for Terraform interpolations\n    destroy            Destroy Terraform-managed infrastructure\n")),(0,t.yg)("h3",{id:"initialize-terraform"},"Initialize Terraform"),(0,t.yg)("p",null,"If you've never run terraform before you will probably need to run ",(0,t.yg)("inlineCode",{parentName:"p"},"terraform init")," in the folder you're working in so terraform can pull down any plugins it needs for your particular project"),(0,t.yg)("pre",null,(0,t.yg)("code",{parentName:"pre",className:"language-bash"},'$ terraform init\n\nInitializing provider plugins...\n- Checking for available provider plugins on https://releases.hashicorp.com...\n- Downloading plugin for provider "aws" (1.13.0)...\n\nThe following providers do not have any version constraints in configuration,\nso the latest version was installed.\n\nTo prevent automatic upgrades to new major versions that may contain breaking\nchanges, it is recommended to add version = "..." constraints to the\ncorresponding provider blocks in configuration, with the constraint strings\nsuggested below.\n\n* provider.aws: version = "~> 1.13"\n\nTerraform has been successfully initialized!\n\nYou may now begin working with Terraform. Try running "terraform plan" to see\nany changes that are required for your infrastructure. All Terraform commands\nshould now work.\n\nIf you ever set or change modules or backend configuration for Terraform,\nrerun this command to reinitialize your working directory. If you forget, other\ncommands will detect it and remind you to do so if necessary.\n')),(0,t.yg)("p",null,"otherwise you'll get this:"),(0,t.yg)("pre",null,(0,t.yg)("code",{parentName:"pre",className:"language-bash"},'$ terraform plan\nPlugin reinitialization required. Please run "terraform init".\nReason: Could not satisfy plugin requirements.\n\nPlugins are external binaries that Terraform uses to access and manipulate\nresources. The configuration provided requires plugins which can\'t be located,\ndon\'t satisfy the version constraints, or are otherwise incompatible.\n\n1 error(s) occurred:\n\n* provider.aws: no suitable version installed\n  version requirements: "(any version)"\n  versions installed: none\n\nTerraform automatically discovers provider requirements from your\nconfiguration, including providers used in child modules. To see the\nrequirements and constraints from each module, run "terraform providers".\n\n\nError: error satisfying plugin requirements\n')),(0,t.yg)("h2",{id:"a-single-instance-deployment"},"A Single Instance Deployment"),(0,t.yg)("p",null,"Create a file named ",(0,t.yg)("inlineCode",{parentName:"p"},"main.tf")," with this in it:"),(0,t.yg)("pre",null,(0,t.yg)("code",{parentName:"pre",className:"language-hcl"},'provider "aws" {\n  access_key = "${var.access_key}"\n  secret_key = "${var.secret_key}"\n  region     = "${var.region}"\n}\n\nresource "aws_instance" "single" {\n  ami = "ami-2d39803a"\n  instance_type = "t2.micro"\n}\n')),(0,t.yg)("h3",{id:"terraform-plan"},"Terraform Plan"),(0,t.yg)("p",null,"Run ",(0,t.yg)("inlineCode",{parentName:"p"},"terraform plan")," to check what you're intending to provision"),(0,t.yg)("pre",null,(0,t.yg)("code",{parentName:"pre",className:"language-bash"},'$ terraform plan\nRefreshing Terraform state in-memory prior to plan...\nThe refreshed state will be used to calculate this plan, but will not be\npersisted to local or remote state storage.\n\n\n------------------------------------------------------------------------\n\nAn execution plan has been generated and is shown below.\nResource actions are indicated with the following symbols:\n  + create\n\nTerraform will perform the following actions:\n\n  + aws_instance.example\n      id:                           <computed>\n      ami:                          "ami-2d39803a"\n      associate_public_ip_address:  <computed>\n      availability_zone:            <computed>\n      ebs_block_device.#:           <computed>\n      ephemeral_block_device.#:     <computed>\n      get_password_data:            "false"\n      instance_state:               <computed>\n      instance_type:                "t2.micro"\n      ipv6_address_count:           <computed>\n      ipv6_addresses.#:             <computed>\n      key_name:                     <computed>\n      network_interface.#:          <computed>\n      network_interface_id:         <computed>\n      password_data:                <computed>\n      placement_group:              <computed>\n      primary_network_interface_id: <computed>\n      private_dns:                  <computed>\n      private_ip:                   <computed>\n      public_dns:                   <computed>\n      public_ip:                    <computed>\n      root_block_device.#:          <computed>\n      security_groups.#:            <computed>\n      source_dest_check:            "true"\n      subnet_id:                    <computed>\n      tenancy:                      <computed>\n      volume_tags.%:                <computed>\n      vpc_security_group_ids.#:     <computed>\n\n\nPlan: 1 to add, 0 to change, 0 to destroy.\n\n------------------------------------------------------------------------\n\nNote: You didn\'t specify an "-out" parameter to save this plan, so Terraform\ncan\'t guarantee that exactly these actions will be performed if\n"terraform apply" is subsequently run.\n')),(0,t.yg)("h3",{id:"terraform-apply"},"Terraform Apply"),(0,t.yg)("p",null,"Now run ",(0,t.yg)("inlineCode",{parentName:"p"},"terraform apply")," to deploy our config"),(0,t.yg)("iframe",{width:"560",height:"315",src:"https://www.youtube-nocookie.com/embed/eaZK8k095Gc?rel=0&controls=0&showinfo=0",frameborder:"0",allow:"autoplay; encrypted-media",allowfullscreen:!0}),(0,t.yg)("p",null,"login to your AWS GUI console and see a new EC2 is now up & running"),(0,t.yg)("iframe",{width:"560",height:"315",src:"https://www.youtube-nocookie.com/embed/KNLv1uw72Zk?rel=0&controls=0&showinfo=0",frameborder:"0",allow:"autoplay; encrypted-media",allowfullscreen:!0}),(0,t.yg)("h3",{id:"update-plan-and-re-apply"},"Update plan and re-apply"),(0,t.yg)("p",null,"You can update your terraform plan on the fly, and push changes out pretty easily. For example adding the 'tags' section below."),(0,t.yg)("pre",null,(0,t.yg)("code",{parentName:"pre",className:"language-hcl"},'provider "aws" {\n  access_key = "${var.access_key}"\n  secret_key = "${var.secret_key}"\n  region     = "${var.region}"\n}\n\nresource "aws_instance" "single" {\n  ami = "ami-2d39803a"\n  instance_type = "t2.micro"\n\n  tags {\n    Name = "single"\n  }\n}\n')),(0,t.yg)("p",null,"re-run ",(0,t.yg)("inlineCode",{parentName:"p"},"terraform plan")," and then ",(0,t.yg)("inlineCode",{parentName:"p"},"terraform apply"),"."),(0,t.yg)("p",null,'check your AWS GUI and your EC2 instance should now have a new tag "Name=single".'),(0,t.yg)("h2",{id:"deploy-a-single-web-server"},"Deploy a Single Web Server"),(0,t.yg)("p",null,"Building on the single server config, we now deploy a single web server with a set-up-webserver one-liner."),(0,t.yg)("p",null,"Change your ",(0,t.yg)("inlineCode",{parentName:"p"},"main.tf")," to add the ",(0,t.yg)("inlineCode",{parentName:"p"},"user_data")," section like this:"),(0,t.yg)("pre",null,(0,t.yg)("code",{parentName:"pre",className:"language-hcl"},'resource "aws_instance" "web-1" {\n  ami = "ami-2d39803a"\n  instance_type = "t2.micro"\n\n  user_data = <<-EOF\n              #!/bin/bash\n              echo "Hello, World" > index.html\n              nohup busybox httpd -f -p 8080 &\n              EOF\n  tags {\n    Name = "single-web"\n  }\n}\n')),(0,t.yg)("p",null,"the ",(0,t.yg)("inlineCode",{parentName:"p"},"user_data")," section of an AMI bootup is where you bootstrap your EC2 instances with things you want it to provision on boot or startup."),(0,t.yg)("p",null,"By default AWS does not allow any inbound or outbound traffic to EC2, so we need to create a security group to allow this to enable us to connect to the web server:"),(0,t.yg)("p",null,(0,t.yg)("strong",{parentName:"p"},"option 1:")),(0,t.yg)("p",null,"static config hard-coded in"),(0,t.yg)("pre",null,(0,t.yg)("code",{parentName:"pre",className:"language-hcl"},'resource "aws_security_group" "ec2-web" {\n  name = "EC2WebSG"\n  ingress {\n    from_port = 8080\n    to_port = 8080\n    protocol = "tcp"\n    cidr_blocks = ["0.0.0.0/0"]\n  }\n}\n')),(0,t.yg)("p",null,(0,t.yg)("strong",{parentName:"p"},"option 2:")),(0,t.yg)("p",null,"abstract out the vars and refer to them instead"),(0,t.yg)("pre",null,(0,t.yg)("code",{parentName:"pre",className:"language-hcl"},'resource "aws_security_group" "ec2-web" {\n  name = "EC2WebSG"\n  ingress {\n    from_port = ${var.inbound_port}\n    to_port = ${var.inbound_port}\n    protocol = "tcp"\n    cidr_blocks = ["0.0.0.0/0"]\n  }\n}\n')),(0,t.yg)("p",null,"and add the following to your ",(0,t.yg)("inlineCode",{parentName:"p"},"variables.tf")," file:"),(0,t.yg)("pre",null,(0,t.yg)("code",{parentName:"pre",className:"language-hcl"},'variable "inbound_port" {\n  description = "The port the server will use for HTTP requests"\n  default = 8080\n}\n')),(0,t.yg)("p",null,"Now you need to just change your EC2 ",(0,t.yg)("inlineCode",{parentName:"p"},"user_data")," to use the new security group (i.e. ",(0,t.yg)("inlineCode",{parentName:"p"},"aws_security_group"),")"),(0,t.yg)("pre",null,(0,t.yg)("code",{parentName:"pre",className:"language-hcl"},'resource "aws_instance" "web-1" {\n  ami = "ami-2d39803a"\n  instance_type = "t2.micro"\n  vpc_security_group_ids = ["${aws_security_group.instance.id}"]\n\n  user_data = <<-EOF\n              #!/bin/bash\n              echo "Hello, World" > index.html\n              nohup busybox httpd -f -p 8080 &\n              EOF\n  tags {\n    Name = "single-web"\n  }\n}\n')),(0,t.yg)("p",null,"run ",(0,t.yg)("inlineCode",{parentName:"p"},"terraform plan"),", see what we're changing:"),(0,t.yg)("pre",null,(0,t.yg)("code",{parentName:"pre",className:"language-hcl"},'Terraform will perform the following actions:\n\n  ~ aws_instance.web-1\n      vpc_security_group_ids.#:             "" => <computed>\n\n  + aws_security_group.instance\n      id:                                   <computed>\n      arn:                                  <computed>\n      description:                          "Managed by Terraform"\n      egress.#:                             <computed>\n      ingress.#:                            "1"\n      ingress.516175195.cidr_blocks.#:      "1"\n      ingress.516175195.cidr_blocks.0:      "0.0.0.0/0"\n      ingress.516175195.description:        ""\n      ingress.516175195.from_port:          "8080"\n      ingress.516175195.ipv6_cidr_blocks.#: "0"\n      ingress.516175195.protocol:           "tcp"\n      ingress.516175195.security_groups.#:  "0"\n      ingress.516175195.self:               "false"\n      ingress.516175195.to_port:            "8080"\n      name:                                 "EC2WebSG"\n      owner_id:                             <computed>\n      revoke_rules_on_delete:               "false"\n      vpc_id:                               <computed>\n\n\nPlan: 1 to add, 1 to change, 0 to destroy.\n\n')),(0,t.yg)("p",null,"perfect. run it (",(0,t.yg)("inlineCode",{parentName:"p"},"'terraform apply'"),")"),(0,t.yg)("iframe",{width:"560",height:"315",src:"https://www.youtube-nocookie.com/embed/se7Rlgg8MAE?rel=0&controls=0&showinfo=0",frameborder:"0",allow:"autoplay; encrypted-media",allowfullscreen:!0}),(0,t.yg)("h3",{id:"outputstf"},"outputs.tf"),(0,t.yg)("p",null,"handy way to get the public_ip of our ",(0,t.yg)("inlineCode",{parentName:"p"},"web-1")," instance, add a new file ",(0,t.yg)("inlineCode",{parentName:"p"},"outputs.tf")," to your directory."),(0,t.yg)("p",null,"put this in it:"),(0,t.yg)("pre",null,(0,t.yg)("code",{parentName:"pre",className:"language-hcl"},'output "public_ip" {\n  value = "${aws_instance.web-1.public_ip}"\n}\n\n')),(0,t.yg)("p",null,(0,t.yg)("em",{parentName:"p"},"note: make sure the part in between 'aws_instace.' and '.public_ip' matches whatever you've named your EC2 instance to (mine's web-1).")),(0,t.yg)("p",null,(0,t.yg)("inlineCode",{parentName:"p"},"terraform apply")," will run and grab the public_ip of your instance for you"),(0,t.yg)("pre",null,(0,t.yg)("code",{parentName:"pre",className:"language-hcl"},"$ terraform apply\naws_instance.single: Refreshing state... (ID: i-05a82498eb5f3177f)\naws_security_group.instance: Refreshing state... (ID: sg-d53a28a3)\naws_instance.web-1: Refreshing state... (ID: i-095ebd5015036ac62)\n\nApply complete! Resources: 0 added, 0 changed, 0 destroyed.\n\nOutputs:\n\npublic_ip = 54.89.22.195\n")),(0,t.yg)("p",null,"have a browse to ",(0,t.yg)("inlineCode",{parentName:"p"},"https://54.89.22.195:8080")," and see the output of the 'index.html' you setup."),(0,t.yg)("iframe",{width:"560",height:"315",src:"https://www.youtube-nocookie.com/embed/SbMS9ZIhWfg?rel=0&controls=0&showinfo=0",frameborder:"0",allow:"autoplay; encrypted-media",allowfullscreen:!0}),(0,t.yg)("p",null,"wow, so this took me a while sorting out a few things as I tried to go through this so we'll leave it there today."),(0,t.yg)("p",null,"In ",(0,t.yg)("a",{parentName:"p",href:"terraform-aws-2"},"Part II")," we'll deploy a cluster of web servers using Auto Scaling Groups, and fang an Elastic Load Balancer in there as well!"),(0,t.yg)("h2",{id:"references"},"References"),(0,t.yg)("ul",null,(0,t.yg)("li",{parentName:"ul"},(0,t.yg)("a",{parentName:"li",href:"https://www.terraform.io/docs/configuration/data-sources.html"},"terraform - data sources")),(0,t.yg)("li",{parentName:"ul"},(0,t.yg)("a",{parentName:"li",href:"https://www.terraform.io/intro/getting-started/variables.html"},"terraform - input variables")),(0,t.yg)("li",{parentName:"ul"},(0,t.yg)("a",{parentName:"li",href:"http://pinter.org/archives/5831"},"terraform init post"))))}d.isMDXComponent=!0}}]);