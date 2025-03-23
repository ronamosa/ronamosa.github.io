"use strict";(self.webpackChunkronamosa_github_io=self.webpackChunkronamosa_github_io||[]).push([[23284],{15680:(e,n,t)=>{t.d(n,{xA:()=>c,yg:()=>m});var i=t(96540);function s(e,n,t){return n in e?Object.defineProperty(e,n,{value:t,enumerable:!0,configurable:!0,writable:!0}):e[n]=t,e}function a(e,n){var t=Object.keys(e);if(Object.getOwnPropertySymbols){var i=Object.getOwnPropertySymbols(e);n&&(i=i.filter((function(n){return Object.getOwnPropertyDescriptor(e,n).enumerable}))),t.push.apply(t,i)}return t}function r(e){for(var n=1;n<arguments.length;n++){var t=null!=arguments[n]?arguments[n]:{};n%2?a(Object(t),!0).forEach((function(n){s(e,n,t[n])})):Object.getOwnPropertyDescriptors?Object.defineProperties(e,Object.getOwnPropertyDescriptors(t)):a(Object(t)).forEach((function(n){Object.defineProperty(e,n,Object.getOwnPropertyDescriptor(t,n))}))}return e}function o(e,n){if(null==e)return{};var t,i,s=function(e,n){if(null==e)return{};var t,i,s={},a=Object.keys(e);for(i=0;i<a.length;i++)t=a[i],n.indexOf(t)>=0||(s[t]=e[t]);return s}(e,n);if(Object.getOwnPropertySymbols){var a=Object.getOwnPropertySymbols(e);for(i=0;i<a.length;i++)t=a[i],n.indexOf(t)>=0||Object.prototype.propertyIsEnumerable.call(e,t)&&(s[t]=e[t])}return s}var l=i.createContext({}),u=function(e){var n=i.useContext(l),t=n;return e&&(t="function"==typeof e?e(n):r(r({},n),e)),t},c=function(e){var n=u(e.components);return i.createElement(l.Provider,{value:n},e.children)},d="mdxType",p={inlineCode:"code",wrapper:function(e){var n=e.children;return i.createElement(i.Fragment,{},n)}},g=i.forwardRef((function(e,n){var t=e.components,s=e.mdxType,a=e.originalType,l=e.parentName,c=o(e,["components","mdxType","originalType","parentName"]),d=u(t),g=s,m=d["".concat(l,".").concat(g)]||d[g]||p[g]||a;return t?i.createElement(m,r(r({ref:n},c),{},{components:t})):i.createElement(m,r({ref:n},c))}));function m(e,n){var t=arguments,s=n&&n.mdxType;if("string"==typeof e||s){var a=t.length,r=new Array(a);r[0]=g;var o={};for(var l in n)hasOwnProperty.call(n,l)&&(o[l]=n[l]);o.originalType=e,o[d]="string"==typeof e?e:s,r[1]=o;for(var u=2;u<a;u++)r[u]=t[u];return i.createElement.apply(null,r)}return i.createElement.apply(null,t)}g.displayName="MDXCreateElement"},5165:(e,n,t)=>{t.r(n),t.d(n,{assets:()=>l,contentTitle:()=>r,default:()=>p,frontMatter:()=>a,metadata:()=>o,toc:()=>u});var i=t(58168),s=(t(96540),t(15680));const a={title:"Docusaurus + GitHub Pages"},r=void 0,o={unversionedId:"engineer/Misc/docusaurus-setup",id:"engineer/Misc/docusaurus-setup",title:"Docusaurus + GitHub Pages",description:"I can't believe I haven't documented this before.",source:"@site/docs/engineer/Misc/docusaurus-setup.md",sourceDirName:"engineer/Misc",slug:"/engineer/Misc/docusaurus-setup",permalink:"/docs/engineer/Misc/docusaurus-setup",draft:!1,editUrl:"https://github.com/ronamosa/ronamosa.github.io/edit/main/website/docs/engineer/Misc/docusaurus-setup.md",tags:[],version:"current",frontMatter:{title:"Docusaurus + GitHub Pages"},sidebar:"docsSidebar",previous:{title:"Adding Algolia Search to Docusaurus Site",permalink:"/docs/engineer/Misc/docusaurus-algolia-search"},next:{title:"Part 1 - Architecture, Database and Infrastructure.",permalink:"/docs/archive/docker-wordpress/docker-wordpress-1"}},l={},u=[{value:"GH Repository",id:"gh-repository",level:2},{value:"Build &amp; Deploy",id:"build--deploy",level:3},{value:"set <code>DEPLOYMENT_BRANCH</code>",id:"set-deployment_branch",level:3},{value:"On GitHub",id:"on-github",level:2},{value:"GitHub Actions Permissions",id:"github-actions-permissions",level:2},{value:"Current Permissions",id:"current-permissions",level:3},{value:"Required Permissions",id:"required-permissions",level:3}],c={toc:u},d="wrapper";function p(e){let{components:n,...a}=e;return(0,s.yg)(d,(0,i.A)({},c,a,{components:n,mdxType:"MDXLayout"}),(0,s.yg)("p",null,"I can't believe I haven't documented this before."),(0,s.yg)("p",null,"In order to use GH pages and get your ",(0,s.yg)("inlineCode",{parentName:"p"},"gh-pages")," branch setup properly for docusaurus, do the following:"),(0,s.yg)("h2",{id:"gh-repository"},"GH Repository"),(0,s.yg)("p",null,"if your files are under ",(0,s.yg)("inlineCode",{parentName:"p"},"/website")," for example, run the following commands in that dir:"),(0,s.yg)("pre",null,(0,s.yg)("code",{parentName:"pre",className:"language-bash"},"cd website/\nnpm install # if you see docusaurus not found, run install\n\n# now install gh-pages pkg\nnpm install gh-pages --save-dev\n\n")),(0,s.yg)("p",null,"this should now get you your ",(0,s.yg)("inlineCode",{parentName:"p"},"docusaurus deploy")," commands and also insert this in your ",(0,s.yg)("inlineCode",{parentName:"p"},"website/package.json")),(0,s.yg)("pre",null,(0,s.yg)("code",{parentName:"pre",className:"language-json"},'"scripts": {\n  "deploy": "docusaurus deploy"\n}\n')),(0,s.yg)("h3",{id:"build--deploy"},"Build & Deploy"),(0,s.yg)("p",null,"now build your site: ",(0,s.yg)("inlineCode",{parentName:"p"},"npm run build")),(0,s.yg)("p",null,"deploy it, which will copy your build files to ",(0,s.yg)("inlineCode",{parentName:"p"},"gh-pages")," and push it to GitHub: ",(0,s.yg)("inlineCode",{parentName:"p"},"npm run deploy")),(0,s.yg)("pre",null,(0,s.yg)("code",{parentName:"pre",className:"language-bash"},"~/Repos/technesianlivestream.github.io/website on \uf113 \uf126 main \uf06a \u276f npm run deploy                                                                                       at \uf017 22:39:25\n\n> website@0.0.0 deploy\n> docusaurus deploy\n\n\n   \u256d\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u256e\n   \u2502                                                                                                                \u2502\n   \u2502                                         Update available 2.3.1 \u2192 3.0.1                                         \u2502\n   \u2502                                                                                                                \u2502\n   \u2502                To upgrade Docusaurus packages with the latest version, run the following command:              \u2502\n   \u2502     `npm i @docusaurus/core@latest @docusaurus/preset-classic@latest @docusaurus/module-type-aliases@latest`   \u2502\n   \u2502                                                                                                                \u2502\n   \u2570\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u256f\n\n[WARNING] When deploying to GitHub Pages, it is better to use an explicit \"trailingSlash\" site config.\nOtherwise, GitHub Pages will add an extra trailing slash to your site urls only on direct-access (not when navigation) with a server redirect.\nThis behavior can have SEO impacts and create relative link issues.\n\n[INFO] Deploy command invoked...\n[INFO] organizationName: technesianlivestream\n[INFO] projectName: technesianlivestream.github.io\n[ERROR] Error: For GitHub pages organization deployments, 'docusaurus deploy' does not assume anymore that 'master' is your default Git branch.\nPlease provide the branch name to deploy to as an environment variable, for example DEPLOYMENT_BRANCH=main or DEPLOYMENT_BRANCH=master .\nYou can also set the deploymentBranch property in docusaurus.config.js .\n    at Command.deploy (/Users/ramosa/Repos/technesianlivestream.github.io/website/node_modules/@docusaurus/core/lib/commands/deploy.js:102:15)\n[INFO] Docusaurus version: 2.3.1\nNode version: v18.16.1\n")),(0,s.yg)("h3",{id:"set-deployment_branch"},"set ",(0,s.yg)("inlineCode",{parentName:"h3"},"DEPLOYMENT_BRANCH")),(0,s.yg)("p",null,"set with ",(0,s.yg)("inlineCode",{parentName:"p"},"export DEPLOYMENT_BRANCH=gh-pages")," cos that's where we're deploying from."),(0,s.yg)("p",null,"re-run: ",(0,s.yg)("inlineCode",{parentName:"p"},"npm run deploy")),(0,s.yg)("pre",null,(0,s.yg)("code",{parentName:"pre",className:"language-bash"},'~/Repos/technesianlivestream.github.io/website on \uf113 \uf126 main \uf06a \u276f npm run deploy                                                                                       at \uf017 22:41:07\n\n> website@0.0.0 deploy\n> docusaurus deploy\n\n\n   \u256d\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u256e\n   \u2502                                                                                                                \u2502\n   \u2502                                         Update available 2.3.1 \u2192 3.0.1                                         \u2502\n   \u2502                                                                                                                \u2502\n   \u2502                To upgrade Docusaurus packages with the latest version, run the following command:              \u2502\n   \u2502     `npm i @docusaurus/core@latest @docusaurus/preset-classic@latest @docusaurus/module-type-aliases@latest`   \u2502\n   \u2502                                                                                                                \u2502\n   \u2570\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u256f\n\n[WARNING] When deploying to GitHub Pages, it is better to use an explicit "trailingSlash" site config.\nOtherwise, GitHub Pages will add an extra trailing slash to your site urls only on direct-access (not when navigation) with a server redirect.\nThis behavior can have SEO impacts and create relative link issues.\n\n[INFO] Deploy command invoked...\n[INFO] organizationName: technesianlivestream\n[INFO] projectName: technesianlivestream.github.io\n[INFO] deploymentBranch: gh-pages\n[INFO] Remote repo URL: git@github.com:technesianlivestream/technesianlivestream.github.io.git\n5a0c1888dae41ab90bb45ced89531eb475e72d42\n[INFO] `git rev-parse HEAD` code: 0\n[INFO] [en] Creating an optimized production build...\nBrowserslist: caniuse-lite is outdated. Please run:\n  npx update-browserslist-db@latest\n  Why you should do it regularly: https://github.com/browserslist/update-db#readme\n\n\u2714 Client\n\n\n\u2714 Server\n  Compiled successfully in 9.71s\n\n[BABEL] Note: The code generator has deoptimised the styling of /Users/ramosa/Repos/technesianlivestream.github.io/website/static/img/cloud.svg as it exceeds the max of 500KB.\n[BABEL] Note: The code generator has deoptimised the styling of undefined as it exceeds the max of 500KB.\n[BABEL] Note: The code generator has deoptimised the styling of /Users/ramosa/Repos/technesianlivestream.github.io/website/static/img/cloud.svg as it exceeds the max of 500KB.\n[BABEL] Note: The code generator has deoptimised the styling of undefined as it exceeds the max of 500KB.\nBrowserslist: caniuse-lite is outdated. Please run:\n  npx update-browserslist-db@latest\n  Why you should do it regularly: https://github.com/browserslist/update-db#readme\n\n\u2714 Client\n\n\n\u25cf Server \u2588\u2588\u2588\u2588\u2588\u2588\u2588\u2588\u2588\u2588\u2588\u2588\u2588\u2588\u2588\u2588\u2588\u2588\u2588\u2588\u2588\u2588\u2588\u2588\u2588 cache (99%) shutdown IdleFileCachePlugin\n stored\n\n[SUCCESS] Generated static files in "build".\n[INFO] Use `npm run serve` command to test your build locally.\nCloning into \'/var/folders/kd/2pwbps0n4tl4cz7km7wm63100000gn/T/technesianlivestream.github.io-gh-pages4kCawi\'...\nwarning: Could not find remote branch gh-pages to clone.\nfatal: Remote branch gh-pages not found in upstream origin\n[INFO] `git clone --depth 1 --branch gh-pages git@github.com:technesianlivestream/technesianlivestream.github.io.git "/var/folders/kd/2pwbps0n4tl4cz7km7wm63100000gn/T/technesianlivestream.github.io-gh-pages4kCawi"` code: 128\nInitialized empty Git repository in /private/var/folders/kd/2pwbps0n4tl4cz7km7wm63100000gn/T/technesianlivestream.github.io-gh-pages4kCawi/.git/\n[INFO] `git init` code: 0\nSwitched to a new branch \'gh-pages\'\n[INFO] `git checkout -b gh-pages` code: 0\n[INFO] `git remote add origin git@github.com:technesianlivestream/technesianlivestream.github.io.git` code: 0\n[INFO] `git add --all` code: 0\n[gh-pages (root-commit) eff59c3] Deploy website - based on 5a0c1888dae41ab90bb45ced89531eb475e72d42\n 80 files changed, 847 insertions(+)\n create mode 100644 .nojekyll\n create mode 100644 404.html\n create mode 100644 about/index.html\n create mode 100644 assets/css/styles.92ac0275.css\n ...\n ...\n ...\n create mode 100644 markdown-page/index.html\n create mode 100644 sitemap.xml\n[INFO] `git commit -m "Deploy website - based on 5a0c1888dae41ab90bb45ced89531eb475e72d42"` code: 0\nremote:\nremote: Create a pull request for \'gh-pages\' on GitHub by visiting:\nremote:      https://github.com/technesianlivestream/technesianlivestream.github.io/pull/new/gh-pages\nremote:\nTo github.com:technesianlivestream/technesianlivestream.github.io.git\n * [new branch]      gh-pages -> gh-pages\n[INFO] `git push --force origin gh-pages` code: 0\nWebsite is live at "https://technesianlivestream.github.io/".\n')),(0,s.yg)("p",null,(0,s.yg)("strong",{parentName:"p"},"Success!!")),(0,s.yg)("admonition",{type:"warning"},(0,s.yg)("p",{parentName:"admonition"},"I was getting into issues with ",(0,s.yg)("inlineCode",{parentName:"p"},"npm run deploy")," when trying to setup ",(0,s.yg)("inlineCode",{parentName:"p"},"gh-pages")," because it kept asking for my GH password while trying to push to the ",(0,s.yg)("inlineCode",{parentName:"p"},"http")," endpoint, realised this was becuse I was in a dev container pushing from that context."),(0,s.yg)("p",{parentName:"admonition"},"Note, this successful push was from a non-dev-container environment on my M2 Macbook")),(0,s.yg)("h2",{id:"on-github"},"On GitHub"),(0,s.yg)("p",null,'Under "Settings" for your repo, set your ',(0,s.yg)("inlineCode",{parentName:"p"},"pages")," to have ",(0,s.yg)("inlineCode",{parentName:"p"},"Deploy from a branch")," and ",(0,s.yg)("inlineCode",{parentName:"p"},"gh-pages")," as your branch, with ",(0,s.yg)("inlineCode",{parentName:"p"},"/(root)")," as your directory:"),(0,s.yg)("p",null,(0,s.yg)("img",{alt:"gh pages",src:t(90821).A,width:"1490",height:"928"})),(0,s.yg)("h2",{id:"github-actions-permissions"},"GitHub Actions Permissions"),(0,s.yg)("p",null,"In this context, I am a collaborator on the technesianlivestream account & repo, I don't the required permissions so I'm getting this error:"),(0,s.yg)("pre",null,(0,s.yg)("code",{parentName:"pre",className:"language-bash"},"Pushing website/build directory to gh-pages branch on technesianlivestream/technesianlivestream.github.io repo\n  /usr/bin/git push --force ***github.com/technesianlivestream/technesianlivestream.github.io.git gh-pages\n  remote: Permission to technesianlivestream/technesianlivestream.github.io.git denied to github-actions[bot].\n  fatal: unable to access 'https://github.com/technesianlivestream/technesianlivestream.github.io.git/': The requested URL returned error: 403\n  Error: The process '/usr/bin/git' failed with exit code 128\n")),(0,s.yg)("p",null,"Checkout -> Settings -> Actions -> General"),(0,s.yg)("h3",{id:"current-permissions"},"Current Permissions"),(0,s.yg)("p",null,(0,s.yg)("img",{alt:"no perms",src:t(46875).A,width:"1518",height:"598"})),(0,s.yg)("h3",{id:"required-permissions"},"Required Permissions"),(0,s.yg)("p",null,(0,s.yg)("img",{alt:"required perms",src:t(65664).A,width:"1510",height:"606"})))}p.isMDXComponent=!0},90821:(e,n,t)=>{t.d(n,{A:()=>i});const i=t.p+"assets/images/docusaurus-setup-ghpages-773a1dcc310fc24b3e42b3ed23e0c914.png"},46875:(e,n,t)=>{t.d(n,{A:()=>i});const i=t.p+"assets/images/docusaurus-setup-ghperms1-257cad659c2b2f6b8761e6a7611ef07e.png"},65664:(e,n,t)=>{t.d(n,{A:()=>i});const i=t.p+"assets/images/docusaurus-setup-ghperms2-7ed13aa2b4ab5ea47a7046f900ef0904.png"}}]);