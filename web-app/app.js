(() => {
  const $ = (selector, root = document) => root.querySelector(selector);
  const $$ = (selector, root = document) => [...root.querySelectorAll(selector)];
  const storageKey = 'twork-web-state-v1';

  const defaults = {
    theme: 'light',
    activeView: 'home',
    selectedDate: '2026-06-14',
    period: 'month',
    clientFilter: 'all',
    clients: [
      { id: 1, name: 'Анна Ковалёва', type: 'Персональная', club: 'Iron Club', currency: 'EUR', balance: 120, remaining: 6, next: '18 июня · 18:00', initials: 'АК' },
      { id: 2, name: 'Mark Evans', type: 'Онлайн', club: 'Лондон · GMT+1', currency: 'GBP', balance: -35, remaining: 3, next: '15 июня · 10:00', initials: 'ME' },
      { id: 3, name: 'Диана Садыкова', type: 'Онлайн', club: 'Алматы · GMT+5', currency: 'KZT', balance: 18000, remaining: 8, next: '17 июня · 09:00', initials: 'ДС' },
      { id: 4, name: 'Максим Орлов', type: 'Сплит', club: 'TWORK Studio', currency: 'EUR', balance: 0, remaining: 2, next: '14 июня · 10:00', initials: 'МО' },
      { id: 5, name: 'Елена Миронова', type: 'Персональная', club: 'Без клуба', currency: 'EUR', balance: -70, remaining: 0, next: 'Нет записи', initials: 'ЕМ' },
      { id: 6, name: 'Олег Петров', type: 'Групповая', club: 'TWORK Studio', currency: 'EUR', balance: 80, remaining: 4, next: '16 июня · 19:30', initials: 'ОП' }
    ],
    trainings: [
      { id: 1, date: '2026-06-14', time: '10:00', title: 'Сплит-тренировка', client: 'Максим и Олег', location: 'TWORK Studio', type: 'training', status: 'Оплачено' },
      { id: 2, date: '2026-06-14', time: '15:00', title: 'Дежурство', client: 'Iron Club', location: 'до 18:00', type: 'duty', status: '€60' },
      { id: 3, date: '2026-06-14', time: '18:00', title: 'Персональная', client: 'Анна Ковалёва', location: 'Iron Club', type: 'training', status: 'Абонемент' },
      { id: 4, date: '2026-06-15', time: '10:00', title: 'Онлайн · Лондон', client: 'Mark Evans', location: '09:00 по клиенту', type: 'training', status: '£45' },
      { id: 5, date: '2026-06-16', time: '19:30', title: 'Групповая', client: 'TWORK Studio', location: '6 участников', type: 'event', status: '€90' },
      { id: 6, date: '2026-06-18', time: '18:00', title: 'Персональная', client: 'Анна Ковалёва', location: '7 из 8', type: 'training', status: 'Абонемент' },
      { id: 7, date: '2026-06-20', time: '12:00', title: 'Дежурство', client: 'Iron Club', location: 'до 17:00', type: 'duty', status: '€100' }
    ],
    settings: { notifications: true, clubs: true, calendarSync: true, iCloud: true }
  };

  let state = loadState();
  const nav = [
    ['home', '⌂', 'Главная'],
    ['calendar', '▦', 'Календарь'],
    ['clients', '◎', 'Клиенты'],
    ['money', '€', 'Деньги'],
    ['settings', '⚙', 'Настройки']
  ];

  function loadState() {
    try {
      const saved = JSON.parse(localStorage.getItem(storageKey) || '{}');
      return { ...structuredClone(defaults), ...saved, settings: { ...defaults.settings, ...(saved.settings || {}) } };
    } catch {
      return structuredClone(defaults);
    }
  }

  function saveState() {
    localStorage.setItem(storageKey, JSON.stringify(state));
  }

  function money(value, currency = 'EUR') {
    const symbols = { EUR: '€', GBP: '£', KZT: '₸', RUB: '₽', USD: '$' };
    const sign = value < 0 ? '−' : '';
    return `${sign}${symbols[currency] || currency} ${Math.abs(value).toLocaleString('ru-RU')}`;
  }

  function formatDateLong(iso) {
    const date = new Date(`${iso}T12:00:00`);
    return new Intl.DateTimeFormat('ru-RU', { weekday: 'long', day: 'numeric', month: 'long' }).format(date);
  }

  function setTheme(theme) {
    state.theme = theme;
    document.documentElement.dataset.theme = theme;
    $('meta[name="theme-color"]')?.setAttribute('content', theme === 'dark' ? '#07100f' : '#fff7fb');
    saveState();
  }

  function renderNav() {
    const item = ([id, icon, label], mobile = false) => `<button class="${mobile ? 'bottom-item' : 'nav-item'} ${state.activeView === id ? 'active' : ''}" data-view="${id}" type="button"><b class="nav-icon">${icon}</b><span>${label}</span></button>`;
    $('#side-nav').innerHTML = nav.map(x => item(x)).join('');
    $('#bottom-nav').innerHTML = nav.map(x => item(x, true)).join('');
    $$('[data-view]').forEach(button => button.addEventListener('click', () => navigate(button.dataset.view)));
  }

  function navigate(view) {
    state.activeView = view;
    saveState();
    render();
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  function setTitle(title, eyebrow) {
    $('#page-title').textContent = title;
    $('#page-eyebrow').textContent = eyebrow;
  }

  function timelineRows(date = '2026-06-14') {
    const items = state.trainings.filter(t => t.date === date);
    if (!items.length) return '<div class="agenda-empty">На этот день ничего не запланировано</div>';
    return `<div class="timeline">${items.map(t => `<div class="timeline-row"><time>${t.time}</time><i style="--event:${t.type === 'duty' ? 'var(--purple)' : t.type === 'event' ? 'var(--yellow)' : 'var(--accent)'}"></i><div><b>${t.title}</b><small>${t.client} · ${t.location}</small></div><span class="status-pill">${t.status}</span></div>`).join('')}</div>`;
  }

  function renderHome() {
    setTitle('Главная', '14 июня 2026 · воскресенье');
    return `
      <div class="grid grid-2">
        <article class="card hero-card">
          <span class="trend">↗ 18%</span>
          <div><small>Заработано · Июнь</small><strong>€ 4 280</strong><strong class="multi-money">+ ₽ 164 000 + £ 780</strong></div>
          <div class="chart" aria-hidden="true">${[36,48,43,66,55,88,72].map((h,i)=>`<i style="--h:${h}%;--o:${i/12}"></i>`).join('')}</div>
        </article>
        <article class="card card-pad">
          <div class="section-title" style="margin-top:0"><h2>Сегодня · 3 записи</h2><button data-go="calendar">Календарь</button></div>
          ${timelineRows()}
        </article>
      </div>

      <div class="section-title"><h2>Рабочее пространство</h2><button id="edit-home">Настроить</button></div>
      <div class="grid grid-3">
        ${quickCard('clients','👥','Клиенты','24 активных · 2 должника','24','#f64f93','#ce197a')}
        ${quickCard('calendar','▦','Расписание','Следующая в 15:00','3','#4f9cf6','#3875d8')}
        ${quickCard('money','€','Деньги','Доход, долги и клубы','€','#18b77c','#0e9160')}
        ${quickCard('clubs','⌂','Клубы','3 клуба · к выплате €420','3','#ff9e4f','#e8742f')}
        ${quickCard('notifications','✉','Сообщения','5 черновиков к отправке','5','#8b5be8','#6642c5')}
        ${quickCard('subscriptions','∞','Абонементы','3 скоро закончатся','18','#0abab5','#087f7b')}
      </div>
    `;
  }

  function quickCard(view, icon, title, subtitle, meta, from, to) {
    return `<article class="card quick-card" data-card-view="${view}"><span class="quick-icon" style="--from:${from};--to:${to}">${icon}</span><div class="quick-copy"><b>${title}</b><small>${subtitle}</small></div><span class="quick-meta">${meta} ›</span></article>`;
  }

  function calendarData(year, month) {
    const first = new Date(year, month, 1);
    const start = (first.getDay() + 6) % 7;
    const days = new Date(year, month + 1, 0).getDate();
    const prevDays = new Date(year, month, 0).getDate();
    return Array.from({ length: 42 }, (_, index) => {
      const raw = index - start + 1;
      let day = raw, cellMonth = month, muted = false;
      if (raw < 1) { day = prevDays + raw; cellMonth = month - 1; muted = true; }
      if (raw > days) { day = raw - days; cellMonth = month + 1; muted = true; }
      const date = new Date(year, cellMonth, day);
      const iso = date.toISOString().slice(0,10);
      return { day, iso, muted, items: state.trainings.filter(t => t.date === iso) };
    });
  }

  function renderCalendar() {
    setTitle('Календарь', 'Тренировки, события и дежурства');
    const selected = new Date(`${state.selectedDate}T12:00:00`);
    const year = selected.getFullYear(), month = selected.getMonth();
    const title = new Intl.DateTimeFormat('ru-RU', { month: 'long', year: 'numeric' }).format(selected);
    const cells = calendarData(year, month).map(cell => {
      const trainings = cell.items.filter(i => i.type === 'training').length;
      const event = cell.items.some(i => i.type === 'event');
      const duty = cell.items.some(i => i.type === 'duty');
      return `<button class="day-cell ${cell.muted ? 'muted' : ''} ${cell.iso === state.selectedDate ? 'selected' : ''}" data-date="${cell.iso}" type="button"><span class="day-number">${cell.day}</span>${trainings ? `<span class="training-dot">${trainings}</span>` : ''}${event ? '<div class="marker event"></div>' : ''}${duty ? '<div class="marker duty"></div>' : ''}</button>`;
    }).join('');
    return `<div class="calendar-layout"><article class="card calendar-card"><div class="calendar-head"><h2>${title[0].toUpperCase()+title.slice(1)}</h2><div class="calendar-controls"><button data-month="-1">‹</button><button data-month="1">›</button></div></div><div class="weekdays">${['Пн','Вт','Ср','Чт','Пт','Сб','Вс'].map(x=>`<span>${x}</span>`).join('')}</div><div class="month-grid">${cells}</div></article><article class="card agenda-card"><p class="agenda-date">Выбранный день</p><h2>${formatDateLong(state.selectedDate)}</h2>${timelineRows(state.selectedDate)}</article></div>`;
  }

  function renderClients() {
    setTitle('Клиенты', `${state.clients.length} клиентов`);
    const filtered = state.clients.filter(c => state.clientFilter === 'debt' ? c.balance < 0 : state.clientFilter === 'club' ? c.club !== 'Без клуба' : true);
    return `<div class="search-field"><input id="client-search" type="search" placeholder="Поиск по имени, клубу или валюте"></div><div class="filters"><button class="filter-chip ${state.clientFilter==='all'?'active':''}" data-filter="all">Все</button><button class="filter-chip ${state.clientFilter==='debt'?'active':''}" data-filter="debt">Должники</button><button class="filter-chip ${state.clientFilter==='club'?'active':''}" data-filter="club">Клиенты клубов</button></div><div class="client-list" id="client-list">${filtered.map(clientCard).join('')}</div>`;
  }

  function clientCard(c) {
    return `<article class="card client-card" data-client="${c.id}"><div class="avatar">${c.initials}</div><div><h3>${c.name}</h3><p>${c.type} · ${c.club}</p></div><div class="client-side"><span class="client-balance ${c.balance<0?'negative':c.balance>0?'positive':''}">${c.balance===0?'Баланс 0':money(c.balance,c.currency)}</span><small>${c.remaining} тренировок осталось</small></div></article>`;
  }

  function renderMoney() {
    setTitle('Деньги', 'Доходы, долги и взаиморасчёты');
    const factor = state.period === 'week' ? .24 : state.period === 'year' ? 8.8 : 1;
    const euro = Math.round(4280*factor), rub = Math.round(164000*factor), gbp = Math.round(780*factor);
    return `<div class="section-title" style="margin-top:0"><div class="period-control">${[['week','Неделя'],['month','Месяц'],['year','Год']].map(([id,label])=>`<button class="${state.period===id?'active':''}" data-period="${id}">${label}</button>`).join('')}</div></div><div class="money-summary"><article class="card hero-card"><span class="trend">+18%</span><div><small>Заработано за период</small><strong>€ ${euro.toLocaleString('ru-RU')}</strong><strong class="multi-money">+ ₽ ${rub.toLocaleString('ru-RU')} + £ ${gbp.toLocaleString('ru-RU')}</strong></div><div class="chart">${[28,45,38,64,52,82,76,95,72,88].map((h,i)=>`<i style="--h:${h}%;--o:${i/16}"></i>`).join('')}</div></article><div class="grid"><article class="card stat-card"><small>К получению от клиентов</small><strong>€ 285</strong><div class="sub">2 клиента с отрицательным балансом</div></article><article class="card stat-card"><small>К выплате клубам</small><strong>€ 420</strong><div class="sub">Iron Club и TWORK Studio</div></article></div></div><div class="section-title"><h2>Взаиморасчёты с клубами</h2><button>История</button></div><article class="card card-pad">${[['Iron Club','12 тренировок · комиссия 20%','€ 310'],['TWORK Studio','Групповые и сплит-тренировки','€ 110'],['Online Club','Без удержания','€ 0']].map(([name,sub,amount])=>`<div class="club-row"><div><b>${name}</b><small>${sub}</small></div><div class="club-amount"><strong>${amount}</strong><button data-settle="${name}">Рассчитаться</button></div></div>`).join('')}</article>`;
  }

  function renderSettings() {
    setTitle('Настройки', 'Персонализация и автоматизация');
    const row = (key, icon, title, sub) => `<div class="settings-row"><span class="settings-icon">${icon}</span><div><b>${title}</b><small>${sub}</small></div><button class="toggle ${state.settings[key]?'on':''}" data-setting="${key}" type="button" aria-label="${title}"></button></div>`;
    return `<div class="settings-list"><article class="card settings-group">${row('notifications','✉','Уведомления','Черновики и шаблоны сообщений')}${row('calendarSync','▦','Apple Calendar','Отдельные календари клиентов')}${row('clubs','⌂','Клубы и организации','Цены, комиссии и расчёты')}</article><article class="card settings-group">${row('iCloud','☁','Резервная копия iCloud','Локальные данные с резервной копией')}<div class="settings-row"><span class="settings-icon">◐</span><div><b>Оформление</b><small>${state.theme==='dark'?'Тёмная фирменная тема':'Светлая фирменная тема'}</small></div><button class="toggle ${state.theme==='dark'?'on':''}" id="settings-theme" type="button"></button></div></article><article class="card settings-group"><div class="settings-row"><span class="settings-icon">↻</span><div><b>Сбросить демо-данные</b><small>Вернуть исходное состояние веб-версии</small></div><button class="secondary-button" id="reset-demo" type="button">Сбросить</button></div></article></div>`;
  }

  function renderPlaceholder(title, text) {
    setTitle(title, 'Раздел веб-версии');
    return `<article class="card empty-card"><h2>${title}</h2><p>${text}</p><button class="submit-button" data-go="home">Вернуться на главную</button></article>`;
  }

  function renderPage() {
    const page = $('#page');
    switch (state.activeView) {
      case 'home': page.innerHTML = renderHome(); break;
      case 'calendar': page.innerHTML = renderCalendar(); break;
      case 'clients': page.innerHTML = renderClients(); break;
      case 'money': page.innerHTML = renderMoney(); break;
      case 'settings': page.innerHTML = renderSettings(); break;
      default: page.innerHTML = renderPlaceholder('Раздел', 'Этот раздел будет добавлен позже.');
    }
    bindPageEvents();
  }

  function bindPageEvents() {
    $$('[data-go]').forEach(el => el.addEventListener('click', () => navigate(el.dataset.go)));
    $$('[data-card-view]').forEach(el => el.addEventListener('click', () => {
      const view = el.dataset.cardView;
      if (nav.some(n => n[0] === view)) navigate(view); else toast('Раздел доступен в следующей итерации веб-версии');
    }));
    $$('[data-date]').forEach(el => el.addEventListener('click', () => { state.selectedDate = el.dataset.date; saveState(); render(); }));
    $$('[data-month]').forEach(el => el.addEventListener('click', () => {
      const d = new Date(`${state.selectedDate}T12:00:00`); d.setMonth(d.getMonth()+Number(el.dataset.month)); d.setDate(1); state.selectedDate=d.toISOString().slice(0,10); saveState(); render();
    }));
    $$('[data-filter]').forEach(el => el.addEventListener('click', () => { state.clientFilter=el.dataset.filter; saveState(); render(); }));
    $('#client-search')?.addEventListener('input', event => {
      const q = event.target.value.trim().toLowerCase();
      $('#client-list').innerHTML = state.clients.filter(c => [c.name,c.club,c.currency,c.type].join(' ').toLowerCase().includes(q)).map(clientCard).join('') || '<div class="card empty-card">Ничего не найдено</div>';
      bindClientCards();
    });
    bindClientCards();
    $$('[data-period]').forEach(el => el.addEventListener('click', () => { state.period=el.dataset.period; saveState(); render(); }));
    $$('[data-settle]').forEach(el => el.addEventListener('click', () => toast(`Расчёт с ${el.dataset.settle} зафиксирован`)));
    $$('[data-setting]').forEach(el => el.addEventListener('click', () => { const k=el.dataset.setting; state.settings[k]=!state.settings[k]; saveState(); render(); toast('Настройка сохранена'); }));
    $('#settings-theme')?.addEventListener('click', toggleTheme);
    $('#reset-demo')?.addEventListener('click', () => { localStorage.removeItem(storageKey); state=structuredClone(defaults); setTheme('light'); render(); toast('Демо-данные восстановлены'); });
  }

  function bindClientCards() {
    $$('[data-client]').forEach(el => el.addEventListener('click', () => openClient(Number(el.dataset.client))));
  }

  function openClient(id) {
    const c = state.clients.find(x => x.id === id); if (!c) return;
    openSheet(`<p class="eyebrow">Карточка клиента</p><h2>${c.name}</h2><div class="detail-hero"><div class="avatar">${c.initials}</div><div><b>${c.type}</b><p class="sheet-lead">${c.club} · ${c.currency}</p></div></div><div class="detail-grid"><div class="detail-stat"><small>Баланс</small><strong>${money(c.balance,c.currency)}</strong></div><div class="detail-stat"><small>Осталось</small><strong>${c.remaining}</strong></div><div class="detail-stat"><small>Следующая</small><strong>${c.next}</strong></div></div><div class="form-actions"><button class="secondary-button" data-client-action="payment">Принять оплату</button><button class="submit-button" data-client-action="training">Добавить тренировку</button></div>`);
    $$('[data-client-action]').forEach(b => b.addEventListener('click', () => { closeSheet(); openQuickAdd(b.dataset.clientAction, c); }));
  }

  function openQuickAdd(type = 'training', client = null) {
    const isClient = type === 'client', isPayment = type === 'payment';
    const title = isClient ? 'Новый клиент' : isPayment ? 'Принять оплату' : 'Новая тренировка';
    const form = isClient ? `<label>Имя<input name="name" required placeholder="Имя клиента"></label><label>Формат<select name="type"><option>Персональная</option><option>Онлайн</option><option>Сплит</option><option>Групповая</option></select></label><label>Валюта<select name="currency"><option>EUR</option><option>GBP</option><option>RUB</option><option>KZT</option></select></label>` : isPayment ? `<label>Клиент<select name="client">${state.clients.map(c=>`<option value="${c.id}" ${client?.id===c.id?'selected':''}>${c.name}</option>`).join('')}</select></label><label>Сумма<input name="amount" type="number" min="1" value="50" required></label><label>Комментарий<input name="comment" placeholder="Необязательно"></label>` : `<label>Клиент<select name="client">${state.clients.map(c=>`<option value="${c.id}" ${client?.id===c.id?'selected':''}>${c.name}</option>`).join('')}</select></label><div class="grid grid-2"><label>Дата<input name="date" type="date" value="2026-06-21" required></label><label>Время<input name="time" type="time" value="18:00" required></label></div><label>Тип<select name="kind"><option>Персональная</option><option>Онлайн</option><option>Сплит</option><option>Групповая</option><option>Дежурство</option></select></label><label>Место / комментарий<input name="location" value="Iron Club"></label>`;
    openSheet(`<p class="eyebrow">TWORK Web</p><h2>${title}</h2><p class="sheet-lead">Данные сохраняются локально в браузере.</p><form class="form-grid" id="quick-form">${form}<div class="form-actions"><button class="secondary-button" type="button" id="cancel-form">Отмена</button><button class="submit-button" type="submit">Сохранить</button></div></form>`);
    $('#cancel-form')?.addEventListener('click', closeSheet);
    $('#quick-form')?.addEventListener('submit', event => {
      event.preventDefault(); const data = new FormData(event.currentTarget);
      if (isClient) {
        const name = String(data.get('name')); state.clients.push({ id: Date.now(), name, type:String(data.get('type')), club:'Без клуба', currency:String(data.get('currency')), balance:0, remaining:0, next:'Нет записи', initials:name.split(/\s+/).map(x=>x[0]).join('').slice(0,2).toUpperCase() });
      } else if (isPayment) {
        const c=state.clients.find(x=>x.id===Number(data.get('client'))); if(c) c.balance += Number(data.get('amount'));
      } else {
        const c=state.clients.find(x=>x.id===Number(data.get('client'))); const kind=String(data.get('kind'));
        state.trainings.push({ id:Date.now(), date:String(data.get('date')), time:String(data.get('time')), title:kind, client:c?.name||'Клиент', location:String(data.get('location')), type:kind==='Дежурство'?'duty':'training', status:'Запланировано' });
      }
      saveState(); closeSheet(); render(); toast(`${title} сохранено`);
    });
  }

  function openSheet(html) { $('#sheet-content').innerHTML=html; $('#sheet-backdrop').classList.add('open'); $('#sheet-backdrop').setAttribute('aria-hidden','false'); document.body.style.overflow='hidden'; }
  function closeSheet() { $('#sheet-backdrop').classList.remove('open'); $('#sheet-backdrop').setAttribute('aria-hidden','true'); document.body.style.overflow=''; }
  function toast(message) { const el=$('#toast'); el.textContent=message; el.classList.add('show'); clearTimeout(toast.timer); toast.timer=setTimeout(()=>el.classList.remove('show'),2600); }
  function toggleTheme() { setTheme(state.theme === 'dark' ? 'light' : 'dark'); render(); }

  function bindGlobal() {
    $('#theme-button').addEventListener('click', toggleTheme);
    $('#mobile-theme-button').addEventListener('click', toggleTheme);
    $('#quick-add-button').addEventListener('click', () => openQuickAdd('training'));
    $('#search-button').addEventListener('click', () => navigate('clients'));
    $('#sheet-close').addEventListener('click', closeSheet);
    $('#sheet-backdrop').addEventListener('click', event => { if (event.target === event.currentTarget) closeSheet(); });
    document.addEventListener('keydown', event => { if (event.key === 'Escape') closeSheet(); });
  }

  function render() {
    setTheme(state.theme);
    renderNav();
    renderPage();
  }

  bindGlobal();
  render();
})();
