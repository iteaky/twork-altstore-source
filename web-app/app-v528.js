(() => {
  const $ = (s, r = document) => r.querySelector(s);
  const $$ = (s, r = document) => [...r.querySelectorAll(s)];
  const root = document.documentElement;
  const storageKey = 'twork-v528-demo';

  const icons = {
    gear:'<svg viewBox="0 0 24 24"><path d="M12 8.2a3.8 3.8 0 1 0 0 7.6 3.8 3.8 0 0 0 0-7.6Z"/><path d="M19.4 13.2v-2.4l-2-.6a7.4 7.4 0 0 0-.6-1.4l1-1.8-1.7-1.7-1.8 1a7.4 7.4 0 0 0-1.4-.6l-.6-2H9.9l-.6 2a7.4 7.4 0 0 0-1.4.6l-1.8-1-1.7 1.7 1 1.8a7.4 7.4 0 0 0-.6 1.4l-2 .6v2.4l2 .6c.1.5.3 1 .6 1.4l-1 1.8 1.7 1.7 1.8-1c.4.3.9.5 1.4.6l.6 2h2.4l.6-2c.5-.1 1-.3 1.4-.6l1.8 1 1.7-1.7-1-1.8c.3-.4.5-.9.6-1.4l2-.6Z"/></svg>',
    close:'<svg viewBox="0 0 24 24"><path d="m7 7 10 10M17 7 7 17"/></svg>',
    back:'<svg viewBox="0 0 24 24"><path d="m15 5-7 7 7 7"/></svg>',
    plus:'<svg viewBox="0 0 24 24"><path d="M12 5v14M5 12h14"/></svg>',
    list:'<svg viewBox="0 0 24 24"><path d="M8 6h13M8 12h13M8 18h13M3 6h.1M3 12h.1M3 18h.1"/></svg>',
    calendar:'<svg viewBox="0 0 24 24"><path d="M5 4.5h14a2 2 0 0 1 2 2v12a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-12a2 2 0 0 1 2-2ZM7 2.5v4M17 2.5v4M3 9h18"/></svg>',
    bell:'<svg viewBox="0 0 24 24"><path d="M5 17h14l-1.5-2.2V10a5.5 5.5 0 0 0-11 0v4.8L5 17Z"/><path d="M9.5 19.5a2.8 2.8 0 0 0 5 0"/></svg>',
    people:'<svg viewBox="0 0 24 24"><path d="M9.5 11a3.5 3.5 0 1 0 0-7 3.5 3.5 0 0 0 0 7ZM3 20c.4-4.3 2.6-6.5 6.5-6.5S15.6 15.7 16 20"/><path d="M16 11a3 3 0 1 0 0-6M16.2 14c2.8.1 4.4 2.1 4.8 5"/></svg>',
    building:'<svg viewBox="0 0 24 24"><path d="M4 21V8l8-4 8 4v13M2 21h20M8 11h2M14 11h2M8 15h2M14 15h2M10 21v-3h4v3"/></svg>',
    note:'<svg viewBox="0 0 24 24"><path d="M5 3.5h11l3 3V20a1 1 0 0 1-1 1H5a1 1 0 0 1-1-1V4.5a1 1 0 0 1 1-1Z"/><path d="M15.5 3.5V7H19M8 11h8M8 15h6"/></svg>',
    infinity:'<svg viewBox="0 0 24 24"><path d="M8.2 8.2c-2.5 0-4.2 1.7-4.2 3.8s1.7 3.8 4.2 3.8c3.2 0 4.4-7.6 7.6-7.6 2.5 0 4.2 1.7 4.2 3.8s-1.7 3.8-4.2 3.8c-3.2 0-4.4-7.6-7.6-7.6Z"/></svg>',
    chart:'<svg viewBox="0 0 24 24"><path d="M5 20V10M10 20V5M15 20v-8M20 20V3"/></svg>',
    search:'<svg viewBox="0 0 24 24"><circle cx="10.5" cy="10.5" r="6.5"/><path d="m15.5 15.5 5 5"/></svg>',
    card:'<svg viewBox="0 0 24 24"><rect x="3" y="5" width="18" height="14" rx="3"/><path d="M3 9h18M7 14h4"/></svg>',
    phone:'<svg viewBox="0 0 24 24"><path d="M7 3h3l1.3 4-2 1.6a15 15 0 0 0 6.1 6.1l1.6-2 4 1.3v3c0 1.1-.9 2-2 2C10.7 19 5 13.3 5 5a2 2 0 0 1 2-2Z"/></svg>',
    message:'<svg viewBox="0 0 24 24"><path d="M4 4h16v12H8l-4 4V4Z"/></svg>',
    pencil:'<svg viewBox="0 0 24 24"><path d="m4 20 4.2-1 10.6-10.6-3.2-3.2L5 15.8 4 20ZM14.5 6.3l3.2 3.2"/></svg>',
    moneyplus:'<svg viewBox="0 0 24 24"><circle cx="9" cy="12" r="6"/><path d="M9 8.5v7M6.8 10.2c.8-1.3 4.7-1.2 4.5.8-.2 1.8-4.7.8-4.5 3 .2 2 4.2 2.1 4.8.5M18 8v8M14 12h8"/></svg>',
    free:'<svg viewBox="0 0 24 24"><path d="M4 5h16v14H4zM8 3v4M16 3v4M7 11h10M7 15h6"/></svg>'
  };

  const defaults = {
    theme:'light', screen:'home', clientFilter:'all', clubFilter:'active', selectedDate:'2026-06-14',
    calendarView:'day', calendarExpanded:true, allTab:'trainings', incomeGranularity:'month', trainingsGranularity:'month',
    settings:{calendar:true,notifications:true,backup:true,clubs:true,online:true},
    clients:[
      {id:1,name:'Анна Ковалёва',type:'Персональная',club:'Iron Club',balance:120,currency:'€',remaining:6,next:'18 июня · 18:00',messenger:true,active:true,notes:2},
      {id:2,name:'Mark Evans',type:'Онлайн',club:'London · GMT+1',balance:-35,currency:'£',remaining:3,next:'15 июня · 10:00',messenger:true,active:true,notes:1},
      {id:3,name:'Диана Садыкова',type:'Онлайн',club:'Алматы · GMT+5',balance:18000,currency:'₸',remaining:8,next:'17 июня · 09:00',messenger:false,active:true,notes:1},
      {id:4,name:'Максим Орлов',type:'Персональная',club:'TWORK Studio',balance:0,currency:'€',remaining:2,next:'14 июня · 10:00',messenger:true,active:true,notes:0},
      {id:5,name:'Елена Миронова',type:'Персональная',club:'Без клуба',balance:-70,currency:'€',remaining:0,next:'Нет записи',messenger:false,active:false,notes:1}
    ],
    clubs:[
      {id:1,name:'Iron Club',balance:-310,currency:'€',active:true,clients:8,contact:'Мария · +421 900 111 222',group:2,duty:'4 / 6 смен'},
      {id:2,name:'TWORK Studio',balance:110,currency:'€',active:true,clients:5,contact:'Алексей · Telegram',group:1,duty:'Без плана'},
      {id:3,name:'Online Club',balance:0,currency:'€',active:true,clients:3,contact:'Без контакта',group:0,duty:'Не используется'},
      {id:4,name:'Old Fitness',balance:0,currency:'€',active:false,clients:0,contact:'—',group:0,duty:'—'}
    ],
    trainings:[
      {id:1,date:'2026-06-14',time:'10:00',duration:60,title:'Сплит-тренировка',client:'Максим и Олег',location:'TWORK Studio',type:'training',status:'planned'},
      {id:2,date:'2026-06-14',time:'15:00',duration:180,title:'Дежурство',client:'Iron Club',location:'до 18:00',type:'duty',status:'planned'},
      {id:3,date:'2026-06-14',time:'18:00',duration:60,title:'Персональная',client:'Анна Ковалёва',location:'Iron Club',type:'training',status:'planned'},
      {id:4,date:'2026-06-15',time:'10:00',duration:60,title:'Онлайн · Лондон',client:'Mark Evans',location:'09:00 по клиенту',type:'training',status:'planned'},
      {id:5,date:'2026-06-16',time:'19:30',duration:90,title:'Групповая',client:'TWORK Studio',location:'6 участников',type:'event',status:'planned'},
      {id:6,date:'2026-06-18',time:'18:00',duration:60,title:'Персональная',client:'Анна Ковалёва',location:'7 из 8',type:'training',status:'planned'},
      {id:7,date:'2026-06-20',time:'12:00',duration:300,title:'Дежурство',client:'Iron Club',location:'до 17:00',type:'duty',status:'planned'},
      {id:8,date:'2026-06-23',time:'09:00',duration:60,title:'Онлайн',client:'Диана Садыкова',location:'Алматы',type:'training',status:'planned'},
      {id:9,date:'2026-06-25',time:'17:00',duration:60,title:'Персональная',client:'Елена Миронова',location:'Iron Club',type:'training',status:'cancelled'}
    ],
    notes:[
      {client:'Анна Ковалёва',text:'После прошлой тренировки уменьшить нагрузку на колено.'},
      {client:'Mark Evans',text:'Отправить новую ссылку на комплекс упражнений.'},
      {client:'Диана Садыкова',text:'Предпочитает утренние тренировки по времени клиента.'}
    ],
    notifications:[
      {client:'Анна Ковалёва',text:'Напоминание о тренировке завтра в 18:00',sent:false},
      {client:'Mark Evans',text:'Your online session starts tomorrow at 09:00',sent:false},
      {client:'Елена Миронова',text:'Напоминание об оплате € 70',sent:false},
      {client:'Диана Садыкова',text:'У вас осталось 2 тренировки',sent:false},
      {client:'Максим Орлов',text:'Тренировка перенесена на 16 июня',sent:false}
    ]
  };

  let state = load();
  function load(){try{return {...structuredClone(defaults),...JSON.parse(localStorage.getItem(storageKey)||'{}')}}catch{return structuredClone(defaults)}}
  function save(){localStorage.setItem(storageKey,JSON.stringify(state))}
  function setIcons(r=document){$$('[data-icon]',r).forEach(el=>el.innerHTML=icons[el.dataset.icon]||'')}
  function money(n,c){return `${n<0?'−':''}${c} ${Math.abs(n).toLocaleString('ru-RU')}`}
  function isoDate(day){return `2026-06-${String(day).padStart(2,'0')}`}
  function dateText(iso){return new Date(iso+'T12:00:00').toLocaleDateString('ru-RU',{day:'numeric',month:'long'})}
  function relative(iso){return iso==='2026-06-14'?'Сегодня':iso==='2026-06-15'?'Завтра':''}
  function statusText(status){return status==='cancelled'?'Отменена':status==='done'?'Проведена':''}
  function trainingTitle(t){return t.client?`${t.time}  ${t.client}`:`${t.time}  ${t.title}`}

  function rowsForHome(date){const rows=state.trainings.filter(t=>t.date===date);return rows.length?rows.map(t=>`<div class="training-row"><time>${t.time}</time><div><b>${t.client||t.title}</b></div>${statusText(t.status)?`<em>${statusText(t.status)}</em>`:''}</div>`).join(''):'<div style="padding:8px 0;color:var(--secondary);font-size:13px">Нет тренировок</div>'}
  function rowsForList(date){const rows=state.trainings.filter(t=>t.date===date);return rows.length?rows.map(t=>`<div class="training-row"><time>${t.time}</time><div><b>${t.title}</b><small>${t.client} · ${t.location}</small></div>${statusText(t.status)?`<em>${statusText(t.status)}</em>`:''}</div>`).join(''):'<div style="padding:16px 0;color:var(--secondary);font-size:12px;text-align:center">Нет записей</div>'}

  function actionCard({id,title,subtitle,icon,g1,g2,badge,special}){
    const trailing=special?`<span class="special-trailing"><button class="mini-circle" data-quick="${special}" aria-label="Добавить"><span data-icon="${special==='topup'?'moneyplus':'note'}"></span></button><span class="chevron"></span></span>`:'<span class="chevron"></span>';
    return `<button class="home-action" data-open="${id}"><span class="action-icon" style="--g1:${g1};--g2:${g2}"><span data-icon="${icon}"></span>${badge?`<span class="badge">${badge}</span>`:''}</span><span class="action-copy"><h3>${title}</h3><p>${subtitle}</p></span>${trailing}</button>`
  }

  function renderHome(){
    const drafts=state.notifications.filter(n=>!n.sent).length;
    $('#home-content').innerHTML=`
      <article class="schedule-card">
        <div class="card-heading" data-calendar-open="expanded"><h2>Тренировки</h2><span class="chevron"></span></div>
        <div class="day-block" data-calendar-date="2026-06-14"><div class="day-title"><b>Сегодня</b><span class="chevron"></span></div>${rowsForHome('2026-06-14')}</div>
        <div class="day-block" data-calendar-date="2026-06-15"><div class="day-title"><b>Завтра</b><span class="chevron"></span></div>${rowsForHome('2026-06-15')}</div>
      </article>
      ${drafts?actionCard({id:'notifications',title:'Уведомления',subtitle:`${drafts} к отправке`,icon:'bell',g1:'#c79feb',g2:'#a880d6',badge:String(drafts)}):''}
      ${actionCard({id:'online',title:'Онлайн',subtitle:'Нужно закрыть доступ к онлайн-ресурсам',icon:'list',g1:'#8cc7d9',g2:'#73a6c7',badge:'1'})}
      ${actionCard({id:'clients',title:'Клиенты',subtitle:'У вас 2 должника',icon:'people',g1:'#d9b89e',g2:'#bf9980',badge:'2',special:'topup'})}
      ${actionCard({id:'clubs',title:'Клубы',subtitle:'Клиенты, правила дохода и взаиморасчёты',icon:'building',g1:'#e493a4',g2:'#cf6f84'})}
      ${actionCard({id:'notes',title:'Заметки',subtitle:'3 заметки по клиентам',icon:'note',g1:'#ffe78a',g2:'#f6c246',special:'note'})}
      ${actionCard({id:'subscriptions',title:'Абонементы',subtitle:'Управление абонементами',icon:'infinity',g1:'#99b3e6',g2:'#8094cc'})}
      ${actionCard({id:'overview',title:'Обзор месяца',subtitle:'Июнь: € 4 280 + ₽ 164 000 + £ 780 · 28 тренировок',icon:'chart',g1:'#b8d6b3',g2:'#8cb899'})}`;
    setIcons($('#home-content'));
  }

  function navBar(title,{subtitle='',back='home',right=[]}={}){
    return `<div class="safe-top"></div><header class="nav-bar"><button class="nav-icon-button" data-back="${back}" aria-label="Назад"><span data-icon="${back==='home'?'close':'back'}"></span></button><div class="nav-title"><h1>${title}</h1>${subtitle?`<p>${subtitle}</p>`:''}</div><div class="nav-actions">${right.map(x=>`<button class="nav-icon-button" ${x.attr||''} aria-label="${x.label}"><span data-icon="${x.icon}"></span></button>`).join('')}</div></header>`
  }

  function openScreen(name,payload={}){
    state.screen=name;save();const el=$('#detail-screen');el.innerHTML=renderScreen(name,payload);setIcons(el);bindDetail(el,payload);$('#home-screen').classList.remove('active');el.classList.add('active');
  }
  function closeHome(){state.screen='home';save();$('#detail-screen').classList.remove('active');$('#home-screen').classList.add('active');renderHome()}

  function renderScreen(name,payload){
    if(name==='calendar')return calendarScreen();
    if(name==='clients')return clientsScreen();
    if(name==='client')return clientScreen(payload.id);
    if(name==='overview')return overviewScreen();
    if(name==='clubs')return clubsScreen();
    if(name==='club')return clubScreen(payload.id);
    if(name==='notifications')return notificationsScreen();
    if(name==='subscriptions')return subscriptionsScreen();
    if(name==='notes')return notesScreen();
    if(name==='online')return onlineScreen();
    if(name==='settings')return settingsScreen();
    return `<div class="detail-root">${navBar('TWORK')}<div class="detail-scroll"></div></div>`
  }

  function calendarCell(day,week=false){const iso=isoDate(day);const items=state.trainings.filter(t=>t.date===iso);const training=items.filter(t=>t.type==='training').length;return `<button class="calendar-cell ${iso===state.selectedDate?'selected':''} ${day===14?'today':''}" data-date="${iso}"><span class="n">${day}</span>${training?`<span class="train-count">${training}</span>`:''}${items.some(x=>x.type==='event')?'<div class="line-marker event"></div>':''}${items.some(x=>x.type==='duty')?'<div class="line-marker duty"></div>':''}</button>`}
  function monthGrid(){return Array.from({length:35},(_,i)=>calendarCell(i+1)).join('')}
  function weekGrid(){const d=Number(state.selectedDate.slice(-2));const start=Math.max(1,d-((new Date(state.selectedDate+'T12:00').getDay()+6)%7));return Array.from({length:7},(_,i)=>calendarCell(start+i,true)).join('')}
  function timeline(){const items=state.trainings.filter(t=>t.date===state.selectedDate);return `<div class="timeline-grid">${Array.from({length:13},(_,i)=>`<div class="timeline-hour" style="top:${i/12*100}%"><span>${String(i+8).padStart(2,'0')}:00</span></div>`).join('')}${items.map(t=>{const [h,m]=t.time.split(':').map(Number);const top=Math.max(0,((h-8)*60+m)/(12*60)*100);const height=Math.max(8,t.duration/(12*60)*100);return `<button class="timeline-event ${t.type}" style="top:${top}%;height:${height}%" data-toast="Открыта тренировка ${t.client}"><b>${t.time} · ${t.title}</b><small>${t.client} · ${t.location}</small></button>`}).join('')}</div>`}
  function allGroups(){const source=state.trainings.filter(t=>state.allTab==='events'?t.type==='event':t.type!=='event');const dates=[...new Set(source.map(x=>x.date))].sort();return dates.map(d=>`<div class="all-group"><h3>${dateText(d)}</h3><div class="selected-day-list">${source.filter(x=>x.date===d).map(t=>`<div class="training-row"><time>${t.time}</time><div><b>${t.title}</b><small>${t.client} · ${t.location}</small></div></div>`).join('')}</div></div>`).join('')||'<div class="selected-day-list">Нет данных</div>'}
  function calendarScreen(){
    const right=[{icon:state.calendarView==='all'?'calendar':'list',label:'Переключить вид',attr:'data-calendar-list'},{icon:'plus',label:'Добавить тренировку',attr:'data-add-training'}];
    if(state.calendarView==='all')return `<div class="detail-root">${navBar('Календарь',{right})}<div class="detail-scroll"><div class="segmented" style="--segments:2"><button class="${state.allTab==='trainings'?'active':''}" data-all-tab="trainings">Тренировки</button><button class="${state.allTab==='events'?'active':''}" data-all-tab="events">События</button></div><div style="height:12px"></div>${allGroups()}</div></div>`;
    return `<div class="detail-root">${navBar('Июнь 2026',{right})}<div class="detail-scroll"><div class="calendar-mode-row"><div class="segmented" style="--segments:2"><button class="${state.calendarView==='day'?'active':''}" data-calendar-mode="day">День</button><button class="${state.calendarView==='week'?'active':''}" data-calendar-mode="week">Неделя</button></div><button class="free-time" data-free-time>Свободное время</button></div>${state.calendarView==='day'?`<div class="week-labels">${['Пн','Вт','Ср','Чт','Пт','Сб','Вс'].map(x=>`<span>${x}</span>`).join('')}</div><div class="calendar-grid ${state.calendarExpanded?'':'week-strip'}">${state.calendarExpanded?monthGrid():weekGrid()}</div><button class="calendar-collapse ${state.calendarExpanded?'':'collapsed'}" data-calendar-expand><i></i></button><div class="calendar-period"><button data-shift-day="-1">‹</button><div class="period-title"><h2>${dateText(state.selectedDate)}</h2><p>${relative(state.selectedDate)}</p></div><button data-shift-day="1">›</button></div>${timeline()}`:weekView()}</div></div>`
  }
  function weekView(){const d=Number(state.selectedDate.slice(-2));const start=Math.max(1,d-((new Date(state.selectedDate+'T12:00').getDay()+6)%7));return `<div class="selected-day-list"><h3>Неделя</h3>${Array.from({length:7},(_,i)=>{const iso=isoDate(start+i);return `<button class="simple-list-card" data-date="${iso}" style="margin-bottom:8px"><div style="display:flex;justify-content:space-between"><b>${dateText(iso)}</b><span>${state.trainings.filter(t=>t.date===iso).length}</span></div>${rowsForList(iso)}</button>`}).join('')}</div>`}

  function clientRow(c){return `<button class="client-row" data-client="${c.id}"><div class="client-row-top"><h3>${c.name}</h3><div class="client-row-meta"><span class="type-badge ${c.type==='Онлайн'?'online':''}">${c.type}</span><span class="messenger-dot">${c.messenger?'✓':'–'}</span></div></div><div class="club-caption"><span data-icon="building"></span>${c.club}</div><div class="client-summary"><span class="${c.balance<0?'debt':c.balance>0?'positive':''}">Баланс: ${money(c.balance,c.currency)}</span><span>Осталось тренировок: ${c.remaining}</span><span>Следующая: ${c.next}</span></div></button>`}
  function clientsScreen(){const filtered=state.clients.filter(c=>state.clientFilter==='debt'?c.balance<0:state.clientFilter==='online'?c.type==='Онлайн':state.clientFilter==='personal'?c.type!=='Онлайн':state.clientFilter==='inactive'?!c.active:true);return `<div class="detail-root">${navBar('Клиенты',{right:[{icon:'plus',label:'Добавить клиента',attr:'data-add-client'}]})}<div class="detail-scroll"><div class="search-box"><span data-icon="search"></span><input id="client-search" placeholder="Поиск"></div><div class="chips">${[['all','Все'],['personal','Персональные'],['online','Онлайн'],['debt','Должники'],['inactive','Неактивные']].map(([id,l])=>`<button class="chip ${state.clientFilter===id?'active':''}" data-filter="${id}">${l}</button>`).join('')}</div><div class="list-stack" id="client-list">${filtered.map(clientRow).join('')}</div></div></div>`}
  function clientScreen(id){const c=state.clients.find(x=>x.id===id)||state.clients[0];return `<div class="detail-root">${navBar(c.name,{back:'clients'})}<div class="detail-scroll"><div class="club-detail-hero"><span class="status-badge">${c.active?'Активен':'Неактивен'}</span><h2>${c.name}</h2><p style="margin:0 0 12px;color:var(--secondary);font-size:11px">${c.type} · ${c.club}</p><div class="hero-actions"><button data-toast="Открыт мессенджер">Написать</button><button data-toast="Открыт телефон">Позвонить</button><button data-toast="Редактирование клиента">Изменить</button></div></div><div class="dashboard-grid"><div class="dashboard-panel relative"><button class="secondary-link" data-history>История</button><strong class="${c.balance<0?'debt':c.balance>0?'positive':''}">${money(c.balance,c.currency)}</strong><small>${c.balance<0?'Клиент должен вам':c.balance>0?'Предоплата':'Баланс закрыт'}</small><button data-client-action="payment" data-client-id="${c.id}">Принять оплату</button></div><div class="dashboard-panel"><strong>${c.remaining}</strong><small>Осталось тренировок</small><button data-client-action="training" data-client-id="${c.id}">Добавить</button></div><div class="dashboard-panel"><strong>${c.next}</strong><small>Следующая тренировка</small></div><div class="dashboard-panel"><strong>${c.notes}</strong><small>Заметки клиента</small><button data-toast="Открыты заметки">Открыть</button></div></div><div class="screen-section-title">Абонемент</div><div class="simple-list-card"><div style="display:flex;justify-content:space-between;gap:10px"><div><b>Персональные тренировки</b><p style="margin:5px 0 0;color:var(--secondary);font-size:11px">Действует до 31 июля</p></div><strong>${c.remaining} / 8</strong></div></div><div class="screen-section-title">Последние операции</div><div class="simple-list-card"><div class="history-row"><div><b>Тренировка</b><small>12 июня · 18:00</small></div><strong>− € 45</strong></div><div class="history-row"><div><b>Получена оплата</b><small>10 июня · Карта</small></div><strong class="received">+ € 150</strong></div></div></div></div>`}

  const chartData={
    day:{labels:['8 июн','9 июн','10 июн','11 июн','12 июн','13 июн','14 июн'],income:[120,90,180,0,220,160,310],trainings:[2,2,3,0,4,3,5],range:'Последние 7 дней'},
    week:{labels:['11 мая','18 мая','25 мая','1 июн','8 июн','15 июн'],income:[780,920,1050,1140,1320,4280],trainings:[12,15,17,18,21,28],range:'Последние 6 недель'},
    month:{labels:['Янв','Фев','Мар','Апр','Май','Июн'],income:[2900,3180,3470,3710,3950,4280],trainings:[19,20,22,24,25,28],range:'Последние 6 месяцев'},
    year:{labels:['2022','2023','2024','2025','2026'],income:[16800,24600,31800,42500,4280],trainings:[142,198,246,311,28],range:'Последние 5 лет'}
  };
  function picker(which,current){return `<div class="segmented" style="--segments:4">${[['day','День'],['week','Неделя'],['month','Месяц'],['year','Год']].map(([id,l])=>`<button class="${current===id?'active':''}" data-chart-picker="${which}" data-value="${id}">${l}</button>`).join('')}</div>`}
  function incomeChart(){const g=state.incomeGranularity,d=chartData[g],max=Math.max(...d.income);return `<div class="chart-card"><div class="chart-head"><small>Доход</small><strong>€ 4 280<br>+ ₽ 164 000 + £ 780</strong></div><div class="chart-range">${d.range}</div><div class="bars" style="--count:${d.income.length}">${d.income.map((v,i)=>`<div class="bar-wrap"><div class="bar ${i===d.income.length-1?'current':''}" style="--h:${Math.max(5,v/max*100)}%"></div>${i===d.income.length-1?'<span class="current-badge">Тек.</span>':''}<span class="bar-label ${i===d.income.length-1?'current':''}">${d.labels[i]}</span></div>`).join('')}</div>${g==='month'?'<div class="chart-average"><i></i>Среднее по полным месяцам</div>':''}${picker('income',g)}</div>`}
  function linePath(values){const max=Math.max(...values),w=300,h=115;return values.map((v,i)=>`${i?'L':'M'} ${(i/(values.length-1))*w} ${h-(v/max*h)}`).join(' ')}
  function trainingsChart(){const g=state.trainingsGranularity,d=chartData[g],max=Math.max(...d.trainings);return `<div class="chart-card"><div class="chart-head"><small>Тренировки</small><strong>${d.trainings[d.trainings.length-1]}</strong></div><div class="chart-range">${d.range}</div><div class="line-chart"><svg viewBox="0 0 300 145" preserveAspectRatio="none"><path d="${linePath(d.trainings)}" stroke="var(--trainings)" stroke-width="3" fill="none"/>${d.trainings.map((v,i)=>`<circle cx="${i/(d.trainings.length-1)*300}" cy="${115-v/max*115}" r="${i===d.trainings.length-1?5:3}" fill="${i===d.trainings.length-1?'var(--trainings)':'var(--trainings-muted)'}"/>`).join('')}</svg>${d.labels.map((l,i)=>`<span class="bar-label ${i===d.labels.length-1?'current':''}" style="left:${i/(d.labels.length-1)*94+3}%;bottom:-17px">${l}</span>`).join('')}</div>${g==='month'?'<div class="chart-average"><i></i>Среднее по полным месяцам</div>':''}${picker('trainings',g)}</div>`}
  function overviewScreen(){return `<div class="detail-root">${navBar('Обзор месяца',{subtitle:'Июнь 2026'})}<div class="detail-scroll"><h2 class="report-title">Доход и тренировки</h2>${incomeChart()}${trainingsChart()}<div class="metric-grid"><div class="metric-card"><small>Проведено</small><strong>28 тренировок</strong></div><div class="metric-card"><small>Планируется</small><strong>12 тренировок</strong></div><div class="metric-card"><small>Клиенты</small><strong>4 новых</strong></div><div class="metric-card"><small>Баланс</small><strong class="debt">2 с долгом</strong></div></div></div></div>`}

  function settlement(c){if(c.balance<0)return{amount:-c.balance,status:'Клуб должен вам',cls:'positive'};if(c.balance>0)return{amount:c.balance,status:'Вы должны клубу',cls:'debt'};return{amount:0,status:'Расчёт закрыт',cls:''}}
  function clubListCard(c){const s=settlement(c);return `<button class="club-list-card" data-club="${c.id}"><h3>${c.name}</h3><p class="${s.cls}">Заработано: ${money(s.amount,c.currency)}</p><p class="${s.cls}">${s.status}</p></button>`}
  function clubsScreen(){const list=state.clubs.filter(c=>state.clubFilter==='inactive'?!c.active:c.active);return `<div class="detail-root">${navBar('Клубы',{right:[{icon:'plus',label:'Добавить клуб',attr:'data-add-club'}]})}<div class="detail-scroll"><div class="search-box"><span data-icon="search"></span><input id="club-search" placeholder="Поиск"></div><div class="chips"><button class="chip ${state.clubFilter==='active'?'active':''}" data-club-filter="active">Активные</button><button class="chip ${state.clubFilter==='inactive'?'active':''}" data-club-filter="inactive">Деактивированные</button></div><div class="list-stack" id="club-list">${list.map(clubListCard).join('')}</div></div></div>`}
  function clubScreen(id){const c=state.clubs.find(x=>x.id===id)||state.clubs[0],s=settlement(c);return `<div class="detail-root">${navBar('',{back:'clubs'})}<div class="detail-scroll"><div class="club-detail-hero"><span class="status-badge">${c.active?'Активен':'Деактивирован'}</span><h2>${c.name}</h2><p style="margin:0 0 13px;color:var(--secondary);font-size:11px">${c.contact}</p><div class="hero-actions"><button data-toast="Открыт мессенджер">Написать</button><button data-toast="Открыт телефон">Позвонить</button><button data-toast="Редактирование клуба">Изменить</button></div></div><div class="dashboard-grid"><div class="dashboard-panel relative"><button class="secondary-link" data-club-pay="${c.id}">Оплатить клубу</button><strong class="${s.cls}">${money(s.amount,c.currency)}</strong><small class="${s.cls}">${s.status}</small><button data-club-settle="${c.id}">Рассчитаться</button></div><div class="dashboard-panel"><strong>${c.clients}</strong><small>Клиентов закреплено за клубом</small><button data-toast="Открыт список клиентов">Добавить</button></div><div class="dashboard-panel"><strong>${c.group}</strong><small>Ближайшие групповые тренировки</small><button data-toast="Открыто добавление групповой">Добавить</button></div><div class="dashboard-panel"><strong>${c.duty}</strong><small>Дежурство</small><button data-toast="Открыто планирование дежурства">Запланировать</button></div></div><div class="screen-section-title">История</div><div class="simple-list-card"><div class="history-row"><div><b>Персональная тренировка</b><small>14 июня · Анна</small></div><strong class="received">Получено € 45</strong></div><div class="history-row"><div><b>Комиссия клуба</b><small>14 июня · 20%</small></div><strong class="paid">Оплачено € 9</strong></div><div class="history-row"><div><b>Дежурство</b><small>12 июня · 3 часа</small></div><strong class="received">Получено € 60</strong></div></div></div></div>`}

  function notificationsScreen(){return `<div class="detail-root">${navBar('Уведомления')}<div class="detail-scroll"><div class="segmented" style="--segments:2"><button class="active">К отправке</button><button>Отправленные</button></div><div style="height:12px"></div>${state.notifications.map((n,i)=>`<div class="simple-list-card" style="margin-bottom:11px"><div style="display:flex;justify-content:space-between"><b>${n.client}</b><span style="color:var(--secondary);font-size:10px">${n.sent?'Отправлено':'Черновик'}</span></div><p style="font-size:12px;line-height:1.45;color:var(--secondary)">${n.text}</p><button class="chip ${n.sent?'':'active'}" data-notification="${i}">${n.sent?'Вернуть в черновики':'Отправлено'}</button></div>`).join('')}</div></div>`}
  function subscriptionsScreen(){return `<div class="detail-root">${navBar('Абонементы',{right:[{icon:'plus',label:'Добавить',attr:'data-toast="Открыто создание абонемента"'}]})}<div class="detail-scroll"><div class="chips"><button class="chip active">Активные</button><button class="chip">Заканчиваются</button><button class="chip">История</button></div><div class="list-stack">${state.clients.filter(c=>c.remaining>0).map(c=>`<button class="client-row" data-client="${c.id}"><div class="client-row-top"><h3>${c.name}</h3><strong>${c.remaining} / 8</strong></div><div class="client-summary"><span>Персональные тренировки</span><span>Действует до 31 июля</span></div></button>`).join('')}</div></div></div>`}
  function notesScreen(){return `<div class="detail-root">${navBar('Заметки',{right:[{icon:'plus',label:'Добавить заметку',attr:'data-add-note'}]})}<div class="detail-scroll">${state.notes.map(n=>`<div class="simple-list-card" style="margin-bottom:11px"><b>${n.client}</b><p style="margin:7px 0 0;color:var(--secondary);font-size:12px;line-height:1.45">${n.text}</p></div>`).join('')}</div></div>`}
  function onlineScreen(){return `<div class="detail-root">${navBar('Онлайн')}<div class="detail-scroll">${state.clients.filter(c=>c.type==='Онлайн').map(c=>`<div class="simple-list-card" style="margin-bottom:11px"><div style="display:flex;justify-content:space-between"><b>${c.name}</b><span class="type-badge online">Активен</span></div><p style="color:var(--secondary);font-size:12px">${c.club}</p><div style="display:flex;gap:8px"><button class="chip active" data-toast="Доступ продлён">Продлить доступ</button><button class="chip" data-toast="Открыты материалы">Материалы</button></div></div>`).join('')}</div></div>`}
  function settingsScreen(){const row=(icon,title,sub,key)=>`<div class="settings-row"><span class="settings-icon" data-icon="${icon}"></span><div class="settings-copy"><b>${title}</b><small>${sub}</small></div>${key?`<button class="toggle ${state.settings[key]?'on':''}" data-setting="${key}"></button>`:'<span class="chevron"></span>'}</div>`;return `<div class="detail-root">${navBar('Настройки')}<div class="detail-scroll"><div class="screen-section-title">Основное</div><div class="settings-group">${row('calendar','Apple Calendar','Календари клиентов и тренера','calendar')}${row('bell','Уведомления','Шаблоны и черновики','notifications')}${row('building','Клубы и организации','Расчёты и правила дохода','clubs')}${row('list','Онлайн-доступ','Управление ресурсами','online')}</div><div class="screen-section-title">Данные</div><div class="settings-group">${row('card','Резервная копия iCloud','В демо данные сохраняются локально','backup')}</div><div class="screen-section-title">Оформление</div><div class="settings-group"><div class="settings-row"><span class="settings-icon" data-icon="gear"></span><div class="settings-copy"><b>Фирменная тема</b><small>${state.theme==='dark'?'Tiffany Dark':'Pink Light'}</small></div><button class="toggle ${state.theme==='dark'?'on':''}" id="theme-toggle"></button></div></div><div class="screen-section-title">Демо</div><div class="settings-group"><div class="settings-row"><span class="settings-icon" data-icon="note"></span><div class="settings-copy"><b>Сбросить демо-данные</b><small>Вернуть исходное наполнение</small></div><button class="chip" id="reset-demo">Сбросить</button></div></div></div></div>`}

  function bindDetail(el,payload){
    $$('[data-back]',el).forEach(b=>b.onclick=()=>b.dataset.back==='home'?closeHome():openScreen(b.dataset.back));
    $('[data-calendar-list]',el)?.addEventListener('click',()=>{state.calendarView=state.calendarView==='all'?'day':'all';save();openScreen('calendar')});
    $('[data-add-training]',el)?.addEventListener('click',()=>openSheet('training'));
    $$('[data-calendar-mode]',el).forEach(b=>b.onclick=()=>{state.calendarView=b.dataset.calendarMode;save();openScreen('calendar')});
    $('[data-free-time]',el)?.addEventListener('click',()=>freeTimeSheet());
    $('[data-calendar-expand]',el)?.addEventListener('click',()=>{state.calendarExpanded=!state.calendarExpanded;save();openScreen('calendar')});
    $$('[data-date]',el).forEach(b=>b.onclick=()=>{state.selectedDate=b.dataset.date;state.calendarView='day';save();openScreen('calendar')});
    $$('[data-shift-day]',el).forEach(b=>b.onclick=()=>{const d=new Date(state.selectedDate+'T12:00');d.setDate(d.getDate()+Number(b.dataset.shiftDay));state.selectedDate=d.toISOString().slice(0,10);save();openScreen('calendar')});
    $$('[data-all-tab]',el).forEach(b=>b.onclick=()=>{state.allTab=b.dataset.allTab;save();openScreen('calendar')});
    $$('[data-filter]',el).forEach(b=>b.onclick=()=>{state.clientFilter=b.dataset.filter;save();openScreen('clients')});
    $('#client-search',el)?.addEventListener('input',e=>{const q=e.target.value.toLowerCase();$('#client-list',el).innerHTML=state.clients.filter(c=>(c.name+c.club+c.type).toLowerCase().includes(q)).map(clientRow).join('');setIcons($('#client-list',el));$$('[data-client]',el).forEach(b=>b.onclick=()=>openScreen('client',{id:Number(b.dataset.client)}))});
    $$('[data-client]',el).forEach(b=>b.onclick=()=>openScreen('client',{id:Number(b.dataset.client)}));
    $('[data-add-client]',el)?.addEventListener('click',()=>openSheet('client'));
    $$('[data-client-action]',el).forEach(b=>b.onclick=()=>openSheet(b.dataset.clientAction,Number(b.dataset.clientId)));
    $$('[data-chart-picker]',el).forEach(b=>b.onclick=()=>{state[`${b.dataset.chartPicker}Granularity`]=b.dataset.value;save();openScreen('overview')});
    $$('[data-club-filter]',el).forEach(b=>b.onclick=()=>{state.clubFilter=b.dataset.clubFilter;save();openScreen('clubs')});
    $('#club-search',el)?.addEventListener('input',e=>{const q=e.target.value.toLowerCase();$('#club-list',el).innerHTML=state.clubs.filter(c=>c.name.toLowerCase().includes(q)).map(clubListCard).join('');$$('[data-club]',el).forEach(b=>b.onclick=()=>openScreen('club',{id:Number(b.dataset.club)}))});
    $$('[data-club]',el).forEach(b=>b.onclick=()=>openScreen('club',{id:Number(b.dataset.club)}));
    $('[data-add-club]',el)?.addEventListener('click',()=>openSheet('club'));
    $$('[data-club-settle]',el).forEach(b=>b.onclick=()=>openSheet('settle',Number(b.dataset.clubSettle)));
    $$('[data-club-pay]',el).forEach(b=>b.onclick=()=>openSheet('payclub',Number(b.dataset.clubPay)));
    $$('[data-notification]',el).forEach(b=>b.onclick=()=>{const n=state.notifications[Number(b.dataset.notification)];n.sent=!n.sent;save();openScreen('notifications')});
    $('[data-add-note]',el)?.addEventListener('click',()=>openSheet('note'));
    $$('[data-setting]',el).forEach(b=>b.onclick=()=>{state.settings[b.dataset.setting]=!state.settings[b.dataset.setting];save();openScreen('settings');toast('Настройка сохранена')});
    $('#theme-toggle',el)?.addEventListener('click',toggleTheme);
    $('#reset-demo',el)?.addEventListener('click',()=>{localStorage.removeItem(storageKey);location.reload()});
    $$('[data-toast]',el).forEach(b=>b.onclick=()=>toast(b.dataset.toast));
  }

  function freeTimeSheet(){openCustomSheet('Свободное время','Подходящие интервалы на этой неделе','<div class="list-stack"><button class="simple-list-card" data-sheet-toast="Интервал скопирован">Понедельник · 12:00–15:00</button><button class="simple-list-card" data-sheet-toast="Интервал скопирован">Среда · 09:00–12:00</button><button class="simple-list-card" data-sheet-toast="Интервал скопирован">Пятница · 14:00–18:00</button></div>')}
  function openSheet(type,id){
    if(type==='settle'||type==='payclub'){const c=state.clubs.find(x=>x.id===id),s=settlement(c),pay=type==='payclub';return openFormSheet(pay?'Оплатить клубу':'Рассчитаться',pay?'Запишите сумму, которую нужно выплатить клубу.':'Обнулите текущий взаиморасчёт или внесите аванс.',`<label>Сумма<input name="amount" type="number" value="${pay?50:s.amount}" min="0"></label>${!pay?'<label style="display:flex;grid-template-columns:1fr auto;align-items:center"><span>Аванс</span><input name="advance" type="checkbox" style="width:24px;min-height:24px"></label>':''}<label>Комментарий<input name="comment" placeholder="Необязательно"></label>`,fd=>{if(pay)c.balance+=Number(fd.get('amount'));else c.balance=fd.get('advance')?Number(fd.get('amount')):0;save();openScreen('club',{id:c.id});toast('Операция сохранена')})}
    if(type==='client')return openFormSheet('Новый клиент','Добавьте клиента в демо.',`<label>Имя<input name="name" required placeholder="Имя клиента"></label><label>Тип<select name="type"><option>Персональная</option><option>Онлайн</option></select></label><label>Валюта<select name="currency"><option>€</option><option>£</option><option>₽</option><option>₸</option></select></label>`,fd=>{const name=String(fd.get('name'));state.clients.push({id:Date.now(),name,type:String(fd.get('type')),club:'Без клуба',balance:0,currency:String(fd.get('currency')),remaining:0,next:'Нет записи',messenger:false,active:true,notes:0});save();openScreen('clients');toast('Клиент добавлен')});
    if(type==='club')return openFormSheet('Новый клуб','Основная информация о клубе.',`<label>Название<input name="name" required placeholder="Название клуба"></label><label>Валюта<select name="currency"><option>€</option><option>£</option><option>₽</option></select></label>`,fd=>{state.clubs.push({id:Date.now(),name:String(fd.get('name')),balance:0,currency:String(fd.get('currency')),active:true,clients:0,contact:'Без контакта',group:0,duty:'Без плана'});save();openScreen('clubs');toast('Клуб добавлен')});
    if(type==='note')return openFormSheet('Новая заметка','Заметка будет привязана к клиенту.',`<label>Клиент<select name="client">${state.clients.map(c=>`<option>${c.name}</option>`).join('')}</select></label><label>Текст<textarea name="text" rows="4" required></textarea></label>`,fd=>{state.notes.unshift({client:String(fd.get('client')),text:String(fd.get('text'))});save();openScreen('notes');toast('Заметка сохранена')});
    const c=state.clients.find(x=>x.id===id)||state.clients[0],payment=type==='payment';
    if(payment)return openFormSheet('Принять оплату','Баланс клиента обновится в демо.',`<label>Клиент<select name="client">${state.clients.map(x=>`<option value="${x.id}" ${x.id===c.id?'selected':''}>${x.name}</option>`).join('')}</select></label><label>Сумма<input name="amount" type="number" value="50" min="1"></label><label>Комментарий<input name="comment" placeholder="Необязательно"></label>`,fd=>{const target=state.clients.find(x=>x.id===Number(fd.get('client')));target.balance+=Number(fd.get('amount'));save();toast('Оплата сохранена');if(state.screen==='client')openScreen('client',{id:target.id});else renderHome()});
    return openFormSheet('Новая тренировка','Поля повторяют основной сценарий создания тренировки.',`<label>Клиент<select name="client">${state.clients.map(x=>`<option value="${x.id}" ${x.id===c.id?'selected':''}>${x.name}</option>`).join('')}</select></label><div style="display:grid;grid-template-columns:1fr 1fr;gap:9px"><label>Дата<input name="date" type="date" value="${state.selectedDate}"></label><label>Время<input name="time" type="time" value="18:00"></label></div><label>Тип<select name="kind"><option>Персональная</option><option>Онлайн</option><option>Сплит</option><option>Групповая</option><option>Дежурство</option></select></label><label>Место<input name="location" value="Iron Club"></label><label>Оплату получает<select name="payer"><option>Я</option><option>Клуб</option></select></label>`,fd=>{const target=state.clients.find(x=>x.id===Number(fd.get('client'))),kind=String(fd.get('kind'));state.trainings.push({id:Date.now(),date:String(fd.get('date')),time:String(fd.get('time')),duration:kind==='Дежурство'?180:60,title:kind,client:target.name,location:String(fd.get('location')),type:kind==='Дежурство'?'duty':kind==='Групповая'?'event':'training',status:'planned'});save();state.selectedDate=String(fd.get('date'));openScreen('calendar');toast('Тренировка сохранена')});
  }
  function openFormSheet(title,lead,fields,onSave){$('#sheet-card').innerHTML=`<div class="sheet-handle"></div><h2>${title}</h2><p>${lead}</p><form class="form" id="sheet-form">${fields}<div class="sheet-actions"><button type="button" class="cancel" id="sheet-cancel">Отмена</button><button class="save">Сохранить</button></div></form>`;openLayer();$('#sheet-cancel').onclick=closeSheet;$('#sheet-form').onsubmit=e=>{e.preventDefault();const fd=new FormData(e.currentTarget);closeSheet();onSave(fd)}}
  function openCustomSheet(title,lead,content){$('#sheet-card').innerHTML=`<div class="sheet-handle"></div><h2>${title}</h2><p>${lead}</p>${content}<div class="sheet-actions"><button class="cancel" id="sheet-cancel">Закрыть</button><span></span></div>`;openLayer();$('#sheet-cancel').onclick=closeSheet;$$('[data-sheet-toast]',$('#sheet-card')).forEach(b=>b.onclick=()=>toast(b.dataset.sheetToast))}
  function openLayer(){$('#sheet-layer').classList.add('open');$('#sheet-layer').setAttribute('aria-hidden','false')}
  function closeSheet(){$('#sheet-layer').classList.remove('open');$('#sheet-layer').setAttribute('aria-hidden','true')}
  function toast(t){const el=$('#toast');el.textContent=t;el.classList.add('show');clearTimeout(toast.timer);toast.timer=setTimeout(()=>el.classList.remove('show'),2200)}
  function toggleTheme(){state.theme=state.theme==='dark'?'light':'dark';root.dataset.theme=state.theme;save();renderHome();if(state.screen!=='home')openScreen(state.screen)}

  document.addEventListener('click',e=>{
    const settings=e.target.closest('[data-open="settings"]');if(settings)return openScreen('settings');
    const schedule=e.target.closest('[data-calendar-open]');if(schedule){state.calendarView='day';state.calendarExpanded=true;state.selectedDate='2026-06-14';save();return openScreen('calendar')}
    const day=e.target.closest('[data-calendar-date]');if(day){state.calendarView='day';state.calendarExpanded=false;state.selectedDate=day.dataset.calendarDate;save();return openScreen('calendar')}
    const quick=e.target.closest('[data-quick]');if(quick){e.preventDefault();e.stopPropagation();return openSheet(quick.dataset.quick==='topup'?'payment':'note')}
    const open=e.target.closest('[data-open]');if(open)return openScreen(open.dataset.open);
  });
  $('#sheet-layer').addEventListener('click',e=>{if(e.target===$('#sheet-layer'))closeSheet()});
  root.dataset.theme=state.theme;renderHome();setIcons();
})();
