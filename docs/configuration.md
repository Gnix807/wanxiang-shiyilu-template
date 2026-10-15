# 配置指南

[返回 README](../README.md) · [English](configuration.en.md) · [写作指南](writing.md)

先让示例站点正常运行，再修改名称、作者和域名，最后按需接入服务。以下操作只编辑你自己的配置；模板附带的示例可以保留作对照。

## 1. 设置站点地址

按 [README 的快速开始](../README.md#快速开始)安装并启动项目。环境使用 Node.js 24 和 pnpm 11.2.2。

复制根目录的 [.env.example](../.env.example)，命名为 `.env`，填写自己的完整 HTTPS 地址，结尾不加 `/`：

```dotenv
PUBLIC_SITE_URL=https://example.com
```

将 `example.com` 换成实际域名。`PUBLIC_SITE_URL` 同时供站点配置和 Astro 构建读取，影响 Canonical、订阅源、Sitemap 和页面链接。修改环境变量后重启开发服务器；部署时在 Cloudflare Pages 中设置同名变量。

## 2. 修改站点与作者资料

主要配置集中在 [src/config/site.ts](../src/config/site.ts)。它导出多个对象，各处显示的文案需要分别修改：

| 对象或文件 | 要修改的内容 |
| --- | --- |
| `siteConfig` | `title`、`enTitle`、`author`、`description`、`signature` 和 `avatar` |
| `siteConfig.socials` | 网站、邮箱、GitHub 与其他社交链接 |
| `bannerConfig` | 报头的 `title` 与 `enTitle` |
| `subtitleConfig` | 首页副标题的 `text` 与 `sequence` |
| `i18nConfig.home` | 首页标题与描述 |
| `seoConfig` | 默认标题、标题后缀、摘要、分享图片与关键词 |
| `aboutConfig` | 关于页的简介、身份、关注领域与联系信息 |
| [src/config/about.md](../src/config/about.md) | 关于页正文 |
| `footerConfig` | 版权文字、备案信息、底部链接与自己的仓库地址 |

例如，在原有 `siteConfig` 对象中修改这些字段。下面是字段片段，其余配置保留：

```ts
title: '山间手记',
enTitle: 'FIELD NOTES',
author: '你的名字',
description: '记录阅读、散步和日常想法。',
avatar: '/avatar.svg',
signature: '把值得记下的事情留下来。',
```

头像可以替换 [public/avatar.svg](../public/avatar.svg)，也可以另存图片后修改路径。`public/images/avatar.webp` 对应的访问路径是 `/images/avatar.webp`。

关于页单独使用 `aboutConfig.emailValue` 和 `emailLink`；修改邮箱时，也检查 `siteConfig.socials.email`、`i18nConfig.privacy.contactEmail` 以及[隐私说明](../src/pages/privacy.astro)。

## 3. 调整导航、页脚与友链

`navConfig.desktop`、`mobileMore`、`external` 分别管理桌面导航、移动端更多菜单和外部入口。下面这个数组可以作为 `desktop` 的起点；移动菜单需要单独调整：

```ts
[
  { name: '首页', href: '/' },
  { name: '文章', href: '/posts' },
  { name: '说说', href: '/talks' },
  { name: '关于', href: '/about' },
]
```

页脚链接在 `footerConfig.links`。将 `repoUrl`、`repoDisplayName` 改成自己的仓库；备案文字和链接按实际信息填写。

友链保存在 [src/config/friends.json](../src/config/friends.json)，默认为空。添加时使用这个结构，并替换示例网址：

```json
[
  {
    "name": "友人的博客",
    "url": "https://example.org",
    "avatar": "https://example.org/avatar.png",
    "description": "一位朋友的日常记录。"
  }
]
```

若保留友链申请入口，修改 [.github/ISSUE_TEMPLATE/friend-request.yml](../.github/ISSUE_TEMPLATE/friend-request.yml) 和[友链页](../src/pages/friends.astro)的申请地址，使其指向自己的仓库。

## 4. 按需启用服务

这些账号和服务在模板中默认未配置。站点的文章、说说与本地字体可以独立使用。

| 功能 | 配置位置 | 启用条件 |
| --- | --- | --- |
| Waline 评论 | `siteConfig.waline.serverURL` | 先准备自己的 Waline 服务端，再填写地址 |
| Umami / Clarity | `siteConfig.analytics.umami` / `clarity` | 填写自己的统计脚本与站点标识 |
| 访问量与在线人数 | `siteConfig.analytics.statsApi` | 需要与页面兼容的 `alltime` / `active` 接口 |
| GitHub 个人资料 | `siteConfig.socials.githubUser` | 填写自己的 GitHub 用户名 |
| B 站视频 | `siteConfig.socials.bilibiliMid` / `bilibili` | 配置账号并手动同步视频列表 |
| 欢迎提示与天气 | `welcomeConfig` | 启用 `enabled`；天气另需兼容的 `weatherApi` |

B 站账号配置完成后运行：

```sh
pnpm sync:bili
```

审阅 `src/data/bilibili-videos.json` 和 `src/data/bilibili-cache.json` 后再构建。浏览器使用 JSONP 更新卡片；相关行为见 [README 的 B 站说明](../README.md#可选展示-b-站视频)，离线构建设置见[部署文档](deployment.md)。

`contentConfig.aiSummaryModels` 与 `aiChatModels` 是保留的配置字段，默认 URL 为空，当前常规页面没有接入相应的 AI 摘要或对话界面。填写 URL 不会自动增加这些功能。

启用外部服务后，同步更新隐私说明。`PUBLIC_` 变量会进入客户端代码，不要用它保存密钥；需要密钥的服务应由自己的后端处理。

## 5. 完成发布前的核对

- 首页、报头、关于页和页脚都显示自己的名称与联系方式。
- `.env` 与部署平台的 `PUBLIC_SITE_URL` 使用实际域名。
- 封面与分享图片地址可访问；写法见[写作指南](writing.md#封面与图片来源)。
- 服务地址和友链申请入口已经换成自己的配置。
- 内容许可已按自己的文章授权调整，见 [CONTENT_LICENSE.md](../CONTENT_LICENSE.md)。

随后按[部署文档](deployment.md)构建、预览并发布。
