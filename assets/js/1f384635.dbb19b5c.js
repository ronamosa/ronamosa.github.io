"use strict";(self.webpackChunkronamosa_github_io=self.webpackChunkronamosa_github_io||[]).push([[40465],{15680:(e,n,t)=>{t.d(n,{xA:()=>u,yg:()=>m});var o=t(96540);function i(e,n,t){return n in e?Object.defineProperty(e,n,{value:t,enumerable:!0,configurable:!0,writable:!0}):e[n]=t,e}function r(e,n){var t=Object.keys(e);if(Object.getOwnPropertySymbols){var o=Object.getOwnPropertySymbols(e);n&&(o=o.filter((function(n){return Object.getOwnPropertyDescriptor(e,n).enumerable}))),t.push.apply(t,o)}return t}function a(e){for(var n=1;n<arguments.length;n++){var t=null!=arguments[n]?arguments[n]:{};n%2?r(Object(t),!0).forEach((function(n){i(e,n,t[n])})):Object.getOwnPropertyDescriptors?Object.defineProperties(e,Object.getOwnPropertyDescriptors(t)):r(Object(t)).forEach((function(n){Object.defineProperty(e,n,Object.getOwnPropertyDescriptor(t,n))}))}return e}function s(e,n){if(null==e)return{};var t,o,i=function(e,n){if(null==e)return{};var t,o,i={},r=Object.keys(e);for(o=0;o<r.length;o++)t=r[o],n.indexOf(t)>=0||(i[t]=e[t]);return i}(e,n);if(Object.getOwnPropertySymbols){var r=Object.getOwnPropertySymbols(e);for(o=0;o<r.length;o++)t=r[o],n.indexOf(t)>=0||Object.prototype.propertyIsEnumerable.call(e,t)&&(i[t]=e[t])}return i}var l=o.createContext({}),c=function(e){var n=o.useContext(l),t=n;return e&&(t="function"==typeof e?e(n):a(a({},n),e)),t},u=function(e){var n=c(e.components);return o.createElement(l.Provider,{value:n},e.children)},p="mdxType",d={inlineCode:"code",wrapper:function(e){var n=e.children;return o.createElement(o.Fragment,{},n)}},g=o.forwardRef((function(e,n){var t=e.components,i=e.mdxType,r=e.originalType,l=e.parentName,u=s(e,["components","mdxType","originalType","parentName"]),p=c(t),g=i,m=p["".concat(l,".").concat(g)]||p[g]||d[g]||r;return t?o.createElement(m,a(a({ref:n},u),{},{components:t})):o.createElement(m,a({ref:n},u))}));function m(e,n){var t=arguments,i=n&&n.mdxType;if("string"==typeof e||i){var r=t.length,a=new Array(r);a[0]=g;var s={};for(var l in n)hasOwnProperty.call(n,l)&&(s[l]=n[l]);s.originalType=e,s[p]="string"==typeof e?e:i,a[1]=s;for(var c=2;c<r;c++)a[c]=t[c];return o.createElement.apply(null,a)}return o.createElement.apply(null,t)}g.displayName="MDXCreateElement"},96928:(e,n,t)=>{t.r(n),t.d(n,{assets:()=>l,contentTitle:()=>a,default:()=>d,frontMatter:()=>r,metadata:()=>s,toc:()=>c});var o=t(58168),i=(t(96540),t(15680));const r={title:"RDP to a Azure AD Joined Device"},a=void 0,s={unversionedId:"archive/2017-09-12-Windows10Pro-RDP-AzureADJoined",id:"archive/2017-09-12-Windows10Pro-RDP-AzureADJoined",title:"RDP to a Azure AD Joined Device",description:"After setting up a local schools office to use Azure AD for user, device management, I was having trouble trying to RDP from one domain joined machine to another.",source:"@site/docs/archive/2017-09-12-Windows10Pro-RDP-AzureADJoined.md",sourceDirName:"archive",slug:"/archive/2017-09-12-Windows10Pro-RDP-AzureADJoined",permalink:"/docs/archive/2017-09-12-Windows10Pro-RDP-AzureADJoined",draft:!1,editUrl:"https://github.com/ronamosa/ronamosa.github.io/edit/main/website/docs/archive/2017-09-12-Windows10Pro-RDP-AzureADJoined.md",tags:[],version:"current",frontMatter:{title:"RDP to a Azure AD Joined Device"},sidebar:"docsSidebar",previous:{title:"Setting up HTTPS inspection (mitm) with Windows Squid",permalink:"/docs/archive/2017-08-25-Windows-SQUID-SSLBUMP"},next:{title:"Reset Windows10 VMWare Guest Password.",permalink:"/docs/archive/2017-09-14-Reset_Win10_Passwd_Vmware_Guest"}},l={},c=[{value:"Problem",id:"problem",level:2},{value:"Solution",id:"solution",level:2},{value:"Conclusion",id:"conclusion",level:2},{value:"Troubleshooting",id:"troubleshooting",level:2},{value:"References",id:"references",level:2},{value:"Appendix",id:"appendix",level:2}],u={toc:c},p="wrapper";function d(e){let{components:n,...r}=e;return(0,i.yg)(p,(0,o.A)({},u,r,{components:n,mdxType:"MDXLayout"}),(0,i.yg)("p",null,"After setting up a local schools office to use Azure AD for user, device management, I was having trouble trying to RDP from one domain joined machine to another."),(0,i.yg)("h2",{id:"problem"},"Problem"),(0,i.yg)("p",null,"firing up stock standard RDP session :"),(0,i.yg)("p",null,(0,i.yg)("img",{alt:"RDP start",src:t(20745).A,width:"407",height:"474"})),(0,i.yg)("p",null,'We get asked for login details, which we choose "other" and then have fun trying to get the login format right'),(0,i.yg)("blockquote",null,(0,i.yg)("p",{parentName:"blockquote"},'is it "username@AzureDomain", or "AzureDomain\\username"?')),(0,i.yg)("p",null,(0,i.yg)("img",{alt:"RDP bad login",src:t(28433).A,width:"456",height:"392"})),(0,i.yg)("p",null,"The problem is when initiating the connection RDP sets up the authentication between us and the remote host and something goes screwy (technical term)."),(0,i.yg)("p",null,"So how do we prevent this setup going off-track from the jump?"),(0,i.yg)("h2",{id:"solution"},"Solution"),(0,i.yg)("p",null,"After seeing a few forum posts saying to ",(0,i.yg)("a",{parentName:"p",href:"https://social.technet.microsoft.com/Forums/windows/en-US/404b7ec4-1426-44d7-a1b3-99ea7d5a8220/rdp-to-an-azure-ad-joined-computer?forum=win10itprogeneral"},"add AzureAD users to the 'Remote Desktop Allowed' groups")," and a resignation to just ",(0,i.yg)("a",{parentName:"p",href:"https://community.spiceworks.com/topic/1962898-rdp-into-standard-user-account-on-azure-ad-joined-pc"},"use teamviewer")),(0,i.yg)("p",null,"I found the following hack/workaround:"),(0,i.yg)("ul",null,(0,i.yg)("li",{parentName:"ul"},"Start an RDP session"),(0,i.yg)("li",{parentName:"ul"},"Enter the IP/hostname of the remote PC you want to connect to."),(0,i.yg)("li",{parentName:"ul"},"Click ",(0,i.yg)("strong",{parentName:"li"},"'Save As'")," and save the ","*",".rdp file somewhere."),(0,i.yg)("li",{parentName:"ul"},"Open the .rdp file you just saved with notepad/notepad++"),(0,i.yg)("li",{parentName:"ul"},"Add the following two lines at the bottom of the config:")),(0,i.yg)("pre",null,(0,i.yg)("code",{parentName:"pre",className:"language-sh"},'enablecredsspsupport:i:0 # disables _"use the Credential Security Support Provider (CredSSP) for authentication"_\nauthentication level:i:2 # sets authentication level to 2 (0 and connection doesn\'t work, 1 and it shows you remote pc cert and then dies).\n')),(0,i.yg)("ul",null,(0,i.yg)("li",{parentName:"ul"},"save your rdp file."),(0,i.yg)("li",{parentName:"ul"},"double-click your rdp file and you should get the following screens")),(0,i.yg)("p",null,"first connection:\n",(0,i.yg)("img",{alt:"RDP first login",src:t(42986).A,width:"497",height:"291"})),(0,i.yg)("p",null,"remote pc shows us their cert:\n",(0,i.yg)("img",{alt:"RDP first login",src:t(47191).A,width:"392",height:"469"})),(0,i.yg)("p",null,"SUCCESS!\n",(0,i.yg)("img",{alt:"RDP first login",src:t(85290).A,width:"1012",height:"752"})),(0,i.yg)("h2",{id:"conclusion"},"Conclusion"),(0,i.yg)("p",null,"The main takeaway here is to stop RDP caking the connection setup by disabling the ",(0,i.yg)("inlineCode",{parentName:"p"},"enablecredsspsupport")," from starting us down a bad authentication pathway and just get out of the way and show us the remote PC login screen. The remote login screen understands the authentication bits we're working with in line with AzureAD."),(0,i.yg)("h2",{id:"troubleshooting"},"Troubleshooting"),(0,i.yg)("p",null,"Make sure:\n",(0,i.yg)("img",{alt:"RDP Settings",src:t(42988).A,width:"613",height:"709"})),(0,i.yg)("ul",null,(0,i.yg)("li",{parentName:"ul"},(0,i.yg)("inlineCode",{parentName:"li"},"Allow remote connections to this computer")," : ",(0,i.yg)("inlineCode",{parentName:"li"},"CHECKED")),(0,i.yg)("li",{parentName:"ul"},(0,i.yg)("inlineCode",{parentName:"li"},"Allow connections only from computers running Remote Desktop with Network Level Authentication")," : ",(0,i.yg)("inlineCode",{parentName:"li"},"NOT CHECKED"))),(0,i.yg)("h2",{id:"references"},"References"),(0,i.yg)("admonition",{type:"info"},(0,i.yg)("ul",{parentName:"admonition"},(0,i.yg)("li",{parentName:"ul"},(0,i.yg)("a",{parentName:"li",href:"https://technet.microsoft.com/en-us/library/ff393716(v=ws.10).aspx"},"enablecredsspsupport")),(0,i.yg)("li",{parentName:"ul"},(0,i.yg)("a",{parentName:"li",href:"https://superuser.com/questions/951330/windows-10-remote-desktop-connection-using-azure-ad-credentials"},"superuser.com fix reference")),(0,i.yg)("li",{parentName:"ul"},(0,i.yg)("a",{parentName:"li",href:"https://morgansimonsen.com/2015/11/06/connecting-to-an-azure-ad-joined-machine-with-remote-desktop/"},"morgansimonsen blog")),(0,i.yg)("li",{parentName:"ul"},(0,i.yg)("a",{parentName:"li",href:"http://c7solutions.com/2016/05/remote-desktop-and-login-with-azuread-account"},"c7 solutions")))),(0,i.yg)("h2",{id:"appendix"},"Appendix"),(0,i.yg)("p",null,(0,i.yg)("strong",{parentName:"p"},"Full working RDP file used in this post:")),(0,i.yg)("p",null,"Just change the ",(0,i.yg)("inlineCode",{parentName:"p"},"full address:s:192.168.1.3")," part the IP of the PC you want to connect to, copy and paste this into a txt file and save it as an .rdp file."),(0,i.yg)("pre",null,(0,i.yg)("code",{parentName:"pre",className:"language-ini"},"screen mode id:i:2\nuse multimon:i:0\ndesktopwidth:i:1366\ndesktopheight:i:768\nsession bpp:i:32\nwinposstr:s:0,3,0,0,800,600\ncompression:i:1\nkeyboardhook:i:2\naudiocapturemode:i:0\nvideoplaybackmode:i:1\nconnection type:i:7\nnetworkautodetect:i:1\nbandwidthautodetect:i:1\ndisplayconnectionbar:i:1\nenableworkspacereconnect:i:0\ndisable wallpaper:i:0\nallow font smoothing:i:0\nallow desktop composition:i:0\ndisable full window drag:i:1\ndisable menu anims:i:1\ndisable themes:i:0\ndisable cursor setting:i:0\nbitmapcachepersistenable:i:1\nfull address:s:192.168.1.3\naudiomode:i:0\nredirectprinters:i:1\nredirectcomports:i:0\nredirectsmartcards:i:1\nredirectclipboard:i:1\nredirectposdevices:i:0\nautoreconnection enabled:i:1\nauthentication level:i:2\nprompt for credentials:i:0\nnegotiate security layer:i:1\nremoteapplicationmode:i:0\nalternate shell:s:\nshell working directory:s:\ngatewayhostname:s:\ngatewayusagemethod:i:4\ngatewaycredentialssource:i:4\ngatewayprofileusagemethod:i:0\npromptcredentialonce:i:0\ngatewaybrokeringtype:i:0\nuse redirection server name:i:0\nrdgiskdcproxy:i:0\nkdcproxyname:s:\nenablecredsspsupport:i:0\n")))}d.isMDXComponent=!0},28433:(e,n,t)=>{t.d(n,{A:()=>o});const o=t.p+"assets/images/azure-rdp-credsno-df9ef355ff99f54c64dc8efc2a3dce1d.png"},47191:(e,n,t)=>{t.d(n,{A:()=>o});const o=t.p+"assets/images/azure-rdp-firstcertscreen-ec10bd92561e9db982d96ac68bc47b76.png"},42986:(e,n,t)=>{t.d(n,{A:()=>o});const o=t.p+"assets/images/azure-rdp-firstlogin-a693e3e9bf15ecadb2c5f9e36c16535e.png"},42988:(e,n,t)=>{t.d(n,{A:()=>o});const o=t.p+"assets/images/azure-rdp-settings-3a48865569eb7c93fc472a779fdcfea3.png"},20745:(e,n,t)=>{t.d(n,{A:()=>o});const o=t.p+"assets/images/azure-rdp-startrdp-7b07f9e08198b32a74a259ce7ae52967.png"},85290:(e,n,t)=>{t.d(n,{A:()=>o});const o=t.p+"assets/images/azure-rdp-success-0560ff2f121cbf3102aa9b7b75821ec7.png"}}]);