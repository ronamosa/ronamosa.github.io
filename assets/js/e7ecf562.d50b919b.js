"use strict";(self.webpackChunkronamosa_github_io=self.webpackChunkronamosa_github_io||[]).push([[90856],{15680:(e,t,n)=>{n.d(t,{xA:()=>l,yg:()=>y});var a=n(96540);function r(e,t,n){return t in e?Object.defineProperty(e,t,{value:n,enumerable:!0,configurable:!0,writable:!0}):e[t]=n,e}function o(e,t){var n=Object.keys(e);if(Object.getOwnPropertySymbols){var a=Object.getOwnPropertySymbols(e);t&&(a=a.filter((function(t){return Object.getOwnPropertyDescriptor(e,t).enumerable}))),n.push.apply(n,a)}return n}function i(e){for(var t=1;t<arguments.length;t++){var n=null!=arguments[t]?arguments[t]:{};t%2?o(Object(n),!0).forEach((function(t){r(e,t,n[t])})):Object.getOwnPropertyDescriptors?Object.defineProperties(e,Object.getOwnPropertyDescriptors(n)):o(Object(n)).forEach((function(t){Object.defineProperty(e,t,Object.getOwnPropertyDescriptor(n,t))}))}return e}function s(e,t){if(null==e)return{};var n,a,r=function(e,t){if(null==e)return{};var n,a,r={},o=Object.keys(e);for(a=0;a<o.length;a++)n=o[a],t.indexOf(n)>=0||(r[n]=e[n]);return r}(e,t);if(Object.getOwnPropertySymbols){var o=Object.getOwnPropertySymbols(e);for(a=0;a<o.length;a++)n=o[a],t.indexOf(n)>=0||Object.prototype.propertyIsEnumerable.call(e,n)&&(r[n]=e[n])}return r}var u=a.createContext({}),c=function(e){var t=a.useContext(u),n=t;return e&&(n="function"==typeof e?e(t):i(i({},t),e)),n},l=function(e){var t=c(e.components);return a.createElement(u.Provider,{value:t},e.children)},p="mdxType",d={inlineCode:"code",wrapper:function(e){var t=e.children;return a.createElement(a.Fragment,{},t)}},m=a.forwardRef((function(e,t){var n=e.components,r=e.mdxType,o=e.originalType,u=e.parentName,l=s(e,["components","mdxType","originalType","parentName"]),p=c(n),m=r,y=p["".concat(u,".").concat(m)]||p[m]||d[m]||o;return n?a.createElement(y,i(i({ref:t},l),{},{components:n})):a.createElement(y,i({ref:t},l))}));function y(e,t){var n=arguments,r=t&&t.mdxType;if("string"==typeof e||r){var o=n.length,i=new Array(o);i[0]=m;var s={};for(var u in t)hasOwnProperty.call(t,u)&&(s[u]=t[u]);s.originalType=e,s[p]="string"==typeof e?e:r,i[1]=s;for(var c=2;c<o;c++)i[c]=n[c];return a.createElement.apply(null,i)}return a.createElement.apply(null,n)}m.displayName="MDXCreateElement"},29040:(e,t,n)=>{n.r(t),n.d(t,{assets:()=>u,contentTitle:()=>i,default:()=>d,frontMatter:()=>o,metadata:()=>s,toc:()=>c});var a=n(58168),r=(n(96540),n(15680));const o={title:"Domain 1 - Incident Response"},i=void 0,s={unversionedId:"study/SCS-C01/D1-IncidentResponse",id:"study/SCS-C01/D1-IncidentResponse",title:"Domain 1 - Incident Response",description:"This is an export from my Remnote with flashcard syntax included.",source:"@site/docs/study/SCS-C01/D1-IncidentResponse.md",sourceDirName:"study/SCS-C01",slug:"/study/SCS-C01/D1-IncidentResponse",permalink:"/docs/study/SCS-C01/D1-IncidentResponse",draft:!1,editUrl:"https://github.com/ronamosa/ronamosa.github.io/edit/main/website/docs/study/SCS-C01/D1-IncidentResponse.md",tags:[],version:"current",frontMatter:{title:"Domain 1 - Incident Response"},sidebar:"docsSidebar",previous:{title:"AWS Certified Security \u2013 Specialty (SCS-C01)",permalink:"/docs/study/SCS-C01/"},next:{title:"Domain 2 - Logging and Monitoring",permalink:"/docs/study/SCS-C01/D2-LoggingMonitoring"}},u={},c=[],l={toc:c},p="wrapper";function d(e){let{components:t,...n}=e;return(0,r.yg)(p,(0,a.A)({},l,n,{components:t,mdxType:"MDXLayout"}),(0,r.yg)("admonition",{type:"info"},(0,r.yg)("p",{parentName:"admonition"},"This is an export from my Remnote with flashcard syntax included.")),(0,r.yg)("ul",null,(0,r.yg)("li",{parentName:"ul"},"Incident Response",(0,r.yg)("ul",{parentName:"li"},(0,r.yg)("li",{parentName:"ul"},"What service should you use to  ",(0,r.yg)("strong",{parentName:"li"},'"automatically detect suspicious activities such as SSH brute force attacks or compromised EC2 instances that serve malware."')," ?\u2192Amazon GuardDuty"),(0,r.yg)("li",{parentName:"ul"},"to investigate unauthorised access to EC2 instances where you have VPC flow logs, what security service aggregates data, summaries and analyses possible extent of security issues?\u2192Amazon Detective."),(0,r.yg)("li",{parentName:"ul"},"If you get an AWS Abuse notice with list of specific offending EC2 what THREE things should you do with the instances?\u2193 \u2193",(0,r.yg)("ul",{parentName:"li"},(0,r.yg)("li",{parentName:"ul"},"deregister from ALB"),(0,r.yg)("li",{parentName:"ul"},"detach from ASG"),(0,r.yg)("li",{parentName:"ul"},"capture metadata"))),(0,r.yg)("li",{parentName:"ul"},'What service "uses machine learning to automatically discover, classify, and protect sensitive data stored in Amazon S3."?\u2192Amazon Macie.'),(0,r.yg)("li",{parentName:"ul"},"how would you setup an alert for too many unauthorised API requests using CloudTrail? \u2193",(0,r.yg)("ul",{parentName:"li"},(0,r.yg)("li",{parentName:"ul"},"enable CloudTrail on AWS account"),(0,r.yg)("li",{parentName:"ul"},"setup CloudWatch Metric & Alarm on API error code"),(0,r.yg)("li",{parentName:"ul"},"setup SNS to notify me."))),(0,r.yg)("li",{parentName:"ul"},"What service  ",(0,r.yg)("strong",{parentName:"li"},'"continuously monitors for malicious activity and unauthorized behavior to protect your AWS accounts and workloads."')," \u2192Amazon GuardDuty."),(0,r.yg)("li",{parentName:"ul"},"how do you stop Amazon GuardDuty from alarming on approved EC2 instances from CloudWatch alerts?\u2192attach elastic IPs to EC2, add addresses to Trusted IP list in Amazon GuardDuty."),(0,r.yg)("li",{parentName:"ul"},"If EC2 and SQS are involved and an IAM change impacts it, what should you check? \u2193",(0,r.yg)("ul",{parentName:"li"},(0,r.yg)("li",{parentName:"ul"},"SQS Policy for explicit DENY to the EC2 Instance IAM Role"),(0,r.yg)("li",{parentName:"ul"},"EC2 Instance IAM Role has permissions for SQS"))),(0,r.yg)("li",{parentName:"ul"},'Amazon Inspector is for "a{{utomated}} security {{assessment}}" whereas Amazon GuardDuty is for "threat {{detection}}".'),(0,r.yg)("li",{parentName:"ul"},'Any time you see threats such as "unauthorised access" and "suspicious access patterns" think "Amazon {{GuardDuty}}".')))))}d.isMDXComponent=!0}}]);