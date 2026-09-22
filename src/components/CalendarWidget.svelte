<script lang="ts">
  import { onMount } from 'svelte';

  interface CalendarPost {
    slug: string;
    title: string;
    date: string;
    description: string;
  }

  export let posts: CalendarPost[] = [];
  export let dataUrl: string = '';

  let currentDate = new Date();
  let selectedDate: Date | null = null;
  let isPickerOpen = false;

  onMount(() => {
    if (posts.length > 0) return;
    if (!dataUrl) return;

    fetch(dataUrl)
      .then(res => res.ok ? res.json() : Promise.reject(new Error(`Failed to load ${dataUrl}`)))
      .then((loadedPosts: CalendarPost[]) => {
        if (Array.isArray(loadedPosts)) {
          posts = loadedPosts.map(post => ({
            slug: post.slug,
            title: post.title,
            date: post.date,
            description: post.description,
          }));
        }
      })
      .catch(err => console.warn('[CalendarWidget] post data unavailable', err));
  });

  $: currentYear = currentDate.getFullYear();
  $: currentMonth = currentDate.getMonth();

  // Get days in current month
  $: daysInMonth = new Date(currentYear, currentMonth + 1, 0).getDate();
  // Get starting day of week
  $: startDayOfWeek = new Date(currentYear, currentMonth, 1).getDay();

  // Generate days array
  $: days = Array.from({ length: daysInMonth }, (_, i) => new Date(currentYear, currentMonth, i + 1));

  $: postsByDay = posts.reduce((acc, p) => {
    if (!p.date || p.date === '未知时间') return acc;
    const key = p.date.slice(0, 10);
    acc[key] = acc[key] || [];
    acc[key].push(p);
    return acc;
  }, {} as Record<string, CalendarPost[]>);

  function prevMonth() {
    currentDate = new Date(currentYear, currentMonth - 1, 1);
    selectedDate = null;
  }

  function nextMonth() {
    currentDate = new Date(currentYear, currentMonth + 1, 1);
    selectedDate = null;
  }

  function formatYMD(date: Date): string {
    const y = date.getFullYear();
    const m = String(date.getMonth() + 1).padStart(2, '0');
    const d = String(date.getDate()).padStart(2, '0');
    return `${y}-${m}-${d}`;
  }

  function handleDayClick(dayObj: Date, hasEvents: boolean) {
    if (selectedDate && selectedDate.getTime() === dayObj.getTime()) {
      selectedDate = null;
    } else {
      selectedDate = dayObj;
    }
  }

  $: selectedDateEvents = selectedDate ? (postsByDay[formatYMD(selectedDate)] || []) : [];

  const weekdays = ['日', '一', '二', '三', '四', '五', '六'];
</script>

