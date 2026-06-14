(() => {
  const root = document.documentElement;
  let toggle = document.querySelector('[data-mode-toggle]');
  if (!toggle) return;

  /* premium.js already attached a direct click handler. Clone the control so the
     cinematic controller becomes the single source of truth for theme changes. */
  const cleanToggle = toggle.cloneNode(true);
  toggle.replaceWith(cleanToggle);
  toggle = cleanToggle;

  const motionQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
  const duration = 1180;
  const switchAt = 535;
  let running = false;
  let cleanupTimer = 0;

  const updateToggle = theme => {
    const dark = theme === 'brand-dark';
    toggle.dataset.mode = dark ? 'dark' : 'light';
    toggle.setAttribute('aria-pressed', String(dark));
    toggle.setAttribute('aria-label', dark ? 'Включить дневной режим' : 'Включить ночной режим');
    toggle.title = dark ? 'Восход — включить дневной режим' : 'Закат — включить ночной режим';
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

  const createStars = () => {
    const positions = [
      [8,14,2,0],[18,28,3,65],[29,11,2,125],[41,24,2,30],[54,12,3,105],
      [66,31,2,10],[79,16,2,145],[91,27,3,75],[13,46,2,155],[25,38,2,40],
      [37,51,3,115],[49,39,2,20],[61,48,2,165],[73,42,3,90],[86,53,2,50],
      [95,38,2,135],[6,68,3,85],[19,61,2,15],[34,72,2,150],[47,64,3,60],
      [58,76,2,120],[71,66,2,35],[82,74,3,170],[93,63,2,100]
    ];
    return positions.map(([x,y,size,delay], index) => {
      const opacity = .48 + (index % 5) * .1;
      return `<span style="--star-x:${x}%;--star-y:${y}%;--star-size:${size}px;--star-delay:${delay}ms;--star-opacity:${opacity}"></span>`;
    }).join('');
  };

  const createOverlay = targetTheme => {
    const overlay = document.createElement('div');
    const toDark = targetTheme === 'brand-dark';
    overlay.className = `theme-cinematic-overlay ${toDark ? 'theme-to-dark' : 'theme-to-light'}`;
    overlay.setAttribute('aria-hidden', 'true');
    overlay.innerHTML = `
      <div class="theme-cinematic-haze"></div>
      <div class="theme-cinematic-stars">${createStars()}</div>
      <div class="theme-cinematic-orb theme-cinematic-sun"></div>
      <div class="theme-cinematic-orb theme-cinematic-moon"></div>
      <div class="theme-cinematic-glint"></div>`;
    return overlay;
  };

  const finish = overlay => {
    window.clearTimeout(cleanupTimer);
    overlay?.remove();
    root.classList.remove('theme-cinematic-active');
    root.removeAttribute('data-theme-flight');
    toggle.classList.remove('theme-switching');
    toggle.disabled = false;
    toggle.removeAttribute('aria-busy');
    running = false;
  };

  const runTransition = () => {
    if (running) return;

    const currentTheme = root.dataset.theme === 'brand-dark' ? 'brand-dark' : 'brand-light';
    const targetTheme = currentTheme === 'brand-dark' ? 'brand-light' : 'brand-dark';

    if (motionQuery.matches) {
      applyTheme(targetTheme);
      return;
    }

    running = true;
    toggle.disabled = true;
    toggle.setAttribute('aria-busy', 'true');
    toggle.classList.add('theme-switching');
    root.classList.add('theme-cinematic-active');
    root.dataset.themeFlight = targetTheme === 'brand-dark' ? 'sunset' : 'sunrise';

    const rect = toggle.getBoundingClientRect();
    const x = Math.round(rect.left + rect.width / 2);
    const y = Math.round(rect.top + rect.height / 2);
    const radius = Math.ceil(Math.hypot(Math.max(x, innerWidth - x), Math.max(y, innerHeight - y)) + 80);
    root.style.setProperty('--theme-cinematic-x', `${x}px`);
    root.style.setProperty('--theme-cinematic-y', `${y}px`);
    root.style.setProperty('--theme-cinematic-radius', `${radius}px`);

    const overlay = createOverlay(targetTheme);
    document.body.appendChild(overlay);
    requestAnimationFrame(() => overlay.classList.add('is-running'));

    window.setTimeout(() => applyTheme(targetTheme), switchAt);
    cleanupTimer = window.setTimeout(() => finish(overlay), duration + 90);
    overlay.addEventListener('animationend', event => {
      if (event.target === overlay) finish(overlay);
    }, { once:true });
  };

  updateToggle(root.dataset.theme === 'brand-dark' ? 'brand-dark' : 'brand-light');
  toggle.addEventListener('click', runTransition);
})();
