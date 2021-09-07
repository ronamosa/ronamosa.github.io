# ronamosa.io

This website is built using [Docusaurus 2](https://docusaurus.io/), a modern static website generator.

## Installation

```console
npm install --save @fortawesome/free-brands-svg-icons
npm install --save @docusaurus/theme-live-codeblock
```

This cli is "nice to have" but not required for this project.

`gh` cli install

```cosole
curl -fsSL https://cli.github.com/packages/githubcli-archive-keyring.gpg | sudo gpg --dearmor -o /usr/share/keyrings/githubcli-archive-keyring.gpg

echo "deb [arch=$(dpkg --print-architecture) signed-by=/usr/share/keyrings/githubcli-archive-keyring.gpg] https://cli.github.com/packages stable main" | sudo tee /etc/apt/sources.list.d/github-cli.list > /dev/null

sudo apt update
sudo apt install gh
```

## Local Development

```console
npm start
```

This command starts a local development server and opens up a browser window. Most changes are reflected live without having to restart the server.

## Build

```console
npm run build
```

debug and fix broken things until build is successful.

## Deployment

GitHub Actions via `/.github/workflows/deploy-docusaurus.yml`

```yaml
name: deploy-docusaurus

on:
  push:
    branches: [main]

  # Allows you to run this workflow manually from the Actions tab
  workflow_dispatch:

# A workflow run is made up of one or more jobs that can run sequentially or in parallel
jobs:
  publish:
    runs-on: ubuntu-latest
    steps:
      # Checks-out your repository under $GITHUB_WORKSPACE, so your job can access it
      - name: Check out repo
        uses: actions/checkout@v2
      # Node is required for npm
      - name: Set up Node
        uses: actions/setup-node@v2
        with:
          node-version: '12'
      # Install and build Docusaurus website
      - name: Build Docusaurus website
        run: |
          cd website
          npm install 
          npm run build
      - name: Deploy to GitHub Pages
        if: success()
        uses: crazy-max/ghaction-github-pages@v2
        with:
          target_branch: gh-pages
          build_dir: website/build
```

go to repo's `Settings` page, go down to `Pages` set the `Source` branch to `gh-pages` and the root folder to `/(root)`.

Click save. When you push anything to `main` branch, your workflow will kick off, install deps, build site, then deploy to the `gh-pages` branch and you see it at `https://ronamosa.github.io/`

