(() => {
  const root = document.documentElement;
  let toggle = document.querySelector('[data-mode-toggle]');
  if (!toggle) return;

  /* Remove the ordinary click handler installed by premium.js. */
  const cleanToggle = toggle.cloneNode(true);
  toggle.replaceWith(cleanToggle);
  toggle = cleanToggle;

  const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
  const mobile = window.matchMedia('(max-width: 680px)');
  let running = false;
  let switchTimer = 0;
  let cleanupTimer = 0;

  const duration = () => mobile.matches ? 2050 : 1900;

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

  const createFlight = targetTheme => {
    const flight = document.createElement('div');
    flight.className = `theme-liquid-flight ${targetTheme === 'brand-dark' ? 'to-dark' : 'to-light'}`;
    flight.setAttribute('aria-hidden', 'true');
    flight.innerHTML = `
      <div class="theme-liquid-lens">
        <div class="theme-liquid-tint"></div>
        <div class="theme-liquid-caustic a"></div>
        <div class="theme-liquid-caustic b"></div>
        <div class="theme-liquid-specular"></div>
      </div>
      <div class="theme-liquid-ripple"></div>`;
    return flight;
  };

  const clearTimers = () => {
    window.clearTimeout(switchTimer);
    window.clearTimeout(cleanupTimer);
  };

  const finish = flight => {
    clearTimers();
    flight?.remove();
    toggle.classList.remove('liquid-switching');
    toggle.disabled = false;
    toggle.removeAttribute('aria-busy');
    root.removeAttribute('data-theme-flight');
    running = false;
  };

  const positionFlight = () => {
    const rect = toggle.getBoundingClientRect();
    const x = rect.left + rect.width / 2;
    const y = rect.top + rect.height / 2;
    const viewportWidth = window.visualViewport?.width || window.innerWidth;
    const viewportHeight = window.visualViewport?.height || window.innerHeight;
    const radius = Math.hypot(
      Math.max(x, viewportWidth - x),
      Math.max(y, viewportHeight - y)
    ) + 96;

    root.style.setProperty('--liquid-x', `${Math.round(x)}px`);
    root.style.setProperty('--liquid-y', `${Math.round(y)}px`);
    root.style.setProperty('--liquid-diameter', `${Math.ceil(radius * 2)}px`);
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
    root.dataset.themeFlight = targetTheme === 'brand-dark' ? 'to-dark' : 'to-light';

    positionFlight();
    const flight = createFlight(targetTheme);
    document.body.appendChild(flight);

    requestAnimationFrame(() => {
      requestAnimationFrame(() => flight.classList.add('is-running'));
    });

    const total = duration();
    switchTimer = window.setTimeout(() => applyTheme(targetTheme), Math.round(total * .515));
    cleanupTimer = window.setTimeout(() => finish(flight), total + 140);

    const lens = flight.querySelector('.theme-liquid-lens');
    lens?.addEventListener('animationend', () => finish(flight), { once:true });
  };

  updateToggle(root.dataset.theme === 'brand-dark' ? 'brand-dark' : 'brand-light');
  toggle.addEventListener('click', run);
})();
