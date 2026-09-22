<?xml version="1.0" encoding="UTF-8"?>
<xsl:stylesheet version="1.0"
  xmlns:xsl="http://www.w3.org/1999/XSL/Transform"
  xmlns:sitemap="http://www.sitemaps.org/schemas/sitemap/0.9"
  exclude-result-prefixes="sitemap">

  <xsl:output method="html" version="5.0" encoding="UTF-8" indent="yes" />

  <xsl:template match="/">
    <html lang="zh-CN">
      <head>
        <meta charset="UTF-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <title>
          <xsl:choose>
            <xsl:when test="sitemap:sitemapindex or *[local-name()='sitemapindex']">纸上随笔 · 站点地图总索引 (Sitemap Index)</xsl:when>
            <xsl:otherwise>纸上随笔 · 站点索引公报 (XML Sitemap)</xsl:otherwise>
          </xsl:choose>
        </title>
        <link rel="stylesheet" href="/fonts.css" />
        <style type="text/css">
          :root {
            /* 100% 对标主站新粗野主义与实体报刊设计规范 */
            --font-serif: "Noto Serif SC", "Source Han Serif SC", "Songti SC", "STSong", "SimSun", Georgia, serif;
            --font-sans: "Inter", "Inter Variable", "Noto Sans SC", -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", "PingFang SC", "Hiragino Sans GB", "Microsoft YaHei", sans-serif;
            --font-mono: "JetBrains Mono", "Noto Sans SC", "SF Mono", Menlo, Consolas, monospace;

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
            --press-green-soft: rgba(21, 128, 61, 0.08);

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
              --press-green-soft: rgba(34, 197, 94, 0.16);

              --shadow-xs: 1.5px 1.5px 0 #000000;
              --shadow-sm: 2.5px 2.5px 0 #000000;
              --shadow-md: 4px 4px 0 #000000;
              --shadow-lg: 6px 6px 0 #000000;
            }
          }

          html.dark {
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
            --press-green-soft: rgba(34, 197, 94, 0.16);

            --shadow-xs: 1.5px 1.5px 0 #000000;
            --shadow-sm: 2.5px 2.5px 0 #000000;
            --shadow-md: 4px 4px 0 #000000;
            --shadow-lg: 6px 6px 0 #000000;
          }

          html.light {
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
            --press-green-soft: rgba(21, 128, 61, 0.08);

            --shadow-xs: 1.5px 1.5px 0 var(--line-solid);
            --shadow-sm: 2.5px 2.5px 0 var(--line-solid);
            --shadow-md: 4px 4px 0 var(--line-solid);
            --shadow-lg: 6px 6px 0 var(--line-solid);
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

          .sitemap-container {
            max-width: 1060px;
            margin: 0 auto;
          }

          /* ===================================================
             1. 报头（Masthead）：出版物实体风格
             =================================================== */
          .sitemap-masthead {
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
            flex-wrap: wrap;
            gap: 12px;
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

          .masthead-badges {
            display: flex;
            align-items: center;
            gap: 8px;
          }

          .badge-mono {
            background: var(--line-solid);
            color: var(--bg-card);
            font-family: var(--font-mono);
            font-size: 11px;
            font-weight: 800;
            padding: 3px 8px;
            border-radius: 2px;
            letter-spacing: 0.5px;
          }

          .theme-btn {
            background: var(--bg-card-sub);
            color: var(--text-main);
            border: 1.5px solid var(--line-solid);
            box-shadow: var(--shadow-xs);
            font-size: 12px;
            font-weight: 700;
            padding: 3px 10px;
            border-radius: 2px;
            cursor: pointer;
            transition: all 0.15s ease;
          }
          .theme-btn:hover {
            transform: translate(-1px, -1px);
            box-shadow: var(--shadow-sm);
          }

          .masthead-main {
            display: flex;
            align-items: flex-start;
            justify-content: space-between;
            gap: 24px;
            flex-wrap: wrap;
          }

          .masthead-brand {
            display: flex;
            align-items: center;
            gap: 16px;
          }

          .masthead-avatar {
            width: 64px;
            height: 64px;
            border: 2px solid var(--line-solid);
            box-shadow: var(--shadow-xs);
            background: #fff;
            object-fit: cover;
            border-radius: 2px;
            flex-shrink: 0;
          }

          .masthead-title {
            font-family: var(--font-serif);
            font-size: 26px;
            font-weight: 900;
            letter-spacing: 0.5px;
            line-height: 1.25;
            color: var(--text-main);
            margin-bottom: 4px;
          }

          .masthead-subtitle {
            font-size: 13.5px;
            color: var(--text-muted);
            font-weight: 500;
          }

          .masthead-notice {
            background: var(--bg-card-sub);
            border-left: 3px solid var(--press-red);
            padding: 12px 16px;
            margin-top: 18px;
            font-size: 13px;
            line-height: 1.6;
            color: var(--text-muted);
          }

          .masthead-actions {
            display: flex;
            align-items: center;
            gap: 10px;
            margin-top: 18px;
            flex-wrap: wrap;
          }

          .action-btn {
            display: inline-flex;
            align-items: center;
            gap: 6px;
            background: var(--bg-card);
            color: var(--text-main);
            border: 1.5px solid var(--line-solid);
            box-shadow: var(--shadow-xs);
            padding: 6px 14px;
            font-size: 12.5px;
            font-weight: 700;
            text-decoration: none;
            border-radius: 2px;
            cursor: pointer;
            transition: all 0.15s ease;
          }
          .action-btn:hover {
            transform: translate(-1.5px, -1.5px);
            box-shadow: var(--shadow-sm);
            color: var(--press-red);
          }

          .action-btn.primary {
            background: var(--press-red);
            color: #ffffff;
            border-color: var(--press-red);
          }
          .action-btn.primary:hover {
            color: #ffffff;
            background: #842324;
          }

          /* ===================================================
             2. 概览指标牌（Stat Metrics）
             =================================================== */
          .metrics-grid {
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(180px, 1fr));
            gap: 14px;
            margin-bottom: 24px;
          }

          .metric-card {
            background: var(--bg-card);
            border: 2px solid var(--line-solid);
            box-shadow: var(--shadow-sm);
            padding: 14px 18px;
            border-radius: 2px;
            transition: transform 0.15s ease;
          }
          .metric-card:hover {
            transform: translateY(-2px);
          }

          .metric-label {
            font-size: 12px;
            font-weight: 700;
            color: var(--text-light);
            letter-spacing: 0.5px;
            margin-bottom: 4px;
            display: flex;
            align-items: center;
            justify-content: space-between;
          }

          .metric-num {
            font-family: var(--font-mono);
            font-size: 24px;
            font-weight: 800;
            color: var(--text-main);
            line-height: 1.2;
          }

          .metric-num.highlight {
            color: var(--press-red);
          }

          /* ===================================================
             3. 搜索与交互筛选工具条
             =================================================== */
          .control-panel {
            background: var(--bg-card);
            border: 2px solid var(--line-solid);
            box-shadow: var(--shadow-sm);
            padding: 14px 18px;
            margin-bottom: 20px;
            display: flex;
            align-items: center;
            justify-content: space-between;
            flex-wrap: wrap;
            gap: 14px;
          }

          .filter-tabs {
            display: flex;
            align-items: center;
            gap: 8px;
            flex-wrap: wrap;
          }

          .tab-btn {
            background: var(--bg-card-sub);
            color: var(--text-main);
            border: 1.5px solid var(--line-solid);
            padding: 5px 12px;
            font-size: 12px;
            font-weight: 700;
            border-radius: 2px;
            cursor: pointer;
            transition: all 0.12s ease;
          }
          .tab-btn:hover {
            background: var(--bg-card);
          }
          .tab-btn.active {
            background: var(--line-solid);
            color: var(--bg-card);
            box-shadow: var(--shadow-xs);
          }

          .search-box {
            position: relative;
            flex: 1;
            min-width: 240px;
            max-width: 400px;
          }

          .search-input {
            width: 100%;
            background: var(--bg-card);
            border: 1.5px solid var(--line-solid);
            padding: 6px 12px 6px 32px;
            font-family: var(--font-sans);
            font-size: 13px;
            color: var(--text-main);
            border-radius: 2px;
            outline: none;
            transition: border-color 0.15s ease, box-shadow 0.15s ease;
          }
          .search-input:focus {
            border-color: var(--press-red);
            box-shadow: var(--shadow-xs);
          }

          .search-icon {
            position: absolute;
            left: 10px;
            top: 50%;
            transform: translateY(-50%);
            font-size: 12px;
            color: var(--text-light);
            pointer-events: none;
          }

          .count-indicator {
            font-family: var(--font-mono);
            font-size: 12px;
            font-weight: 600;
            color: var(--text-muted);
            white-space: nowrap;
          }

          /* ===================================================
             4. 出版物实体数据表格（Neo-Brutalist Table）
             =================================================== */
          .editorial-table-wrapper {
            display: block;
            width: 100%;
            max-width: 100%;
            overflow-x: auto;
            border: 2.5px solid var(--line-solid);
            border-radius: 4px;
            box-shadow: var(--shadow-md);
            background: var(--bg-card);
            -webkit-overflow-scrolling: touch;
            margin-bottom: 32px;
          }

          .sitemap-table {
            width: 100%;
            border-collapse: collapse;
            font-size: 13px;
            line-height: 1.6;
            text-align: left;
            min-width: 680px;
          }

          .sitemap-table thead {
            background: var(--bg-card-sub);
            border-bottom: 2.5px solid var(--line-solid);
          }

          .sitemap-table th {
            padding: 12px 14px;
            font-weight: 800;
            font-family: var(--font-sans);
            letter-spacing: 0.03em;
            color: var(--text-main);
            white-space: nowrap;
            user-select: none;
          }

          .sitemap-table th:not(:last-child) {
            border-right: 1.5px solid var(--line-subtle);
          }

          .sitemap-table tbody tr {
            border-bottom: 1px solid var(--line-subtle);
            transition: background-color 0.12s ease;
          }

          .sitemap-table tbody tr:last-child {
            border-bottom: none;
          }

          .sitemap-table tbody tr:hover {
            background-color: var(--press-red-soft);
          }

          .sitemap-table tbody tr:nth-child(even) {
            background-color: rgba(0, 0, 0, 0.015);
          }
          html.dark .sitemap-table tbody tr:nth-child(even) {
            background-color: rgba(255, 255, 255, 0.02);
          }

          .sitemap-table td {
            padding: 10px 14px;
            vertical-align: middle;
            color: var(--text-main);
          }

          .sitemap-table td:not(:last-child) {
            border-right: 1px dashed var(--line-subtle);
          }

          /* 各列针对性精细排版 */
          .col-index {
            width: 1%;
            white-space: nowrap;
            font-family: var(--font-mono);
            font-size: 12px;
            font-weight: 700;
            color: var(--text-light);
            text-align: center;
          }

          .col-url {
            word-break: break-all;
          }

          .url-main {
            font-family: var(--font-mono);
            font-weight: 700;
            font-size: 13px;
            color: var(--text-main);
            text-decoration: none;
            transition: color 0.12s ease;
            display: inline-flex;
            align-items: center;
            gap: 6px;
          }
          .url-main:hover {
            color: var(--press-red);
            text-decoration: underline;
          }

          .url-full {
            display: block;
            font-family: var(--font-mono);
            font-size: 11px;
            color: var(--text-light);
            margin-top: 2px;
          }

          .url-actions {
            display: inline-flex;
            gap: 6px;
            margin-left: 8px;
            opacity: 0.85;
          }
          .mini-copy-btn {
            background: transparent;
            border: 1px solid var(--line-subtle);
            font-size: 10.5px;
            padding: 1px 5px;
            border-radius: 2px;
            cursor: pointer;
            color: var(--text-muted);
            font-family: var(--font-mono);
          }
          .mini-copy-btn:hover {
            border-color: var(--line-solid);
            color: var(--press-red);
          }

          .col-type {
            width: 1%;
            white-space: nowrap;
          }

          .type-badge {
            display: inline-block;
            font-size: 11.5px;
            font-weight: 700;
            padding: 2px 8px;
            border-radius: 2px;
            border: 1px solid var(--line-solid);
          }
          .type-post {
            background: var(--press-red-soft);
            color: var(--press-red);
            border-color: var(--press-red);
          }
          .type-talk {
            background: var(--press-blue-soft);
            color: var(--press-blue);
            border-color: var(--press-blue);
          }
          .type-page {
            background: var(--bg-card-sub);
            color: var(--text-main);
            border-color: var(--line-solid);
          }

          .col-date {
            width: 1%;
            white-space: nowrap;
            font-family: var(--font-mono);
            font-size: 12px;
            color: var(--text-muted);
          }

          .col-freq {
            width: 1%;
            white-space: nowrap;
          }

          .freq-pill {
            display: inline-block;
            font-family: var(--font-mono);
            font-size: 11px;
            font-weight: 600;
            padding: 2px 6px;
            background: var(--bg-card-sub);
            border-radius: 2px;
            border: 1px solid var(--line-subtle);
            color: var(--text-muted);
          }

          .col-priority {
            width: 1%;
            white-space: nowrap;
          }

          .prio-pill {
            display: inline-flex;
            align-items: center;
            gap: 4px;
            font-family: var(--font-mono);
            font-size: 11.5px;
            font-weight: 800;
            padding: 2px 8px;
            border-radius: 2px;
            border: 1px solid var(--line-solid);
          }
          .prio-high {
            background: var(--press-red);
            color: #ffffff;
            border-color: var(--press-red);
          }
          .prio-mid {
            background: var(--line-solid);
            color: var(--bg-card);
          }
          .prio-low {
            background: var(--bg-card-sub);
            color: var(--text-muted);
            border-color: var(--line-subtle);
          }

          /* 空搜索状态 */
          .empty-row {
            text-align: center;
            padding: 36px 16px !important;
            color: var(--text-muted);
            font-size: 14px;
          }

          /* ===================================================
             5. 页脚（Footer）
             =================================================== */
          .sitemap-footer {
            margin-top: 32px;
            padding-top: 20px;
            border-top: 2px solid var(--line-solid);
            display: flex;
            justify-content: space-between;
            align-items: center;
            flex-wrap: wrap;
            gap: 12px;
            font-size: 12.5px;
            color: var(--text-light);
          }

          .footer-links a {
            color: var(--text-muted);
            text-decoration: none;
            margin-left: 14px;
            font-weight: 600;
          }
          .footer-links a:hover {
            color: var(--press-red);
            text-decoration: underline;
          }

          /* 复制成功浮动提示 */
          #copy-toast {
            position: fixed;
            bottom: 28px;
            left: 50%;
            transform: translateX(-50%) translateY(20px);
            background: var(--line-solid);
            color: var(--bg-card);
            border: 1.5px solid var(--press-red);
            box-shadow: var(--shadow-md);
            padding: 9px 20px;
            font-size: 13px;
            font-weight: 700;
            border-radius: 2px;
            opacity: 0;
            pointer-events: none;
            transition: all 0.25s cubic-bezier(0.16, 1, 0.3, 1);
            z-index: 99999;
          }
          #copy-toast.show {
            opacity: 1;
            transform: translateX(-50%) translateY(0);
          }
        </style>
      </head>
      <body>
        <div class="sitemap-container">
          <!-- 1. 报头区域 -->
          <header class="sitemap-masthead">
            <div class="masthead-top">
              <div class="masthead-seal">
                <span>❖</span>
                <span>纸上随笔 · 站点舆图公报</span>
              </div>
              <div class="masthead-badges">
                <span class="badge-mono">SITEMAP 0.9</span>
                <span class="badge-mono">ROBOTS-READY</span>
                <button class="theme-btn" id="theme-toggle-btn" onclick="toggleTheme()">🌓 主题</button>
              </div>
            </div>

            <div class="masthead-main">
              <div class="masthead-brand">
                <img src="/images/editorial-sample.svg" alt="纸上随笔" class="masthead-avatar" onerror="this.style.display='none'" />
                <div>
                  <h1 class="masthead-title">
                    <xsl:choose>
                      <xsl:when test="sitemap:sitemapindex or *[local-name()='sitemapindex']">站点地图总索引 (Sitemap Index)</xsl:when>
                      <xsl:otherwise>站点索引公报 (Site Index Gazette)</xsl:otherwise>
                    </xsl:choose>
                  </h1>
                  <p class="masthead-subtitle">PAPER JOURNAL · XML SITEMAP &amp; SEARCH ENGINE DIRECTORY</p>
                </div>
              </div>
            </div>

            <div class="masthead-notice">
              本 XML 站点地图由纸上随笔系统自动生成，严格遵循 <a href="https://www.sitemaps.org/" target="_blank" style="color: var(--press-red); font-weight: 700; text-decoration: underline;">Sitemaps.org</a> 协议，旨在协助搜索引擎（Google、Bing、Baidu 等）更高效地检索与抓取本站全量内容。当前页面已挂载实体报刊级 XSLT 排版样式，便于站长与访客直接检视全站索引结构。
            </div>

            <div class="masthead-actions">
              <a href="/" class="action-btn primary">🏠 返回博客主页</a>
              <button class="action-btn" onclick="copyCurrentSitemap()">📋 复制 Sitemap 链接</button>
              <a href="/posts/" class="action-btn">📰 文章专栏</a>
              <a href="/talks/" class="action-btn">💬 碎语说说</a>
              <a href="/atom.xml" class="action-btn">📡 Atom 订阅</a>
            </div>
          </header>

          <xsl:choose>
            <!-- A. 若为 Sitemap Index 根节点 -->
            <xsl:when test="sitemap:sitemapindex or *[local-name()='sitemapindex']">
              <div class="editorial-table-wrapper">
                <table class="sitemap-table">
                  <thead>
                    <tr>
                      <th class="col-index">#</th>
                      <th>子地图文件地址 (Sitemap Location)</th>
                      <th class="col-date">最近修改时间</th>
                      <th class="col-type">操作</th>
                    </tr>
                  </thead>
                  <tbody>
                    <xsl:for-each select="sitemap:sitemapindex/sitemap:sitemap | *[local-name()='sitemapindex']/*[local-name()='sitemap']">
                      <xsl:variable name="sub-loc" select="sitemap:loc | *[local-name()='loc']" />
                      <tr>
                        <td class="col-index"><xsl:value-of select="position()" /></td>
                        <td class="col-url">
                          <a href="{$sub-loc}" class="url-main"><xsl:value-of select="$sub-loc" /> ↗</a>
                        </td>
                        <td class="col-date">
                          <xsl:value-of select="sitemap:lastmod | *[local-name()='lastmod']" />
                        </td>
                        <td class="col-type">
                          <a href="{$sub-loc}" class="action-btn" style="padding: 2px 8px; font-size: 11px;">检视子地图</a>
                        </td>
                      </tr>
                    </xsl:for-each>
                  </tbody>
                </table>
              </div>
            </xsl:when>

            <!-- B. 常规 urlset 列表 -->
            <xsl:otherwise>
              <!-- 2. 数据指标看板 -->
              <div class="metrics-grid">
                <div class="metric-card">
                  <div class="metric-label">收录条目总数 <span>TOTAL</span></div>
                  <div class="metric-num highlight" id="metric-total">
                    <xsl:value-of select="count(sitemap:urlset/sitemap:url | *[local-name()='urlset']/*[local-name()='url'])" />
                  </div>
                </div>
                <div class="metric-card">
                  <div class="metric-label">文章专栏 <span>POSTS</span></div>
                  <div class="metric-num" id="metric-posts">--</div>
                </div>
                <div class="metric-card">
                  <div class="metric-label">碎语动态 <span>TALKS</span></div>
                  <div class="metric-num" id="metric-talks">--</div>
                </div>
                <div class="metric-card">
                  <div class="metric-label">核心页面 <span>PAGES</span></div>
                  <div class="metric-num" id="metric-pages">--</div>
                </div>
              </div>

              <!-- 3. 筛选与检索控制台 -->
              <div class="control-panel">
                <div class="filter-tabs">
                  <button class="tab-btn active" data-filter="all" onclick="filterType('all', this)">全部条目</button>
                  <button class="tab-btn" data-filter="post" onclick="filterType('post', this)">文章专栏</button>
                  <button class="tab-btn" data-filter="talk" onclick="filterType('talk', this)">碎语说说</button>
                  <button class="tab-btn" data-filter="page" onclick="filterType('page', this)">核心页面</button>
                </div>

                <div class="search-box">
                  <span class="search-icon">🔍</span>
                  <input type="text" id="sitemap-search" class="search-input" placeholder="输入路径、文章或关键词即时检索..." oninput="applyFilterAndSearch()" />
                </div>

                <div class="count-indicator" id="count-indicator">
                  正在加载索引...
                </div>
              </div>

              <!-- 4. 出版物级实体表格 -->
              <div class="editorial-table-wrapper custom-scrollbar">
                <table class="sitemap-table" id="sitemap-table">
                  <thead>
                    <tr>
                      <th class="col-index">#</th>
                      <th>页面链接与访问路径 (URL Location)</th>
                      <th class="col-type">类型</th>
                      <th class="col-date">更新日期</th>
                      <th class="col-freq">更新频率</th>
                      <th class="col-priority">权重</th>
                    </tr>
                  </thead>
                  <tbody>
                    <xsl:for-each select="sitemap:urlset/sitemap:url | *[local-name()='urlset']/*[local-name()='url']">
                      <xsl:variable name="loc" select="sitemap:loc | *[local-name()='loc']" />
                      <xsl:variable name="prio" select="sitemap:priority | *[local-name()='priority']" />
                      <xsl:variable name="freq" select="sitemap:changefreq | *[local-name()='changefreq']" />
                      <xsl:variable name="mod" select="sitemap:lastmod | *[local-name()='lastmod']" />

                      <xsl:variable name="itemType">
                        <xsl:choose>
                          <xsl:when test="contains($loc, '/posts/')">post</xsl:when>
                          <xsl:when test="contains($loc, '/talk/') or contains($loc, '/talks/')">talk</xsl:when>
                          <xsl:otherwise>page</xsl:otherwise>
                        </xsl:choose>
                      </xsl:variable>

                      <tr class="sitemap-row" data-type="{$itemType}" data-url="{$loc}">
                        <td class="col-index"><xsl:value-of select="position()" /></td>
                        <td class="col-url">
                          <a href="{$loc}" class="url-main" target="_blank" rel="noopener noreferrer">
                            <xsl:value-of select="$loc" /> ↗
                          </a>
                          <button class="mini-copy-btn" onclick="copySingleUrl('{$loc}')" title="复制完整 URL">复制</button>
                        </td>
                        <td class="col-type">
                          <xsl:choose>
                            <xsl:when test="$itemType = 'post'">
                              <span class="type-badge type-post">文章专栏</span>
                            </xsl:when>
                            <xsl:when test="$itemType = 'talk'">
                              <span class="type-badge type-talk">碎语说说</span>
                            </xsl:when>
                            <xsl:otherwise>
                              <span class="type-badge type-page">核心页面</span>
                            </xsl:otherwise>
                          </xsl:choose>
                        </td>
                        <td class="col-date">
                          <xsl:choose>
                            <xsl:when test="$mod != ''">
                              <span class="format-date"><xsl:value-of select="$mod" /></span>
                            </xsl:when>
                            <xsl:otherwise>
                              <span style="color: var(--text-light);">-</span>
                            </xsl:otherwise>
                          </xsl:choose>
                        </td>
                        <td class="col-freq">
                          <span class="freq-pill"><xsl:value-of select="$freq" /></span>
                        </td>
                        <td class="col-priority">
                          <xsl:choose>
                            <xsl:when test="$prio = '1.0'">
                              <span class="prio-pill prio-high">1.0 顶核</span>
                            </xsl:when>
                            <xsl:when test="$prio = '0.9' or $prio = '0.8'">
                              <span class="prio-pill prio-mid"><xsl:value-of select="$prio" /> 推荐</span>
                            </xsl:when>
                            <xsl:otherwise>
                              <span class="prio-pill prio-low"><xsl:value-of select="$prio" /> 常规</span>
                            </xsl:otherwise>
                          </xsl:choose>
                        </td>
                      </tr>
                    </xsl:for-each>
                    <tr id="empty-state-row" style="display: none;">
                      <td colspan="6" class="empty-row">
                        未检索到与查询条件匹配的站点页面条目。
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </xsl:otherwise>
          </xsl:choose>

          <!-- 5. 页脚区域 -->
          <footer class="sitemap-footer">
            <div>
              <span>© 2026 纸上随笔 · 示例作者 · 站点索引公报</span>
            </div>
            <div class="footer-links">
              <a href="https://www.sitemaps.org/" target="_blank">Sitemaps 官方规范</a>
              <a href="/robots.txt" target="_blank">robots.txt</a>
              <a href="/atom.xml" target="_blank">Atom 订阅</a>
            </div>
          </footer>
        </div>

        <div id="copy-toast">✓ 已复制链接到剪贴板！</div>

        <!-- 6. 交互逻辑脚本 -->
        <script type="text/javascript">
          <![CDATA[
          var currentTypeFilter = 'all';

          function toggleTheme() {
            var html = document.documentElement;
            if (html.classList.contains('dark')) {
              html.classList.remove('dark');
              html.classList.add('light');
              localStorage.setItem('sitemap-theme', 'light');
            } else {
              html.classList.remove('light');
              html.classList.add('dark');
              localStorage.setItem('sitemap-theme', 'dark');
            }
          }

          function initTheme() {
            var saved = localStorage.getItem('sitemap-theme');
            if (saved === 'dark' || (!saved && window.matchMedia('(prefers-color-scheme: dark)').matches)) {
              document.documentElement.classList.add('dark');
            } else if (saved === 'light') {
              document.documentElement.classList.add('light');
            }
          }

          function showToast(text) {
            var toast = document.getElementById('copy-toast');
            if (!toast) return;
            toast.textContent = text;
            toast.classList.add('show');
            setTimeout(function() {
              toast.classList.remove('show');
            }, 2000);
          }

          function copyCurrentSitemap() {
            var url = window.location.href;
            navigator.clipboard.writeText(url).then(function() {
              showToast('✓ 已复制 Sitemap 地址到剪贴板！');
            }).catch(function() {
              prompt('请直接手动复制 Sitemap 地址：', url);
            });
          }

          function copySingleUrl(url) {
            navigator.clipboard.writeText(url).then(function() {
              showToast('✓ 已复制页面链接！');
            }).catch(function() {
              prompt('复制页面链接：', url);
            });
          }

          function filterType(type, btn) {
            currentTypeFilter = type;
            document.querySelectorAll('.tab-btn').forEach(function(b) {
              b.classList.remove('active');
            });
            if (btn) btn.classList.add('active');
            applyFilterAndSearch();
          }

          function applyFilterAndSearch() {
            var query = (document.getElementById('sitemap-search') ? document.getElementById('sitemap-search').value : '').toLowerCase().trim();
            var rows = document.querySelectorAll('.sitemap-row');
            var visibleCount = 0;
            var totalCount = rows.length;

            rows.forEach(function(row) {
              var rType = row.getAttribute('data-type') || '';
              var rUrl = row.getAttribute('data-url') || '';
              var rowText = row.textContent.toLowerCase();

              var matchType = (currentTypeFilter === 'all') || (rType === currentTypeFilter);
              var matchQuery = (!query) || (rowText.indexOf(query) !== -1) || (rUrl.toLowerCase().indexOf(query) !== -1);

              if (matchType && matchQuery) {
                row.style.display = '';
                visibleCount++;
              } else {
                row.style.display = 'none';
              }
            });

            var countEl = document.getElementById('count-indicator');
            if (countEl) {
              countEl.textContent = '显示 ' + visibleCount + ' / ' + totalCount + ' 个索引条目';
            }

            var emptyRow = document.getElementById('empty-state-row');
            if (emptyRow) {
              emptyRow.style.display = (visibleCount === 0 && totalCount > 0) ? '' : 'none';
            }
          }

          function computeStats() {
            var rows = document.querySelectorAll('.sitemap-row');
            var postCount = 0;
            var talkCount = 0;
            var pageCount = 0;

            rows.forEach(function(row) {
              var type = row.getAttribute('data-type');
              if (type === 'post') postCount++;
              else if (type === 'talk') talkCount++;
              else pageCount++;
            });

            var pEl = document.getElementById('metric-posts');
            if (pEl) pEl.textContent = postCount;
            var tEl = document.getElementById('metric-talks');
            if (tEl) tEl.textContent = talkCount;
            var pgEl = document.getElementById('metric-pages');
            if (pgEl) pgEl.textContent = pageCount;
          }

          document.addEventListener('DOMContentLoaded', function() {
            initTheme();
            computeStats();
            applyFilterAndSearch();
          });
          ]]>
        </script>
      </body>
    </html>
  </xsl:template>
</xsl:stylesheet>
