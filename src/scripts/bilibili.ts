export interface BiliVideoData {
  time: number;
  title: string;
  pic: string;
  desc: string;
  author: string;
  duration: string;
  views: string;
  danmaku?: string;
}

const CACHE_PREFIX = 'bili_cache_v1_';
const REFRESH_AFTER = 60 * 60 * 1000;
const CACHE_MAX_AGE = 7 * 24 * REFRESH_AFTER;
const memoryCache = new Map<string, BiliVideoData>();
const pending = new Map<string, RequestJob>();
const queue: RequestJob[] = [];
let activeRequests = 0;
let callbackId = 0;

interface RequestJob {
  promise: Promise<BiliVideoData>;
  users: number;
  done: boolean;
  start: () => void;
  cancel: () => void;
}

function validBvid(bvid: string): boolean {
  return /^BV[a-zA-Z0-9]{10}$/.test(bvid);
}

export function readBiliCache(bvid: string, maxAge = CACHE_MAX_AGE): BiliVideoData | null {
  try {
    const item = memoryCache.get(bvid) ?? JSON.parse(localStorage.getItem(CACHE_PREFIX + bvid) || 'null');
    const age = Date.now() - item?.time;
    if (!item || !Number.isFinite(item.time) || age < 0 || age >= maxAge) return null;
    if (!['title', 'pic', 'desc', 'author', 'duration', 'views'].every(key => typeof item[key] === 'string')) return null;
    memoryCache.set(bvid, item);
    return item;
  } catch {
    return null;
  }
}

function formatCount(value: number): string {
  return value >= 10000 ? `${(value / 10000).toFixed(1)}万` : String(value);
}

