(() => {
  const $ = (selector, root = document) => root.querySelector(selector);
  const $$ = (selector, root = document) => [...root.querySelectorAll(selector)];
  const root = document.documentElement;

  const ensureStylesheet = (match, href) => {
    if ($(`link[href*="${match}"]`)) return;
    const link = document.createElement('link');
    link.rel = 'stylesheet';
    link.href = href;
    document.head.appendChild(link);
  };
  ensureStylesheet('mode-toggle.css', 'site/mode-toggle.css?v=20260614-3');
  ensureStylesheet('branding.css', 'site/branding.css?v=20260614-2');

  const setImportantStyles = (element, styles) => {
    if (!element) return;
    Object.entries(styles).forEach(([property, value]) => element.style.setProperty(property, value, 'important'));
  };

  const oldPicker = $('.theme-picker');
  if (oldPicker) {
    const toggle = document.createElement('button');
    toggle.type = 'button';
    toggle.className = 'mode-toggle';
    toggle.dataset.modeToggle = '';
    toggle.innerHTML = '<span class="mode-toggle-icon mode-toggle-sun" aria-hidden="true">☀︎</span><span class="mode-toggle-icon mode-toggle-moon" aria-hidden="true">☾</span><span class="mode-toggle-thumb" aria-hidden="true"></span>';
    oldPicker.replaceWith(toggle);
  }
  $('.themes-section')?.remove();

  const applyBranding = () => {
    $$('.brand').forEach(link => {
      link.innerHTML = '<img class="brand-logo-image" src="icon.png" alt=""><span class="sr-only">TWORK</span>';
      setImportantStyles(link, {
        'display': 'inline-flex',
        'align-items': 'center',
        'flex': '0 0 auto',
        'width': 'auto',
        'min-width': '36px',
        'height': '40px',
        'overflow': 'visible'
      });
      const image = $('.brand-logo-image', link);
      setImportantStyles(image, {
        'display': 'block',
        'width': '36px',
        'min-width': '36px',
        'max-width': '36px',
        'height': '36px',
        'min-height': '36px',
        'max-height': '36px',
        'object-fit': 'contain'
      });
    });

    const heroCopy = $('.hero-copy');
    if (heroCopy && !$('.hero-brand-logo', heroCopy)) {
      const logo = document.createElement('div');
      logo.className = 'hero-brand-logo';
      logo.setAttribute('aria-hidden', 'true');
      logo.innerHTML = '<img src="icon.png" alt="">';
      heroCopy.prepend(logo);
    }
    const heroLogo = $('.hero-brand-logo', heroCopy || document);
    setImportantStyles(heroLogo, {
      'display': 'grid',
      'place-items': 'center',
      'width': '92px',
      'min-width': '92px',
      'max-width': '92px',
      'height': '92px',
      'min-height': '92px',
      'max-height': '92px',
      'margin': '0 auto 26px',
      'overflow': 'hidden'
    });
    setImportantStyles($('img', heroLogo || document), {
      'display': 'block',
      'width': '72px',
      'min-width': '72px',
      'max-width': '72px',
      'height': '72px',
      'min-height': '72px',
      'max-height': '72px',
      'object-fit': 'contain'
    });

    const finalCard = $('.final-card');
    if (finalCard && !$('.final-brand-logo', finalCard)) {
      const logo = document.createElement('div');
      logo.className = 'final-brand-logo';
      logo.setAttribute('aria-hidden', 'true');
      logo.innerHTML = '<img src="icon.png" alt="">';
      const overline = $('.overline', finalCard);
      finalCard.insertBefore(logo, overline || finalCard.firstChild);
    }
    const finalLogo = $('.final-brand-logo', finalCard || document);
    setImportantStyles(finalLogo, {
      'display': 'grid',
      'place-items': 'center',
      'width': '82px',
      'min-width': '82px',
      'max-width': '82px',
      'height': '82px',
      'min-height': '82px',
      'max-height': '82px',
      'margin': '0 auto 24px',
      'overflow': 'hidden'
    });
    setImportantStyles($('img', finalLogo || document), {
      'display': 'block',
      'width': '64px',
      'min-width': '64px',
      'max-width': '64px',
      'height': '64px',
      'min-height': '64px',
      'max-height': '64px',
      'object-fit': 'contain'
    });
  };
  applyBranding();

  const legacyThemes = { rose: 'brand-light', tiffany: 'brand-dark', classic: 'brand-light', 'classic-light': 'brand-light', 'classic-dark': 'brand-dark' };
  const updateModeButton = theme => {
    const toggle = $('[data-mode-toggle]');
    if (!toggle) return;
    const dark = theme === 'brand-dark';
    toggle.dataset.mode = dark ? 'dark' : 'light';
    toggle.setAttribute('aria-pressed', String(dark));
    toggle.setAttribute('aria-label', dark ? 'Включить дневной режим' : 'Включить ночной режим');
    toggle.title = dark ? 'Дневной режим' : 'Ночной режим';
  };
  const setTheme = (theme, remember = true) => {
    const next = theme === 'brand-dark' ? 'brand-dark' : 'brand-light';
    root.dataset.theme = next;
    if (remember) localStorage.setItem('twork-theme', next);
    updateModeButton(next);
    const meta = $('meta[name="theme-color"]');
    if (meta) meta.content = getComputedStyle(root).getPropertyValue('--bg').trim();
  };
  const savedTheme = localStorage.getItem('twork-theme');
  const normalizedSavedTheme = legacyThemes[savedTheme] || savedTheme;
  const systemTheme = window.matchMedia?.('(prefers-color-scheme: dark)').matches ? 'brand-dark' : 'brand-light';
  setTheme(normalizedSavedTheme === 'brand-dark' || normalizedSavedTheme === 'brand-light' ? normalizedSavedTheme : systemTheme, Boolean(savedTheme));
  $('[data-mode-toggle]')?.addEventListener('click', () => setTheme(root.dataset.theme === 'brand-dark' ? 'brand-light' : 'brand-dark'));

  const revealObserver = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        revealObserver.unobserve(entry.target);
      }
    });
  }, { threshold: .12 });
  $$('.reveal').forEach(element => revealObserver.observe(element));

  const calendar = $('#hero-calendar');
  if (calendar && !calendar.children.length) {
    const counts = { 1: 2, 3: 1, 5: 3, 8: 2, 10: 4, 12: 1, 14: 4, 16: 2, 18: 3, 20: 1, 23: 2, 25: 5, 27: 2, 29: 1 };
    for (let day = 1; day <= 35; day += 1) {
      const number = day <= 30 ? day : day - 30;
      const cell = document.createElement('span');
      cell.className = `mini-day${day === 14 ? ' selected' : ''}`;
      cell.textContent = String(number);
      if (counts[number] && day <= 30) {
        const badge = document.createElement('b');
        badge.textContent = String(counts[number]);
        cell.appendChild(badge);
      }
      if ([5, 6, 18, 19, 20, 27].includes(day)) cell.appendChild(document.createElement('i'));
      calendar.appendChild(cell);
    }
  }

  const modal = $('#access-modal');
  const closeModal = () => {
    if (!modal) return;
    modal.classList.remove('open');
    modal.setAttribute('aria-hidden', 'true');
    document.body.classList.remove('modal-open');
  };
  const openModal = () => {
    if (!modal) return;
    modal.classList.add('open');
    modal.setAttribute('aria-hidden', 'false');
    document.body.classList.add('modal-open');
    window.setTimeout(() => $('input[name="Имя"]', modal)?.focus(), 100);
  };
  $$('.js-access').forEach(button => button.addEventListener('click', openModal));
  $('.access-close')?.addEventListener('click', closeModal);
  modal?.addEventListener('click', event => { if (event.target === modal) closeModal(); });
  document.addEventListener('keydown', event => { if (event.key === 'Escape') closeModal(); });

  const params = new URLSearchParams(location.search);
  if (params.get('access') === 'sent') {
    const toast = $('#success-toast');
    toast?.classList.add('show');
    history.replaceState({}, '', location.pathname + location.hash);
    window.setTimeout(() => toast?.classList.remove('show'), 6000);
  }
})();
