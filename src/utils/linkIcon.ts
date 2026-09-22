/**
 * 链接域名识别与品牌图标库 (Link Domain & Brand Icon Intelligence)
 * 借鉴 Zhilu / Clarity / Nuxt Content ProseA 规范，提供细致的站点域名匹配与矢量图标映射。
 */

export interface LinkMeta {
  url: string;
  domain: string;
  isExternal: boolean;
  iconName: string;
  iconSvg: string;
}

// 统一尺寸与视口规范，纯净完整矢量印徽
export const BRAND_ICONS: Record<string, string> = {
  // 微软文档 / Windows / Microsoft (四色窗格印)
  microsoft: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" class="link-brand-svg"><path d="M1 1h10v10H1V1zm12 0h10v10H13V1zM1 13h10v10H1V13zm12 0h10v10H13V13z"/></svg>`,
  
  // GitHub (完整八爪章鱼猫徽)
  github: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" class="link-brand-svg"><path d="M12.001 2c-5.525 0-10 4.475-10 10a9.99 9.99 0 0 0 6.837 9.488c.5.087.688-.213.688-.476c0-.237-.013-1.024-.013-1.862c-2.512.463-3.162-.612-3.362-1.175c-.113-.288-.6-1.175-1.025-1.413c-.35-.187-.85-.65-.013-.662c.788-.013 1.35.725 1.538 1.025c.9 1.512 2.337 1.087 2.912.825c.088-.65.35-1.087.638-1.337c-2.225-.25-4.55-1.113-4.55-4.938c0-1.088.387-1.987 1.025-2.687c-.1-.25-.45-1.275.1-2.65c0 0 .837-.263 2.75 1.024a9.3 9.3 0 0 1 2.5-.337c.85 0 1.7.112 2.5.337c1.913-1.3 2.75-1.024 2.75-1.024c.55 1.375.2 2.4.1 2.65c.637.7 1.025 1.587 1.025 2.687c0 3.838-2.337 4.688-4.562 4.938c.362.312.675.912.675 1.85c0 1.337-.013 2.412-.013 2.75c0 .262.188.574.688.474A10.02 10.02 0 0 0 22 12c0-5.525-4.475-10-10-10"/></svg>`,
  
  // Bilibili (带天线与完整双眼电视机)
  bilibili: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" class="link-brand-svg"><path d="M18.223 3.086a1.25 1.25 0 0 1 0 1.768L17.08 5.996h1.17A3.75 3.75 0 0 1 22 9.747v7.5a3.75 3.75 0 0 1-3.75 3.75H5.75A3.75 3.75 0 0 1 2 17.247v-7.5a3.75 3.75 0 0 1 3.75-3.75h1.166L5.775 4.855a1.25 1.25 0 0 1 1.767-1.768l2.652 2.652q.119.119.198.257h3.213q.08-.14.199-.258l2.651-2.652a1.25 1.25 0 0 1 1.768 0m.027 5.42H5.75a1.25 1.25 0 0 0-1.247 1.157l-.003.094v7.5c0 .659.51 1.198 1.157 1.246l.093.004h12.5a1.25 1.25 0 0 0 1.247-1.157l.003-.093v-7.5c0-.69-.56-1.25-1.25-1.25m-10 2.5c.69 0 1.25.56 1.25 1.25v1.25a1.25 1.25 0 1 1-2.5 0v-1.25c0-.69.56-1.25 1.25-1.25m7.5 0c.69 0 1.25.56 1.25 1.25v1.25a1.25 1.25 0 1 1-2.5 0v-1.25c0-.69.56-1.25 1.25-1.25"/></svg>`,
  
  // QQ 官网 / 经典企鹅 (眼睛、嘴喙、围巾与白肚)
  qq: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16" fill="currentColor" class="link-brand-svg"><path d="M6.048 3.323c.022.277-.13.523-.338.55c-.21.026-.397-.176-.419-.453s.13-.523.338-.55c.21-.026.397.176.42.453Zm2.265-.24c-.603-.146-.894.256-.936.333c-.027.048-.008.117.037.15c.045.035.092.025.119-.003c.361-.39.751-.172.829-.129l.011.007c.053.024.147.028.193-.098c.023-.063.017-.11-.006-.142c-.016-.023-.089-.08-.247-.118"/><path d="M11.727 6.719c0-.022.01-.375.01-.557c0-3.07-1.45-6.156-5.015-6.156S1.708 3.092 1.708 6.162c0 .182.01.535.01.557l-.72 1.795a26 26 0 0 0-.534 1.508c-.68 2.187-.46 3.093-.292 3.113c.36.044 1.401-1.647 1.401-1.647c0 .979.504 2.256 1.594 3.179c-.408.126-.907.319-1.228.556c-.29.213-.253.43-.201.518c.228.386 3.92.246 4.985.126c1.065.12 4.756.26 4.984-.126c.052-.088.088-.305-.2-.518c-.322-.237-.822-.43-1.23-.557c1.09-.922 1.594-2.2 1.594-3.178c0 0 1.041 1.69 1.401 1.647c.168-.02.388-.926-.292-3.113a26 26 0 0 0-.534-1.508l-.72-1.795ZM9.773 5.53a.1.1 0 0 1-.009.096c-.109.159-1.554.943-3.033.943h-.017c-1.48 0-2.925-.784-3.034-.943a.1.1 0 0 1-.018-.055q0-.022.01-.04c.13-.287 1.43-.606 3.042-.606h.017c1.611 0 2.912.319 3.042.605m-4.32-.989c-.483.022-.896-.529-.922-1.229s.344-1.286.828-1.308c.483-.022.896.529.922 1.23c.027.7-.344 1.286-.827 1.307Zm2.538 0c-.484-.022-.854-.607-.828-1.308c.027-.7.44-1.25.923-1.23c.483.023.853.608.827 1.309c-.026.7-.439 1.251-.922 1.23ZM2.928 8.99q.32.063.639.117v2.336s1.104.222 2.21.068V9.363q.49.027.937.023h.017c1.117.013 2.474-.136 3.786-.396c.097.622.151 1.386.097 2.284c-.146 2.45-1.6 3.99-3.846 4.012h-.091c-2.245-.023-3.7-1.562-3.846-4.011c-.054-.9 0-1.663.097-2.285"/></svg>`,
  
  // 微信公众号 / 微信 (双对话气泡与透亮双眼)
  wechat: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" class="link-brand-svg"><path d="M18.575 13.711a.91.91 0 0 0 .898-.898a.895.895 0 0 0-.898-.898a.894.894 0 0 0-.898.898c0 .5.4.898.898.898m-4.425 0a.91.91 0 0 0 .898-.898c0-.498-.4-.898-.898-.898a.894.894 0 0 0-.898.898c0 .5.399.898.898.898m6.567 5.04a.35.35 0 0 0-.172.37c0 .048 0 .098.025.147c.098.417.294 1.081.294 1.106c0 .073.025.122.025.172a.22.22 0 0 1-.221.22c-.05 0-.074-.024-.123-.048l-1.449-.836a.8.8 0 0 0-.344-.098c-.073 0-.147 0-.196.024c-.688.197-1.4.295-2.161.295c-3.66 0-6.607-2.457-6.607-5.505s2.947-5.505 6.607-5.505c3.659 0 6.606 2.458 6.606 5.505c0 1.647-.884 3.146-2.284 4.154M16.674 8.099a9 9 0 0 0-.28-.005c-4.174 0-7.606 2.86-7.606 6.505c0 .554.08 1.09.228 1.6h-.089a10 10 0 0 1-2.584-.368c-.074-.025-.148-.025-.222-.025a.83.83 0 0 0-.419.123l-1.747 1.005a.35.35 0 0 1-.148.05a.273.273 0 0 1-.27-.27c0-.074.024-.123.049-.197c.024-.024.246-.834.369-1.324c0-.05.024-.123.024-.172a.56.56 0 0 0-.221-.441C2.059 13.376 1 11.586 1 9.599C1.001 5.944 4.571 3 8.951 3c3.765 0 6.93 2.169 7.723 5.098m-5.154.418c.573 0 1.026-.477 1.026-1.026c0-.573-.453-1.026-1.026-1.026s-1.026.453-1.026 1.026s.453 1.026 1.026 1.026m-5.26 0c.573 0 1.027-.477 1.027-1.026c0-.573-.454-1.026-1.027-1.026c-.572 0-1.026.453-1.026 1.026s.454 1.026 1.026 1.026"/></svg>`,
  
  // Google
  google: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" class="link-brand-svg"><path d="M12.48 10.92v3.28h7.84c-.24 1.84-.853 3.187-1.787 4.133-1.147 1.147-2.933 2.4-6.053 2.4-4.827 0-8.6-3.893-8.6-8.72s3.773-8.72 8.6-8.72c2.6 0 4.507 1.027 5.907 2.347l2.307-2.307C18.747 1.44 16.133 0 12.48 0 5.867 0 .307 5.387.307 12s5.56 12 12.173 12c3.573 0 6.267-1.173 8.373-3.36 2.16-2.16 2.84-5.213 2.84-7.667 0-.76-.053-1.467-.173-2.053H12.48z"/></svg>`,
  
  // Twitter / X
  x: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" class="link-brand-svg"><path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/></svg>`,
  
  // YouTube
  youtube: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" class="link-brand-svg"><path d="M23.498 6.186a3.016 3.016 0 00-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 00.502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 002.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 002.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/></svg>`,
  
  // 知乎 (清晰完整宋体“知”字排印)
  zhihu: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1024 1024" fill="currentColor" class="link-brand-svg"><path d="M564.7 230.1V803h60l25.2 71.4L756.3 803h131.5V230.1zm247.7 497h-59.9l-75.1 50.4l-17.8-50.4h-18V308.3h170.7v418.8zM526.1 486.9H393.3c2.1-44.9 4.3-104.3 6.6-172.9h130.9l-.1-8.1c0-.6-.2-14.7-2.3-29.1c-2.1-15-6.6-34.9-21-34.9H287.8c4.4-20.6 15.7-69.7 29.4-93.8l6.4-11.2l-12.9-.7c-.8 0-19.6-.9-41.4 10.6c-35.7 19-51.7 56.4-58.7 84.4c-18.4 73.1-44.6 123.9-55.7 145.6c-3.3 6.4-5.3 10.2-6.2 12.8c-1.8 4.9-.8 9.8 2.8 13c10.5 9.5 38.2-2.9 38.5-3c.6-.3 1.3-.6 2.2-1c13.9-6.3 55.1-25 69.8-84.5h56.7c.7 32.2 3.1 138.4 2.9 172.9h-141l-2.1 1.5c-23.1 16.9-30.5 63.2-30.8 65.2l-1.4 9.2h167c-12.3 78.3-26.5 113.4-34 127.4c-3.7 7-7.3 14-10.7 20.8c-21.3 42.2-43.4 85.8-126.3 153.6c-3.6 2.8-7 8-4.8 13.7c2.4 6.3 9.3 9.1 24.6 9.1c5.4 0 11.8-.3 19.4-1c49.9-4.4 100.8-18 135.1-87.6c17-35.1 31.7-71.7 43.9-108.9L497 850l5-12c.8-1.9 19-46.3 5.1-95.9l-.5-1.8l-108.1-123l-22 16.6c6.4-26.1 10.6-49.9 12.5-71.1h158.7v-8c0-40.1-18.5-63.9-19.2-64.9z"/></svg>`,
  
  // 维基百科 / Wikipedia
  wikipedia: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" class="link-brand-svg"><path d="M12.09 13.124l-2.03-5.278H7.938v-.64h4.152v.64h-1.01l1.52 3.948 1.815-4.588H13.4v-.64h3.765v.64h-.88l-2.85 7.234h-.54l-2.805-7.234h-.59l3.05 7.876h.54zm-9.066-5.278H1.93v-.64h3.818v.64H4.72l2.483 6.44 2.128-5.526-.745-1.554H7.66v-.64h3.587v.64h-.977l3.673 9.537h-.54l-2.73-7.08-2.22 5.765h-.54L5.343 9.475l-.946 2.453h-.012l-1.361 3.535h-.54L.41 7.846H.034v-.64h3.96v.64H2.99l1.455 3.78 1.543-4.004-.964-.022zM21.577 7.206h2.389v.64h-.88l-2.613 6.634h-.54l-1.97-5.122-1.077 2.794h-.54l1.83-4.746h-.88v-.64h3.38v.64h-.91l1.801 4.673 1.53-3.873h-.59v-.64z"/></svg>`,
  
  // Telegram
  telegram: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" class="link-brand-svg"><path d="M11.944 0A12 12 0 0 0 0 12a12 12 0 0 0 12 12 12 12 0 0 0 12-12A12 12 0 0 0 12 0a12 12 0 0 0-.056 0zm4.962 7.224c.1-.002.321.023.465.14a.506.506 0 0 1 .171.325c.016.093.036.306.02.472-.18 1.898-.962 6.502-1.36 8.627-.168.9-.499 1.201-.82 1.23-.696.065-1.225-.46-1.9-.902-1.056-.693-1.653-1.124-2.678-1.8-1.185-.78-.417-1.21.258-1.91.177-.184 3.247-2.977 3.307-3.23.007-.032.014-.15-.056-.212s-.174-.041-.249-.024c-.106.024-1.793 1.14-5.061 3.345-.48.33-.913.49-1.302.48-.428-.008-1.252-.241-1.865-.44-.752-.245-1.349-.374-1.297-.789.027-.216.325-.437.893-.663 3.498-1.524 5.83-2.529 6.998-3.014 3.332-1.386 4.025-1.627 4.476-1.635z"/></svg>`,
  
  // Astro 官方 (完整火箭尾焰徽标)
  astro: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" class="link-brand-svg"><path d="M8.358 20.162c-1.186-1.07-1.532-3.316-1.038-4.944.856 1.026 2.043 1.352 3.272 1.535 1.897.283 3.76.177 5.522-.678.202-.098.388-.229.608-.36.166.473.209.95.151 1.437-.14 1.185-.738 2.1-1.688 2.794-.38.277-.782.525-1.175.787-1.205.804-1.531 1.747-1.078 3.119l.044.148a3.158 3.158 0 0 1-1.407-1.188 3.31 3.31 0 0 1-.544-1.815c-.004-.32-.004-.642-.048-.958-.106-.769-.472-1.113-1.161-1.133-.707-.02-1.267.411-1.415 1.09-.012.053-.028.104-.045.165h.002zm-5.961-4.445s3.24-1.575 6.49-1.575l2.451-7.565c.092-.366.36-.614.662-.614.302 0 .57.248.662.614l2.45 7.565c3.85 0 6.491 1.575 6.491 1.575L16.088.727C15.93.285 15.663 0 15.303 0H8.697c-.36 0-.615.285-.784.727l-5.516 14.99z"/></svg>`,

  // npm
  npm: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" class="link-brand-svg"><path d="M1.763 0C.786 0 0 .786 0 1.763v20.474C0 23.214.786 24 1.763 24h20.474c.977 0 1.763-.786 1.763-1.763V1.763C24 .786 23.214 0 22.237 0zM5.13 5.323l13.837.019-.009 13.836h-3.464l.01-10.382h-3.456L12.04 19.17H5.113z"/></svg>`,

  // 纸鹿 / Clarity 上游 (居中无裁切坐标印)
  zhilu: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round" class="link-brand-svg"><path d="M12 3a7 7 0 0 0-7 7c0 4.8 7 11 7 11s7-6.2 7-11a7 7 0 0 0-7-7z"/><circle cx="12" cy="10" r="2.5"/></svg>`,

  // 通用外链报章指示印标 (Default External Letterpress Mark)
  external: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.6" stroke-linecap="round" stroke-linejoin="round" class="link-brand-svg link-external-svg"><line x1="7" y1="17" x2="17" y2="7"></line><polyline points="7 7 17 7 17 17"></polyline></svg>`,

  // 站内链接指示印标 (Internal)
  internal: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round" class="link-brand-svg link-internal-svg"><path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71"></path><path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71"></path></svg>`
};

