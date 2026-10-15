# Writing guide

[Back to README](../README.en.md) · [简体中文](writing.md) · [Configuration guide](configuration.en.md)

Articles live in `src/content/posts/`; short posts live in `src/content/talks/`. Content in both directories enters the build. Keep unfinished drafts outside these collections: `draft: true` does not currently hide them.

## Write your first article

Create `2026-10-15-first-note.md` in `src/content/posts/`. Start with this complete example:

```markdown
---
title: My first note
description: A thought that stayed with me after reading.
date: '2026-10-15 09:00:00'
category: Notes
tags: [Reading, Life]
img: /images/editorial-sample.svg
preserveHeadingLevels: true
---

## Start with one idea

Write down what you want to keep. Give each paragraph one idea to develop.

### Add a detail

You can include quotes, lists, links and images.
```

Start `pnpm dev` and find the article on the home page or `/posts`. The default article path comes from the filename, such as `/posts/2026-10-15-first-note/`.

| Field | Purpose |
| --- | --- |
| `title` | Page and article card title |
| `description` | Card summary and SEO description |
| `date` | Publication date; quote it and use the example format when including a time |
| `category` / `tags` | One category and an array of tags |
| `img` | Cover for lists, sharing cards and sharing metadata |
| `preserveHeadingLevels` | Set to `true` to keep source heading levels |

The layout shows the article title. Start body headings at H2 (`##`) and use H3 for subsections. Older articles without `preserveHeadingLevels` retain the rule that shifts headings down one level.

## Covers and image credits

Save images in `public/` and use their site paths in articles:

```text
File: public/images/my-cover.webp
URL:  /images/my-cover.webp
```

`img` supplies the list and sharing cover. The article page does not insert it into the body automatically. Add a Markdown image or an MDX `Plate` when you want it in the article too.

Sharing metadata uses the cover URL directly. For publication, use a full HTTPS URL with your domain:

```yaml
img: https://example.com/images/my-cover.webp
```

Replace the domain and filename. Without an explicit cover, the template checks the first Markdown / HTML body image, the default site cover and further fallbacks. Set `img` explicitly for a `Plate` image.

For someone else's image, include the photographer, original page and license near the figure or at the end of the article. For example:

```markdown
Cover photo: [Photographer / Source](https://example.org/photo),
used under the [image license](https://example.org/license).
```

You can credit your own photographs too. Match each credit and license to the image you use.

## Use components in MDX

For Editorial components, use the `.mdx` extension and import after the Frontmatter. Here is a complete minimal example:

```mdx
---
title: A page of reading notes
description: Add a callout for a useful piece of background.
date: '2026-10-15'
tags: [Reading]
preserveHeadingLevels: true
---

import { Note } from '../../components/editorial';

## Keep the main text moving

Put the main discussion in regular paragraphs.

<Note type="info" title="Background" code={false} seal={false}>

Put useful context here.

</Note>
```

This import path works for files directly in `src/content/posts/`. Adjust the relative path for subdirectories. See the [layout example](../src/content/posts/2026-09-22-editorial-components.mdx) and [component exports](../src/components/editorial/index.ts) for more combinations.

## Write a short post

Create `2026-10-15-daily-note.md` in `src/content/talks/`:

```markdown
---
title: A daily note
date: '2026-10-15 18:00:00'
tags: [Life]
location: Your city
weather: Sunny
mood: Calm
device: Phone
---

A small thought from today's walk, saved here for later.

![Example artwork](/images/editorial-sample.svg)
```

Location, weather, mood and device are optional fields you write yourself. They do not need a weather API. Put images in the body; the list extracts Markdown / HTML images into a grid. The short-post collection uses `.md` files. Start from the [included example](../src/content/talks/2026-09-22-hello.md).

## Check before publishing

Run `pnpm build`, then `pnpm preview`. Open the URL printed in the terminal and check the new article, `/talks`, images and source links.

Builds update the article commit index, so review those changes before committing. If a removed article still appears locally, build into a new output directory or handle its old output manually. CI and Pages use clean checkouts. See the [deployment guide](deployment.md) for publishing settings.
