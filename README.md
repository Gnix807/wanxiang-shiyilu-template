<a name="readme-top"></a>

<p align="center">
  <picture>
    <source media="(prefers-color-scheme: dark)" srcset="docs/images/readme-cover-dark.svg" />
    <img src="docs/images/readme-cover.svg" alt="万象拾遗录 · 报刊式排版的 Astro 博客模板" width="100%" />
  </picture>
</p>

<p align="center"><strong>一份有报刊气质的 Astro 博客模板。</strong></p>

<p align="center">
  <a href="https://github.com/Gnix807/wanxiang-shiyilu-template/generate"><img src="https://img.shields.io/badge/Use_this_template-9e2a2b?style=for-the-badge&amp;logo=github&amp;logoColor=fffdf8" alt="使用此 GitHub 模板" /></a>
  <a href="https://github.com/Gnix807/wanxiang-shiyilu-template/actions/workflows/build.yml"><img src="https://img.shields.io/github/actions/workflow/status/Gnix807/wanxiang-shiyilu-template/build.yml?branch=main&amp;style=for-the-badge&amp;logo=githubactions&amp;logoColor=fffdf8&amp;label=build&amp;labelColor=242220" alt="main 分支构建状态" /></a>
  <a href="LICENSE"><img src="https://img.shields.io/badge/Code-MIT-9e2a2b?style=for-the-badge&amp;labelColor=242220" alt="MIT 代码许可" /></a>
</p>

<p align="center">
  <a href="package.json"><img src="https://img.shields.io/badge/Astro-7-9e2a2b?style=flat-square&amp;logo=astro&amp;logoColor=fffdf8&amp;labelColor=242220" alt="Astro 7" /></a>
  <a href="tsconfig.json"><img src="https://img.shields.io/badge/TypeScript-5.8-6a6257?style=flat-square&amp;logo=typescript&amp;logoColor=fffdf8&amp;labelColor=242220" alt="TypeScript 5.8" /></a>
  <a href="package.json"><img src="https://img.shields.io/badge/Tailwind-4-6a6257?style=flat-square&amp;logo=tailwindcss&amp;logoColor=fffdf8&amp;labelColor=242220" alt="Tailwind 4" /></a>
  <a href="#快速开始"><img src="https://img.shields.io/badge/Node.js-24-6a6257?style=flat-square&amp;logo=nodedotjs&amp;logoColor=fffdf8&amp;labelColor=242220" alt="Node.js 24" /></a>
  <a href="package.json"><img src="https://img.shields.io/badge/pnpm-11.2.2-6a6257?style=flat-square&amp;logo=pnpm&amp;logoColor=fffdf8&amp;labelColor=242220" alt="pnpm 11.2.2" /></a>
</p>

<p align="center">
  <a href="https://omnigazette.dev">作者博客</a> ·
  <a href="#快速开始">快速开始</a> ·
  <a href="#正文组件">正文组件</a> ·
  <a href="#部署到-cloudflare-pages">部署指南</a> ·
  <a href="#常见问题">常见问题</a> ·
  <a href="README.en.md">English</a>
</p>

万象拾遗录把报刊的标题、题签、旁注和图版带进网页，适合教程、随笔、阅读笔记与日常记录。文章使用 Markdown / MDX，页面静态构建，可以从示例站点开始逐步修改。

## 阅读界面

<a href="docs/images/preview-desktop.png"><img src="docs/images/preview-desktop.png" alt="纸上随笔示例站点的桌面首页" width="100%" /></a>

<details>
<summary>查看手机界面</summary>

<p align="center"><img src="docs/images/preview-mobile.png" alt="纸上随笔示例站点的手机首页" width="360" /></p>

</details>

<p align="center"><sub>模板自带的「纸上随笔」示例站点 · <a href="https://omnigazette.dev">访问作者博客 ↗</a></sub></p>

## 写作与阅读

<table>
<tr>
<td width="50%" valign="top">

**正文排版**

引文、侧注、图版、标签页和步骤可直接写进 MDX，让资料与解释贴近正文。