/**
 * 域名到品牌图标的智能映射规则表
 * 包含：专门子域名（高优先级）与主域名（次高优先级）
 */
interface DomainRule {
  pattern: RegExp | string;
  icon: string;
}

// 专门子域名规则（优先级高）
const SPECIAL_DOMAIN_RULES: DomainRule[] = [
  { pattern: 'learn.microsoft.com', icon: 'microsoft' },
  { pattern: 'docs.microsoft.com', icon: 'microsoft' },
  { pattern: 'mp.weixin.qq.com', icon: 'wechat' },
  { pattern: 'weixin.qq.com', icon: 'wechat' },
  { pattern: 'im.qq.com', icon: 'qq' },
  { pattern: 't.me', icon: 'telegram' },
  { pattern: 'youtu.be', icon: 'youtube' },
  { pattern: 'x.com', icon: 'x' },
  { pattern: 'blog.zhilu.site', icon: 'zhilu' },
  { pattern: 'zhilu.site', icon: 'zhilu' },
];

// 主域名匹配规则（泛域名）
const ROOT_DOMAIN_RULES: DomainRule[] = [
  { pattern: /microsoft\.com$/, icon: 'microsoft' },
  { pattern: /github\.com$/, icon: 'github' },
  { pattern: /bilibili\.com$/, icon: 'bilibili' },
  { pattern: /b23\.tv$/, icon: 'bilibili' },
  { pattern: /qq\.com$/, icon: 'qq' },
  { pattern: /wechat\.com$/, icon: 'wechat' },
  { pattern: /google\.(com|cn|com\.[a-z]{2})$/, icon: 'google' },
  { pattern: /twitter\.com$/, icon: 'x' },
  { pattern: /x\.com$/, icon: 'x' },
  { pattern: /youtube\.com$/, icon: 'youtube' },
  { pattern: /zhihu\.com$/, icon: 'zhihu' },
  { pattern: /wikipedia\.org$/, icon: 'wikipedia' },
  { pattern: /telegram\.org$/, icon: 'telegram' },
  { pattern: /astro\.build$/, icon: 'astro' },
  { pattern: /npmjs\.com$/, icon: 'npm' },
];

