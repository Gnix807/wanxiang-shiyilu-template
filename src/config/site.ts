/** 模板默认配置：先修改站点 URL、作者资料及内容。可选服务默认关闭。 */
export interface NavItem { name: string; href: string; external?: boolean; }

export const aboutConfig = {
  "title": "关于我",
  "description": "在这里介绍你自己。",
  "role": "写作者",
  "intro": "你好，我是{author}。\n这里可以写你的经历、关注的话题，以及你为什么开始写博客。",
  "focusAreas": [
    "阅读",
    "写作",
    "生活"
  ],
  "dailyGear": [
    {
      "name": "Astro",
      "category": "Framework"
    },
    {
      "name": "Markdown",
      "category": "Writing"
    }
  ],
  "directory": [
    {
      "name": "RSS Feed",
      "handle": "订阅更新",
      "url": "/rss.xml",
      "icon": "rss",
      "label": "全站文章订阅源"
    }
  ],
  "nowCards": [
    {
      "section": "WRITING / 写作",
      "status": "DRAFT",
      "statusColor": "red",
      "title": "写第一篇文章",
      "desc": "把最近想记录的事情写下来。这里是可编辑的示例卡片。"
    }
  ],
  "bilibiliTitle": "视频作品",
  "skills": [
    "阅读",
    "写作",
    "生活"
  ],
  "githubBio": "",
  "githubLink": "https://github.com/Gnix807/wanxiang-shiyilu-template",
  "githubValue": "模板源码",
  "emailValue": "hello@example.com",
  "emailLink": "mailto:hello@example.com"
};

export const bannerConfig = {
  "title": "纸上随笔",
  "enTitle": "PAPER JOURNAL",
  "gridPatternOpacity": 0.12,
  "labels": {
    "category": "Category",
    "tag": "Tag",
    "post": "POST",
    "talk": "TALK"
  },
  "talkTicker": {
    "text": "日常记录",
    "sequence": [
      "日常记录",
      5000
    ]
  }
};

export const contentConfig = {
  "postsPerPage": 10,
  "readingSpeed": 400,
  "license": {
    "name": "MIT（模板示例）",
    "url": "https://github.com/Gnix807/wanxiang-shiyilu-template/blob/main/CONTENT_LICENSE.md"
  },
  "aiSummaryModels": [
    {
      "id": "gpt-oss",
      "name": "GPT-OSS-120B",
      "url": "",
      "hasThinking": false
    },
    {
      "id": "gemma",
      "name": "Gemma-4-31b-it (OpenRouter)",
      "url": "",
      "hasThinking": true
    },
    {
      "id": "deepseek-r1",
      "name": "DeepSeek-R1",
      "url": "",
      "hasThinking": true
    }
  ],
  "aiChatModels": [
    {
      "id": "gpt-oss",
      "name": "GPT-OSS-120B",
      "url": "",
      "hasThinking": false
    },
    {
      "id": "gemma",
      "name": "Gemma-4-31b-it (OpenRouter)",
      "url": "",
      "hasThinking": true
    },
    {
      "id": "deepseek-r1",
      "name": "DeepSeek-R1",
      "url": "",
      "hasThinking": true
    }
  ]
};

export const footerConfig = {
  "copyrightText": "© 2026 你的名字。",
  "icp": {
    "text": "",
    "link": ""
  },
  "links": [
    {
      "name": "友情链接",
      "path": "/friends",
      "external": false
    },
    {
      "name": "RSS / Atom",
      "path": "/rss.xml",
      "external": true
    },
    {
      "name": "Sitemap",
      "path": "/sitemap.xml",
      "external": true
    },
    {
      "name": "隐私政策",
      "path": "/privacy",
      "external": false
    }
  ],
  "repoText": "开源模板 ",
  "repoUrl": "https://github.com/Gnix807/wanxiang-shiyilu-template",
  "repoDisplayName": "WANXIANG-SHIYILU-TEMPLATE"
};