[浏览正文组件 →](#正文组件)

</td>
<td width="50%" valign="top">

**阅读体验**

明暗主题、文章目录、站内搜索与图片灯箱，兼顾桌面和手机阅读。

[查看阅读界面 →](#阅读界面)

</td>
</tr>
<tr>
<td width="50%" valign="top">

**内容组织**

文章与说说分别收录，分类、标签、归档、创作日历与 RSS / Atom 提供不同的浏览入口。

[开始第一篇文章 →](#写第一篇文章)

</td>
<td width="50%" valign="top">

**静态发布**

Markdown / MDX 随构建生成页面，字体随仓库提供，支持发布到 Cloudflare Pages。

[阅读部署指南 →](#部署到-cloudflare-pages)

</td>
</tr>
</table>

> [!NOTE]
> 模板附两篇文章、一条说说和 SVG 插图。评论、统计、天气与个人账号请求默认关闭，按需配置后再启用。

## 快速开始

准备 **Node.js 24** 和 **pnpm 11.2.2**，与仓库 CI 保持一致。

1. 点击 [Use this template](https://github.com/Gnix807/wanxiang-shiyilu-template/generate)，创建自己的仓库。
2. 克隆新仓库，进入项目根目录。
3. 安装依赖并启动：

```sh
pnpm install --frozen-lockfile
pnpm dev
```

打开终端给出的本地地址，即可看到示例站点。接下来修改站点资料，替换示例内容，再构建发布。

### 先改这些地方

| 位置 | 修改内容 |
| --- | --- |
| [src/config/site.ts](src/config/site.ts) | 站点名称、作者、导航、社交链接与可选服务 |
| [src/config/about.md](src/config/about.md) | 关于页正文 |
| [src/config/friends.json](src/config/friends.json) | 友链列表，默认为空 |
| [public/avatar.svg](public/avatar.svg) | 站点与作者头像 |
| [src/content/posts](src/content/posts)、[src/content/talks](src/content/talks) | 示例文章与说说 |
| [.env.example](.env.example) | 参考示例创建 `.env`，填写实际的 `PUBLIC_SITE_URL` |

`PUBLIC_SITE_URL` 使用完整 HTTPS 地址，结尾不加 `/`。上线前一并替换名称、邮箱及 `example.com` 占位值；如在 [robots.txt](public/robots.txt) 中添加 Sitemap，也要使用实际域名。

评论、统计等服务按需启用，并同步修改[隐私说明](src/pages/privacy.astro)。敏感变量不要使用 `PUBLIC_` 前缀。

## 正文组件

<p align="center"><a href="docs/images/preview-editorial.jpg"><img src="docs/images/preview-editorial.jpg" alt="示例文章中提示框与引文的实际排版" width="618" /></a></p>

<p align="center"><sub>Note 提示框与 PullQuote 引文的实际渲染 · <a href="src/content/posts/2026-09-22-editorial-components.mdx">查看示例源码 ↗</a></sub></p>

| 内容 | 可用组件 |
| --- | --- |
| 引文、旁注与提示 | `PullQuote`、`Sidenote`、`Note` |
| 图版、组图与外部资料 | `Plate`、`ImageGrid`、`LinkCard`、`SmartLink` |
| 教程、过程与时间线 | `Tabs`、`Steps`、`Timeline` |
| 笔记、诗歌与对白 | `Notebook`、`Poetry`、`Dialogue`、`Chat` |
| 行内标记与交互 | `Badge`、`Kbd`、`Spoiler`、`Button` |

在 MDX 的 Frontmatter 后按需导入：

```mdx
import { Note, PullQuote } from '../../components/editorial';

<Note title="阅读笔记">

把需要补充的背景放在这里，让正文继续往前走。

</Note>

<PullQuote source="示例">

给文字留一点余地，也给读者留一点时间。

</PullQuote>
```

普通 Markdown 图片和 `Plate` 图版均支持灯箱。完整导出见[组件目录](src/components/editorial)。

### 写第一篇文章

在 `src/content/posts/` 新建 `.md` 或 `.mdx`，建议按 `YYYY-MM-DD-slug.mdx` 命名：

```yaml
---
title: 第一篇文章
description: 一段简短的文章摘要。
date: '2026-10-15'
tags: [随笔]
category: 生活
preserveHeadingLevels: true
---
```

布局会显示文章标题，正文从 H2（`##`）开始。`preserveHeadingLevels: true` 保留原有标题层级；未设置的旧文章沿用标题降一级的兼容规则。中文正文推荐使用「」与『』。

说说放在 `src/content/talks/`，可从[示例说说](src/content/talks/2026-09-22-hello.md)开始修改。

## 部署到 Cloudflare Pages

先在本地构建并预览：

```sh
pnpm build
pnpm preview
```

确认页面后，在 Cloudflare Pages 连接自己的 GitHub 仓库：

| 配置项 | 值 |
| --- | --- |
| 生产分支 | `main` |
| 框架预设 | Astro |
| 构建命令 | `pnpm build` |
| 输出目录 | `dist` |
| Node.js / pnpm | `24` / `11.2.2` |
| `PUBLIC_SITE_URL` | 站点实际访问地址 |

[wrangler.toml](wrangler.toml) 已设置静态输出目录，使用前修改其中的项目名。GitHub Actions 负责构建检查与产物保存，自动部署由连接的 Pages 项目完成。完整步骤见[部署文档](docs/deployment.md)。

## 可选：展示 B 站视频

在 `src/config/site.ts` 填写 `socials.bilibiliMid` 和 `socials.bilibili`，再运行：

```sh
pnpm sync:bili
```

检查 `src/data/bilibili-videos.json` 和 `src/data/bilibili-cache.json` 的变更后构建。默认账号与缓存为空，不会自动请求 B 站。

构建读取静态数据；浏览器通过 JSONP 刷新接近可见区域的卡片，一小时内复用结果，切页时清理请求。手写标题、简介和封面优先保留，同步失败也会保留已有列表。

<details>
<summary>命令速查与项目结构</summary>

| 命令 | 用途 |
| --- | --- |
| `pnpm dev` | 本地开发 |
| `pnpm build` | 检查 MDX、字体，更新提交索引并构建 |
| `pnpm preview` | 预览构建产物 |
| `pnpm lint` | TypeScript 类型检查 |
| `pnpm check:assets` | 字体文件与许可检查 |
| `pnpm check:mdx` | MDX 内联样式依赖检查 |
| `pnpm commit-index` | 更新文章提交索引 |
| `pnpm sync:bili` | 同步已配置账号的视频资料 |

技术栈为 Astro、TypeScript、React、Svelte 和 Tailwind CSS。

```text
src/components/   页面组件与 Editorial 排版组件
src/config/       站点、作者、关于页与友链配置
src/content/      文章与说说
src/layouts/      页面布局
src/pages/        路由与订阅源
src/styles/       样式与字体定义
public/           图片、字体等静态资源
scripts/          构建检查与数据生成
docs/             部署与验证说明
```

构建产物位于 `dist/`。`src/data/commit-index.json` 被页面使用，应保留在版本控制中；构建会按当前仓库更新它，GitHub API 补充历史默认关闭。

本地撤下文章后，使用新的输出目录构建，或手动清理对应旧产物，避免预览残留页面。CI 与 Pages 使用干净检出。

</details>

## 常见问题

<details>
<summary>只写普通 Markdown，也能用吗？</summary>

可以。`.md` 与 `.mdx` 都能作为文章；普通文章直接使用 Markdown，需要引文、旁注等组件时再使用 MDX。写法见[第一篇文章](#写第一篇文章)。

</details>

<details>
<summary>需要数据库或自己维护服务器吗？</summary>

文章与说说保存在仓库中，构建后输出静态页面，可以交给 Cloudflare Pages 托管。评论、统计等外部服务按需配置，示例站点无需它们也能运行。

</details>

<details>
<summary>开源模板为什么设置 private: true？</summary>

`package.json` 中的 `private: true` 用于防止误发到 npm，不影响代码开源、GitHub 模板功能或站点部署。

</details>

## 参与维护

欢迎通过 [Issues](https://github.com/Gnix807/wanxiang-shiyilu-template/issues) 反馈问题。请附复现步骤、运行环境和相关日志；界面或排版问题最好附上截图。

提交 Pull Request 前运行 `pnpm lint` 和 `pnpm build`。涉及界面修改时，附上桌面与手机效果；现有检查范围见[验证记录](docs/validation.md)。

本仓库也接收[作者博客的友链申请](https://github.com/Gnix807/wanxiang-shiyilu-template/issues/new?template=friend-request.yml)。创建自己的站点后，请修改 `.github/ISSUE_TEMPLATE/friend-request.yml` 与友链页的申请入口。

## 来源与许可

本项目基于 [ImUpXuu/xuhome](https://github.com/ImUpXuu/xuhome) 二次开发。感谢 [ImUpXuu](https://github.com/ImUpXuu) 与上游贡献者提供的代码基础和设计参考，原署名与第三方许可说明均予以保留。

程序代码采用 [MIT License](LICENSE)。`src/types.ts` 保留 Apache-2.0 声明，随附字体使用 SIL Open Font License，详见 [NOTICE.md](NOTICE.md)。

模板自带的示例文章、说说、关于页与原创 SVG 按 MIT 提供。新增内容的授权由使用者自行声明，见[内容授权说明](CONTENT_LICENSE.md)。

---

<p align="center"><sub><a href="#readme-top">返回顶部 ↑</a> · <a href="README.en.md">English</a> · <a href="https://github.com/Gnix807/wanxiang-shiyilu-template/issues">反馈问题</a></sub></p>
