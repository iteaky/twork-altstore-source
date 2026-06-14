(() => {
  const $ = (selector, root = document) => root.querySelector(selector);
  const $$ = (selector, root = document) => [...root.querySelectorAll(selector)];
  const root = document.documentElement;
  const allowedThemes = ['classic-light', 'classic-dark', 'brand-light', 'brand-dark'];
  const legacyThemes = { rose: 'brand-light', tiffany: 'brand-dark', classic: 'classic-light' };

  const setTheme = theme => {
    const next = allowedThemes.includes(theme) ? theme : 'brand-light';
    root.dataset.theme = next;
    localStorage.setItem('twork-theme', next);
    $$('[data-theme-set]').forEach(button => button.classList.toggle('active', button.dataset.themeSet === next));
    const meta = $('meta[name="theme-color"]');
    if (meta) meta.content = getComputedStyle(root).getPropertyValue('--bg').trim();
  };

  let storedTheme = localStorage.getItem('twork-theme') || 'brand-light';
  storedTheme = legacyThemes[storedTheme] || storedTheme;
  setTheme(storedTheme);
  $$('[data-theme-set]').forEach(button => button.addEventListener('click', () => setTheme(button.dataset.themeSet)));
  $$('[data-theme-preview]').forEach(button => button.addEventListener('click', () => {
    setTheme(button.dataset.themePreview);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }));

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
  if (calendar) {
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

  const sceneSteps = $$('.story-step');
  const sceneScreens = $$('.story-screen');
  const setScene = scene => {
    sceneSteps.forEach(step => step.classList.toggle('active', step.dataset.scene === scene));
    sceneScreens.forEach(screen => { screen.hidden = !screen.classList.contains(`scene-${scene}`); });
  };
  if (sceneSteps.length) {
    const sceneObserver = new IntersectionObserver(entries => {
      const visible = entries.filter(entry => entry.isIntersecting).sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0];
      if (visible) setScene(visible.target.dataset.scene);
    }, { rootMargin: '-30% 0px -42% 0px', threshold: [0, .2, .5, .8] });
    sceneSteps.forEach(step => sceneObserver.observe(step));
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

  const grid = $('#atlas-grid');
  const search = $('#feature-search');
  const resultCount = $('#feature-result-count');
  const empty = $('#atlas-empty');
  const expand = $('#atlas-expand');
  let activeArea = 'all';
  const areaLabels = { work: 'Клиенты и продукты', schedule: 'Расписание', money: 'Деньги', automation: 'Автоматизация', system: 'Настройки и данные' };
  const normalize = value => String(value || '').toLocaleLowerCase('ru-RU').replace(/ё/g, 'е').trim();
  const escapeHtml = value => String(value).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;').replace(/'/g, '&#039;');

  const applyFilters = () => {
    if (!grid || !search || !resultCount || !empty) return;
    const query = normalize(search.value);
    let visibleFeatures = 0;
    let visibleModules = 0;
    $$('.atlas-module', grid).forEach(module => {
      const areaMatches = activeArea === 'all' || module.dataset.area === activeArea;
      const moduleMatches = !query || (module.dataset.moduleSearch || '').includes(query);
      let moduleFeatureCount = 0;
      $$('.atlas-feature', module).forEach(feature => {
        const featureMatches = !query || moduleMatches || (feature.dataset.featureSearch || '').includes(query);
        const visible = areaMatches && featureMatches;
        feature.hidden = !visible;
        if (visible) moduleFeatureCount += 1;
      });
      const moduleVisible = areaMatches && moduleFeatureCount > 0;
      module.hidden = !moduleVisible;
      if (moduleVisible) {
        visibleModules += 1;
        visibleFeatures += moduleFeatureCount;
        if (query) module.open = true;
      }
    });
    resultCount.textContent = String(visibleFeatures);
    empty.hidden = visibleModules > 0;
  };

  const renderCatalog = modules => {
    if (!grid) return;
    grid.innerHTML = modules.map((module, index) => {
      const features = (module.features || []).map(feature => {
        const title = feature[0] || '';
        const description = feature[1] || '';
        return `<li class="atlas-feature" data-feature-search="${escapeHtml(normalize(`${title} ${description}`))}"><span>✓</span><p><strong>${escapeHtml(title)}</strong> — ${escapeHtml(description)}</p></li>`;
      }).join('');
      return `<details class="atlas-module" data-area="${escapeHtml(module.area)}" data-module-search="${escapeHtml(normalize(`${module.title} ${module.description}`))}" ${index < 2 ? 'open' : ''}><summary><i class="atlas-icon">${escapeHtml(module.icon)}</i><span class="atlas-summary-copy"><small>${String(index + 1).padStart(2, '0')} · ${escapeHtml(areaLabels[module.area] || '')}</small><strong>${escapeHtml(module.title)}</strong><em>${escapeHtml(module.description)}</em></span><b class="atlas-count">${(module.features || []).length} функций</b><u class="atlas-chevron">⌄</u></summary><ul class="atlas-feature-list">${features}</ul></details>`;
    }).join('');
    const total = modules.reduce((sum, module) => sum + (module.features || []).length, 0);
    $('#catalog-total').textContent = String(total);
    resultCount.textContent = String(total);
    applyFilters();
  };

  if (grid) {
    fetch('site/feature-catalog.json?v=v509-full')
      .then(response => { if (!response.ok) throw new Error(String(response.status)); return response.json(); })
      .then(manifest => Promise.all((manifest.parts || []).map(part => fetch(`site/feature-catalog-${part}.json?v=v509-full`).then(response => { if (!response.ok) throw new Error(String(response.status)); return response.json(); }))))
      .then(parts => renderCatalog(parts.flatMap(part => part.modules || [])))
      .catch(() => { grid.innerHTML = '<div class="atlas-loading">Не удалось загрузить каталог. Обновите страницу.</div>'; resultCount.textContent = '—'; });
  }
  $$('[data-atlas-filter]').forEach(button => button.addEventListener('click', () => {
    activeArea = button.dataset.atlasFilter || 'all';
    $$('[data-atlas-filter]').forEach(item => item.classList.toggle('active', item === button));
    applyFilters();
  }));
  search?.addEventListener('input', applyFilters);
  search?.addEventListener('search', applyFilters);
  expand?.addEventListener('click', () => {
    const visibleModules = $$('.atlas-module:not([hidden])', grid);
    const shouldOpen = visibleModules.some(module => !module.open);
    visibleModules.forEach(module => { module.open = shouldOpen; });
    expand.textContent = shouldOpen ? 'Свернуть все' : 'Развернуть все';
  });
})();