function normalizeVideo(data: any): BiliVideoData {
  if (!data || typeof data.title !== 'string' || !data.stat || !Number.isFinite(data.stat.view)) {
    throw new Error('Invalid Bilibili video data');
  }
  const seconds = Number.isFinite(data.duration) ? Math.max(0, Math.floor(data.duration)) : 0;
  const rawDesc = typeof data.desc === 'string' ? data.desc.trim() : '';
  const desc = rawDesc.split('\n').map(line => line.trim()).find(line => line && !/^(☆|By|Title|Date|—|http|【)/.test(line)) || rawDesc;
  let pic = typeof data.pic === 'string' ? data.pic.replace(/^(?:http:)?\/\//, 'https://') : '';
  if (!pic.startsWith('https://')) pic = '';
  return {
    time: Date.now(), title: data.title, pic, desc: desc.slice(0, 120),
    author: typeof data.owner?.name === 'string' ? data.owner.name : '',
    duration: `${Math.floor(seconds / 60)}:${String(seconds % 60).padStart(2, '0')}`,
    views: formatCount(data.stat.view),
    danmaku: Number.isFinite(data.stat.danmaku) ? String(data.stat.danmaku) : '',
  };
}

function drainQueue() {
  while (activeRequests < 2 && queue.length) {
    const job = queue.shift()!;
    if (!job.done) job.start();
  }
}

function createRequest(bvid: string): RequestJob {
  let resolve: (item: BiliVideoData) => void;
  let reject: (reason: Error) => void;
  const promise = new Promise<BiliVideoData>((res, rej) => { resolve = res; reject = rej; });
  let script: HTMLScriptElement | undefined;
  let frame: HTMLIFrameElement | undefined;
  let timer: ReturnType<typeof setTimeout> | undefined;
  let started = false;
  const callbackName = `bili_cb_${++callbackId}_${Math.random().toString(36).slice(2)}`;
  let callbacks: Record<string, unknown> | undefined;

  function finish(error?: Error, item?: BiliVideoData) {
    if (job.done) return;
    job.done = true;
    clearTimeout(timer);
    script?.remove();
    frame?.remove();
    if (callbacks) delete callbacks[callbackName];
    if (pending.get(bvid) === job) pending.delete(bvid);
    if (started) activeRequests--;
    if (error) reject(error); else resolve(item!);
    queueMicrotask(drainQueue);
  }

  const job: RequestJob = {
    promise, users: 0, done: false,
    cancel: () => finish(new DOMException('Page left', 'AbortError')),
    start() {
      started = true;
      activeRequests++;
      // Removing a script alone does not stop late JSONP execution. A disposable
      // same-origin blank frame gives the request its own cancellable JS context.
      frame = document.createElement('iframe');
      frame.hidden = true;
      frame.setAttribute('aria-hidden', 'true');
      document.body.appendChild(frame);
      const frameDocument = frame.contentDocument;
      if (!frame.contentWindow || !frameDocument) {
        finish(new Error('Bilibili request frame unavailable'));
        return;
      }
      callbacks = frame.contentWindow as unknown as Record<string, unknown>;
      script = frameDocument.createElement('script');
      timer = setTimeout(() => finish(new Error('Bilibili request timed out')), 5000);
      callbacks[callbackName] = (response: any) => {
        try {
          if (response?.code !== 0) throw new Error('Bilibili API unavailable');
          const item = normalizeVideo(response.data);
          memoryCache.set(bvid, item);
          try { localStorage.setItem(CACHE_PREFIX + bvid, JSON.stringify(item)); } catch { /* Memory cache still works. */ }
          finish(undefined, item);
        } catch (error) { finish(error instanceof Error ? error : new Error('Invalid Bilibili response')); }
      };
      script.onerror = () => finish(new Error('Bilibili request failed'));
      script.src = `https://api.bilibili.com/x/web-interface/view?bvid=${encodeURIComponent(bvid)}&jsonp=jsonp&callback=${callbackName}`;
      frameDocument.head.appendChild(script);
    },
  };
  return job;
}

/** Same BV shares one request; leaving the last consumer cancels queued and active work. */
export function loadBiliVideo(bvid: string, signal: AbortSignal): Promise<BiliVideoData> {
  if (signal.aborted) return Promise.reject(new DOMException('Page left', 'AbortError'));
  if (!validBvid(bvid)) return Promise.reject(new Error('Invalid BV identifier'));
  const cached = readBiliCache(bvid, REFRESH_AFTER);
  if (cached) return Promise.resolve(cached);
  let job = pending.get(bvid);
  if (!job) {
    job = createRequest(bvid);
    pending.set(bvid, job);
    queue.push(job);
  }
  const request = job;
  request.users++;
  const result = new Promise<BiliVideoData>((resolve, reject) => {
    let released = false;
    function release() {
      if (released) return;
      released = true;
      signal.removeEventListener('abort', abort);
      if (--request.users === 0 && !request.done) request.cancel();
    }
    function abort() { release(); reject(new DOMException('Page left', 'AbortError')); }
    signal.addEventListener('abort', abort, { once: true });
    request.promise.then(item => { release(); resolve(item); }, error => { release(); reject(error); });
  });
  drainQueue();
  return result;
}

export function applyBiliData(card: HTMLElement, item: BiliVideoData) {
  const preserved = new Set((card.dataset.biliPreserve || '').split(','));
  const setText = (field: string, text: string) => {
    const element = card.querySelector<HTMLElement>(`[data-bili-${field}]`);
    if (preserved.has(field) || !text || !element) return;
    element.textContent = text;
    element.style.display = '';
  };
  setText('title', item.title);
  setText('desc', item.desc);
  setText('duration', item.duration);
  setText('views', `· ${item.views}播放`);
  setText('danmaku', item.danmaku ? `· ${item.danmaku}弹幕` : '');
  const author = card.querySelector<HTMLElement>('[data-bili-author]');
  if (!preserved.has('author') && item.author && author) {
    const name = document.createElement('strong');
    name.textContent = item.author;
    author.replaceChildren(card.dataset.biliAuthorPrefix || 'UP主：', name);
    author.style.display = '';
  }
  const cover = card.querySelector<HTMLImageElement>('[data-bili-cover]');
  if (!preserved.has('cover') && item.pic && cover) {
    if (cover.getAttribute('src') !== item.pic) cover.src = item.pic;
    if (!preserved.has('title')) cover.alt = item.title;
    cover.classList.remove('is-loading');
    card.classList.add('has-cover');
  }
  const meta = card.querySelector<HTMLElement>('[data-bili-meta-row]');
  if (meta) meta.style.display = '';
  card.dataset.needsFetch = 'false';
}

/** Cached text is immediate; remote refresh waits until the card approaches the viewport. */
export function observeBiliVideos(cards: HTMLElement[], update: (card: HTMLElement, data: BiliVideoData) => void): () => void {
  const controller = new AbortController();
  let observer: IntersectionObserver | undefined;
  const refresh = async (card: HTMLElement) => {
    observer?.unobserve(card);
    try {
      const item = await loadBiliVideo(card.dataset.bvid || '', controller.signal);
      if (!controller.signal.aborted && card.isConnected) update(card, item);
    } catch { /* Keep the static or stale cached content on network failure. */ }
    finally {
      if (!controller.signal.aborted) card.querySelector('[data-bili-cover]')?.classList.remove('is-loading');
    }
  };
  if (typeof IntersectionObserver !== 'undefined') {
    observer = new IntersectionObserver(entries => {
      for (const entry of entries) if (entry.isIntersecting) void refresh(entry.target as HTMLElement);
    }, { rootMargin: '200px 0px' });
  }
  for (const card of cards) {
    const cached = readBiliCache(card.dataset.bvid || '');
    if (cached) update(card, cached);
    if (observer) observer.observe(card); else void refresh(card);
  }
  return () => { observer?.disconnect(); controller.abort(); };
}
