# 来源与许可

本博客的程序基于 [ImUpXuu/xuhome](https://github.com/ImUpXuu/xuhome) 修改，上游 README 声明程序代码采用 MIT 许可，并将文章内容与程序许可分开。保留上游贡献者署名；本站的后续程序改动按根目录 LICENSE 提供。

以下内容不适用「全部文件均为 MIT」的概括：

- `src/types.ts` 保留原有 Apache-2.0 文件头，许可全文见 `licenses/Apache-2.0.txt`。
- `public/fonts/inter/`、`noto-serif-sc/`、`noto-sans-sc/`、`jetbrains-mono/` 中的字体按各目录的 `OFL.txt` 分发。字形未作修改，web 字体来源为 Fontsource/Google Fonts 对应字体家族；相关 CSS 仅调整本地 URL 和字体别名。
- npm 依赖各自的许可仍然有效，安装包中应保留其许可文件。
- 真实文章、说说、个人头像、照片与第三方文章素材不因程序开放而改变原有授权。具体说明见 `CONTENT_LICENSE.md`。

本版已移除 Fancyapps UI 的依赖与接入，图片预览使用仓库内的 `AppleLightbox.astro`。旧版本采用的第三方许可不会因此自动适用于当前代码或反过来被覆盖。

字体上游许可来源：

- https://github.com/google/fonts/tree/main/ofl/inter
- https://github.com/google/fonts/tree/main/ofl/notoserifsc
- https://github.com/google/fonts/tree/main/ofl/notosanssc
- https://github.com/google/fonts/tree/main/ofl/jetbrainsmono
