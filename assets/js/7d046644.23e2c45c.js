"use strict";(self.webpackChunkronamosa_github_io=self.webpackChunkronamosa_github_io||[]).push([[94394],{15680:(n,e,t)=>{t.d(e,{xA:()=>g,yg:()=>m});var l=t(96540);function i(n,e,t){return e in n?Object.defineProperty(n,e,{value:t,enumerable:!0,configurable:!0,writable:!0}):n[e]=t,n}function a(n,e){var t=Object.keys(n);if(Object.getOwnPropertySymbols){var l=Object.getOwnPropertySymbols(n);e&&(l=l.filter((function(e){return Object.getOwnPropertyDescriptor(n,e).enumerable}))),t.push.apply(t,l)}return t}function o(n){for(var e=1;e<arguments.length;e++){var t=null!=arguments[e]?arguments[e]:{};e%2?a(Object(t),!0).forEach((function(e){i(n,e,t[e])})):Object.getOwnPropertyDescriptors?Object.defineProperties(n,Object.getOwnPropertyDescriptors(t)):a(Object(t)).forEach((function(e){Object.defineProperty(n,e,Object.getOwnPropertyDescriptor(t,e))}))}return n}function s(n,e){if(null==n)return{};var t,l,i=function(n,e){if(null==n)return{};var t,l,i={},a=Object.keys(n);for(l=0;l<a.length;l++)t=a[l],e.indexOf(t)>=0||(i[t]=n[t]);return i}(n,e);if(Object.getOwnPropertySymbols){var a=Object.getOwnPropertySymbols(n);for(l=0;l<a.length;l++)t=a[l],e.indexOf(t)>=0||Object.prototype.propertyIsEnumerable.call(n,t)&&(i[t]=n[t])}return i}var r=l.createContext({}),p=function(n){var e=l.useContext(r),t=e;return n&&(t="function"==typeof n?n(e):o(o({},e),n)),t},g=function(n){var e=p(n.components);return l.createElement(r.Provider,{value:e},n.children)},c="mdxType",u={inlineCode:"code",wrapper:function(n){var e=n.children;return l.createElement(l.Fragment,{},e)}},d=l.forwardRef((function(n,e){var t=n.components,i=n.mdxType,a=n.originalType,r=n.parentName,g=s(n,["components","mdxType","originalType","parentName"]),c=p(t),d=i,m=c["".concat(r,".").concat(d)]||c[d]||u[d]||a;return t?l.createElement(m,o(o({ref:e},g),{},{components:t})):l.createElement(m,o({ref:e},g))}));function m(n,e){var t=arguments,i=e&&e.mdxType;if("string"==typeof n||i){var a=t.length,o=new Array(a);o[0]=d;var s={};for(var r in e)hasOwnProperty.call(e,r)&&(s[r]=e[r]);s.originalType=n,s[c]="string"==typeof n?n:i,o[1]=s;for(var p=2;p<a;p++)o[p]=t[p];return l.createElement.apply(null,o)}return l.createElement.apply(null,t)}d.displayName="MDXCreateElement"},17881:(n,e,t)=>{t.r(e),t.d(e,{assets:()=>r,contentTitle:()=>o,default:()=>u,frontMatter:()=>a,metadata:()=>s,toc:()=>p});var l=t(58168),i=(t(96540),t(15680));const a={title:"PrivateGPT on Linux (ProxMox): Local, Secure, Private, Chat with My Docs."},o=void 0,s={unversionedId:"engineer/AI/PrivateGPT",id:"engineer/AI/PrivateGPT",title:"PrivateGPT on Linux (ProxMox): Local, Secure, Private, Chat with My Docs.",description:"header",source:"@site/docs/engineer/AI/PrivateGPT.md",sourceDirName:"engineer/AI",slug:"/engineer/AI/PrivateGPT",permalink:"/docs/engineer/AI/PrivateGPT",draft:!1,editUrl:"https://github.com/ronamosa/ronamosa.github.io/edit/main/website/docs/engineer/AI/PrivateGPT.md",tags:[],version:"current",frontMatter:{title:"PrivateGPT on Linux (ProxMox): Local, Secure, Private, Chat with My Docs."},sidebar:"docsSidebar",previous:{title:"Mistral-7B using Ollama on AWS SageMaker",permalink:"/docs/engineer/AI/Mistral-7B-SageMaker"},next:{title:"Markdown features",permalink:"/docs/engineer/AI/PrivateGPTAWS"}},r={},p=[{value:"Requirements",id:"requirements",level:2},{value:"Specs",id:"specs",level:3},{value:"Installation",id:"installation",level:2},{value:"pyenv",id:"pyenv",level:3},{value:"Poetry",id:"poetry",level:3},{value:"Runtime",id:"runtime",level:2},{value:"Output",id:"output",level:3},{value:"Troubleshooting",id:"troubleshooting",level:2},{value:"Appendix",id:"appendix",level:2}],g={toc:p},c="wrapper";function u(n){let{components:e,...a}=n;return(0,i.yg)(c,(0,l.A)({},g,a,{components:e,mdxType:"MDXLayout"}),(0,i.yg)("p",null,(0,i.yg)("img",{alt:"header",src:t(80549).A,width:"1189",height:"333"})),(0,i.yg)("admonition",{type:"info"},(0,i.yg)("p",{parentName:"admonition"},"Following ",(0,i.yg)("a",{parentName:"p",href:"https://www.youtube.com/watch?v=XFiof0V3nhA&ab_channel=MatthewBerman"},"PrivateGPT 2.0 - FULLY LOCAL Chat With Docs (PDF, TXT, HTML, PPTX, DOCX, and more)")," by Matthew Berman.")),(0,i.yg)("h2",{id:"requirements"},"Requirements"),(0,i.yg)("ul",null,(0,i.yg)("li",{parentName:"ul"},"PrivateGPT ",(0,i.yg)("a",{parentName:"li",href:"https://github.com/imartinez/privateGPT.git"},"repo")),(0,i.yg)("li",{parentName:"ul"},"PrivateGPT Installation ",(0,i.yg)("a",{parentName:"li",href:"https://docs.privategpt.dev/installation"},"docs")),(0,i.yg)("li",{parentName:"ul"},(0,i.yg)("a",{parentName:"li",href:"https://python-poetry.org/docs/#installation"},"Poetry"))),(0,i.yg)("h3",{id:"specs"},"Specs"),(0,i.yg)("p",null,"Created an VM on proxmox, running:"),(0,i.yg)("pre",null,(0,i.yg)("code",{parentName:"pre",className:"language-text"},'bot@ai:~/projects/privateGPT$ cat /etc/*release*\nDISTRIB_ID=Ubuntu\nDISTRIB_RELEASE=22.04\nDISTRIB_CODENAME=jammy\nDISTRIB_DESCRIPTION="Ubuntu 22.04.3 LTS"\nPRETTY_NAME="Ubuntu 22.04.3 LTS"\nNAME="Ubuntu"\nVERSION_ID="22.04"\nVERSION="22.04.3 LTS (Jammy Jellyfish)"\nVERSION_CODENAME=jammy\nID=ubuntu\nID_LIKE=debian\nHOME_URL="https://www.ubuntu.com/"\nSUPPORT_URL="https://help.ubuntu.com/"\nBUG_REPORT_URL="https://bugs.launchpad.net/ubuntu/"\nPRIVACY_POLICY_URL="https://www.ubuntu.com/legal/terms-and-policies/privacy-policy"\nUBUNTU_CODENAME=jammy\n')),(0,i.yg)("p",null,"I didn't upgrade to these specs until after I'd built & ran everything (slow):"),(0,i.yg)("p",null,(0,i.yg)("img",{alt:"proxmox vm hw specs",src:t(80622).A,width:"567",height:"207"})),(0,i.yg)("h2",{id:"installation"},"Installation"),(0,i.yg)("h3",{id:"pyenv"},"pyenv"),(0,i.yg)("ul",null,(0,i.yg)("li",{parentName:"ul"},"clone repo"),(0,i.yg)("li",{parentName:"ul"},"install pyenv")),(0,i.yg)("pre",null,(0,i.yg)("code",{parentName:"pre",className:"language-bash"},'git clone https://github.com/imartinez/privateGPT\ncd privateGPT\n\n# install script pyenv\ncurl https://pyenv.run | bash\n\n# add to ~/.bashrc\nexport PYENV_ROOT="$HOME/.pyenv"\n[[ -d $PYENV_ROOT/bin ]] && export PATH="$PYENV_ROOT/bin:$PATH"\neval "$(pyenv init -)"\n\n')),(0,i.yg)("ul",null,(0,i.yg)("li",{parentName:"ul"},"Install python 3.11 in our pyenv")),(0,i.yg)("pre",null,(0,i.yg)("code",{parentName:"pre",className:"language-bash"},'\n# install libs\npyenv install 3.11\n\nDownloading Python-3.11.6.tar.xz...\n-> https://www.python.org/ftp/python/3.11.6/Python-3.11.6.tar.xz\nInstalling Python-3.11.6...\n\nTraceback (most recent call last):\n  File "<string>", line 1, in <module>\n  File "/home/bot/.pyenv/versions/3.11.6/lib/python3.11/bz2.py", line 17, in <module>\n    from _bz2 import BZ2Compressor, BZ2Decompressor\nModuleNotFoundError: No module named \'_bz2\'\nWARNING: The Python bz2 extension was not compiled. Missing the bzip2 lib?\nTraceback (most recent call last):\n  File "<string>", line 1, in <module>\n  File "/home/bot/.pyenv/versions/3.11.6/lib/python3.11/curses/__init__.py", line 13, in <module>\n    from _curses import *\nModuleNotFoundError: No module named \'_curses\'\nWARNING: The Python curses extension was not compiled. Missing the ncurses lib?\nTraceback (most recent call last):\n  File "<string>", line 1, in <module>\n  File "/home/bot/.pyenv/versions/3.11.6/lib/python3.11/ctypes/__init__.py", line 8, in <module>\n    from _ctypes import Union, Structure, Array\nModuleNotFoundError: No module named \'_ctypes\'\nWARNING: The Python ctypes extension was not compiled. Missing the libffi lib?\nTraceback (most recent call last):\n  File "<string>", line 1, in <module>\nModuleNotFoundError: No module named \'readline\'\nWARNING: The Python readline extension was not compiled. Missing the GNU readline lib?\nTraceback (most recent call last):\n  File "<string>", line 1, in <module>\n  File "/home/bot/.pyenv/versions/3.11.6/lib/python3.11/sqlite3/__init__.py", line 57, in <module>\n    from sqlite3.dbapi2 import *\n  File "/home/bot/.pyenv/versions/3.11.6/lib/python3.11/sqlite3/dbapi2.py", line 27, in <module>\n    from _sqlite3 import *\nModuleNotFoundError: No module named \'_sqlite3\'\nWARNING: The Python sqlite3 extension was not compiled. Missing the SQLite3 lib?\nTraceback (most recent call last):\n  File "<string>", line 1, in <module>\n  File "/home/bot/.pyenv/versions/3.11.6/lib/python3.11/lzma.py", line 27, in <module>\n    from _lzma import *\nModuleNotFoundError: No module named \'_lzma\'\nWARNING: The Python lzma extension was not compiled. Missing the lzma lib?\nInstalled Python-3.11.6 to /home/bot/.pyenv/versions/3.11.6\n')),(0,i.yg)("ul",null,(0,i.yg)("li",{parentName:"ul"},"Install missing libs"),(0,i.yg)("li",{parentName:"ul"},"Install ",(0,i.yg)("inlineCode",{parentName:"li"},"local 3.11"))),(0,i.yg)("pre",null,(0,i.yg)("code",{parentName:"pre",className:"language-bash"},"\n# install missing libs\nsudo apt update\nsudo apt install libbz2-dev libncurses5-dev libncursesw5-dev libreadline-dev libsqlite3-dev libssl-dev libffi-dev zlib1g-dev liblzma-dev\n\n# success\nbot@ai:~/projects/privateGPT$ pyenv install 3.11\npyenv: /home/bot/.pyenv/versions/3.11.6 already exists\ncontinue with installation? (y/N) y\nDownloading Python-3.11.6.tar.xz...\n-> https://www.python.org/ftp/python/3.11.6/Python-3.11.6.tar.xz\nInstalling Python-3.11.6...\nInstalled Python-3.11.6 to /home/bot/.pyenv/versions/3.11.6\n\n# install\npyenv local 3.11\n")),(0,i.yg)("h3",{id:"poetry"},"Poetry"),(0,i.yg)("pre",null,(0,i.yg)("code",{parentName:"pre",className:"language-bash"},"curl -sSL https://install.python-poetry.org | python3 -\n\nRetrieving Poetry metadata\n\n# Welcome to Poetry!\n\nThis will download and install the latest version of Poetry,\na dependency and package manager for Python.\n\nIt will add the `poetry` command to Poetry's bin directory, located at:\n\n/home/bot/.local/bin\n\nYou can uninstall at any time by executing this script with the --uninstall option,\nand these changes will be reverted.\n\nInstalling Poetry (1.7.1): Done\n\nPoetry (1.7.1) is installed now. Great!\n\nTo get started you need Poetry's bin directory (/home/bot/.local/bin) in your `PATH`\nenvironment variable.\n\nAdd `export PATH=\"/home/bot/.local/bin:$PATH\"` to your shell configuration file.\n\nAlternatively, you can call Poetry explicitly with `/home/bot/.local/bin/poetry`.\n\nYou can test that everything is set up by executing:\n\n`poetry --version`\n")),(0,i.yg)("ul",null,(0,i.yg)("li",{parentName:"ul"},"add to ~/.bashrc for poetry: ",(0,i.yg)("inlineCode",{parentName:"li"},'export PATH="/home/bot/.local/bin:$PATH"')),(0,i.yg)("li",{parentName:"ul"},"install poetry ui")),(0,i.yg)("pre",null,(0,i.yg)("code",{parentName:"pre",className:"language-bash"},"bot@ai:~/projects/privateGPT$ poetry install --with ui\nInstalling dependencies from lock file\n\nPackage operations: 26 installs, 0 updates, 0 removals\n\n  \u2022 Installing mdurl (0.1.2)\n  \u2022 Installing referencing (0.31.0)\n  \u2022 Installing jsonschema-specifications (2023.11.1)\n  \u2022 Installing markdown-it-py (3.0.0)\n  \u2022 Installing pygments (2.17.1)\n  \u2022 Installing colorama (0.4.6)\n  \u2022 Installing contourpy (1.2.0)\n  \u2022 Installing cycler (0.12.1)\n  \u2022 Installing fonttools (4.44.3)\n  \u2022 Installing jsonschema (4.20.0)\n  \u2022 Installing kiwisolver (1.4.5)\n  \u2022 Installing pyparsing (3.1.1)\n  \u2022 Installing rich (13.7.0)\n  \u2022 Installing shellingham (1.5.4)\n  \u2022 Installing toolz (0.12.0)\n  \u2022 Installing aiofiles (23.2.1)\n  \u2022 Installing altair (5.1.2)\n  \u2022 Installing ffmpy (0.3.1)\n  \u2022 Installing gradio-client (0.7.0)\n  \u2022 Installing importlib-resources (6.1.1)\n  \u2022 Installing matplotlib (3.8.2)\n  \u2022 Installing pydub (0.25.1)\n  \u2022 Installing semantic-version (2.10.0)\n  \u2022 Installing tomlkit (0.12.0)\n  \u2022 Installing typer (0.9.0)\n  \u2022 Installing gradio (4.4.1)\n\nInstalling the current project: private-gpt (0.1.0)\n")),(0,i.yg)("ul",null,(0,i.yg)("li",{parentName:"ul"},"install poetry local")),(0,i.yg)("pre",null,(0,i.yg)("code",{parentName:"pre",className:"language-bash"},"bot@ai:~/projects/privateGPT$ poetry install --with local\nInstalling dependencies from lock file\n\nPackage operations: 121 installs, 0 updates, 0 removals\n\n  \u2022 Installing nvidia-cublas-cu12 (12.1.3.1): Installing...\nInstalling /home/bot/.cache/pypoetry/virtualenvs/private-gpt-QHOAK4Be-py3.11/lib/python3.11/site-packages/nvidia/__init__.py over exist\n  \u2022 Installing nvidia-cublas-cu12 (12.1.3.1)\n  \u2022 Installing deprecated (1.2.14)\n  \u2022 Installing h11 (0.14.0)\n  \u2022 Installing huggingface-hub (0.19.4)\n  \u2022 Installing humanfriendly (10.0): Downloading... 0%\n  \u2022 Installing jinja2 (3.1.2): Downloading... 0%\n  \u2022 Installing humanfriendly (10.0)\n  \u2022 Installing jinja2 (3.1.2)\n  \u2022 Installing multiprocess (0.70.15)\n  \u2022 Installing networkx (3.2.1)\n  \u2022 Installing nvidia-cuda-cupti-cu12 (12.1.105): Installing...\n  \u2022 Installing nvidia-cuda-nvrtc-cu12 (12.1.105): Downloading... 60%\n  \u2022 Installing nvidia-cuda-runtime-cu12 (12.1.105)\n  \u2022 Installing nvidia-cuda-nvrtc-cu12 (12.1.105): Installing...\n  \u2022 Installing nvidia-cuda-cupti-cu12 (12.1.105)\n  \u2022 Installing nvidia-cuda-nvrtc-cu12 (12.1.105)\n  \u2022 Installing nvidia-cuda-runtime-cu12 (12.1.105)\n  \u2022 Installing nvidia-cudnn-cu12 (8.9.2.26): Downloading... 4%\n  \u2022 Installing nvidia-cufft-cu12 (11.0.2.54): Downloading... 30%\n  \u2022 Installing nvidia-cudnn-cu12 (8.9.2.26): Downloading... 7%\n  \u2022 Installing nvidia-cufft-cu12 (11.0.2.54): Downloading... 53%\n  \u2022 Installing nvidia-cudnn-cu12 (8.9.2.26): Downloading... 18%\n  \u2022 Installing nvidia-cufft-cu12 (11.0.2.54): Installing...\n  \u2022 Installing nvidia-cudnn-cu12 (8.9.2.26): Downloading... 20%\n  \u2022 Installing nvidia-cufft-cu12 (11.0.2.54): Installing...\n  \u2022 Installing nvidia-cudnn-cu12 (8.9.2.26): Downloading... 86%\n  \u2022 Installing nvidia-cufft-cu12 (11.0.2.54)\n  \u2022 Installing nvidia-cudnn-cu12 (8.9.2.26): Installing...\n  \u2022 Installing nvidia-cufft-cu12 (11.0.2.54)\n  \u2022 Installing nvidia-cudnn-cu12 (8.9.2.26)\n  \u2022 Installing nvidia-cufft-cu12 (11.0.2.54)\n  \u2022 Installing nvidia-curand-cu12 (10.3.2.106)\n  \u2022 Installing nvidia-cusolver-cu12 (11.4.5.107)\n  \u2022 Installing nvidia-nccl-cu12 (2.18.1)\n  \u2022 Installing nvidia-nvtx-cu12 (12.1.105)\n  \u2022 Installing pandas (2.1.3)\n  \u2022 Installing protobuf (4.25.1)\n  \u2022 Installing pyarrow (14.0.1)\n  \u2022 Installing pyarrow-hotfix (0.5)\n  \u2022 Installing sniffio (1.3.0)\n  \u2022 Installing sympy (1.12)\n  \u2022 Installing triton (2.1.0)\n  \u2022 Installing xxhash (3.4.1)\n  \u2022 Installing annotated-types (0.6.0)\n  \u2022 Installing anyio (3.7.1)\n  \u2022 Installing coloredlogs (15.0.1)\n  \u2022 Installing datasets (2.15.0)\n  \u2022 Installing flatbuffers (23.5.26)\n  \u2022 Installing hpack (4.0.0)\n  \u2022 Installing httpcore (1.0.2)\n  \u2022 Installing hyperframe (6.0.1)\n  \u2022 Installing jmespath (1.0.1)\n  \u2022 Installing mypy-extensions (1.0.0)\n  \u2022 Installing psutil (5.9.6)\n  \u2022 Installing pydantic-core (2.14.3)\n  \u2022 Installing regex (2023.10.3)\n  \u2022 Installing responses (0.18.0)\n  \u2022 Installing safetensors (0.4.0)\n  \u2022 Installing sentencepiece (0.1.99)\n  \u2022 Installing tokenizers (0.15.0)\n  \u2022 Installing torch (2.1.1)\n  \u2022 Installing accelerate (0.24.1)\n  \u2022 Installing botocore (1.32.3): Installing...\n  \u2022 Installing botocore (1.32.3)\n  \u2022 Installing click (8.1.7)\n  \u2022 Installing distlib (0.3.7)\n  \u2022 Installing distro (1.8.0)\n  \u2022 Installing dnspython (2.4.2)\n  \u2022 Installing evaluate (0.4.1)\n  \u2022 Installing greenlet (3.0.1)\n  \u2022 Installing grpcio (1.59.3)\n  \u2022 Installing h2 (4.1.0)\n  \u2022 Installing httptools (0.6.1)\n  \u2022 Installing httpx (0.25.1)\n  \u2022 Installing iniconfig (2.0.0)\n  \u2022 Installing joblib (1.3.2)\n  \u2022 Installing marshmallow (3.20.1)\n  \u2022 Installing onnx (1.15.0)\n  \u2022 Installing onnxruntime (1.16.2)\n  \u2022 Installing pillow (10.1.0)\n  \u2022 Installing platformdirs (3.11.0)\n  \u2022 Installing pluggy (1.3.0)\n  \u2022 Installing pydantic (2.5.1)\n  \u2022 Installing python-dotenv (1.0.0)\n  \u2022 Installing scipy (1.11.4)\n  \u2022 Installing soupsieve (2.5)\n  \u2022 Installing starlette (0.27.0)\n  \u2022 Installing threadpoolctl (3.2.0)\n  \u2022 Installing transformers (4.35.2)\n  \u2022 Installing typing-inspect (0.9.0)\n  \u2022 Installing uvloop (0.19.0)\n  \u2022 Installing watchfiles (0.21.0)\n  \u2022 Installing websockets (11.0.3)\n  \u2022 Installing aiostream (0.5.2)\n  \u2022 Installing beautifulsoup4 (4.12.2)\n  \u2022 Installing cfgv (3.4.0)\n  \u2022 Installing coverage (7.3.2)\n  \u2022 Installing dataclasses-json (0.5.14)\n  \u2022 Installing diskcache (5.6.3)\n  \u2022 Installing email-validator (2.1.0.post1)\n  \u2022 Installing fastapi (0.103.2)\n  \u2022 Installing grpcio-tools (1.59.3)\n  \u2022 Installing identify (2.5.32)\n  \u2022 Installing itsdangerous (2.1.2)\n  \u2022 Installing nest-asyncio (1.5.8)\n  \u2022 Installing nltk (3.8.1)\n  \u2022 Installing nodeenv (1.8.0)\n  \u2022 Installing openai (1.3.3)\n  \u2022 Installing optimum (1.14.1)\n  \u2022 Installing orjson (3.9.10)\n  \u2022 Installing pathspec (0.11.2)\n  \u2022 Installing portalocker (2.8.2)\n  \u2022 Installing pydantic-extra-types (2.1.0)\n  \u2022 Installing pydantic-settings (2.1.0)\n  \u2022 Installing pytest (7.4.3)\n  \u2022 Installing python-multipart (0.0.6)\n  \u2022 Installing s3transfer (0.7.0)\n  \u2022 Installing scikit-learn (1.3.2)\n  \u2022 Installing sqlalchemy (2.0.23)\n  \u2022 Installing tenacity (8.2.3)\n  \u2022 Installing tiktoken (0.5.1)\n  \u2022 Installing torchvision (0.16.1)\n  \u2022 Installing ujson (5.8.0)\n  \u2022 Installing uvicorn (0.24.0.post1)\n  \u2022 Installing virtualenv (20.24.6)\n  \u2022 Installing black (22.12.0)\n  \u2022 Installing boto3 (1.29.3)\n  \u2022 Installing injector (0.21.0)\n  \u2022 Installing llama-cpp-python (0.2.18)\n  \u2022 Installing llama-index (0.9.3)\n  \u2022 Installing mypy (1.7.0)\n  \u2022 Installing pre-commit (2.21.0)\n  \u2022 Installing pypdf (3.17.1)\n  \u2022 Installing pytest-asyncio (0.21.1)\n  \u2022 Installing pytest-cov (3.0.0)\n  \u2022 Installing qdrant-client (1.6.9)\n  \u2022 Installing ruff (0.1.6)\n  \u2022 Installing sentence-transformers (2.2.2)\n  \u2022 Installing types-pyyaml (6.0.12.12)\n  \u2022 Installing watchdog (3.0.0)\n\nInstalling the current project: private-gpt (0.1.0)\n")),(0,i.yg)("h2",{id:"runtime"},"Runtime"),(0,i.yg)("p",null,"Run setup: ",(0,i.yg)("inlineCode",{parentName:"p"},"poetry run python scripts/setup")),(0,i.yg)("pre",null,(0,i.yg)("code",{parentName:"pre",className:"language-bash"},"bot@ai:~/projects/privateGPT$ poetry run python scripts/setup\n19:22:40.707 [INFO    ] private_gpt.settings.settings_loader - Starting application with profiles=['default']\nDownloading embedding BAAI/bge-small-en-v1.5\nconfig.json: 100%|\u2588\u2588\u2588\u2588\u2588\u2588\u2588\u2588\u2588\u2588\u2588\u2588\u2588\u2588\u2588\u2588\u2588\u2588\u2588\u2588\u2588\u2588\u2588\u2588\u2588\u2588\u2588\u2588\u2588\u2588\u2588\u2588\u2588\u2588\u2588\u2588\u2588\u2588\u2588\u2588\u2588\u2588\u2588\u2588\u2588\u2588\u2588\u2588\u2588\u2588\u2588\u2588\u2588\u2588\u2588\u2588\u2588\u2588\u2588\u2588\u2588\u2588\u2588\u2588\u2588\u2588\u2588\u2588\u2588\u2588\u2588\u2588\u2588\u2588\u2588\u2588\u2588\u2588\u2588\u2588\u2588\u2588\u2588\u2588\u2588\u2588\u2588\u2588| 743/743 [00:00<00:00, 2.45MB/s]\nspecial_tokens_map.json: 100%|\u2588\u2588\u2588\u2588\u2588\u2588\u2588\u2588\u2588\u2588\u2588\u2588\u2588\u2588\u2588\u2588\u2588\u2588\u2588\u2588\u2588\u2588\u2588\u2588\u2588\u2588\u2588\u2588\u2588\u2588\u2588\u2588\u2588\u2588\u2588\u2588\u2588\u2588\u2588\u2588\u2588\u2588\u2588\u2588\u2588\u2588\u2588\u2588\u2588\u2588\u2588\u2588\u2588\u2588\u2588\u2588\u2588\u2588\u2588\u2588\u2588\u2588\u2588\u2588\u2588\u2588\u2588\u2588\u2588\u2588\u2588\u2588\u2588\u2588\u2588\u2588\u2588| 125/125 [00:00<00:00, 624kB/s]\nREADME.md: 100%|\u2588\u2588\u2588\u2588\u2588\u2588\u2588\u2588\u2588\u2588\u2588\u2588\u2588\u2588\u2588\u2588\u2588\u2588\u2588\u2588\u2588\u2588\u2588\u2588\u2588\u2588\u2588\u2588\u2588\u2588\u2588\u2588\u2588\u2588\u2588\u2588\u2588\u2588\u2588\u2588\u2588\u2588\u2588\u2588\u2588\u2588\u2588\u2588\u2588\u2588\u2588\u2588\u2588\u2588\u2588\u2588\u2588\u2588\u2588\u2588\u2588\u2588\u2588\u2588\u2588\u2588\u2588\u2588\u2588\u2588\u2588\u2588\u2588\u2588\u2588\u2588\u2588\u2588\u2588\u2588\u2588\u2588\u2588\u2588\u2588\u2588\u2588| 90.3k/90.3k [00:00<00:00, 405kB/s]\n.gitattributes: 100%|\u2588\u2588\u2588\u2588\u2588\u2588\u2588\u2588\u2588\u2588\u2588\u2588\u2588\u2588\u2588\u2588\u2588\u2588\u2588\u2588\u2588\u2588\u2588\u2588\u2588\u2588\u2588\u2588\u2588\u2588\u2588\u2588\u2588\u2588\u2588\u2588\u2588\u2588\u2588\u2588\u2588\u2588\u2588\u2588\u2588\u2588\u2588\u2588\u2588\u2588\u2588\u2588\u2588\u2588\u2588\u2588\u2588\u2588\u2588\u2588\u2588\u2588\u2588\u2588\u2588\u2588\u2588\u2588\u2588\u2588\u2588\u2588\u2588\u2588\u2588\u2588\u2588\u2588\u2588\u2588\u2588| 1.52k/1.52k [00:00<00:00, 7.71MB/s]\nmodules.json: 100%|\u2588\u2588\u2588\u2588\u2588\u2588\u2588\u2588\u2588\u2588\u2588\u2588\u2588\u2588\u2588\u2588\u2588\u2588\u2588\u2588\u2588\u2588\u2588\u2588\u2588\u2588\u2588\u2588\u2588\u2588\u2588\u2588\u2588\u2588\u2588\u2588\u2588\u2588\u2588\u2588\u2588\u2588\u2588\u2588\u2588\u2588\u2588\u2588\u2588\u2588\u2588\u2588\u2588\u2588\u2588\u2588\u2588\u2588\u2588\u2588\u2588\u2588\u2588\u2588\u2588\u2588\u2588\u2588\u2588\u2588\u2588\u2588\u2588\u2588\u2588\u2588\u2588\u2588\u2588\u2588\u2588\u2588\u2588\u2588\u2588\u2588\u2588| 349/349 [00:00<00:00, 1.80MB/s]\nconfig_sentence_transformers.json: 100%|\u2588\u2588\u2588\u2588\u2588\u2588\u2588\u2588\u2588\u2588\u2588\u2588\u2588\u2588\u2588\u2588\u2588\u2588\u2588\u2588\u2588\u2588\u2588\u2588\u2588\u2588\u2588\u2588\u2588\u2588\u2588\u2588\u2588\u2588\u2588\u2588\u2588\u2588\u2588\u2588\u2588\u2588\u2588\u2588\u2588\u2588\u2588\u2588\u2588\u2588\u2588\u2588\u2588\u2588\u2588\u2588\u2588\u2588\u2588\u2588\u2588\u2588\u2588\u2588\u2588\u2588\u2588| 124/124 [00:00<00:00, 914kB/s]\nsentence_bert_config.json: 100%|\u2588\u2588\u2588\u2588\u2588\u2588\u2588\u2588\u2588\u2588\u2588\u2588\u2588\u2588\u2588\u2588\u2588\u2588\u2588\u2588\u2588\u2588\u2588\u2588\u2588\u2588\u2588\u2588\u2588\u2588\u2588\u2588\u2588\u2588\u2588\u2588\u2588\u2588\u2588\u2588\u2588\u2588\u2588\u2588\u2588\u2588\u2588\u2588\u2588\u2588\u2588\u2588\u2588\u2588\u2588\u2588\u2588\u2588\u2588\u2588\u2588\u2588\u2588\u2588\u2588\u2588\u2588\u2588\u2588\u2588\u2588\u2588\u2588| 52.0/52.0 [00:00<00:00, 258kB/s]\n1_Pooling/config.json: 100%|\u2588\u2588\u2588\u2588\u2588\u2588\u2588\u2588\u2588\u2588\u2588\u2588\u2588\u2588\u2588\u2588\u2588\u2588\u2588\u2588\u2588\u2588\u2588\u2588\u2588\u2588\u2588\u2588\u2588\u2588\u2588\u2588\u2588\u2588\u2588\u2588\u2588\u2588\u2588\u2588\u2588\u2588\u2588\u2588\u2588\u2588\u2588\u2588\u2588\u2588\u2588\u2588\u2588\u2588\u2588\u2588\u2588\u2588\u2588\u2588\u2588\u2588\u2588\u2588\u2588\u2588\u2588\u2588\u2588\u2588\u2588\u2588\u2588\u2588\u2588\u2588\u2588\u2588| 190/190 [00:00<00:00, 1.36MB/s]\ntokenizer_config.json: 100%|\u2588\u2588\u2588\u2588\u2588\u2588\u2588\u2588\u2588\u2588\u2588\u2588\u2588\u2588\u2588\u2588\u2588\u2588\u2588\u2588\u2588\u2588\u2588\u2588\u2588\u2588\u2588\u2588\u2588\u2588\u2588\u2588\u2588\u2588\u2588\u2588\u2588\u2588\u2588\u2588\u2588\u2588\u2588\u2588\u2588\u2588\u2588\u2588\u2588\u2588\u2588\u2588\u2588\u2588\u2588\u2588\u2588\u2588\u2588\u2588\u2588\u2588\u2588\u2588\u2588\u2588\u2588\u2588\u2588\u2588\u2588\u2588\u2588\u2588\u2588\u2588\u2588\u2588| 366/366 [00:00<00:00, 2.34MB/s]\ntokenizer.json: 100%|\u2588\u2588\u2588\u2588\u2588\u2588\u2588\u2588\u2588\u2588\u2588\u2588\u2588\u2588\u2588\u2588\u2588\u2588\u2588\u2588\u2588\u2588\u2588\u2588\u2588\u2588\u2588\u2588\u2588\u2588\u2588\u2588\u2588\u2588\u2588\u2588\u2588\u2588\u2588\u2588\u2588\u2588\u2588\u2588\u2588\u2588\u2588\u2588\u2588\u2588\u2588\u2588\u2588\u2588\u2588\u2588\u2588\u2588\u2588\u2588\u2588\u2588\u2588\u2588\u2588\u2588\u2588\u2588\u2588\u2588\u2588\u2588\u2588\u2588\u2588\u2588\u2588\u2588\u2588\u2588\u2588\u2588\u2588| 711k/711k [00:00<00:00, 1.07MB/s]\nvocab.txt: 100%|\u2588\u2588\u2588\u2588\u2588\u2588\u2588\u2588\u2588\u2588\u2588\u2588\u2588\u2588\u2588\u2588\u2588\u2588\u2588\u2588\u2588\u2588\u2588\u2588\u2588\u2588\u2588\u2588\u2588\u2588\u2588\u2588\u2588\u2588\u2588\u2588\u2588\u2588\u2588\u2588\u2588\u2588\u2588\u2588\u2588\u2588\u2588\u2588\u2588\u2588\u2588\u2588\u2588\u2588\u2588\u2588\u2588\u2588\u2588\u2588\u2588\u2588\u2588\u2588\u2588\u2588\u2588\u2588\u2588\u2588\u2588\u2588\u2588\u2588\u2588\u2588\u2588\u2588\u2588\u2588\u2588\u2588\u2588\u2588\u2588\u2588\u2588\u2588\u2588| 232k/232k [00:00<00:00, 520kB/s]\npytorch_model.bin: 100%|\u2588\u2588\u2588\u2588\u2588\u2588\u2588\u2588\u2588\u2588\u2588\u2588\u2588\u2588\u2588\u2588\u2588\u2588\u2588\u2588\u2588\u2588\u2588\u2588\u2588\u2588\u2588\u2588\u2588\u2588\u2588\u2588\u2588\u2588\u2588\u2588\u2588\u2588\u2588\u2588\u2588\u2588\u2588\u2588\u2588\u2588\u2588\u2588\u2588\u2588\u2588\u2588\u2588\u2588\u2588\u2588\u2588\u2588\u2588\u2588\u2588\u2588\u2588\u2588\u2588\u2588\u2588\u2588\u2588\u2588\u2588\u2588\u2588\u2588\u2588\u2588\u2588\u2588\u2588\u2588| 134M/134M [00:06<00:00, 21.3MB/s]\nFetching 12 files: 100%|\u2588\u2588\u2588\u2588\u2588\u2588\u2588\u2588\u2588\u2588\u2588\u2588\u2588\u2588\u2588\u2588\u2588\u2588\u2588\u2588\u2588\u2588\u2588\u2588\u2588\u2588\u2588\u2588\u2588\u2588\u2588\u2588\u2588\u2588\u2588\u2588\u2588\u2588\u2588\u2588\u2588\u2588\u2588\u2588\u2588\u2588\u2588\u2588\u2588\u2588\u2588\u2588\u2588\u2588\u2588\u2588\u2588\u2588\u2588\u2588\u2588\u2588\u2588\u2588\u2588\u2588\u2588\u2588\u2588\u2588\u2588\u2588\u2588\u2588\u2588\u2588\u2588\u2588\u2588\u2588\u2588\u2588\u2588| 12/12 [00:08<00:00,  1.45it/s]\nEmbedding model downloaded!\u2588\u2588\u2588\u2588\u2588\u2588\u2588\u2588\u2588\u2588\u2588\u2588\u2588\u2588\u2588\u2588\u2588\u2588\u2588\u2588\u2588\u2588\u2588\u2588\u2588\u2588\u2588\u2588\u2588\u2588\u2588\u2588\u2588\u2588\u2588\u2588\u2588\u2588\u2588\u2588\u2588\u2588\u2588\u2588\u2588\u2588\u2588\u2588\u2588\u2588\u2588\u2588\u2588\u2588\u2588\u2588\u2588\u2588\u2588\u2588\u2588\u2588\u2588\u2588\u2588\u2588\u2588\u2588\u2588\u2588\u2588\u2588\u2588\u2588\u2588\u2588\u2588| 134M/134M [00:06<00:00, 24.1MB/s]\nDownloading models for local execution...\nmistral-7b-instruct-v0.1.Q4_K_M.gguf: 100%|\u2588\u2588\u2588\u2588\u2588\u2588\u2588\u2588\u2588\u2588\u2588\u2588\u2588\u2588\u2588\u2588\u2588\u2588\u2588\u2588\u2588\u2588\u2588\u2588\u2588\u2588\u2588\u2588\u2588\u2588\u2588\u2588\u2588\u2588\u2588\u2588\u2588\u2588\u2588\u2588\u2588\u2588\u2588\u2588\u2588\u2588\u2588\u2588\u2588\u2588\u2588\u2588\u2588\u2588\u2588\u2588\u2588\u2588\u2588| 4.37G/4.37G [03:14<00:00, 22.4MB/s]\nLLM model downloaded!\nSetup done\n")),(0,i.yg)("p",null,"Launch PrivateGPT API and start the UI."),(0,i.yg)("p",null,"Because we've gone with poetry for dependencies, we launch PrivateGPT with poetry"),(0,i.yg)("pre",null,(0,i.yg)("code",{parentName:"pre",className:"language-bash"},"poetry run python -m private_gpt #OR\n\n")),(0,i.yg)("p",null,"output"),(0,i.yg)("pre",null,(0,i.yg)("code",{parentName:"pre",className:"language-bash"},"bot@ai:~/projects/privateGPT$ poetry run python -m private_gpt\n19:39:12.334 [INFO    ] private_gpt.settings.settings_loader - Starting application with profiles=['default']\n19:39:16.976 [INFO    ]   matplotlib.font_manager - generated new fontManager\n19:39:21.028 [INFO    ] private_gpt.components.llm.llm_component - Initializing the LLM in mode=local\nllama_model_loader: loaded meta data with 20 key-value pairs and 291 tensors from /home/bot/projects/privateGPT/models/mistral-7b-instruct-v0.1.Q4_K_M.gguf (version GGUF V2)\nllama_model_loader: - tensor    0:                token_embd.weight q4_K     [  4096, 32000,     1,     1 ]\nllama_model_loader: - tensor    1:              blk.0.attn_q.weight q4_K     [  4096,  4096,     1,     1 ]\nllama_model_loader: - tensor    2:              blk.0.attn_k.weight q4_K     [  4096,  1024,     1,     1 ]\nllama_model_loader: - tensor    3:              blk.0.attn_v.weight q6_K     [  4096,  1024,     1,     1 ]\nllama_model_loader: - tensor    4:         blk.0.attn_output.weight q4_K     [  4096,  4096,     1,     1 ]\nllama_model_loader: - tensor    5:            blk.0.ffn_gate.weight q4_K     [  4096, 14336,     1,     1 ]\n...\n...\n\nllama_new_context_with_model: compute buffer total size = 276.93 MB\nAVX = 0 | AVX2 = 0 | AVX512 = 0 | AVX512_VBMI = 0 | AVX512_VNNI = 0 | FMA = 0 | NEON = 0 | ARM_FMA = 0 | F16C = 0 | FP16_VA = 0 | WASM_SIMD = 0 | BLAS = 0 | SSE3 = 1 | SSSE3 = 0 | VSX = 0 | \n20:05:13.917 [INFO    ] private_gpt.components.embedding.embedding_component - Initializing the embedding model in mode=local\n20:05:37.693 [INFO    ] llama_index.indices.loading - Loading all indices.\n20:05:38.059 [INFO    ]         private_gpt.ui.ui - Mounting the gradio UI, at path=/\n20:05:38.350 [INFO    ]             uvicorn.error - Started server process [789035]\n20:05:38.350 [INFO    ]             uvicorn.error - Waiting for application startup.\n20:05:38.352 [INFO    ]             uvicorn.error - Application startup complete.\n20:05:38.369 [INFO    ]             uvicorn.error - Uvicorn running on http://0.0.0.0:8001 (Press CTRL+C to quit)\n")),(0,i.yg)("p",null,"Open webserver where API is running onport 8001, for me that's my local box ",(0,i.yg)("inlineCode",{parentName:"p"},"http://ai.darksyde.lan:8001")),(0,i.yg)("p",null,(0,i.yg)("img",{alt:"PrivateGPT UI",src:t(64041).A,width:"2520",height:"1378"})),(0,i.yg)("admonition",{title:"Performance",type:"warning"},(0,i.yg)("p",{parentName:"admonition"},"The performance for simple requests, understandably, is very, very ",(0,i.yg)("strong",{parentName:"p"},"slow")," because I'm just using CPU with specs in the ",(0,i.yg)("a",{parentName:"p",href:"#specs"},"specs")," section."),(0,i.yg)("p",{parentName:"admonition"},"Seriously consider a GPU rig.")),(0,i.yg)("h3",{id:"output"},"Output"),(0,i.yg)("p",null,"What the LLM chat looks like"),(0,i.yg)("p",null,(0,i.yg)("img",{alt:"gui output",src:t(11297).A,width:"1091",height:"862"})),(0,i.yg)("p",null,(0,i.yg)("img",{alt:"console output",src:t(25387).A,width:"1920",height:"1080"})),(0,i.yg)("admonition",{title:"Ingestion",type:"tip"},(0,i.yg)("p",{parentName:"admonition"},"This is interested, bulk doc ingestion: ",(0,i.yg)("a",{parentName:"p",href:"https://docs.privategpt.dev/manual/document-management/ingestion"},"https://docs.privategpt.dev/manual/document-management/ingestion"))),(0,i.yg)("h2",{id:"troubleshooting"},"Troubleshooting"),(0,i.yg)("p",null,"I uploaded a PDF"),(0,i.yg)("pre",null,(0,i.yg)("code",{parentName:"pre",className:"language-bash"},"pypdf.errors.DependencyError: cryptography>=3.1 is required for AES algorithm\n")),(0,i.yg)("p",null,'I asked it "who is the prime minister of new zealand?"'),(0,i.yg)("pre",null,(0,i.yg)("code",{parentName:"pre",className:"language-bash"},"AttributeError: 'NoneType' object has no attribute 'split'\nTraceback (most recent call last):\n  File \"/home/bot/.cache/pypoetry/virtualenvs/private-gpt-QHOAK4Be-py3.11/lib/python3.11/site-packages/gradio/queueing.py\", line 456, in call_prediction\n    output = await route_utils.call_process_api(\n")),(0,i.yg)("h2",{id:"appendix"},"Appendix"),(0,i.yg)("pre",null,(0,i.yg)("code",{parentName:"pre",className:"language-bash"},'# if you build with poetry, but try to run it locally = errors, no deps.\nbot@ai:~/projects/privateGPT$ python3.11 -m private_gpt\nTraceback (most recent call last):\n  File "<frozen runpy>", line 198, in _run_module_as_main\n  File "<frozen runpy>", line 88, in _run_code\n  File "/home/bot/projects/privateGPT/private_gpt/__main__.py", line 3, in <module>\n    import uvicorn\nModuleNotFoundError: No module named \'uvicorn\'\n')))}u.isMDXComponent=!0},25387:(n,e,t)=>{t.d(e,{A:()=>l});const l=t.p+"assets/images/privategpt-console-f13473a0bf768e8d30b17c4186982e00.png"},64041:(n,e,t)=>{t.d(e,{A:()=>l});const l=t.p+"assets/images/privategpt-gui-b78284de973c770a7d47befbdd7ea311.png"},80549:(n,e,t)=>{t.d(e,{A:()=>l});const l=t.p+"assets/images/privategpt-header-764251a173a64d34501491f87c165390.png"},80622:(n,e,t)=>{t.d(e,{A:()=>l});const l=t.p+"assets/images/privategpt-hw-specs-fef25fac32200c54c2e2b0085ea77ec5.png"},11297:(n,e,t)=>{t.d(e,{A:()=>l});const l=t.p+"assets/images/privategpt-success-e4135946b7df878d32b64b842feb7545.png"}}]);