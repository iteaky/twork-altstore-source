(() => {
  const $ = (s, r = document) => r.querySelector(s);
  const $$ = (s, r = document) => [...r.querySelectorAll(s)];
  const root = document.documentElement;

  const icons = {
    gear:'<svg viewBox="0 0 24 24"><path d="M12 8.2a3.8 3.8 0 1 0 0 7.6 3.8 3.8 0 0 0 0-7.6Z"/><path d="M19.4 13.2v-2.4l-2-.6a7.4 7.4 0 0 0-.6-1.4l1-1.8-1.7-1.7-1.8 1a7.4 7.4 0 0 0-1.4-.6l-.6-2H9.9l-.6 2a7.4 7.4 0 0 0-1.4.6l-1.8-1-1.7 1.7 1 1.8a7.4 7.4 0 0 0-.6 1.4l-2 .6v2.4l2 .6c.1.5.3 1 .6 1.4l-1 1.8 1.7 1.7 1.8-1c.4.3.9.5 1.4.6l.6 2h2.4l.6-2c.5-.1 1-.3 1.4-.6l1.8 1 1.7-1.7-1-1.8c.3-.4.5-.9.6-1.4l2-.6Z"/></svg>',
    close:'<svg viewBox="0 0 24 24"><path d="m7 7 10 10M17 7 7 17"/></svg>',
    plus:'<svg viewBox="0 0 24 24"><path d="M12 5v14M5 12h14"/></svg>',
    calendar:'<svg viewBox="0 0 24 24"><path d="M5 4.5h14a2 2 0 0 1 2 2v12a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-12a2 2 0 0 1 2-2ZM7 2.5v4M17 2.5v4M3 9h18"/></svg>',
    bell:'<svg viewBox="0 0 24 24"><path d="M5 17h14l-1.5-2.2V10a5.5 5.5 0 0 0-11 0v4.8L5 17Z"/><path d="M9.5 19.5a2.8 2.8 0 0 0 5 0"/></svg>',
    list:'<svg viewBox="0 0 24 24"><rect x="3" y="4" width="18" height="16" rx="3"/><path d="M7 8h.1M10 8h7M7 12h.1M10 12h7M7 16h.1M10 16h5"/></svg>',
    people:'<svg viewBox="0 0 24 24"><path d="M9.5 11a3.5 3.5 0 1 0 0-7 3.5 3.5 0 0 0 0 7ZM3 20c.4-4.3 2.6-6.5 6.5-6.5S15.6 15.7 16 20"/><path d="M16 11a3 3 0 1 0 0-6M16.2 14c2.8.1 4.4 2.1 4.8 5"/></svg>',
    building:'<svg viewBox="0 0 24 24"><path d="M4 21V8l8-4 8 4v13M2 21h20M8 11h2M14 11h2M8 15h2M14 15h2M10 21v-3h4v3"/></svg>',
    note:'<svg viewBox="0 0 24 24"><path d="M5 3.5h11l3 3V20a1 1 0 0 1-1 1H5a1 1 0 0 1-1-1V4.5a1 1 0 0 1 1-1Z"/><path d="M15.5 3.5V7H19M8 11h8M8 15h6"/></svg>',
    infinity:'<svg viewBox="0 0 24 24"><path d="M8.2 8.2c-2.5 0-4.2 1.7-4.2 3.8s1.7 3.8 4.2 3.8c3.2 0 4.4-7.6 7.6-7.6 2.5 0 4.2 1.7 4.2 3.8s-1.7 3.8-4.2 3.8c-3.2 0-4.4-7.6-7.6-7.6Z"/></svg>',
    chart:'<svg viewBox="0 0 24 24"><path d="M5 20V10M10 20V5M15 20v-8M20 20V3"/></svg>',
    search:'<svg viewBox="0 0 24 24"><circle cx="10.5" cy="10.5" r="6.5"/><path d="m15.5 15.5 5 5"/></svg>',
    card:'<svg viewBox="0 0 24 24"><rect x="3" y="5" width="18" height="14" rx="3"/><path d="M3 9h18M7 14h4"/></svg>'
  };

  const demo = {
    theme:'light', screen:'home', previous:'home', clientFilter:'all', selectedDate:'2026-06-14',
    settings:{calendar:true,notifications:true,backup:true},
    clients:[
      {id:1,name:'Анна Ковалёва',type:'Персональная',club:'Iron Club',balance:120,currency:'€',remaining:6,next:'18 июня · 18:00',messenger:true},
      {id:2,name:'Mark Evans',type:'Онлайн',club:'London · GMT+1',balance:-35,currency:'£',remaining:3,next:'15 июня · 10:00',messenger:true},
      {id:3,name:'Диана Садыкова',type:'Онлайн',club:'Алматы · GMT+5',balance:18000,currency:'₸',remaining:8,next:'17 июня · 09:00',messenger:false},
      {id:4,name:'Максим Орлов',type:'Персональная',club:'TWORK Studio',balance:0,currency:'€',remaining:2,next:'14 июня · 10:00',messenger:true},
      {id:5,name:'Елена Миронова',type:'Персональная',club:'Без клуба',balance:-70,currency:'€',remaining:0,next:'Нет записи',messenger:false}
    ],
    trainings:[
      {date:'2026-06-14',time:'10:00',title:'Сплит-тренировка',sub:'Максим и Олег · TWORK Studio',type:'training',status:'Оплачено'},
      {date:'2026-06-14',time:'15:00',title:'Дежурство',sub:'Iron Club · до 18:00',type:'duty',status:'€60'},
      {date:'2026-06-14',time:'18:00',title:'Персональная',sub:'Анна Ковалёва · абонемент',type:'training',status:'7 из 8'},
      {date:'2026-06-15',time:'10:00',title:'Онлайн · Лондон',sub:'Mark · 09:00 по времени клиента',type:'training',status:'£45'},
      {date:'2026-06-16',time:'19:30',title:'Групповая',sub:'TWORK Studio · 6 участников',type:'event',status:'€90'},
      {date:'2026-06-18',time:'18:00',title:'Персональная',sub:'Анна Ковалёва · 7 из 8',type:'training',status:'Абонемент'},
      {date:'2026-06-20',time:'12:00',title:'Дежурство',sub:'Iron Club · до 17:00',type:'duty',status:'€100'}
    ]
  };
  try{Object.assign(demo,JSON.parse(localStorage.getItem('twork-demo-exact')||'{}'))}catch{}

  const save=()=>localStorage.setItem('twork-demo-exact',JSON.stringify({theme:demo.theme,clientFilter:demo.clientFilter,selectedDate:demo.selectedDate,settings:demo.settings,clients:demo.clients,trainings:demo.trainings}));
  const setIcons=(rootEl=document)=>$$('[data-icon]',rootEl).forEach(el=>el.innerHTML=icons[el.dataset.icon]||'');
  const fmtMoney=(n,c)=>`${n<0?'−':''}${c} ${Math.abs(n).toLocaleString('ru-RU')}`;
  const tRows=(date)=>demo.trainings.filter(x=>x.date===date).map(t=>`<div class="training-row"><time>${t.time}</time><i class="${t.type}"></i><div><b>${t.title}</b><small>${t.sub}</small></div>${t.status?`<em>${t.status}</em>`:''}</div>`).join('')||'<div style="padding:16px 0;color:var(--secondary);font-size:12px;text-align:center">Нет записей</div>';

  function actionCard({id,title,subtitle,icon,g1,g2,badge,side=false}){
    return `<button class="home-action" data-open="${id}"><span class="action-icon" style="--g1:${g1};--g2:${g2}"><span data-icon="${icon}"></span>${badge?`<span class="badge">${badge}</span>`:''}</span><span class="action-copy"><h3>${title}</h3><p>${subtitle}</p></span>${side?`<span class="side-action"><span class="side-plus" data-quick="${id}">＋</span><span class="chevron"></span></span>`:'<span class="chevron"></span>'}</button>`
  }

  function renderHome(){
    $('#home-content').innerHTML=`
      <article class="home-card schedule-card" data-open="calendar">
        <div class="card-heading"><h2>Тренировки</h2><span class="chevron"></span></div>
        <div class="day-block"><div class="day-title"><span>Сегодня</span><span>3 тренировки</span></div>${tRows('2026-06-14')}</div>
        <div class="day-block"><div class="day-title"><span>Завтра</span><span>1 тренировка</span></div>${tRows('2026-06-15')}</div>
      </article>
      ${actionCard({id:'notifications',title:'Уведомления',subtitle:'5 сообщений к отправке',icon:'bell',g1:'#c79feb',g2:'#a880d6',badge:'5'})}
      ${actionCard({id:'online',title:'Онлайн',subtitle:'Управление доступом к онлайн-ресурсам',icon:'list',g1:'#8cc7d9',g2:'#73a6c7'})}
      ${actionCard({id:'clients',title:'Клиенты',subtitle:'2 клиента с долгом',icon:'people',g1:'#d9b89e',g2:'#bf9980',badge:'2',side:true})}
      ${actionCard({id:'clubs',title:'Клубы',subtitle:'Клиенты, правила дохода и взаиморасчёты',icon:'building',g1:'#e493a4',g2:'#cf6f84'})}
      ${actionCard({id:'notes',title:'Заметки',subtitle:'Заметки и история по клиентам',icon:'note',g1:'#ffe78a',g2:'#f6c246',side:true})}
      ${actionCard({id:'subscriptions',title:'Абонементы',subtitle:'Управление абонементами',icon:'infinity',g1:'#99b3e6',g2:'#8094cc'})}
      ${actionCard({id:'overview',title:'Обзор месяца',subtitle:'Июнь: € 4 280 + ₽ 164 000 · 28 тренировок',icon:'chart',g1:'#b8d6b3',g2:'#8cb899'})}`;
    setIcons($('#home-content'));
  }

  function navBar(title,{subtitle='',plus=false,back='home'}={}){
    return `<div class="safe-top"></div><header class="nav-bar"><button class="nav-icon-button" data-back="${back}" aria-label="Закрыть"><span data-icon="close"></span></button><div class="nav-title"><h1>${title}</h1>${subtitle?`<p>${subtitle}</p>`:''}</div>${plus?`<button class="nav-icon-button" data-add="${title}" aria-label="Добавить"><span data-icon="plus"></span></button>`:'<span></span>'}</header>`
  }

  function openScreen(screen,payload={}){
    demo.previous=demo.screen; demo.screen=screen;
    const el=$('#detail-screen'); el.innerHTML=renderScreen(screen,payload); setIcons(el); bindDetail(el,payload);
    $('#home-screen').classList.remove('active'); el.classList.add('active');
  }
  function closeToHome(){demo.screen='home';$('#detail-screen').classList.remove('active');$('#home-screen').classList.add('active')}

  function renderScreen(screen,payload){
    if(screen==='calendar')return calendarScreen();
    if(screen==='clients')return clientsScreen();
    if(screen==='client')return clientDetail(payload.id);
    if(screen==='overview')return overviewScreen();
    if(screen==='settings')return settingsScreen();
    if(screen==='notifications')return notificationsScreen();
    if(screen==='clubs')return clubsScreen();
    if(screen==='subscriptions')return subscriptionsScreen();
    if(screen==='notes')return notesScreen();
    if(screen==='online')return onlineScreen();
    return navBar('TWORK')+'<div class="detail-scroll"><div class="home-card" style="padding:18px">Раздел демо</div></div>'
  }

  function calendarCells(){
    const dates=[];for(let i=0;i<35;i++){const day=i+1;const iso=`2026-06-${String(day).padStart(2,'0')}`;const items=demo.trainings.filter(t=>t.date===iso);dates.push(`<button class="calendar-cell ${iso===demo.selectedDate?'selected':''} ${day===14?'today':''}" data-date="${iso}"><span class="n">${day}</span>${items.filter(x=>x.type==='training').length?`<span class="train-count">${items.filter(x=>x.type==='training').length}</span>`:''}${items.some(x=>x.type==='event')?'<div class="line-marker event"></div>':''}${items.some(x=>x.type==='duty')?'<div class="line-marker duty"></div>':''}</button>`)}return dates.join('')
  }
  function calendarScreen(){return `<div class="detail-root">${navBar('Календарь',{subtitle:'Июнь 2026',plus:true})}<div class="detail-scroll"><div class="calendar-shell"><div class="calendar-header"><button>‹</button><h2>Июнь 2026</h2><button>›</button></div><div class="week-labels">${['Пн','Вт','Ср','Чт','Пт','Сб','Вс'].map(x=>`<span>${x}</span>`).join('')}</div><div class="calendar-grid">${calendarCells()}</div><div class="selected-day-list"><h3>${new Date(demo.selectedDate+'T12:00').toLocaleDateString('ru-RU',{day:'numeric',month:'long'})}</h3>${tRows(demo.selectedDate)}</div></div></div></div>`}

  function clientsScreen(){const filtered=demo.clients.filter(c=>demo.clientFilter==='debt'?c.balance<0:demo.clientFilter==='online'?c.type==='Онлайн':demo.clientFilter==='personal'?c.type!=='Онлайн':true);return `<div class="detail-root">${navBar('Клиенты',{plus:true})}<div class="detail-scroll"><div class="search-box"><span data-icon="search"></span><input id="client-search" placeholder="Поиск"></div><div class="chips">${[['all','Все'],['personal','Персональные'],['online','Онлайн'],['debt','Должники']].map(([id,l])=>`<button class="chip ${demo.clientFilter===id?'active':''}" data-filter="${id}">${l}</button>`).join('')}</div><div class="list-stack" id="client-list">${filtered.map(clientRow).join('')}</div></div></div>`}
  function clientRow(c){return `<button class="client-row" data-client="${c.id}"><div class="client-row-top"><h3>${c.name}</h3><div class="client-row-meta"><span class="type-badge ${c.type==='Онлайн'?'online':''}">${c.type}</span><span class="messenger-dot">${c.messenger?'✓':'–'}</span></div></div><div class="club-caption"><span data-icon="building"></span>${c.club}</div><div class="client-summary"><span class="${c.balance<0?'debt':c.balance>0?'positive':''}">Баланс: ${fmtMoney(c.balance,c.currency)}</span><span>Осталось тренировок: ${c.remaining}</span><span>Следующая: ${c.next}</span></div></button>`}

  function clientDetail(id){const c=demo.clients.find(x=>x.id===id)||demo.clients[0];return `<div class="detail-root">${navBar(c.name,{back:'clients'})}<div class="detail-scroll"><div class="report-hero"><small>Баланс клиента</small><strong class="${c.balance<0?'debt':c.balance>0?'positive':''}">${fmtMoney(c.balance,c.currency)}</strong><div class="currency-lines">${c.remaining} тренировок осталось</div></div><div class="stats-grid"><div class="stat-card"><small>Следующая тренировка</small><strong>${c.next}</strong></div><div class="stat-card"><small>Клуб</small><strong>${c.club}</strong></div></div><div class="screen-section-title">Абонемент</div><div class="home-card" style="padding:15px"><div style="display:flex;justify-content:space-between;gap:10px"><div><b style="font-size:15px">Персональные тренировки</b><p style="margin:4px 0;color:var(--secondary);font-size:11px">Действует до 31 июля</p></div><strong>${c.remaining} / 8</strong></div></div><div class="screen-section-title">Действия</div><div class="club-actions"><button class="small-button primary" data-client-action="training">Добавить тренировку</button><button class="small-button" data-client-action="payment">Принять оплату</button></div></div></div>`}

  function overviewScreen(){return `<div class="detail-root">${navBar('Обзор месяца',{subtitle:'Июнь 2026'})}<div class="detail-scroll"><div class="report-hero"><small>Получено</small><strong>€ 4 280</strong><div class="currency-lines">+ ₽ 164 000 + £ 780</div><div class="mini-chart">${[38,48,42,68,55,84,72,95].map(h=>`<i style="--h:${h}%"></i>`).join('')}</div></div><div class="stats-grid"><div class="stat-card"><small>Проведено</small><strong>28 тренировок</strong></div><div class="stat-card"><small>Клиенты</small><strong>24 активных</strong></div><div class="stat-card"><small>Долги</small><strong class="debt">€ 105</strong></div><div class="stat-card"><small>Клубам</small><strong>€ 420</strong></div></div><div class="screen-section-title">По направлениям</div>${[['Персональные','€ 2 640'],['Онлайн','€ 920 + £ 780'],['Групповые','€ 720'],['Услуги','₽ 164 000']].map(([a,b])=>`<div class="home-card" style="display:flex;justify-content:space-between;padding:15px;margin-bottom:10px"><b>${a}</b><span>${b}</span></div>`).join('')}</div></div>`}

  function notificationsScreen(){return `<div class="detail-root">${navBar('Уведомления')}<div class="detail-scroll"><div class="chips"><button class="chip active">К отправке · 5</button><button class="chip">Отправленные</button></div>${[['Анна Ковалёва','Напоминание о тренировке завтра в 18:00'],['Mark Evans','Your online session starts tomorrow at 09:00'],['Елена Миронова','Напоминание об оплате € 70'],['Диана Садыкова','У вас осталось 2 тренировки'],['Максим Орлов','Тренировка перенесена на 16 июня']].map(([n,t])=>`<div class="home-card" style="padding:15px;margin-bottom:11px"><div style="display:flex;justify-content:space-between"><b>${n}</b><span style="color:var(--secondary);font-size:10px">Черновик</span></div><p style="font-size:12px;line-height:1.45;color:var(--secondary)">${t}</p><button class="small-button primary" data-toast="Сообщение отмечено как отправленное">Отправлено</button></div>`).join('')}</div></div>`}

  function clubsScreen(){return `<div class="detail-root">${navBar('Клубы',{plus:true})}<div class="detail-scroll">${[['Iron Club','К получению','€ 310'],['TWORK Studio','К получению','€ 110'],['Online Club','Баланс','€ 0']].map(([n,l,a])=>`<div class="club-card"><div class="club-head"><div><h3>${n}</h3><span>12 клиентов · 18 тренировок</span></div><span>${l}</span></div><div class="club-balance">${a}</div><div class="club-actions"><button class="small-button primary" data-toast="Расчёт зафиксирован">Рассчитаться</button><button class="small-button" data-toast="Открыта история клуба">История</button></div></div>`).join('')}</div></div>`}

  function subscriptionsScreen(){return `<div class="detail-root">${navBar('Абонементы',{plus:true})}<div class="detail-scroll"><div class="chips"><button class="chip active">Активные</button><button class="chip">Заканчиваются</button><button class="chip">История</button></div>${demo.clients.filter(c=>c.remaining>0).map(c=>`<button class="client-row" data-client="${c.id}"><div class="client-row-top"><h3>${c.name}</h3><strong>${c.remaining} / 8</strong></div><div class="client-summary"><span>Персональные тренировки</span><span>Действует до 31 июля</span></div></button>`).join('')}</div></div>`}
  function notesScreen(){return `<div class="detail-root">${navBar('Заметки',{plus:true})}<div class="detail-scroll">${[['Анна Ковалёва','После прошлой тренировки уменьшить нагрузку на колено.'],['Mark Evans','Отправить новую ссылку на комплекс упражнений.'],['Диана Садыкова','Предпочитает утренние тренировки по времени клиента.']].map(([n,t])=>`<div class="home-card" style="padding:15px;margin-bottom:11px"><b>${n}</b><p style="margin:7px 0 0;color:var(--secondary);font-size:12px;line-height:1.45">${t}</p></div>`).join('')}</div></div>`}
  function onlineScreen(){return `<div class="detail-root">${navBar('Онлайн')}<div class="detail-scroll">${demo.clients.filter(c=>c.type==='Онлайн').map(c=>`<div class="home-card" style="padding:15px;margin-bottom:11px"><div style="display:flex;justify-content:space-between"><b>${c.name}</b><span class="type-badge online">Активен</span></div><p style="color:var(--secondary);font-size:12px">${c.club}</p><div class="club-actions"><button class="small-button primary" data-toast="Доступ продлён">Продлить доступ</button><button class="small-button" data-toast="Открыты материалы клиента">Материалы</button></div></div>`).join('')}</div></div>`}

  function settingsScreen(){const row=(icon,title,sub,key)=>`<div class="settings-row"><span class="settings-icon" data-icon="${icon}"></span><div class="settings-copy"><b>${title}</b><small>${sub}</small></div>${key?`<button class="toggle ${demo.settings[key]?'on':''}" data-setting="${key}"></button>`:'<span class="chevron"></span>'}</div>`;return `<div class="detail-root">${navBar('Настройки')}<div class="detail-scroll"><div class="screen-section-title">Веб-демо</div><div class="settings-group">${row('calendar','Apple Calendar','Отдельные календари клиентов','calendar')}${row('bell','Уведомления','Черновики сообщений','notifications')}${row('card','Резервная копия','В веб-демо данные локальные','backup')}</div><div class="screen-section-title">Оформление</div><div class="settings-group"><div class="settings-row"><span class="settings-icon" data-icon="gear"></span><div class="settings-copy"><b>Фирменная тема</b><small>${demo.theme==='dark'?'Tiffany Dark':'Pink Light'}</small></div><button class="toggle ${demo.theme==='dark'?'on':''}" id="theme-toggle"></button></div></div><div class="screen-section-title">Демо</div><div class="settings-group"><div class="settings-row"><span class="settings-icon" data-icon="note"></span><div class="settings-copy"><b>Сбросить демо-данные</b><small>Вернуть исходное наполнение</small></div><button class="small-button" id="reset-demo">Сбросить</button></div></div></div></div>`}

  function bindDetail(rootEl,payload){
    $$('[data-back]',rootEl).forEach(b=>b.onclick=()=>b.dataset.back==='home'?closeToHome():openScreen(b.dataset.back));
    $$('[data-add]',rootEl).forEach(b=>b.onclick=()=>openSheet('training'));
    $$('[data-date]',rootEl).forEach(b=>b.onclick=()=>{demo.selectedDate=b.dataset.date;save();openScreen('calendar')});
    $$('[data-filter]',rootEl).forEach(b=>b.onclick=()=>{demo.clientFilter=b.dataset.filter;save();openScreen('clients')});
    $$('[data-client]',rootEl).forEach(b=>b.onclick=()=>openScreen('client',{id:Number(b.dataset.client)}));
    $('#client-search',rootEl)?.addEventListener('input',e=>{const q=e.target.value.toLowerCase();$('#client-list',rootEl).innerHTML=demo.clients.filter(c=>(c.name+c.club+c.type).toLowerCase().includes(q)).map(clientRow).join('');setIcons($('#client-list',rootEl));$$('[data-client]',rootEl).forEach(b=>b.onclick=()=>openScreen('client',{id:Number(b.dataset.client)}))});
    $$('[data-client-action]',rootEl).forEach(b=>b.onclick=()=>openSheet(b.dataset.clientAction,payload.id));
    $$('[data-toast]',rootEl).forEach(b=>b.onclick=()=>toast(b.dataset.toast));
    $$('[data-setting]',rootEl).forEach(b=>b.onclick=()=>{demo.settings[b.dataset.setting]=!demo.settings[b.dataset.setting];save();openScreen('settings');toast('Настройка сохранена')});
    $('#theme-toggle',rootEl)?.addEventListener('click',toggleTheme);
    $('#reset-demo',rootEl)?.addEventListener('click',()=>{localStorage.removeItem('twork-demo-exact');location.reload()});
  }

  function openSheet(type='training',clientId=null){const c=demo.clients.find(x=>x.id===clientId)||demo.clients[0];const isPay=type==='payment';$('#sheet-card').innerHTML=`<div class="sheet-handle"></div><h2>${isPay?'Принять оплату':'Новая тренировка'}</h2><p>Ограниченная веб-версия сохраняет изменения только в этом браузере.</p><form class="form" id="demo-form"><label>Клиент<select name="client">${demo.clients.map(x=>`<option value="${x.id}" ${x.id===c.id?'selected':''}>${x.name}</option>`).join('')}</select></label>${isPay?'<label>Сумма<input name="amount" type="number" value="50"></label>':'<label>Дата<input name="date" type="date" value="2026-06-21"></label><label>Время<input name="time" type="time" value="18:00"></label><label>Тип<select name="kind"><option>Персональная</option><option>Онлайн</option><option>Сплит</option><option>Групповая</option><option>Дежурство</option></select></label>'}<div class="sheet-actions"><button type="button" class="cancel" id="sheet-cancel">Отмена</button><button class="save">Сохранить</button></div></form>`;$('#sheet-layer').classList.add('open');$('#sheet-layer').setAttribute('aria-hidden','false');$('#sheet-cancel').onclick=closeSheet;$('#demo-form').onsubmit=e=>{e.preventDefault();const fd=new FormData(e.currentTarget);const target=demo.clients.find(x=>x.id===Number(fd.get('client')));if(isPay){target.balance+=Number(fd.get('amount'))}else{const kind=fd.get('kind');demo.trainings.push({date:String(fd.get('date')),time:String(fd.get('time')),title:String(kind),sub:`${target.name} · демо`,type:kind==='Дежурство'?'duty':'training',status:'Запланировано'})}save();closeSheet();renderHome();toast('Сохранено')};}
  function closeSheet(){$('#sheet-layer').classList.remove('open');$('#sheet-layer').setAttribute('aria-hidden','true')}
  function toast(t){const el=$('#toast');el.textContent=t;el.classList.add('show');clearTimeout(toast.timer);toast.timer=setTimeout(()=>el.classList.remove('show'),2200)}
  function toggleTheme(){demo.theme=demo.theme==='dark'?'light':'dark';root.dataset.theme=demo.theme;save();if(demo.screen!=='home')openScreen(demo.screen);renderHome()}

  document.addEventListener('click',e=>{const open=e.target.closest('[data-open]');if(open&&!e.target.closest('[data-quick]'))openScreen(open.dataset.open);const quick=e.target.closest('[data-quick]');if(quick){e.stopPropagation();openSheet(quick.dataset.quick==='clients'?'payment':'training')}});
  $('#sheet-layer').addEventListener('click',e=>{if(e.target===$('#sheet-layer'))closeSheet()});
  root.dataset.theme=demo.theme;
  renderHome();setIcons();
})();
