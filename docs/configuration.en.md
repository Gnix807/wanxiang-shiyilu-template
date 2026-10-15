# Configuration guide

[Back to README](../README.en.md) · [简体中文](configuration.md) · [Writing guide](writing.en.md)

Start with the running example site, change its identity and domain, then connect services as needed. Edit your own configuration and keep the included examples for reference.

## 1. Set the site URL

Follow the [quick start](../README.en.md#quick-start) to install and start the project. Use Node.js 24 and pnpm 11.2.2.

Copy [.env.example](../.env.example) to `.env` in the project root. Set a full HTTPS URL without a trailing slash:

```dotenv
PUBLIC_SITE_URL=https://example.com
```

Replace `example.com` with your domain. Site configuration and the Astro build both read `PUBLIC_SITE_URL`; it affects canonical URLs, feeds, the sitemap and page links. Restart the development server after changing it. Set the same variable in Cloudflare Pages for deployment.

## 2. Update the site and author details

Most settings live in [src/config/site.ts](../src/config/site.ts). It exports several objects, so update the text used by each part of the site:

| Object or file | What to change |
| --- | --- |
| `siteConfig` | `title`, `enTitle`, `author`, `description`, `signature` and `avatar` |
| `siteConfig.socials` | Website, email, GitHub and other social links |
| `bannerConfig` | The masthead's `title` and `enTitle` |
| `subtitleConfig` | The home subtitle's `text` and `sequence` |
| `i18nConfig.home` | Home page title and description |
| `seoConfig` | Default title, title suffix, summary, sharing image and keywords |
| `aboutConfig` | About page introduction, role, interests and contact details |
| [src/config/about.md](../src/config/about.md) | About page body |
| `footerConfig` | Copyright text, registration details, footer links and your repository |

For example, change these fields inside the existing `siteConfig` object. This is a field fragment; keep the other settings:

```ts
title: 'Field Notes',
enTitle: 'FIELD NOTES',
author: 'Your name',
description: 'Notes on reading, walks and everyday life.',
avatar: '/avatar.svg',
signature: 'Keep the things worth remembering.',
```

Replace [public/avatar.svg](../public/avatar.svg), or save another image and update the path. A file at `public/images/avatar.webp` is served at `/images/avatar.webp`.

The About page uses its own `aboutConfig.emailValue` and `emailLink`. When changing your email, also check `siteConfig.socials.email`, `i18nConfig.privacy.contactEmail` and the [privacy notice](../src/pages/privacy.astro).

## 3. Adjust navigation, footer and friend links

`navConfig.desktop`, `mobileMore` and `external` manage desktop navigation, the mobile More menu and external links. Use this array as a starting point for `desktop`; update the mobile menu separately:

```ts
[
  { name: 'Home', href: '/' },
  { name: 'Articles', href: '/posts' },
  { name: 'Short posts', href: '/talks' },
  { name: 'About', href: '/about' },
]
```

Footer links live in `footerConfig.links`. Set `repoUrl` and `repoDisplayName` to your repository. Registration fields can stay empty when they do not apply.

Friend links live in [src/config/friends.json](../src/config/friends.json), which starts empty. Add entries using this structure and replace the example URLs:

```json
[
  {
    "name": "A friend's blog",
    "url": "https://example.org",
    "avatar": "https://example.org/avatar.png",
    "description": "Everyday notes from a friend."
  }
]
```

If you keep the friend-link application flow, update [.github/ISSUE_TEMPLATE/friend-request.yml](../.github/ISSUE_TEMPLATE/friend-request.yml) and the application URL on the [friends page](../src/pages/friends.astro) to point to your repository.

## 4. Enable services as needed

These accounts and services are unconfigured by default. Articles, short posts and local fonts work independently.

| Feature | Setting | Requirement |
| --- | --- | --- |
| Waline comments | `siteConfig.waline.serverURL` | Your own Waline server URL |
| Umami / Clarity | `siteConfig.analytics.umami` / `clarity` | Your tracking script and site identifier |
| Visits and active users | `siteConfig.analytics.statsApi` | Compatible `alltime` / `active` endpoints |
| GitHub profile | `siteConfig.socials.githubUser` | Your GitHub username |
| Bilibili videos | `siteConfig.socials.bilibiliMid` / `bilibili` | Configure an account and sync its video list manually |
| Welcome message and weather | `welcomeConfig` | Enable `enabled`; weather also needs a compatible `weatherApi` |

After configuring a Bilibili account, run:

```sh
pnpm sync:bili
```

Review `src/data/bilibili-videos.json` and `src/data/bilibili-cache.json` before building. The browser updates cards through JSONP. See the [Bilibili notes](../README.en.md#optional-bilibili-videos) and the [deployment guide](deployment.md) for offline build settings.

`contentConfig.aiSummaryModels` and `aiChatModels` are retained configuration fields with empty URLs. The standard pages do not currently integrate AI summary or chat interfaces. Filling in a URL alone does not add those features.

Update the privacy notice when enabling external services. `PUBLIC_` variables enter client code, so keep secrets out of them. Services that need keys should use your own backend.

## 5. Check before publishing

- The home page, masthead, About page and footer show your name and contact details.
- `.env` and the hosting platform set `PUBLIC_SITE_URL` to your domain.
- Cover and sharing image URLs work; see [covers and image credits](writing.en.md#covers-and-image-credits).
- Service URLs and the friend-link application flow use your settings.
- Your content license reflects your own articles; see [CONTENT_LICENSE.md](../CONTENT_LICENSE.md).

Then follow the [deployment guide](deployment.md) to build, preview and publish.
