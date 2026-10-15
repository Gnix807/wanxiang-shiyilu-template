import { onPageReady } from './lifecycle';

function setupSearch() {
  const index = document.getElementById('editorial-search-index');
  if (!index) return;
  const searchItems = JSON.parse(index.textContent || '[]');
  const controller = new AbortController();
  const timers = new Set();
  function later(callback, delay) {
    const timer = setTimeout(() => { timers.delete(timer); callback(); }, delay);
    timers.add(timer);
    return timer;
  }

  const dialog = document.getElementById('editorial-search-dialog');
  const input = document.getElementById('editorial-search-input');
  const resultsList = document.getElementById('search-results-list');
  const emptyState = document.getElementById('search-empty-state');
  const closeBtn = document.getElementById('search-close-btn');
  const clearBtn = document.getElementById('search-clear-btn');
  const filterChips = document.getElementById('search-filter-chips');
  const statsEl = document.getElementById('search-footer-stats');

  let activeIndex = -1;
  let currentResults = [];
  let selectedCategory = '全部';
  let isClosing = false;

  function openSearch() {
    if (!dialog || dialog.open) return;
    isClosing = false;
    dialog.classList.remove('modal-closing');
    dialog.showModal();
    document.body.style.overflow = 'hidden';

    // 触发平滑进场动画
    requestAnimationFrame(() => {
      dialog.classList.add('modal-open');
    });

    input.value = '';
    clearBtn?.classList.add('hidden');
    selectedCategory = '全部';
    updateActiveFilterChip();
    performSearch('');
    later(() => input?.focus(), 60);
  }

  function closeSearch() {
    if (!dialog || !dialog.open || isClosing) return;
    isClosing = true;
    dialog.classList.remove('modal-open');
    dialog.classList.add('modal-closing');

    // 待平滑出场动画完成后再调用原生 close
    later(() => {
      dialog.close();
      dialog.classList.remove('modal-closing');
      document.body.style.overflow = '';
      isClosing = false;
    }, 180);
  }

  function escapeHtml(str) {
    if (!str) return '';
    return String(str)
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;');
  }

  function highlightMatch(text, query) {
    if (!text) return '';
    const safeText = escapeHtml(text);
    if (!query || !query.trim()) return safeText;
    const cleanQ = query.trim();
    try {
      const escapedQ = cleanQ.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
      const regex = new RegExp(`(${escapedQ})`, 'gi');
      return safeText.replace(regex, '<mark class="search-highlight">$1</mark>');
    } catch {
      return safeText;
    }
  }

  function updateActiveFilterChip() {
    if (!filterChips) return;
    const chips = filterChips.querySelectorAll('.filter-chip');
    chips.forEach((chip) => {
      if (chip.getAttribute('data-category') === selectedCategory) {
        chip.classList.add('active');
      } else {
        chip.classList.remove('active');
      }
    });
  }

  function performSearch(query) {
    const q = (query || '').trim().toLowerCase();
    let filtered = searchItems;

    if (selectedCategory && selectedCategory !== '全部') {
      filtered = filtered.filter((i) => i.category === selectedCategory);
    }

    if (q) {
      filtered = filtered.filter((item) => {
        return (
          item.keywords.includes(q) ||
          item.title.toLowerCase().includes(q) ||
          item.subtitle.toLowerCase().includes(q)
        );
      });
    }

    const isInitial = !q && selectedCategory === '全部';
    const headerTitle = isInitial
      ? '最新归档与精选推荐'
      : `检索结果 (${filtered.length} 条)`;

    renderResults(isInitial ? filtered.slice(0, 7) : filtered, headerTitle, q);
  }

  function renderResults(items, headerText = '', query = '') {
    currentResults = items || [];
    activeIndex = currentResults.length > 0 ? 0 : -1;

    if (!items || items.length === 0) {
      resultsList.innerHTML = '';
      if (emptyState) {
        emptyState.classList.remove('hidden');
        const emptyTitle = emptyState.querySelector('.empty-title');
        const emptyDesc = emptyState.querySelector('.empty-desc');
        if (query) {
          if (emptyTitle) emptyTitle.textContent = `未检索到与「${query}」匹配的内容`;
          if (emptyDesc) emptyDesc.textContent = '尝试更换检索词，或点击上方分类快速浏览';
        } else {
          if (emptyTitle) emptyTitle.textContent = '该分类下暂无归档记录';
          if (emptyDesc) emptyDesc.textContent = '点击上方其他分类标签查看更多内容';
        }
      }
      if (statsEl) statsEl.innerHTML = `未找到匹配记录`;
      return;
    }

    emptyState?.classList.add('hidden');
    if (statsEl) statsEl.innerHTML = `匹配 <span class="font-bold text-[#9e2a2b] dark:text-[#d9534f]">${items.length}</span> 条归档`;

    let html = '';
    if (headerText) {
      html += `<div class="results-header-title font-mono"><span class="header-dot"></span>${escapeHtml(headerText)}</div>`;
    }

    items.forEach((item, idx) => {
      const isSelected = idx === activeIndex ? ' selected' : '';
      const isTalk = item.type === 'talk';
      const badgeClass = isTalk ? 'badge-talk' : 'badge-post';

      html += `
        <a href="${item.url}" class="search-result-card${isSelected}" data-index="${idx}" role="option">
          <div class="card-main-content">
            <div class="card-meta-row font-mono">
              <span class="card-type-badge ${badgeClass}">${item.typeLabel}</span>
              <span class="card-cat-pill">${escapeHtml(item.category)}</span>
              ${item.date ? `<span class="card-date">${escapeHtml(item.date)}</span>` : ''}
            </div>
            <div class="card-title font-serif">
              ${highlightMatch(item.title, query)}
            </div>
            ${item.subtitle ? `
              <div class="card-desc font-sans">
                ${highlightMatch(item.subtitle, query)}
              </div>
            ` : ''}
          </div>
          <div class="card-enter-badge font-mono" aria-hidden="true">
            <span>打开</span>
            <svg class="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
              <polyline points="9 18 15 12 9 6"></polyline>
            </svg>
          </div>
        </a>
      `;
    });

    resultsList.innerHTML = html;
  }

  function updateSelection() {
    const items = resultsList.querySelectorAll('.search-result-card');
    items.forEach((el, idx) => {
      if (idx === activeIndex) {
        el.classList.add('selected');
        el.scrollIntoView({ block: 'nearest', behavior: 'smooth' });
      } else {
        el.classList.remove('selected');
      }
    });
  }

  // 输入监听
  if (input) {
    input.addEventListener('input', (e) => {
      const val = e.target.value;
      if (val) {
        clearBtn?.classList.remove('hidden');
      } else {
        clearBtn?.classList.add('hidden');
      }
      performSearch(val);
    });

    input.addEventListener('keydown', (e) => {
      if (e.key === 'ArrowDown') {
        e.preventDefault();
        if (currentResults.length > 0) {
          activeIndex = (activeIndex + 1) % currentResults.length;
          updateSelection();
        }
      } else if (e.key === 'ArrowUp') {
        e.preventDefault();
        if (currentResults.length > 0) {
          activeIndex = (activeIndex - 1 + currentResults.length) % currentResults.length;
          updateSelection();
        }
      } else if (e.key === 'Enter') {
        e.preventDefault();
        if (activeIndex >= 0 && currentResults[activeIndex]) {
          window.location.href = currentResults[activeIndex].url;
        }
      }
    });
  }

  // 清空按钮
  if (clearBtn) {
    clearBtn.addEventListener('click', () => {
      input.value = '';
      clearBtn.classList.add('hidden');
      input.focus();
      performSearch('');
    });
  }

  // 分类筛选 Chip 点击
  if (filterChips) {
    filterChips.addEventListener('click', (e) => {
      const chip = e.target.closest('.filter-chip');
      if (!chip) return;
      selectedCategory = chip.getAttribute('data-category') || '全部';
      updateActiveFilterChip();
      performSearch(input.value);
    });
  }

  // 鼠标悬停列表卡片时同步 activeIndex
  if (resultsList) {
    resultsList.addEventListener('mouseover', (e) => {
      const card = e.target.closest('.search-result-card');
      if (!card) return;
      const idx = Number(card.getAttribute('data-index'));
      if (!isNaN(idx) && idx !== activeIndex) {
        activeIndex = idx;
        const items = resultsList.querySelectorAll('.search-result-card');
        items.forEach((el, i) => el.classList.toggle('selected', i === activeIndex));
      }
    });
  }

  // 原生 ESC 拦截与平滑退出
  if (dialog) {
    dialog.addEventListener('cancel', (e) => {
      e.preventDefault();
      closeSearch();
    });

    // 点击蒙层关闭
    dialog.addEventListener('click', (e) => {
      if (e.target === dialog) {
        closeSearch();
      }
    });
  }

  if (closeBtn) {
    closeBtn.addEventListener('click', closeSearch);
  }

  // 全局快捷键 Cmd+K / Ctrl+K 监听
  window.addEventListener('keydown', (e) => {
    if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'k') {
      e.preventDefault();
      if (dialog && dialog.open) {
        closeSearch();
      } else {
        openSearch();
      }
    }
  }, { signal: controller.signal });

  // 挂载全局调用方法供 NavBar 等组件直接调用
  window.openGlobalSearch = openSearch;
  window.closeGlobalSearch = closeSearch;

  return () => {
    controller.abort();
    timers.forEach(clearTimeout);
    if (dialog?.open) dialog.close();
    document.body.style.overflow = '';
    if (window.openGlobalSearch === openSearch) delete window.openGlobalSearch;
    if (window.closeGlobalSearch === closeSearch) delete window.closeGlobalSearch;
  };
}

onPageReady(setupSearch);
