---
title: "Docusaurus + GitHub Pages"
---

I can't believe I haven't documented this before.

In order to use GH pages and get your `gh-pages` branch setup properly for docusaurus, do the following:

## GH Repository

if your files are under `/website` for example, run the following commands in that dir:

```bash
cd website/
npm install # if you see docusaurus not found, run install

# now install gh-pages pkg
npm install gh-pages --save-dev

```

this should now get you your `docusaurus deploy` commands and also insert this in your `website/package.json`

```json
"scripts": {
  "deploy": "docusaurus deploy"
}
```

### Build & Deploy

now build your site: `npm run build`

deploy it, which will copy your build files to `gh-pages` and push it to GitHub: `npm run deploy`

```bash
~/Repos/technesianlivestream.github.io/website on   main  ❯ npm run deploy                                                                                       at  22:39:25

> website@0.0.0 deploy
> docusaurus deploy


   ╭────────────────────────────────────────────────────────────────────────────────────────────────────────────────╮
   │                                                                                                                │
   │                                         Update available 2.3.1 → 3.0.1                                         │
   │                                                                                                                │
   │                To upgrade Docusaurus packages with the latest version, run the following command:              │
   │     `npm i @docusaurus/core@latest @docusaurus/preset-classic@latest @docusaurus/module-type-aliases@latest`   │
   │                                                                                                                │
   ╰────────────────────────────────────────────────────────────────────────────────────────────────────────────────╯

[WARNING] When deploying to GitHub Pages, it is better to use an explicit "trailingSlash" site config.
Otherwise, GitHub Pages will add an extra trailing slash to your site urls only on direct-access (not when navigation) with a server redirect.
This behavior can have SEO impacts and create relative link issues.

[INFO] Deploy command invoked...
[INFO] organizationName: technesianlivestream
[INFO] projectName: technesianlivestream.github.io
[ERROR] Error: For GitHub pages organization deployments, 'docusaurus deploy' does not assume anymore that 'master' is your default Git branch.
Please provide the branch name to deploy to as an environment variable, for example DEPLOYMENT_BRANCH=main or DEPLOYMENT_BRANCH=master .
You can also set the deploymentBranch property in docusaurus.config.js .
    at Command.deploy (/Users/ramosa/Repos/technesianlivestream.github.io/website/node_modules/@docusaurus/core/lib/commands/deploy.js:102:15)
[INFO] Docusaurus version: 2.3.1
Node version: v18.16.1
```

### set `DEPLOYMENT_BRANCH`

set with `export DEPLOYMENT_BRANCH=gh-pages` cos that's where we're deploying from.

re-run: `npm run deploy`

