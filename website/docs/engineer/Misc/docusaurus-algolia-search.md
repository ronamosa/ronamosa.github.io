---
title: "Adding Algolia Search to Docusaurus Site"
---

## Introduction

This is a walk-through of what it took for me to make my blog & digital garden [ronamosa.io](https://ronamosa.io/) searchable using [Algolia](https://www.algolia.com/users/sign_in). I had the added benefit of using Cloudflare CDN in front of my website, so that needed to be taken into account as well.

If you get it all right, you get this:

![algolia search](/img/algolia-search-website1.png)

![algolia search](/img/algolia-search-website3.png)

![algolia search](/img/algolia-search-website4.png)

![algolia search](/img/algolia-search-website5.png)

:::note Docusaurus Documentation

The official documentation for setting this up you can follow here: [https://docusaurus.io/docs/search](https://docusaurus.io/docs/search).

:::

## Pre-requisites

- A static site running [docusaurus v2.0](https://docusaurus.io/ v2.0)
- An [Algolia](https://www.algolia.com/users/sign_in) Account (free)
  - _Note: I used my GitHub account to federate in but later on I set a password as well._
- Apply to join Algolia's [Docsearch](https://docsearch.algolia.com/apply/) program.
  - Your site needs to be publicly available (open source)
  - Your site needs to be technical documentation of an open source project, or a tech blog.

Apply and wait...

## Setup Algolia Crawler

Once you're accepted into the program, log into your Algolia account and go to the [Algolia Crawler](https://crawler.algolia.com/admin/users/login).

### Create a Crawler

![algolia crawler](/img/algolia-create-crawler-button.png)

Fill in your details

![algolia crawler](/img/algolia-create-crawler.png)

Once your crawler is ready to go, you'll see your `Overview` look like this:

![algolia crawler](/img/algolia-crawler-dash.png)

Click `>_ Editor` and your config should look like this (thsi is the standard Docusaurus config):

```javascript
new Crawler({
  rateLimit: 8,
  maxDepth: 10,
  startUrls: ["https://ronamosa.io/"], // root folder crawler starts from...
  renderJavaScript: false,
  sitemaps: ["https://ronamosa.io/sitemap.xml"],
  ignoreCanonicalTo: true,
  discoveryPatterns: ["https://ronamosa.io/**"],
  schedule: "at 16:06 on Monday",
  actions: [
    {
      indexName: "ronamosa",
      pathsToMatch: ["https://ronamosa.io/**"], // don't change this due to the `url_will_not_match_config` error
      recordExtractor: ({ $, helpers }) => {
        // priority order: deepest active sub list header -> navbar active item -> 'Documentation'
        const lvl0 =
          $(
            ".menu__link.menu__link--sublist.menu__link--active, .navbar__item.navbar__link--active"
          )
            .last()
            .text() || "Documentation";
        return helpers.docsearch({
          recordProps: {
            lvl0: {
              selectors: "",
              defaultValue: lvl0,
            },
            lvl1: ["header h1", "article h1"],
            lvl2: "article h2",
            lvl3: "article h3",
            lvl4: "article h4",
            lvl5: "article h5, article td:first-child",
            lvl6: "article h6",
            content: "article p, article li, article td:last-child",
          },
          aggregateContent: true,
          recordVersion: "v3",
        });
      },
    },
  ],
  initialIndexSettings: {
    ronamosa: {
      attributesForFaceting: [
        "type",
        "lang",
        "language",
        "version",
        "docusaurus_tag",
      ],
      attributesToRetrieve: [
        "hierarchy",
        "content",
        "anchor",
        "url",
        "url_without_anchor",
        "type",
      ],
      attributesToHighlight: ["hierarchy", "content"],
      attributesToSnippet: ["content:10"],
      camelCaseAttributes: ["hierarchy", "content"],
      searchableAttributes: [
        "unordered(hierarchy.lvl0)",
        "unordered(hierarchy.lvl1)",
        "unordered(hierarchy.lvl2)",
        "unordered(hierarchy.lvl3)",
        "unordered(hierarchy.lvl4)",
        "unordered(hierarchy.lvl5)",
        "unordered(hierarchy.lvl6)",
        "content",
      ],
      distinct: true,
      attributeForDistinct: "url",
      customRanking: [
        "desc(weight.pageRank)",
        "desc(weight.level)",
        "asc(weight.position)",
      ],
      ranking: [
        "words",
        "filters",
        "typo",
        "attribute",
        "proximity",
        "exact",
        "custom",
      ],
      highlightPreTag: '<span class="algolia-docsearch-suggestion--highlight" />',
      highlightPostTag: "</span>",
      minWordSizefor1Typo: 3,
      minWordSizefor2Typos: 7,
      allowTyposOnNumericTokens: false,
      minProximity: 1,
      ignorePlurals: true,
      advancedSyntax: true,
      attributeCriteriaComputedByMinProximity: true,
      removeWordsIfNoResults: "allOptional",
    },
  },
  appId: "9UFF3RBJQ9", // public info, save to commit.
  apiKey: "1f53a6f7e7f331786250c1b092794deb", // public info, save to commit.
});
```

:::danger api keys

This "safe to commit" [API Key](https://www.algolia.com/doc/guides/security/api-keys/) is a public "search-only" key that accesses your index of already publicly available information. There is an Algolia Admin API Key, now that you **don't** want public or committed anywhere.

:::

Start, or Restart your crawler and you should see results in either `Success`, `Ignored` and `Total`. If you see more `Ignored` than `Success`, keep working through the next steps and if the issue persists, check out the [Troubleshooting](#troubleshooting) section below.

Next, configure your docusaurus site to connect to, and use the algolia crawler index to provide search results to your website users.

## Configure `docusaurus.config.js`

Update your `docusaurus.config.js` file to connect to your Algolia crawler index.

Mine is very minimalist, removed all optional configs, just the bare minimum configs:

```javascript
module.exports = {
  title: 'Ron Amosa',
  // ...
  themeConfig: {
    //...
    algolia: {
      // The application ID provided by Algolia
      appId: '<YOUR_APP_ID />',

      // Public API key: it is safe to commit it
      apiKey: '<YOUR_API_KEY />',

      indexName: '<YOUR_CRAWLER_INDEX_NAME />',

    },
```

:::info

Check any issues with your `themeConfig` on the [docusaurus](https://docusaurus.io/docs/search#connecting-algolia) site.

:::

## (optional) Cloudflare

If you use a CDN, like cloudflare, which I do, you have to ensure your `SSL/TLS encryption mode` is "Full".

![cloudflare menu](/img/algolia-cloudflare-menu.png)

Scroll down to the `SSL/TLS` drop-down menu and click `Overview`

![cloudflare ssl](/img/algolia-cloudflare-ssl.png)

Ensure `Full` is selected. That's it.

### Restart crawler

Go back to your Algolia Crawler and restart it to crawl your site now.

## Search your site

After you save all your changes and push it to main (assuming you are hosting on GitHub Pages like me), check to see if you have a new search button that looks like this in the top right-hand corner:

![algolia search button](/img/algolia-search-button.png)

Press `ctrl+k` and you should be able to search your site now:

![algolia search](/img/algolia-search-website2.png)

Finished!

## Troubleshooting

### url_will_not_match_config error

After running your crawler and you check it out in `Monitoring` section of your Algolia Crawler's 'Tools' section, and you see a lot of your pages are `IGNORED` status with 'Reason' being `HTTP redirect (301, 302) Not followed` and logs complain about your site trying to redirect to a `http` site and you see this error: `url_will_not_match_config` - your problem is going to be this [http/s issue](https://support.algolia.com/hc/en-us/articles/10129895119121-Why-do-I-get-a-url-will-not-match-config-error-s), and **not** the [pathsToMatch](https://support.algolia.com/hc/en-us/articles/9852693905553-Why-am-I-getting-the-error-url-will-not-match-config-) one.

The fix for this, at least for me, was fixing my [Cloudflare](#optional-cloudflare) SSL/TLS settings.
