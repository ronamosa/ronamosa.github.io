"use strict";(self.webpackChunkronamosa_github_io=self.webpackChunkronamosa_github_io||[]).push([[23753],{15680:(e,a,t)=>{t.d(a,{xA:()=>u,yg:()=>y});var r=t(96540);function n(e,a,t){return a in e?Object.defineProperty(e,a,{value:t,enumerable:!0,configurable:!0,writable:!0}):e[a]=t,e}function i(e,a){var t=Object.keys(e);if(Object.getOwnPropertySymbols){var r=Object.getOwnPropertySymbols(e);a&&(r=r.filter((function(a){return Object.getOwnPropertyDescriptor(e,a).enumerable}))),t.push.apply(t,r)}return t}function l(e){for(var a=1;a<arguments.length;a++){var t=null!=arguments[a]?arguments[a]:{};a%2?i(Object(t),!0).forEach((function(a){n(e,a,t[a])})):Object.getOwnPropertyDescriptors?Object.defineProperties(e,Object.getOwnPropertyDescriptors(t)):i(Object(t)).forEach((function(a){Object.defineProperty(e,a,Object.getOwnPropertyDescriptor(t,a))}))}return e}function o(e,a){if(null==e)return{};var t,r,n=function(e,a){if(null==e)return{};var t,r,n={},i=Object.keys(e);for(r=0;r<i.length;r++)t=i[r],a.indexOf(t)>=0||(n[t]=e[t]);return n}(e,a);if(Object.getOwnPropertySymbols){var i=Object.getOwnPropertySymbols(e);for(r=0;r<i.length;r++)t=i[r],a.indexOf(t)>=0||Object.prototype.propertyIsEnumerable.call(e,t)&&(n[t]=e[t])}return n}var s=r.createContext({}),p=function(e){var a=r.useContext(s),t=a;return e&&(t="function"==typeof e?e(a):l(l({},a),e)),t},u=function(e){var a=p(e.components);return r.createElement(s.Provider,{value:a},e.children)},m="mdxType",c={inlineCode:"code",wrapper:function(e){var a=e.children;return r.createElement(r.Fragment,{},a)}},g=r.forwardRef((function(e,a){var t=e.components,n=e.mdxType,i=e.originalType,s=e.parentName,u=o(e,["components","mdxType","originalType","parentName"]),m=p(t),g=n,y=m["".concat(s,".").concat(g)]||m[g]||c[g]||i;return t?r.createElement(y,l(l({ref:a},u),{},{components:t})):r.createElement(y,l({ref:a},u))}));function y(e,a){var t=arguments,n=a&&a.mdxType;if("string"==typeof e||n){var i=t.length,l=new Array(i);l[0]=g;var o={};for(var s in a)hasOwnProperty.call(a,s)&&(o[s]=a[s]);o.originalType=e,o[m]="string"==typeof e?e:n,l[1]=o;for(var p=2;p<i;p++)l[p]=t[p];return r.createElement.apply(null,l)}return r.createElement.apply(null,t)}g.displayName="MDXCreateElement"},99345:(e,a,t)=>{t.r(a),t.d(a,{assets:()=>s,contentTitle:()=>l,default:()=>c,frontMatter:()=>i,metadata:()=>o,toc:()=>p});var r=t(58168),n=(t(96540),t(15680));const i={title:"EC2 Associate Level"},l=void 0,o={unversionedId:"study/SAA-03/EC2-Associate-Level",id:"study/SAA-03/EC2-Associate-Level",title:"EC2 Associate Level",description:'In Stephane Marek\'s course, this chapter was calling out "associate level" EC2 details.',source:"@site/docs/study/SAA-03/06-EC2-Associate-Level.md",sourceDirName:"study/SAA-03",slug:"/study/SAA-03/EC2-Associate-Level",permalink:"/docs/study/SAA-03/EC2-Associate-Level",draft:!1,editUrl:"https://github.com/ronamosa/ronamosa.github.io/edit/main/website/docs/study/SAA-03/06-EC2-Associate-Level.md",tags:[],version:"current",sidebarPosition:6,frontMatter:{title:"EC2 Associate Level"},sidebar:"docsSidebar",previous:{title:"EC2 Fundamentals",permalink:"/docs/study/SAA-03/EC2-Fundamentals"},next:{title:"EC2 Instance Storage",permalink:"/docs/study/SAA-03/EC2-Instance-Storage"}},s={},p=[],u={toc:p},m="wrapper";function c(e){let{components:a,...t}=e;return(0,n.yg)(m,(0,r.A)({},u,t,{components:a,mdxType:"MDXLayout"}),(0,n.yg)("admonition",{type:"note"},(0,n.yg)("p",{parentName:"admonition"},'In Stephane Marek\'s course, this chapter was calling out "associate level" EC2 details.')),(0,n.yg)("admonition",{type:"info"},(0,n.yg)("p",{parentName:"admonition"},"These were the topics I created flashcards for (Remnote) and would revise them using spaced repetition. The formatting is an export from Remnote.")),(0,n.yg)("ul",null,(0,n.yg)("li",{parentName:"ul"},"Public vs Private IP",(0,n.yg)("ul",{parentName:"li"},(0,n.yg)("li",{parentName:"ul"},"Public",(0,n.yg)("ul",{parentName:"li"},(0,n.yg)("li",{parentName:"ul"},"unique in public"),(0,n.yg)("li",{parentName:"ul"},"easily moved specific geo"))),(0,n.yg)("li",{parentName:"ul"},"Private",(0,n.yg)("ul",{parentName:"li"},(0,n.yg)("li",{parentName:"ul"},"unique in private network"),(0,n.yg)("li",{parentName:"ul"},"can be same in different private networks"),(0,n.yg)("li",{parentName:"ul"},"instances need NAT + IG to reach public internet"))))),(0,n.yg)("li",{parentName:"ul"},"Elastic IP",(0,n.yg)("ul",{parentName:"li"},(0,n.yg)("li",{parentName:"ul"},"is a public IP"),(0,n.yg)("li",{parentName:"ul"},"provides a fixed IP for your instance"),(0,n.yg)("li",{parentName:"ul"},"restart may change public IP"),(0,n.yg)("li",{parentName:"ul"},"attached to single instance"),(0,n.yg)("li",{parentName:"ul"},"5 Elastic IP per account (can request more)"),(0,n.yg)("li",{parentName:"ul"},"Best Practice",(0,n.yg)("ul",{parentName:"li"},(0,n.yg)("li",{parentName:"ul"},"Avoid using EIP\u2015Use random IP + register DNS, or LB instead"))))),(0,n.yg)("li",{parentName:"ul"}),(0,n.yg)("li",{parentName:"ul"},"Placement Groups",(0,n.yg)("ul",{parentName:"li"},(0,n.yg)("li",{parentName:"ul"},'What are the 3 Placement Group "strategies"? \u2193',(0,n.yg)("ul",{parentName:"li"},(0,n.yg)("li",{parentName:"ul"},"Cluster"),(0,n.yg)("li",{parentName:"ul"},"Partition"),(0,n.yg)("li",{parentName:"ul"},"Spread"))),(0,n.yg)("li",{parentName:"ul"},"What's the goal of Placement Groups?\u2015Spread instances over different underlying hardware to minimise risk of concurrent failures."),(0,n.yg)("li",{parentName:"ul"},"Cluster",(0,n.yg)("ul",{parentName:"li"},(0,n.yg)("li",{parentName:"ul"},"all instances",(0,n.yg)("ul",{parentName:"li"},(0,n.yg)("li",{parentName:"ul"},"single AZ"),(0,n.yg)("li",{parentName:"ul"},"single rack"))),(0,n.yg)("li",{parentName:"ul"},"low-latency network performance (10gb)"),(0,n.yg)("li",{parentName:"ul"},"riskiest due to no {{redundancy}} if single rack or AZ {{fails}}"),(0,n.yg)("li",{parentName:"ul"},"what kind of applications is a cluster placement group good for?\u2015High Performance Computing (HPC)"))),(0,n.yg)("li",{parentName:"ul"},"Partition",(0,n.yg)("ul",{parentName:"li"},(0,n.yg)("li",{parentName:"ul"},"instances",(0,n.yg)("ul",{parentName:"li"},(0,n.yg)("li",{parentName:"ul"},(0,n.yg)("img",{parentName:"li",src:"https://docs.aws.amazon.com/AWSEC2/latest/UserGuide/images/placement-group-partition.png",alt:"pg-partition"})),(0,n.yg)("li",{parentName:"ul"},"multi-AZ in single Region",(0,n.yg)("ul",{parentName:"li"},(0,n.yg)("li",{parentName:"ul"},"can do 2 x partitions in 1 x AZ and 1 x in another"))),(0,n.yg)("li",{parentName:"ul"},"7 partitions per AZ"),(0,n.yg)("li",{parentName:"ul"},"partitions don't share racks with other partitions"))),(0,n.yg)("li",{parentName:"ul"},"what popular DBMS are ideal to use 'Partition' placement groups (hint: H H C K)?\u2015HDFS, HBase, Cassandra, Kafka"))),(0,n.yg)("li",{parentName:"ul"},"Spread",(0,n.yg)("ul",{parentName:"li"},(0,n.yg)("li",{parentName:"ul"},"instances",(0,n.yg)("ul",{parentName:"li"},(0,n.yg)("li",{parentName:"ul"},(0,n.yg)("img",{parentName:"li",src:"https://docs.aws.amazon.com/AWSEC2/latest/UserGuide/images/placement-group-spread.png",alt:"pg-spread"})),(0,n.yg)("li",{parentName:"ul"},"separate hardware"),(0,n.yg)("li",{parentName:"ul"},"multi-AZ",(0,n.yg)("ul",{parentName:"li"},(0,n.yg)("li",{parentName:"ul"},"7 x VM per AZ per Placement Group"))))),(0,n.yg)("li",{parentName:"ul"},"use case: {{critical}} applications reduce risk of {{simultaneous}} failures."))))),(0,n.yg)("li",{parentName:"ul"},"Elastic Network Interface (ENI)",(0,n.yg)("ul",{parentName:"li"},(0,n.yg)("li",{parentName:"ul"},"possible attributes",(0,n.yg)("ul",{parentName:"li"},(0,n.yg)("li",{parentName:"ul"},"primary (private) IPv4 + secondary IPv4"),(0,n.yg)("li",{parentName:"ul"},"1 x EIP per private IPv4"),(0,n.yg)("li",{parentName:"ul"},"can move them from Ec2 to Ec2"),(0,n.yg)("li",{parentName:"ul"},"bound to AZ"),(0,n.yg)("li",{parentName:"ul"},(0,n.yg)("img",{parentName:"li",src:"https://blog2opstree.files.wordpress.com/2022/02/elastic-network2.png?w=349",alt:"elastic network"})))))),(0,n.yg)("li",{parentName:"ul"},"EC2 Hibernate",(0,n.yg)("ul",{parentName:"li"},(0,n.yg)("li",{parentName:"ul"},"RAM state preserved"),(0,n.yg)("li",{parentName:"ul"},"state written to root EBS volume"),(0,n.yg)("li",{parentName:"ul"},"root EBS volume must be encrypted"),(0,n.yg)("li",{parentName:"ul"},"AMI must be encrypted"),(0,n.yg)("li",{parentName:"ul"},"hibernate is good for...?\u2015 \u2193",(0,n.yg)("ul",{parentName:"li"},(0,n.yg)("li",{parentName:"ul"},"long-running process"),(0,n.yg)("li",{parentName:"ul"},'speed up instance initialise time because its not "starting up" from scratch, its loading from point-in-time state.'))),(0,n.yg)("li",{parentName:"ul"},"RAM size must be < 150GiB"),(0,n.yg)("li",{parentName:"ul"},"Available for which Instance Types?\u2015On-Demand, Reserved and Spot instances"))),(0,n.yg)("li",{parentName:"ul"},"EC2 Nitro",(0,n.yg)("ul",{parentName:"li"},(0,n.yg)("li",{parentName:"ul"},'better performance "similar to bare metal"'),(0,n.yg)("li",{parentName:"ul"},"High-speed EBS",(0,n.yg)("ul",{parentName:"li"},(0,n.yg)("li",{parentName:"ul"},"Nitro 64,000 EBS IOPS"),(0,n.yg)("li",{parentName:"ul"},"Non-Nitro max 32,000"))),(0,n.yg)("li",{parentName:"ul"},"better (underlying) security"))),(0,n.yg)("li",{parentName:"ul"},"EC2 vCPU",(0,n.yg)("ul",{parentName:"li"},(0,n.yg)("li",{parentName:"ul"},"multi-threading"),(0,n.yg)("li",{parentName:"ul"},"each thread = vCPU"),(0,n.yg)("li",{parentName:"ul"},"maths: 4 x CPU running 2 threads per CPU = 8 vCPUs"),(0,n.yg)("li",{parentName:"ul"},"Options",(0,n.yg)("ul",{parentName:"li"},(0,n.yg)("li",{parentName:"ul"},"decrease # of CPU cores to decrease license costs"),(0,n.yg)("li",{parentName:"ul"},"turn off multi-threading good for HPC workloads"))))),(0,n.yg)("li",{parentName:"ul"},"EC2 Capacity Reservations",(0,n.yg)("ul",{parentName:"li"},(0,n.yg)("li",{parentName:"ul"},"long-term commitment not required (1 & 3)"),(0,n.yg)("li",{parentName:"ul"},"capacity access & billing are immediate"),(0,n.yg)("li",{parentName:"ul"},"required specs \u2193",(0,n.yg)("ul",{parentName:"li"},(0,n.yg)("li",{parentName:"ul"},"AZ"),(0,n.yg)("li",{parentName:"ul"},"number of instances"),(0,n.yg)("li",{parentName:"ul"},"instance attributes e.g. type, tenancy, OS"))),(0,n.yg)("li",{parentName:"ul"},"cost savings if combined with RI's and Savings Plans")))))}c.isMDXComponent=!0}}]);