<div class="bg-white dark:bg-[#1c1b1a] border-4 border-[#1a1a1a] dark:border-[#e8e6e3] p-3.5 shadow-[6px_6px_0px_0px_#1a1a1a] dark:shadow-[6px_6px_0px_0px_#e8e6e3] rounded-sm w-full relative animate-card-entrance opacity-0" data-nosnippet aria-hidden="true" style="animation-delay: 0.08s">
  <div class="text-center font-mono text-[11px] font-black text-slate-450 dark:text-slate-400 mb-1.5 uppercase tracking-widest block select-none">
    #创作日历
  </div>
  
  <div class="flex justify-between items-center mb-4 border-b-2 border-dashed border-[#1a1a1a]/20 dark:border-[#e8e6e3]/20 pb-2">
    <button on:click={prevMonth} aria-label="Previous Month" class="p-1 px-1.5 hover:bg-[#9e2a2b] dark:hover:bg-[#d9534f] hover:text-white border-2 border-transparent hover:border-[#1a1a1a] dark:hover:border-[#e8e6e3] rounded-sm transition-colors cursor-pointer text-[#1a1a1a] dark:text-[#e8e6e3]">
      <svg xmlns="http://www.w3.org/2000/svg" class="w-4 h-4 stroke-[2.5]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path stroke-linecap="round" stroke-linejoin="round" d="M15 19l-7-7 7-7" />
      </svg>
    </button>
    
    <div class="font-extrabold text-[#1a1a1a] dark:text-[#e8e6e3] text-sm tracking-widest px-2 py-1 rounded-sm select-none">
      {currentYear} / {String(currentMonth + 1).padStart(2, '0')}
    </div>
    
    <button on:click={nextMonth} aria-label="Next Month" class="p-1 px-1.5 hover:bg-[#9e2a2b] dark:hover:bg-[#d9534f] hover:text-white border-2 border-transparent hover:border-[#1a1a1a] dark:hover:border-[#e8e6e3] rounded-sm transition-colors cursor-pointer text-[#1a1a1a] dark:text-[#e8e6e3]">
      <svg xmlns="http://www.w3.org/2000/svg" class="w-4 h-4 stroke-[2.5]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path stroke-linecap="round" stroke-linejoin="round" d="M9 5l7 7-7 7" />
      </svg>
    </button>
  </div>

  <div>
    <div class="grid grid-cols-7 gap-1 text-center mb-2 select-none">
      {#each weekdays as day}
        <div class="text-[10px] font-black text-[#1a1a1a]/65 dark:text-[#e8e6e3]/65">{day}</div>
      {/each}
    </div>
    <div class="grid grid-cols-7 gap-1">
      {#each Array(startDayOfWeek) as _}
        <div></div>
      {/each}
      {#each days as day}
        {@const ymd = formatYMD(day)}
        {@const hasEvents = !!postsByDay[ymd]}
        {@const isSelected = selectedDate && selectedDate.getTime() === day.getTime()}
        <button 
          on:click={() => handleDayClick(day, hasEvents)}
          class="relative flex items-center justify-center h-[28px] text-[11px] rounded-sm border-2 font-black select-none cursor-pointer duration-150 outline-none focus-visible:ring-2 focus-visible:ring-[#1a1a1a] dark:focus-visible:ring-[#e8e6e3] focus-visible:ring-offset-2
            {hasEvents ? 'border-[#1a1a1a] dark:border-[#e8e6e3] hover:bg-[#f4efe6] dark:hover:bg-[#242220] text-[#1a1a1a] dark:text-[#e8e6e3]' : 'border-transparent text-slate-450 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-[#242220]'}
            {isSelected ? 'bg-[#9e2a2b] dark:bg-[#d9534f] text-white border-[#1a1a1a] dark:border-[#e8e6e3]' : hasEvents ? '' : ''}
          "
        >
          {day.getDate()}
          {#if hasEvents}
            <div class="absolute top-0.5 right-0.5 w-1.5 h-1.5 rounded-full border border-white dark:border-[#141413] {isSelected ? 'bg-white' : 'bg-[#9e2a2b] dark:bg-[#d9534f]'}"></div>
          {/if}
        </button>
      {/each}
    </div>
  </div>

  {#if selectedDate && selectedDateEvents.length > 0}
    <div class="mt-4 pt-3 border-t-2 border-dashed border-[#1a1a1a]/20 dark:border-[#e8e6e3]/20 animate-fade-in">
      <div class="flex justify-between items-center mb-2 gap-2">
        <span class="text-[10px] font-black text-[#1a1a1a] dark:text-[#e8e6e3] tracking-wider shrink-0 bg-[#f4efe6] dark:bg-[#242220] px-1.5 py-0.5 border-2 border-[#1a1a1a] dark:border-[#e8e6e3]">
          {formatYMD(selectedDate)} 作品
        </span>
        <button 
          on:click={() => selectedDate = null} 
          class="text-[9px] font-black bg-white dark:bg-[#1c1b1a] text-[#1a1a1a] dark:text-[#e8e6e3] hover:text-[#9e2a2b] dark:hover:text-[#d9534f] px-1 border-2 border-[#1a1a1a] dark:border-[#e8e6e3] rounded-sm cursor-pointer transition-all"
        >
          关闭
        </button>
      </div>
      
      <div class="space-y-2 max-h-[160px] overflow-y-auto custom-scrollbar pr-1 pt-1">
        {#each selectedDateEvents as event}
          <a 
            href={`/posts/${event.slug}`}
            class="p-2 text-left bg-[#fbfbf9] dark:bg-[#242220] hover:bg-[#f4efe6] dark:hover:bg-[#2d2b28] border-2 border-[#1a1a1a] dark:border-[#e8e6e3] hover:shadow-none hover:translate-y-[1px] rounded-sm transition-all cursor-pointer group block"
          >
            <h4 class="text-xs font-black text-[#1a1a1a] dark:text-[#e8e6e3] line-clamp-1 group-hover:text-[#9e2a2b] dark:group-hover:text-[#d9534f] transition-colors mb-1 flex items-center gap-1">
              <span class="w-1.5 h-1.5 bg-[#9e2a2b] dark:bg-[#d9534f] rounded-sm inline-block"></span>
              {event.title}
            </h4>
            {#if event.description}
              <p class="text-[10px] text-slate-600 dark:text-slate-400 line-clamp-2 leading-relaxed">
                {event.description}
              </p>
            {/if}
          </a>
        {/each}
      </div>
    </div>
  {:else if selectedDate}
    <div class="mt-4 pt-3 border-t-2 border-dashed border-[#1a1a1a]/20 dark:border-[#e8e6e3]/20 text-center animate-fade-in">
      <div class="flex justify-between items-center mb-2 gap-2">
        <span class="text-[10px] font-black text-[#1a1a1a] dark:text-[#e8e6e3] tracking-wider shrink-0 bg-[#f4efe6] dark:bg-[#242220] px-1.5 py-0.5 border-2 border-[#1a1a1a] dark:border-[#e8e6e3]">
          {formatYMD(selectedDate)}
        </span>
        <button 
          on:click={() => selectedDate = null} 
          class="text-[9px] font-black bg-white dark:bg-[#1c1b1a] text-[#1a1a1a] dark:text-[#e8e6e3] hover:text-[#9e2a2b] dark:hover:text-[#d9534f] px-1 border-2 border-[#1a1a1a] dark:border-[#e8e6e3] shadow-[1px_1px_0px_0px_#1a1a1a] dark:shadow-[1px_1px_0px_0px_#e8e6e3] hover:shadow-none hover:translate-y-[1px] rounded-sm cursor-pointer transition-all"
        >
          关闭
        </button>
      </div>
      <p class="text-[10px] text-slate-400 dark:text-slate-500 font-bold italic py-2">这天没有发布文章哦~</p>
    </div>
  {/if}
</div>
