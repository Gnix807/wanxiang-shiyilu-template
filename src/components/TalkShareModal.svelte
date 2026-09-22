<script lang="ts">
  import { createEventDispatcher } from 'svelte';
  import QRCode from 'qrcode';
  import { siteConfig } from '../config/site';

  export let talkTitle: string = '';
  export let talkContent: string = '';
  export let talkUrl: string = '';
  export let talkImage: string = '';
  export let show: boolean = false;

  const dispatch = createEventDispatcher();

  let generatingPoster = false;
  let posterDataUrl: string | null = null;
  let posterError = '';

  const title = talkTitle || '日常动态';
  const description = talkContent.replace(/!\[.*?\]\((.*?)\)/g, '').replace(/[*#\[\]]/g, '').trim();
  const shareImage = talkImage || '';

  function close() {
    show = false;
    posterDataUrl = null;
    posterError = '';
    document.body.style.overflow = '';
    dispatch('close');
  }

  function handleBackdropClick(e: Event) {
    if (e.target === e.currentTarget) close();
  }

  function copyLink() {
    navigator.clipboard.writeText(talkUrl).then(() => {
      const btn = document.querySelector('.copy-link-btn');
      if (btn) {
        btn.innerHTML = '<span class="inline-flex items-center gap-1 text-emerald-600 dark:text-emerald-400"><svg class="w-3.5 h-3.5 stroke-[2.5]" viewBox="0 0 24 24" fill="none" stroke="currentColor"><circle cx="12" cy="12" r="10"/><path d="m9 12 2 2 4-4"/></svg>已复制</span>';
        setTimeout(() => { btn.textContent = '复制链接'; }, 2000);
      }
    });
  }

  function shareToQQ() {
    const qqUrl = `https://sns.qzone.qq.com/cgi-bin/qzshare/cgi_qzshare_onekey?url=${encodeURIComponent(talkUrl)}&title=${encodeURIComponent(title)}&desc=${encodeURIComponent(description)}&summary=${encodeURIComponent(description)}&site=${encodeURIComponent(siteConfig.author || '博客')}`;
    window.open(qqUrl, '_blank', 'width=700,height=600');
  }

  function shareToX() {
    const text = `${title}${description ? ' - ' + description.slice(0, 100) : ''}`;
    const xUrl = `https://twitter.com/intent/tweet?text=${encodeURIComponent(text)}&url=${encodeURIComponent(talkUrl)}`;
    window.open(xUrl, '_blank', 'width=600,height=400');
  }

  function shareToWeChat() {
    const text = `${title}\n${description}\n${talkUrl}`;
    navigator.clipboard.writeText(text).then(() => {
      alert('分享内容已复制到剪贴板，请打开微信粘贴给好友');
    });
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
    let currentLine = '';
    for (const char of text) {
      const testLine = currentLine + char;
      if (ctx.measureText(testLine).width > maxWidth && currentLine) {
        lines.push(currentLine);
        currentLine = char;
      } else {
        currentLine = testLine;
      }
    }
    if (currentLine) lines.push(currentLine);
    return lines.length ? lines : [text];
  }

  async function generatePoster() {
    generatingPoster = true;
    posterError = '';
    posterDataUrl = null;

    try {
      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d')!;
      const W = 900;
      const H = 1200;
      canvas.width = W;
      canvas.height = H;

      ctx.fillStyle = '#e6e4df';
      ctx.fillRect(0, 0, W, H);
      ctx.fillStyle = '#1a1a1a';
      ctx.fillRect(18, 18, W - 24, H - 24);
      ctx.fillStyle = '#fbfbf9';
      ctx.fillRect(8, 8, W - 32, H - 32);

      ctx.fillStyle = '#9e2a2b';
      ctx.fillRect(8, 8, W - 32, 14);

      ctx.fillStyle = '#1a1a1a';
      ctx.fillRect(8, 22, W - 32, 72);
      ctx.fillStyle = '#ffffff';
      ctx.font = 'bold 28px "Noto Serif SC", "Noto Sans SC", serif';
      ctx.textAlign = 'left';
      ctx.fillText(`${siteConfig.author || '说说'} · TALK`, 40, 68);
      ctx.font = 'bold 16px "Noto Sans SC", system-ui, sans-serif';
      ctx.fillStyle = '#f4efe6';
      ctx.fillText('分享一条说说', 40, 90);

      let y = 120;
      const pad = 40;
      const contentW = W - 32 - pad * 2;

      if (shareImage) {
        try {
          const img = await loadImage(shareImage);
          const boxW = contentW;
          const boxH = 360;
          const scale = Math.max(boxW / img.width, boxH / img.height);
          const sw = boxW / scale;
          const sh = boxH / scale;
          const sx = (img.width - sw) / 2;
          const sy = (img.height - sh) / 2;

          ctx.fillStyle = '#1a1a1a';
          ctx.fillRect(pad - 4, y - 4, boxW + 8, boxH + 8);
          ctx.save();
          ctx.beginPath();
          ctx.rect(pad, y, boxW, boxH);
          ctx.clip();
          ctx.drawImage(img, sx, sy, sw, sh, pad, y, boxW, boxH);
          ctx.restore();
          y += boxH + 36;
        } catch {
          y += 12;
        }
      } else {
        ctx.fillStyle = '#f4efe6';
        ctx.fillRect(pad, y, contentW, 120);
        ctx.strokeStyle = '#1a1a1a';
        ctx.lineWidth = 4;
        ctx.strokeRect(pad, y, contentW, 120);
        ctx.fillStyle = '#9e2a2b';
        ctx.font = 'bold 42px "Noto Serif SC", serif';
        ctx.textAlign = 'center';
        ctx.fillText('TALK', pad + contentW / 2, y + 72);
        ctx.textAlign = 'left';
        y += 148;
      }

      ctx.fillStyle = '#1a1a1a';
      ctx.font = 'bold 38px "Noto Serif SC", "Noto Sans SC", serif';
      const titleLines = wrapText(ctx, title, contentW);
      titleLines.slice(0, 3).forEach((line, i) => {
        ctx.fillText(line, pad, y + i * 52);
      });
      y += Math.min(titleLines.length, 3) * 52 + 24;

      if (description) {
        ctx.fillStyle = '#475569';
        ctx.font = '22px "Noto Serif SC", "Noto Sans SC", serif';
        const descLines = wrapText(ctx, description.slice(0, 220), contentW);
        descLines.slice(0, 5).forEach((line, i) => {
          ctx.fillText(line, pad, y + i * 32);
        });
        y += Math.min(descLines.length, 5) * 32 + 28;
      }

      const footerY = H - 220;
      const footerH = 150;
      const footerW = contentW;
      const footerX = pad;

      ctx.fillStyle = '#1a1a1a';
      ctx.fillRect(footerX + 6, footerY + 6, footerW, footerH);
      ctx.fillStyle = '#ffffff';
      ctx.fillRect(footerX, footerY, footerW, footerH);
      ctx.strokeStyle = '#1a1a1a';
      ctx.lineWidth = 4;
      ctx.strokeRect(footerX, footerY, footerW, footerH);

      const av = 72;
      const avX = footerX + 24;
      const avY = footerY + (footerH - av) / 2;
      ctx.save();
      ctx.beginPath();
      ctx.arc(avX + av / 2, avY + av / 2, av / 2, 0, Math.PI * 2);
      ctx.closePath();
      ctx.clip();
      try {
        const avImg = await loadImage(siteConfig.avatar || '/images/me.jpg');
        ctx.drawImage(avImg, avX, avY, av, av);
      } catch {
        ctx.fillStyle = '#9e2a2b';
        ctx.fillRect(avX, avY, av, av);
      }
      ctx.restore();
      ctx.strokeStyle = '#1a1a1a';
      ctx.lineWidth = 3;
      ctx.beginPath();
      ctx.arc(avX + av / 2, avY + av / 2, av / 2, 0, Math.PI * 2);
      ctx.stroke();

      ctx.fillStyle = '#1a1a1a';
      ctx.font = 'bold 26px "Noto Serif SC", "Noto Sans SC", serif';
      ctx.textAlign = 'left';
      ctx.fillText(siteConfig.author || '示例作者', avX + av + 20, footerY + 58);
      ctx.fillStyle = '#9e2a2b';
      ctx.font = 'bold 18px "JetBrains Mono", monospace';
      const siteDomain = siteConfig.url.replace(/^https?:\/\//, '').replace(/\/.*$/, '');
      ctx.fillText(siteDomain, avX + av + 20, footerY + 90);
      ctx.fillStyle = '#64748b';
      ctx.font = '14px "Noto Sans SC", system-ui, sans-serif';
      const shortUrl = talkUrl.replace(/^https?:\/\//, '').slice(0, 28);
      ctx.fillText(shortUrl, avX + av + 20, footerY + 118);

      const qr = 96;
      const qrX = footerX + footerW - qr - 24;
      const qrY = footerY + (footerH - qr) / 2;
      ctx.fillStyle = '#1a1a1a';
      ctx.fillRect(qrX - 4, qrY - 4, qr + 8, qr + 8);
      ctx.fillStyle = '#ffffff';
      ctx.fillRect(qrX, qrY, qr, qr);
      try {
        const qrDataUrl = await QRCode.toDataURL(talkUrl, { width: 120, margin: 1 });
        const qrImg = await loadImage(qrDataUrl);
        ctx.drawImage(qrImg, qrX + 6, qrY + 6, qr - 12, qr - 12);
      } catch {}

      ctx.fillStyle = '#1a1a1a';
      ctx.fillRect(8, H - 40, W - 32, 16);
      ctx.fillStyle = '#9e2a2b';
      ctx.fillRect(8, H - 24, W - 32, 8);

      posterDataUrl = canvas.toDataURL('image/png');
    } catch (e) {
      posterError = '海报生成失败，请重试';
    } finally {
      generatingPoster = false;
    }
  }

  async function sharePoster() {
    if (!posterDataUrl) return;
    try {
      const blob = await (await fetch(posterDataUrl)).blob();
      const file = new File([blob], `poster-${Date.now()}.png`, { type: 'image/png' });
      if (navigator.share && navigator.canShare({ files: [file] })) {
        await navigator.share({
          title: title,
          text: description,
          files: [file]
        });
      } else {
        downloadPoster();
      }
    } catch (e) {
      downloadPoster();
    }
  }

  function downloadPoster() {
    if (!posterDataUrl) return;
    const a = document.createElement('a');
    a.href = posterDataUrl;
    a.download = `poster-${Date.now()}.png`;
    a.click();
  }
</script>

{#if show}
  <div
    class="fixed inset-0 z-[3000]"
    style="background: rgba(0,0,0,0.6); backdrop-filter: blur(4px);"
    on:click={handleBackdropClick}
  >
    <div
      class="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[90vw] sm:w-[400px] max-h-[85vh] bg-[#fbfbf9] dark:bg-[#141413] border-[5px] border-[#1a1a1a] dark:border-[#e8e6e3] rounded-sm shadow-[8px_8px_0px_0px_#1a1a1a] dark:shadow-[8px_8px_0px_0px_#e8e6e3] overflow-y-auto"
      on:click|stopPropagation
    >
      <div class="flex items-center justify-between p-4 border-b-4 border-[#1a1a1a] dark:border-[#e8e6e3] bg-white dark:bg-[#1c1b1a] sticky top-0 z-10">
        <h3 class="font-black text-[#1a1a1a] dark:text-[#e8e6e3] text-lg uppercase tracking-wider font-sans">分享</h3>
        <button on:click={close} class="w-10 h-10 flex items-center justify-center hover:bg-[#f4efe6] dark:hover:bg-[#242220] rounded-sm transition-all text-[#1a1a1a] dark:text-[#e8e6e3] cursor-pointer border-2 border-[#1a1a1a] dark:border-[#e8e6e3] bg-white dark:bg-[#1c1b1a] shadow-[2px_2px_0px_0px_#1a1a1a] dark:shadow-[2px_2px_0px_0px_#e8e6e3] active:translate-y-0.5 active:shadow-none">
          <svg xmlns="http://www.w3.org/2000/svg" class="w-6 h-6 stroke-[3]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      </div>

      <div class="p-4 space-y-3">
        <button
          on:click={generatePoster}
          disabled={generatingPoster}
          class="w-full flex items-center gap-4 p-4 bg-white dark:bg-[#1c1b1a] border-3 border-[#1a1a1a] dark:border-[#e8e6e3] rounded-sm shadow-[4px_4px_0px_0px_#1a1a1a] dark:shadow-[4px_4px_0px_0px_#e8e6e3] hover:shadow-none hover:translate-x-0.5 hover:translate-y-0.5 transition-all disabled:opacity-50 cursor-pointer"
        >
          <div class="w-10 h-10 flex items-center justify-center bg-[#f4efe6] dark:bg-[#242220] border-2 border-[#1a1a1a] dark:border-[#e8e6e3] rounded-sm shrink-0">
            <svg xmlns="http://www.w3.org/2000/svg" class="w-5 h-5 text-[#9e2a2b] dark:text-[#d9534f]" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
              <path stroke-linecap="round" stroke-linejoin="round" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
          </div>
          <div class="text-left">
            <div class="font-black text-[#1a1a1a] dark:text-[#e8e6e3] text-sm">生成分享卡片</div>
            <div class="text-xs text-slate-500 dark:text-slate-400 font-bold">竖版海报 · 一键下载</div>
          </div>
          {#if generatingPoster}
            <span class="ml-auto text-[#9e2a2b] dark:text-[#d9534f] font-black animate-spin">⟳</span>
          {/if}
        </button>

        {#if posterDataUrl}
          <div class="bg-white dark:bg-[#1c1b1a] border-3 border-[#1a1a1a] dark:border-[#e8e6e3] rounded-sm p-3 shadow-[3px_3px_0px_0px_#1a1a1a] dark:shadow-[3px_3px_0px_0px_#e8e6e3]">
            <img src={posterDataUrl} alt="海报预览" class="w-full h-auto rounded-sm" />
            <div class="mt-3 flex gap-2">
              <button on:click={sharePoster} class="flex-1 bg-[#9e2a2b] dark:bg-[#d9534f] text-white font-black py-2.5 border-3 border-[#1a1a1a] dark:border-[#e8e6e3] rounded-sm shadow-[3px_3px_0px_0px_#1a1a1a] dark:shadow-[3px_3px_0px_0px_#e8e6e3] hover:shadow-none hover:translate-x-0.5 hover:translate-y-0.5 transition-all text-sm uppercase tracking-wider cursor-pointer">分享</button>
              <button on:click={downloadPoster} class="flex-1 bg-white dark:bg-[#242220] text-[#1a1a1a] dark:text-[#e8e6e3] font-black py-2.5 border-3 border-[#1a1a1a] dark:border-[#e8e6e3] rounded-sm shadow-[3px_3px_0px_0px_#1a1a1a] dark:shadow-[3px_3px_0px_0px_#e8e6e3] hover:shadow-none hover:translate-x-0.5 hover:translate-y-0.5 transition-all text-sm uppercase tracking-wider cursor-pointer">下载</button>
            </div>
          </div>
        {/if}

        {#if posterError}
          <p class="text-[#9e2a2b] dark:text-[#d9534f] text-xs font-bold text-center">{posterError}</p>
        {/if}

        <button on:click={shareToQQ} class="w-full flex items-center gap-4 p-4 bg-white dark:bg-[#1c1b1a] border-3 border-[#1a1a1a] dark:border-[#e8e6e3] rounded-sm shadow-[4px_4px_0px_0px_#1a1a1a] dark:shadow-[4px_4px_0px_0px_#e8e6e3] hover:shadow-none hover:translate-x-0.5 hover:translate-y-0.5 transition-all cursor-pointer">
          <div class="w-10 h-10 flex items-center justify-center bg-[#9e2a2b] dark:bg-[#d9534f] border-2 border-[#1a1a1a] dark:border-[#e8e6e3] rounded-sm shrink-0">
            <svg xmlns="http://www.w3.org/2000/svg" class="w-5 h-5 text-white" fill="currentColor" viewBox="0 0 24 24"><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm4.5 14h-9c-.83 0-1.5-.67-1.5-1.5S6.67 13 7.5 13h9c.83 0 1.5.67 1.5 1.5s-.67 1.5-1.5 1.5zm0-5h-9c-.83 0-1.5-.67-1.5-1.5S6.67 8 7.5 8h9c.83 0 1.5.67 1.5 1.5s-.67 1.5-1.5 1.5z"/></svg>
          </div>
          <div class="text-left">
            <div class="font-black text-[#1a1a1a] dark:text-[#e8e6e3] text-sm">QQ 空间</div>
            <div class="text-xs text-slate-500 dark:text-slate-400 font-bold">分享到 QQ 空间</div>
          </div>
        </button>

        <button on:click={shareToX} class="w-full flex items-center gap-4 p-4 bg-white dark:bg-[#1c1b1a] border-3 border-[#1a1a1a] dark:border-[#e8e6e3] rounded-sm shadow-[4px_4px_0px_0px_#1a1a1a] dark:shadow-[4px_4px_0px_0px_#e8e6e3] hover:shadow-none hover:translate-x-0.5 hover:translate-y-0.5 transition-all cursor-pointer">
          <div class="w-10 h-10 flex items-center justify-center bg-black border-2 border-black rounded-sm shrink-0">
            <svg xmlns="http://www.w3.org/2000/svg" class="w-5 h-5 text-white" fill="currentColor" viewBox="0 0 24 24"><path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/></svg>
          </div>
          <div class="text-left">
            <div class="font-black text-[#1a1a1a] dark:text-[#e8e6e3] text-sm">X (Twitter)</div>
            <div class="text-xs text-slate-500 dark:text-slate-400 font-bold">分享到 X</div>
          </div>
        </button>

        <button on:click={shareToWeChat} class="w-full flex items-center gap-4 p-4 bg-white dark:bg-[#1c1b1a] border-3 border-[#1a1a1a] dark:border-[#e8e6e3] rounded-sm shadow-[4px_4px_0px_0px_#1a1a1a] dark:shadow-[4px_4px_0px_0px_#e8e6e3] hover:shadow-none hover:translate-x-0.5 hover:translate-y-0.5 transition-all cursor-pointer">
          <div class="w-10 h-10 flex items-center justify-center bg-[#07c160] border-2 border-[#07c160] rounded-sm shrink-0">
            <svg xmlns="http://www.w3.org/2000/svg" class="w-5 h-5 text-white" fill="currentColor" viewBox="0 0 24 24"><path d="M8.691 2.188C3.891 2.188 0 5.476 0 9.53c0 2.212 1.17 4.203 3.002 5.55a.59.59 0 01.213.665l-.39 1.48c-.019.07-.048.141-.048.213 0 .163.13.295.29.295a.326.326 0 00.167-.054l1.903-1.114a.864.864 0 01.717-.098 10.16 10.16 0 002.837.403c.276 0 .543-.027.811-.05-.857-2.578.157-4.972 1.932-6.446 1.703-1.415 3.882-1.98 5.853-1.838-.576-3.583-4.196-6.348-8.596-6.348zM5.785 5.991c.642 0 1.162.529 1.162 1.18a1.17 1.17 0 01-1.162 1.178A1.17 1.17 0 014.623 7.17c0-.651.52-1.18 1.162-1.18zm5.813 0c.642 0 1.162.529 1.162 1.18a1.17 1.17 0 01-1.162 1.178 1.17 1.17 0 01-1.162-1.178c0-.651.52-1.18 1.162-1.18zm2.869 3.714c-.482 0-.872.396-.872.884 0 .489.39.885.872.885.481 0 .872-.396.872-.885a.878.878 0 00-.872-.884zm-4.951.004c-.481 0-.872.396-.872.884 0 .489.39.885.872.885.481 0 .872-.396.872-.885a.878.878 0 00-.872-.884zm1.256 4.403c-2.092 0-3.95.586-5.122 1.443 1.426.936 3.252 1.486 5.222 1.486.799 0 1.568-.11 2.29-.308a.864.864 0 01.716.098l1.904 1.114a.326.326 0 00.167.054c.16 0 .29-.132.29-.295 0-.072-.029-.143-.048-.213l-.39-1.48a.59.59 0 01.213-.665c1.19-.942 2.02-2.294 2.228-3.826-1.215.652-2.662 1.035-4.27 1.035-1.09 0-2.124-.177-3.04-.488z"/></svg>
          </div>
          <div class="text-left">
            <div class="font-black text-[#1a1a1a] dark:text-[#e8e6e3] text-sm">微信</div>
            <div class="text-xs text-slate-500 dark:text-slate-400 font-bold">复制内容，打开微信粘贴</div>
          </div>
        </button>

        <button on:click={copyLink} class="copy-link-btn w-full flex items-center gap-4 p-4 bg-white dark:bg-[#1c1b1a] border-3 border-[#1a1a1a] dark:border-[#e8e6e3] rounded-sm shadow-[4px_4px_0px_0px_#1a1a1a] dark:shadow-[4px_4px_0px_0px_#e8e6e3] hover:shadow-none hover:translate-x-0.5 hover:translate-y-0.5 transition-all cursor-pointer">
          <div class="w-10 h-10 flex items-center justify-center bg-[#f4efe6] dark:bg-[#242220] border-2 border-[#1a1a1a] dark:border-[#e8e6e3] rounded-sm shrink-0">
            <svg xmlns="http://www.w3.org/2000/svg" class="w-5 h-5 text-[#9e2a2b] dark:text-[#d9534f]" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2"><path stroke-linecap="round" stroke-linejoin="round" d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1" /></svg>
          </div>
          <div class="text-left">
            <div class="font-black text-[#1a1a1a] dark:text-[#e8e6e3] text-sm">复制链接</div>
            <div class="text-xs text-slate-500 dark:text-slate-400 font-bold">复制文章链接到剪贴板</div>
          </div>
        </button>
      </div>
    </div>
  </div>
{/if}
