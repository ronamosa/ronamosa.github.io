"use strict";(self.webpackChunkronamosa_github_io=self.webpackChunkronamosa_github_io||[]).push([[25438],{15680:(e,r,t)=>{t.d(r,{xA:()=>u,yg:()=>y});var a=t(96540);function n(e,r,t){return r in e?Object.defineProperty(e,r,{value:t,enumerable:!0,configurable:!0,writable:!0}):e[r]=t,e}function s(e,r){var t=Object.keys(e);if(Object.getOwnPropertySymbols){var a=Object.getOwnPropertySymbols(e);r&&(a=a.filter((function(r){return Object.getOwnPropertyDescriptor(e,r).enumerable}))),t.push.apply(t,a)}return t}function o(e){for(var r=1;r<arguments.length;r++){var t=null!=arguments[r]?arguments[r]:{};r%2?s(Object(t),!0).forEach((function(r){n(e,r,t[r])})):Object.getOwnPropertyDescriptors?Object.defineProperties(e,Object.getOwnPropertyDescriptors(t)):s(Object(t)).forEach((function(r){Object.defineProperty(e,r,Object.getOwnPropertyDescriptor(t,r))}))}return e}function i(e,r){if(null==e)return{};var t,a,n=function(e,r){if(null==e)return{};var t,a,n={},s=Object.keys(e);for(a=0;a<s.length;a++)t=s[a],r.indexOf(t)>=0||(n[t]=e[t]);return n}(e,r);if(Object.getOwnPropertySymbols){var s=Object.getOwnPropertySymbols(e);for(a=0;a<s.length;a++)t=s[a],r.indexOf(t)>=0||Object.prototype.propertyIsEnumerable.call(e,t)&&(n[t]=e[t])}return n}var l=a.createContext({}),c=function(e){var r=a.useContext(l),t=r;return e&&(t="function"==typeof e?e(r):o(o({},r),e)),t},u=function(e){var r=c(e.components);return a.createElement(l.Provider,{value:r},e.children)},p="mdxType",g={inlineCode:"code",wrapper:function(e){var r=e.children;return a.createElement(a.Fragment,{},r)}},m=a.forwardRef((function(e,r){var t=e.components,n=e.mdxType,s=e.originalType,l=e.parentName,u=i(e,["components","mdxType","originalType","parentName"]),p=c(t),m=n,y=p["".concat(l,".").concat(m)]||p[m]||g[m]||s;return t?a.createElement(y,o(o({ref:r},u),{},{components:t})):a.createElement(y,o({ref:r},u))}));function y(e,r){var t=arguments,n=r&&r.mdxType;if("string"==typeof e||n){var s=t.length,o=new Array(s);o[0]=m;var i={};for(var l in r)hasOwnProperty.call(r,l)&&(i[l]=r[l]);i.originalType=e,i[p]="string"==typeof e?e:n,o[1]=i;for(var c=2;c<s;c++)o[c]=t[c];return a.createElement.apply(null,o)}return a.createElement.apply(null,t)}m.displayName="MDXCreateElement"},44372:(e,r,t)=>{t.r(r),t.d(r,{assets:()=>l,contentTitle:()=>o,default:()=>g,frontMatter:()=>s,metadata:()=>i,toc:()=>c});var a=t(58168),n=(t(96540),t(15680));const s={title:"SecretHub: Secrets Management"},o=void 0,i={unversionedId:"engineer/K8s/2020-08-17-Secrethub-Secret-Management",id:"engineer/K8s/2020-08-17-Secrethub-Secret-Management",title:"SecretHub: Secrets Management",description:"Published Date: 17-AUG-2020",source:"@site/docs/engineer/K8s/2020-08-17-Secrethub-Secret-Management.md",sourceDirName:"engineer/K8s",slug:"/engineer/K8s/2020-08-17-Secrethub-Secret-Management",permalink:"/docs/engineer/K8s/2020-08-17-Secrethub-Secret-Management",draft:!1,editUrl:"https://github.com/ronamosa/ronamosa.github.io/edit/main/website/docs/engineer/K8s/2020-08-17-Secrethub-Secret-Management.md",tags:[],version:"current",frontMatter:{title:"SecretHub: Secrets Management"},sidebar:"docsSidebar",previous:{title:"Setup Istio to handle Mutual TLS (mTLS) with an external site using an Egress gateway.",permalink:"/docs/engineer/K8s/2020-04-08-Istio-MTLS-with-External-Endpoint"},next:{title:"Terminal and OMZ Prompt Setup",permalink:"/docs/engineer/LAB/Terminal"}},l={},c=[{value:"Objective",id:"objective",level:2},{value:"Pre-requisites",id:"pre-requisites",level:2},{value:"Storage Account &amp; Key",id:"storage-account--key",level:3},{value:"Service Principal",id:"service-principal",level:3},{value:"SSH Public Keys",id:"ssh-public-keys",level:3},{value:"SecretHub Setup",id:"secrethub-setup",level:2},{value:"Directory Structure",id:"directory-structure",level:3},{value:"Create Directories",id:"create-directories",level:3},{value:"Create SecretHub Secrets",id:"create-secrethub-secrets",level:3},{value:"Terraform AKS Setup",id:"terraform-aks-setup",level:2},{value:"Install Terraform Provider",id:"install-terraform-provider",level:3},{value:"SecretHub Terraform Resources",id:"secrethub-terraform-resources",level:3},{value:"Run Deployment",id:"run-deployment",level:2},{value:"Conclusion",id:"conclusion",level:2},{value:"References",id:"references",level:2}],u={toc:c},p="wrapper";function g(e){let{components:r,...s}=e;return(0,n.yg)(p,(0,a.A)({},u,s,{components:r,mdxType:"MDXLayout"}),(0,n.yg)("admonition",{type:"info"},(0,n.yg)("p",{parentName:"admonition"},"Published Date: 17-AUG-2020")),(0,n.yg)("p",null,"A simple example of setting up SecretHub secrets manager to secure all your application and infrastructure secrets at deployment"),(0,n.yg)("p",null,"Secrets management, especially as part of a project/product team, is something that can easily get very messy with user, system and application credentials all over the place due to a lack of a secrets management system and practice setup. It's important to figure this out early in the piece, especially for all the engineers who are going to be working on the application and infrastructure for that app, you want people to come into the team and have access to everything they need and not have to compromise any security to do so."),(0,n.yg)("h2",{id:"objective"},"Objective"),(0,n.yg)("p",null,"In this post I'm going to go through setting up ",(0,n.yg)("a",{parentName:"p",href:"https://secrethub.io/docs/start/getting-started/"},"SecretHub Secret Manager")," to take care of the following common secrets management patterns:"),(0,n.yg)("ol",null,(0,n.yg)("li",{parentName:"ol"},"Shell Environment secrets"),(0,n.yg)("li",{parentName:"ol"},"Infrastructure Code secrets")),(0,n.yg)("p",null,"Essentially we're taking something that usually looks like this:"),(0,n.yg)("p",null,(0,n.yg)("img",{alt:"pipeline problem",src:t(67296).A,width:"921",height:"281"})),(0,n.yg)("p",null,"Into this:"),(0,n.yg)("p",null,(0,n.yg)("img",{alt:"pipeline solution",src:t(99228).A,width:"962",height:"412"})),(0,n.yg)("p",null,"By the end you will see how secrets can be managed for:"),(0,n.yg)("ul",null,(0,n.yg)("li",{parentName:"ul"},"A storage account key for terraform remote state file, in an ENV variable"),(0,n.yg)("li",{parentName:"ul"},"An azure service principal for AKS, in the infrastructure code (terraform)"),(0,n.yg)("li",{parentName:"ul"},"ssh private keys for AKS nodes, also in the infrastructure code (terraform)")),(0,n.yg)("h2",{id:"pre-requisites"},"Pre-requisites"),(0,n.yg)("p",null,"This post builds on Microsoft Azure so to follow along you will need the following things:"),(0,n.yg)("ul",null,(0,n.yg)("li",{parentName:"ul"},"Azure Account"),(0,n.yg)("li",{parentName:"ul"},(0,n.yg)("inlineCode",{parentName:"li"},"az-cli")," tool"),(0,n.yg)("li",{parentName:"ul"},"terraform ",(0,n.yg)("inlineCode",{parentName:"li"},"0.12.x")),(0,n.yg)("li",{parentName:"ul"},"clone of repo ",(0,n.yg)("a",{parentName:"li",href:"https://github.com/ronamosa/aks-secrethub-cluster"},"'aks-secrethub-cluster'"))),(0,n.yg)("h3",{id:"storage-account--key"},"Storage Account & Key"),(0,n.yg)("p",null,"Best practice for Terraform means using a remote state file saved on your cloud provider (securely) so we need to create an Azure storage account."),(0,n.yg)("p",null,"First, create a resource group:"),(0,n.yg)("pre",null,(0,n.yg)("code",{parentName:"pre",className:"language-bash"},'export RESOURCE_GROUP_NAME="terraform-rg"\nexport LOCATION="australiasoutheast"\naz group create --name ${RESOURCE_GROUP_NAME} --location ${LOCATION}\n')),(0,n.yg)("p",null,"Now create the storage account:"),(0,n.yg)("pre",null,(0,n.yg)("code",{parentName:"pre",className:"language-bash"},'export STORAGE_ACCOUNT_NAME="terraform"\naz storage account create --resource-group ${RESOURCE_GROUP_NAME} --name ${STORAGE_ACCOUNT_NAME} --sku Standard_LRS --encryption-services blob\n')),(0,n.yg)("p",null,"Get the ARM access key from the storage account and use it to create a storage account container:"),(0,n.yg)("pre",null,(0,n.yg)("code",{parentName:"pre",className:"language-bash"},'CONTAINER_NAME="tfstate"\nexport ARM_ACCESS_KEY=$(az storage account keys list --resource-group ${RESOURCE_GROUP_NAME} --account-name ${STORAGE_ACCOUNT_NAME} --query [0].value -o tsv)\naz storage container create --name ${CONTAINER_NAME} --account-name ${STORAGE_ACCOUNT_NAME} --account-key ${ARM_ACCESS_KEY}\n')),(0,n.yg)("p",null,"Note the value of your ",(0,n.yg)("inlineCode",{parentName:"p"},"ARM_ACCESS_KEY")," somewhere for later."),(0,n.yg)("h3",{id:"service-principal"},"Service Principal"),(0,n.yg)("p",null,"AKS needs a service principal with the permission to provision & manage resources in Azure."),(0,n.yg)("pre",null,(0,n.yg)("code",{parentName:"pre",className:"language-bash"},'# you need your subcription ID handy\naz account set --subscription="SUBSCRIPTION_ID"\naz ad sp create-for-rbac --role="Contributor" --scopes="/subscriptions/SUBSCRIPTION_ID"\n')),(0,n.yg)("p",null,"Output looks like this:"),(0,n.yg)("pre",null,(0,n.yg)("code",{parentName:"pre",className:"language-json"},'{\n  "appId": "00000000-0000-0000-0000-000000000000",\n  "displayName": "azure-cli-2020-08-17-10-41-15",\n  "name": "http://azure-cli-2020-08-17-10-41-15",\n  "password": "0000-0000-0000-0000-000000000000",\n  "tenant": "00000000-0000-0000-0000-000000000000"\n}\n')),(0,n.yg)("p",null,"Note the ",(0,n.yg)("inlineCode",{parentName:"p"},"appId")," as ",(0,n.yg)("inlineCode",{parentName:"p"},"SPN_ID")," and ",(0,n.yg)("inlineCode",{parentName:"p"},"password")," as ",(0,n.yg)("inlineCode",{parentName:"p"},"SPN_SECRET")," for later."),(0,n.yg)("h3",{id:"ssh-public-keys"},"SSH Public Keys"),(0,n.yg)("p",null,"AKS ",(0,n.yg)("inlineCode",{parentName:"p"},"linux_profile")," requires an ",(0,n.yg)("inlineCode",{parentName:"p"},"ssh_key")," public key used to access the cluster."),(0,n.yg)("pre",null,(0,n.yg)("code",{parentName:"pre",className:"language-terraform"},"  linux_profile {\n    admin_username = var.vm_user_name\n\n    ssh_key {\n      key_data = data.secrethub_secret.aks_ssh_key.value\n    }\n  }\n")),(0,n.yg)("p",null,"Generate a new keypair:"),(0,n.yg)("pre",null,(0,n.yg)("code",{parentName:"pre",className:"language-bash"},"$ ssh-keygen\nGenerating public/private rsa key pair.\nEnter file in which to save the key (/home/user/.ssh/id_rsa): ./secrethub-keypair\nEnter passphrase (empty for no passphrase):\nEnter same passphrase again:\nYour identification has been saved in ./secrethub-keypair.\nYour public key has been saved in ./secrethub-keypair.pub.\nThe key fingerprint is:\nSHA256:80P9EDgEkiEVpgpiYEuzqWFAJW43TlBqKimTvezHIjg user@laptop\nThe keys randomart image is:\n+---[RSA 2048]----+\n|+Boo..*+...      |\n|* O  +.. . .     |\n|+@ +.     o .    |\n|O*+..      o .   |\n|O o.    S . o    |\n|oo .     +   o   |\n|. o.      o   .  |\n|E.. o      .     |\n| o.o             |\n+----[SHA256]-----+\n")),(0,n.yg)("p",null,"Once you have your account, check it with: ",(0,n.yg)("inlineCode",{parentName:"p"},"secrethub account inspect")),(0,n.yg)("p",null,"Substitute ",(0,n.yg)("inlineCode",{parentName:"p"},"SECRETHUB_ACCOUNT")," for your secrethub account from now on."),(0,n.yg)("h2",{id:"secrethub-setup"},"SecretHub Setup"),(0,n.yg)("h3",{id:"directory-structure"},"Directory Structure"),(0,n.yg)("p",null,"Your secrethub setup is path based, so you need to think about directory structure of how you want your secret mapped out."),(0,n.yg)("p",null,"For this simple setup we will go with the following ",(0,n.yg)("a",{parentName:"p",href:"https://secrethub.io/docs/basics/best-practices/"},"recommended structure"),", to group our secrets in terms of ",(0,n.yg)("inlineCode",{parentName:"p"},"environments")," first and then more granularly in terms of ",(0,n.yg)("inlineCode",{parentName:"p"},"application")," they belong to:"),(0,n.yg)("pre",null,(0,n.yg)("code",{parentName:"pre",className:"language-txt"},"$SECRETHUB_ACCOUNT/\n\u251c\u2500\u2500 aks_secrets/\n    \u2514\u2500\u2500 prod/\n        \u251c\u2500\u2500 terraform/\n        |   |-- aks_service_principal_id\n        |   |-- aks_service_principal_secret\n        |   |-- aks_ssh_key\n        |\u2500\u2500 azure/\n            |-- arm_access_key\n")),(0,n.yg)("h3",{id:"create-directories"},"Create Directories"),(0,n.yg)("p",null,"We need to create the directory paths mentioned in the previous section for our secrets:"),(0,n.yg)("pre",null,(0,n.yg)("code",{parentName:"pre",className:"language-bash"},"secrethub repo init $SECRETHUB_ACCOUNT/aks_secrets\nsecrethub mkdir $SECRETHUB_ACCOUNT/aks_secrets/prod\nsecrethub mkdir $SECRETHUB_ACCOUNT/aks_secrets/prod/terraform\nsecrethub mkdir $SECRETHUB_ACCOUNT/aks_secrets/prod/azure\n")),(0,n.yg)("h3",{id:"create-secrethub-secrets"},"Create SecretHub Secrets"),(0,n.yg)("pre",null,(0,n.yg)("code",{parentName:"pre",className:"language-bash"},"# azure secrets directory\necho ${ARM_ACCESS_KEY} | secrethub write $SECRETHUB_ACCOUNT/aks_secrets/prod/azure/arm_access_key\n\n# terraform secrets directory\necho ${SPN_ID} | secrethub write $SECRETHUB_ACCOUNT/aks_secrets/prod/terraform/aks_service_principal_id\necho ${SPN_SECRET} | secrethub write $SECRETHUB_ACCOUNT/aks_secrets/prod/terraform/aks_service_principal_secret\ncat ${SSH_KEYPAIR} | secrethub write $SECRETHUB_ACCOUNT/aks_secrets/prod/terraform/aks_ssh_key\n")),(0,n.yg)("h2",{id:"terraform-aks-setup"},"Terraform AKS Setup"),(0,n.yg)("p",null,"Clone the following repo if you haven't already done so ",(0,n.yg)("a",{parentName:"p",href:"https://github.com/ronamosa/aks-secrethub-cluster"},"'aks-secrethub-cluster'")),(0,n.yg)("h3",{id:"install-terraform-provider"},"Install Terraform Provider"),(0,n.yg)("p",null,"SecretHub provides a terraform provider, follow the installation instructions found at ",(0,n.yg)("a",{parentName:"p",href:"https://secrethub.io/docs/reference/terraform/install/"},"'Install SecretHub Terraform Provider'")),(0,n.yg)("p",null,"Or, run this for ",(0,n.yg)("inlineCode",{parentName:"p"},"amd64")," version:"),(0,n.yg)("pre",null,(0,n.yg)("code",{parentName:"pre",className:"language-bash"},"mkdir -p ~/.terraform.d/plugins && curl -SfL https://github.com/secrethub/terraform-provider-secrethub/releases/latest/download/terraform-provider-secrethub-linux-amd64.tar.gz | tar zxf - -C ~/.terraform.d/plugins\n")),(0,n.yg)("h3",{id:"secrethub-terraform-resources"},"SecretHub Terraform Resources"),(0,n.yg)("p",null,"The main components where all the magic happen are as follows:"),(0,n.yg)("p",null,"Declare the provider, and where to find your secrethub credentials in ",(0,n.yg)("inlineCode",{parentName:"p"},"prodiver.tf")),(0,n.yg)("pre",null,(0,n.yg)("code",{parentName:"pre",className:"language-hcl"},'provider "secrethub" {\n  credential = file("~/.secrethub/credential")\n}\n')),(0,n.yg)("p",null,"Because your secrets already exist, you want to set them up as data sources in ",(0,n.yg)("inlineCode",{parentName:"p"},"aks.tf")),(0,n.yg)("p",null,(0,n.yg)("em",{parentName:"p"},"(remember to replace ",(0,n.yg)("inlineCode",{parentName:"em"},"$SECRETHUB_ACCOUNT")," with your account details)")),(0,n.yg)("pre",null,(0,n.yg)("code",{parentName:"pre",className:"language-hcl"},'# secrethub secret - service principal id\ndata "secrethub_secret" "aks_service_principal_id" {\n  path = "$SECRETHUB_ACCOUNT/aks_secrets/prod/terraform/aks_service_principal_id"\n}\n\n# secrethub secret - service principal secret\ndata "secrethub_secret" "aks_service_principal_secret" {\n  path = "$SECRETHUB_ACCOUNT/aks_secrets/prod/terraform/aks_service_principal_secret"\n}\n\n# secrethub secret - ssh key for aks nodes\ndata "secrethub_secret" "aks_ssh_key" {\n  path = "$SECRETHUB_ACCOUNT/aks_secrets/prod/terraform/aks_ssh_key"\n}\n')),(0,n.yg)("p",null,"As a deployment-time secret, you use the file provided, ",(0,n.yg)("inlineCode",{parentName:"p"},"secrethub.env")," which has the entry for the ",(0,n.yg)("inlineCode",{parentName:"p"},"ARM_ACCESS_KEY")," to access your remote storage account to manage the terraform state file:"),(0,n.yg)("pre",null,(0,n.yg)("code",{parentName:"pre",className:"language-bash"},"{% raw %}\nARM_ACCESS_KEY = {{ $SECRETHUB_ACCOUNT/aks_secrets/prod/azure/arm_access_key }}\n{% endraw %}\n")),(0,n.yg)("h2",{id:"run-deployment"},"Run Deployment"),(0,n.yg)("p",null,"Make sure to update ",(0,n.yg)("inlineCode",{parentName:"p"},"aks.tf")," backend details, with your details (see above)"),(0,n.yg)("pre",null,(0,n.yg)("code",{parentName:"pre",className:"language-hcl"},'terraform {\n  backend "azurerm" {\n    resource_group_name  = RESOURCE_GROUP_NAME\n    storage_account_name = STORAGE_ACCOUNT_NAME\n    container_name       = CONTAINER_NAME\n  }\n}\n')),(0,n.yg)("p",null,"After you have confirmed everything is in place, use the ",(0,n.yg)("inlineCode",{parentName:"p"},"make")," command to build your infra:"),(0,n.yg)("pre",null,(0,n.yg)("code",{parentName:"pre",className:"language-bash"},"ENV=prod make plan\nENV=prod make apply\n")),(0,n.yg)("p",null,"The Makefile will run an apply like this:"),(0,n.yg)("pre",null,(0,n.yg)("code",{parentName:"pre",className:"language-bash"},"secrethub run -- terraform apply\n")),(0,n.yg)("p",null,"Where ",(0,n.yg)("inlineCode",{parentName:"p"},"secrethub.env")," file will get picked up by default, the ",(0,n.yg)("inlineCode",{parentName:"p"},"ARM_ACCESS_KEY")," will be imported in as an Environment variable, allowing terraform to access the remote storage account."),(0,n.yg)("h2",{id:"conclusion"},"Conclusion"),(0,n.yg)("p",null,"In this post we have setup a simple AKS cluster using terraform to use SecretHub, to manage and secure our secrets."),(0,n.yg)("p",null,"We have setup a remote state file secret; an azure service principal secret and a terraform ssh key secret. All into the SecretHub Secrets Manager and have injected them securely at infrastructure deployment time."),(0,n.yg)("h2",{id:"references"},"References"),(0,n.yg)("ul",null,(0,n.yg)("li",{parentName:"ul"},(0,n.yg)("a",{parentName:"li",href:"https://www.terraform.io/docs/providers/azurerm/guides/service_principal_client_secret.html"},"Terraform Azure Service Principal")),(0,n.yg)("li",{parentName:"ul"},(0,n.yg)("a",{parentName:"li",href:"https://www.terraform.io/docs/providers/azurerm/r/kubernetes_cluster.html#ssh_key"},"Terraform Azure SSH Keys")),(0,n.yg)("li",{parentName:"ul"},(0,n.yg)("a",{parentName:"li",href:"https://secrethub.io/docs/guides/environment-variables/"},"SecretHub Environment Variables")),(0,n.yg)("li",{parentName:"ul"},(0,n.yg)("a",{parentName:"li",href:"https://github.com/ronamosa/aks-secrethub-cluster"},"Github: aks-secrethub-cluster")),(0,n.yg)("li",{parentName:"ul"},(0,n.yg)("a",{parentName:"li",href:"https://secrethub.io/blog/decouple-application-secrets-from-ci-cd-pipeline/"},"SecretHub Pipeline Post"))))}g.isMDXComponent=!0},99228:(e,r,t)=>{t.d(r,{A:()=>a});const a=t.p+"assets/images/pipeline-cover-68288ce2e3bc0b2d933f56096f15ee9e.svg"},67296:(e,r,t)=>{t.d(r,{A:()=>a});const a=t.p+"assets/images/pipeline-problem-5990ffb23f9bde1c737d4350035b9fdc.svg"}}]);