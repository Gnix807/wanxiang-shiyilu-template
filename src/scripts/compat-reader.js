// ES5 bootstrap: basic reading must survive failed module parsing and storage denial.
// CSS capability detection: https://developer.mozilla.org/en-US/docs/Web/API/CSS/supports_static
(function () {
  if (window.__blogReaderInitialized) return;
  window.__blogReaderInitialized = true;
  var root = document.documentElement;
  var script = document.currentScript || document.querySelector('script[data-reader-stylesheet]');
  var stylesheet = script && script.getAttribute('data-reader-stylesheet');
  var preference = '';
  var timer;
  var reading = false;
  try { preference = localStorage.getItem('blog-reading-mode') || ''; } catch (error) {}
  var match = /(?:^|[?&])reader=(1|0)(?:&|$)/.exec(location.search);
  if (match) {
    preference = match[1] === '1' ? 'compat' : 'standard';
    try { localStorage.setItem('blog-reading-mode', preference); } catch (error) {}
  }

  function needsReader() {
    try {
      return !window.CSS || typeof CSS.registerProperty !== 'function' ||
        !CSS.supports('color', 'revert-layer') ||
        !CSS.supports('color', 'oklch(50% 0.1 0)') ||
        !CSS.supports('color', 'color-mix(in srgb, black, white)') ||
        !('noModule' in document.createElement('script')) ||
        typeof window.fetch !== 'function' || typeof window.Promise !== 'function' ||
        typeof window.AbortController !== 'function' ||
        typeof window.IntersectionObserver !== 'function' ||
        !window.HTMLDialogElement || typeof HTMLDialogElement.prototype.showModal !== 'function';
    } catch (error) { return true; }
  }

  function modeHref(href, value) {
    var anchor = document.createElement('a');
    anchor.href = href;
    var search = anchor.search.replace(/([?&])reader=[^&]*(&|$)/g, '$1').replace(/[?&]$/, '');
    anchor.search = search + (search ? '&' : '?') + 'reader=' + value;
    return anchor.pathname + anchor.search + anchor.hash;
  }

  function setTheme(dark) {
    root.className = root.className.replace(/(^|\s)dark(?=\s|$)/g, '').replace(/^\s+|\s+$/g, '');
    if (dark) root.className += ' dark';
    root.setAttribute('data-theme', dark ? 'dark' : 'light');
    try { localStorage.setItem('theme', dark ? 'dark' : 'light'); } catch (error) {}
    var buttons = document.querySelectorAll('[data-reader-theme]');
    for (var i = 0; i < buttons.length; i++) {
      buttons[i].textContent = dark ? '切换浅色' : '切换深色';
      buttons[i].setAttribute('aria-pressed', dark ? 'true' : 'false');
    }
  }

  function prepareLinks() {
    var links = document.getElementsByTagName('a');
    for (var i = 0; i < links.length; i++) {
      var link = links[i];
      var citationTarget = link.getAttribute('data-target-id');
      // A partially loaded popover may already have removed the source href.
      if (reading && citationTarget && !link.getAttribute('href')) {
        link.setAttribute('href', '#' + citationTarget);
        link.removeAttribute('role'); link.removeAttribute('tabindex');
        link.removeAttribute('aria-haspopup'); link.removeAttribute('aria-expanded');
      }
      if (link.hasAttribute('data-reader-toggle')) {
        link.href = modeHref(location.href, reading ? '0' : '1');
        link.textContent = reading ? '标准阅读' : '兼容阅读';
      }
      if (!reading || !link.getAttribute('href')) continue;
      if (link.protocol !== location.protocol || link.host !== location.host) continue;
      // Astro's documented opt-out keeps reading independent of client routing.
      // https://docs.astro.build/en/guides/view-transitions/#preventing-client-side-navigation
      link.setAttribute('data-astro-reload', '');
      if (link.hasAttribute('data-reader-toggle') || link.getAttribute('href').charAt(0) === '#') continue;
      if (link.pathname === location.pathname && link.hash) continue;
      if (preference === 'compat') link.href = modeHref(link.href, '1');
    }
  }

  function prepareNotes() {
    root.className = root.className.replace(/(^|\s)has-pinned-annotation(?=\s|$)/g, '');
    var notes = document.querySelectorAll('.footnote-anchor[data-sidenote-id]');
    for (var i = 0; i < notes.length; i++) {
      notes[i].className = notes[i].className.replace(/(^|\s)(is-closed|pinned)(?=\s|$)/g, '');
      var card = notes[i].querySelector('.footnote-popover');
      var trigger = notes[i].querySelector('.footnote-trigger');
      if (card) { card.removeAttribute('role'); card.removeAttribute('aria-modal'); }
      if (trigger) {
        trigger.removeAttribute('role'); trigger.removeAttribute('tabindex');
        trigger.removeAttribute('aria-haspopup'); trigger.removeAttribute('aria-expanded');
      }
    }
  }

  function activate(reason) {
    reading = true;
    root.setAttribute('data-reading-mode', 'compat');
    root.setAttribute('data-reading-reason', reason);
    if (stylesheet && !document.getElementById('compat-reader-stylesheet')) {
      var link = document.createElement('link');
      link.id = 'compat-reader-stylesheet'; link.rel = 'stylesheet'; link.href = stylesheet;
      document.head.appendChild(link);
    }
    if (document.body) {
      var event = document.createEvent('Event');
      event.initEvent('blog:reading-mode', false, false);
      document.dispatchEvent(event);
      prepareLinks();
      prepareNotes();
    }
  }

  root.setAttribute('data-reading-mode', 'standard');
  if (preference === 'compat' || (preference !== 'standard' && needsReader())) activate(preference === 'compat' ? 'preference' : 'capabilities');
  try {
    if (reading && localStorage.getItem('theme') === 'dark') {
      root.className += ' dark'; root.setAttribute('data-theme', 'dark');
    }
  } catch (error) {}

  function ready() {
    window.clearTimeout(timer);
    if (reading) {
      activate(root.getAttribute('data-reading-reason') || 'continuation');
      return;
    }
    prepareLinks();
    if (preference === 'standard') return;
    // Fail open when critical enhancements never hydrate (blocked/missing modules).
    timer = window.setTimeout(function () {
      if (document.querySelector('[data-tabs-container]:not([data-tabs-ready="true"]), astro-island[client="load"][ssr]')) activate('enhancement-unavailable');
    }, 6000);
  }
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', ready);
  else ready();
  document.addEventListener('astro:page-load', ready);
  function handleReadingInteraction(event) {
    if (!reading || (event.type === 'keydown' && event.keyCode !== 13)) return;
    var target = event.target;
    while (target && target.nodeType === 1) {
      if (target.hasAttribute('data-reader-theme')) {
        event.preventDefault(); event.stopImmediatePropagation();
        setTheme(!/(^|\s)dark(\s|$)/.test(root.className)); return;
      }
      if (target.hasAttribute('data-sidenote-id')) { event.stopImmediatePropagation(); return; }
      if (target.tagName === 'A' && target.getAttribute('href')) {
        // Preserve native navigation/hash jumps even if an enhancement partially loaded.
        event.stopImmediatePropagation(); return;
      }
      target = target.parentElement;
    }
  }
  document.addEventListener('click', handleReadingInteraction, true);
  document.addEventListener('keydown', handleReadingInteraction, true);
})();
