<script lang="ts">
  import { onMount } from 'svelte';
  import { onPageReady } from '../scripts/lifecycle';

  // Delegate intent events so links added after hydration work without rescans.
  onMount(() => onPageReady(() => {
    const controller = new AbortController();
    const attempted = new Set<string>();
    const queued = new Set<string>();
    let inflight = 0;
    let hoverTimer: number | undefined;

    function concurrency() {
      const connection = (navigator as Navigator & {
        connection?: { saveData?: boolean; effectiveType?: string };
      }).connection;
      if (!navigator.onLine || connection?.saveData || /^(slow-)?2g$/.test(connection?.effectiveType || '')) return 0;
      return connection?.effectiveType === '3g' ? 1 : 2;
    }

    function drain() {
      if (controller.signal.aborted) return;
      for (const url of queued) {
        if (inflight >= concurrency()) break;
        queued.delete(url);
        inflight++;
        void fetch(url, {
          credentials: 'same-origin',
          priority: 'low',
          signal: controller.signal,
        } as RequestInit)
          .then(response => response.ok ? response.arrayBuffer() : undefined)
          .catch(() => { /* A failed speculative request must not affect a real click. */ })
          .finally(() => { inflight--; drain(); });
      }
    }

    function queue(link: HTMLAnchorElement) {
      if (controller.signal.aborted || concurrency() === 0 || link.hasAttribute('download') || link.target === '_blank') return;
      try {
        const url = new URL(link.href, location.href);
        if (url.origin !== location.origin || url.hash || url.href === location.href || attempted.has(url.href)) return;
        attempted.add(url.href);
        queued.add(url.href);
        drain();
      } catch { /* Ignore malformed or non-HTTP links. */ }
    }

    function targetLink(event: Event) {
      if (!(event.target instanceof Element)) return null;
      return event.target.closest<HTMLAnchorElement>('[data-prefetch] a[href]');
    }

    function onHover(event: PointerEvent) {
      if (event.pointerType !== 'mouse') return;
      const link = targetLink(event);
      if (!link || (event.relatedTarget instanceof Node && link.contains(event.relatedTarget))) return;
      window.clearTimeout(hoverTimer);
      hoverTimer = window.setTimeout(() => queue(link), 80);
    }

    function cancelHover(event: PointerEvent) {
      const link = targetLink(event);
      if (link && !(event.relatedTarget instanceof Node && link.contains(event.relatedTarget))) window.clearTimeout(hoverTimer);
    }

    function onIntent(event: Event) {
      const link = targetLink(event);
      if (link) queue(link);
    }

    const options = { passive: true, signal: controller.signal };
    document.addEventListener('pointerover', onHover, options);
    document.addEventListener('pointerout', cancelHover, options);
    document.addEventListener('focusin', onIntent, options);
    document.addEventListener('touchstart', onIntent, options);

    return () => {
      controller.abort();
      window.clearTimeout(hoverTimer);
      queued.clear();
    };
  }));
</script>

<!-- no visible UI; only prefetches marked links after user intent -->
