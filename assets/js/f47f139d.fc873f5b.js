"use strict";(self.webpackChunkronamosa_github_io=self.webpackChunkronamosa_github_io||[]).push([[61945],{15680:(e,t,n)=>{n.d(t,{xA:()=>h,yg:()=>c});var i=n(96540);function l(e,t,n){return t in e?Object.defineProperty(e,t,{value:n,enumerable:!0,configurable:!0,writable:!0}):e[t]=n,e}function s(e,t){var n=Object.keys(e);if(Object.getOwnPropertySymbols){var i=Object.getOwnPropertySymbols(e);t&&(i=i.filter((function(t){return Object.getOwnPropertyDescriptor(e,t).enumerable}))),n.push.apply(n,i)}return n}function a(e){for(var t=1;t<arguments.length;t++){var n=null!=arguments[t]?arguments[t]:{};t%2?s(Object(n),!0).forEach((function(t){l(e,t,n[t])})):Object.getOwnPropertyDescriptors?Object.defineProperties(e,Object.getOwnPropertyDescriptors(n)):s(Object(n)).forEach((function(t){Object.defineProperty(e,t,Object.getOwnPropertyDescriptor(n,t))}))}return e}function o(e,t){if(null==e)return{};var n,i,l=function(e,t){if(null==e)return{};var n,i,l={},s=Object.keys(e);for(i=0;i<s.length;i++)n=s[i],t.indexOf(n)>=0||(l[n]=e[n]);return l}(e,t);if(Object.getOwnPropertySymbols){var s=Object.getOwnPropertySymbols(e);for(i=0;i<s.length;i++)n=s[i],t.indexOf(n)>=0||Object.prototype.propertyIsEnumerable.call(e,n)&&(l[n]=e[n])}return l}var r=i.createContext({}),g=function(e){var t=i.useContext(r),n=t;return e&&(n="function"==typeof e?e(t):a(a({},t),e)),n},h=function(e){var t=g(e.components);return i.createElement(r.Provider,{value:t},e.children)},p="mdxType",u={inlineCode:"code",wrapper:function(e){var t=e.children;return i.createElement(i.Fragment,{},t)}},m=i.forwardRef((function(e,t){var n=e.components,l=e.mdxType,s=e.originalType,r=e.parentName,h=o(e,["components","mdxType","originalType","parentName"]),p=g(n),m=l,c=p["".concat(r,".").concat(m)]||p[m]||u[m]||s;return n?i.createElement(c,a(a({ref:t},h),{},{components:n})):i.createElement(c,a({ref:t},h))}));function c(e,t){var n=arguments,l=t&&t.mdxType;if("string"==typeof e||l){var s=n.length,a=new Array(s);a[0]=m;var o={};for(var r in t)hasOwnProperty.call(t,r)&&(o[r]=t[r]);o.originalType=e,o[p]="string"==typeof e?e:l,a[1]=o;for(var g=2;g<s;g++)a[g]=n[g];return i.createElement.apply(null,a)}return i.createElement.apply(null,n)}m.displayName="MDXCreateElement"},77896:(e,t,n)=>{n.r(t),n.d(t,{assets:()=>r,contentTitle:()=>a,default:()=>u,frontMatter:()=>s,metadata:()=>o,toc:()=>g});var i=n(58168),l=(n(96540),n(15680));const s={title:"Terminal and OMZ Prompt Setup"},a=void 0,o={unversionedId:"engineer/LAB/Terminal",id:"engineer/LAB/Terminal",title:"Terminal and OMZ Prompt Setup",description:"terminal",source:"@site/docs/engineer/LAB/Terminal.md",sourceDirName:"engineer/LAB",slug:"/engineer/LAB/Terminal",permalink:"/docs/engineer/LAB/Terminal",draft:!1,editUrl:"https://github.com/ronamosa/ronamosa.github.io/edit/main/website/docs/engineer/LAB/Terminal.md",tags:[],version:"current",frontMatter:{title:"Terminal and OMZ Prompt Setup"},sidebar:"docsSidebar",previous:{title:"SecretHub: Secrets Management",permalink:"/docs/engineer/K8s/2020-08-17-Secrethub-Secret-Management"},next:{title:"PiHole DNS",permalink:"/docs/engineer/LAB/pihole-dns"}},r={},g=[{value:"Pre-requisites",id:"pre-requisites",level:2},{value:"Remove existing install",id:"remove-existing-install",level:3},{value:"Install ZSH",id:"install-zsh",level:3},{value:"Install oh-my-zsh",id:"install-oh-my-zsh",level:2},{value:"default ~/.zshrc",id:"default-zshrc",level:3},{value:"Make oh-my-zsh default shell",id:"make-oh-my-zsh-default-shell",level:3},{value:"Powerlevel10k Theme",id:"powerlevel10k-theme",level:2},{value:"Plugins",id:"plugins",level:2},{value:"zsh-autocomplete &amp;&amp; zsh-autosuggestions",id:"zsh-autocomplete--zsh-autosuggestions",level:3},{value:"zsh-syntax-highlighting &amp;&amp; fast-syntax-highlighting",id:"zsh-syntax-highlighting--fast-syntax-highlighting",level:2}],h={toc:g},p="wrapper";function u(e){let{components:t,...s}=e;return(0,l.yg)(p,(0,i.A)({},h,s,{components:t,mdxType:"MDXLayout"}),(0,l.yg)("p",null,(0,l.yg)("img",{alt:"terminal",src:n(20879).A,width:"890",height:"152"})),(0,l.yg)("p",null,"Documenting how I set my terminal up with ",(0,l.yg)("inlineCode",{parentName:"p"},"oh-my-zsh"),", ",(0,l.yg)("inlineCode",{parentName:"p"},"powerlevel10k")," theme and plugins. I use Gnomes ",(0,l.yg)("a",{parentName:"p",href:"https://gnome-terminator.org/"},"terminator")," terminal with tmux."),(0,l.yg)("h2",{id:"pre-requisites"},"Pre-requisites"),(0,l.yg)("h3",{id:"remove-existing-install"},"Remove existing install"),(0,l.yg)("p",null,"from terminal: ",(0,l.yg)("inlineCode",{parentName:"p"},"uninstall_oh_my_zsh")),(0,l.yg)("h3",{id:"install-zsh"},"Install ZSH"),(0,l.yg)("p",null,"from terminal: ",(0,l.yg)("inlineCode",{parentName:"p"},"sudo apt install zsh")),(0,l.yg)("h2",{id:"install-oh-my-zsh"},"Install oh-my-zsh"),(0,l.yg)("p",null,"visit ",(0,l.yg)("a",{parentName:"p",href:"https://ohmyz.sh/#install"},"oh-my-zsh"),":"),(0,l.yg)("p",null,(0,l.yg)("inlineCode",{parentName:"p"},'sh -c "$(curl -fsSL https://raw.githubusercontent.com/ohmyzsh/ohmyzsh/master/tools/install.sh)"')),(0,l.yg)("h3",{id:"default-zshrc"},"default ~/.zshrc"),(0,l.yg)("p",null,"I've stripped most of the comments out to leave the active lines"),(0,l.yg)("pre",null,(0,l.yg)("code",{parentName:"pre",className:"language-sh"},'# If you come from bash you might have to change your $PATH.\n# export PATH=$HOME/bin:/usr/local/bin:$PATH\n\n# Path to your oh-my-zsh installation.\nexport ZSH="$HOME/.oh-my-zsh"\n\n# theme\nZSH_THEME="robbyrussell"\n\n# Uncomment the following line to use case-sensitive completion.\nCASE_SENSITIVE="true"\n\n# Which plugins would you like to load?\n# Standard plugins can be found in $ZSH/plugins/\nplugins=(git)\n\n# reload zsh config\nsource $ZSH/oh-my-zsh.sh\n')),(0,l.yg)("h3",{id:"make-oh-my-zsh-default-shell"},"Make oh-my-zsh default shell"),(0,l.yg)("p",null,"Run: ",(0,l.yg)("inlineCode",{parentName:"p"},"$ sudo chsh -s $(which zsh) $(whoami)"),"."),(0,l.yg)("p",null,"Close and re-open your terminal."),(0,l.yg)("h2",{id:"powerlevel10k-theme"},"Powerlevel10k Theme"),(0,l.yg)("p",null,"Follow instructions ",(0,l.yg)("a",{parentName:"p",href:"https://bytexd.com/install-powerlevel10k-zsh-theme-with-oh-my-zsh/"},"here"),"."),(0,l.yg)("p",null,(0,l.yg)("inlineCode",{parentName:"p"},"git clone --depth=1 https://github.com/romkatv/powerlevel10k.git ${ZSH_CUSTOM:-$HOME/.oh-my-zsh/custom}/themes/powerlevel10k")),(0,l.yg)("p",null,"edit ",(0,l.yg)("inlineCode",{parentName:"p"},"~/.zshrc"),", find & change ",(0,l.yg)("inlineCode",{parentName:"p"},"ZSH_THEME")," to below:"),(0,l.yg)("pre",null,(0,l.yg)("code",{parentName:"pre",className:"language-sh"},'ZSH_THEME="powerlevel10k/powerlevel10k"\n')),(0,l.yg)("p",null,"reload config with ",(0,l.yg)("inlineCode",{parentName:"p"},"$ source ~/.zshrc")),(0,l.yg)("admonition",{type:"note"},(0,l.yg)("p",{parentName:"admonition"},"After you source your zsrhc file and run through powerlevel10k config, you get a new ",(0,l.yg)("inlineCode",{parentName:"p"},"~/.p10k.zsh")," and updated ",(0,l.yg)("inlineCode",{parentName:"p"},"~/.zshrc"),".")),(0,l.yg)("p",null,"this gets added to the bottom of your ",(0,l.yg)("inlineCode",{parentName:"p"},"~/.zshrc")," file:"),(0,l.yg)("pre",null,(0,l.yg)("code",{parentName:"pre",className:"language-sh"},"# To customize prompt, run `p10k configure` or edit ~/.p10k.zsh.\n[[ ! -f ~/.p10k.zsh ]] || source ~/.p10k.zsh\n")),(0,l.yg)("h2",{id:"plugins"},"Plugins"),(0,l.yg)("p",null,"Reference: ",(0,l.yg)("a",{parentName:"p",href:"https://github.com/ohmyzsh/ohmyzsh/wiki/Plugins"},"docs"),"."),(0,l.yg)("p",null,"Follow these ",(0,l.yg)("a",{parentName:"p",href:"https://gist.github.com/n1snt/454b879b8f0b7995740ae04c5fb5b7df"},"instructions")," for my plugins setup."),(0,l.yg)("h3",{id:"zsh-autocomplete--zsh-autosuggestions"},"zsh-autocomplete && zsh-autosuggestions"),(0,l.yg)("p",null,"Install both plugins to help with commands autosuggestions suggests possible commands, autocomplete completes the command without needing to press ",(0,l.yg)("inlineCode",{parentName:"p"},"tab")," to see the full command."),(0,l.yg)("p",null,(0,l.yg)("img",{alt:"autosuggestions",src:n(60276).A,width:"686",height:"99"})),(0,l.yg)("p",null,"zsh-autosuggestions: ",(0,l.yg)("inlineCode",{parentName:"p"},"git clone https://github.com/zsh-users/zsh-autosuggestions.git $ZSH_CUSTOM/plugins/zsh-autosuggestions")),(0,l.yg)("p",null,(0,l.yg)("img",{alt:"autocompletes",src:n(4055).A,width:"798",height:"271"})),(0,l.yg)("p",null,"zsh-autocomplete: ",(0,l.yg)("inlineCode",{parentName:"p"},"git clone --depth 1 -- https://github.com/marlonrichert/zsh-autocomplete.git $ZSH_CUSTOM/plugins/zsh-autocomplete")),(0,l.yg)("p",null,"Run each command to install plugins."),(0,l.yg)("h2",{id:"zsh-syntax-highlighting--fast-syntax-highlighting"},"zsh-syntax-highlighting && fast-syntax-highlighting"),(0,l.yg)("ol",null,(0,l.yg)("li",{parentName:"ol"},"zsh-syntax-highlighting: ",(0,l.yg)("inlineCode",{parentName:"li"},"git clone https://github.com/zsh-users/zsh-syntax-highlighting.git $ZSH_CUSTOM/plugins/zsh-syntax-highlighting")),(0,l.yg)("li",{parentName:"ol"},"fast-syntax-highlighting: ",(0,l.yg)("inlineCode",{parentName:"li"},"git clone https://github.com/zdharma-continuum/fast-syntax-highlighting.git ${ZSH_CUSTOM:-$HOME/.oh-my-zsh/custom}/plugins/fast-syntax-highlighting"))),(0,l.yg)("p",null,"Run each command to install plugins."),(0,l.yg)("p",null,"Update your ",(0,l.yg)("inlineCode",{parentName:"p"},"~/.zshrc")," with the following line:"),(0,l.yg)("pre",null,(0,l.yg)("code",{parentName:"pre",className:"language-sh"},"plugins=(git zsh-autosuggestions zsh-syntax-highlighting fast-syntax-highlighting zsh-autocomplete)\n")),(0,l.yg)("p",null,"reload config with ",(0,l.yg)("inlineCode",{parentName:"p"},"source ~/.zshrc")))}u.isMDXComponent=!0},4055:(e,t,n)=>{n.d(t,{A:()=>i});const i=n.p+"assets/images/terminal-autocompletes-d076796cbec644c7f4cb736591932613.png"},60276:(e,t,n)=>{n.d(t,{A:()=>i});const i=n.p+"assets/images/terminal-autosuggestions-0d81b77b041a1449de97bf7096e4644b.png"},20879:(e,t,n)=>{n.d(t,{A:()=>i});const i=n.p+"assets/images/terminal-omz-p10k-137613bbecde9dad5a3db0be1824be89.png"}}]);