```bash
~/Repos/technesianlivestream.github.io/website on   main  ❯ npm run deploy                                                                                       at  22:41:07

> website@0.0.0 deploy
> docusaurus deploy


   ╭────────────────────────────────────────────────────────────────────────────────────────────────────────────────╮
   │                                                                                                                │
   │                                         Update available 2.3.1 → 3.0.1                                         │
   │                                                                                                                │
   │                To upgrade Docusaurus packages with the latest version, run the following command:              │
   │     `npm i @docusaurus/core@latest @docusaurus/preset-classic@latest @docusaurus/module-type-aliases@latest`   │
   │                                                                                                                │
   ╰────────────────────────────────────────────────────────────────────────────────────────────────────────────────╯

[WARNING] When deploying to GitHub Pages, it is better to use an explicit "trailingSlash" site config.
Otherwise, GitHub Pages will add an extra trailing slash to your site urls only on direct-access (not when navigation) with a server redirect.
This behavior can have SEO impacts and create relative link issues.

[INFO] Deploy command invoked...
[INFO] organizationName: technesianlivestream
[INFO] projectName: technesianlivestream.github.io
[INFO] deploymentBranch: gh-pages
[INFO] Remote repo URL: git@github.com:technesianlivestream/technesianlivestream.github.io.git
5a0c1888dae41ab90bb45ced89531eb475e72d42
[INFO] `git rev-parse HEAD` code: 0
[INFO] [en] Creating an optimized production build...
Browserslist: caniuse-lite is outdated. Please run:
  npx update-browserslist-db@latest
  Why you should do it regularly: https://github.com/browserslist/update-db#readme

✔ Client


✔ Server
  Compiled successfully in 9.71s

[BABEL] Note: The code generator has deoptimised the styling of /Users/ramosa/Repos/technesianlivestream.github.io/website/static/img/cloud.svg as it exceeds the max of 500KB.
[BABEL] Note: The code generator has deoptimised the styling of undefined as it exceeds the max of 500KB.
[BABEL] Note: The code generator has deoptimised the styling of /Users/ramosa/Repos/technesianlivestream.github.io/website/static/img/cloud.svg as it exceeds the max of 500KB.
[BABEL] Note: The code generator has deoptimised the styling of undefined as it exceeds the max of 500KB.
Browserslist: caniuse-lite is outdated. Please run:
  npx update-browserslist-db@latest
  Why you should do it regularly: https://github.com/browserslist/update-db#readme

✔ Client


● Server █████████████████████████ cache (99%) shutdown IdleFileCachePlugin
 stored

[SUCCESS] Generated static files in "build".
[INFO] Use `npm run serve` command to test your build locally.
Cloning into '/var/folders/kd/2pwbps0n4tl4cz7km7wm63100000gn/T/technesianlivestream.github.io-gh-pages4kCawi'...
warning: Could not find remote branch gh-pages to clone.
fatal: Remote branch gh-pages not found in upstream origin
[INFO] `git clone --depth 1 --branch gh-pages git@github.com:technesianlivestream/technesianlivestream.github.io.git "/var/folders/kd/2pwbps0n4tl4cz7km7wm63100000gn/T/technesianlivestream.github.io-gh-pages4kCawi"` code: 128
Initialized empty Git repository in /private/var/folders/kd/2pwbps0n4tl4cz7km7wm63100000gn/T/technesianlivestream.github.io-gh-pages4kCawi/.git/
[INFO] `git init` code: 0
Switched to a new branch 'gh-pages'
[INFO] `git checkout -b gh-pages` code: 0
[INFO] `git remote add origin git@github.com:technesianlivestream/technesianlivestream.github.io.git` code: 0
[INFO] `git add --all` code: 0
[gh-pages (root-commit) eff59c3] Deploy website - based on 5a0c1888dae41ab90bb45ced89531eb475e72d42
 80 files changed, 847 insertions(+)
 create mode 100644 .nojekyll
 create mode 100644 404.html
 create mode 100644 about/index.html
 create mode 100644 assets/css/styles.92ac0275.css
 ...
 ...
 ...
 create mode 100644 markdown-page/index.html
 create mode 100644 sitemap.xml
[INFO] `git commit -m "Deploy website - based on 5a0c1888dae41ab90bb45ced89531eb475e72d42"` code: 0
remote:
remote: Create a pull request for 'gh-pages' on GitHub by visiting:
remote:      https://github.com/technesianlivestream/technesianlivestream.github.io/pull/new/gh-pages
remote:
To github.com:technesianlivestream/technesianlivestream.github.io.git
 * [new branch]      gh-pages -> gh-pages
[INFO] `git push --force origin gh-pages` code: 0
Website is live at "https://technesianlivestream.github.io/".
```

**Success!!**

:::warning

I was getting into issues with `npm run deploy` when trying to setup `gh-pages` because it kept asking for my GH password while trying to push to the `http` endpoint, realised this was becuse I was in a dev container pushing from that context.

Note, this successful push was from a non-dev-container environment on my M2 Macbook

:::

## On GitHub

Under "Settings" for your repo, set your `pages` to have `Deploy from a branch` and `gh-pages` as your branch, with `/(root)` as your directory:

![gh pages](/img/docusaurus-setup-ghpages.png)

## GitHub Actions Permissions

In this context, I am a collaborator on the technesianlivestream account & repo, I don't the required permissions so I'm getting this error:

```bash
Pushing website/build directory to gh-pages branch on technesianlivestream/technesianlivestream.github.io repo
  /usr/bin/git push --force ***github.com/technesianlivestream/technesianlivestream.github.io.git gh-pages
  remote: Permission to technesianlivestream/technesianlivestream.github.io.git denied to github-actions[bot].
  fatal: unable to access 'https://github.com/technesianlivestream/technesianlivestream.github.io.git/': The requested URL returned error: 403
  Error: The process '/usr/bin/git' failed with exit code 128
```

Checkout -> Settings -> Actions -> General

### Current Permissions

![no perms](/img/docusaurus-setup-ghperms1.png)

### Required Permissions

![required perms](/img/docusaurus-setup-ghperms2.png)