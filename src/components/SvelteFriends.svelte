<script lang="ts">
  import { onMount } from "svelte";
  import { friendsConfig, type Friend } from "../config/friends";
  import { siteConfig } from "../config/site";

  let searchTerm = "";
  let copied = false;
  let shuffled: Friend[] = [];

  onMount(() => {
    shuffled = [...friendsConfig].sort(() => Math.random() - 0.5);
  });

  $: filteredFriends = searchTerm.trim() === "" 
    ? shuffled 
    : shuffled.filter(f => 
        (f.name || "").toLowerCase().includes(searchTerm.toLowerCase()) ||
        (f.description || "").toLowerCase().includes(searchTerm.toLowerCase()) ||
        (f.url || "").toLowerCase().includes(searchTerm.toLowerCase())
      );

  let copiedLabel = "";

  function copyText(text: string, label: string) {
    navigator.clipboard.writeText(text);
    copied = true;
    copiedLabel = label;
    setTimeout(() => { copied = false; copiedLabel = ""; }, 2000);
  }

  function copyTemplate() {
    const text = `=== 友链申请信息 ===\n名称: ${siteConfig.title}\n链接: ${siteConfig.url}\n头像: ${siteConfig.avatar}\n介绍: ${siteConfig.subtitle || siteConfig.description}\n====================`;
    copyText(text, "全部");
  }

  // Fallback unique avatars gradient builder based on name hashes
  const presets = [
    "from-rose-400 to-amber-300",
    "from-sky-400 to-emerald-300",
    "from-violet-400 to-fuchsia-300",
    "from-teal-400 to-lime-300",
    "from-amber-400 to-orange-400"
  ];
  
  function getGradient(name: string) {
    const sum = name.split("").reduce((acc, char) => acc + char.charCodeAt(0), 0);
    return presets[sum % presets.length];
  }

  let imgErrors = new Set<string>();

  function handleImgError(name: string) {
    imgErrors.add(name);
    imgErrors = imgErrors; // trigger Svelte reactivity update
  }
</script>

