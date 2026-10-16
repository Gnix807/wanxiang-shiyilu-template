# 浏览器兼容与阅读降级

更新：2026-10-16。当前修复分支：`codex/fix-loading-webview`。

## 目标与范围

针对夸克、UC、QQ、360、搜狗等浏览器，以及保留旧内核的电脑，按实际能力选择阅读路径。保留现有现代界面；旧能力环境优先保证正文、图片、代码、表格、标签页、作者旁注和原生链接可读。

浏览器品牌或安卓版本不等于内核能力，因此不使用品牌或 User-Agent 黑名单。这里记录的是能力检测、降级行为和已执行的验证，不把模拟结果当成某个真实国产浏览器版本的实测结论。

## 阅读路径

| 环境 | 行为 |
| --- | --- |
| 具备所需 CSS 与 DOM 能力 | 使用现有界面、客户端切页和增强交互 |
| 缺少层叠层、现代颜色函数、模块脚本或关键 DOM API | 首屏启用独立兼容阅读样式，采用原生页面跳转 |
| JavaScript 完全禁用 | 通过 `noscript` 加载基础阅读样式，内容直接来自静态 HTML |
| CSS/基础能力可用，但关键模块加载失败 | 页面就绪后 6 秒仍未完成必要增强时，自动切换兼容阅读 |

检查包括 `CSS.supports()`、CSS 类型化属性注册、模块脚本、fetch、Promise、AbortController、IntersectionObserver 和原生 dialog 能力。模块失败检测同时关注未初始化的标签页和未完成加载的 `client:load` 岛屿。

文档头还声明 `renderer=webkit`，为支持该标记的双核浏览器选择可用的极速内核；`X-UA-Compatible=IE=edge` 让 IE 使用最高支持的文档模式。两个提示紧随字符集声明；它们不负责升级内核，也不替代阅读降级。

页面底部提供“兼容阅读”，启用后可在阅读导航中回到“标准阅读”。手动选择使用独立的 `blog-reading-mode` 存储键；原有 `theme` 键保留。存储受限时，手动阅读选择通过站内链接上的 `reader=1` 延续；自动能力降级不会写成永久手动偏好。`reader=0` 可明确返回标准视图。

## 阅读保障

- 兼容样式独立于 Tailwind 层叠层，使用普通选择器、基础布局和实色。正文使用本机字体，基础字号 16px、行高约 1.85。
- 所有标签面板依次展开，并保留面板名称。作者旁注转为正常宽度的静态卡片，悬停不再移动或隐藏。
- 图片、视频和 iframe 限制最大宽度；代码与表格在自身容器内横向滚动，避免撑宽整页。
- 聊天气泡使用独立的旧样式布局，头像、长昵称、链接和尖角不依赖 Tailwind 工具类生效。
- 阅读导航包含首页、完整文章归档、标签和关于页；链接使用 Astro 的 `data-astro-reload`，默认锚点跳转保留。
- 兼容模式跳过搜索、浮层、代码包装等增强入口；切入时释放生命周期托管资源、停止文章预取、关闭图片浮层并清理注释状态。
- 旧的全局增强函数也检查阅读模式，避免再次关闭旁注或生成依赖新工具类的代码滚动容器。
- 部分增强已经移除引用链接时，切入兼容阅读会恢复文献锚点和原生链接语义；点击和 Enter 均绕过失效的浮层监听。
- 视频继续保留原生播放器/iframe；剧透内容保留原有主动展开语义。

主要实现位于 `BrowserCompatibility.astro`、`compat-reader.js` 和 `compat-reader.css`；普通组件接口及文章源文件保持原有用途。

## 构建目标与限制

实际安装版本为 Astro 7.3.3、Tailwind CSS 4.3.3。Tailwind 4 的官方完整样式基线为 Chrome 111、Safari 16.4、Firefox 128，不能靠一段 Chrome 49 配置推断全站兼容。

本轮移除了不被 `@tailwindcss/vite` 接受的 `lightningcss` 选项，显式设置 Vite JavaScript 语法目标为 Chrome/Edge 80、Firefox 78、Safari 14，CSS 最小化目标为 Chrome 80。语法目标不等于 DOM API 或 Tailwind 运行时 CSS 的完整支持；旧能力继续走基础阅读。

没有降级框架或新增兼容库依赖。经典引导脚本通过 ES5 目标语法检查。兼容样式源文件约 9KB，gzip 测算约 2.5KB；正常模式的回归确认没有请求该样式。

## 模板同步验证

