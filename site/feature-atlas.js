(() => {
  const start = () => {
    const grid = document.getElementById('atlas-grid');
    const search = document.getElementById('feature-search');
    const resultCount = document.getElementById('feature-result-count');
    const empty = document.getElementById('atlas-empty');
    const expand = document.getElementById('atlas-expand');
    if (!grid || !search || !resultCount || !empty || !expand) return;

    const areaLabels = {
      work: 'Клиенты и продукты',
      schedule: 'Расписание',
      money: 'Деньги',
      automation: 'Автоматизация',
      system: 'Настройки и данные'
    };
    let activeArea = 'all';

    const normalize = value => String(value || '')
      .toLocaleLowerCase('ru-RU')
      .replace(/ё/g, 'е')
      .trim();

    const escapeHtml = value => String(value)
      .replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;').replace(/'/g, '&#039;');

    const render = data => {
      const modules = data.modules || [];
      grid.innerHTML = modules.map((module, index) => {
        const features = (module.features || []).map(feature => {
          const title = feature[0] || '';
          const description = feature[1] || '';
          const searchable = normalize(`${title} ${description}`);
          return `<li class="atlas-feature" data-feature-search="${escapeHtml(searchable)}"><span>✓</span><p><strong>${escapeHtml(title)}</strong> — ${escapeHtml(description)}</p></li>`;
        }).join('');
        const searchableModule = normalize(`${module.title} ${module.description}`);
        return `<details class="atlas-module" data-area="${escapeHtml(module.area)}" data-module-search="${escapeHtml(searchableModule)}" ${index < 2 ? 'open' : ''}>
          <summary>
            <i class="atlas-icon">${escapeHtml(module.icon)}</i>
            <span class="atlas-summary-copy"><small>${String(index + 1).padStart(2, '0')} · ${escapeHtml(areaLabels[module.area] || '')}</small><strong>${escapeHtml(module.title)}</strong><em>${escapeHtml(module.description)}</em></span>
            <b class="atlas-count">${(module.features || []).length} функций</b>
            <u class="atlas-chevron">⌄</u>
          </summary>
          <ul class="atlas-feature-list">${features}</ul>
        </details>`;
      }).join('');
      applyFilters();
    };

    const applyFilters = () => {
      const query = normalize(search.value);
      let visibleFeatures = 0;
      let visibleModules = 0;
      grid.querySelectorAll('.atlas-module').forEach(module => {
        const areaMatches = activeArea === 'all' || module.dataset.area === activeArea;
        const moduleMatches = !query || (module.dataset.moduleSearch || '').includes(query);
        let moduleFeatureCount = 0;
        module.querySelectorAll('.atlas-feature').forEach(feature => {
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
      empty.hidden = visibleModules !== 0;
    };

    document.querySelectorAll('[data-atlas-filter]').forEach(button => {
      button.addEventListener('click', () => {
        activeArea = button.dataset.atlasFilter || 'all';
        document.querySelectorAll('[data-atlas-filter]').forEach(item => item.classList.toggle('active', item === button));
        applyFilters();
      });
    });

    search.addEventListener('input', applyFilters);
    search.addEventListener('search', applyFilters);

    expand.addEventListener('click', () => {
      const visible = [...grid.querySelectorAll('.atlas-module:not([hidden])')];
      const shouldOpen = visible.some(module => !module.open);
      visible.forEach(module => { module.open = shouldOpen; });
      expand.textContent = shouldOpen ? 'Свернуть все' : 'Развернуть все';
    });

    fetch('site/feature-catalog.json?v=v509-full')
      .then(response => {
        if (!response.ok) throw new Error(`HTTP ${response.status}`);
        return response.json();
      })
      .then(render)
      .catch(() => {
        grid.innerHTML = '<div class="atlas-loading">Не удалось загрузить каталог функций. Обновите страницу.</div>';
        resultCount.textContent = '—';
      });
  };

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', start, { once: true });
  } else {
    start();
  }
})();
