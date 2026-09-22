# 万象拾遗录 · Astro 博客模板

一套以纸面、墨色和朱红为基础的个人博客模板。支持 Markdown / MDX、文章归档、标签与分类、说说、RSS / Atom、站内搜索，以及旁注、引文、图版、标签页和步骤等 Editorial 组件。

模板包含两篇示例文章、一条示例说说和原创 SVG 占位图，不附带原博客的真实文章、个人照片、评论数据或历史记录。评论、访问统计、天气与个人账号资料请求默认关闭。

![桌面预览](docs/images/preview-desktop.png)

[查看手机预览](docs/images/preview-mobile.png) · [发布验证记录](docs/validation.md)

## 参考项目与致谢

本模板基于 [ImUpXuu/xuhome](https://github.com/ImUpXuu/xuhome) 修改，它也是「万象拾遗录」博客搭建时的主要参考。感谢 [ImUpXuu](https://github.com/ImUpXuu) 开源博客源码。

在上游项目的基础上，我们调整了纸面风格与文章排版，加入 Editorial MDX 组件，再将个人内容和配置替换为示例，整理成这个可复用的模板。上游署名和许可说明保留在仓库中。

## 快速开始

需要 Node.js 24 和 pnpm 11.2.2。

1. 点击仓库上的 **Use this template** 创建自己的仓库，然后克隆到本地。
2. 运行 `pnpm install --frozen-lockfile`。
3. 修改 `src/config/site.ts` 和 `src/config/about.md`。
4. 运行 `pnpm dev`，在本地查看。
5. 运行 `pnpm build` 验证，`pnpm preview` 预览构建结果。

`package.json` 中的 `private: true` 用来防止误发布到 npm，不影响 GitHub 模板使用。

## 必须先修改的内容

| 文件或设置 | 用途 |
| --- | --- |
| `src/config/site.ts` | 名称、作者、社交链接、封面、栏目与可选服务 |
| `PUBLIC_SITE_URL` | 最终域名，例如 `https://your-blog.example`；不要使用默认的 example.com 上线 |
| `src/config/about.md` | 关于页正文 |
| `src/config/friends.json` | 友链，默认空列表 |
| `public/avatar.svg` | 导航栏和作者头像 |
| `public/robots.txt` | 如需添加 Sitemap 指令，填写自己的域名 |
| `src/pages/privacy.astro` | 根据实际启用的服务填写隐私说明 |
| `src/config/site.ts` 中的内容许可 | 选择适用于你新增文章的许可 |

默认配置中的邮箱、名称和示例内容都只是占位值。真实密钥使用本地环境变量或平台 Secrets；不要放进 `src/config/`，也不要使用 `PUBLIC_` 前缀。

## 写文章

文章位于 `src/content/posts/`，支持 `.md` 和 `.mdx`：

```yaml
---
title: 第一篇文章
description: 一段简短的介绍。
date: '2026-09-22'
tags: [随笔]
category: 生活
preserveHeadingLevels: true
---
```

正文使用 `##`、`###` 组织标题。`preserveHeadingLevels: true` 保持源码标题层级，页面文章标题由布局提供。旧式从 H1 起排的文章可以不设置这个字段，由兼容插件自动降一级。

MDX 组件从 `../../components/editorial` 导入，参考示例文章 `2026-09-22-editorial-components.mdx`。普通 Markdown 图片和 `Plate` 都可使用自带的图片灯箱。

说说位于 `src/content/talks/`，同样使用 Frontmatter 填写标题、日期和标签。

## 部署到 Cloudflare Pages

- 框架选择 Astro，构建命令 `pnpm build`，输出目录 `dist`。
- 使用 Node.js 24、pnpm 11.2.2。
- 设置 `PUBLIC_SITE_URL` 为最终访问域名。
- `wrangler.toml` 已采用 Pages 的输出目录配置，修改项目名后可用于自己的项目。

详见 [部署说明](docs/deployment.md)。本仓库的 GitHub Actions 只执行构建检查，托管部署由你连接的 Pages 项目负责。

## 字体、历史和外部服务

四组字体已随仓库提供并附 OFL 许可；`pnpm check:assets` 检查 CSS 与文件是否一致，不依赖本机绝对路径。

`src/data/commit-index.json` 是页面使用的结构化数据，不应删除。构建会从当前仓库生成提交索引，GitHub API 补充默认关闭。未配置账号的模板不会在构建时请求个人 Bilibili 资料。

可选评论与统计在 `src/config/site.ts` 中配置。启用外部服务后，请相应更新隐私说明。

本地撤下文章后，使用新的构建输出目录或自行清理旧输出，避免旧页面残留；CI 和 Pages 使用干净检出。

## 来源与许可

基于 [ImUpXuu/xuhome](https://github.com/ImUpXuu/xuhome) 修改，保留上游署名。程序采用 MIT；`src/types.ts` 保留 Apache-2.0 文件头，字体采用 OFL。详情见 [LICENSE](LICENSE)、[NOTICE.md](NOTICE.md) 和 [CONTENT_LICENSE.md](CONTENT_LICENSE.md)。

已移除 Fancyapps UI 的接入，图片浏览使用模板内的灯箱组件。示例文章和原创 SVG 可按 MIT 修改使用；这不改变使用者自行添加内容的授权。
