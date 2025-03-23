"use strict";(self.webpackChunkronamosa_github_io=self.webpackChunkronamosa_github_io||[]).push([[69800],{15680:(e,t,a)=>{a.d(t,{xA:()=>g,yg:()=>c});var n=a(96540);function r(e,t,a){return t in e?Object.defineProperty(e,t,{value:a,enumerable:!0,configurable:!0,writable:!0}):e[t]=a,e}function i(e,t){var a=Object.keys(e);if(Object.getOwnPropertySymbols){var n=Object.getOwnPropertySymbols(e);t&&(n=n.filter((function(t){return Object.getOwnPropertyDescriptor(e,t).enumerable}))),a.push.apply(a,n)}return a}function l(e){for(var t=1;t<arguments.length;t++){var a=null!=arguments[t]?arguments[t]:{};t%2?i(Object(a),!0).forEach((function(t){r(e,t,a[t])})):Object.getOwnPropertyDescriptors?Object.defineProperties(e,Object.getOwnPropertyDescriptors(a)):i(Object(a)).forEach((function(t){Object.defineProperty(e,t,Object.getOwnPropertyDescriptor(a,t))}))}return e}function o(e,t){if(null==e)return{};var a,n,r=function(e,t){if(null==e)return{};var a,n,r={},i=Object.keys(e);for(n=0;n<i.length;n++)a=i[n],t.indexOf(a)>=0||(r[a]=e[a]);return r}(e,t);if(Object.getOwnPropertySymbols){var i=Object.getOwnPropertySymbols(e);for(n=0;n<i.length;n++)a=i[n],t.indexOf(a)>=0||Object.prototype.propertyIsEnumerable.call(e,a)&&(r[a]=e[a])}return r}var u=n.createContext({}),s=function(e){var t=n.useContext(u),a=t;return e&&(a="function"==typeof e?e(t):l(l({},t),e)),a},g=function(e){var t=s(e.components);return n.createElement(u.Provider,{value:t},e.children)},m="mdxType",p={inlineCode:"code",wrapper:function(e){var t=e.children;return n.createElement(n.Fragment,{},t)}},y=n.forwardRef((function(e,t){var a=e.components,r=e.mdxType,i=e.originalType,u=e.parentName,g=o(e,["components","mdxType","originalType","parentName"]),m=s(a),y=r,c=m["".concat(u,".").concat(y)]||m[y]||p[y]||i;return a?n.createElement(c,l(l({ref:t},g),{},{components:a})):n.createElement(c,l({ref:t},g))}));function c(e,t){var a=arguments,r=t&&t.mdxType;if("string"==typeof e||r){var i=a.length,l=new Array(i);l[0]=y;var o={};for(var u in t)hasOwnProperty.call(t,u)&&(o[u]=t[u]);o.originalType=e,o[m]="string"==typeof e?e:r,l[1]=o;for(var s=2;s<i;s++)l[s]=a[s];return n.createElement.apply(null,l)}return n.createElement.apply(null,a)}y.displayName="MDXCreateElement"},51076:(e,t,a)=>{a.r(t),a.d(t,{assets:()=>u,contentTitle:()=>l,default:()=>p,frontMatter:()=>i,metadata:()=>o,toc:()=>s});var n=a(58168),r=(a(96540),a(15680));const i={title:"AWS Monitoring & Auditing, CloudWatch, CloudTrail & Config"},l=void 0,o={unversionedId:"study/SAA-03/Monitoring-Auditing-CloudWatch-CloudTrail-Config",id:"study/SAA-03/Monitoring-Auditing-CloudWatch-CloudTrail-Config",title:"AWS Monitoring & Auditing, CloudWatch, CloudTrail & Config",description:"These were the topics I created flashcards for (Remnote) and would revise them using spaced repetition. The formatting is an export from Remnote.",source:"@site/docs/study/SAA-03/25-Monitoring-Auditing-CloudWatch-CloudTrail-Config.md",sourceDirName:"study/SAA-03",slug:"/study/SAA-03/Monitoring-Auditing-CloudWatch-CloudTrail-Config",permalink:"/docs/study/SAA-03/Monitoring-Auditing-CloudWatch-CloudTrail-Config",draft:!1,editUrl:"https://github.com/ronamosa/ronamosa.github.io/edit/main/website/docs/study/SAA-03/25-Monitoring-Auditing-CloudWatch-CloudTrail-Config.md",tags:[],version:"current",sidebarPosition:25,frontMatter:{title:"AWS Monitoring & Auditing, CloudWatch, CloudTrail & Config"},sidebar:"docsSidebar",previous:{title:"Machine Learning",permalink:"/docs/study/SAA-03/Machine-Learning"},next:{title:"Disaster Recovery & Migrations.",permalink:"/docs/study/SAA-03/Disaster-Recovery-Migrations"}},u={},s=[],g={toc:s},m="wrapper";function p(e){let{components:t,...a}=e;return(0,r.yg)(m,(0,n.A)({},g,a,{components:t,mdxType:"MDXLayout"}),(0,r.yg)("admonition",{type:"info"},(0,r.yg)("p",{parentName:"admonition"},"These were the topics I created flashcards for (Remnote) and would revise them using spaced repetition. The formatting is an export from Remnote.")),(0,r.yg)("ul",null,(0,r.yg)("li",{parentName:"ul"},"CloudWatch",(0,r.yg)("ul",{parentName:"li"},(0,r.yg)("li",{parentName:"ul"},"Metric is a {{variable}} to monitor"),(0,r.yg)("li",{parentName:"ul"},"A metric goes in a namespace.. what's a namespace?\u2015like a bucket or category for each service."),(0,r.yg)("li",{parentName:"ul"},"What is an attribute of a metric?\u2015A Dimension"),(0,r.yg)("li",{parentName:"ul"},"Create one of these when you need a custom variable to monitor?\u2015CloudWatch Custom Metric."),(0,r.yg)("li",{parentName:"ul"},"Where can you stream, near-real-time CloudWatch metrics to?\u2015Kinesis Data Firehose.",(0,r.yg)("ul",{parentName:"li"},(0,r.yg)("li",{parentName:"ul"},"you also have the option to {{filter}} metrics to a subset."))),(0,r.yg)("li",{parentName:"ul"},"CloudWatch Logs",(0,r.yg)("ul",{parentName:"li"},(0,r.yg)("li",{parentName:"ul"},'"an arbitrary name, usually representing an application"\u2015Log groups'),(0,r.yg)("li",{parentName:"ul"},'"instances  ',(0,r.yg)("strong",{parentName:"li"},"within"),'  those applications"...\u2015Log streams'),(0,r.yg)("li",{parentName:"ul"},"CloudWatch Logs can send logs to... (hint: think exports, streams, search)?\u2015 \u2193",(0,r.yg)("ul",{parentName:"li"},(0,r.yg)("li",{parentName:"ul"},"S3 (exports)"),(0,r.yg)("li",{parentName:"ul"},"KDS (streams)"),(0,r.yg)("li",{parentName:"ul"},"KDF (streams)"),(0,r.yg)("li",{parentName:"ul"},"Lambda (xform)"),(0,r.yg)("li",{parentName:"ul"},"ElasticSearch (store & search)"))),(0,r.yg)("li",{parentName:"ul"},"S3 Export",(0,r.yg)("ul",{parentName:"li"},(0,r.yg)("li",{parentName:"ul"},"log data can take up to {{12}} hours to be available for export.",(0,r.yg)("ul",{parentName:"li"},(0,r.yg)("li",{parentName:"ul"},"API call used?\u2015",(0,r.yg)("inlineCode",{parentName:"li"},"CreateExportTask")))))),(0,r.yg)("li",{parentName:"ul"},"Subscriptions",(0,r.yg)("ul",{parentName:"li"},(0,r.yg)("li",{parentName:"ul"},"what does a Logs Subscription do?\u2015It forwards log events from CloudWatch Logs to some destination like Lambda, or ElasticSearch.",(0,r.yg)("ul",{parentName:"li"},(0,r.yg)("li",{parentName:"ul"},"so what does a Logs Subscription Filter do?\u2015selects the log group and pattern of log events to be fowarded"))),(0,r.yg)("li",{parentName:"ul"},"How do you aggregate Logs across Multiple AWS accounts and Regions? (draw it going into KDS, KDF and S3) \u2193"))),(0,r.yg)("li",{parentName:"ul"},"EC2",(0,r.yg)("ul",{parentName:"li"},(0,r.yg)("li",{parentName:"ul"},"by default, what logs go from an EC2 machine to CloudWatch?\u2015None. By default no logs."),(0,r.yg)("li",{parentName:"ul"},"what do you need to run on EC2 to get the logs to CW?\u2015the CloudWatch agent."),(0,r.yg)("li",{parentName:"ul"},"can a CW agent also run on an on-premise server?\u2015Yes."))))),(0,r.yg)("li",{parentName:"ul"},"Logs Agent & Unified Agent",(0,r.yg)("ul",{parentName:"li"},(0,r.yg)("li",{parentName:"ul"},"what are the two agents? \u2193",(0,r.yg)("ul",{parentName:"li"},(0,r.yg)("li",{parentName:"ul"},"Logs Agent",(0,r.yg)("ul",{parentName:"li"},(0,r.yg)("li",{parentName:"ul"},"Can only send to {{CloudWatch Logs}}."))),(0,r.yg)("li",{parentName:"ul"},"Unified Agent",(0,r.yg)("ul",{parentName:"li"},(0,r.yg)("li",{parentName:"ul"},"collects additional {{system}}-level metrics e.g. {{RAM}}"),(0,r.yg)("li",{parentName:"ul"},"What metrics can Unified Agent collect? (hint: C D R N P S)\u2015 \u2193",(0,r.yg)("ul",{parentName:"li"},(0,r.yg)("li",{parentName:"ul"},"CPU"),(0,r.yg)("li",{parentName:"ul"},"Disk"),(0,r.yg)("li",{parentName:"ul"},"RAM"),(0,r.yg)("li",{parentName:"ul"},"Netstat"),(0,r.yg)("li",{parentName:"ul"},"Processes"),(0,r.yg)("li",{parentName:"ul"},"Swap"))))))))),(0,r.yg)("li",{parentName:"ul"},"CloudWatch Alarms",(0,r.yg)("ul",{parentName:"li"},(0,r.yg)("li",{parentName:"ul"},"what are the alarm states? \u2193",(0,r.yg)("ul",{parentName:"li"},(0,r.yg)("li",{parentName:"ul"},"OK"),(0,r.yg)("li",{parentName:"ul"},"INSUFFICIENT_DATA"),(0,r.yg)("li",{parentName:"ul"},"ALARM"))),(0,r.yg)("li",{parentName:"ul"},"Alarm Targets",(0,r.yg)("ul",{parentName:"li"},(0,r.yg)("li",{parentName:"ul"},"what are the THREE targets for CW alarms? \u2193",(0,r.yg)("ul",{parentName:"li"},(0,r.yg)("li",{parentName:"ul"},"EC2",(0,r.yg)("ul",{parentName:"li"},(0,r.yg)("li",{parentName:"ul"},"what can you alarm on for the EC2 instance (hint: S T R R)?\u2015 \u2193",(0,r.yg)("ul",{parentName:"li"},(0,r.yg)("li",{parentName:"ul"},"Stop"),(0,r.yg)("li",{parentName:"ul"},"Terminate"),(0,r.yg)("li",{parentName:"ul"},"Reboot"),(0,r.yg)("li",{parentName:"ul"},"Recover"))),(0,r.yg)("li",{parentName:"ul"},'what does this mean i.e. an alarm target with Stop?\u2015basically, you ALARM on "Stop", which sends a message to EC2 "hey, your EC2 has Stopped" and then you can automate an action based on that trigger.'))),(0,r.yg)("li",{parentName:"ul"},"Auto Scaling (trigger)"),(0,r.yg)("li",{parentName:"ul"},"Send to SNS"))),(0,r.yg)("li",{parentName:"ul"},'Explain a composite alarm, using an example CPU metric and IOPS metric?\u2015based on the states of these TWO alarms, you can either OR them or you can AND them for a final "composite" alarm evaluation e.g. if IOPS is high, we expect CPU to be high BUT if CPU is high and IOPS is not, then we should investigate.'),(0,r.yg)("li",{parentName:"ul"},"how can you test your alarms without actually creating an incident?\u2015use CLI to set state for alarm."))))),(0,r.yg)("li",{parentName:"ul"},"Amazon EventBridge",(0,r.yg)("ul",{parentName:"li"},(0,r.yg)("li",{parentName:"ul"},"what are the modes for EventBridge i.e. different ways to set it up to do stuff...",(0,r.yg)("ul",{parentName:"li"},(0,r.yg)("li",{parentName:"ul"},"Schedule or CRON mode"),(0,r.yg)("li",{parentName:"ul"},"Event Pattern Rules or Trigger mode"),(0,r.yg)("li",{parentName:"ul"},"Triggers lambda functions, sends SQS and SNS messages..."))),(0,r.yg)("li",{parentName:"ul"},"in words, how does the EventBridge Rules flow go i.e. from source to destination?\u2015Source, events can get filtered into EB, rules will match that (JSON format) and send to destination."),(0,r.yg)("li",{parentName:"ul"},"What are the THREE event buses your Amazon EventBridge can route events from? \u2193",(0,r.yg)("ul",{parentName:"li"},(0,r.yg)("li",{parentName:"ul"},"Default Event Bus"),(0,r.yg)("li",{parentName:"ul"},"Partner Event Bus"),(0,r.yg)("li",{parentName:"ul"},"Custom Event Bus"))),(0,r.yg)("li",{parentName:"ul"},"what can you do to events so that you're able to replay them later?\u2015Archive them."),(0,r.yg)("li",{parentName:"ul"},"What allows you to ensure the data you are sending and receiving through EventBridge is well-structured and consistent?\u2015Schema Registry"),(0,r.yg)("li",{parentName:"ul"},"How can you allow or deny events from another AWS Account or AWS Region?\u2015use Resource-based Policies"))),(0,r.yg)("li",{parentName:"ul"},"CloudWatch Container Insights",(0,r.yg)("ul",{parentName:"li"},(0,r.yg)("li",{parentName:"ul"},"collects, aggregates and summarises what from containers?\u2015Metrics & Logs."))),(0,r.yg)("li",{parentName:"ul"},"CloudWatch Lambda Insights",(0,r.yg)("ul",{parentName:"li"},(0,r.yg)("li",{parentName:"ul"},"Monitoring and {{troubleshooting}} solution for serverless applications running on AWS Lambda"),(0,r.yg)("li",{parentName:"ul"},"Collects, {{aggregates}}, and summarizes {{system}}-level metrics including CPU time, {{memory}}, disk, and {{network}}."))),(0,r.yg)("li",{parentName:"ul"},"CloudWatch Contributor Insights",(0,r.yg)("ul",{parentName:"li"},(0,r.yg)("li",{parentName:"ul"},"what metrics can you see with these insights and where does it get it from?\u2015Top-N contributors via CloudWatch Logs"),(0,r.yg)("li",{parentName:"ul"},"what kind of network users can you identify from these insights?\u2015heaviest network users."))),(0,r.yg)("li",{parentName:"ul"},"CloudWatch Application Insights",(0,r.yg)("ul",{parentName:"li"},(0,r.yg)("li",{parentName:"ul"},"Provides automated {{dashboards}} that show potential {{problems}} with monitored applications, to help isolate ongoing issues."))))),(0,r.yg)("li",{parentName:"ul"},"AWS CloudTrail",(0,r.yg)("ul",{parentName:"li"},(0,r.yg)("li",{parentName:"ul"},"what does CloudTrail provide for your AWS account? (hint: C G A)\u2015 \u2193",(0,r.yg)("ul",{parentName:"li"},(0,r.yg)("li",{parentName:"ul"},"Governance"),(0,r.yg)("li",{parentName:"ul"},"Compliance"),(0,r.yg)("li",{parentName:"ul"},"Audit"))),(0,r.yg)("li",{parentName:"ul"},"CloudTrail gives you a history of your {{events}} and {{API}} calls made {{within}} your AWS account."),(0,r.yg)("li",{parentName:"ul"},"A trail can apply to {{All}} Regions or a {{single}} Region."),(0,r.yg)("li",{parentName:"ul"},"What are the THREE types of CloudTrail Events? \u2193",(0,r.yg)("ul",{parentName:"li"},(0,r.yg)("li",{parentName:"ul"},"Management Events",(0,r.yg)("ul",{parentName:"li"},(0,r.yg)("li",{parentName:"ul"},"are management events logged by default?\u2015Yes."),(0,r.yg)("li",{parentName:"ul"},"can you separate ",(0,r.yg)("strong",{parentName:"li"},"Read Events")," from ",(0,r.yg)("strong",{parentName:"li"},"Write Events"),"?\u2015Yes."))),(0,r.yg)("li",{parentName:"ul"},"Data Events",(0,r.yg)("ul",{parentName:"li"},(0,r.yg)("li",{parentName:"ul"},"are data events logged by default?\u2015No.",(0,r.yg)("ul",{parentName:"li"},(0,r.yg)("li",{parentName:"ul"},"why not?\u2015cos its a HIGH VOLUME operation"))))),(0,r.yg)("li",{parentName:"ul"},"Insight Events",(0,r.yg)("ul",{parentName:"li"},(0,r.yg)("li",{parentName:"ul"},"what kind of activity does CloudTrail Insights detect?\u2015Unusual activity.",(0,r.yg)("ul",{parentName:"li"},(0,r.yg)("li",{parentName:"ul"},'what does Insights need to establish first before it can detect "unusual activity"?\u2015needs to establish a "baseline" of normal management events.'),(0,r.yg)("li",{parentName:"ul"},"what kind of events does it continuously analyse to detect unusual patterns?\u2015write events."))))))),(0,r.yg)("li",{parentName:"ul"},"CloudTrail Events Retention",(0,r.yg)("ul",{parentName:"li"},(0,r.yg)("li",{parentName:"ul"},"how long are events stored in cloudtrail?\u201590 days."),(0,r.yg)("li",{parentName:"ul"},"if you want to store them longer?\u2015log them to S3."))))),(0,r.yg)("li",{parentName:"ul"},"AWS Config",(0,r.yg)("ul",{parentName:"li"},(0,r.yg)("li",{parentName:"ul"},"what does AWS Config help you to record? \u2193",(0,r.yg)("ul",{parentName:"li"},(0,r.yg)("li",{parentName:"ul"},"Compliance of your AWS Resources"),(0,r.yg)("li",{parentName:"ul"},"Configurations and changes over time"))),(0,r.yg)("li",{parentName:"ul"},"what's an example using SSH that AWS Config can help with?\u2015check if there is unrestricted SSH access and then trigger a remediation to this non-compliance."),(0,r.yg)("li",{parentName:"ul"},"Rule of thumb, AWS Config Rules {{do not}} prevent actions from happening (no {{deny}})."),(0,r.yg)("li",{parentName:"ul"},"what are Config Rule Remediation?\u2015automate remediation of non-compliance resources.",(0,r.yg)("ul",{parentName:"li"},(0,r.yg)("li",{parentName:"ul"},"what can you set to enhance the remediation?\u2015Remediation Retries."))),(0,r.yg)("li",{parentName:"ul"},"What two services can you use to send out ",(0,r.yg)("strong",{parentName:"li"},"Config Rule Notifications"),"?\u2015 \u2193",(0,r.yg)("ul",{parentName:"li"},(0,r.yg)("li",{parentName:"ul"},"EventBridge"),(0,r.yg)("li",{parentName:"ul"},"SNS"))))),(0,r.yg)("li",{parentName:"ul"},"Summary",(0,r.yg)("ul",{parentName:"li"},(0,r.yg)("li",{parentName:"ul"},"CloudWatch ... Monitoring"),(0,r.yg)("li",{parentName:"ul"},"CloudTrail ... Auditing"),(0,r.yg)("li",{parentName:"ul"},"Config ... Compliance")))))}p.isMDXComponent=!0}}]);