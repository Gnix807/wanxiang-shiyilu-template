export type Dispose = () => void;

/** One mount per body; ClientRouter replaces it on navigation. */
export function onPageReady(setup: () => void | Dispose): Dispose {
  let mountedBody: HTMLElement | null = null;
  let dispose: void | Dispose;

  function unmount() {
    if (typeof dispose === 'function') dispose();
    dispose = undefined;
    mountedBody = null;
  }

  function mount() {
    if (!document.body || mountedBody === document.body) return;
    unmount();
    mountedBody = document.body;
    dispose = setup();
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', mount, { once: true });
  } else {
    mount();
  }
  document.addEventListener('astro:page-load', mount);
  document.addEventListener('astro:before-swap', unmount);

  return () => {
    unmount();
    document.removeEventListener('DOMContentLoaded', mount);
    document.removeEventListener('astro:page-load', mount);
    document.removeEventListener('astro:before-swap', unmount);
  };
}
