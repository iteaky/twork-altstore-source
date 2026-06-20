(() => {
  if (window.__TWORK_QUIZ_V551_UI_PATCH__) return;
  window.__TWORK_QUIZ_V551_UI_PATCH__ = true;

  const copy = {
    sk:{price:'Cena',serviceType:'Typ služby',start:'Čas začiatku práce',end:'Čas konca práce',service:'Služba',calendarName:'Kalendár meno',imessage:'iMessage / SMS',copy:'Kopírovať text'},
    en:{price:'Price',serviceType:'Service type',start:'Start working time',end:'End working time',service:'Service',calendarName:'Calendar name',imessage:'iMessage / SMS',copy:'Copy text'},
    ru:{price:'Стоимость',serviceType:'Тип услуги',start:'Время начала работы',end:'Время окончания работы',service:'Услуга',calendarName:'Название календаря',imessage:'iMessage / SMS',copy:'Скопировать текст'},
    cs:{price:'Cena',serviceType:'Typ služby',start:'Začněte pracovní dobu',end:'Konec pracovní doby',service:'Služba',calendarName:'Název kalendáře',imessage:'iMessage / SMS',copy:'Kopírovat text'},
    hu:{price:'Ár',serviceType:'Szolgáltatás típusa',start:'Kezdjük a munkaidőt',end:'Munkaidő vége',service:'Szolgálat',calendarName:'Naptár név',imessage:'iMessage / SMS',copy:'Szöveg másolása'},
    pl:{price:'Cena',serviceType:'Typ usługi',start:'Czas pracy',end:'Koniec czasu pracy',service:'Służba',calendarName:'Nazwa kalendarza',imessage:'iMessage / SMS',copy:'Kopiuj tekst'},
    de:{price:'Preis',serviceType:'Dienstleistungstyp',start:'Arbeitsbeginn',end:'Arbeitsende',service:'Dienst',calendarName:'Kalendername',imessage:'iMessage / SMS',copy:'Text kopieren'},
    uk:{price:'Ціна',serviceType:'Тип послуги',start:'Починайте працювати',end:'Кінець робочого часу',service:'Служба',calendarName:'Назва календаря',imessage:'iMessage / SMS',copy:'Копіювати текст'},
    es:{price:'Precio',serviceType:'Tipo de servicio',start:'Empezar a trabajar',end:'Horario final de trabajo',service:'Servicio',calendarName:'Nombre del calendario',imessage:'iMessage / SMS',copy:'Copiar texto'},
    fr:{price:'Prix',serviceType:'Type de service',start:'Début du travail',end:'Fin de temps de travail',service:'Prestation',calendarName:'Nom du calendrier',imessage:'iMessage / SMS',copy:'Copier le texte'},
    pt:{price:'Preço',serviceType:'Tipo de serviço',start:'Horário de trabalho',end:'Horário final de trabalho',service:'Serviço',calendarName:'Nome do calendário',imessage:'iMessage / SMS',copy:'Copiar texto'},
    ar:{price:'السعر',serviceType:'نوع الخدمة',start:'ابدأ العمل',end:'وقت نهاية العمل',service:'الخدمة',calendarName:'اسم التقويم',imessage:'iMessage / SMS',copy:'نسخ النص'},
    'zh-Hans':{price:'价格',serviceType:'服务类型',start:'开始工作时间',end:'工作结束时间',service:'服役经历',calendarName:'日历名称',imessage:'iMessage / SMS',copy:'复制文本'},
    ja:{price:'価格',serviceType:'サービスの種類',start:'作業開始',end:'作業終了時間',service:'運用',calendarName:'カレンダー名',imessage:'iMessage / SMS',copy:'テキストをコピー'},
    ko:{price:'가격',serviceType:'서비스 유형',start:'근무 시작 시간',end:'근무 종료 시간',service:'운용',calendarName:'달력 이름',imessage:'iMessage / SMS',copy:'텍스트 복사'}
  };

  const paths = {
    person:'<circle cx="12" cy="7.5" r="3.5"/><path d="M5 21c.5-5 2.8-7.5 7-7.5s6.5 2.5 7 7.5"/>',
    video:'<rect x="3" y="6" width="13" height="12" rx="3"/><path d="m16 10 5-3v10l-5-3"/>',
    sparkles:'<path d="m12 2 1.5 4.5L18 8l-4.5 1.5L12 14l-1.5-4.5L6 8l4.5-1.5L12 2Z"/><path d="m19 14 .8 2.2L22 17l-2.2.8L19 20l-.8-2.2L16 17l2.2-.8L19 14Z"/>',
    people:'<circle cx="9" cy="8" r="3"/><path d="M3.5 19c.5-4 2.3-6 5.5-6s5 2 5.5 6"/><circle cx="17" cy="9" r="2.3"/><path d="M15 14c3.2-.2 5.1 1.5 5.5 4.5"/>',
    group:'<circle cx="12" cy="7" r="2.7"/><circle cx="5.5" cy="9" r="2"/><circle cx="18.5" cy="9" r="2"/><path d="M7 19c.4-4 2-6 5-6s4.6 2 5 6M2 19c.2-2.7 1.4-4.2 3.7-4.5M22 19c-.2-2.7-1.4-4.2-3.7-4.5"/>',
    building:'<path d="M4 21V7l8-4 8 4v14M2 21h20"/><path d="M8 9h2M14 9h2M8 13h2M14 13h2M8 17h2M14 17h2"/>',
    branch:'<path d="M6 4v9a4 4 0 0 0 4 4h8"/><path d="m15 14 3 3-3 3M6 8h5a4 4 0 0 0 4-4"/><circle cx="6" cy="4" r="2"/>',
    palette:'<path d="M12 3a9 9 0 1 0 0 18h1.2a2 2 0 0 0 0-4H12a1.6 1.6 0 0 1 0-3.2h3.5A5.5 5.5 0 0 0 21 8.3C21 5.4 17 3 12 3Z"/><circle cx="7" cy="10" r=".8"/><circle cx="9" cy="6.8" r=".8"/><circle cx="14" cy="6.5" r=".8"/>',
    iphone:'<rect x="7" y="2" width="10" height="20" rx="2.5"/><path d="M10 5h4M11 19h2"/>',
    sun:'<circle cx="12" cy="12" r="4"/><path d="M12 2v2M12 20v2M4.9 4.9l1.4 1.4M17.7 17.7l1.4 1.4M2 12h2M20 12h2M4.9 19.1l1.4-1.4M17.7 6.3l1.4-1.4"/>',
    moon:'<path d="M20 15.5A8.5 8.5 0 0 1 8.5 4 8.5 8.5 0 1 0 20 15.5Z"/>',
    classic:'<circle cx="8" cy="8" r="3"/><circle cx="16" cy="8" r="3"/><circle cx="8" cy="16" r="3"/><circle cx="16" cy="16" r="3"/>',
    calendar:'<rect x="3" y="5" width="18" height="16" rx="3"/><path d="M7 3v4M17 3v4M3 10h18"/><path d="M8 14h2M14 14h2M8 17h2"/>',
    calendarClock:'<rect x="3" y="4" width="18" height="17" rx="3"/><path d="M7 2v4M17 2v4M3 9h18"/><circle cx="15.5" cy="15.5" r="3.5"/><path d="M15.5 13.5v2l1.4.8"/>',
    clock:'<circle cx="12" cy="12" r="9"/><path d="M12 7v5l3 2"/>',
    subscription:'<rect x="5" y="4" width="13" height="15" rx="2"/><path d="M8 8h7M8 12h7M8 16h5M18 7h2v14H9v-2"/>',
    service:'<rect x="4" y="5" width="16" height="14" rx="3"/><path d="m12 8 .8 2.2L15 11l-2.2.8L12 14l-.8-2.2L9 11l2.2-.8L12 8Z"/>',
    banknote:'<rect x="3" y="6" width="18" height="12" rx="2"/><circle cx="12" cy="12" r="3"/><path d="M6 9h.01M18 15h.01"/>',
    wallet:'<path d="M4 6.5A2.5 2.5 0 0 1 6.5 4H18v4H6.5A2.5 2.5 0 0 0 4 10.5v7A2.5 2.5 0 0 0 6.5 20H20V8H6.5A2.5 2.5 0 0 0 4 10.5Z"/><path d="M15 12h5v4h-5a2 2 0 0 1 0-4Z"/>',
    percent:'<path d="m7 17 10-10"/><circle cx="7" cy="7" r="2"/><circle cx="17" cy="17" r="2"/>',
    sliders:'<path d="M4 7h5M15 7h5M4 17h9M17 17h3"/><circle cx="12" cy="7" r="3"/><circle cx="15" cy="17" r="2"/>',
    bell:'<path d="M5 17h14l-1.5-2.2V10a5.5 5.5 0 0 0-11 0v4.8L5 17Z"/><path d="M9.5 20a3 3 0 0 0 5 0"/>',
    message:'<path d="M4 5h16v12H9l-5 4V5Z"/><path d="M8 9h8M8 13h5"/>',
    folder:'<path d="M3 7h7l2 2h9v10a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V7Z"/><path d="M3 7V5a2 2 0 0 1 2-2h5l2 2h5"/>',
    import:'<path d="M12 3v12M7 10l5 5 5-5"/><path d="M5 20h14"/>',
    globe:'<circle cx="12" cy="12" r="9"/><path d="M3 12h18M12 3c2.5 2.5 3.8 5.5 3.8 9S14.5 18.5 12 21c-2.5-2.5-3.8-5.5-3.8-9S9.5 5.5 12 3Z"/>',
    duration:'<circle cx="12" cy="13" r="8"/><path d="M12 9v4l3 2M9 3h6M12 3v2"/>',
    plus:'<path d="M12 5v14M5 12h14"/>',
    minus:'<path d="M5 12h14"/>',
    check:'<path d="m5 12 4 4L19 6"/>',
    summary:'<path d="M6 6h15M6 12h15M6 18h15"/><circle cx="3" cy="6" r=".8"/><circle cx="3" cy="12" r=".8"/><circle cx="3" cy="18" r=".8"/>'
  };

  const svg = name => `<svg viewBox="0 0 24 24" aria-hidden="true" focusable="false">${paths[name] || paths.summary}</svg>`;
  const heroByStep = {welcome:'sparkles',language:'globe',clientLanguages:'people',theme:'palette',workFormat:'person',workplace:'building',clientCardIntro:'people',trainingLifecycle:'calendarClock',timeZones:'globe',duration:'duration',workingHours:'clock',subscriptions:'subscription',subscriptionExpiration:'calendarClock',subscriptionDurationTemplates:'subscription',subscriptionLifecycle:'subscription',serviceLifecycle:'service',paymentControl:'wallet',currencies:'banknote',clubs:'building',clubFeatures:'building',clubPayments:'wallet',clubOperations:'calendarClock',clubSummary:'summary',trainingPricesQuestion:'banknote',priceLocationMode:'sliders',trainingPrices:'banknote',groupPrices:'group',subscriptionPricesQuestion:'subscription',subscriptionPrices:'subscription',servicePrices:'service',notifications:'bell',notificationTypes:'bell',notificationScheduleMode:'calendarClock',notificationScheduleDetails:'sliders',defaultMessenger:'message',calendarTypesIntro:'calendar',calendar:'calendar',calendarNextSteps:'calendar',backup:'folder',dataImport:'import',done:'check'};
  const valueIcons = {personal:'person',onlineTraining:'video',onlineSupport:'sparkles',split:'people',group:'group',privateClients:'people',sameClub:'building',multipleClubs:'branch',system:'iphone',light:'sun',dark:'moon',classic:'classic',brand:'palette',withEndDate:'calendarClock',withoutEndDate:'calendarClock',mixed:'calendarClock',FULL_PRICE:'banknote',PERCENT_OF_FULL_PRICE:'percent',FIXED_AMOUNT:'banknote',NO_RETENTION:'minus',weekly:'calendarClock',separateRules:'sliders',defaultFolder:'folder',customFolder:'folder',imessage:'message',whatsapp:'message',telegram:'message',messenger:'message',copy:'message'};

  const style = document.createElement('style');
  style.textContent = `
    .twq6-root .twq6-symbol{display:inline-grid;place-items:center;color:var(--twq6-accent,#f64f93);font-size:0;line-height:1}
    .twq6-root .twq6-symbol svg{width:1.35rem;height:1.35rem;fill:none;stroke:currentColor;stroke-width:1.65;stroke-linecap:round;stroke-linejoin:round;pointer-events:none}
    .twq6-root .twq6-hero-icon .twq6-symbol svg{width:2rem;height:2rem}
    .twq6-root .twq6-card[aria-pressed="true"]>.twq6-symbol{color:#fff}
    .twq6-root .twq6-patch-meta{display:block;margin-top:.18rem;font-size:.7rem;font-weight:600;opacity:.55;letter-spacing:.02em}
    .twq6-root .twq6-calendar-name{display:block;margin-bottom:.18rem;font-size:.68rem;font-weight:700;opacity:.55;text-transform:uppercase;letter-spacing:.04em}
    .twq6-root .twq6-inline-primary .twq6-patch-inline-icon{display:inline-grid;margin-inline-end:.4rem;vertical-align:middle}
    .twq6-root .twq6-inline-primary .twq6-patch-inline-icon svg{width:1rem;height:1rem;fill:none;stroke:currentColor;stroke-width:1.8;stroke-linecap:round;stroke-linejoin:round}
  `;
  document.head.appendChild(style);

  const language = root => root.dataset.quizLanguage || document.documentElement.dataset.siteLanguage || 'en';
  const text = root => copy[language(root)] || copy.en;
  const setLabel = (field, label) => {
    const span = field?.querySelector(':scope > span');
    const input = field?.querySelector('input,select,textarea');
    if (span && span.textContent !== label) span.textContent = label;
    if (input && input.getAttribute('aria-label') !== label) input.setAttribute('aria-label', label);
  };
  const patchPriceFields = (root, t) => {
    root.querySelectorAll('.twq6-field-stack .twq6-field').forEach(field => {
      const input = field.querySelector('input[type="number"]');
      if (!input) return;
      const span = field.querySelector(':scope > span');
      const original = span?.textContent?.trim() || '';
      const code = (original.match(/[A-Z]{3}/) || input.dataset.field?.match(/\.([A-Z]{3})$/) || [])[0] || '';
      const html = `${t.price}${code ? `<small class="twq6-patch-meta">${code}</small>` : ''}`;
      if (span && span.innerHTML !== html) span.innerHTML = html;
      const aria = `${t.price}${code ? ` · ${code}` : ''}`;
      if (input.getAttribute('aria-label') !== aria) input.setAttribute('aria-label', aria);
    });
  };
  const iconName = (symbol, root) => {
    const card = symbol.closest('[data-value]');
    const value = card?.dataset.value;
    if (valueIcons[value]) return valueIcons[value];
    if (symbol.closest('.twq6-hero-icon')) return heroByStep[root.dataset.currentStep] || 'summary';
    const step = root.dataset.currentStep;
    const raw = symbol.textContent.trim();
    if (raw === '✓') return 'check';
    if (raw === '−') return 'minus';
    if (raw === '+') return 'plus';
    if (raw === '%') return 'percent';
    if (raw === '✉') return 'message';
    if (raw === '▦') return step?.includes('club') ? 'building' : 'calendar';
    if (raw === '◷') return step === 'duration' ? 'duration' : 'clock';
    if (raw === '¤') return 'banknote';
    if (raw === '▱') return 'folder';
    if (raw === '⇩') return 'import';
    if (raw === '☷') return 'sliders';
    if (raw === '◌') return 'bell';
    if (raw === '文' || raw === '◎') return step === 'language' || step === 'timeZones' ? 'globe' : 'people';
    return heroByStep[step] || 'summary';
  };

  const patch = root => {
    const t = text(root);
    root.querySelectorAll('.twq6-symbol:not([data-v551-icon])').forEach(symbol => {
      symbol.dataset.v551Icon = '1';
      symbol.innerHTML = svg(iconName(symbol, root));
    });

    if (root.dataset.currentStep === 'duration') {
      root.querySelectorAll('.twq6-duration-grid [data-value="75"]').forEach(button => button.remove());
    }

    if (root.dataset.currentStep === 'workingHours') {
      root.querySelectorAll('.twq6-time-row').forEach(row => {
        const fields = row.querySelectorAll('.twq6-field');
        setLabel(fields[0], t.start);
        setLabel(fields[1], t.end);
      });
    }

    if (['trainingPrices','groupPrices','subscriptionPrices','servicePrices'].includes(root.dataset.currentStep)) patchPriceFields(root, t);

    if (root.dataset.currentStep === 'servicePrices') {
      root.querySelectorAll('.twq6-services .twq6-panel').forEach(panel => {
        const heading = panel.querySelector('.twq6-panel-head strong');
        if (heading && heading.textContent !== t.service) heading.textContent = t.service;
        const first = panel.querySelector('.twq6-row .twq6-field');
        setLabel(first, t.serviceType);
      });
      root.querySelectorAll('[data-action="remove-service"]').forEach(button => button.setAttribute('aria-label', copy[language(root)]?.delete || 'Delete'));
      const add = root.querySelector('[data-action="add-service"]');
      if (add && !add.querySelector('.twq6-patch-inline-icon')) {
        add.innerHTML = `<span class="twq6-patch-inline-icon">${svg('plus')}</span>${add.textContent.replace(/^\s*[＋+]\s*/, '')}`;
      }
    }

    if (root.dataset.currentStep === 'defaultMessenger') {
      const labels = {imessage:t.imessage,messenger:'VK',copy:t.copy,whatsapp:'WhatsApp',telegram:'Telegram'};
      root.querySelectorAll('.twq6-card[data-value]').forEach(card => {
        const label = labels[card.dataset.value];
        const strong = card.querySelector('.twq6-copy strong');
        if (label && strong && strong.textContent !== label) strong.textContent = label;
      });
    }

    if (root.dataset.currentStep === 'calendar') {
      root.querySelectorAll('.twq6-calendar-preview > div').forEach(box => {
        if (!box.querySelector('.twq6-calendar-name')) box.insertAdjacentHTML('afterbegin', `<small class="twq6-calendar-name">${t.calendarName}</small>`);
      });
    }

    root.querySelectorAll('.twq6-field').forEach(field => {
      const label = field.querySelector(':scope > span')?.textContent?.trim();
      const control = field.querySelector('input,select,textarea');
      if (label && control && !control.getAttribute('aria-label')) control.setAttribute('aria-label', label);
    });
    root.querySelectorAll('.twq6-toggle').forEach(toggle => {
      const label = toggle.querySelector('strong')?.textContent?.trim();
      const input = toggle.querySelector('input');
      if (label && input) input.setAttribute('aria-label', label);
    });
  };

  const attach = root => {
    patch(root);
    new MutationObserver(() => patch(root)).observe(root, {childList:true,subtree:true,attributes:true,attributeFilter:['data-current-step','data-quiz-language']});
  };
  const existing = document.getElementById('twork-onboarding-quiz-v6');
  if (existing) attach(existing);
  else new MutationObserver((_, observer) => {
    const root = document.getElementById('twork-onboarding-quiz-v6');
    if (!root) return;
    observer.disconnect();
    attach(root);
  }).observe(document.documentElement, {childList:true,subtree:true});
})();
