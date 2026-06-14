(() => {
  const $ = (selector, root = document) => root.querySelector(selector);
  const $$ = (selector, root = document) => [...root.querySelectorAll(selector)];
  const root = document.documentElement;

  const ensureStylesheet = (match, href) => {
    let link = $(`link[href*="${match}"]`);
    if (!link) {
      link = document.createElement('link');
      link.rel = 'stylesheet';
      document.head.appendChild(link);
    }
    if (link.getAttribute('href') !== href) link.setAttribute('href', href);
  };
  ensureStylesheet('mode-toggle.css', 'site/mode-toggle.css?v=20260614-4');
  ensureStylesheet('branding.css', 'site/branding.css?v=20260614-4');
  ensureStylesheet('wordmark.css', 'site/wordmark.css?v=20260614-3');
  ensureStylesheet('sections.css', 'site/sections.css?v=20260614-3');
  ensureStylesheet('brand-fixes.css', 'site/brand-fixes.css?v=20260614-2');
  ensureStylesheet('platform-privacy.css', 'site/platform-privacy.css?v=20260614-4');
  ensureStylesheet('client-calendar-insight.css', 'site/client-calendar-insight.css?v=20260614-1');
  ensureStylesheet('global-icon-fix.css', 'site/global-icon-fix.css?v=20260614-1');

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
      link.innerHTML = '<span class="brand-wordmark" aria-hidden="true"></span>';
    });

    $$('.hero-brand-logo, .final-brand-logo').forEach(element => element.remove());

    const heroCopy = $('.hero-copy');
    if (heroCopy && !$('.hero-wordmark', heroCopy)) {
      const wordmark = document.createElement('div');
      wordmark.className = 'hero-wordmark';
      wordmark.setAttribute('role', 'img');
      wordmark.setAttribute('aria-label', 'TWORK');
      heroCopy.prepend(wordmark);
    }

    const finalCard = $('.final-card');
    if (finalCard && !$('.final-wordmark', finalCard)) {
      const wordmark = document.createElement('div');
      wordmark.className = 'final-wordmark';
      wordmark.setAttribute('role', 'img');
      wordmark.setAttribute('aria-label', 'TWORK');
      const overline = $('.overline', finalCard);
      finalCard.insertBefore(wordmark, overline || finalCard.firstChild);
    }

    const globalCenter = $('.global-center');
    if (globalCenter) {
      globalCenter.innerHTML = '<img src="icon.png" alt="">';
      globalCenter.setAttribute('aria-hidden', 'true');
    }
  };
  applyBranding();

  const setupAndroidInterest = () => {
    const platformCard = $$('.privacy-card')[2];
    if (!platformCard || $('.android-interest', platformCard)) return;

    const interest = document.createElement('div');
    interest.className = 'android-interest';
    interest.innerHTML = '<button class="android-interest-button js-android-interest" type="button">Хочу TWORK для Android</button><small>Сообщим, если появится версия для Android.</small>';
    platformCard.appendChild(interest);
  };
  setupAndroidInterest();

  const setupClientCalendarInsight = () => {
    const panel = $('#calendar-sync');
    if (!panel || panel.dataset.clientInsightReady === 'true') return;
    panel.dataset.clientInsightReady = 'true';

    const copy = $('.essential-copy', panel);
    const title = $('h3', copy);
    const description = copy ? Array.from(copy.children).find(element => element.tagName === 'P') : null;
    const points = $('.essential-points', copy);

    if (title) title.textContent = 'Календарь клиента — не только расписание.';
    if (description) {
      description.textContent = 'Для каждого клиента создаётся отдельный календарь только с его тренировками. В комментарии к событию TWORK показывает актуальную информацию, которую клиент обычно ищет в личном кабинете.';
    }
    if (points) {
      points.innerHTML = '<span>Номер занятия в абонементе: например, 7 из 8</span><span>Предупреждение, когда после тренировки останется 1 или 0 занятий</span><span>Сумма долга, постоянная информация и комментарий тренера</span><span>Текст на языке клиента и синхронизация при переносе или отмене</span>';
    }
    if (copy && !$('.client-calendar-benefit', copy)) {
      const benefit = document.createElement('div');
      benefit.className = 'client-calendar-benefit';
      benefit.innerHTML = '<strong>Клиенту не нужен отдельный личный кабинет</strong><span>Он открывает привычное событие в Apple Calendar и видит время, остаток абонемента, предупреждения и ваши инструкции.</span>';
      copy.appendChild(benefit);
    }

    const personalCard = $('.calendar-card.personal', panel);
    if (personalCard) {
      personalCard.classList.add('client-event-card');
      personalCard.innerHTML = '<div class="calendar-card-head"><b>Календарь Анны</b><small>Только её занятия</small></div><span class="share-badge">Apple Calendar · только просмотр</span><div class="client-event-summary"><time>18 июня · 18:00</time><b>Тренировка с Константином</b><small>Iron Club · 60 минут</small></div><div class="client-event-comment"><div class="client-note-line">Абонемент: 7 из 8.</div><div class="client-note-line warning">После этой тренировки останется: 1.</div><div class="client-note-line debt">Долг: €35.</div><div class="client-note-line">Свяжитесь с тренером, если нужно перенести тренировку.</div><div class="client-note-separator"></div><div class="client-note-extra"><strong>Комментарий тренера</strong>Возьмите полотенце.</div></div><div class="client-event-meta"><span>Язык клиента</span><span>Авто + свой текст</span><span>Обновляется вместе с событием</span></div>';
    }
  };
  setupClientCalendarInsight();

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
  const accessForm = $('form', modal);
  const modalTitle = $('#access-title', modal);
  const modalIntro = $('.modal-intro', modal);
  const modalOverline = $('.access-modal > .overline', modal);
  const submitButton = $('button[type="submit"]', accessForm);
  const subjectField = $('input[name="_subject"]', accessForm);
  const nextField = $('input[name="_next"]', accessForm);

  let platformField = $('input[name="Интересующая платформа"]', accessForm);
  if (accessForm && !platformField) {
    platformField = document.createElement('input');
    platformField.type = 'hidden';
    platformField.name = 'Интересующая платформа';
    accessForm.prepend(platformField);
  }

  const setAccessContext = platform => {
    const android = platform === 'Android';
    if (modalOverline) modalOverline.textContent = android ? 'TWORK для Android' : 'TWORK Early Access';
    if (modalTitle) modalTitle.textContent = android ? 'Сообщить о версии для Android' : 'Запросить ранний доступ';
    if (modalIntro) {
      modalIntro.innerHTML = android
        ? 'Оставьте email — мы сообщим, если появится версия TWORK для Android.'
        : 'Оставьте несколько деталей для раннего доступа к версии TWORK для iPhone. Заявка придёт на <b>twork.crm@gmail.com</b>.';
    }
    if (platformField) platformField.value = android ? 'Android' : 'iOS';
    if (subjectField) subjectField.value = android ? 'Запрос версии TWORK для Android' : 'Новая заявка на ранний доступ TWORK';
    if (nextField) nextField.value = android
      ? 'https://iteaky.github.io/twork-altstore-source/?access=sent&platform=android'
      : 'https://iteaky.github.io/twork-altstore-source/?access=sent&platform=ios';
    if (submitButton) submitButton.textContent = android ? 'Отправить запрос' : 'Отправить заявку';
  };

  const closeModal = () => {
    if (!modal) return;
    modal.classList.remove('open');
    modal.setAttribute('aria-hidden', 'true');
    document.body.classList.remove('modal-open');
  };
  const openModal = (platform = 'iOS') => {
    if (!modal) return;
    setAccessContext(platform);
    modal.classList.add('open');
    modal.setAttribute('aria-hidden', 'false');
    document.body.classList.add('modal-open');
    window.setTimeout(() => $('input[name="Имя"]', modal)?.focus(), 100);
  };
  $$('.js-access').forEach(button => button.addEventListener('click', () => openModal('iOS')));
  $$('.js-android-interest').forEach(button => button.addEventListener('click', () => openModal('Android')));
  $('.access-close')?.addEventListener('click', closeModal);
  modal?.addEventListener('click', event => { if (event.target === modal) closeModal(); });
  document.addEventListener('keydown', event => { if (event.key === 'Escape') closeModal(); });

  const params = new URLSearchParams(location.search);
  if (params.get('access') === 'sent') {
    const toast = $('#success-toast');
    if (toast && params.get('platform') === 'android') {
      toast.textContent = 'Запрос на Android-версию отправлен. Сообщим, если она появится.';
    }
    toast?.classList.add('show');
    history.replaceState({}, '', location.pathname + location.hash);
    window.setTimeout(() => toast?.classList.remove('show'), 6000);
  }
})();
