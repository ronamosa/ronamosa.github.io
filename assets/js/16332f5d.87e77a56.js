"use strict";(self.webpackChunkronamosa_github_io=self.webpackChunkronamosa_github_io||[]).push([[2207],{15680:(e,n,r)=>{r.d(n,{xA:()=>p,yg:()=>y});var a=r(96540);function t(e,n,r){return n in e?Object.defineProperty(e,n,{value:r,enumerable:!0,configurable:!0,writable:!0}):e[n]=r,e}function l(e,n){var r=Object.keys(e);if(Object.getOwnPropertySymbols){var a=Object.getOwnPropertySymbols(e);n&&(a=a.filter((function(n){return Object.getOwnPropertyDescriptor(e,n).enumerable}))),r.push.apply(r,a)}return r}function o(e){for(var n=1;n<arguments.length;n++){var r=null!=arguments[n]?arguments[n]:{};n%2?l(Object(r),!0).forEach((function(n){t(e,n,r[n])})):Object.getOwnPropertyDescriptors?Object.defineProperties(e,Object.getOwnPropertyDescriptors(r)):l(Object(r)).forEach((function(n){Object.defineProperty(e,n,Object.getOwnPropertyDescriptor(r,n))}))}return e}function i(e,n){if(null==e)return{};var r,a,t=function(e,n){if(null==e)return{};var r,a,t={},l=Object.keys(e);for(a=0;a<l.length;a++)r=l[a],n.indexOf(r)>=0||(t[r]=e[r]);return t}(e,n);if(Object.getOwnPropertySymbols){var l=Object.getOwnPropertySymbols(e);for(a=0;a<l.length;a++)r=l[a],n.indexOf(r)>=0||Object.prototype.propertyIsEnumerable.call(e,r)&&(t[r]=e[r])}return t}var s=a.createContext({}),u=function(e){var n=a.useContext(s),r=n;return e&&(r="function"==typeof e?e(n):o(o({},n),e)),r},p=function(e){var n=u(e.components);return a.createElement(s.Provider,{value:n},e.children)},g="mdxType",c={inlineCode:"code",wrapper:function(e){var n=e.children;return a.createElement(a.Fragment,{},n)}},d=a.forwardRef((function(e,n){var r=e.components,t=e.mdxType,l=e.originalType,s=e.parentName,p=i(e,["components","mdxType","originalType","parentName"]),g=u(r),d=t,y=g["".concat(s,".").concat(d)]||g[d]||c[d]||l;return r?a.createElement(y,o(o({ref:n},p),{},{components:r})):a.createElement(y,o({ref:n},p))}));function y(e,n){var r=arguments,t=n&&n.mdxType;if("string"==typeof e||t){var l=r.length,o=new Array(l);o[0]=d;var i={};for(var s in n)hasOwnProperty.call(n,s)&&(i[s]=n[s]);i.originalType=e,i[g]="string"==typeof e?e:t,o[1]=i;for(var u=2;u<l;u++)o[u]=r[u];return a.createElement.apply(null,o)}return a.createElement.apply(null,r)}d.displayName="MDXCreateElement"},49995:(e,n,r)=>{r.r(n),r.d(n,{assets:()=>s,contentTitle:()=>o,default:()=>c,frontMatter:()=>l,metadata:()=>i,toc:()=>u});var a=r(58168),t=(r(96540),r(15680));const l={title:"AKS Cluster Part.3"},o=void 0,i={unversionedId:"engineer/Azure/2019-02-04-Azure-Kubernetes-up-and-running-3",id:"engineer/Azure/2019-02-04-Azure-Kubernetes-up-and-running-3",title:"AKS Cluster Part.3",description:"Published Date: 04-FEB-2019",source:"@site/docs/engineer/Azure/2019-02-04-Azure-Kubernetes-up-and-running-3.md",sourceDirName:"engineer/Azure",slug:"/engineer/Azure/2019-02-04-Azure-Kubernetes-up-and-running-3",permalink:"/docs/engineer/Azure/2019-02-04-Azure-Kubernetes-up-and-running-3",draft:!1,editUrl:"https://github.com/ronamosa/ronamosa.github.io/edit/main/website/docs/engineer/Azure/2019-02-04-Azure-Kubernetes-up-and-running-3.md",tags:[],version:"current",frontMatter:{title:"AKS Cluster Part.3"},sidebar:"docsSidebar",previous:{title:"AKS Cluster Part.2",permalink:"/docs/engineer/Azure/2019-02-04-Azure-Kubernetes-up-and-running-2"},next:{title:"Azure Blob Storage: Break Lease",permalink:"/docs/engineer/Azure/2019-02-12-Azure-Terraform-Lease-Break"}},s={},u=[{value:"Series Overview",id:"series-overview",level:2},{value:"Pre-requisites tools",id:"pre-requisites-tools",level:2},{value:"(new) AKS cluster deployed",id:"new-aks-cluster-deployed",level:2},{value:"(new) Azure Container Registry",id:"new-azure-container-registry",level:2},{value:"K8s Deployment",id:"k8s-deployment",level:2},{value:"kubectl: deploy",id:"kubectl-deploy",level:3},{value:"kubectl: check deployment",id:"kubectl-check-deployment",level:3},{value:"kubectl: check pods",id:"kubectl-check-pods",level:3},{value:"K8s Service",id:"k8s-service",level:2},{value:"Delete deployment",id:"delete-deployment",level:2},{value:"Deploy NGINX yaml",id:"deploy-nginx-yaml",level:2},{value:"nginx.yaml",id:"nginxyaml",level:3},{value:"use our own azurecr.io (container registry)",id:"use-our-own-azurecrio-container-registry",level:3},{value:"prepare our image",id:"prepare-our-image",level:4},{value:"deploy nginx.yaml",id:"deploy-nginxyaml",level:3},{value:"port-forward (cheating)",id:"port-forward-cheating",level:3},{value:"References",id:"references",level:2}],p={toc:u},g="wrapper";function c(e){let{components:n,...l}=e;return(0,t.yg)(g,(0,a.A)({},p,l,{components:n,mdxType:"MDXLayout"}),(0,t.yg)("admonition",{type:"info"},(0,t.yg)("p",{parentName:"admonition"},"Published Date: 04-FEB-2019")),(0,t.yg)("p",null,"In ",(0,t.yg)("a",{parentName:"p",href:"2019-02-04-Azure-Kubernetes-up-and-running-2"},"Part 2"),", we setup a private Azure Container Register using azure-cli and terraform."),(0,t.yg)("p",null,'For the 3rd and final instalment of this "Look Ma, I\'m playing with Azure!", we will deploy an application to our AKS cluster using ',(0,t.yg)("inlineCode",{parentName:"p"},"kubectl")),(0,t.yg)("h2",{id:"series-overview"},"Series Overview"),(0,t.yg)("ul",null,(0,t.yg)("li",{parentName:"ul"},"Part 1 - get Kubernetes cluster up and running on Azure Kubernetes Managed Service (AKS)"),(0,t.yg)("li",{parentName:"ul"},"Part 2 - create a private Docker Registry in the cloud using Azure's Container Registry Managed service (ACR)"),(0,t.yg)("li",{parentName:"ul"},(0,t.yg)("strong",{parentName:"li"},"Part 3 - deploy a simple application to AKS."))),(0,t.yg)("h2",{id:"pre-requisites-tools"},"Pre-requisites tools"),(0,t.yg)("p",null,"Get these installed if you haven't already:"),(0,t.yg)("ol",null,(0,t.yg)("li",{parentName:"ol"},"Azure ",(0,t.yg)("a",{parentName:"li",href:"https://portal.azure.com"},"portal account")),(0,t.yg)("li",{parentName:"ol"},"Azure ",(0,t.yg)("a",{parentName:"li",href:"https://docs.microsoft.com/en-us/cli/azure/install-azure-cli-apt?view=azure-cli-latest"},"az-cli")," (command line interface)"),(0,t.yg)("li",{parentName:"ol"},"Terraform ",(0,t.yg)("a",{parentName:"li",href:"https://learn.hashicorp.com/terraform/getting-started/install.html"},"installed")," (zipped binary, copy to ~/bin)"),(0,t.yg)("li",{parentName:"ol"},"Kubectl ",(0,t.yg)("a",{parentName:"li",href:"https://kubernetes.io/docs/tasks/tools/install-kubectl/"},"installed"))),(0,t.yg)("p",null,"Right, quick run through the new ACR setup so that the rest of the code below is relevant to that:"),(0,t.yg)("h2",{id:"new-aks-cluster-deployed"},"(new) AKS cluster deployed"),(0,t.yg)("admonition",{type:"info"},(0,t.yg)("p",{parentName:"admonition"},"I have updated ",(0,t.yg)("a",{parentName:"p",href:"2019-01-28-Azure-Kubernetes-up-and-running-1"},"Part 1")," so if you've followed that you should be up to speed at this point.")),(0,t.yg)("admonition",{type:"danger"},(0,t.yg)("p",{parentName:"admonition"},"Make sure you have your kubeconfig file handy for the 'helm' section!")),(0,t.yg)("p",null,"run this to get your kubeconfig: ",(0,t.yg)("inlineCode",{parentName:"p"},"$ az aks get-credentials --resource-group AKS-CLOUDRESOURCES --name AKS-cloudbuilderio")),(0,t.yg)("h2",{id:"new-azure-container-registry"},"(new) Azure Container Registry"),(0,t.yg)("blockquote",null,(0,t.yg)("p",{parentName:"blockquote"},(0,t.yg)("a",{parentName:"p",href:"2019-02-04-Azure-Kubernetes-up-and-running-2"},"Part 2")," has also been updated, so hopefully you have a running AKS cluster AND a working Azure Container Registry now!")),(0,t.yg)("p",null,"Right. We are ready to deploy something to our AKS cluster!"),(0,t.yg)("h2",{id:"k8s-deployment"},"K8s Deployment"),(0,t.yg)("p",null,"This file basically uses 'kubectl' to deploy whatever we specify in here, as \"pods\" in our cluster (note ",(0,t.yg)("inlineCode",{parentName:"p"},"kubectl")," by default will point to whatever you have in ",(0,t.yg)("inlineCode",{parentName:"p"},"~/.kube/config"),")"),(0,t.yg)("pre",null,(0,t.yg)("code",{parentName:"pre",className:"language-yaml",metastring:'title="deployment.yaml"',title:'"deployment.yaml"'},"apiVersion: apps/v1\nkind: Deployment\nmetadata:\n  name: nginx\nspec:\n  selector:\n    matchLabels:\n      app: nginx\n  replicas: 2\n  template:\n    metadata:\n      labels:\n        app: nginx\n    spec:\n      containers:\n      - name: nginx\n        image: nginx:1.8\n        ports:\n        - containerPort: 80\n")),(0,t.yg)("h3",{id:"kubectl-deploy"},"kubectl: deploy"),(0,t.yg)("pre",null,(0,t.yg)("code",{parentName:"pre",className:"language-bash"},"$ kubectl apply -f ./deployment.yaml\ndeployment.apps/nginx created\n")),(0,t.yg)("h3",{id:"kubectl-check-deployment"},"kubectl: check deployment"),(0,t.yg)("pre",null,(0,t.yg)("code",{parentName:"pre",className:"language-bash"},"$ kubectl get deploy\nNAME    DESIRED   CURRENT   UP-TO-DATE   AVAILABLE   AGE\nnginx   2         2         2            2           81s\n")),(0,t.yg)("h3",{id:"kubectl-check-pods"},"kubectl: check pods"),(0,t.yg)("pre",null,(0,t.yg)("code",{parentName:"pre",className:"language-bash"},"$ kubectl get pods -lapp=nginx -o wide\nNAME                     READY   STATUS    RESTARTS   AGE     IP           NODE                   NOMINATED NODE\nnginx-5cd6d46846-cr5m7   1/1     Running   0          6m10s   10.244.0.9   aks-nodes-28201024-2   <none>\nnginx-5cd6d46846-ntszh   1/1     Running   0          6m10s   10.244.2.3   aks-nodes-28201024-1   <none>\n")),(0,t.yg)("h2",{id:"k8s-service"},"K8s Service"),(0,t.yg)("p",null,"Again, like the deployment this is just a basic \"service\" component to be deployed. A Service is an abstraction that defines a set of pods somewhere on your cluster that all do the same thing.\nIf a node dies and takes all the pods with it, as long as there was a 'Service' configured for the functionality of those pods, the new pods that come up with new IP addresses will be known to the Service."),(0,t.yg)("pre",null,(0,t.yg)("code",{parentName:"pre",className:"language-bash"},"$ kubectl apply -f service.yaml\nservice/nginx created\n")),(0,t.yg)("p",null,"check our service is up & running"),(0,t.yg)("pre",null,(0,t.yg)("code",{parentName:"pre",className:"language-bash"},"$ kubectl get svc nginx\nNAME    TYPE        CLUSTER-IP     EXTERNAL-IP   PORT(S)   AGE\nnginx   ClusterIP   10.0.154.171   <none>        80/TCP    24s\n")),(0,t.yg)("h2",{id:"delete-deployment"},"Delete deployment"),(0,t.yg)("pre",null,(0,t.yg)("code",{parentName:"pre",className:"language-bash"},'$ kubectl delete deploy nginx\ndeployment.extensions "nginx" deleted\n')),(0,t.yg)("h2",{id:"deploy-nginx-yaml"},"Deploy NGINX yaml"),(0,t.yg)("p",null,"Okay, you get the idea pretty much you can ",(0,t.yg)("inlineCode",{parentName:"p"},"kubectl")," 'apply' yaml files of deployments and services to your AKS cluster as easy as that."),(0,t.yg)("p",null,"So for our grand finale, we will do an nginx deploy we can actually get to from the internet."),(0,t.yg)("h3",{id:"nginxyaml"},"nginx.yaml"),(0,t.yg)("pre",null,(0,t.yg)("code",{parentName:"pre",className:"language-yaml"},"apiVersion: v1\nkind: Service\nmetadata:\n  name: nginx\n  labels:\n    run: nginx\nspec:\n  type: NodePort\n  ports:\n  - port: 8080\n    targetPort: 80\n    protocol: TCP\n  selector:\n    run: nginx\n---\napiVersion: apps/v1\nkind: Deployment\nmetadata:\n  name: nginx\nspec:\n  selector:\n    matchLabels:\n      run: nginx\n  replicas: 2\n  template:\n    metadata:\n      labels:\n        app: nginx\n    spec:\n      containers:\n      - name: nginx\n        image: registercloudbuilderio.azurecr.io/nginx:1.8\n        ports:\n        - containerPort: 80\n")),(0,t.yg)("h3",{id:"use-our-own-azurecrio-container-registry"},"use our own azurecr.io (container registry)"),(0,t.yg)("p",null,"let's pull the image from our own ACR instead"),(0,t.yg)("h4",{id:"prepare-our-image"},"prepare our image"),(0,t.yg)("p",null,"pull from docker hub."),(0,t.yg)("pre",null,(0,t.yg)("code",{parentName:"pre",className:"language-bash"},"$ docker pull nginx:1.8\n1.8: Pulling from library/nginx\nefd26ecc9548: Pull complete\na3ed95caeb02: Pull complete\n24941909ea54: Pull complete\n7e605cb95896: Pull complete\nDigest: sha256:c97ee70c4048fe79765f7c2ec0931957c2898f47400128f4f3640d0ae5d60d10\nStatus: Downloaded newer image for nginx:1.8\n")),(0,t.yg)("p",null,"re-tag"),(0,t.yg)("pre",null,(0,t.yg)("code",{parentName:"pre",className:"language-bash"},"docker tag nginx:1.8 registercloudbuilderio.azurecr.io/nginx:1.8\n")),(0,t.yg)("p",null,"push to our ACR."),(0,t.yg)("pre",null,(0,t.yg)("code",{parentName:"pre",className:"language-bash"},"$ docker push registercloudbuilderio.azurecr.io/nginx:1.8\nThe push refers to repository [registercloudbuilderio.azurecr.io/nginx]\n5f70bf18a086: Pushed\n62fd1c28b3bf: Pushed\n6d700a2d8883: Pushed\nc12ecfd4861d: Pushed\n1.8: digest: sha256:746419199c9569216937fc59604805b7ac0f52b438bb5ca4ec6b7f990873b198 size: 1977\n")),(0,t.yg)("h3",{id:"deploy-nginxyaml"},"deploy nginx.yaml"),(0,t.yg)("pre",null,(0,t.yg)("code",{parentName:"pre",className:"language-bash"},"$ kubectl apply -f ./nginx.yaml\nservice/nginx created\ndeployment.apps/nginx created\n")),(0,t.yg)("p",null,"do a ",(0,t.yg)("inlineCode",{parentName:"p"},"describe")," on the pods to verify it pulled the image we pushed to ACR"),(0,t.yg)("pre",null,(0,t.yg)("code",{parentName:"pre",className:"language-bash"},'$ kubectl describe pods nginx-66867b8df4-kzbd2\n...\nEvents:\n  Type    Reason     Age   From                           Message\n  ----    ------     ----  ----                           -------\n  Normal  Scheduled  28s   default-scheduler              Successfully assigned default/nginx-66867b8df4-kzbd2 to aks-nodes-28201024-0\n  Normal  Pulling    26s   kubelet, aks-nodes-28201024-0  pulling image "registercloudbuilderio.azurecr.io/nginx:1.8"\n  Normal  Pulled     10s   kubelet, aks-nodes-28201024-0  Successfully pulled image "registercloudbuilderio.azurecr.io/nginx:1.8"\n  Normal  Created    10s   kubelet, aks-nodes-28201024-0  Created container\n  Normal  Started    9s    kubelet, aks-nodes-28201024-0  Started container\n')),(0,t.yg)("p",null,"looks good!"),(0,t.yg)("h3",{id:"port-forward-cheating"},"port-forward (cheating)"),(0,t.yg)("p",null,"A quick way to check the app (nginx) is serving correctly is to port-forward a local port to the AKS cluster and into the nginx pods."),(0,t.yg)("admonition",{type:"info"},(0,t.yg)("p",{parentName:"admonition"},"Here is how I had to do it because I run my ",(0,t.yg)("inlineCode",{parentName:"p"},"kubectl")," from a linux vm, so I serve the port-forward on that vm and connect to it from this (windows) PC.")),(0,t.yg)("pre",null,(0,t.yg)("code",{parentName:"pre",className:"language-bash"},"kubectl port-forward --address 0.0.0.0 deployment/nginx 8080:80\n")),(0,t.yg)("p",null,"what this does"),(0,t.yg)("ul",null,(0,t.yg)("li",{parentName:"ul"},"forwards traffic to the ",(0,t.yg)("inlineCode",{parentName:"li"},"nginx")," deployment"),(0,t.yg)("li",{parentName:"ul"},"serves it locally via ",(0,t.yg)("inlineCode",{parentName:"li"},"0.0.0.0")," (made available via a 192.x.x.x local ip)"),(0,t.yg)("li",{parentName:"ul"},"serves locally on port ",(0,t.yg)("inlineCode",{parentName:"li"},"8080")," and forwards through to port ",(0,t.yg)("inlineCode",{parentName:"li"},"80")," on the nginx deployment.")),(0,t.yg)("p",null,"tada!"),(0,t.yg)("p",null,(0,t.yg)("img",{alt:"port-forward success",src:r(33707).A,width:"720",height:"376"})),(0,t.yg)("p",null,"Thanks for following along and if you see anything that needs updating/correcting etc. please feel free to let me know!"),(0,t.yg)("h2",{id:"references"},"References"),(0,t.yg)("ul",null,(0,t.yg)("li",{parentName:"ul"},(0,t.yg)("p",{parentName:"li"},(0,t.yg)("a",{parentName:"p",href:"https://kubernetes.io/docs/tasks/run-application/run-stateless-application-deployment/#creating-and-exploring-an-nginx-deployment"},"K8s Nginx Deployment"))),(0,t.yg)("li",{parentName:"ul"},(0,t.yg)("p",{parentName:"li"},(0,t.yg)("a",{parentName:"p",href:"https://docs.microsoft.com/en-us/azure/aks/ingress-tls"},"HTTPS ingress for AKS")," ",(0,t.yg)("em",{parentName:"p"},"(Ive just got this here for future refernce when I want to come back and do this properly.)")))))}c.isMDXComponent=!0},33707:(e,n,r)=>{r.d(n,{A:()=>a});const a=r.p+"assets/images/azure-aks-portfoward-0b32bd78f20621c134e7949743b510f1.png"}}]);