export const i18nConfig = {
  "notFound": {
    "title": "页面未找到",
    "bigText": "404",
    "message": "这个页面好像不见了",
    "backHome": "回到首页",
    "browseArchive": "浏览归档"
  },
  "archive": {
    "title": "文章归档",
    "description": "博客文章时间轴归档",
    "timelineTitle": "时间轴",
    "emptyText": "暂无文章归档",
    "emptySubtext": "还没有发布任何文章",
    "sectionTitle": "归档"
  },
  "home": {
    "title": "纸上随笔",
    "description": "一个专注阅读和写作的个人博客。",
    "sectionTitle": "最新文章"
  },
  "talks": {
    "title": "说说",
    "sectionTitle": "说说",
    "description": "生活随笔、思考碎片与日常分享。"
  },
  "talk": {
    "detailFallbackTitle": "说说详情"
  },
  "category": {
    "titleSuffix": " 分类",
    "descriptionTemplate": "{name} 分类下的全部文章"
  },
  "tag": {
    "titleSuffix": " 标签",
    "descriptionTemplate": "标签 {name} 下的全部文章"
  },
  "friends": {
    "title": "友情链接",
    "description": "友情链接，汇集各路神仙的有趣博客、个人小站。"
  },
  "privacy": {
    "title": "隐私政策",
    "description": "本站隐私政策——我们如何收集、使用和保护你的个人信息。",
    "lastUpdated": "2026 年 9 月 22 日",
    "effectiveDate": "2026 年 9 月 22 日",
    "contactEmail": "hello@example.com"
  },
  "stats": {
    "title": "网站统计"
  },
  "post": {
    "readingTime": "预计阅读",
    "readingTimeUnit": "分钟",
    "copyrightTitle": "作者",
    "publishedTitle": "发布于",
    "licenseTitle": "许可协议",
    "relatedPosts": "相关文章",
    "prevPost": "上一篇",
    "nextPost": "下一篇",
    "noMorePrev": "没有更多上一篇了",
    "noMoreNext": "没有更多下一篇了",
    "tocTitle": "目录",
    "tocEmpty": "无目录",
    "viewToc": "查看目录"
  },
  "search": {
    "placeholder": "搜索文章标题、简述、内容或标签...",
    "clear": "清除",
    "noResults": "哎呀，没有找到文章",
    "jumpTo": "跳转...",
    "go": "GO"
  },
  "common": {
    "darkMode": "暗色",
    "lightMode": "亮色",
    "more": "更多",
    "openMenu": "打开菜单",
    "closeMenu": "关闭菜单",
    "toggleDarkMode": "切换暗色模式"
  }
};

export const navConfig = {
  "desktop": [
    {
      "name": "首页",
      "href": "/"
    },
    {
      "name": "说说",
      "href": "/talks"
    },
    {
      "name": "友链",
      "href": "/friends"
    },
    {
      "name": "关于",
      "href": "/about"
    },
    {
      "name": "归档",
      "href": "/posts"
    },
    {
      "name": "统计",
      "href": "/blogstats"
    },
    {
      "name": "标签",
      "href": "/tags"
    }
  ],
  "mobileMore": [
    {
      "name": "友链",
      "href": "/friends"
    },
    {
      "name": "关于",
      "href": "/about"
    },
    {
      "name": "归档页面",
      "href": "/posts"
    },
    {
      "name": "博客统计",
      "href": "/blogstats"
    },
    {
      "name": "标签",
      "href": "/tags"
    },
    {
      "name": "建站统计",
      "href": "/blogstats"
    }
  ],
  "external": []
};

export const seoConfig = {
  "defaultTitle": "纸上随笔",
  "titleTemplate": " - 纸上随笔",
  "defaultDescription": "一个专注阅读和写作的个人博客。",
  "defaultImage": "/images/editorial-sample.svg",
  "keywords": [
    "博客",
    "写作",
    "阅读",
    "Astro"
  ],
  "twitter": {
    "card": "summary_large_image",
    "site": "",
    "creator": ""
  },
  "dnsPrefetch": [],
  "preconnect": [],
  "robots": "index, follow, max-image-preview:large, max-snippet:-1, max-video-preview:-1"
};

export const siteConfig = {
  "title": "纸上随笔",
  "enTitle": "PAPER JOURNAL",
  "subtitle": "写下想法，留下记录。",
  "description": "一个专注阅读和写作的个人博客。",
  "author": "你的名字",
  "url": import.meta.env?.PUBLIC_SITE_URL || 'https://example.com',
  "avatar": "/avatar.svg",
  "signature": "写下想法，留下记录。",
  "socials": {
    "github": "https://github.com/Gnix807/wanxiang-shiyilu-template",
    "githubUser": "",
    "bilibili": "",
    "bilibiliMid": "",
    "bilibiliDisplayName": "",
    "email": "hello@example.com",
    "website": "https://example.com",
    "twitter": "",
    "youtube": "",
    "wechat": "",
    "qq": "",
    "qqGroup": "",
    "subscribe": "/rss.xml"
  },
  "waline": {
    "serverURL": ""
  },
  "analytics": {
    "umami": [],
    "statsApi": {
      "alltime": "",
      "active": ""
    },
    "clarity": ""
  },
  "assets": {
    "siteBg": "",
    "defaultPostCover": "/images/editorial-sample.svg",
    "randomImage": "",
    "favicon": "/avatar.svg"
  },
  "startTime": new Date(2026, 0, 1),
  "trustedDomains": [
    "github.com",
    "docs.astro.build",
    "developers.cloudflare.com"
  ]
};

export const subtitleConfig = {
  "text": "写下想法，留下记录。",
  "sequence": [
    "写下想法，留下记录。",
    5000
  ]
};

export const welcomeConfig = {
  "enabled": false,
  "duration": 5000,
  "weatherApi": "",
  "fallbackMessage": "欢迎来访",
  "sessionKey": "journal_visit_flag",
  "quickLinks": []
};
