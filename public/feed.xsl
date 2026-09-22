<?xml version="1.0" encoding="UTF-8"?>
<xsl:stylesheet version="1.0"
  xmlns:xsl="http://www.w3.org/1999/XSL/Transform"
  xmlns:atom="http://www.w3.org/2005/Atom"
  xmlns:content="http://purl.org/rss/1.0/modules/content/"
  xmlns:dc="http://purl.org/dc/elements/1.1/"
  exclude-result-prefixes="atom content dc">

  <xsl:output method="html" version="5.0" encoding="UTF-8" indent="yes" />

  <xsl:template match="/">
    <html lang="zh-CN">
      <head>
        <meta charset="UTF-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <title>
          <xsl:choose>
            <xsl:when test="rss/channel/title"><xsl:value-of select="rss/channel/title" /> · 網絡訂閱公報</xsl:when>
            <xsl:when test="atom:feed/atom:title"><xsl:value-of select="atom:feed/atom:title" /> · 網絡訂閱公報</xsl:when>
            <xsl:otherwise>纸上随笔 · 網絡訂閱公報</xsl:otherwise>
          </xsl:choose>
        </title>
        <!-- 引入本地打包的主站字体库：Noto Serif SC, Inter, JetBrains Mono, Noto Sans SC -->
        <link rel="stylesheet" href="/fonts.css" />
        <style type="text/css">
          :root {
            /* 100% 对标主站字体栈 */
            --font-serif: "Noto Serif SC", "Source Han Serif SC", "Songti SC", "STSong", "SimSun", Georgia, serif;
            --font-sans: "Inter", "Inter Variable", "Noto Sans SC", -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", "PingFang SC", "Hiragino Sans GB", "Microsoft YaHei", sans-serif;
            --font-mono: "JetBrains Mono", "Noto Sans SC", "SF Mono", Menlo, Consolas, monospace;

            /* 经典宣纸报刊主色板 */
            --bg-canvas: #f6eddc;
            --bg-card: #fcfbf9;
            --bg-card-sub: #f4efe6;
            --text-main: #1a1a1a;
            --text-muted: #555555;
            --text-light: #777777;
            --line-solid: #1a1a1a;
            --line-subtle: #e5dec9;

            --press-red: #9e2a2b;
            --press-red-soft: rgba(158, 42, 43, 0.08);
            --press-blue: #1d4ed8;
            --press-blue-soft: rgba(29, 78, 216, 0.08);
            --press-green: #15803d;

            --shadow-xs: 1.5px 1.5px 0 var(--line-solid);
            --shadow-sm: 2.5px 2.5px 0 var(--line-solid);
            --shadow-md: 4px 4px 0 var(--line-solid);
            --shadow-lg: 6px 6px 0 var(--line-solid);
          }

          @media (prefers-color-scheme: dark) {
            :root {
              --bg-canvas: #141414;
              --bg-card: #1f1f1f;
              --bg-card-sub: #262626;
              --text-main: #e8e6e3;
              --text-muted: #aaaaaa;
              --text-light: #777777;
              --line-solid: #444444;
              --line-subtle: #2d2d2d;

              --press-red: #d9534f;
              --press-red-soft: rgba(217, 83, 79, 0.16);
              --press-blue: #3b82f6;
              --press-blue-soft: rgba(59, 130, 246, 0.16);
              --press-green: #22c55e;

              --shadow-xs: 1.5px 1.5px 0 #000000;
              --shadow-sm: 2.5px 2.5px 0 #000000;
              --shadow-md: 4px 4px 0 #000000;
              --shadow-lg: 6px 6px 0 #000000;
            }
          }

          *, *::before, *::after {
            box-sizing: border-box;
            margin: 0;
            padding: 0;
          }

          body {
            background-color: var(--bg-canvas);
            color: var(--text-main);
            font-family: var(--font-sans);
            line-height: 1.6;
            min-height: 100vh;
            padding: 32px 16px 80px;
            -webkit-font-smoothing: antialiased;
            -moz-osx-font-smoothing: grayscale;
          }

          .feed-container {
            max-width: 860px;
            margin: 0 auto;
          }

          /* ===================================================
             1. 报头（Masthead）：洗练、庄重、实体出版物美学
             =================================================== */
          .feed-masthead {
            background: var(--bg-card);
            border: 2.5px solid var(--line-solid);
            box-shadow: var(--shadow-md);
            padding: 24px 28px;
            margin-bottom: 24px;
            position: relative;
          }

          .masthead-top {
            display: flex;
            align-items: center;
            justify-content: space-between;
            border-bottom: 2px solid var(--line-solid);
            padding-bottom: 12px;
            margin-bottom: 20px;
          }

          .masthead-seal {
            font-family: var(--font-serif);
            font-size: 13.5px;
            font-weight: 900;
            letter-spacing: 1.5px;
            color: var(--press-red);
            display: inline-flex;
            align-items: center;
            gap: 6px;
          }

          .feed-badge {
            background: var(--line-solid);
            color: var(--bg-card);
            font-family: var(--font-mono);
            font-size: 11px;
            font-weight: 800;
            padding: 3px 8px;
            border-radius: 2px;
            letter-spacing: 0.5px;
          }

          .masthead-core {
            display: flex;
            align-items: center;
            gap: 20px;
          }

          .masthead-avatar {
            width: 72px;
            height: 72px;
            border: 2px solid var(--line-solid);
            box-shadow: var(--shadow-sm);
            object-fit: cover;
            flex-shrink: 0;
            background: var(--bg-card-sub);
          }

          .masthead-text {
            flex: 1;
            min-width: 0;
          }

          .masthead-title {
            font-family: var(--font-serif);
            font-size: 26px;
            font-weight: 900;
            letter-spacing: 0.5px;
            color: var(--text-main);
            margin-bottom: 4px;
            line-height: 1.25;
          }

          .masthead-subtitle {
            font-family: var(--font-serif);
            font-size: 13.5px;
            color: var(--text-muted);
            margin-bottom: 10px;
            line-height: 1.5;
          }

          .masthead-pills {
            display: flex;
            flex-wrap: wrap;
            gap: 8px;
            font-family: var(--font-mono);
            font-size: 11.5px;
          }

          .pill {
            display: inline-flex;
            align-items: center;
            gap: 4px;
            padding: 2px 8px;
            background: var(--bg-card-sub);
            border: 1.5px solid var(--line-solid);
            font-weight: 700;
            border-radius: 2px;
            color: var(--text-main);
          }

          .pill-green {
            color: var(--press-green);
          }

          /* ===================================================
             2. 订阅向导与一键直达阅读器
             =================================================== */
          .guide-section {
            background: var(--bg-card);
            border: 2.5px solid var(--line-solid);
            box-shadow: var(--shadow-sm);
            padding: 18px 24px;
            margin-bottom: 24px;
          }

          .guide-summary {
            font-size: 13px;
            color: var(--text-muted);
            margin-bottom: 14px;
            line-height: 1.55;
          }

          .guide-summary strong {
            color: var(--text-main);
            font-weight: 800;
          }

          .actions-row {
            display: flex;
            flex-wrap: wrap;
            gap: 10px;
            align-items: center;
          }

          .btn {
            display: inline-flex;
            align-items: center;
            gap: 6px;
            padding: 8px 14px;
            font-family: var(--font-mono);
            font-size: 12px;
            font-weight: 800;
            border: 2px solid var(--line-solid);
            box-shadow: var(--shadow-xs);
            cursor: pointer;
            text-decoration: none;
            color: var(--text-main);
            background: var(--bg-card);
            transition: transform 0.1s ease, box-shadow 0.1s ease, background 0.1s ease;
            user-select: none;
          }

          .btn:hover {
            transform: translate(-1px, -1px);
            box-shadow: var(--shadow-sm);
          }

          .btn:active {
            transform: translate(1px, 1px);
            box-shadow: none;
          }

          .btn-primary {
            background: var(--press-red);
            color: #ffffff;
            border-color: var(--line-solid);
          }
          .btn-primary:hover {
            background: #872324;
          }

          .btn-secondary {
            background: var(--press-blue);
            color: #ffffff;
            border-color: var(--line-solid);
          }
          .btn-secondary:hover {
            background: #1e40af;
          }

          .reader-group {
            display: inline-flex;
            align-items: center;
            gap: 6px;
            margin-left: auto;
          }

          .reader-label {
            font-family: var(--font-mono);
            font-size: 11px;
            font-weight: 700;
            color: var(--text-light);
          }

          .btn-reader {
            padding: 6px 10px;
            font-size: 11.5px;
            background: var(--bg-card-sub);
          }

          /* ===================================================
             3. 交互工具栏：分类 Tabs 与即时搜索
             =================================================== */
          .feed-toolbar {
            display: flex;
            flex-wrap: wrap;
            align-items: center;
            justify-content: space-between;
            gap: 12px;
            margin-bottom: 20px;
          }

          .tabs-container {
            display: flex;
            flex-wrap: wrap;
            gap: 6px;
          }

          .tab-btn {
            padding: 5px 12px;
            font-family: var(--font-sans);
            font-size: 12.5px;
            font-weight: 700;
            border: 2px solid var(--line-solid);
            background: var(--bg-card);
            color: var(--text-main);
            box-shadow: var(--shadow-xs);
            cursor: pointer;
            transition: all 0.1s ease;
          }

          .tab-btn:hover {
            transform: translate(-1px, -1px);
          }

          .tab-btn.active {
            background: var(--line-solid);
            color: var(--bg-card);
            box-shadow: none;
          }

          .search-box {
            position: relative;
            flex: 1;
            max-width: 260px;
            min-width: 180px;
          }

          .search-input {
            width: 100%;
            padding: 6px 12px;
            font-family: var(--font-sans);
            font-size: 12.5px;
            border: 2px solid var(--line-solid);
            background: var(--bg-card);
            color: var(--text-main);
            box-shadow: var(--shadow-xs);
            outline: none;
          }

          .search-input:focus {
            border-color: var(--press-red);
          }

          /* ===================================================
             4. 文章条目流（Cards Flow）
             =================================================== */
          .entries-list {
            display: flex;
            flex-direction: column;
            gap: 16px;
          }

          .entry-card {
            background: var(--bg-card);
            border: 2.5px solid var(--line-solid);
            box-shadow: var(--shadow-sm);
            padding: 20px 24px;
            transition: transform 0.15s ease, box-shadow 0.15s ease;
            display: flex;
            gap: 20px;
            align-items: stretch;
          }

          .entry-card:hover {
            transform: translate(-1.5px, -1.5px);
            box-shadow: var(--shadow-md);
          }

          .entry-main {
            flex: 1;
            min-width: 0;
            display: flex;
            flex-direction: column;
          }

          .entry-header {
            margin-bottom: 8px;
          }

          .entry-title {
            font-family: var(--font-serif);
            font-size: 18px;
            font-weight: 800;
            line-height: 1.35;
            color: var(--text-main);
            text-decoration: none;
            display: inline-block;
            transition: color 0.15s ease;
          }

          .entry-title:hover {
            color: var(--press-red);
          }

          .entry-meta {
            display: flex;
            flex-wrap: wrap;
            align-items: center;
            gap: 8px 12px;
            font-family: var(--font-mono);
            font-size: 11.5px;
            color: var(--text-muted);
            margin-top: 6px;
          }

          .badge-cat {
            background: var(--bg-card-sub);
            border: 1.2px solid var(--line-solid);
            padding: 1px 6px;
            font-weight: 700;
            color: var(--text-main);
            font-size: 11px;
          }

          .badge-talk {
            background: var(--press-red-soft);
            border: 1.2px solid var(--press-red);
            color: var(--press-red);
            padding: 1px 6px;
            font-weight: 700;
            font-size: 11px;
          }

          .entry-summary {
            font-size: 13.5px;
            color: var(--text-muted);
            line-height: 1.6;
            margin-bottom: 14px;
            flex: 1;
            display: -webkit-box;
            -webkit-line-clamp: 3;
            -webkit-box-orient: vertical;
            overflow: hidden;
          }

          .entry-footer-actions {
            display: flex;
            align-items: center;
            gap: 12px;
            margin-top: auto;
            padding-top: 8px;
          }

          .btn-read-modal {
            font-family: var(--font-sans);
            font-size: 12px;
            font-weight: 800;
            color: var(--press-red);
            text-decoration: none;
            display: inline-flex;
            align-items: center;
            gap: 4px;
            padding: 4px 8px;
            border: 1.5px solid var(--press-red);
            background: var(--press-red-soft);
            transition: background 0.15s ease, color 0.15s ease;
          }

          .btn-read-modal:hover {
            background: var(--press-red);
            color: #ffffff;
          }

          .btn-origin-link {
            font-family: var(--font-mono);
            font-size: 11.5px;
            color: var(--text-light);
            text-decoration: none;
          }

          .btn-origin-link:hover {
            color: var(--text-main);
            text-decoration: underline;
          }

          /* 封面配图自动提取呈现 */
          .entry-cover-wrapper {
            width: 170px;
            flex-shrink: 0;
            display: flex;
            align-items: center;
            justify-content: center;
          }

          .entry-cover {
            width: 100%;
            height: 115px;
            border: 2px solid var(--line-solid);
            box-shadow: var(--shadow-xs);
            object-fit: cover;
            background: var(--bg-card-sub);
            display: block;
          }

          @media (max-width: 640px) {
            .entry-card {
              flex-direction: column-reverse;
              padding: 16px 18px;
            }
            .entry-cover-wrapper {
              width: 100%;
            }
            .entry-cover {
              height: 160px;
            }
            .reader-group {
              width: 100%;
              margin-left: 0;
              margin-top: 6px;
            }
            .feed-masthead {
              padding: 18px 20px;
            }
            .masthead-core {
              flex-direction: column;
              align-items: flex-start;
            }
          }

          /* ===================================================
             5. 纸鹿同款：原生内嵌沉浸式全文阅读器（In-Page Modal）
             =================================================== */
          .article-modal {
            display: none;
          }

          .article-modal:target {
            display: flex;
            align-items: center;
            justify-content: center;
            position: fixed;
            inset: 0;
            z-index: 1000;
            padding: 20px;
            background: rgba(0, 0, 0, 0.65);
            backdrop-filter: blur(4px);
          }

          .modal-backdrop {
            position: absolute;
            inset: 0;
            cursor: default;
          }

          .modal-dialog {
            position: relative;
            z-index: 1001;
            width: 100%;
            max-width: 820px;
            max-height: 88vh;
            background: var(--bg-card);
            border: 3px solid var(--line-solid);
            box-shadow: var(--shadow-lg);
            display: flex;
            flex-direction: column;
            overflow: hidden;
            animation: modalPop 0.18s cubic-bezier(0.16, 1, 0.3, 1);
          }

          @keyframes modalPop {
            from {
              opacity: 0;
              transform: scale(0.96) translateY(8px);
            }
            to {
              opacity: 1;
              transform: scale(1) translateY(0);
            }
          }

          .modal-header {
            padding: 20px 24px;
            border-bottom: 2px solid var(--line-solid);
            background: var(--bg-card-sub);
            position: relative;
            flex-shrink: 0;
          }

          .modal-close {
            position: absolute;
            top: 14px;
            right: 14px;
            width: 32px;
            height: 32px;
            border: 2px solid var(--line-solid);
            box-shadow: var(--shadow-xs);
            background: var(--bg-card);
            color: var(--text-main);
            display: flex;
            align-items: center;
            justify-content: center;
            text-decoration: none;
            font-size: 18px;
            font-weight: 900;
            line-height: 1;
            cursor: pointer;
            transition: all 0.1s ease;
          }

          .modal-close:hover {
            background: var(--press-red);
            color: #ffffff;
            transform: translate(-1px, -1px);
          }

          .modal-meta-top {
            display: flex;
            align-items: center;
            gap: 10px;
            font-family: var(--font-mono);
            font-size: 12px;
            color: var(--text-muted);
            margin-bottom: 6px;
          }

          .modal-title {
            font-family: var(--font-serif);
            font-size: 22px;
            font-weight: 900;
            color: var(--text-main);
            line-height: 1.3;
            padding-right: 40px;
          }

          .modal-external-link {
            display: inline-block;
            margin-top: 6px;
            font-family: var(--font-mono);
            font-size: 11.5px;
            color: var(--press-red);
            text-decoration: none;
          }

          .modal-external-link:hover {
            text-decoration: underline;
          }

          .modal-body {
            padding: 28px 32px;
            overflow-y: auto;
            flex: 1;
            font-family: var(--font-serif), var(--font-sans), serif;
            font-size: 15px;
            line-height: 1.85;
            color: var(--text-main);
          }

          .modal-body p {
            margin: 1.1em 0;
          }

          .modal-body h1, .modal-body h2, .modal-body h3, .modal-body h4 {
            font-family: var(--font-serif);
            font-weight: 900;
            line-height: 1.4;
            margin: 1.4em 0 0.6em;
            color: var(--text-main);
          }

          .modal-body blockquote {
            margin: 1.2em 0;
            padding: 12px 18px;
            border-left: 3.5px solid var(--press-red);
            background: var(--press-red-soft);
            font-size: 14.5px;
          }

          .modal-body img {
            max-width: 100%;
            height: auto;
            display: block;
            margin: 1.5em auto;
            border: 2px solid var(--line-solid);
            box-shadow: var(--shadow-sm);
          }

          .modal-body pre {
            background: var(--bg-card-sub);
            border: 1.5px solid var(--line-solid);
            padding: 14px;
            overflow-x: auto;
            margin: 1.2em 0;
            font-family: var(--font-mono);
            font-size: 12.5px;
            line-height: 1.5;
          }

          .modal-body code {
            font-family: var(--font-mono);
            font-size: 12.5px;
            padding: 2px 5px;
            background: var(--bg-card-sub);
            border: 1px solid var(--line-solid);
          }

          .modal-body pre code {
            border: none;
            padding: 0;
            background: transparent;
          }

          .modal-body hr {
            border: none;
            border-top: 1.5px dashed var(--line-solid);
            margin: 2em 0;
          }

          /* ===================================================
             6. 页脚与浮层提示（Toast）
             =================================================== */
          .feed-footer {
            margin-top: 48px;
            padding-top: 20px;
            border-top: 2px solid var(--line-solid);
            display: flex;
            flex-wrap: wrap;
            align-items: center;
            justify-content: space-between;
            gap: 12px;
            font-family: var(--font-mono);
            font-size: 11.5px;
            color: var(--text-muted);
          }

          #copy-toast {
            position: fixed;
            bottom: 24px;
            left: 50%;
            transform: translateX(-50%) translateY(40px);
            background: var(--line-solid);
            color: var(--bg-card);
            font-family: var(--font-mono);
            font-size: 12px;
            font-weight: 800;
            padding: 10px 18px;
            border-radius: 2px;
            box-shadow: 0 4px 12px rgba(0, 0, 0, 0.25);
            opacity: 0;
            pointer-events: none;
            transition: all 0.2s cubic-bezier(0.16, 1, 0.3, 1);
            z-index: 9999;
          }

          #copy-toast.show {
            opacity: 1;
            transform: translateX(-50%) translateY(0);
          }
        </style>
      </head>

      <body>
        <div class="feed-container">
          <!-- 1. 报头区域 -->
          <header class="feed-masthead">
            <div class="masthead-top">
              <span class="masthead-seal">✦ 萬象拾遺 · 網絡訂閱公報 ✦</span>
              <xsl:choose>
                <xsl:when test="rss">
                  <span class="feed-badge">RSS 2.0 格式</span>
                </xsl:when>
                <xsl:when test="atom:feed">
                  <span class="feed-badge">Atom 1.0 格式</span>
                </xsl:when>
              </xsl:choose>
            </div>

            <div class="masthead-core">
              <xsl:variable name="avatar-src">
                <xsl:choose>
                  <xsl:when test="rss/channel/image/url and rss/channel/image/url != ''">
                    <xsl:value-of select="rss/channel/image/url" />
                  </xsl:when>
                  <xsl:when test="atom:feed/atom:logo and atom:feed/atom:logo != ''">
                    <xsl:value-of select="atom:feed/atom:logo" />
                  </xsl:when>
                  <xsl:when test="atom:feed/atom:icon and atom:feed/atom:icon != ''">
                    <xsl:value-of select="atom:feed/atom:icon" />
                  </xsl:when>
                  <xsl:otherwise>/images/me.jpg</xsl:otherwise>
                </xsl:choose>
              </xsl:variable>
              <img class="masthead-avatar" alt="Avatar" onerror="this.src='/images/me.jpg'; this.onerror=null;">
                <xsl:attribute name="src">
                  <xsl:value-of select="$avatar-src" />
                </xsl:attribute>
              </img>

              <div class="masthead-text">
                <h1 class="masthead-title">
                  <xsl:choose>
                    <xsl:when test="rss/channel/title"><xsl:value-of select="rss/channel/title" /></xsl:when>
                    <xsl:when test="atom:feed/atom:title"><xsl:value-of select="atom:feed/atom:title" /></xsl:when>
                    <xsl:otherwise>纸上随笔</xsl:otherwise>
                  </xsl:choose>
                </h1>
                <div class="masthead-subtitle">
                  <xsl:choose>
                    <xsl:when test="rss/channel/description"><xsl:value-of select="rss/channel/description" /></xsl:when>
                    <xsl:when test="atom:feed/atom:subtitle"><xsl:value-of select="atom:feed/atom:subtitle" /></xsl:when>
                    <xsl:otherwise>写下想法，留下记录。</xsl:otherwise>
                  </xsl:choose>
                </div>
                <div class="masthead-pills">
                  <span class="pill pill-green">● 连载更新中</span>
                  <span class="pill">
                    <xsl:choose>
                      <xsl:when test="rss">
                        收录 <xsl:value-of select="count(rss/channel/item)" /> 篇
                      </xsl:when>
                      <xsl:when test="atom:feed">
                        收录 <xsl:value-of select="count(atom:feed/atom:entry)" /> 篇
                      </xsl:when>
                    </xsl:choose>
                  </span>
                  <span class="pill">许可: CC BY-NC-SA 4.0</span>
                </div>
              </div>
            </div>
          </header>

          <!-- 2. 订阅快捷通道与阅读器一键直达 -->
          <section class="guide-section">
            <div class="guide-summary">
              这是本博客的实时更新订阅源（Web Feed）。在现代浏览器中直接打开时，XSLT 样式表会将 XML 渲染为当前排印页面。您可直接复制下方标准订阅源，或<strong>一键导入主流阅读器</strong>以静候推送。
            </div>
            <div class="actions-row">
              <button type="button" class="btn btn-primary" onclick="copyFeedUrl('/rss.xml', 'RSS 2.0')">
                📋 复制 RSS 2.0
              </button>
              <button type="button" class="btn btn-secondary" onclick="copyFeedUrl('/atom.xml', 'Atom 1.0')">
                📋 复制 Atom 1.0
              </button>
              <a href="/" class="btn">
                ← 返回博客首页
              </a>

              <div class="reader-group">
                <span class="reader-label">一键直达：</span>
                <a href="#" class="btn btn-reader" onclick="subscribeWith('follow'); return false;" title="在 Follow 中订阅">
                  Follow
                </a>
                <a href="#" class="btn btn-reader" onclick="subscribeWith('feedly'); return false;" title="在 Feedly 中订阅">
                  Feedly
                </a>
                <a href="#" class="btn btn-reader" onclick="subscribeWith('inoreader'); return false;" title="在 Inoreader 中订阅">
                  Inoreader
                </a>
                <a href="#" class="btn btn-reader" onclick="subscribeWith('native'); return false;" title="调用系统默认阅读器 (feed://)">
                  客户端
                </a>
              </div>
            </div>
          </section>

          <!-- 3. 分类 Tabs 与即时搜索工具栏 -->
          <div class="feed-toolbar">
            <div class="tabs-container">
              <button type="button" class="tab-btn active" onclick="setFilterTab('all', this)">全部</button>
              <button type="button" class="tab-btn" onclick="setFilterTab('post', this)">文章</button>
              <button type="button" class="tab-btn" onclick="setFilterTab('talk', this)">说说</button>
              <button type="button" class="tab-btn" onclick="setFilterTab('技术笔记', this)">技术笔记</button>
              <button type="button" class="tab-btn" onclick="setFilterTab('随笔', this)">随笔</button>
            </div>
            <div class="search-box">
              <input type="text" id="feed-search" class="search-input" placeholder="🔍 快速过滤标题或标签..." oninput="applyFilters()" />
            </div>
          </div>

          <!-- 4. 条目卡片流 -->
          <main class="entries-list" id="entries-container">
            <!-- RSS 2.0 条目遍历 -->
            <xsl:for-each select="rss/channel/item">
              <xsl:variable name="rss-modal-id" select="concat('entry-', generate-id())" />
              <xsl:variable name="rss-type">
                <xsl:choose>
                  <xsl:when test="starts-with(title, '「说说」')">talk</xsl:when>
                  <xsl:otherwise>post</xsl:otherwise>
                </xsl:choose>
              </xsl:variable>
              <xsl:variable name="rss-cat">
                <xsl:choose>
                  <xsl:when test="category"><xsl:value-of select="category" /></xsl:when>
                  <xsl:when test="starts-with(title, '「说说」')">说说</xsl:when>
                  <xsl:otherwise>文章</xsl:otherwise>
                </xsl:choose>
              </xsl:variable>
              <xsl:variable name="rss-img" select="substring-before(substring-after(substring-after(content:encoded, '&lt;img'), 'src=&quot;'), '&quot;')" />

              <article class="entry-card entry-item-wrapper" data-type="{$rss-type}" data-cat="{$rss-cat}">
                <div class="entry-main">
                  <div class="entry-header">
                    <a class="entry-title" href="#{$rss-modal-id}">
                      <xsl:value-of select="title" />
                    </a>
                    <div class="entry-meta">
                      <span class="format-date" datetime="{pubDate}">
                        <xsl:value-of select="pubDate" />
                      </span>
                      <span>·</span>
                      <span>作者：<xsl:value-of select="dc:creator" /></span>
                      <xsl:choose>
                        <xsl:when test="$rss-type = 'talk'">
                          <span class="badge-talk">说说</span>
                        </xsl:when>
                        <xsl:otherwise>
                          <span class="badge-cat"><xsl:value-of select="$rss-cat" /></span>
                        </xsl:otherwise>
                      </xsl:choose>
                    </div>
                  </div>

                  <div class="entry-summary">
                    <xsl:value-of select="description" />
                  </div>

                  <div class="entry-footer-actions">
                    <a class="btn-read-modal" href="#{$rss-modal-id}">
                      📖 原地阅读全文 ↗
                    </a>
                    <a class="btn-origin-link" href="{link}" target="_blank">
                      在主站原页打开 ↗
                    </a>
                  </div>
                </div>

                <!-- 自动封面配图 -->
                <xsl:if test="$rss-img and $rss-img != ''">
                  <div class="entry-cover-wrapper">
                    <a href="#{$rss-modal-id}">
                      <img class="entry-cover" src="{$rss-img}" alt="{title}" loading="lazy" onerror="this.parentElement.parentElement.style.display='none';" />
                    </a>
                  </div>
                </xsl:if>
              </article>

              <!-- 原生沉浸式全文阅读模态弹窗 -->
              <div class="article-modal" id="{$rss-modal-id}">
                <a class="modal-backdrop" href="#close" aria-label="关闭"></a>
                <div class="modal-dialog">
                  <div class="modal-header">
                    <a class="modal-close" href="#close" aria-label="关闭">×</a>
                    <div class="modal-meta-top">
                      <span class="badge-cat"><xsl:value-of select="$rss-cat" /></span>
                      <span class="format-date" datetime="{pubDate}"><xsl:value-of select="pubDate" /></span>
                    </div>
                    <h2 class="modal-title"><xsl:value-of select="title" /></h2>
                    <a class="modal-external-link" href="{link}" target="_blank">前往博客独立页面阅读 ↗</a>
                  </div>
                  <div class="modal-body">
                    <xsl:value-of select="content:encoded" disable-output-escaping="yes" />
                  </div>
                </div>
              </div>
            </xsl:for-each>

            <!-- Atom 1.0 条目遍历 -->
            <xsl:for-each select="atom:feed/atom:entry">
              <xsl:variable name="atom-modal-id" select="concat('entry-', generate-id())" />
              <xsl:variable name="atom-type">
                <xsl:choose>
                  <xsl:when test="atom:category/@term = '说说' or starts-with(atom:title, '「说说」')">talk</xsl:when>
                  <xsl:otherwise>post</xsl:otherwise>
                </xsl:choose>
              </xsl:variable>
              <xsl:variable name="atom-cat">
                <xsl:choose>
                  <xsl:when test="atom:category/@term"><xsl:value-of select="atom:category/@term" /></xsl:when>
                  <xsl:when test="starts-with(atom:title, '「说说」')">说说</xsl:when>
                  <xsl:otherwise>文章</xsl:otherwise>
                </xsl:choose>
              </xsl:variable>
              <xsl:variable name="atom-img" select="substring-before(substring-after(substring-after(atom:content, '&lt;img'), 'src=&quot;'), '&quot;')" />

              <article class="entry-card entry-item-wrapper" data-type="{$atom-type}" data-cat="{$atom-cat}">
                <div class="entry-main">
                  <div class="entry-header">
                    <a class="entry-title" href="#{$atom-modal-id}">
                      <xsl:value-of select="atom:title" />
                    </a>
                    <div class="entry-meta">
                      <span class="format-date" datetime="{atom:published}">
                        <xsl:value-of select="atom:published" />
                      </span>
                      <span>·</span>
                      <span>作者：<xsl:value-of select="atom:author/atom:name" /></span>
                      <xsl:choose>
                        <xsl:when test="$atom-type = 'talk'">
                          <span class="badge-talk">说说</span>
                        </xsl:when>
                        <xsl:otherwise>
                          <span class="badge-cat"><xsl:value-of select="$atom-cat" /></span>
                        </xsl:otherwise>
                      </xsl:choose>
                    </div>
                  </div>

                  <div class="entry-summary">
                    <xsl:value-of select="atom:summary" />
                  </div>

                  <div class="entry-footer-actions">
                    <a class="btn-read-modal" href="#{$atom-modal-id}">
                      📖 原地阅读全文 ↗
                    </a>
                    <a class="btn-origin-link" href="{atom:link/@href}" target="_blank">
                      在主站原页打开 ↗
                    </a>
                  </div>
                </div>

                <!-- 自动封面配图 -->
                <xsl:if test="$atom-img and $atom-img != ''">
                  <div class="entry-cover-wrapper">
                    <a href="#{$atom-modal-id}">
                      <img class="entry-cover" src="{$atom-img}" alt="{atom:title}" loading="lazy" onerror="this.parentElement.parentElement.style.display='none';" />
                    </a>
                  </div>
                </xsl:if>
              </article>

              <!-- 原生沉浸式全文阅读模态弹窗 -->
              <div class="article-modal" id="{$atom-modal-id}">
                <a class="modal-backdrop" href="#close" aria-label="关闭"></a>
                <div class="modal-dialog">
                  <div class="modal-header">
                    <a class="modal-close" href="#close" aria-label="关闭">×</a>
                    <div class="modal-meta-top">
                      <span class="badge-cat"><xsl:value-of select="$atom-cat" /></span>
                      <span class="format-date" datetime="{atom:published}"><xsl:value-of select="atom:published" /></span>
                    </div>
                    <h2 class="modal-title"><xsl:value-of select="atom:title" /></h2>
                    <a class="modal-external-link" href="{atom:link/@href}" target="_blank">前往博客独立页面阅读 ↗</a>
                  </div>
                  <div class="modal-body">
                    <xsl:value-of select="atom:content" disable-output-escaping="yes" />
                  </div>
                </div>
              </div>
            </xsl:for-each>
          </main>

          <!-- 5. 页脚 -->
          <footer class="feed-footer">
            <div>
              <span>© 2026 纸上随笔 · 示例作者 · 实体出版物订阅公报</span>
            </div>
            <div>
              <span>POWERED BY ASTRO &amp; XSLT 1.0</span>
            </div>
          </footer>
        </div>

        <div id="copy-toast">✓ 已复制订阅链接到剪贴板！</div>

        <!-- 6. 交互逻辑增强脚本 -->
        <script type="text/javascript">
          <![CDATA[
          var currentActiveTab = 'all';

          function copyFeedUrl(url, type) {
            var fullUrl = (url.indexOf("http") === 0) ? url : (window.location.origin + url);
            navigator.clipboard.writeText(fullUrl).then(function() {
              showToast("✓ 已复制 " + type + " 订阅链接到剪贴板！");
            }).catch(function() {
              prompt("请直接手动复制订阅地址：", fullUrl);
            });
          }

          function subscribeWith(reader) {
            var fullUrl = window.location.href.split('#')[0];
            if (reader === 'follow') {
              window.open('https://follow.is/feed/' + encodeURIComponent(fullUrl), '_blank');
            } else if (reader === 'feedly') {
              window.open('https://feedly.com/i/subscription/feed/' + encodeURIComponent(fullUrl), '_blank');
            } else if (reader === 'inoreader') {
              window.open('https://www.inoreader.com/feed/' + encodeURIComponent(fullUrl), '_blank');
            } else if (reader === 'native') {
              var feedProtocolUrl = fullUrl.replace(/^https?:\/\//i, 'feed://');
              window.location.href = feedProtocolUrl;
            }
          }

          function showToast(msg) {
            var toast = document.getElementById("copy-toast");
            toast.textContent = msg;
            toast.classList.add("show");
            setTimeout(function() {
              toast.classList.remove("show");
            }, 2500);
          }

          function setFilterTab(tabName, btnEl) {
            document.querySelectorAll(".tab-btn").forEach(function(b) {
              b.classList.remove("active");
            });
            btnEl.classList.add("active");
            currentActiveTab = tabName;
            applyFilters();
          }

          function applyFilters() {
            var query = document.getElementById("feed-search").value.toLowerCase().trim();
            var items = document.querySelectorAll(".entry-item-wrapper");

            items.forEach(function(item) {
              var type = item.getAttribute("data-type") || "";
              var cat = item.getAttribute("data-cat") || "";
              var text = item.textContent.toLowerCase();

              var matchTab = (currentActiveTab === "all") ||
                             (currentActiveTab === "post" && type === "post") ||
                             (currentActiveTab === "talk" && type === "talk") ||
                             (cat.indexOf(currentActiveTab) !== -1);

              var matchQuery = (!query || text.indexOf(query) !== -1);

              if (matchTab && matchQuery) {
                item.style.display = "";
              } else {
                item.style.display = "none";
              }
            });
          }

          // 本地化时间格式化与相对时间
          function formatDates() {
            document.querySelectorAll(".format-date").forEach(function(el) {
              var raw = el.getAttribute("datetime") || el.textContent;
              if (raw) {
                var d = new Date(raw);
                if (!isNaN(d.getTime())) {
                  var y = d.getFullYear();
                  var m = String(d.getMonth() + 1).padStart(2, '0');
                  var day = String(d.getDate()).padStart(2, '0');
                  var hh = String(d.getHours()).padStart(2, '0');
                  var mm = String(d.getMinutes()).padStart(2, '0');
                  el.textContent = y + "-" + m + "-" + day + " " + hh + ":" + mm;
                }
              }
            });
          }

          // ESC 键关闭弹出的全文阅读器
          window.addEventListener("keydown", function(e) {
            if (e.key === "Escape" && window.location.hash && window.location.hash.indexOf("#entry-") === 0) {
              window.location.hash = "close";
            }
          });

          document.addEventListener("DOMContentLoaded", function() {
            formatDates();
          });
          ]]>
        </script>
      </body>
    </html>
  </xsl:template>
</xsl:stylesheet>
