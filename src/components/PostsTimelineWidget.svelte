<script lang="ts">
  import { onMount } from 'svelte';
  import { slide } from 'svelte/transition';

  interface TimelinePost {
    slug: string;
    title: string;
    date: string;
  }

  export let posts: TimelinePost[] = [];
  export let dataUrl: string = '';

  let openGroups = new Set<string>();
  let hasInitialized = false;

  onMount(() => {
    if (posts.length > 0) return;
    if (!dataUrl) return;

    fetch(dataUrl)
      .then(res => res.ok ? res.json() : Promise.reject(new Error(`Failed to load ${dataUrl}`)))
      .then((loadedPosts: TimelinePost[]) => {
        if (Array.isArray(loadedPosts)) {
          posts = loadedPosts.map(post => ({
            slug: post.slug,
            title: post.title,
            date: post.date,
          }));
        }
      })
      .catch(err => console.warn('[PostsTimelineWidget] post data unavailable', err));
  });

  $: groupedPosts = posts.reduce((acc, post) => {
    if (!post.date || post.date === '未知时间') return acc;
    const parts = post.date.split('-');
    if (parts.length < 2) return acc;
    const ym = `${parts[0]}年${parts[1]}月`;
    acc[ym] = acc[ym] || [];
    acc[ym].push(post);
    return acc;
  }, {} as Record<string, TimelinePost[]>);

  $: months = Object.keys(groupedPosts);

  // 仅在首次渲染出月份时默认展开最新的第一个月，之后状态完全由用户点击掌控
  $: if (months.length > 0 && !hasInitialized) {
    openGroups = new Set([months[0]]);
    hasInitialized = true;
  }

  function toggleGroup(ym: string) {
    const next = new Set(openGroups);
    if (next.has(ym)) {
      next.delete(ym);
    } else {
      next.add(ym);
    }
    openGroups = next;
  }

  function displayDate(date: string) {
    if (!date) return '';
    // 剔除时间戳部分 (如 08:00:00)，只保留 MM-DD
    const dateOnly = date.trim().split(/\s+/)[0].split('T')[0];
    const parts = dateOnly.split('-');
    return parts.length >= 3 ? `${parts[1]}-${parts[2]}` : dateOnly;
  }
</script>

{#if months.length > 0}
  <div class="bg-white dark:bg-[#1c1b1a] border-4 border-[#1a1a1a] dark:border-[#e8e6e3] p-4 shadow-[6px_6px_0px_0px_#1a1a1a] dark:shadow-[6px_6px_0px_0px_#e8e6e3] rounded-sm xl:sticky xl:top-[calc(100px+320px)] w-full animate-card-entrance opacity-0" style="animation-delay: 0.12s">
    <h3 class="font-black text-[#1a1a1a] dark:text-[#e8e6e3] uppercase tracking-wider mb-4 border-b-2 border-dashed border-[#1a1a1a]/20 dark:border-[#e8e6e3]/20 pb-2 flex items-center gap-2 text-sm">
      <svg xmlns="http://www.w3.org/2000/svg" class="w-4 h-4 stroke-[2.5]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path stroke-linecap="round" stroke-linejoin="round" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
      </svg>
      <span>归档目录</span>
    </h3>

    <div class="space-y-4 max-h-[50vh] overflow-y-auto pr-1 custom-scrollbar">
      {#each months as ym}
        {@const isOpen = openGroups.has(ym)}
        <div class="archive-group" data-ym={ym}>
          <button
            type="button"
            class="archive-header w-full text-xs font-black text-[#1a1a1a] dark:text-[#e8e6e3] mb-2 relative flex items-center cursor-pointer hover:text-[#9e2a2b] dark:hover:text-[#d9534f] transition-colors select-none text-left"
            on:click={() => toggleGroup(ym)}
          >
            <span class="w-2 h-2 bg-[#f4efe6] dark:bg-[#242220] border-2 border-[#1a1a1a] dark:border-[#e8e6e3] inline-block mr-2 shadow-[1px_1px_0px_0px_#1a1a1a] dark:shadow-[1px_1px_0px_0px_#e8e6e3]"></span>
            <span class="flex-1">{ym}</span>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              class="w-3.5 h-3.5 stroke-[2.5] chevron-icon transition-transform duration-250 ease-out"
              style="transform: {isOpen ? 'rotate(0deg)' : 'rotate(-90deg)'};"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path stroke-linecap="round" stroke-linejoin="round" d="M19 9l-7 7-7-7" />
            </svg>
          </button>

          {#if isOpen}
            <div
              transition:slide={{ duration: 250 }}
              class="archive-posts pl-3 border-l-2 border-dashed border-[#1a1a1a]/20 dark:border-[#e8e6e3]/20 ml-[3px] space-y-2 overflow-hidden"
            >
              {#each groupedPosts[ym] as post}
                <a
                  href={`/posts/${encodeURIComponent(post.slug)}`}
                  data-astro-prefetch
                  class="block text-[11px] font-bold text-[#1a1a1a]/80 dark:text-[#e8e6e3]/80 hover:text-[#9e2a2b] dark:hover:text-[#d9534f] cursor-pointer truncate transition-colors py-0.5 relative z-10"
                  title={post.title}
                >
                  <span class="mr-1.5 text-slate-500 dark:text-slate-400 font-mono text-[9px]">{displayDate(post.date)}</span>
                  {post.title}
                </a>
              {/each}
            </div>
          {/if}
        </div>
      {/each}
    </div>
  </div>
{:else}
  <div class="bg-white dark:bg-[#1c1b1a] border-4 border-[#1a1a1a] dark:border-[#e8e6e3] p-4 shadow-[6px_6px_0px_0px_#1a1a1a] dark:shadow-[6px_6px_0px_0px_#e8e6e3] rounded-sm w-full animate-card-entrance opacity-0" style="animation-delay: 0.12s">
    <h3 class="font-black text-[#1a1a1a] dark:text-[#e8e6e3] uppercase tracking-wider mb-2 text-sm">归档目录</h3>
    <p class="text-xs font-bold text-slate-400">加载中...</p>
  </div>
{/if}
