(() => {
  const languageOrder = ['sk','en','ru','cs','hu','pl','de','uk','es','fr','pt','ar','zh-Hans','ja','ko'];
  const languageIndex = Object.fromEntries(languageOrder.map((code,index) => [code,index]));
  const rows = {
    training:['Tréning','Training','Тренировка','Trénink','Edzés','Trening','Training','Тренування','Entrenamiento','Entraînement','Treino','تدريب','训练','トレーニング','트레이닝'],
    membership:['Permanentka','Membership','Абонемент','Permanentka','Bérlet','Karnet','Mitgliedschaft','Абонемент','Bono','Abonnement','Plano','اشتراك','课包','回数券','이용권'],
    clientBalance:['Zostatok klienta','Client balance','Баланс клиента','Zůstatek klienta','Ügyfélegyenleg','Saldo klienta','Kundensaldo','Баланс клієнта','Saldo del cliente','Solde client','Saldo do cliente','رصيد العميل','客户余额','顧客残高','고객 잔액'],
    clubBalance:['Zostatok klubu','Club balance','Баланс клуба','Zůstatek klubu','Klubegyenleg','Saldo klubu','Studiosaldo','Баланс клубу','Saldo del club','Solde du club','Saldo do clube','رصيد النادي','俱乐部余额','クラブ残高','클럽 잔액'],
    income:['Príjem','Income','Доход','Příjem','Bevétel','Przychód','Einnahmen','Дохід','Ingresos','Revenus','Receita','الدخل','收入','収入','수입'],
    message:['Správa','Message','Сообщение','Zpráva','Üzenet','Wiadomość','Nachricht','Повідомлення','Mensaje','Message','Mensagem','رسالة','消息','メッセージ','메시지'],
    personal:['Osobné','Personal','Персональные','Osobní','Személyi','Personalne','Personal','Персональні','Personales','Personnels','Pessoais','شخصية','私教','パーソナル','퍼스널'],
    split:['Split','Split','Сплит','Split','Páros','Split','Split','Спліт','Dúo','Duo','Dupla','ثنائي','双人','ペア','2인'],
    group:['Skupinové','Group','Групповые','Skupinové','Csoportos','Grupowe','Gruppe','Групові','Grupales','Collectifs','Grupo','جماعية','团课','グループ','그룹'],
    subscriptions:['Permanentky','Memberships','Абонементы','Permanentky','Bérletek','Karnety','Mitgliedschaften','Абонементи','Bonos','Abonnements','Planos','الاشتراكات','课包','回数券','이용권'],
    services:['Online služby','Online services','Онлайн-услуги','Online služby','Online szolgáltatások','Usługi online','Online-Services','Онлайн-послуги','Servicios online','Services en ligne','Serviços online','خدمات عبر الإنترنت','在线服务','オンラインサービス','온라인 서비스'],
    clubs:['Kluby','Clubs','Клубы','Kluby','Klubok','Kluby','Studios','Клуби','Clubes','Clubs','Clubes','الأندية','俱乐部','クラブ','클럽'],
    notifications:['Upozornenia','Notifications','Уведомления','Oznámení','Értesítések','Powiadomienia','Mitteilungen','Сповіщення','Notificaciones','Notifications','Notificações','الإشعارات','通知','通知','알림'],
    clients:['Klienti','Clients','Клиенты','Klienti','Ügyfelek','Klienci','Kunden','Клієнти','Clientes','Clients','Clientes','العملاء','客户','顧客','고객'],
    notes:['Poznámky','Notes','Заметки','Poznámky','Jegyzetek','Notatki','Notizen','Нотатки','Notas','Notes','Notas','الملاحظات','备注','メモ','메모'],
    history:['História','History','История','Historie','Előzmények','Historia','Verlauf','Історія','Historial','Historique','Histórico','السجل','历史','履歴','내역'],
    all:['Všetko','All','Все','Vše','Összes','Wszystkie','Alle','Усі','Todo','Tout','Todos','الكل','全部','すべて','전체'],
    today:['Dnes','Today','Сегодня','Dnes','Ma','Dzisiaj','Heute','Сьогодні','Hoy','Aujourd’hui','Hoje','اليوم','今天','今日','오늘'],
    tomorrow:['Zajtra','Tomorrow','Завтра','Zítra','Holnap','Jutro','Morgen','Завтра','Mañana','Demain','Amanhã','غدًا','明天','明日','내일'],
    online:['online','online','онлайн','online','online','online','online','онлайн','online','en ligne','online','عبر الإنترنت','在线','オンライン','온라인'],
    offline:['offline','offline','офлайн','offline','offline','offline','offline','офлайн','sin conexión','hors ligne','offline','دون اتصال','离线','オフライン','오프라인'],
    language:['Jazyk','Language','Язык','Jazyk','Nyelv','Język','Sprache','Мова','Idioma','Langue','Idioma','اللغة','语言','言語','언어'],
    currency:['Mena','Currency','Валюта','Měna','Pénznem','Waluta','Währung','Валюта','Moneda','Devise','Moeda','العملة','货币','通貨','통화'],
    timezone:['Časové pásmo','Time zone','Часовой пояс','Časové pásmo','Időzóna','Strefa czasowa','Zeitzone','Часовий пояс','Zona horaria','Fuseau horaire','Fuso horário','المنطقة الزمنية','时区','タイムゾーン','시간대'],
    calendar:['Kalendár','Calendar','Календарь','Kalendář','Naptár','Kalendarz','Kalender','Календар','Calendario','Calendrier','Calendário','التقويم','日历','カレンダー','캘린더'],
    payment:['Platba','Payment','Оплата','Platba','Fizetés','Płatność','Zahlung','Оплата','Pago','Paiement','Pagamento','الدفع','付款','支払い','결제'],
    debt:['Dlh','Debt','Долг','Dluh','Tartozás','Dług','Schuld','Борг','Deuda','Dette','Dívida','دين','欠款','未払い','미납'],
    duty:['Služba','Duty','Дежурство','Služba','Ügyelet','Dyżur','Dienst','Чергу́вання','Turno','Permanence','Turno','مناوبة','值班','当番','당직'],
    send:['Odoslať','Send','Отправить','Odeslat','Küldés','Wyślij','Senden','Надіслати','Enviar','Envoyer','Enviar','إرسال','发送','送信','전송'],
    copy:['Kopírovať','Copy','Скопировать','Kopírovat','Másolás','Kopiuj','Kopieren','Скопіювати','Copiar','Copier','Copiar','نسخ','复制','コピー','복사'],
    cancel:['Zrušiť','Cancel','Отмена','Zrušit','Törlés','Anuluj','Stornieren','Скасувати','Cancelar','Annuler','Cancelar','إلغاء','取消','キャンセル','취소']
  };
  const sourceTerms = {
    'Тренировка':'training','Абонемент':'membership','Баланс клиента':'clientBalance','Баланс клуба':'clubBalance','Доход':'income','Сообщение':'message','Персональные':'personal','Сплит':'split','Групповые':'group','Абонементы':'subscriptions','Онлайн-услуги':'services','Клубы':'clubs','Уведомления':'notifications','Клиенты':'clients','Заметки':'notes','История':'history','Все':'all','Сегодня':'today','Завтра':'tomorrow','Онлайн':'online','Офлайн':'offline','Язык':'language','Валюта':'currency','Часовой пояс':'timezone','Календарь':'calendar','Оплата':'payment','Долг':'debt','Дежурство':'duty','Отправить':'send','Скопировать':'copy','Отмена':'cancel'
  };
  const fallbackEnglish = {
    'валюты, языки и часовые пояса':'currencies, languages and time zones','баланс клиента и клуба':'client and club balances','полные и персональные календари':'full and personal calendars','Время тренировки понятно тренеру и клиенту':'Training time is clear to both trainer and client','Оплаты и баланс ведутся в валюте клиента':'Payments and balance use the client currency','Сообщения и комментарии календаря готовятся на языке клиента':'Messages and calendar notes use the client language','Онлайн- и офлайн-цены можно настраивать отдельно':'Online and offline prices can be configured separately','Собственный баланс каждого клиента':'A separate balance for every client','Отдельный баланс каждого клуба или организации':'A separate balance for every club or organisation','Клиент может платить тренеру или напрямую клубу':'The client can pay the trainer or the club directly','Доход и обязательства не смешиваются в одной сумме':'Income and obligations are never mixed into one amount','Номер занятия в абонементе: например, 7 из 8':'Training number in the membership, for example 7 of 8','Предупреждение, когда после тренировки останется 1 или 0 занятий':'A warning when only 1 or 0 trainings remain','Сумма долга, постоянная информация и комментарий тренера':'Debt, permanent information and the trainer comment','Текст на языке клиента и синхронизация при переносе или отмене':'Text in the client language, synced after rescheduling or cancellation','Клиенту не нужен отдельный личный кабинет':'The client does not need a separate account','Он открывает привычное событие в Apple Calendar и видит время, остаток абонемента, предупреждения и ваши инструкции.':'They open a familiar Apple Calendar event and see the time, remaining trainings, warnings and your instructions.','Клиент видит остаток тренировок прямо в календаре':'The client sees remaining trainings directly in the calendar','Покажите расписание, долг и комментарии без отдельного личного кабинета.':'Show the schedule, debt and comments without a separate client account.','Процент или фиксированное удержание':'Percentage or fixed deduction','Отдельные правила для тренировок, абонементов и услуг':'Separate rules for trainings, memberships and services','Баланс клуба и история расчётов':'Club balance and settlement history','Фиксированные платежи за период и дежурства':'Fixed period payments and duties','Клиенты платят клубу':'Clients pay the club','Доля тренера после занятий':'Trainer share after trainings','Комиссии, оплаченные тренером':'Commissions paid by the trainer','Дежурства тренера':'Trainer duties','К получению от клуба':'To receive from the club','Сервисы Apple — только по вашему выбору.':'Apple services are used only when you choose them.','При включённых резервных копиях iCloud или синхронизации Apple Calendar данные обрабатываются сервисами Apple в соответствии с настройками вашего устройства.':'When iCloud backups or Apple Calendar sync are enabled, Apple services process the data according to your device settings.','Основная работа без интернета':'Core work without internet','Расписание, клиенты, абонементы, оплаты и расчёты доступны прямо на телефоне — даже без подключения к сети.':'Schedules, clients, memberships, payments and settlements stay available on the phone, even offline.','Локальные данные':'Local data','Нет серверной базы TWORK':'No TWORK server database','У TWORK нет собственного сервера, на который загружается ваша клиентская база.':'TWORK has no server that uploads your client database.','Платформа':'Platform','Создано только для iPhone':'Built only for iPhone','Первая версия TWORK будет доступна только на iOS и глубоко интегрирована с возможностями Apple.':'The first TWORK version is iOS only and deeply integrated with Apple features.','Персональный тренер':'Personal trainer','Тренер в нескольких клубах':'Trainer in multiple clubs','Онлайн-тренер':'Online trainer','Владелец студии или клуба':'Studio or club owner','Выберите вариант':'Choose an option','Необязательно':'Optional','Данные используются только для связи по поводу раннего доступа.':'Your data is used only to contact you about early access.','Заявка отправлена. Мы напишем вам на указанный email.':'Request sent. We will contact you at the provided email.','Напоминание о расписании':'Schedule reminder','Напоминаю расписание тренировок на эту неделю:':'Here is your training schedule for this week:','Если нужно скорректировать время — дайте знать заранее.':'Let me know in advance if the time needs to be adjusted.','Свяжитесь с тренером, если нужно перенести тренировку.':'Contact the trainer if you need to reschedule.','Комментарий тренера':'Trainer comment','Возьмите полотенце.':'Bring a towel.','Весь день виден полностью':'The full day is visible','Личное событие':'Personal event','Тренировка с Константином':'Training with Konstantin','Календарь Анны':'Anna’s calendar','Только её занятия':'Only her trainings','Только просмотр':'View only','Авто + свой текст':'Automatic + custom text','Обновляется вместе с событием':'Updates with the event','Доступ для семьи':'Family access','Моё полное расписание':'My full schedule','Свободное окно':'Available slot','Остаток абонемента':'Remaining membership','Напоминание':'Reminder','Перенос':'Reschedule','Следующая':'Next','Предоплата на будущие тренировки':'Prepayment for future trainings','3 тренировки':'3 trainings','1 тренировка':'1 training','5 сообщений к отправке':'5 messages to send','2 клиента с долгом':'2 clients with debt','Клиенты, правила дохода и взаиморасчёты':'Clients, income rules and settlements','3 заметки по клиентам':'3 client notes','Управление абонементами':'Membership management','Доход и тренировки':'Income and trainings','Пора отправить':'Time to send','Запланированные':'Scheduled','Отправленные':'Sent','Всего':'Total','Клубы и организации':'Clubs and organisations','Взаиморасчёт':'Settlement','Июнь':'June','Новая заявка на ранний доступ TWORK':'New TWORK early access request','Основная навигация':'Main navigation','Цветовая схема':'Colour scheme','Платформа и приватность':'Platform and privacy','Демонстрация TWORK':'TWORK demonstration','Связанные модули TWORK':'Connected TWORK modules','Пример расчёта с клубом':'Club settlement example','Расписание на 14 июня':'Schedule for 14 June'
  };
  const nameReplacements = [['Анна Ковалёва','Anna Kovalova'],['Максим и Олег','Maxim and Oleg'],['Елена','Elena'],['Ольга','Olga'],['Братислава','Bratislava'],['Алматы','Almaty']];
  const currentLanguage = () => document.documentElement.dataset.siteLanguage || localStorage.getItem('twork-site-language') || 'en';
  const value = (key,language) => rows[key]?.[languageIndex[language] ?? 1] || rows[key]?.[1] || key;
  const hasRussian = text => /[А-Яа-яЁё]/.test(text);
  const formatDate = (day,month,language,options) => { try { return new Intl.DateTimeFormat(language === 'zh-Hans' ? 'zh-CN' : language,options).format(new Date(2026,month,day)); } catch { return `${day}/${month + 1}`; } };

  const translateResidual = (source,language) => {
    if (language === 'ru') return source;
    let result = source;
    result = result.replace('Воскресенье, 14 июня',formatDate(14,5,language,{weekday:'long',day:'numeric',month:'long'}));
    result = result.replace('Июнь 2026',formatDate(1,5,language,{month:'long',year:'numeric'}));
    result = result.replace(/(\d{1,2}) июня/g,(_,day) => formatDate(Number(day),5,language,{day:'numeric',month:'long'}));
    result = result.replace(/(\d{1,2}) июля/g,(_,day) => formatDate(Number(day),6,language,{day:'numeric',month:'long'}));
    nameReplacements.forEach(([from,to]) => { result = result.replaceAll(from,to); });
    const exact = sourceTerms[result.trim()];
    if (exact) return value(exact,language);
    if (fallbackEnglish[result.trim()]) return fallbackEnglish[result.trim()];
    Object.entries(sourceTerms).sort((a,b) => b[0].length-a[0].length).forEach(([from,key]) => { result = result.replaceAll(from,value(key,language)); });
    Object.entries(fallbackEnglish).sort((a,b) => b[0].length-a[0].length).forEach(([from,to]) => { result = result.replaceAll(from,to); });
    return result;
  };

  const translateNode = (node,language) => {
    if (!node || node.nodeType !== Node.TEXT_NODE) return;
    const raw = node.nodeValue || '';
    const match = raw.match(/^(\s*)(.*?)(\s*)$/s);
    if (!match || !match[2]) return;
    let source = node.__tworkV3Source;
    if (!source && hasRussian(match[2])) { source = match[2]; node.__tworkV3Source = source; }
    if (!source) return;
    node.nodeValue = `${match[1]}${translateResidual(source,language)}${match[3]}`;
  };

  const strictTranslate = (root = document.body,language = currentLanguage()) => {
    const walker = document.createTreeWalker(root,NodeFilter.SHOW_TEXT,{acceptNode(node){ const parent=node.parentElement; return !parent || parent.closest('script,style,svg,.language-switcher') ? NodeFilter.FILTER_REJECT : NodeFilter.FILTER_ACCEPT; }});
    let node;
    while ((node = walker.nextNode())) translateNode(node,language);
    const elements = root.nodeType === Node.ELEMENT_NODE ? [root,...root.querySelectorAll('*')] : [...document.querySelectorAll('*')];
    elements.forEach(element => ['placeholder','aria-label','title','value'].forEach(attribute => {
      const current = element.getAttribute?.(attribute);
      if (!current || !hasRussian(current)) return;
      const key = `tworkV3${attribute}`;
      const source = element.dataset[key] || current;
      element.dataset[key] = source;
      element.setAttribute(attribute,translateResidual(source,language));
    }));
    const ogTitle = document.querySelector('meta[property="og:title"]');
    const ogDescription = document.querySelector('meta[property="og:description"]');
    if (language !== 'ru') {
      if (ogTitle?.content && hasRussian(ogTitle.content)) ogTitle.content = 'TWORK — all trainer work in one system';
      if (ogDescription?.content && hasRussian(ogDescription.content)) ogDescription.content = 'Schedules, memberships and trainer comments directly in Apple Calendar.';
    }
    let residual = 0;
    if (language !== 'ru' && language !== 'uk') {
      const audit = document.createTreeWalker(document.body,NodeFilter.SHOW_TEXT);
      while ((node = audit.nextNode())) if (!node.parentElement?.closest('script,style,svg') && hasRussian(node.nodeValue || '')) residual += 1;
    }
    document.documentElement.dataset.i18nResidual = String(residual);
  };

  const visibleTargets = () => {
    const selector = 'h1,h2,h3,h4,p,a,button,label,small,b,strong,span,time,option';
    return [...document.querySelectorAll(selector)].filter(element => {
      if (element.closest('.language-switcher,.matrix-language-transition') || element.closest('[aria-hidden="true"]')) return false;
      const directText = [...element.childNodes].some(node => node.nodeType === Node.TEXT_NODE && node.nodeValue.trim());
      if (!directText) return false;
      const style = getComputedStyle(element);
      if (style.display === 'none' || style.visibility === 'hidden' || Number(style.opacity) < .02) return false;
      const rect = element.getBoundingClientRect();
      return rect.bottom > -20 && rect.top < innerHeight + 20 && rect.right > 0 && rect.left < innerWidth;
    }).slice(0,180);
  };

  const applyAnimationClass = (elements,className) => {
    elements.forEach((element,index) => {
      const rect = element.getBoundingClientRect();
      const vertical = Math.max(0,Math.min(1,rect.top / Math.max(1,innerHeight)));
      element.style.setProperty('--locale-delay',`${Math.round(vertical * 110 + (index % 7) * 4)}ms`);
      element.classList.remove('locale-morph-out','locale-morph-in');
      void element.offsetWidth;
      element.classList.add('locale-morph-target',className);
    });
  };

  const clearAnimationClasses = elements => elements.forEach(element => {
    element.classList.remove('locale-morph-target','locale-morph-out','locale-morph-in');
    element.style.removeProperty('--locale-delay');
  });

  let bypass = false;
  let switching = false;
  const triggerBaseSwitch = option => {
    const nativeMatchMedia = window.matchMedia;
    window.matchMedia = query => {
      const result = nativeMatchMedia.call(window,query);
      if (query === '(prefers-reduced-motion: reduce)') return new Proxy(result,{get(target,property){ return property === 'matches' ? true : Reflect.get(target,property,target); }});
      return result;
    };
    bypass = true;
    try { option.click(); } finally { bypass = false; window.matchMedia = nativeMatchMedia; }
  };

  const switchLanguage = (option,language) => {
    if (switching || language === currentLanguage()) return;
    switching = true;
    document.documentElement.classList.add('language-morphing');
    document.querySelector('.matrix-language-transition')?.remove();
    const scan = document.createElement('div');
    scan.className = 'language-morph-scan';
    document.body.appendChild(scan);
    const outgoing = visibleTargets();
    applyAnimationClass(outgoing,'locale-morph-out');
    setTimeout(() => {
      triggerBaseSwitch(option);
      requestAnimationFrame(() => requestAnimationFrame(() => {
        strictTranslate(document.body,language);
        clearAnimationClasses(outgoing);
        const incoming = visibleTargets();
        applyAnimationClass(incoming,'locale-morph-in');
        setTimeout(() => {
          clearAnimationClasses(incoming);
          scan.remove();
          document.documentElement.classList.remove('language-morphing');
          switching = false;
        },560);
      }));
    },330);
  };

  const install = () => {
    document.addEventListener('click',event => {
      const option = event.target.closest?.('.language-option');
      if (!option || bypass) return;
      event.preventDefault();
      event.stopImmediatePropagation();
      const language = option.dataset.language;
      const switcher = option.closest('.language-switcher');
      switcher?.classList.remove('is-open');
      switcher?.querySelector('.language-switcher-button')?.setAttribute('aria-expanded','false');
      if (matchMedia('(prefers-reduced-motion: reduce)').matches) {
        triggerBaseSwitch(option);
        requestAnimationFrame(() => strictTranslate(document.body,language));
      } else switchLanguage(option,language);
    },true);

    strictTranslate(document.body,currentLanguage());
    const observer = new MutationObserver(records => {
      if (switching) return;
      const language = currentLanguage();
      records.forEach(record => record.addedNodes.forEach(node => {
        if (node.nodeType === Node.ELEMENT_NODE) strictTranslate(node,language);
        else if (node.nodeType === Node.TEXT_NODE) translateNode(node,language);
      }));
    });
    observer.observe(document.body,{subtree:true,childList:true});
  };

  const boot = () => {
    const wait = () => {
      if (!document.querySelector('.language-option')) return requestAnimationFrame(wait);
      install();
      setTimeout(() => strictTranslate(document.body,currentLanguage()),250);
    };
    requestAnimationFrame(wait);
  };
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded',boot,{once:true});
  else boot();
})();