<div class="flex flex-col lg:flex-row gap-6 lg:gap-8 items-start w-full">
  <!-- Left Column Profile Sidebar Card -->
  <div class="hidden lg:flex w-[260px] shrink-0 flex-col gap-6 sticky top-[100px] select-none">
     <div class="bg-white dark:bg-[#1c1b1a] border-4 border-[#1a1a1a] dark:border-[#e8e6e3] p-5 shadow-[6px_6px_0px_0px_#1a1a1a] dark:shadow-[6px_6px_0px_0px_#e8e6e3] rounded-sm transform -rotate-1">
        <div class="flex items-center justify-center mb-4">
            <div class="w-16 h-16 rounded-sm bg-[#9e2a2b] border-3 border-[#1a1a1a] dark:border-[#e8e6e3] shadow-[3px_3px_0px_0px_#1a1a1a] dark:shadow-[3px_3px_0px_0px_#e8e6e3] overflow-hidden flex items-center justify-center" style="width:64px;height:64px">
              <img src={siteConfig.avatar} alt={siteConfig.author} class="w-full h-full object-cover" style="width:100%;height:100%;object-fit:cover" />
            </div>
         </div>
         <h1 class="text-base font-black text-[#1a1a1a] dark:text-[#e8e6e3] text-center tracking-wider mb-1">{siteConfig.author}</h1>
         <div class="h-0 border-b-2 border-dashed border-[#1a1a1a]/20 dark:border-[#e8e6e3]/20 my-2 w-4/5 mx-auto"></div>
         
         <div class="text-xs font-bold text-slate-600 dark:text-slate-300 text-center mb-3 leading-relaxed">
            {siteConfig.description}
         </div>
     </div>
  </div>

  <!-- Main content pane -->
  <div class="flex-1 min-w-0 w-full space-y-6 sm:space-y-8">
    <div class="bg-white dark:bg-[#1c1b1a] border-4 border-[#1a1a1a] dark:border-[#e8e6e3] p-4 sm:p-6 md:p-8 shadow-[8px_8px_0px_0px_#1a1a1a] dark:shadow-[8px_8px_0px_0px_#e8e6e3] rounded-sm">
      <!-- Title bar header -->
      <div class="border-b-4 border-[#1a1a1a] dark:border-[#e8e6e3] pb-6 mb-6 md:mb-8 text-center md:text-left flex flex-col md:flex-row justify-between items-center gap-4">
        <div>
          <h1 class="text-xl sm:text-2xl md:text-3xl font-black text-[#1a1a1a] dark:text-[#e8e6e3] mb-3 leading-tight uppercase font-sans">Friends 友情链接</h1>
          <div class="flex flex-wrap items-center gap-2.5 sm:gap-4 justify-center md:justify-start">
            <span class="text-slate-600 dark:text-slate-300 font-bold font-mono text-xs bg-[#f4efe6] dark:bg-[#242220] px-3 py-0.5 border border-[#1a1a1a]/20 dark:border-[#e8e6e3]/20 rounded-sm">那些人，那些事</span>
            <span class="text-[10px] sm:text-xs font-mono font-bold text-[#9e2a2b] dark:text-[#d9534f] bg-[#f4efe6] dark:bg-[#242220] px-2 py-0.5 border border-[#9e2a2b]/30 rounded-sm">
              共计 {friendsConfig.length} 位好友
            </span>
            {#if friendsConfig.length > 0}
              <span class="text-[10px] sm:text-xs font-mono font-bold text-emerald-700 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/30 px-2 py-0.5 border border-emerald-400/40 rounded-sm">
                随机排序 (:
              </span>
            {:else}
              <span class="text-[10px] sm:text-xs font-mono font-bold text-amber-700 dark:text-amber-400 bg-amber-50 dark:bg-amber-950/30 px-2 py-0.5 border border-amber-400/40 rounded-sm">
                虚位以待 ✨
              </span>
            {/if}
          </div>
        </div>

        {#if friendsConfig.length > 0}
          <!-- Dynamic Client-side Search and Filter Bar -->
          <div class="relative max-w-full md:max-w-xs w-full shrink-0">
            <input
              type="text"
              name="q"
              placeholder="搜索好友、博客名称..."
              bind:value={searchTerm}
              toolparamdescription="搜索关键词，支持按好友昵称或博客名称进行模糊匹配"
              class="w-full pl-9 pr-4 py-2 text-xs sm:text-sm font-bold bg-[#fbfbf9] dark:bg-[#242220] text-[#1a1a1a] dark:text-[#e8e6e3] border-3 border-[#1a1a1a] dark:border-[#e8e6e3] rounded-sm focus:outline-none focus:bg-white dark:focus:bg-[#1c1b1a] focus:shadow-[2px_2px_0px_0px_#1a1a1a] dark:focus:shadow-[2px_2px_0px_0px_#e8e6e3] transition-all placeholder-slate-400"
            />
            <svg xmlns="http://www.w3.org/2000/svg" class="absolute left-3 top-2.5 w-4 h-4 text-slate-400 stroke-[3]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
          </div>
        {/if}
      </div>

      <!-- Friends Card grid -->
      <div class="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4 sm:gap-5">
        {#each filteredFriends as friend (friend.url)}
          <a
            href={friend.url}
            target="_blank"
            rel="noopener noreferrer"
            class="group bg-[#fbfbf9] dark:bg-[#242220] border-4 border-[#1a1a1a] dark:border-[#e8e6e3] p-3 sm:p-4 shadow-[5px_5px_0px_0px_#1a1a1a] dark:shadow-[5px_5px_0px_0px_#e8e6e3] hover:shadow-[7px_7px_0px_0px_#9e2a2b] hover:border-[#9e2a2b] hover:-translate-x-1 hover:-translate-y-1 rounded-sm flex items-start gap-3 transition-all duration-300 select-none cursor-pointer"
            id={`friend-${friend.name.replace(/\s+/g, '-').toLowerCase()}`}
          >
            {#if imgErrors.has(friend.name) || !friend.avatar}
              <div class="w-10 h-10 rounded-full border-3 border-[#1a1a1a] dark:border-[#e8e6e3] bg-gradient-to-br {getGradient(friend.name)} flex items-center justify-center text-white font-black text-base shadow-[2px_2px_0px_0px_#1a1a1a] dark:shadow-[2px_2px_0px_0px_#e8e6e3] select-none shrink-0 uppercase" style="width:40px;height:40px">
                {friend.name.charAt(0)}
              </div>
            {:else}
              <div class="relative shrink-0 select-none" style="width:40px;height:40px">
                <img
                  src={friend.avatar}
                  alt={friend.name}
                  width="40"
                  height="40"
                  loading="lazy"
                  decoding="async"
                  referrerpolicy="no-referrer"
                  on:error={() => handleImgError(friend.name)}
                  class="rounded-full border-3 border-[#1a1a1a] dark:border-[#e8e6e3] object-cover bg-white shadow-[2px_2px_0px_0px_#1a1a1a] dark:shadow-[2px_2px_0px_0px_#e8e6e3]"
                  style="width:40px;height:40px;object-fit:cover"
                />
                <div class="absolute inset-0 rounded-full border border-black/10 pointer-events-none" />
              </div>
            {/if}

            <div class="flex-1 min-w-0 flex flex-col justify-between h-full pt-0.5">
              <div>
                <h3 class="font-extrabold text-sm sm:text-base text-slate-800 dark:text-slate-100 tracking-wide group-hover:text-[#9e2a2b] dark:group-hover:text-[#d9534f] transition-colors truncate">
                  {friend.name}
                </h3>
                <p class="text-[10px] sm:text-xs text-slate-400 font-bold font-mono tracking-wider truncate mt-0.5 flex items-center gap-1">
                  <svg xmlns="http://www.w3.org/2000/svg" class="w-3.5 h-3.5 text-[#9e2a2b] dark:text-[#d9534f] stroke-[2.5]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" d="M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9a9 9 0 01-9-9m9 9c1.657 0 3-4.03 3-9s-1.343-9-3-9m0 18c-1.657 0-3-4.03-3-9s1.343-9 3-9m-9 9a9 9 0 019-9" />
                  </svg>
                  <span>{friend.url.replace(/^https?:\/\/(www\.)?/, "")}</span>
                </p>
                <p class="text-xs text-slate-500 dark:text-slate-400 font-medium line-clamp-2 mt-2 leading-relaxed h-[36px]">
                  {friend.description || "这位好友很神秘，暂时没有简介~"}
                </p>
              </div>

              {#if friend.issue_id}
                <div class="mt-2.5 inline-flex items-center gap-1 text-[9px] font-bold text-emerald-700 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/30 border border-emerald-300 dark:border-emerald-800 px-1.5 py-0.5 rounded-sm w-fit select-none">
                  GitHub Issue #{friend.issue_id}
                </div>
              {/if}
            </div>
          </a>
        {/each}

        {#if filteredFriends.length === 0}
          <div class="col-span-full bg-white dark:bg-[#1c1b1a] border-4 border-[#1a1a1a] dark:border-[#e8e6e3] p-10 text-center shadow-[4px_4px_0px_0px_#1a1a1a] dark:shadow-[4px_4px_0px_0px_#e8e6e3]">
            <p class="font-black text-[#1a1a1a] dark:text-[#e8e6e3] text-sm">
              {friendsConfig.length === 0 ? "暂无友情链接，虚位以待 ✨ 欢迎在下方申请交换~" : "没有筛选到任何符合条件的好友哦"}
            </p>
            {#if searchTerm.trim()}
              <button
                on:click={() => searchTerm = ""}
                class="mt-3 px-4 py-1.5 font-bold border-2 border-[#1a1a1a] dark:border-[#e8e6e3] bg-[#f4efe6] dark:bg-[#242220] text-[#1a1a1a] dark:text-[#e8e6e3] hover:bg-[#9e2a2b] hover:text-white transition-all text-xs rounded-sm shadow-[2px_2px_0px_0px_#1a1a1a] dark:shadow-[2px_2px_0px_0px_#e8e6e3] cursor-pointer"
              >
                清除搜索条件
              </button>
            {/if}
          </div>
        {/if}
      </div>
    </div>

    <!-- Application segment -->
    <div class="bg-white dark:bg-[#1c1b1a] border-4 border-[#1a1a1a] dark:border-[#e8e6e3] p-5 sm:p-6 shadow-[8px_8px_0px_0px_#1a1a1a] dark:shadow-[8px_8px_0px_0px_#e8e6e3] rounded-sm relative">
      <div class="flex items-center gap-2 mb-4 select-none">
        <div class="p-1 px-2.5 bg-[#f4efe6] dark:bg-[#242220] border-2 border-[#1a1a1a] dark:border-[#e8e6e3] text-[#1a1a1a] dark:text-[#e8e6e3] text-xs font-black rounded-sm transform -rotate-2 shadow-[1.5px_1.5px_0px_0px_#1a1a1a] dark:shadow-[1.5px_1.5px_0px_0px_#e8e6e3]">
          APPLICATION
        </div>
        <h3 class="text-base sm:text-lg font-black text-[#1a1a1a] dark:text-[#e8e6e3] tracking-wider">
          交换友情链接
        </h3>
      </div>

      <div class="grid grid-cols-1 md:grid-cols-2 gap-6 items-start font-mono text-xs sm:text-sm">
        <!-- Rules -->
        <div class="space-y-3 font-semibold text-slate-700 dark:text-slate-300 leading-relaxed">
          <p>
            欢迎同人、技术、设计、ACG、自媒体等各类健康有特色的独立博客相互串链。
          </p>
          <div class="border-l-4 border-[#9e2a2b] pl-3 py-1 space-y-1 bg-[#f4efe6] dark:bg-[#242220] rounded-r-md">
            <span class="font-bold text-[#9e2a2b] dark:text-[#d9534f] flex items-center gap-1.5">
              <svg class="w-3.5 h-3.5 stroke-[2.5]" viewBox="0 0 24 24" fill="none" stroke="currentColor"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg>
              <span>交换要求</span>
            </span>
            <ul class="list-disc pl-4 text-xs font-medium space-y-1">
              <li>全站 HTTPS 加密访问</li>
              <li>内容健康、经常更新、拥有独立域名</li>
              <li>请先将本站添加为友情链接后再发送申请</li>
            </ul>
          </div>
          <p class="text-xs text-slate-400">
            添加完毕后，可以通过下方 GitHub Issue 快速申请，或发邮件联系：
            <a href={`mailto:${siteConfig.socials.email}`} class="text-[#9e2a2b] dark:text-[#d9534f] hover:underline font-bold ml-1">
              {siteConfig.socials.email}
            </a>
          </p>
          <a 
            href={`${siteConfig.socials.github}/blog/issues/new?template=friend-request.yml`} 
            target="_blank" 
            rel="noopener noreferrer"
            class="inline-flex items-center gap-1.5 px-4 py-2 bg-[#9e2a2b] text-white font-black text-xs rounded-sm border-2 border-[#1a1a1a] dark:border-[#e8e6e3] shadow-[2px_2px_0px_0px_#1a1a1a] dark:shadow-[2px_2px_0px_0px_#e8e6e3] hover:bg-[#852324] transition-all cursor-pointer"
          >
            <svg class="w-3.5 h-3.5 stroke-[2.5]" viewBox="0 0 24 24" fill="none" stroke="currentColor"><path d="M5 12h14"/><path d="m12 5 7 7-7 7"/></svg>
            <span>快速申请友情链接</span>
          </a>
        </div>

        <!-- Form elements to copy -->
        <div class="bg-[#fbfbf9] dark:bg-[#242220] border-3 border-dashed border-[#1a1a1a]/30 dark:border-[#e8e6e3]/30 p-4 rounded-sm relative">
          <span class="absolute -top-3 right-4 bg-white dark:bg-[#1c1b1a] border-2 border-[#1a1a1a] dark:border-[#e8e6e3] px-2 py-0.5 text-[9px] text-[#1a1a1a] dark:text-[#e8e6e3] font-bold shadow-[1px_1px_0px_0px_#1a1a1a] dark:shadow-[1px_1px_0px_0px_#e8e6e3] select-none">
            本站信息 INFO
          </span>
          
          <ul class="space-y-1.5 text-xs text-slate-600 dark:text-slate-300 list-none leading-loose">
            <li on:click={() => copyText(siteConfig.title, "站点名称")} class="cursor-pointer hover:bg-slate-100 dark:hover:bg-slate-800 rounded-sm px-1 -mx-1 transition-colors">
              <strong class="text-slate-800 dark:text-slate-100">站点名称：</strong> {siteConfig.title}
            </li>
            <li on:click={() => copyText(siteConfig.url, "站点域名")} class="cursor-pointer hover:bg-slate-100 dark:hover:bg-slate-800 rounded-sm px-1 -mx-1 transition-colors">
              <strong class="text-slate-800 dark:text-slate-100">站点域名：</strong> {siteConfig.url}
            </li>
            <li on:click={() => copyText(siteConfig.avatar, "站点头像")} class="cursor-pointer hover:bg-slate-100 dark:hover:bg-slate-800 rounded-sm px-1 -mx-1 transition-colors">
              <strong class="text-slate-800 dark:text-slate-100">站点头像：</strong> {siteConfig.avatar}
            </li>
            <li on:click={() => copyText(siteConfig.subtitle || siteConfig.description, "站点简介")} class="cursor-pointer hover:bg-slate-100 dark:hover:bg-slate-800 rounded-sm px-1 -mx-1 transition-colors">
              <strong class="text-slate-800 dark:text-slate-100">站点简介：</strong> {siteConfig.subtitle || siteConfig.description}
            </li>
          </ul>

          <div class="flex items-center gap-2 mt-4">
            <button
              on:click={copyTemplate}
              class="flex-1 py-2 bg-[#9e2a2b] text-white border-3 border-[#1a1a1a] dark:border-[#e8e6e3] hover:bg-[#852324] transition-all cursor-pointer font-black rounded-sm shadow-[3px_3px_0px_0px_#1a1a1a] dark:shadow-[3px_3px_0px_0px_#e8e6e3] flex items-center justify-center gap-1.5 uppercase text-xs hover:translate-x-0.5 hover:translate-y-0.5 hover:shadow-none"
            >
              <svg xmlns="http://www.w3.org/2000/svg" class="w-4 h-4 stroke-[3]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" d="M12 4v16m8-8H4" />
              </svg>
              <span>复制全部</span>
            </button>
            {#if copied}
              <span class="text-[10px] font-black text-emerald-600 dark:text-emerald-400 shrink-0 animate-pulse">已复制 {copiedLabel}</span>
            {/if}
          </div>
        </div>
      </div>
    </div>

    <!-- Waline comments placeholder (handled in Astro page) -->
    <div id="waline-placeholder"></div>
  </div>
</div>
