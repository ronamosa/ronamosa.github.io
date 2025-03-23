"use strict";(self.webpackChunkronamosa_github_io=self.webpackChunkronamosa_github_io||[]).push([[28694],{15680:(e,t,o)=>{o.d(t,{xA:()=>c,yg:()=>p});var a=o(96540);function n(e,t,o){return t in e?Object.defineProperty(e,t,{value:o,enumerable:!0,configurable:!0,writable:!0}):e[t]=o,e}function r(e,t){var o=Object.keys(e);if(Object.getOwnPropertySymbols){var a=Object.getOwnPropertySymbols(e);t&&(a=a.filter((function(t){return Object.getOwnPropertyDescriptor(e,t).enumerable}))),o.push.apply(o,a)}return o}function s(e){for(var t=1;t<arguments.length;t++){var o=null!=arguments[t]?arguments[t]:{};t%2?r(Object(o),!0).forEach((function(t){n(e,t,o[t])})):Object.getOwnPropertyDescriptors?Object.defineProperties(e,Object.getOwnPropertyDescriptors(o)):r(Object(o)).forEach((function(t){Object.defineProperty(e,t,Object.getOwnPropertyDescriptor(o,t))}))}return e}function i(e,t){if(null==e)return{};var o,a,n=function(e,t){if(null==e)return{};var o,a,n={},r=Object.keys(e);for(a=0;a<r.length;a++)o=r[a],t.indexOf(o)>=0||(n[o]=e[o]);return n}(e,t);if(Object.getOwnPropertySymbols){var r=Object.getOwnPropertySymbols(e);for(a=0;a<r.length;a++)o=r[a],t.indexOf(o)>=0||Object.prototype.propertyIsEnumerable.call(e,o)&&(n[o]=e[o])}return n}var l=a.createContext({}),u=function(e){var t=a.useContext(l),o=t;return e&&(o="function"==typeof e?e(t):s(s({},t),e)),o},c=function(e){var t=u(e.components);return a.createElement(l.Provider,{value:t},e.children)},g="mdxType",h={inlineCode:"code",wrapper:function(e){var t=e.children;return a.createElement(a.Fragment,{},t)}},y=a.forwardRef((function(e,t){var o=e.components,n=e.mdxType,r=e.originalType,l=e.parentName,c=i(e,["components","mdxType","originalType","parentName"]),g=u(o),y=n,p=g["".concat(l,".").concat(y)]||g[y]||h[y]||r;return o?a.createElement(p,s(s({ref:t},c),{},{components:o})):a.createElement(p,s({ref:t},c))}));function p(e,t){var o=arguments,n=t&&t.mdxType;if("string"==typeof e||n){var r=o.length,s=new Array(r);s[0]=y;var i={};for(var l in t)hasOwnProperty.call(t,l)&&(i[l]=t[l]);i.originalType=e,i[g]="string"==typeof e?e:n,s[1]=i;for(var u=2;u<r;u++)s[u]=o[u];return a.createElement.apply(null,s)}return a.createElement.apply(null,o)}y.displayName="MDXCreateElement"},86094:(e,t,o)=>{o.r(t),o.d(t,{assets:()=>l,contentTitle:()=>s,default:()=>h,frontMatter:()=>r,metadata:()=>i,toc:()=>u});var a=o(58168),n=(o(96540),o(15680));const r={title:"AWS and the Real Cost of Running Your Infrastructure in the Cloud.",author:"Ron Amosa",author_title:"Platform Security Engineer @ Salesforce U.S.",author_url:"https://github.com/ronamosa",author_image_url:"https://github.com/ronamosa.png",tags:["cloud","aws"]},s=void 0,i={permalink:"/blog/2018/04/02/AWS-Cloud-Cost-Management",editUrl:"https://github.com/ronamosa/ronamosa.github.io/edit/main/website/blog/2018-04-02-AWS-Cloud-Cost-Management.md",source:"@site/blog/2018-04-02-AWS-Cloud-Cost-Management.md",title:"AWS and the Real Cost of Running Your Infrastructure in the Cloud.",description:"Monitoring AWS costs is tricker than you may think. Cloud cost management as a general topic is the bane of a lot of business expenses.",date:"2018-04-02T00:00:00.000Z",formattedDate:"April 2, 2018",tags:[{label:"cloud",permalink:"/blog/tags/cloud"},{label:"aws",permalink:"/blog/tags/aws"}],readingTime:4.775,hasTruncateMarker:!0,authors:[{name:"Ron Amosa",title:"Platform Security Engineer @ Salesforce U.S.",url:"https://github.com/ronamosa",imageURL:"https://github.com/ronamosa.png"}],frontMatter:{title:"AWS and the Real Cost of Running Your Infrastructure in the Cloud.",author:"Ron Amosa",author_title:"Platform Security Engineer @ Salesforce U.S.",author_url:"https://github.com/ronamosa",author_image_url:"https://github.com/ronamosa.png",tags:["cloud","aws"]},prevItem:{title:"The Work Life Balance Myth and Why we\u2019re having the Wrong Conversation about Work. ",permalink:"/blog/2018/04/13/Work-Life-Balance"},nextItem:{title:"A Runaway AWS EC2 Instance Blows up My Cloud Costs.",permalink:"/blog/2018/04/01/AWS-Cost-Tracking-Incident"}},l={authorsImageUrls:[void 0]},u=[{value:"AWS Wants to Help You With Cost Management",id:"aws-wants-to-help-you-with-cost-management",level:2},{value:"Strategy. Have one",id:"strategy-have-one",level:2},{value:"Tools. Use them",id:"tools-use-them",level:2}],c={toc:u},g="wrapper";function h(e){let{components:t,...o}=e;return(0,n.yg)(g,(0,a.A)({},c,o,{components:t,mdxType:"MDXLayout"}),(0,n.yg)("p",null,"Monitoring AWS costs is tricker than you may think. Cloud cost management as a general topic is the bane of a lot of business expenses."),(0,n.yg)("p",null,"If you look at ",(0,n.yg)("a",{parentName:"p",href:"https://aws.amazon.com/pricing/"},"AWS Pricing")," page, you're going to have to get your head around a few things."),(0,n.yg)("p",null,"For example, your storage needs:"),(0,n.yg)("p",null,"cool, sounds pretty straight-foward."),(0,n.yg)("blockquote",null,(0,n.yg)("p",{parentName:"blockquote"},'me: "I\'ll just have 2TB please."')),(0,n.yg)("p",null,"not so fast."),(0,n.yg)("p",null,"which ",(0,n.yg)("strong",{parentName:"p"},"region")," do you want to keep your S3 buckets?"),(0,n.yg)("blockquote",null,(0,n.yg)("p",{parentName:"blockquote"},'me: "oh, um, what\'s the difference?"')),(0,n.yg)("p",null,"The main thing that comes to mind is 'latency' to where your users are being served. You generally don't want to serve content from the other side of the world. Also different regions can vary in AWS services available for that region if you need to use something specifically. Data sovereignty is also a consideration - are you allowed to store your users data outside your country?"),(0,n.yg)("p",null,"But the main difference this blog post is worried about, is cost."),(0,n.yg)("blockquote",null,(0,n.yg)("p",{parentName:"blockquote"},"me: \"gee, I'll have to get back to you on that one. How about we just take the default N. Virginia. Cool, so we're done here?\"")),(0,n.yg)("p",null,"Not quite. You need to decide if and how your storage needs divide over the following:"),(0,n.yg)("p",null,"And this is just S3 storage. So imagine your databases, VPC's, NAT instances. Basically all the other things that make up an AWS environment for your company's infrastructure and application needs."),(0,n.yg)("p",null,"This is just to illustrate that AWS cost management is an art and discipline unto itself and should ",(0,n.yg)("em",{parentName:"p"},"not")," be underestimated."),(0,n.yg)("h2",{id:"aws-wants-to-help-you-with-cost-management"},"AWS Wants to Help You With Cost Management"),(0,n.yg)("p",null,"AWS aren't the bad guys and they do try and help their customers not have a bad experience with costs."),(0,n.yg)("p",null,"There are quite a few posts from the folks at Amazon AWS addressing the very issue of managing your costs and not getting an unexpected monthly bill:"),(0,n.yg)("p",null,'One such page under thier "Monitoring Your Usage and Costs" talks about ',(0,n.yg)("a",{parentName:"p",href:"https://docs.aws.amazon.com/awsaccountbilling/latest/aboutv2/checklistforunwantedcharges.html"},"Avoiding Unexpected Charges"),". It talks about using the Free Tier to save money. Which components cost you money even if they're not running or you're not using them e.g. elastic IP addresses, Elastic Load Balancers."),(0,n.yg)("p",null,"Then there's services like ",(0,n.yg)("a",{parentName:"p",href:"https://aws.amazon.com/blogs/aws/aws-budgets-update-track-cloud-costs-and-usage/"},"AWS Budgets")," and ",(0,n.yg)("a",{parentName:"p",href:"https://aws.amazon.com/blogs/aws/the-new-cost-explorer-for-aws/"},"Cost Explorer")," which try to help you monitor and report on all your AWS usages."),(0,n.yg)("p",null,"And lastly, the ",(0,n.yg)("a",{parentName:"p",href:"http://calculator.s3.amazonaws.com/index.html"},"AWS Calculator"),". This is a good place to start to give you an idea of costs before you start launching stuff:"),(0,n.yg)("p",null,"The main things I've highlighted here are a) all the various AWS components down the left-hand side, (b) region selector, (c) does an estimate of your likely monthly bill, and then as an example (d) at the bottom you can see the granularity how how detailed you want to be to get the best estimate of costs."),(0,n.yg)("p",null,"Mind you, doing this for every single piece of your infratructure and application needs, across all the different services (EC2, S3, RDS, DynamoDB) can start to get complicated very quickly."),(0,n.yg)("h2",{id:"strategy-have-one"},"Strategy. Have one"),(0,n.yg)("p",null,"There's an absolute ",(0,n.yg)("a",{parentName:"p",href:"https://www.google.co.nz/search?biw=1309&bih=699&ei=7VrAWvbfJIHX0ASPjaeIBQ&q=aws+staying+on+top+of+costs&oq=aws+staying+on+top+of+costs&gs_l=psy-ab.12...0.0.0.6797.0.0.0.0.0.0.0.0..0.0....0...1c..64.psy-ab..0.0.0....0.0zFs8pfrsMU"},"plethora of blogs posts and articles online")," about different ways to stay on top of your AWS cloud costs from people much smarter than me."),(0,n.yg)("p",null,"But for the sake of an example strategy when it comes to AWS costs, ",(0,n.yg)("a",{parentName:"p",href:"https://blog.cloudability.com/three-ways-to-stay-aws-cost-efficient-during-the-busy-season/"},"Cloudability"),' hit on these 3 key points of advice from their engineers to put you in the best position to have no bill-shock "surprises" :'),(0,n.yg)("ol",null,(0,n.yg)("li",{parentName:"ol"},"identify & monitor key metrics head of busy periods"),(0,n.yg)("li",{parentName:"ol"},"simulate the busy period"),(0,n.yg)("li",{parentName:"ol"},"scale down after busy periods")),(0,n.yg)("p",null,"Of course this will all depend on your architecture, your infrastructure and appliction needs and ultimately, your budget."),(0,n.yg)("p",null,'But we\'re not the first visitors to "AWS bill-shock" island. People have already been here, some of them left, others - built tools to numb the pain.'),(0,n.yg)("h2",{id:"tools-use-them"},"Tools. Use them"),(0,n.yg)("p",null,"Now I've only come across this one recently, but I have to say, it ticks a lot of the boxes:"),(0,n.yg)("p",null,(0,n.yg)("a",{parentName:"p",href:"https://www.parkmycloud.com/"},"Park My Cloud")),(0,n.yg)("p",null,"This service does a tonne of stuff that is definitely in your best interests to include in your cloud management operations. It not only schedules your environments to wake up or shutdown depending on when you need them up (think development and testing environments), but will monitor use of your cloud assets and advise if you could switch to a smaller instance, or less frequently required service."),(0,n.yg)("p",null,"'Park My Cloud' also keep a running total and display of what your projected and actual savings are by using them."),(0,n.yg)("p",null,"We use this tool on my current contract and its easy to use and it's ui is intutive and easy to find things. I would defintely recommend using a tool like this to manage your cloud costs."),(0,n.yg)("p",null,"Now, if you're not a large enterprise with 100's or 1000's of buget to set aside for \"cloud cost management\", never fear. There's always some enterprising person on the internet who is ready to plug this gap in the market."),(0,n.yg)("p",null,"Meet ","[MiserBot]","(",(0,n.yg)("a",{parentName:"p",href:"https://www.concurrencylabs.com/blog/introducing-miserbot-aws-cost-"},"https://www.concurrencylabs.com/blog/introducing-miserbot-aws-cost-"),"\nmanagement/). From their marketing material, they are:"),(0,n.yg)("admonition",{title:"MiserBot",type:"info"},(0,n.yg)("blockquote",{parentName:"admonition"},(0,n.yg)("p",{parentName:"blockquote"},'"MiserBot makes it easy for your team to know what\u2019s going on with your AWS cost. It helps you save money and it keeps your team productive."'))),(0,n.yg)("p",null,"Okay, not mind-blowingly convincing, but the bot does some good stuff:"),(0,n.yg)("ul",null,(0,n.yg)("li",{parentName:"ul"},"Integrates with Slack"),(0,n.yg)("li",{parentName:"ul"},"Calculates the total accumulated AWS cost for the month"),(0,n.yg)("li",{parentName:"ul"},"Tells you which AWS services you\u2019re paying for (e.g. EC2, S3, etc.)"),(0,n.yg)("li",{parentName:"ul"},"Gives you a list of AWS usage types and their cost in the current month.")),(0,n.yg)("p",null,"Here's a little demo:"),(0,n.yg)("iframe",{width:"560",height:"315",src:"https://www.youtube-nocookie.com/embed/OCzRD1E3LZ4?rel=0&controls=0&showinfo=0",frameborder:"0",allow:"autoplay; encrypted-media",allowfullscreen:!0}),(0,n.yg)("p",null,"The point is - find a tool that will look at and address your cloud costs ",(0,n.yg)("em",{parentName:"p"},"specifically"),'. The thing can be too big and complex to admin and manage "part-time".'))}h.isMDXComponent=!0}}]);