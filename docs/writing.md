# 写作指南

[返回 README](../README.md) · [English](writing.en.md) · [配置指南](configuration.md)

文章放在 `src/content/posts/`，说说放在 `src/content/talks/`。这两个目录中的内容会参与构建；未完成的草稿请放到集合目录之外，当前不会根据 `draft: true` 自动隐藏内容。

## 写第一篇文章

在 `src/content/posts/` 新建 `2026-10-15-first-note.md`。下面是可以直接开始修改的完整示例：

```markdown
---
title: 第一篇随笔
description: 记录一次阅读之后留下的想法。
date: '2026-10-15 09:00:00'
category: 随笔
tags: [阅读, 日常]
img: /images/editorial-sample.svg
preserveHeadingLevels: true
---

## 从一个想法开始

把想记录的事情写在这里。一段话讲清一件事，再慢慢展开。

### 补充一条细节

可以加入引用、列表、链接和图片。
```

启动 `pnpm dev` 后，在首页或 `/posts` 查看新文章；默认文章路径来自文件名，例如 `/posts/2026-10-15-first-note/`。

| 字段 | 用途 |
| --- | --- |
| `title` | 页面标题与文章卡片标题 |
| `description` | 文章卡片与 SEO 摘要 |
| `date` | 发布时间，建议加引号，包含时间时使用示例中的格式 |
| `category` / `tags` | 单个分类与标签数组 |
| `img` | 列表、分享卡片和分享元信息使用的封面 |
| `preserveHeadingLevels` | 设为 `true` 时保留源文件标题层级 |

布局已经显示文章标题，正文从 H2（`##`）开始，子标题使用 H3。未设置 `preserveHeadingLevels` 的旧文章继续使用标题降一级的兼容规则。

## 封面与图片来源

将图片保存到 `public/`，文章中使用站点路径：

```text
文件位置：public/images/my-cover.webp
访问路径：/images/my-cover.webp
```

`img` 用于文章列表和分享，文章页不会自动把它插入正文。需要在正文展示时，另写 Markdown 图片，或使用 MDX 的 `Plate` 组件。

正式站点的分享元信息会直接使用封面地址。上线时，建议将 `img` 写成包含自己域名的完整 HTTPS 地址：

```yaml
img: https://example.com/images/my-cover.webp
```

将示例域名和文件名换成自己的。未填写封面时，模板会依次寻找正文中的第一张 Markdown / HTML 图片、站点默认封面与后续兜底图片；`Plate` 的图片应显式填写到 `img`。

使用他人图片时，在文章末尾或图注中留下摄影者、原图页与许可。例如：

```markdown
封面摄影：[摄影者 / 图片来源](https://example.org/photo)，
图片按[使用许可](https://example.org/license)使用。
```

自己拍摄的图片也可以注明摄影者。图片来源和使用许可应与实际素材一致。

## 在 MDX 中使用组件

需要正文组件时，将文件扩展名改成 `.mdx`，在 Frontmatter 后导入。下面是完整的最小示例：

```mdx
---
title: 一页阅读笔记
description: 用提示框整理一条补充说明。
date: '2026-10-15'
tags: [阅读]
preserveHeadingLevels: true
---

import { Note } from '../../components/editorial';

## 正文继续往前走

把主要论述放在普通段落里。

<Note type="info" title="补充说明" code={false} seal={false}>

把需要说明的背景放在这里。

</Note>
```

导入路径适用于直接位于 `src/content/posts/` 的文件；放入子目录后，需要相应调整相对路径。更多组合见[排版示例](../src/content/posts/2026-09-22-editorial-components.mdx)和[组件导出](../src/components/editorial/index.ts)。

## 写一条说说

在 `src/content/talks/` 新建 `2026-10-15-daily-note.md`：

```markdown
---
title: 一条日常记录
date: '2026-10-15 18:00:00'
tags: [日常]
location: 你的城市
weather: 晴
mood: 平静
device: 手机
---

今天散步时想到的一件小事，先记在这里。

![示例插图](/images/editorial-sample.svg)
```

地点、天气、心情和设备都是可省略的手写字段，不需要启用天气接口。配图写在正文中，列表会提取 Markdown / HTML 图片形成图片网格。说说集合使用 `.md`；可从[自带示例](../src/content/talks/2026-09-22-hello.md)开始。

## 发布前检查

运行 `pnpm build`，再运行 `pnpm preview`。打开终端给出的地址，查看新文章、`/talks`、图片和来源链接。

构建会更新文章提交索引，提交前一并审阅相关改动。本地撤下内容后如仍见旧页面，使用新的输出目录构建，或手动处理对应旧产物；CI 与 Pages 使用干净检出。发布设置见[部署文档](deployment.md)。
