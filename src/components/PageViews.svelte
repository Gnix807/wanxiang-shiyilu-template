<script>
  import { onMount } from 'svelte';

  export let path = '';
  let views = 0;
  let loading = true;

  onMount(async () => {
    // 浏览量统计接口已解绑原作者后端；如后续接入自定义 API 且 views > 0 时才会渲染
    views = 0;
    loading = false;
  });
</script>

{#if !loading && views > 0}
  <span class="inline-flex items-center gap-1 text-xs sm:text-sm font-extrabold text-slate-600 dark:text-slate-400 shrink-0">
    <svg xmlns="http://www.w3.org/2000/svg" class="w-3 h-3 sm:w-3.5 sm:h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2.5">
      <path stroke-linecap="round" stroke-linejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
      <path stroke-linecap="round" stroke-linejoin="round" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
    </svg>
    {views}
  </span>
{/if}