模板从 `main` 的 `cfce5f6061346658b8f6006a5bf40c1629cb7337` 建立隔离修复分支；保留 `example.com` 默认域名、站点标识、导航差异、示例文章、说说、图片、字体和许可证。通用阅读、预取、聊天、图片浮层与生命周期修复和主仓库一致；没有复制主站文章、私有设置或生成索引。

- TypeScript、MDX 样式、字体资源和生命周期检查通过；兼容引导脚本通过 ES5 语法转换检查。
- 完整离线构建生成 142 页，保留原有 1 条 MDX 指令打包提示与 Markdown 配置弃用提示。首次并行构建因共享缓存写入冲突失败，改为串行后通过。
- 使用本机 Chrome 155，在模板自己的组件示例页完成八类故障注入：无脚本、旧 CSS、缺少 dialog/observer、缺少 CSS 属性注册、旧 CSS 桌面深色、存储受限、全部模块失败、部分模块失败。隐藏标签面板均为 0，页面横向溢出均为 0，无脚本错误。
- 1440px / 390px 搜索、主题、目录、移动菜单和三轮连续切页通过；手机意图预取、2G / 省流量、桌面并发和导航预取检查通过。
- 默认示例未使用聊天组件。聊天实现与主站逐字一致，其头像、长文本、尖角接缝和自动深色回归在主站的真实聊天文章中验证；本模板检查没有将不存在的聊天示例计为通过。

通过 `BASE_URL` 指向本地生产预览，复用 `PLAYWRIGHT_MODULE`。执行 `node scripts/check-browser-compatibility.mjs`、`node scripts/check-navigation.mjs` 和 `node scripts/check-loading-webview.mjs`。

兼容检查默认使用 `/posts/2026-09-22-editorial-components/`，可用 `SHOWCASE_PATH` 指定同时包含 Tabs 和 Sidenote 的自己的文章。加载检查默认验证预取；设置 `CHAT_PATH` 指向同时含左右聊天气泡的文章后，再验证聊天排版和系统/网站主题组合，`SHOWCASE_PATH` 可为其指定另一聊天展示页。

原始日志保存在隔离副本 `scratch/push-validation/`；本轮使用现有依赖，没有重新安装。未连接真实旧浏览器、安卓 17 / Via 或夸克，故障注入不等于具体版本真机实测。

## 依据

- [Tailwind CSS 浏览器兼容范围](https://tailwindcss.com/docs/compatibility)
- [Vite 构建目标与 CSS 目标](https://vite.dev/config/build-options.html)
- [Astro 原生导航退出机制](https://docs.astro.build/en/guides/view-transitions/#preventing-client-side-navigation)
- [CSS.supports 能力检测](https://developer.mozilla.org/en-US/docs/Web/API/CSS/supports_static)
- [noscript 基础回退](https://developer.mozilla.org/en-US/docs/Web/HTML/Reference/Elements/noscript)

- [360 内核控制 meta 官方说明](https://browser.360.cn/se/help/kernel.html)
- [微软 X-UA-Compatible 文档模式](https://learn.microsoft.com/en-us/openspecs/ie_standards/ms-iedoco/380e2488-f5eb-4457-a07a-0cb1b6e4b4b5)

- [CSS 属性注册 API](https://developer.mozilla.org/en-US/docs/Web/API/CSS/registerProperty_static)

## 2026-10-16 推送前依赖审计

两个仓库的依赖锁文件相同，本轮没有修改依赖。当前 `pnpm audit --json` 返回 7 项既有告警：3 高、3 中、1 低、0 严重级；审计命令退出码为 1，不记为通过。

高危项为 `http-cache-semantics@4.2.0`、`source-map-js@1.2.1` 和 `sharp@0.35.4`；审计给出的修复范围分别为 >=4.2.1、>=1.2.2、>=0.35.5。其余涉及 `sprintf-js`、`smol-toml`、`postcss-selector-parser` 和 `katex`。这份记录不表示依赖安全审计完全通过；依赖升级需单独处理并验证构建和兼容性。

模板默认示例没有文献引用卡片；设置 `CITATION_PATH` 指向含文内 `#ref-*` 引用的文章后，可额外检查部分模块失败时的原生引用点击与 Enter。该共有脚本修复在主站文献文章中验证。

## 2026-10-16 尖角叠画修复

独立尖角已替换为完整轮廓的边框图，取消覆盖补片。新增 Chrome/Edge 共 480 组像素回归及图像失效降级检查；本轮记录见 [聊天气泡整体轮廓](chat-bubble-rendering.md)。
