<script lang="ts">
  import type { TalkItem } from '../utils/postsFetcher';
  import SvelteLightbox from './SvelteLightbox.svelte';
  import TalkShareModal from './TalkShareModal.svelte';
  import { siteConfig } from '../config/site';

  export let talk: TalkItem;

  let isLightboxOpen = false;
  let lightboxImages: string[] = [];
  let lightboxInitialIndex = 0;
  let showShare = false;

  function openShare() {
    showShare = true;
    document.body.style.overflow = 'hidden';
  }

  function closeShare() {
    showShare = false;
    document.body.style.overflow = '';
  }

  function formatMarkdown(text: string): string {
    if (!text) return "";
    let html = text;
    // 加粗语法：兼容各种 CJK 标点、紧邻汉字、前后空格及跨行加粗
    html = html.replace(/\*\*[ \t\u3000]*([\s\S]+?)[ \t\u3000]*\*\*/g, '<strong>$1</strong>');
    html = html.replace(/__([^\n_]+?)__/g, '<strong>$1</strong>');
    // 删除线
    html = html.replace(/~~([^\n~]+?)~~/g, '<del>$1</del>');
    // 行内代码
    html = html.replace(/`([^`\n]+)`/g, '<code class="px-1.5 py-0.5 rounded bg-[#1a1a1a]/5 dark:bg-[#e8e6e3]/10 font-mono text-[13px] border border-[#1a1a1a]/10 dark:border-[#e8e6e3]/15">$1</code>');
    // 超链接
    html = html.replace(/\[(.*?)\]\((.*?)\)/g, '<a class="text-[#9e2a2b] dark:text-[#d9534f] font-bold underline underline-offset-2 hover:opacity-80" href="$2" target="_blank" rel="noopener noreferrer">$1</a>');
    return html.split('\n\n').map(p => `<p class="mb-3.5 leading-relaxed break-words">${p.replace(/\n/g, '<br/>')}</p>`).join('');
  }

  function extractImages(content: string): string[] {
    const imageRegex = /!\[.*?\]\((.*?)\)/g;
    return Array.from(content.matchAll(imageRegex)).map((m) => m[1]);
  }

  function getContentWithoutImages(content: string): string {
    return content.replace(/!\[.*?\]\((.*?)\)/g, '').trim();
  }

  function openLightbox(imagesList: string[], index: number, e: Event) {
    e.stopPropagation();
    lightboxImages = imagesList;
    lightboxInitialIndex = index;
    isLightboxOpen = true;
  }

  $: images = extractImages(talk.content);
  $: textOnly = getContentWithoutImages(talk.content);
</script>

<div class="max-w-[800px] mx-auto w-full space-y-6">
  <!-- Back button -->
  <div class="mb-6 flex justify-start select-none animate-card-entrance opacity-0">
     <a href="/talks" class="px-3 py-1.5 border-3 border-[#1a1a1a] dark:border-[#e8e6e3] bg-white dark:bg-[#1c1b1a] text-[#1a1a1a] dark:text-[#e8e6e3] flex items-center gap-1.5 hover:bg-[#9e2a2b] hover:text-white transition-colors cursor-pointer rounded-sm shadow-[4px_4px_0px_0px_#1a1a1a] dark:shadow-[4px_4px_0px_0px_#e8e6e3] hover:shadow-none hover:translate-x-0.5 hover:translate-y-0.5 transition-all font-black uppercase text-xs">
        <span>&lsaquo; BACK TO TALKS</span>
     </a>
  </div>

  <!-- Main Talk Card -->
  <div 
    class="bg-white dark:bg-[#1c1b1a] border-4 border-[#1a1a1a] dark:border-[#e8e6e3] p-5 md:p-6 shadow-[8px_8px_0px_0px_#1a1a1a] dark:shadow-[8px_8px_0px_0px_#e8e6e3] rounded-sm relative animate-card-entrance opacity-0"
    style="animation-delay: 0.06s"
  >
    <!-- Avatar & Meta Header -->
    <div class="flex gap-4 items-center mb-4 select-none">
      <div class="rounded-sm bg-[#9e2a2b] border-3 border-[#1a1a1a] dark:border-[#e8e6e3] shadow-[4px_4px_0px_0px_#1a1a1a] dark:shadow-[4px_4px_0px_0px_#e8e6e3] flex-shrink-0 flex items-center justify-center transform -rotate-3 overflow-hidden w-12 h-12">
         <img src={siteConfig.avatar || "/images/me.jpg"} alt={siteConfig.author} class="w-full h-full object-cover" />
      </div>
      <div>
         <div class="font-black text-[#1a1a1a] dark:text-[#e8e6e3] tracking-wide flex items-center gap-2 text-lg">
            {siteConfig.author}
            {#if talk.mood}
              <span class="text-xs ml-1" title="心情">{talk.mood}</span>
            {/if}
            <span class="text-[10px] bg-[#f4efe6] dark:bg-[#242220] border-2 border-[#1a1a1a] dark:border-[#e8e6e3] px-1.5 py-0.5 shadow-[1px_1px_0px_0px_#1a1a1a] dark:shadow-[1px_1px_0px_0px_#e8e6e3] tracking-wider uppercase font-bold transform skew-x-12 ml-1">
               {siteConfig.signature || '纸上随笔'}
            </span>
         </div>
         <div class="flex items-center gap-2 mt-1 leading-none">
            <span class="text-xs text-slate-500 font-mono font-bold">{talk.date}</span>
         </div>
      </div>
    </div>

    <!-- Content area -->
    <div class="talk-content mt-2 pl-0 sm:pl-[64px] text-base text-slate-700 dark:text-slate-300">
      {#if talk.title && talk.title !== '日常动态'}
        <div class="flex items-center gap-2 mb-2 select-none">
          <span class="w-2 h-2 bg-[#9e2a2b] border border-[#1a1a1a] dark:border-[#e8e6e3] inline-block shadow-[1px_1px_0px_0px_#1a1a1a] dark:shadow-[1px_1px_0px_0px_#e8e6e3] skew-x-12"></span>
          <h3 class="font-black text-[#1a1a1a] dark:text-[#e8e6e3] text-lg">{talk.title}</h3>
        </div>
      {/if}
      
      {#if textOnly}
        <div class="prose prose-lg max-w-none text-slate-755 dark:text-slate-300 leading-relaxed font-medium">
          {@html formatMarkdown(textOnly)}
        </div>
      {/if}

      <!-- Nine-grid Image Gallery -->
      {#if images.length > 0}
        <div class="mt-4 grid gap-2 {images.length === 1 ? 'grid-cols-1 max-w-sm' : images.length === 2 || images.length === 4 ? 'grid-cols-2 max-w-xs' : 'grid-cols-3 max-w-md'}">
          {#each images as src, idx}
            <!-- svelte-ignore a11y-click-events-have-key-events -->
            <div 
              class="w-full overflow-hidden rounded-sm border-2 border-[#1a1a1a] dark:border-[#e8e6e3] hover:border-[#9e2a2b] shadow-[2px_2px_0px_0px_#1a1a1a] dark:shadow-[2px_2px_0px_0px_#e8e6e3] hover:shadow-[3px_3px_0px_0px_#9e2a2b] transition-all cursor-pointer bg-slate-50 relative {images.length === 1 ? 'aspect-video sm:aspect-[4/3] max-h-80' : 'aspect-square'}"
              on:click={(e) => openLightbox(images, idx, e)}
            >
              <img src={src} alt="talk detail graphic asset" class="w-full h-full object-cover transition-transform duration-550 hover:scale-[1.06]" loading="lazy" decoding="async" />
            </div>
          {/each}
        </div>
      {/if}

      <!-- Bottom Metadata: Location, Weather, Device -->
      {#if talk.location || talk.weather || talk.device}
        <div class="mt-4 flex flex-wrap gap-3 items-center text-xs font-bold text-slate-500 dark:text-slate-400 select-none border-t border-dashed border-[#1a1a1a]/15 dark:border-[#e8e6e3]/20 pt-3">
          {#if talk.location}
            <span class="flex items-center gap-1 hover:text-[#9e2a2b] dark:hover:text-[#d9534f] transition-colors">
              <svg class="w-3.5 h-3.5 shrink-0 stroke-[2.2]" viewBox="0 0 24 24" fill="none" stroke="currentColor"><path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z"/><circle cx="12" cy="10" r="3"/></svg>
              <span>{talk.location}</span>
            </span>
          {/if}
          {#if talk.weather}
            <span class="flex items-center gap-1 hover:text-[#9e2a2b] dark:hover:text-[#d9534f] transition-colors">
              <svg class="w-3.5 h-3.5 shrink-0 stroke-[2.2]" viewBox="0 0 24 24" fill="none" stroke="currentColor"><path d="M17.5 19H9a7 7 0 1 1 6.71-9h1.79a4.5 4.5 0 1 1 0 9Z"/></svg>
              <span>{talk.weather}</span>
            </span>
          {/if}
          {#if talk.device}
            <span class="flex items-center gap-1 hover:text-[#9e2a2b] dark:hover:text-[#d9534f] transition-colors font-mono">
              <svg class="w-3.5 h-3.5 shrink-0 stroke-[2.2] text-slate-400 dark:text-slate-500" viewBox="0 0 24 24" fill="none" stroke="currentColor"><rect width="14" height="20" x="5" y="2" rx="2" ry="2"/><path d="M12 18h.01"/></svg>
              <span>{talk.device}</span>
            </span>
          {/if}
        </div>
      {/if}
    </div>

    <!-- Share footer -->
    <div class="mt-8 border-t-2 border-dashed border-[#1a1a1a]/20 dark:border-[#e8e6e3]/20 pt-4 flex justify-between items-center pl-0 sm:pl-[64px]">
       <div class="flex gap-3">
         <button class="flex items-center gap-1.5 px-3 py-1.5 border-2 border-[#1a1a1a] dark:border-[#e8e6e3] bg-white dark:bg-[#1c1b1a] text-[#1a1a1a] dark:text-[#e8e6e3] text-xs font-black shadow-[2px_2px_0px_0px_#1a1a1a] dark:shadow-[2px_2px_0px_0px_#e8e6e3] hover:bg-[#9e2a2b] hover:text-white transition-colors cursor-pointer rounded-sm transform active:translate-y-0.5 active:shadow-[0px_0px_0px_0px_#1a1a1a]">
           <svg class="w-3.5 h-3.5 stroke-[2.2]" viewBox="0 0 24 24" fill="none" stroke="currentColor"><path d="M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.3 1.5 4.05 3 5.5l7 7Z"/></svg>
           <span>LIKE</span>
         </button>
       </div>
       <div class="text-[10px] uppercase font-mono font-bold text-slate-400 dark:text-slate-500 select-none">
          ID: {talk.id}
       </div>
    </div>
  </div>

  <!-- Waline comments placeholder -->
  <div id="waline-placeholder"></div>

  <div class="mt-8 text-center flex justify-center pb-12 select-none">
      <a href="/talks" class="px-6 py-3 border-4 border-[#1a1a1a] dark:border-[#e8e6e3] text-[#1a1a1a] dark:text-[#e8e6e3] bg-white dark:bg-[#1c1b1a] font-black hover:bg-[#9e2a2b] hover:text-white transition-all cursor-pointer rounded-sm shadow-[6px_6px_0px_0px_#1a1a1a] dark:shadow-[6px_6px_0px_0px_#e8e6e3] uppercase tracking-widest text-sm flex items-center justify-center hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-none">
        返回列表 / Back to Talks
      </a>
  </div>
</div>

<!-- Floating share trigger (bottom-right) -->
<button
  on:click={openShare}
  class="fixed bottom-[5.5rem] right-6 z-[2000] w-12 h-12 rounded-sm border-3 sm:border-4 border-[#1a1a1a] dark:border-[#e8e6e3] bg-[#f4efe6] dark:bg-[#242220] text-[#1a1a1a] dark:text-[#e8e6e3] flex items-center justify-center cursor-pointer shadow-[4px_4px_0px_0px_#1a1a1a] dark:shadow-[4px_4px_0px_0px_#e8e6e3] hover:-translate-y-1 hover:bg-[#9e2a2b] hover:text-white active:translate-y-0 active:shadow-none transition-all duration-150"
  aria-label="分享"
>
  <svg xmlns="http://www.w3.org/2000/svg" class="w-5 h-5 sm:w-6 sm:h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2.5">
    <path stroke-linecap="round" stroke-linejoin="round" d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z" />
  </svg>
</button>

{#if showShare}
  {@const images = extractImages(talk.content)}
  {@const textOnly = getContentWithoutImages(talk.content)}
  <TalkShareModal
    talkTitle={talk.title || '日常动态'}
    talkContent={textOnly}
    talkUrl={`${window.location.origin}/talk/${talk.slug}`}
    talkImage={images[0] || ''}
    show={true}
    on:close={closeShare}
  />
{/if}

{#if isLightboxOpen}
  <SvelteLightbox images={lightboxImages} initialIndex={lightboxInitialIndex} onClose={() => isLightboxOpen = false} />
{/if}
