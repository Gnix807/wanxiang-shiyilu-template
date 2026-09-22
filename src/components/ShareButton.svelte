<script lang="ts">
  import { onMount } from 'svelte';
  import QRCode from 'qrcode';
  import { siteConfig } from '../config/site';

  export let title: string = '';
  export let description: string = '';
  export let url: string = '';
  export let image: string = '';
  export let date: string = '';
  export let readTime: number | null = null;
  export let tags: string[] = [];

  let expanded = false;
  let pageViews = 0;
  let copied = false;
  let generatingPoster = false;
  let posterDataUrl: string | null = null;
  let posterError = '';
  let showPoster = false;
  let showWechatQR = false;
  let wechatQrDataUrl = '';
  let toastMessage = '';
  let toastTimer: any = null;

  const shareUrl = url || (typeof window !== 'undefined' ? window.location.href : '');
  const siteDomain = siteConfig.url.replace(/^https?:\/\//, '').replace(/\/.*$/, '');
  const authorInitial = (siteConfig.author || 'N').slice(0, 1).toUpperCase();

  onMount(async () => {
    try {
      if (siteConfig.analytics?.statsApi?.alltime) {
        var p = new URL(shareUrl).pathname;
        if (!p.endsWith('/')) p += '/';
        const res = await fetch(siteConfig.analytics.statsApi.alltime, { signal: AbortSignal.timeout(5000) });
        const data = await res.json();
        if (data && typeof data.views === 'number') {
          pageViews = data.views;
        }
      }
    } catch {}
  });

  function toggle() {
    expanded = !expanded;
    if (expanded) {
      showWechatQR = false;
      document.addEventListener('keydown', onKeyDown);
    } else {
      document.removeEventListener('keydown', onKeyDown);
    }
  }

  function closeShare() {
    expanded = false;
    showWechatQR = false;
    toastMessage = '';
    document.removeEventListener('keydown', onKeyDown);
  }

  function showToast(msg: string) {
    toastMessage = msg;
    clearTimeout(toastTimer);
    toastTimer = setTimeout(() => { toastMessage = ''; }, 2200);
  }

  async function copyLink() {
    try {
      await navigator.clipboard.writeText(shareUrl);
      copied = true;
      showToast('链接已复制到剪贴板！');
      setTimeout(() => copied = false, 2000);
    } catch {
      copied = false;
      showToast('复制失败，请手动复制');
    }
  }

  function shareToQQ() {
    window.open('https://sns.qzone.qq.com/cgi-bin/qzshare/cgi_qzshare_onekey?url=' + encodeURIComponent(shareUrl) + '&title=' + encodeURIComponent(title) + '&desc=' + encodeURIComponent(description) + '&summary=' + encodeURIComponent(description) + '&site=' + encodeURIComponent(siteConfig.author || '博客'), '_blank', 'width=700,height=600');
  }

  function shareToWeibo() {
    const weiboUrl = `https://service.weibo.com/share/share.php?url=${encodeURIComponent(shareUrl)}&title=${encodeURIComponent(title + (description ? ' - ' + description : ''))}${image ? `&pic=${encodeURIComponent(image)}` : ''}`;
    window.open(weiboUrl, '_blank', 'width=650,height=500');
  }

  function shareToX() {
    window.open('https://twitter.com/intent/tweet?text=' + encodeURIComponent(title + (description ? ' - ' + description : '')) + '&url=' + encodeURIComponent(shareUrl), '_blank', 'width=600,height=400');
  }

  async function shareToWeChat() {
    showWechatQR = true;
    if (!wechatQrDataUrl) {
      try {
        wechatQrDataUrl = await QRCode.toDataURL(shareUrl, { width: 240, margin: 1 });
      } catch (err) {
        console.error('QR code generation error:', err);
      }
    }
  }

  function closePoster() {
    showPoster = false; posterDataUrl = null; posterError = '';
    document.body.style.overflow = '';
    document.removeEventListener('keydown', onKeyDown);
  }

  function onKeyDown(e: KeyboardEvent) {
    if (e.key !== 'Escape') return;
    if (showPoster) closePoster();
    else if (showWechatQR) showWechatQR = false;
    else if (expanded) closeShare();
  }

  async function copyPoster() {
    if (!posterDataUrl) return;
    try {
      const blob = await (await fetch(posterDataUrl)).blob();
      await navigator.clipboard.write([new ClipboardItem({ 'image/png': blob })]);
    } catch {
      downloadPoster();
    }
  }

  async function loadImage(src: string): Promise<HTMLImageElement> {
    return new Promise((resolve, reject) => {
      const img = new Image();
      img.crossOrigin = 'anonymous';
      img.onload = () => resolve(img);
      img.onerror = reject;
      img.src = src;
    });
  }

  function wrapText(ctx: CanvasRenderingContext2D, text: string, maxWidth: number): string[] {
    const lines: string[] = [];
    let cur = '';
    for (const c of text) {
      const test = cur + c;
      if (ctx.measureText(test).width > maxWidth && cur) {
        lines.push(cur);
        cur = c;
      } else {
        cur = test;
      }
    }
    if (cur) lines.push(cur);
    return lines.length ? lines : [text];
  }

  async function generatePoster() {
    closeShare();
    generatingPoster = true;
    posterError = '';
    posterDataUrl = null;
    try {
      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d')!;
      const W = 1080;
      const H = 1080; // 1:1 方形
      const dpr = Math.max(1, Math.min(3, window.devicePixelRatio || 1));
      canvas.width = Math.round(W * dpr);
      canvas.height = Math.round(H * dpr);
      canvas.style.width = W + 'px';
      canvas.style.height = H + 'px';
      ctx.scale(dpr, dpr);

      // ===== 配色：成熟出版物风格（墨黑 + 暖纸 + 朱砂红）=====
      const bg = '#fbfbf9';
      const brand = '#1a1a1a';
      const brandSoft = '#f4efe6';
      const accent = '#9e2a2b';
      const ink = '#1a1a1a';
      const muted = '#736f68';
      const FONT = '"Noto Serif SC", "Noto Sans SC", "Songti SC", system-ui, serif';
      const pad = 60;
      const contentW = W - pad * 2;

      const roundedRect = (x: number, y: number, w: number, h: number, r: number) => {
        ctx.beginPath();
        ctx.moveTo(x + r, y);
        ctx.arcTo(x + w, y, x + w, y + h, r);
        ctx.arcTo(x + w, y + h, x, y + h, r);
        ctx.arcTo(x, y + h, x, y, r);
        ctx.arcTo(x, y, x + w, y, r);
        ctx.closePath();
      };
      const fillRound = (x: number, y: number, w: number, h: number, r: number, color: string) => {
        roundedRect(x, y, w, h, r);
        ctx.fillStyle = color;
        ctx.fill();
      };
      const ellipsize = (lines: string[], max: number): string[] => {
        if (lines.length <= max) return lines;
        const out = lines.slice(0, max);
        let last = out[max - 1];
        while (last.length && ctx.measureText(last + '…').width > contentW) last = last.slice(0, -1);
        out[max - 1] = last + '…';
        return out;
      };

      // ===== 背景 + 积木点阵 =====
      ctx.fillStyle = bg;
      ctx.fillRect(0, 0, W, H);
      ctx.fillStyle = 'rgba(2, 132, 199, 0.07)';
      for (let gx = 12; gx < W; gx += 24) {
        for (let gy = 12; gy < H; gy += 24) {
          ctx.fillRect(gx, gy, 2.2, 2.2);
        }
      }

      // ===== 顶部双色条 =====
      ctx.fillStyle = brand;
      ctx.fillRect(0, 0, W, 14);
      ctx.fillStyle = accent;
      ctx.fillRect(0, 14, W, 5);

      // ===== 头部 masthead =====
      const logoS = 46;
      const logoX = pad, logoY = 48;
      ctx.save();
      ctx.translate(logoX + logoS / 2, logoY + logoS / 2);
      ctx.rotate(-0.1);
      ctx.fillStyle = accent;
      ctx.strokeStyle = brand;
      ctx.lineWidth = 3;
      roundedRect(-logoS / 2, -logoS / 2, logoS, logoS, 9);
      ctx.fill();
      ctx.stroke();
      ctx.fillStyle = brand;
      ctx.font = `900 26px ${FONT}`;
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillText(authorInitial, 0, 1);
      ctx.restore();
      ctx.textAlign = 'left';
      ctx.textBaseline = 'alphabetic';

      ctx.fillStyle = ink;
      ctx.font = `900 27px ${FONT}`;
      ctx.fillText(siteConfig.author || '示例作者', logoX + logoS + 18, logoY + 24);
      ctx.fillStyle = muted;
      ctx.font = `500 15px ${FONT}`;
      ctx.fillText(siteDomain, logoX + logoS + 18, logoY + 46);

      // 右侧「文章分享」标签
      const pillText = '文章分享';
      ctx.font = `800 19px ${FONT}`;
      const pillW = ctx.measureText(pillText).width + 40;
      const pillH = 44;
      const pillX = W - pad - pillW;
      const pillY = 48;
      ctx.save();
      ctx.shadowColor = accent;
      ctx.shadowOffsetX = 5;
      ctx.shadowOffsetY = 5;
      ctx.shadowBlur = 0;
      fillRound(pillX, pillY, pillW, pillH, 9, '#ffffff');
      ctx.restore();
      ctx.strokeStyle = brand;
      ctx.lineWidth = 3;
      roundedRect(pillX, pillY, pillW, pillH, 9);
      ctx.stroke();
      ctx.fillStyle = brand;
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillText(pillText, pillX + pillW / 2, pillY + pillH / 2 + 1);
      ctx.textAlign = 'left';
      ctx.textBaseline = 'alphabetic';

      // ===== 封面（厚边框 + 硬阴影）=====
      const covX = pad, covY = 122, covW = contentW, covH = 336;
      const drawCoverPlaceholder = () => {
        ctx.fillStyle = brandSoft;
        roundedRect(covX, covY, covW, covH, 20);
        ctx.fill();
        ctx.fillStyle = brand;
        ctx.font = `900 110px ${FONT}`;
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.fillText('U', W / 2, covY + covH / 2 - 12);
        const bs = 22, gap = 14;
        const total = bs * 3 + gap * 2;
        const dotY = covY + covH / 2 + 58;
        ctx.textAlign = 'left';
        ctx.textBaseline = 'alphabetic';
        ctx.fillStyle = accent; ctx.fillRect(W / 2 - total / 2, dotY, bs, bs);
        ctx.fillStyle = brand; ctx.fillRect(W / 2 - total / 2 + bs + gap, dotY, bs, bs);
        ctx.fillStyle = '#7dd3fc'; ctx.fillRect(W / 2 - total / 2 + (bs + gap) * 2, dotY, bs, bs);
      };

      ctx.save();
      ctx.shadowColor = brand;
      ctx.shadowOffsetX = 10;
      ctx.shadowOffsetY = 10;
      ctx.shadowBlur = 0;
      fillRound(covX, covY, covW, covH, 20, '#ffffff');
      ctx.restore();
      if (image) {
        try {
          const img = await loadImage(image);
          const scale = Math.max(covW / img.width, covH / img.height);
          const sw = covW / scale;
          const sh = covH / scale;
          const sx = (img.width - sw) / 2;
          const sy = (img.height - sh) / 2;
          ctx.save();
          roundedRect(covX, covY, covW, covH, 20);
          ctx.clip();
          ctx.drawImage(img, sx, sy, sw, sh, covX, covY, covW, covH);
          ctx.restore();
        } catch {
          drawCoverPlaceholder();
        }
      } else {
        drawCoverPlaceholder();
      }
      ctx.strokeStyle = brand;
      ctx.lineWidth = 5;
      roundedRect(covX, covY, covW, covH, 20);
      ctx.stroke();

      // ===== 标题 =====
      let ty = covY + covH + 66;
      ctx.fillStyle = ink;
      ctx.font = `900 44px ${FONT}`;
      const titleLines = ellipsize(wrapText(ctx, title || '无标题', contentW), 2);
      titleLines.forEach((line, i) => ctx.fillText(line, pad, ty + i * 58));
      ty += titleLines.length * 58;

      // ===== 摘要 =====
      if (description) {
        ty += 28;
        ctx.fillStyle = muted;
        ctx.font = `400 22px ${FONT}`;
        const descLines = ellipsize(wrapText(ctx, description, contentW), 2);
        descLines.forEach((line, i) => ctx.fillText(line, pad, ty + i * 34));
        ty += descLines.length * 34;
      }

      // ===== 元信息 =====
      ty += 42;
      const metaY = ty;
      ctx.fillStyle = accent;
      ctx.strokeStyle = brand;
      ctx.lineWidth = 2.5;
      roundedRect(pad, metaY - 14, 14, 14, 3);
      ctx.fill();
      ctx.stroke();
      ctx.fillStyle = brand;
      ctx.font = `700 19px ${FONT}`;
      const date10 = (date || '').slice(0, 10);
      const metaParts: string[] = [];
      if (date10) metaParts.push(date10);
      if (readTime) metaParts.push(`阅读约 ${readTime} 分钟`);
      if (pageViews > 0) metaParts.push(`${pageViews} 次阅读`);
      ctx.fillText(metaParts.join('  ·  '), pad + 26, metaY);

      // ===== 标签（积木药丸）=====
      ty += 46;
      ctx.font = `700 20px ${FONT}`;
      let tx = pad;
      const tagH = 46;
      for (const t of (tags || []).slice(0, 3)) {
        const label = '# ' + t;
        const w = ctx.measureText(label).width + 40;
        if (tx + w > W - pad) break;
        ctx.save();
        ctx.shadowColor = '#bae6fd';
        ctx.shadowOffsetX = 4;
        ctx.shadowOffsetY = 4;
        ctx.shadowBlur = 0;
        fillRound(tx, ty, w, tagH, 10, '#ffffff');
        ctx.restore();
        ctx.strokeStyle = brand;
        ctx.lineWidth = 2.5;
        roundedRect(tx, ty, w, tagH, 10);
        ctx.stroke();
        ctx.fillStyle = '#475569';
        ctx.textBaseline = 'middle';
        ctx.fillText(label, tx + 20, ty + tagH / 2 + 1);
        ctx.textBaseline = 'alphabetic';
        tx += w + 14;
      }

      // ===== 底部作者卡 =====
      const footH = 150;
      const footY = H - pad - footH;
      ctx.save();
      ctx.shadowColor = brand;
      ctx.shadowOffsetX = 8;
      ctx.shadowOffsetY = 8;
      ctx.shadowBlur = 0;
      fillRound(pad, footY, contentW, footH, 18, '#ffffff');
      ctx.restore();
      ctx.strokeStyle = brand;
      ctx.lineWidth = 4;
      roundedRect(pad, footY, contentW, footH, 18);
      ctx.stroke();

      const av = 92;
      const avX = pad + 26;
      const avY = footY + (footH - av) / 2;
      ctx.save();
      roundedRect(avX, avY, av, av, 18);
      ctx.clip();
      try {
        const avImg = await loadImage(siteConfig.avatar || '/images/me.jpg');
        ctx.drawImage(avImg, avX, avY, av, av);
      } catch {
        ctx.fillStyle = brand;
        ctx.fillRect(avX, avY, av, av);
        ctx.fillStyle = '#ffffff';
        ctx.font = `900 44px ${FONT}`;
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.fillText(authorInitial, avX + av / 2, avY + av / 2);
        ctx.textAlign = 'left';
        ctx.textBaseline = 'alphabetic';
      }
      ctx.restore();
      ctx.strokeStyle = brand;
      ctx.lineWidth = 3.5;
      roundedRect(avX, avY, av, av, 18);
      ctx.stroke();

      ctx.fillStyle = ink;
      ctx.font = `900 25px ${FONT}`;
      ctx.fillText(siteConfig.author || '示例作者', avX + av + 22, footY + 58);
      ctx.fillStyle = muted;
      ctx.font = `500 16px ${FONT}`;
      ctx.fillText(`${siteConfig.signature || ''} · ${siteDomain}`, avX + av + 22, footY + 88);

      // 二维码
      const qr = 108;
      const qrX = pad + contentW - qr - 22;
      const qrY = footY + (footH - qr) / 2;
      fillRound(qrX - 7, qrY - 7, qr + 14, qr + 14, 10, '#ffffff');
      ctx.strokeStyle = brand;
      ctx.lineWidth = 2.5;
      roundedRect(qrX - 7, qrY - 7, qr + 14, qr + 14, 10);
      ctx.stroke();
      try {
        const qrDataUrl = await QRCode.toDataURL(shareUrl, { width: 220, margin: 0 });
        const qrImg = await loadImage(qrDataUrl);
        ctx.drawImage(qrImg, qrX, qrY, qr, qr);
      } catch {
        ctx.fillStyle = muted;
        ctx.font = `600 13px ${FONT}`;
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.fillText('二维码', qrX + qr / 2, qrY + qr / 2);
        ctx.textAlign = 'left';
        ctx.textBaseline = 'alphabetic';
      }
      ctx.fillStyle = muted;
      ctx.font = `500 15px ${FONT}`;
      ctx.textAlign = 'right';
      ctx.fillText('扫描二维码', qrX - 20, footY + footH / 2 - 9);
      ctx.fillText('阅读全文', qrX - 20, footY + footH / 2 + 15);
      ctx.textAlign = 'left';

      posterDataUrl = canvas.toDataURL('image/png');
      showPoster = true;
      document.body.style.overflow = 'hidden';
      document.addEventListener('keydown', onKeyDown);
    } catch {
      posterError = '生成失败';
    } finally {
      generatingPoster = false;
    }
  }

  function downloadPoster() {
    if (posterDataUrl) {
      const a = document.createElement('a');
      a.href = posterDataUrl;
      a.download = 'poster-' + Date.now() + '.png';
      a.click();
    }
  }

  /**
   * Portal：把弹窗移动到 <body> 顶层。
   * 文章卡片有 transform 动画，会让 position:fixed 退化为相对定位，
   * 导致弹窗被困在卡片里、无法覆盖全屏。挂到 body 后彻底脱离任何容器。
   */
  function portal(node: HTMLElement) {
    document.body.appendChild(node);
    return { destroy() { node.remove(); } };
  }
</script>

<button
  on:click={toggle}
  class="inline-flex items-center gap-2 h-11 px-4 rounded-sm border-[3px] border-[#1a1a1a] dark:border-[#e8e6e3] bg-[#f4efe6] dark:bg-[#242220] text-[#1a1a1a] dark:text-[#e8e6e3] font-black text-sm cursor-pointer shadow-[3px_3px_0px_0px_#1a1a1a] dark:shadow-[3px_3px_0px_0px_#e8e6e3] hover:-translate-y-0.5 hover:shadow-[4px_4px_0px_0px_#1a1a1a] dark:hover:shadow-[4px_4px_0px_0px_#e8e6e3] active:translate-y-0 active:shadow-none transition-all duration-150 shrink-0"
  aria-label="分享文章"
>
  <svg xmlns="http://www.w3.org/2000/svg" class="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2.5">
    <path stroke-linecap="round" stroke-linejoin="round" d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z" />
  </svg>
  <span>分享</span>
</button>

{#if expanded}
  <div use:portal class="fixed inset-0 z-[2147483000] flex items-end sm:items-center justify-center p-0 sm:p-6" role="presentation" on:click={closeShare}>
    <div class="absolute inset-0 bg-black/40 backdrop-blur-sm"></div>
    <section
      class="relative w-full sm:max-w-lg max-h-[88vh] overflow-y-auto rounded-t-[20px] sm:rounded-[12px] bg-[#fbfbf9] dark:bg-[#1c1b1a] border-2 border-[#1a1a1a] dark:border-[#e8e6e3] shadow-[8px_8px_0px_0px_#1a1a1a] dark:shadow-[8px_8px_0px_0px_#e8e6e3]"
      role="dialog" aria-modal="true" aria-labelledby="share-dialog-title" on:click|stopPropagation
    >
      <div class="sticky top-0 z-10 flex items-center justify-between gap-4 px-5 py-4 border-b-2 border-[#1a1a1a] dark:border-[#e8e6e3] bg-[#f4efe6] dark:bg-[#242220]">
        <div>
          <h2 id="share-dialog-title" class="text-lg font-black text-[#1a1a1a] dark:text-[#e8e6e3]">分享这篇文章</h2>
          <p class="mt-1 text-xs text-slate-500 dark:text-slate-400">选择方式，把内容分享给朋友</p>
        </div>
        <button type="button" on:click={closeShare} aria-label="关闭分享窗口" class="w-9 h-9 shrink-0 rounded-full border border-[#1a1a1a] dark:border-[#e8e6e3] bg-white dark:bg-[#1c1b1a] text-[#1a1a1a] dark:text-[#e8e6e3] hover:bg-[#9e2a2b] hover:text-white transition-colors flex items-center justify-center cursor-pointer">
          <svg xmlns="http://www.w3.org/2000/svg" class="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2"><path stroke-linecap="round" stroke-linejoin="round" d="M6 18L18 6M6 6l12 12" /></svg>
        </button>
      </div>

      <div class="p-5 sm:p-6">
        <div class="flex items-start gap-3 p-4 rounded-sm bg-white dark:bg-[#242220] border-2 border-[#1a1a1a]/15 dark:border-[#e8e6e3]/20">
          {#if image}
            <img
              src={image}
              alt=""
              class="w-14 h-14 rounded-sm object-cover shrink-0 border border-[#1a1a1a]/20 dark:border-[#e8e6e3]/20"
              on:error={(e) => { e.currentTarget.style.display = 'none'; }}
            />
          {/if}
          <div class="min-w-0">
            <h3 class="font-bold text-[#1a1a1a] dark:text-[#e8e6e3] line-clamp-2">{title || '无标题'}</h3>
            <p class="mt-1 text-xs text-slate-500 dark:text-slate-400 line-clamp-2">{description || `来自 ${siteConfig.author} 的文章分享`}</p>
          </div>
        </div>

        {#if showWechatQR}
          <div class="flex flex-col items-center text-center p-4 bg-white dark:bg-[#242220] rounded-sm border-2 border-[#1a1a1a]/15 dark:border-[#e8e6e3]/20 mt-4 animate-fade-in">
            <div class="p-2.5 bg-white rounded border-2 border-[#1a1a1a] dark:border-[#e8e6e3] shadow-[3px_3px_0px_0px_#1a1a1a] dark:shadow-[3px_3px_0px_0px_#e8e6e3]">
              {#if wechatQrDataUrl}
                <img
                  src={wechatQrDataUrl}
                  alt="微信分享二维码"
                  class="w-44 h-44 block"
                />
              {:else}
                <div class="w-44 h-44 flex items-center justify-center font-mono text-xs font-bold text-neutral-400">
                  生成二维码中…
                </div>
              {/if}
            </div>
            <p class="mt-3.5 font-bold text-xs sm:text-sm text-[#1a1a1a] dark:text-[#e8e6e3] flex items-center justify-center gap-1.5">
              <svg class="w-4 h-4 text-[#07c160] shrink-0" viewBox="0 0 24 24" fill="currentColor">
                <path d="M8.691 2.188C3.891 2.188 0 5.476 0 9.53c0 2.212 1.17 4.203 3.002 5.55a.59.59 0 0 1 .213.665l-.39 1.48c-.019.07-.048.141-.048.213 0 .163.13.295.29.295a.326.326 0 0 0 .167-.054l1.903-1.114a.864.864 0 0 1 .717-.098 10.16 10.16 0 0 0 2.837.403c.276 0 .543-.027.811-.05-.857-2.578.157-4.972 1.932-6.446 1.703-1.415 3.882-1.98 5.853-1.838-.576-3.583-4.196-6.348-8.596-6.348zM5.785 5.991c.642 0 1.162.529 1.162 1.18a1.17 1.17 0 0 1-1.162 1.178A1.17 1.17 0 0 1 4.623 7.17c0-.651.52-1.18 1.162-1.18zm5.813 0c.642 0 1.162.529 1.162 1.18a1.17 1.17 0 0 1-1.162 1.178 1.17 1.17 0 0 1-1.162-1.178c0-.651.52-1.18 1.162-1.18zm5.34 2.867c-1.797-.052-3.746.512-5.28 1.786-1.72 1.428-2.687 3.72-1.78 6.22.942 2.453 3.666 4.229 6.884 4.229.826 0 1.622-.12 2.361-.336a.722.722 0 0 1 .598.082l1.584.926a.272.272 0 0 0 .14.047c.134 0 .24-.111.24-.247 0-.06-.023-.12-.038-.177l-.327-1.233a.582.582 0 0 1-.023-.156.49.49 0 0 1 .201-.398C23.024 18.48 24 16.82 24 14.98c0-3.21-2.931-5.837-6.656-6.088V8.89c-.135-.01-.27-.027-.407-.03zm-2.53 3.274c.535 0 .969.44.969.982a.976.976 0 0 1-.969.983.976.976 0 0 1-.969-.983c0-.542.434-.982.97-.982zm4.844 0c.535 0 .969.44.969.982a.976.976 0 0 1-.969.983.976.976 0 0 1-.969-.983c0-.542.434-.982.969-.982z"/>
              </svg>
              <span>微信扫一扫，分享给好友或朋友圈</span>
            </p>
            <div class="mt-3.5 flex gap-2.5 w-full max-w-xs">
              <button
                type="button"
                on:click={copyLink}
                class="flex-1 py-2 px-3 text-xs font-black rounded-sm border-2 border-[#1a1a1a] dark:border-[#e8e6e3] bg-[#fbfbf9] dark:bg-[#1c1b1a] text-[#1a1a1a] dark:text-[#e8e6e3] shadow-[2px_2px_0px_0px_#1a1a1a] dark:shadow-[2px_2px_0px_0px_#e8e6e3] hover:bg-[#f4efe6] dark:hover:bg-[#2e2a27] active:translate-y-0.5 active:shadow-none transition-all cursor-pointer"
              >
                {#if copied}
                  <span class="inline-flex items-center justify-center gap-1 text-emerald-600 dark:text-emerald-400">
                    <svg class="w-3.5 h-3.5 stroke-[2.5]" viewBox="0 0 24 24" fill="none" stroke="currentColor"><circle cx="12" cy="12" r="10"/><path d="m9 12 2 2 4-4"/></svg>
                    <span>已复制</span>
                  </span>
                {:else}
                  <span>复制文案与链接</span>
                {/if}
              </button>
              <button
                type="button"
                on:click={() => showWechatQR = false}
                class="flex-1 py-2 px-3 text-xs font-black rounded-sm border-2 border-[#1a1a1a] dark:border-[#e8e6e3] bg-[#9e2a2b] text-white shadow-[2px_2px_0px_0px_#1a1a1a] dark:shadow-[2px_2px_0px_0px_#e8e6e3] hover:bg-[#852324] active:translate-y-0.5 active:shadow-none transition-all cursor-pointer"
              >
                ← 返回方式列表
              </button>
            </div>
          </div>
        {:else}
          <div class="grid grid-cols-2 sm:grid-cols-3 gap-3 mt-5">
            <!-- 1. 海报 -->
            <button
              type="button"
              on:click={() => { closeShare(); generatePoster(); }}
              disabled={generatingPoster}
              class="min-h-15 rounded-sm bg-[#9e2a2b] text-white font-black text-xs sm:text-sm border-2 border-[#1a1a1a] dark:border-[#e8e6e3] shadow-[2px_2px_0px_0px_#1a1a1a] dark:shadow-[2px_2px_0px_0px_#e8e6e3] hover:bg-[#852324] hover:-translate-y-0.5 hover:shadow-[3px_3px_0px_0px_#1a1a1a] dark:hover:shadow-[3px_3px_0px_0px_#e8e6e3] active:translate-y-0 active:shadow-none transition-all disabled:opacity-60 flex flex-col items-center justify-center gap-1.5 p-2 cursor-pointer"
            >
              {#if generatingPoster}
                <svg class="w-5 h-5 animate-spin" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><circle cx="12" cy="12" r="10" stroke-opacity="0.25"/><path d="M12 2a10 10 0 0 1 10 10" stroke-linecap="round"/></svg>
                <span>生成中…</span>
              {:else}
                <svg class="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                  <rect width="18" height="18" x="3" y="3" rx="2"/>
                  <circle cx="9" cy="9" r="2"/>
                  <path d="m21 15-3.086-3.086a2 2 0 0 0-2.828 0L6 21"/>
                </svg>
                <span>生成海报</span>
              {/if}
            </button>

            <!-- 2. 复制链接 -->
            <button
              type="button"
              on:click={copyLink}
              class="min-h-15 rounded-sm bg-[#fbfbf9] dark:bg-[#242220] border-2 border-[#1a1a1a] dark:border-[#e8e6e3] shadow-[2px_2px_0px_0px_#1a1a1a] dark:shadow-[2px_2px_0px_0px_#e8e6e3] text-[#1a1a1a] dark:text-[#e8e6e3] font-black text-xs sm:text-sm hover:bg-[#f4efe6] dark:hover:bg-[#2e2a27] hover:-translate-y-0.5 hover:shadow-[3px_3px_0px_0px_#1a1a1a] dark:hover:shadow-[3px_3px_0px_0px_#e8e6e3] active:translate-y-0 active:shadow-none transition-all flex flex-col items-center justify-center gap-1.5 p-2 cursor-pointer"
            >
              {#if copied}
                <svg class="w-5 h-5 text-emerald-600 dark:text-emerald-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
                  <polyline points="20 6 9 17 4 12"/>
                </svg>
                <span class="text-emerald-600 dark:text-emerald-400">已复制链接</span>
              {:else}
                <svg class="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                  <rect width="14" height="14" x="8" y="8" rx="2" ry="2"/>
                  <path d="M4 16c-1.1 0-2-.9-2-2V4c0-1.1.9-2 2-2h10c1.1 0 2 .9 2 2"/>
                </svg>
                <span>复制链接</span>
              {/if}
            </button>

            <!-- 3. 微信 -->
            <button
              type="button"
              on:click={shareToWeChat}
              class="min-h-15 rounded-sm bg-[#fbfbf9] dark:bg-[#242220] border-2 border-[#1a1a1a] dark:border-[#e8e6e3] shadow-[2px_2px_0px_0px_#1a1a1a] dark:shadow-[2px_2px_0px_0px_#e8e6e3] text-[#1a1a1a] dark:text-[#e8e6e3] font-black text-xs sm:text-sm hover:bg-[#f4efe6] dark:hover:bg-[#2e2a27] hover:-translate-y-0.5 hover:shadow-[3px_3px_0px_0px_#1a1a1a] dark:hover:shadow-[3px_3px_0px_0px_#e8e6e3] active:translate-y-0 active:shadow-none transition-all flex flex-col items-center justify-center gap-1.5 p-2 cursor-pointer"
            >
              <svg class="w-5 h-5 text-[#07c160]" viewBox="0 0 24 24" fill="currentColor">
                <path d="M8.691 2.188C3.891 2.188 0 5.476 0 9.53c0 2.212 1.17 4.203 3.002 5.55a.59.59 0 0 1 .213.665l-.39 1.48c-.019.07-.048.141-.048.213 0 .163.13.295.29.295a.326.326 0 0 0 .167-.054l1.903-1.114a.864.864 0 0 1 .717-.098 10.16 10.16 0 0 0 2.837.403c.276 0 .543-.027.811-.05-.857-2.578.157-4.972 1.932-6.446 1.703-1.415 3.882-1.98 5.853-1.838-.576-3.583-4.196-6.348-8.596-6.348zM5.785 5.991c.642 0 1.162.529 1.162 1.18a1.17 1.17 0 0 1-1.162 1.178A1.17 1.17 0 0 1 4.623 7.17c0-.651.52-1.18 1.162-1.18zm5.813 0c.642 0 1.162.529 1.162 1.18a1.17 1.17 0 0 1-1.162 1.178 1.17 1.17 0 0 1-1.162-1.178c0-.651.52-1.18 1.162-1.18zm5.34 2.867c-1.797-.052-3.746.512-5.28 1.786-1.72 1.428-2.687 3.72-1.78 6.22.942 2.453 3.666 4.229 6.884 4.229.826 0 1.622-.12 2.361-.336a.722.722 0 0 1 .598.082l1.584.926a.272.272 0 0 0 .14.047c.134 0 .24-.111.24-.247 0-.06-.023-.12-.038-.177l-.327-1.233a.582.582 0 0 1-.023-.156.49.49 0 0 1 .201-.398C23.024 18.48 24 16.82 24 14.98c0-3.21-2.931-5.837-6.656-6.088V8.89c-.135-.01-.27-.027-.407-.03zm-2.53 3.274c.535 0 .969.44.969.982a.976.976 0 0 1-.969.983.976.976 0 0 1-.969-.983c0-.542.434-.982.97-.982zm4.844 0c.535 0 .969.44.969.982a.976.976 0 0 1-.969.983.976.976 0 0 1-.969-.983c0-.542.434-.982.969-.982z"/>
              </svg>
              <span>微信</span>
            </button>

            <!-- 4. QQ 空间 -->
            <button
              type="button"
              on:click={shareToQQ}
              class="min-h-15 rounded-sm bg-[#fbfbf9] dark:bg-[#242220] border-2 border-[#1a1a1a] dark:border-[#e8e6e3] shadow-[2px_2px_0px_0px_#1a1a1a] dark:shadow-[2px_2px_0px_0px_#e8e6e3] text-[#1a1a1a] dark:text-[#e8e6e3] font-black text-xs sm:text-sm hover:bg-[#f4efe6] dark:hover:bg-[#2e2a27] hover:-translate-y-0.5 hover:shadow-[3px_3px_0px_0px_#1a1a1a] dark:hover:shadow-[3px_3px_0px_0px_#e8e6e3] active:translate-y-0 active:shadow-none transition-all flex flex-col items-center justify-center gap-1.5 p-2 cursor-pointer"
            >
              <svg class="w-5 h-5 text-[#f5a623]" viewBox="0 0 24 24" fill="currentColor">
                <path d="M23.9868 9.2012c-.032-.099-.127-.223-.334-.258-.207-.036-7.352-1.4063-7.352-1.4063s-.105-.022-.198-.07c-.092-.047-.127-.167-.127-.167S12.4472.954 12.3491.7679c-.099-.187-.245-.238-.349-.238-.104 0-.251.051-.349.238C11.5531.954 8.0245 7.3 8.0245 7.3s-.035.12-.128.167c-.092.047-.197.07-.197.07S.5546 8.9071.3466 8.9421c-.208.036-.302.16-.333.258a.477.477 0 00.125.4491L5.5013 15.14s.072.08.119.172c.016.104.005.21.005.21s-1.1891 7.243-1.2201 7.451c-.031.208.075.369.159.4301.083.062.233.106.421.013.189-.093 6.813-3.2614 6.813-3.2614s.098-.044.201-.061c.103-.017.201.061.201.061s6.624 3.1684 6.813 3.2614c.188.094.338.049.421-.013a.463.463 0 00.159-.43c-.021-.14-.93-5.6778-.93-5.6778.876-.5401 1.4251-1.0392 1.8492-1.7473-2.5944.9692-6.0069 1.7173-9.4163 1.8663-.9152.041-2.4104.097-3.4735-.015-.6781-.071-1.1702-.144-1.2432-.438-.053-.2151.054-.4601.5451-.8312a2640.8625 2640.8625 0 012.8614-2.1553c1.2852-.9681 3.5595-2.4703 3.5595-2.7314 0-.285-2.1443-.781-4.0376-.781-1.9452 0-2.2753.132-2.8114.168-.488.034-.769.005-.804-.138-.06-.2481.183-.3891.588-.5682.7091-.314 1.8603-.594 1.9843-.626.194-.052 3.0824-.8051 5.6188-.5351 1.3181.14 3.2444.668 3.2444 1.2762 0 .342-1.7212 1.4942-3.2254 2.5973-1.1492.8431-2.2173 1.5612-2.2173 1.6883 0 .342 3.5334 1.2411 6.6899 1.01l.003-.022c.048-.092.119-.172.119-.172l5.3627-5.4907a.477.477 0 00.127-.449z"/>
              </svg>
              <span>QQ 空间</span>
            </button>

            <!-- 5. 微博 -->
            <button
              type="button"
              on:click={shareToWeibo}
              class="min-h-15 rounded-sm bg-[#fbfbf9] dark:bg-[#242220] border-2 border-[#1a1a1a] dark:border-[#e8e6e3] shadow-[2px_2px_0px_0px_#1a1a1a] dark:shadow-[2px_2px_0px_0px_#e8e6e3] text-[#1a1a1a] dark:text-[#e8e6e3] font-black text-xs sm:text-sm hover:bg-[#f4efe6] dark:hover:bg-[#2e2a27] hover:-translate-y-0.5 hover:shadow-[3px_3px_0px_0px_#1a1a1a] dark:hover:shadow-[3px_3px_0px_0px_#e8e6e3] active:translate-y-0 active:shadow-none transition-all flex flex-col items-center justify-center gap-1.5 p-2 cursor-pointer"
            >
              <svg class="w-5 h-5 text-[#e6162d]" viewBox="0 0 24 24" fill="currentColor">
                <path d="M10.098 20.323c-3.977.391-7.414-1.406-7.672-4.02-.259-2.609 2.759-5.047 6.74-5.441 3.979-.394 7.413 1.404 7.671 4.018.259 2.6-2.759 5.049-6.737 5.439l-.002.004zM9.05 17.219c-.384.616-1.208.884-1.829.602-.612-.279-.793-.991-.406-1.593.379-.595 1.176-.861 1.793-.601.622.263.82.972.442 1.592zm1.27-1.627c-.141.237-.449.353-.689.253-.236-.09-.313-.361-.177-.586.138-.227.436-.346.672-.24.239.09.315.36.18.601l.014-.028zm.176-2.719c-1.893-.493-4.033.45-4.857 2.118-.836 1.704-.026 3.591 1.886 4.21 1.983.64 4.318-.341 5.132-2.179.8-1.793-.201-3.642-2.161-4.149zm7.563-1.224c-.346-.105-.57-.18-.405-.615.375-.977.42-1.804 0-2.404-.781-1.112-2.915-1.053-5.364-.03 0 0-.766.331-.571-.271.376-1.217.315-2.224-.27-2.809-1.338-1.337-4.869.045-7.888 3.08C1.309 10.87 0 13.273 0 15.348c0 3.981 5.099 6.395 10.086 6.395 6.536 0 10.888-3.801 10.888-6.82 0-1.822-1.547-2.854-2.915-3.284v.01zm1.908-5.092c-.766-.856-1.908-1.187-2.96-.962-.436.09-.706.511-.616.932.09.42.511.691.932.602.511-.105 1.067.044 1.442.465.376.421.466.977.316 1.473-.136.406.089.856.51.992.405.119.857-.105.992-.512.33-1.021.12-2.178-.646-3.035l.03.045zm2.418-2.195c-1.576-1.757-3.905-2.419-6.054-1.968-.496.104-.812.587-.706 1.081.104.496.586.813 1.082.707 1.532-.331 3.185.15 4.296 1.383 1.112 1.246 1.429 2.943.947 4.416-.165.48.106 1.007.586 1.157.479.165.991-.104 1.157-.586.675-2.088.241-4.478-1.338-6.235l.03.045z"/>
              </svg>
              <span>新浪微博</span>
            </button>

            <!-- 6. 分享到 X -->
            <button
              type="button"
              on:click={shareToX}
              class="min-h-15 rounded-sm bg-[#fbfbf9] dark:bg-[#242220] border-2 border-[#1a1a1a] dark:border-[#e8e6e3] shadow-[2px_2px_0px_0px_#1a1a1a] dark:shadow-[2px_2px_0px_0px_#e8e6e3] text-[#1a1a1a] dark:text-[#e8e6e3] font-black text-xs sm:text-sm hover:bg-[#f4efe6] dark:hover:bg-[#2e2a27] hover:-translate-y-0.5 hover:shadow-[3px_3px_0px_0px_#1a1a1a] dark:hover:shadow-[3px_3px_0px_0px_#e8e6e3] active:translate-y-0 active:shadow-none transition-all flex flex-col items-center justify-center gap-1.5 p-2 cursor-pointer"
            >
              <svg class="w-5 h-5 text-[#1a1a1a] dark:text-[#e8e6e3]" viewBox="0 0 24 24" fill="currentColor">
                <path d="M14.234 10.162 22.977 0h-2.072l-7.591 8.824L7.251 0H.258l9.168 13.343L.258 24H2.33l8.016-9.318L16.749 24h6.993zm-2.837 3.299-.929-1.329L3.076 1.56h3.182l5.965 8.532.929 1.329 7.754 11.09h-3.182z"/>
              </svg>
              <span>分享到 X</span>
            </button>
          </div>
        {/if}

        {#if toastMessage}
          <div class="mt-3 py-1.5 px-3 rounded-sm bg-[#1a1a1a] dark:bg-[#e8e6e3] text-white dark:text-[#1a1a1a] text-xs font-bold text-center shadow-sm">
            {toastMessage}
          </div>
        {/if}
        {#if posterError}<p class="mt-3 text-center text-xs font-medium text-red-500">{posterError}</p>{/if}
      </div>
    </section>
  </div>
{/if}

{#if showPoster && posterDataUrl}
  <div use:portal class="fixed inset-0 z-[2147483001] flex items-end sm:items-center justify-center p-0 sm:p-6" style="background: rgba(20,20,19,0.5); backdrop-filter: blur(8px);" role="dialog" aria-modal="true" on:click={closePoster}>
    <div class="w-full sm:max-w-[480px] max-h-[94vh] overflow-y-auto bg-[#fbfbf9] dark:bg-[#1c1b1a] rounded-t-[20px] sm:rounded-[12px] shadow-[8px_8px_0px_0px_#1a1a1a] dark:shadow-[8px_8px_0px_0px_#e8e6e3] border-2 border-[#1a1a1a] dark:border-[#e8e6e3]" on:click|stopPropagation>
      <div class="flex items-center justify-between px-5 py-4 border-b-2 border-[#1a1a1a] dark:border-[#e8e6e3] sticky top-0 z-10 bg-[#f4efe6] dark:bg-[#242220]">
        <div><h3 class="font-black text-[#1a1a1a] dark:text-[#e8e6e3] text-base">分享海报</h3><p class="text-xs text-slate-500 dark:text-slate-400 mt-0.5">下载或复制给朋友</p></div>
        <button on:click={closePoster} aria-label="关闭" class="w-9 h-9 flex items-center justify-center rounded-full border border-[#1a1a1a] dark:border-[#e8e6e3] bg-white dark:bg-[#1c1b1a] text-[#1a1a1a] dark:text-[#e8e6e3] hover:bg-[#9e2a2b] hover:text-white transition-colors cursor-pointer">
          <svg xmlns="http://www.w3.org/2000/svg" class="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2"><path stroke-linecap="round" stroke-linejoin="round" d="M6 18L18 6M6 6l12 12" /></svg>
        </button>
      </div>
      <div class="p-4 sm:p-5">
        <img src={posterDataUrl} alt="海报" class="w-full h-auto rounded-sm border-2 border-[#1a1a1a] dark:border-[#e8e6e3]" />
        <div class="mt-4 flex gap-3">
          <button on:click={downloadPoster} class="flex-1 bg-[#9e2a2b] text-white font-black py-2.5 rounded-sm border-2 border-[#1a1a1a] dark:border-[#e8e6e3] shadow-[2px_2px_0px_0px_#1a1a1a] dark:shadow-[2px_2px_0px_0px_#e8e6e3] hover:bg-[#852324] transition-colors text-sm cursor-pointer">下载海报</button>
          <button on:click={copyPoster} class="flex-1 bg-[#f4efe6] dark:bg-[#242220] text-[#1a1a1a] dark:text-[#e8e6e3] font-black py-2.5 rounded-sm border-2 border-[#1a1a1a] dark:border-[#e8e6e3] shadow-[2px_2px_0px_0px_#1a1a1a] dark:shadow-[2px_2px_0px_0px_#e8e6e3] hover:bg-[#eae3d5] transition-colors text-sm cursor-pointer">复制图片</button>
        </div>
      </div>
    </div>
  </div>
{/if}
