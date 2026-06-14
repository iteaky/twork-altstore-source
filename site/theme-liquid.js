(() => {
  const root = document.documentElement;
  let toggle = document.querySelector('[data-mode-toggle]');
  if (!toggle) return;

  /* Remove the direct theme handler installed by premium.js. */
  const cleanToggle = toggle.cloneNode(true);
  toggle.replaceWith(cleanToggle);
  toggle = cleanToggle;

  const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
  let running = false;
  let fallbackSwitchTimer = 0;
  let fallbackCleanupTimer = 0;

  const updateToggle = theme => {
    const dark = theme === 'brand-dark';
    toggle.dataset.mode = dark ? 'dark' : 'light';
    toggle.setAttribute('aria-pressed', String(dark));
    toggle.setAttribute('aria-label', dark ? 'Включить светлую тему' : 'Включить тёмную тему');
    toggle.title = dark ? 'Включить светлую тему' : 'Включить тёмную тему';
  };

  const updateThemeColor = () => {
    const meta = document.querySelector('meta[name="theme-color"]');
    if (!meta) return;
    requestAnimationFrame(() => {
      meta.content = getComputedStyle(root).getPropertyValue('--bg').trim();
    });
  };

  const applyTheme = theme => {
    root.dataset.theme = theme;
    localStorage.setItem('twork-theme', theme);
    updateToggle(theme);
    updateThemeColor();
  };

  const setTransitionOrigin = () => {
    const rect = toggle.getBoundingClientRect();
    const x = rect.left + rect.width / 2;
    const y = rect.top + rect.height / 2;
    const viewportWidth = window.visualViewport?.width || window.innerWidth;
    const viewportHeight = window.visualViewport?.height || window.innerHeight;
    const radius = Math.hypot(
      Math.max(x, viewportWidth - x),
      Math.max(y, viewportHeight - y)
    ) + 110;

    root.style.setProperty('--liquid-x', `${Math.round(x)}px`);
    root.style.setProperty('--liquid-y', `${Math.round(y)}px`);
    root.style.setProperty('--liquid-radius', `${Math.ceil(radius)}px`);
  };

  const finish = () => {
    window.clearTimeout(fallbackSwitchTimer);
    window.clearTimeout(fallbackCleanupTimer);
    document.querySelector('.theme-liquid-fallback')?.remove();
    root.classList.remove('theme-liquid-transitioning', 'theme-liquid-snapshotting');
    toggle.classList.remove('liquid-switching');
    toggle.disabled = false;
    toggle.removeAttribute('aria-busy');
    running = false;
  };

  const runFallback = targetTheme => {
    const veil = document.createElement('div');
    veil.className = 'theme-liquid-fallback';
    veil.setAttribute('aria-hidden', 'true');
    document.body.appendChild(veil);
    requestAnimationFrame(() => veil.classList.add('is-running'));

    fallbackSwitchTimer = window.setTimeout(() => applyTheme(targetTheme), 465);
    fallbackCleanupTimer = window.setTimeout(finish, 1080);
  };

  const run = () => {
    if (running) return;

    const currentTheme = root.dataset.theme === 'brand-dark' ? 'brand-dark' : 'brand-light';
    const targetTheme = currentTheme === 'brand-dark' ? 'brand-light' : 'brand-dark';

    if (reduceMotion.matches) {
      applyTheme(targetTheme);
      return;
    }

    running = true;
    toggle.disabled = true;
    toggle.setAttribute('aria-busy', 'true');
    toggle.classList.add('liquid-switching');
    root.classList.add('theme-liquid-transitioning');
    setTransitionOrigin();

    if (typeof document.startViewTransition !== 'function') {
      runFallback(targetTheme);
      return;
    }

    /* Disable ordinary CSS transitions while the browser captures the final
       target palette. The new theme then reveals continuously from the toggle. */
    root.classList.add('theme-liquid-snapshotting');

    const transition = document.startViewTransition(() => {
      applyTheme(targetTheme);
    });

    transition.ready
      .then(() => root.classList.remove('theme-liquid-snapshotting'))
      .catch(() => root.classList.remove('theme-liquid-snapshotting'));

    transition.finished
      .then(finish)
      .catch(finish);
  };

  updateToggle(root.dataset.theme === 'brand-dark' ? 'brand-dark' : 'brand-light');
  toggle.addEventListener('click', run);
})();
