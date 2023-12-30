---
title: "Docusaurus + GitHub Pages"
---

to use GH pages and get your `gh-pages` branch setup properly for docusaurus, do the following:

## In your Repo

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

now build your site: `npm run build`

deploy it, which will copy your build files to `gh-pages` and push it to GitHub: `npm run deploy`

## On GitHub

settings -> deploy from branch -> `source=gh-pages` and folder is `/`
