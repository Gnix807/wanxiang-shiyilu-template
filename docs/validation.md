# 发布验证

2026-09-22，本地使用 Node.js 24.14.1 和 pnpm 11.2.2 验证初始模板。

- 独立目录使用 `pnpm install --frozen-lockfile --ignore-scripts` 完成干净安装。
- `pnpm lint`（TypeScript）通过。
- `pnpm build` 通过，生成 142 个静态页面。
- 使用官方 npm 安全端点的 `pnpm audit` 返回 0 个已知告警。
- 字体校验通过：215 个 CSS 字体地址、4 份 OFL 许可。
- 首页、归档、关于、友链、统计、Markdown 文章和 MDX 示例共 7 个页面返回 HTTP 200。
- 检查了主题切换、站内搜索、标签页、折叠附录、旁注、图片灯箱以及 Esc 关闭。
- 在 390、768、1440 像素宽度下未发现页面横向溢出。
- 上述默认页面没有发起外部网络请求，也没有浏览器脚本错误；这些检查不代表对所有可选配置和无障碍场景的完整认证。

## 已知工具链提示

构建器会对 Astro 生成的 `use astro:head-inject` 指令给出打包提示。没有屏蔽该提示；构建后的样式、MDX 组件脚本和交互已做上述检查。

`pnpm peers check` 对 `@tailwindcss/typography@0.5.20` 的 peer 范围 `>=3.0.0 || >=4.0.0 || insiders` 仍有提示。当前安装的 Tailwind CSS 为 4.3.3，满足其中的数值范围，但本次不把 peer 检查记作完全通过，也没有用通配规则忽略它。

空 Git 仓库的首次本地构建可能显示提交信息尚不可用；历史面板会使用空索引。创建首次提交后再次构建即可读取自己的记录。

## MDX 样式依赖固定

`pnpm-workspace.yaml` 将 MDX 使用的 `style-to-js` 固定到兼容的 1.1.21。旧版 1.0.0 的 CommonJS 导出格式会使干净环境中的样式转换失败；已有 node_modules 内的临时补丁可能掩盖这个问题。构建现在先运行 `pnpm check:mdx` 验证实际默认导出和内联样式转换，示例文章也包含带语法高亮的代码块。

相关上游记录：[pnpm/pnpm#13741](https://github.com/pnpm/pnpm/issues/13741)。本模板通过锁文件解决，不依赖手工修改 node_modules。
