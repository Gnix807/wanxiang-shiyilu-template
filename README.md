# 万象拾遗录 · Astro 博客模板

[English](README.en.md) · [部署文档](docs/deployment.md) · [组件示例](src/content/posts/2026-09-22-editorial-components.mdx) · [问题反馈](https://github.com/Gnix807/wanxiang-shiyilu-template/issues)

基于 Astro 的个人博客模板，以纸面质感、衬线字体和朱红点缀构建阅读界面，适合发布技术文章、随笔与日常记录。支持 Markdown / MDX 写作，可部署至 Cloudflare Pages 等静态托管平台。

本项目基于 [ImUpXuu/xuhome](https://github.com/ImUpXuu/xuhome) 进行二次开发，并从「万象拾遗录」博客中整理为可复用模板。

![博客桌面端预览](docs/images/preview-desktop.png)

[查看移动端预览](docs/images/preview-mobile.png)

## 主要功能

- **内容管理**：支持 Markdown / MDX 文章、说说、分类、标签和归档。
- **Editorial 排版**：提供引文、旁注、图版、标签页、步骤、笔记和印章等组件。
- **阅读体验**：支持站内搜索、主题切换和图片灯箱。
- **内容订阅**：提供 RSS / Atom 订阅源。
- **本地字体**：内置 Inter、Noto Serif SC、Noto Sans SC 和 JetBrains Mono，并附字体许可。
- **静态部署**：提供 Cloudflare Pages 配置与 GitHub Actions 构建检查。

模板采用 Astro、TypeScript、React、Svelte 和 Tailwind CSS。仓库包含两篇示例文章、一条示例说说及 SVG 占位插图；评论、访问统计、天气和个人账号资料请求默认关闭。

## 快速开始

### 环境要求

使用 **Node.js 24** 和 **pnpm 11.2.2**，与仓库 CI 配置保持一致。依赖版本由 `pnpm-lock.yaml` 固定。

### 创建站点

1. 点击仓库页面的 **Use this template**，创建自己的 GitHub 仓库。
2. 克隆新仓库，进入项目根目录。
3. 安装依赖并启动开发服务器：

```sh
pnpm install --frozen-lockfile
pnpm dev
```

开发服务器地址以终端输出为准。完成站点配置和内容替换后，构建并预览：

```sh
pnpm build
pnpm preview
```

构建产物位于 `dist/`。`package.json` 中的 `private: true` 用于防止将项目发布到 npm，不影响 GitHub 模板功能。

### 常用命令

| 命令 | 说明 |
| --- | --- |
| `pnpm dev` | 启动本地开发服务器 |
| `pnpm build` | 检查 MDX 样式转换与字体资源，生成提交索引并构建站点 |
| `pnpm preview` | 预览已生成的静态站点 |
| `pnpm lint` | 执行 TypeScript 类型检查 |
| `pnpm check:assets` | 检查字体文件及许可文件是否完整 |
| `pnpm check:mdx` | 检查 MDX 内联样式转换依赖 |
| `pnpm commit-index` | 更新文章提交历史索引 |

## 项目结构

```text
src/
├── components/       # 页面与交互组件
│   └── editorial/    # Editorial 排版组件
├── config/           # 站点、作者、关于页与友链配置
├── content/
│   ├── posts/        # Markdown / MDX 文章
│   └── talks/        # 说说
├── data/             # 页面使用的结构化数据
├── layouts/          # 页面布局
├── pages/            # 路由与订阅源
├── plugins/          # Markdown / MDX 处理插件
└── styles/           # 全局样式与字体定义
public/               # 图片、字体等静态资源
scripts/              # 构建检查与数据生成脚本
docs/                 # 部署与验证文档
```

## 站点配置

首次使用时，请替换以下示例配置与资源：

| 配置位置 | 说明 |
| --- | --- |
| [`src/config/site.ts`](src/config/site.ts) | 站点名称、作者资料、导航、社交链接、内容许可与可选服务 |
| [`src/config/about.md`](src/config/about.md) | 关于页正文 |
| [`src/config/friends.json`](src/config/friends.json) | 友链数据，默认为空列表 |
| [`public/avatar.svg`](public/avatar.svg) | 站点与作者头像 |
| `src/content/posts/`、`src/content/talks/` | 示例文章与说说 |
| [`public/robots.txt`](public/robots.txt) | 爬虫规则；如添加 Sitemap 指令，应使用实际域名 |
| [`src/pages/privacy.astro`](src/pages/privacy.astro) | 与实际启用服务对应的隐私说明 |

参考 [`.env.example`](.env.example) 创建本地 `.env`，部署时在托管平台设置环境变量。上线前必须将 `PUBLIC_SITE_URL` 设置为站点的完整 HTTPS 地址，结尾不加 `/`，并替换配置中的名称、邮箱和 `example.com` 占位值。

敏感变量不得使用 `PUBLIC_` 前缀。评论、统计等可选服务通过 `src/config/site.ts` 配置，启用时应同步更新隐私说明。

## 内容编写

### 文章与元数据

文章存放在 `src/content/posts/`，支持 `.md` 和 `.mdx`。建议按 `YYYY-MM-DD-slug.mdx` 命名，并填写以下 Frontmatter：

```yaml
---
title: 第一篇文章
description: 一段简短的文章摘要。
date: '2026-09-22'
tags: [随笔]
category: 生活
preserveHeadingLevels: true
---
```

文章标题由页面布局生成，正文从 H2（`##`）开始，子标题依次使用 H3、H4。`preserveHeadingLevels: true` 保留源文件标题层级；未设置该字段的旧文章沿用标题降一级的兼容规则。中文正文优先使用「」与『』。

### Editorial 组件

MDX 文件在 Frontmatter 之后按需导入组件：

```mdx
import { PullQuote, Sidenote, Plate } from '../../components/editorial';

<PullQuote source="示例">

给文字留一点余地，也给读者留一点时间。

</PullQuote>
```

完整用法见 [Editorial 示例文章](src/content/posts/2026-09-22-editorial-components.mdx) 与 [组件目录](src/components/editorial)。普通 Markdown 图片和 `Plate` 图版均支持图片灯箱。

说说存放在 `src/content/talks/`，使用 Markdown 与 Frontmatter，可参考 [示例说说](src/content/talks/2026-09-22-hello.md)。

## 部署到 Cloudflare Pages

在 Cloudflare Pages 中连接自己的 GitHub 仓库，并使用以下设置：

| 配置项 | 值 |
| --- | --- |
| 生产分支 | `main` |
| 框架预设 | Astro |
| 构建命令 | `pnpm build` |
| 输出目录 | `dist` |
| Node.js | `24` |
| pnpm | `11.2.2` |
| `PUBLIC_SITE_URL` | 站点实际访问地址 |

[`wrangler.toml`](wrangler.toml) 已配置静态输出目录，使用前应修改其中的项目名。GitHub Actions 执行构建检查并保存静态产物，自动部署由连接的 Pages 项目负责。

完整步骤及可选构建变量见 [部署文档](docs/deployment.md)。

## 维护与贡献

欢迎通过 [Issues](https://github.com/Gnix807/wanxiang-shiyilu-template/issues) 报告问题或提出改进建议。报告问题时请提供复现步骤、运行环境及相关日志。

本仓库同时接收[「万象拾遗录」的友链申请](https://github.com/Gnix807/wanxiang-shiyilu-template/issues/new?template=friend-request.yml)。使用模板创建自己的站点时，请将 `.github/ISSUE_TEMPLATE/friend-request.yml` 中的站点资料和友链页的申请入口改为自己的配置。

代码变更提交 Pull Request 前，请运行 `pnpm lint` 和 `pnpm build`；涉及界面或文章排版的修改，请附桌面端与移动端截图。现有验证范围见 [验证记录](docs/validation.md)。

`src/data/commit-index.json` 为页面所需数据，构建时会按当前仓库更新，应保留在版本控制中。GitHub API 补充提交历史默认关闭。

本地撤下文章后，应在新的输出目录构建，或手动清理对应的旧产物，避免预览残留页面。CI 与 Pages 使用干净检出。

## 项目来源与致谢

[ImUpXuu/xuhome](https://github.com/ImUpXuu/xuhome) 是本项目的上游代码来源与主要设计参考。感谢 [ImUpXuu](https://github.com/ImUpXuu) 及上游贡献者的开源工作。

本项目在上游基础上调整视觉样式与文章排版，增加 Editorial MDX 组件，并提供示例内容和 Cloudflare Pages 配置。原项目署名及第三方许可说明均予以保留。

## 许可证

程序代码采用 [MIT License](LICENSE)。部分文件与资源适用独立许可：`src/types.ts` 保留 Apache-2.0 许可声明，随附字体采用 SIL Open Font License。详见 [NOTICE.md](NOTICE.md)。

模板自带的示例文章、说说、关于页与原创 SVG 按 MIT 许可提供。使用者新增内容的授权由其自行声明，具体说明见 [内容授权说明](CONTENT_LICENSE.md)。