/**
 * 提取 URL 的纯净展示域名
 */
export function getDomain(rawUrl: string): string {
  if (!rawUrl) return '';
  try {
    const url = new URL(rawUrl, 'https://gazette.example.com');
    return url.hostname.toLowerCase();
  } catch {
    const match = rawUrl.match(/^(?:https?:\/\/)?([^/?#:]+)/i);
    return match ? match[1].toLowerCase() : '';
  }
}

/**
 * 判断是否属于站外链接
 */
export function isExternalUrl(url: string, currentHost: string = ''): boolean {
  if (!url) return false;
  // 相对路径、锚点或协议相对判断
  if (url.startsWith('/') || url.startsWith('#') || url.startsWith('./') || url.startsWith('../')) {
    return false;
  }
  if (!url.startsWith('http://') && !url.startsWith('https://')) {
    return false;
  }
  try {
    const parsed = new URL(url);
    if (!currentHost) return true;
    return parsed.hostname !== currentHost;
  } catch {
    return false;
  }
}

/**
 * 根据 URL 与可选自定义图标名获取对应的图标 SVG 与元数据
 */
export function getLinkMeta(url: string, customIcon?: string): LinkMeta {
  const isExt = isExternalUrl(url);
  const domain = getDomain(url);

  // 1. 如果显式指定了自定义图标
  if (customIcon) {
    const cleanName = customIcon.toLowerCase().trim();
    if (BRAND_ICONS[cleanName]) {
      return {
        url,
        domain,
        isExternal: isExt,
        iconName: cleanName,
        iconSvg: BRAND_ICONS[cleanName],
      };
    }
  }

  // 2. 如果是站内链接
  if (!isExt) {
    return {
      url,
      domain: '',
      isExternal: false,
      iconName: 'internal',
      iconSvg: BRAND_ICONS.internal,
    };
  }

  // 3. 优先匹配专门域名规则
  for (const rule of SPECIAL_DOMAIN_RULES) {
    if (typeof rule.pattern === 'string' && domain === rule.pattern) {
      return {
        url,
        domain,
        isExternal: true,
        iconName: rule.icon,
        iconSvg: BRAND_ICONS[rule.icon] || BRAND_ICONS.external,
      };
    }
  }

  // 4. 次匹配主域名规则
  for (const rule of ROOT_DOMAIN_RULES) {
    if (rule.pattern instanceof RegExp && rule.pattern.test(domain)) {
      return {
        url,
        domain,
        isExternal: true,
        iconName: rule.icon,
        iconSvg: BRAND_ICONS[rule.icon] || BRAND_ICONS.external,
      };
    }
  }

  // 5. 站外兜底：通用外链指示印标
  return {
    url,
    domain,
    isExternal: true,
    iconName: 'external',
    iconSvg: BRAND_ICONS.external,
  };
}
