(() => {
  const order = ['sk','en','ru','cs','hu','pl','de','uk','es','fr','pt','ar','zh-Hans','ja','ko'];
  const index = Object.fromEntries(order.map((code, position) => [code, position]));
  const rows = {
    trainings:['Tréningy','Trainings','Тренировки','Tréninky','Edzések','Treningi','Trainings','Тренування','Entrenamientos','Entraînements','Treinos','التدريبات','训练','トレーニング','트레이닝'],
    today:['Dnes','Today','Сегодня','Dnes','Ma','Dzisiaj','Heute','Сьогодні','Hoy',"Aujourd’hui",'Hoje','اليوم','今天','今日','오늘'],
    tomorrow:['Zajtra','Tomorrow','Завтра','Zítra','Holnap','Jutro','Morgen','Завтра','Mañana','Demain','Amanhã','غدًا','明天','明日','내일'],
    notifications:['Upozornenia','Notifications','Уведомления','Oznámení','Értesítések','Powiadomienia','Mitteilungen','Сповіщення','Notificaciones','Notifications','Notificações','الإشعارات','通知','通知','알림'],
    clients:['Klienti','Clients','Клиенты','Klienti','Ügyfelek','Klienci','Kunden','Клієнти','Clientes','Clients','Clientes','العملاء','客户','顧客','고객'],
    clubs:['Kluby','Clubs','Клубы','Kluby','Klubok','Kluby','Studios','Клуби','Clubes','Clubs','Clubes','الأندية','俱乐部','クラブ','클럽'],
    notes:['Poznámky','Notes','Заметки','Poznámky','Jegyzetek','Notatki','Notizen','Нотатки','Notas','Notes','Notas','الملاحظات','备注','メモ','메모'],
    memberships:['Permanentky','Memberships','Абонементы','Permanentky','Bérletek','Karnety','Mitgliedschaften','Абонементи','Bonos','Abonnements','Planos','الاشتراكات','课包','回数券','이용권'],
    monthlyOverview:['Mesačný prehľad','Monthly overview','Обзор месяца','Měsíční přehled','Havi áttekintés','Przegląd miesiąca','Monatsübersicht','Огляд місяця','Resumen mensual','Aperçu mensuel','Visão mensal','نظرة شهرية','月度概览','月間概要','월간 개요'],
    day:['Deň','Day','День','Den','Nap','Dzień','Tag','День','Día','Jour','Dia','اليوم','日','日','일'],
    week:['Týždeň','Week','Неделя','Týden','Hét','Tydzień','Woche','Тиждень','Semana','Semaine','Semana','الأسبوع','周','週','주'],
    freeTime:['Voľný čas','Free time','Свободное время','Volný čas','Szabad idő','Wolny czas','Freie Zeit','Вільний час','Tiempo libre','Temps libre','Tempo livre','الوقت المتاح','空闲时间','空き時間','가능 시간'],
    personal:['Osobný','Personal','Персональная','Osobní','Személyi','Personalny','Personal','Персональне','Personal','Personnel','Pessoal','شخصي','私教','パーソナル','퍼스널'],
    write:['Napísať','Write','Написать','Napsat','Írni','Napisz','Schreiben','Написати','Escribir','Écrire','Escrever','مراسلة','发消息','メッセージ','메시지'],
    call:['Zavolať','Call','Позвонить','Zavolat','Hívás','Zadzwoń','Anrufen','Зателефонувати','Llamar','Appeler','Ligar','اتصال','呼叫','電話','전화'],
    edit:['Upraviť','Edit','Изменить','Upravit','Szerkesztés','Edytuj','Bearbeiten','Змінити','Editar','Modifier','Editar','تعديل','编辑','編集','수정'],
    clientBalance:['Zostatok klienta','Client balance','Баланс клиента','Zůstatek klienta','Ügyfélegyenleg','Saldo klienta','Kundensaldo','Баланс клієнта','Saldo del cliente','Solde client','Saldo do cliente','رصيد العميل','客户余额','顧客残高','고객 잔액'],
    clubBalance:['Zostatok klubu','Club balance','Баланс клуба','Zůstatek klubu','Klubegyenleg','Saldo klubu','Studiosaldo','Баланс клубу','Saldo del club','Solde du club','Saldo do clube','رصيد النادي','俱乐部余额','クラブ残高','클럽 잔액'],
    history:['História','History','История','Historie','Előzmények','Historia','Verlauf','Історія','Historial','Historique','Histórico','السجل','历史','履歴','내역'],
    prepayment:['Preddavok','Prepayment','Предоплата','Záloha','Előleg','Przedpłata','Vorauszahlung','Передплата','Prepago','Prépaiement','Pré-pagamento','دفعة مقدمة','预付款','前払い','선결제'],
    upcoming:['Najbližšie tréningy','Upcoming trainings','Ближайшие тренировки','Nadcházející tréninky','Közelgő edzések','Nadchodzące treningi','Nächste Trainings','Найближчі тренування','Próximos entrenamientos','Prochains entraînements','Próximos treinos','التدريبات القادمة','即将开始的训练','今後のトレーニング','예정 트레이닝'],
    all:['Všetko','All','Все','Vše','Összes','Wszystkie','Alle','Усі','Todo','Tout','Todos','الكل','全部','すべて','전체'],
    services:['Služby','Services','Услуги','Služby','Szolgáltatások','Usługi','Services','Послуги','Servicios','Services','Serviços','الخدمات','服务','サービス','서비스'],
    onlineCoaching:['Online vedenie','Online coaching','Онлайн-ведение','Online vedení','Online coaching','Prowadzenie online','Online-Betreuung','Онлайн-супровід','Seguimiento online','Coaching en ligne','Acompanhamento online','تدريب عبر الإنترنت','在线指导','オンライン指導','온라인 코칭'],
    active:['Aktívny','Active','Активен','Aktivní','Aktív','Aktywny','Aktiv','Активний','Activo','Actif','Ativo','نشط','启用','有効','활성'],
    administrator:['administrátorka','administrator','администратор','administrátorka','adminisztrátor','administrator','Administratorin','адміністратор','administradora','administratrice','administradora','مسؤولة','管理员','管理者','관리자'],
    toReceive:['Na vyplatenie','To receive','К выплате','K vyplacení','Kifizetendő','Do wypłaty','Auszuzahlen','До виплати','A recibir','À recevoir','A receber','مستحق القبض','待收款','受取予定','수령 예정'],
    earningsPlan:['Plán zárobku','Earnings plan','План заработка','Plán výdělku','Bevételi terv','Plan zarobków','Einnahmenplan','План заробітку','Plan de ingresos','Plan de revenus','Plano de ganhos','خطة الأرباح','收入计划','収益計画','수익 계획'],
    clubClients:['Klienti klubu','Club clients','Клиенты клуба','Klienti klubu','Klub ügyfelei','Klienci klubu','Studiokunden','Клієнти клубу','Clientes del club','Clients du club','Clientes do clube','عملاء النادي','俱乐部客户','クラブ顧客','클럽 고객'],
    upcomingGroups:['Najbližšie skupinové','Upcoming groups','Ближайшие групповые','Nejbližší skupinové','Közelgő csoportos','Najbliższe grupowe','Nächste Gruppentermine','Найближчі групові','Próximos grupos','Prochains groupes','Próximos grupos','المجموعات القادمة','近期团课','今後のグループ','예정 그룹'],
    duty:['Služba','Duty','Дежурство','Služba','Ügyelet','Dyżur','Dienst','Чергу́вання','Turno','Permanence','Turno','مناوبة','值班','当番','당직'],
    nextPayment:['Ďalšia platba','Next payment','Следующая оплата','Další platba','Következő fizetés','Następna płatność','Nächste Zahlung','Наступна оплата','Próximo pago','Prochain paiement','Próximo pagamento','الدفعة التالية','下次付款','次回支払い','다음 결제'],
    splitTraining:['Split tréning','Split training','Сплит-тренировка','Split trénink','Páros edzés','Trening split','Split-Training','Спліт-тренування','Entrenamiento en pareja','Entraînement en duo','Treino em dupla','تدريب ثنائي','双人训练','ペアトレーニング','2인 트레이닝'],
    event:['Udalosť','Event','Событие','Událost','Esemény','Wydarzenie','Ereignis','Подія','Evento','Événement','Evento','حدث','事件','イベント','이벤트'],
    online:['online','online','онлайн','online','online','online','online','онлайн','online','en ligne','online','عبر الإنترنت','在线','オンライン','온라인'],
    offline:['offline','offline','офлайн','offline','offline','offline','offline','офлайн','sin conexión','hors ligne','offline','دون اتصال','离线','オフライン','오프라인'],
    minutes:['minút','minutes','минут','minut','perc','minut','Minuten','хвилин','minutos','minutes','minutos','دقائق','分钟','分','분'],
    participants:['účastníkov','participants','участников','účastníků','résztvevő','uczestników','Teilnehmende','учасників','participantes','participants','participantes','مشاركين','名参与者','名参加者','명 참가자'],
    planned:['Naplánované','Planned','Запланировано','Naplánováno','Tervezve','Zaplanowane','Geplant','Заплановано','Planificado','Planifié','Planeado','مخطط','已计划','予定済み','예정됨'],
    signal:['Signál, Wi-Fi, batéria','Signal, Wi-Fi, battery','Связь, Wi-Fi, батарея','Signál, Wi-Fi, baterie','Jel, Wi-Fi, akkumulátor','Sygnał, Wi-Fi, bateria','Signal, WLAN, Batterie','Зв’язок, Wi-Fi, батарея','Señal, Wi-Fi, batería','Réseau, Wi-Fi, batterie','Sinal, Wi-Fi, bateria','الإشارة وWi-Fi والبطارية','信号、Wi-Fi、电池','電波、Wi-Fi、バッテリー','신호, Wi-Fi, 배터리']
  };

  const exactSources = {
    'Тренировки':'trainings','Сегодня':'today','Завтра':'tomorrow','Уведомления':'notifications','Клиенты':'clients','Клубы':'clubs','Заметки':'notes','Абонементы':'memberships','Обзор месяца':'monthlyOverview','День':'day','Неделя':'week','Свободное время':'freeTime','Персональная':'personal','Написать':'write','Позвонить':'call','Изменить':'edit','Баланс клиента':'clientBalance','Баланс клуба':'clubBalance','История':'history','Предоплата':'prepayment','Ближайшие тренировки':'upcoming','Все':'all','Услуги':'services','Онлайн-ведение':'onlineCoaching','Активен':'active','К выплате':'toReceive','План заработка':'earningsPlan','Клиенты клуба':'clubClients','Ближайшие групповые':'upcomingGroups','Дежурство':'duty','Следующая оплата':'nextPayment','Сплит-тренировка':'splitTraining','Событие':'event'
  };

  const englishFallback = {
    '3 тренировки':'3 trainings','1 тренировка':'1 training','5 сообщений к отправке':'5 messages to send','2 клиента с долгом':'2 clients with debt','Клиенты, правила дохода и взаиморасчёты':'Clients, income rules and settlements','3 заметки по клиентам':'3 client notes','Управление абонементами':'Membership management','Доход и тренировки':'Income and trainings','Принять оплату':'Accept payment','Предложить время':'Offer time','Открыть абонемент':'Open membership','осталось: 1 мес. 16 дн.':'remaining: 1 mo. 16 d.','Открыть все услуги':'Open all services','Клуб должен вам':'The club owes you','Рассчитаться':'Settle up','Оплатить клубу':'Pay club','Будущие тренировки, услуги и дежурства':'Future trainings, services and duties','Открыть план':'Open plan','закреплено за клубом':'assigned to the club','Новый клиент':'New client','Добавить тренировку':'Add training','фикс за смену':'fixed per shift','Запланировано':'Planned','Добавить дежурство':'Add duty','аренда за месяц':'monthly rent','Будущие оплаты':'Future payments','К получению после удержаний':'To receive after deductions','до 18:00':'until 18:00','абонемент':'membership','Подготовка программы':'Program preparation','Расписание на 14 июня':'Schedule for 14 June','Русский':'Russian','Связь, Wi-Fi, батарея':'Signal, Wi-Fi, battery','Онлайн':'Online','Офлайн':'Offline'
  };

  const getLanguage = () => document.documentElement.dataset.siteLanguage || localStorage.getItem('twork-site-language') || 'en';
  const value = (key, language) => rows[key]?.[index[language] ?? 1] || rows[key]?.[1] || key;

  const localeFor = language => language === 'zh-Hans' ? 'zh-CN' : language;
  const formatDate = (day, monthIndex, language, options = {}) => {
    try {
      return new Intl.DateTimeFormat(localeFor(language), options).format(new Date(2026, monthIndex, day));
    } catch {
      return `${day}/${monthIndex + 1}`;
    }
  };

  const localizeDates = (text, language) => {
    let result = text;
    result = result.replace('Воскресенье, 14 июня', formatDate(14,5,language,{weekday:'long',day:'numeric',month:'long'}));
    result = result.replace('Июнь 2026', formatDate(1,5,language,{month:'long',year:'numeric'}));
    result = result.replace(/(\d{1,2}) июня/g, (_, day) => formatDate(Number(day),5,language,{day:'numeric',month:'long'}));
    result = result.replace(/(\d{1,2}) июля/g, (_, day) => formatDate(Number(day),6,language,{day:'numeric',month:'long'}));
    return result;
  };

  const transliterateNames = (text, language) => {
    if (['ru','uk'].includes(language)) return text;
    return text
      .replaceAll('Максим и Олег','Maxim and Oleg')
      .replaceAll('Анна Ковалёва','Anna Kovalova')
      .replaceAll('Елена','Elena')
      .replaceAll('Ольга','Olga')
      .replaceAll('Братислава','Bratislava')
      .replaceAll('Алматы','Almaty');
  };

  const localizeGeneratedText = (source, language) => {
    let result = localizeDates(source, language);
    result = transliterateNames(result, language);

    const exactKey = exactSources[source.trim()];
    if (exactKey) return value(exactKey, language);

    const replacements = [
      ['Связь, Wi-Fi, батарея', value('signal',language)],
      ['Сплит-тренировка', value('splitTraining',language)],
      ['Ближайшие тренировки', value('upcoming',language)],
      ['Ближайшие групповые', value('upcomingGroups',language)],
      ['Баланс клиента', value('clientBalance',language)],
      ['Баланс клуба', value('clubBalance',language)],
      ['План заработка', value('earningsPlan',language)],
      ['Клиенты клуба', value('clubClients',language)],
      ['Следующая оплата', value('nextPayment',language)],
      ['Управление абонементами', englishFallback['Управление абонементами']],
      ['Доход и тренировки', englishFallback['Доход и тренировки']],
      ['Уведомления', value('notifications',language)],
      ['Тренировки', value('trainings',language)],
      ['Клиенты', value('clients',language)],
      ['Клубы', value('clubs',language)],
      ['Заметки', value('notes',language)],
      ['Абонементы', value('memberships',language)],
      ['Дежурство', value('duty',language)],
      ['дежурство', value('duty',language).toLowerCase()],
      ['Персональная', value('personal',language)],
      ['Событие', value('event',language)],
      ['онлайн', value('online',language)],
      ['офлайн', value('offline',language)],
      ['участников', value('participants',language)],
      ['минут', value('minutes',language)],
      ['Запланировано', value('planned',language)],
      ['администратор', value('administrator',language)],
      ['Все', value('all',language)],
      ['История', value('history',language)],
      ['Предоплата', value('prepayment',language)]
    ];
    replacements.forEach(([from,to]) => { result = result.replaceAll(from,to); });

    Object.entries(englishFallback)
      .sort((a,b) => b[0].length - a[0].length)
      .forEach(([from,to]) => { result = result.replaceAll(from,to); });
    return result;
  };

  const shouldTranslate = text => /[А-Яа-яЁёІіЇїЄє]/.test(text);
  const translateGeneratedNode = (node, language) => {
    if (!node || node.nodeType !== Node.TEXT_NODE) return;
    const raw = node.nodeValue || '';
    const match = raw.match(/^(\s*)(.*?)(\s*)$/s);
    if (!match || !match[2]) return;
    let source = node.__tworkGeneratedSource;
    if (!source) {
      if (!shouldTranslate(match[2])) return;
      const translated = localizeGeneratedText(match[2], language);
      if (translated === match[2]) return;
      source = match[2];
      node.__tworkGeneratedSource = source;
    }
    node.nodeValue = `${match[1]}${localizeGeneratedText(source,language)}${match[3]}`;
  };

  const translateGeneratedTree = (root = document.body, language = getLanguage()) => {
    const walker = document.createTreeWalker(root, NodeFilter.SHOW_TEXT, {
      acceptNode(node) {
        const parent = node.parentElement;
        if (!parent || parent.closest('script,style,.language-switcher,.matrix-inline-run,svg')) return NodeFilter.FILTER_REJECT;
        return NodeFilter.FILTER_ACCEPT;
      }
    });
    let node;
    while ((node = walker.nextNode())) translateGeneratedNode(node,language);

    const attributeElements = root.nodeType === Node.ELEMENT_NODE ? [root,...root.querySelectorAll('[aria-label]')] : [...document.querySelectorAll('[aria-label]')];
    attributeElements.forEach(element => {
      const current = element.getAttribute('aria-label');
      if (!current) return;
      const source = element.dataset.tworkGeneratedAria || current;
      if (!shouldTranslate(source)) return;
      element.dataset.tworkGeneratedAria = source;
      element.setAttribute('aria-label',localizeGeneratedText(source,language));
    });

    document.querySelectorAll('.hero-cal-weekdays span').forEach((element, position) => {
      try {
        element.textContent = new Intl.DateTimeFormat(localeFor(language),{weekday:'short'}).format(new Date(2026,5,15 + position));
      } catch {}
    });
    document.querySelectorAll('.hero-client-meta .language').forEach(element => {
      try {
        element.textContent = new Intl.DisplayNames([localeFor(language)],{type:'language'}).of('ru');
      } catch {
        element.textContent = language === 'ru' ? 'Русский' : 'Russian';
      }
    });
  };

  const isVisibleTextNode = node => {
    const parent = node.parentElement;
    if (!parent || !node.nodeValue?.trim()) return false;
    if (parent.closest('script,style,svg,.language-switcher,.matrix-inline-run,[aria-hidden="true"]')) return false;
    const style = getComputedStyle(parent);
    if (style.display === 'none' || style.visibility === 'hidden' || Number(style.opacity) < .02) return false;
    const rect = parent.getBoundingClientRect();
    return rect.bottom > 0 && rect.top < innerHeight && rect.right > 0 && rect.left < innerWidth;
  };

  const visibleTextNodes = () => {
    const result = [];
    let characters = 0;
    const walker = document.createTreeWalker(document.body,NodeFilter.SHOW_TEXT);
    let node;
    while ((node = walker.nextNode())) {
      if (!isVisibleTextNode(node)) continue;
      characters += node.nodeValue.length;
      if (characters > 4200) break;
      result.push(node);
    }
    return result;
  };

  const segmentText = text => {
    try { return [...new Intl.Segmenter(getLanguage(),{granularity:'grapheme'}).segment(text)].map(item => item.segment); }
    catch { return Array.from(text); }
  };

  const wrapNode = (node, phase, sequence) => {
    const wrapper = document.createElement('span');
    wrapper.className = 'matrix-inline-run';
    const stored = {
      key: node.__tworkI18nKey,
      generatedSource: node.__tworkGeneratedSource,
      text: node.nodeValue
    };
    wrapper.__tworkStoredText = stored;

    const chunks = node.nodeValue.split(/(\s+)/);
    let characterIndex = 0;
    chunks.forEach(chunk => {
      if (/^\s+$/.test(chunk)) {
        wrapper.appendChild(document.createTextNode(chunk));
        return;
      }
      const word = document.createElement('span');
      word.className = 'matrix-inline-word';
      segmentText(chunk).forEach(character => {
        const span = document.createElement('span');
        span.className = `matrix-inline-char ${phase === 'out' ? 'matrix-fall-out' : 'matrix-fall-in'}`;
        span.textContent = character;
        const seed = (sequence * 17 + characterIndex * 13) % 97;
        span.style.setProperty('--matrix-delay',`${Math.min(150,seed * 1.45)}ms`);
        span.style.setProperty('--matrix-duration',`${360 + (seed % 8) * 22}ms`);
        span.style.setProperty('--matrix-fall',`${42 + (seed % 7) * 9}px`);
        span.style.setProperty('--matrix-drift',`${(seed % 5) - 2}px`);
        span.style.setProperty('--matrix-rotate',`${(seed % 7) - 3}deg`);
        word.appendChild(span);
        characterIndex += 1;
      });
      wrapper.appendChild(word);
    });
    node.replaceWith(wrapper);
    return wrapper;
  };

  const unwrap = wrappers => {
    wrappers.forEach(wrapper => {
      if (!wrapper.isConnected) return;
      const stored = wrapper.__tworkStoredText || {text:wrapper.textContent};
      const node = document.createTextNode(wrapper.textContent);
      if (stored.key) node.__tworkI18nKey = stored.key;
      if (stored.generatedSource) node.__tworkGeneratedSource = stored.generatedSource;
      wrapper.replaceWith(node);
    });
  };

  let bypassOriginal = false;
  let switching = false;

  const triggerOriginalWithoutOverlay = option => {
    const nativeMatchMedia = window.matchMedia;
    window.matchMedia = query => {
      const result = nativeMatchMedia.call(window,query);
      if (query === '(prefers-reduced-motion: reduce)') {
        return new Proxy(result,{get(target,property){ return property === 'matches' ? true : Reflect.get(target,property,target); }});
      }
      return result;
    };
    bypassOriginal = true;
    try { option.click(); } finally {
      bypassOriginal = false;
      window.matchMedia = nativeMatchMedia;
    }
  };

  const switchInPlace = (option, language) => {
    if (switching || language === getLanguage()) return;
    switching = true;
    document.documentElement.classList.add('matrix-interface-switching');
    document.querySelector('.matrix-language-transition')?.remove();

    const outWrappers = visibleTextNodes().map((node,position) => wrapNode(node,'out',position));

    setTimeout(() => {
      unwrap(outWrappers);
      triggerOriginalWithoutOverlay(option);
      requestAnimationFrame(() => {
        translateGeneratedTree(document.body,language);
        const inWrappers = visibleTextNodes().map((node,position) => wrapNode(node,'in',position + 31));
        setTimeout(() => {
          unwrap(inWrappers);
          document.documentElement.classList.remove('matrix-interface-switching');
          switching = false;
        },620);
      });
    },430);
  };

  const installSwitchInterception = () => {
    document.addEventListener('click', event => {
      const option = event.target.closest?.('.language-option');
      if (!option || bypassOriginal) return;
      event.preventDefault();
      event.stopImmediatePropagation();
      const language = option.dataset.language;
      const switcher = option.closest('.language-switcher');
      switcher?.classList.remove('is-open');
      switcher?.querySelector('.language-switcher-button')?.setAttribute('aria-expanded','false');
      switchInPlace(option,language);
    },true);
  };

  const boot = () => {
    const waitForSwitcher = () => {
      if (!document.querySelector('.language-option')) {
        requestAnimationFrame(waitForSwitcher);
        return;
      }
      translateGeneratedTree(document.body,getLanguage());
      installSwitchInterception();

      const observer = new MutationObserver(records => {
        if (switching) return;
        const language = getLanguage();
        records.forEach(record => record.addedNodes.forEach(node => {
          if (node.nodeType === Node.ELEMENT_NODE) translateGeneratedTree(node,language);
          else if (node.nodeType === Node.TEXT_NODE) translateGeneratedNode(node,language);
        }));
      });
      observer.observe(document.body,{subtree:true,childList:true});
    };
    requestAnimationFrame(waitForSwitcher);
  };

  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded',boot,{once:true});
  else boot();
})();
