# 构建与 Cloudflare Pages

项目输出静态 HTML，不需要为 Pages 安装 SSR adapter。`wrangler.toml` 的 `pages_build_output_dir` 为 `./dist`。

## 本地

使用 Node.js 24 和 pnpm 11.2.2。版本记录在 `package.json`。

```sh
pnpm install --frozen-lockfile
pnpm build
pnpm preview
```

生产站点地址通过 `PUBLIC_SITE_URL` 设置，影响文章链接、RSS、Sitemap 和 SEO。为空时使用 `src/config/site.ts` 与 `astro.config.mjs` 中的默认地址；修改默认配置时应保持两者一致。

字体文件和许可随仓库提供。`pnpm check:assets` 校验字体 CSS 指向的文件。构建不再依赖另一台电脑的字体下载目录。

## Pages 设置

在 Cloudflare Pages 中导入对应 GitHub 仓库，选择 `main` 分支：

- 框架：Astro。
- 构建命令：`pnpm build`。
- 输出目录：`dist`。
- Node.js：24（可在环境变量设置 `NODE_VERSION=24`）。
- pnpm：11.2.2（按 packageManager 固定；必要时设置 `PNPM_VERSION=11.2.2`）。
- `PUBLIC_SITE_URL`：实际访问域名，包含 `https://`，结尾不加 `/`。

这是部署准备说明。创建 Pages 项目、绑定域名和修改 DNS 需要在 Cloudflare 中另行完成；GitHub Build 工作流只执行构建检查，不会登录服务器或部署到他人账户。

## 可选构建数据

- `BUILD_OFFLINE=1`：跳过关于页的 Bilibili 数据请求。CI 使用此设置保证检查不依赖第三方接口。
- `COMMIT_INDEX_FETCH=1`：允许提交索引使用 GitHub API 补充浅克隆历史，默认关闭。
- `COMMIT_INDEX_REPO`：显式覆盖仓库名；未设置时使用 GitHub Actions 仓库、build.json 配置或 origin。
- `COMMIT_INDEX_TOKEN`：可选 GitHub Token，仅在确实需要读取 API 时放入环境变量。
- `INDEXNOW_KEY`：可选构建变量，生成 IndexNow 公开验证文件；不应提交实际环境文件。

`src/data/commit-index.json` 被页面导入，因此仓库保留有效的索引文件。构建会根据当前仓库更新它，不应通过 .gitignore 使这个必需文件缺失。

旧的 SSH 部署、通知、压测和缓存刷新工作流已在本地归档，不随本次发布继续运行。

参考：[Cloudflare Pages 的 Astro 指南](https://developers.cloudflare.com/pages/framework-guides/deploy-an-astro-site/)、[Pages Wrangler 配置](https://developers.cloudflare.com/pages/functions/wrangler-configuration/)。
