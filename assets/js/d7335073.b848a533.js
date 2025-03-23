"use strict";(self.webpackChunkronamosa_github_io=self.webpackChunkronamosa_github_io||[]).push([[78331],{15680:(e,t,n)=>{n.d(t,{xA:()=>c,yg:()=>d});var r=n(96540);function a(e,t,n){return t in e?Object.defineProperty(e,t,{value:n,enumerable:!0,configurable:!0,writable:!0}):e[t]=n,e}function o(e,t){var n=Object.keys(e);if(Object.getOwnPropertySymbols){var r=Object.getOwnPropertySymbols(e);t&&(r=r.filter((function(t){return Object.getOwnPropertyDescriptor(e,t).enumerable}))),n.push.apply(n,r)}return n}function i(e){for(var t=1;t<arguments.length;t++){var n=null!=arguments[t]?arguments[t]:{};t%2?o(Object(n),!0).forEach((function(t){a(e,t,n[t])})):Object.getOwnPropertyDescriptors?Object.defineProperties(e,Object.getOwnPropertyDescriptors(n)):o(Object(n)).forEach((function(t){Object.defineProperty(e,t,Object.getOwnPropertyDescriptor(n,t))}))}return e}function l(e,t){if(null==e)return{};var n,r,a=function(e,t){if(null==e)return{};var n,r,a={},o=Object.keys(e);for(r=0;r<o.length;r++)n=o[r],t.indexOf(n)>=0||(a[n]=e[n]);return a}(e,t);if(Object.getOwnPropertySymbols){var o=Object.getOwnPropertySymbols(e);for(r=0;r<o.length;r++)n=o[r],t.indexOf(n)>=0||Object.prototype.propertyIsEnumerable.call(e,n)&&(a[n]=e[n])}return a}var s=r.createContext({}),p=function(e){var t=r.useContext(s),n=t;return e&&(n="function"==typeof e?e(t):i(i({},t),e)),n},c=function(e){var t=p(e.components);return r.createElement(s.Provider,{value:t},e.children)},u="mdxType",m={inlineCode:"code",wrapper:function(e){var t=e.children;return r.createElement(r.Fragment,{},t)}},y=r.forwardRef((function(e,t){var n=e.components,a=e.mdxType,o=e.originalType,s=e.parentName,c=l(e,["components","mdxType","originalType","parentName"]),u=p(n),y=a,d=u["".concat(s,".").concat(y)]||u[y]||m[y]||o;return n?r.createElement(d,i(i({ref:t},c),{},{components:n})):r.createElement(d,i({ref:t},c))}));function d(e,t){var n=arguments,a=t&&t.mdxType;if("string"==typeof e||a){var o=n.length,i=new Array(o);i[0]=y;var l={};for(var s in t)hasOwnProperty.call(t,s)&&(l[s]=t[s]);l.originalType=e,l[u]="string"==typeof e?e:a,i[1]=l;for(var p=2;p<o;p++)i[p]=n[p];return r.createElement.apply(null,i)}return r.createElement.apply(null,n)}y.displayName="MDXCreateElement"},98830:(e,t,n)=>{n.r(t),n.d(t,{assets:()=>s,contentTitle:()=>i,default:()=>m,frontMatter:()=>o,metadata:()=>l,toc:()=>p});var r=n(58168),a=(n(96540),n(15680));const o={title:"Mutual TLS (mTLS)"},i=void 0,l={unversionedId:"study/CKS/Microservice Vulnerability/VulnerableMTLS",id:"study/CKS/Microservice Vulnerability/VulnerableMTLS",title:"Mutual TLS (mTLS)",description:"mTLS / pod to pod",source:"@site/docs/study/CKS/4. Microservice Vulnerability/VulnerableMTLS.md",sourceDirName:"study/CKS/4. Microservice Vulnerability",slug:"/study/CKS/Microservice Vulnerability/VulnerableMTLS",permalink:"/docs/study/CKS/Microservice Vulnerability/VulnerableMTLS",draft:!1,editUrl:"https://github.com/ronamosa/ronamosa.github.io/edit/main/website/docs/study/CKS/4. Microservice Vulnerability/VulnerableMTLS.md",tags:[],version:"current",frontMatter:{title:"Mutual TLS (mTLS)"},sidebar:"docsSidebar",previous:{title:"Container Runtime Sandboxes",permalink:"/docs/study/CKS/Microservice Vulnerability/VulnerableContainerRuntime"},next:{title:"OS Level Security Domains",permalink:"/docs/study/CKS/Microservice Vulnerability/VulnerableOSLevelSecurity"}},s={},p=[{value:"mTLS / pod to pod",id:"mtls--pod-to-pod",level:2},{value:"Service Meshes",id:"service-meshes",level:2},{value:"Scenarios - create a proxy sidecar",id:"scenarios---create-a-proxy-sidecar",level:2}],c={toc:p},u="wrapper";function m(e){let{components:t,...n}=e;return(0,a.yg)(u,(0,r.A)({},c,n,{components:t,mdxType:"MDXLayout"}),(0,a.yg)("h2",{id:"mtls--pod-to-pod"},"mTLS / pod to pod"),(0,a.yg)("ul",null,(0,a.yg)("li",{parentName:"ul"},"mutual auth"),(0,a.yg)("li",{parentName:"ul"},"bilateral auth"),(0,a.yg)("li",{parentName:"ul"},"both apps have client+server certs each")),(0,a.yg)("p",null,"by default every pod to every pod can talk, unencrypted"),(0,a.yg)("h2",{id:"service-meshes"},"Service Meshes"),(0,a.yg)("ul",null,(0,a.yg)("li",{parentName:"ul"},"manage all the certs between pods"),(0,a.yg)("li",{parentName:"ul"},"decouple our app container from the auth/cert workload"),(0,a.yg)("li",{parentName:"ul"},'these sidecars make up the "mesh" e.g. istio, linkerd'),(0,a.yg)("li",{parentName:"ul"},"all traffic routes through proxy/sidecar")),(0,a.yg)("p",null,"these routes are created via ",(0,a.yg)("inlineCode",{parentName:"p"},"iptable")," rules in e.g. an init container (needs ",(0,a.yg)("inlineCode",{parentName:"p"},"NET_ADMIN")," cap), and only when init's are done, does the app container start up e.g. this is how Istio does it."),(0,a.yg)("h2",{id:"scenarios---create-a-proxy-sidecar"},"Scenarios - create a proxy sidecar"),(0,a.yg)("p",null,(0,a.yg)("inlineCode",{parentName:"p"},"root@cks-master:~# k run app --image=bash --command -oyaml --dry-run=client > app.yaml -- sh -c 'ping google.com'")),(0,a.yg)("pre",null,(0,a.yg)("code",{parentName:"pre",className:"language-yaml"},"# app.yaml\napiVersion: v1\nkind: Pod\nmetadata:\n  creationTimestamp: null\n  labels:\n    run: app\n  name: app\nspec:\n  containers:\n  - command:\n    - sh\n    - -c\n    - ping google.com\n    image: bash\n    name: app\n    resources: {}\n  dnsPolicy: ClusterFirst\n  restartPolicy: Always\nstatus: {}\n")),(0,a.yg)("p",null,"run it"),(0,a.yg)("pre",null,(0,a.yg)("code",{parentName:"pre",className:"language-bash"},'root@cks-master:~# k create -f ./app.yaml \npod/app created\nroot@cks-master:~# k logs -f app\nError from server (BadRequest): container "app" in pod "app" is waiting to start: ContainerCreating\nroot@cks-master:~# k logs -f app\nPING google.com (172.217.167.110): 56 data bytes\n64 bytes from 172.217.167.110: seq=0 ttl=121 time=1.310 ms\n64 bytes from 172.217.167.110: seq=1 ttl=121 time=1.261 ms\n64 bytes from 172.217.167.110: seq=2 ttl=121 time=1.403 ms\n64 bytes from 172.217.167.110: seq=3 ttl=121 time=1.171 ms\n64 bytes from 172.217.167.110: seq=4 ttl=121 time=1.254 ms\n64 bytes from 172.217.167.110: seq=5 ttl=121 time=1.237 ms\n64 bytes from 172.217.167.110: seq=6 ttl=121 time=1.475 ms\n')),(0,a.yg)("p",null,'add a "sidecar proxy" into our Pod manifest-- hacky solution of installing iptables into the sidecar on the go.'),(0,a.yg)("p",null,"note your proxy container will need extra permissions to run ",(0,a.yg)("inlineCode",{parentName:"p"},"iptables")," commands i.e. ",(0,a.yg)("inlineCode",{parentName:"p"},"NET_ADMIN")," by using ",(0,a.yg)("inlineCode",{parentName:"p"},"securityContext")),(0,a.yg)("pre",null,(0,a.yg)("code",{parentName:"pre",className:"language-yaml"},"apiVersion: v1\nkind: Pod\nmetadata:\n  creationTimestamp: null\n  labels:\n    run: app\n  name: app\nspec:\n  containers:\n  - command:\n    - sh\n    - -c\n    - ping google.com\n    image: bash\n    name: app\n    resources: {}\n  - command:\n    - sh\n    - -c\n    - 'apt-get update && apt-get install -y iptables && iptables -L && sleep 1d'\n    securityContext:\n      capabilities:\n        add: [\"NET_ADMIN\"]\n    image: ubuntu\n    name: proxy\n    resources: {}\n  dnsPolicy: ClusterFirst\n  restartPolicy: Always\nstatus: {}\n")),(0,a.yg)("p",null,"to date no mTLS or service mesh in the exam at the moment."))}m.isMDXComponent=!0}}]);