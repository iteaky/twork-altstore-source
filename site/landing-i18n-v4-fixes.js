(() => {
  const order = ['sk','en','ru','cs','hu','pl','de','uk','es','fr','pt','ar','zh-Hans','ja','ko'];
  const idx = Object.fromEntries(order.map((code,index) => [code,index]));
  const words = {
    membership:['permanentka','membership','абонемент','permanentka','bérlet','karnet','Mitgliedschaft','абонемент','bono','abonnement','plano','اشتراك','课包','回数券','이용권'],
    duty:['služba','duty','дежурство','služba','ügyelet','dyżur','Dienst','чергування','turno','permanence','turno','مناوبة','值班','当番','당직'],
    online:['online','online','онлайн','online','online','online','online','онлайн','online','en ligne','online','عبر الإنترنت','在线','オンライン','온라인'],
    offline:['offline','offline','офлайн','offline','offline','offline','offline','офлайн','sin conexión','hors ligne','offline','دون اتصال','离线','オフライン','오프라인'],
    minutes:['minút','minutes','минут','minut','perc','minut','Minuten','хвилин','minutos','minutes','minutos','دقائق','分钟','分','분'],
    participants:['účastníkov','participants','участников','účastníků','résztvevő','uczestników','Teilnehmende','учасників','participantes','participants','participantes','مشاركين','名参与者','名参加者','명 참가자']
  };
  const currentLanguage = () => document.documentElement.dataset.siteLanguage || localStorage.getItem('twork-site-language') || 'en';
  const word = (key,language) => words[key]?.[idx[language] ?? 1] || words[key]?.[1] || key;
  const hasRussian = text => /[А-Яа-яЁё]/.test(text);
  const exactEnglish = {
    'После этой тренировки останется: 1.':'After this training, 1 remains.','осталось: 1 мес. 16 дн.':'remaining: 1 mo. 16 d.','до 18:00':'until 18:00','Подготовка программы':'Program preparation','закреплено за клубом':'assigned to the club','Будущие тренировки, услуги и дежурства':'Future trainings, services and duties','Открыть план':'Open plan','Добавить дежурство':'Add duty','фикс за смену':'fixed per shift','аренда за месяц':'monthly rent','К получению после удержаний':'To receive after deductions','Открыть абонемент':'Open membership','Открыть все услуги':'Open all services','Добавить тренировку':'Add training','Новый клиент':'New client','Будущие оплаты':'Future payments','Клуб должен вам':'The club owes you','Оплатить клубу':'Pay club','Рассчитаться':'Settle up','Предложить время':'Offer time','Принять оплату':'Accept payment','Обзор месяца':'Monthly overview','Доход и тренировки':'Income and trainings','Управление абонементами':'Membership management','3 тренировки':'3 trainings','1 тренировка':'1 training','5 сообщений к отправке':'5 messages to send','2 клиента с долгом':'2 clients with debt','3 заметки по клиентам':'3 client notes','Клиенты, правила дохода и взаиморасчёты':'Clients, income rules and settlements','Постоянная информация':'Permanent information','Личное событие':'Personal event','Весь день виден полностью':'The full day is visible','Календарь Анны':'Anna’s calendar','Тренировка с Константином':'Training with Konstantin','Свяжитесь с тренером, если нужно перенести тренировку.':'Contact the trainer if you need to reschedule.','Комментарий тренера':'Trainer comment','Возьмите полотенце.':'Bring a towel.','Авто + свой текст':'Automatic + custom text','Обновляется вместе с событием':'Updates with the event','Только её занятия':'Only her trainings','Только просмотр':'View only','Доступ для семьи':'Family access','Моё полное расписание':'My full schedule','Напоминание о расписании':'Schedule reminder','Напоминаю расписание тренировок на эту неделю:':'Here is your training schedule for this week:','Если нужно скорректировать время — дайте знать заранее.':'Let me know in advance if the time needs to be adjusted.','Всего':'Total','Пора отправить':'Time to send','Запланированные':'Scheduled','Отправленные':'Sent','Свободное окно':'Available slot','Остаток абонемента':'Remaining membership','Напоминание':'Reminder','Перенос':'Reschedule','Процент или фиксированное удержание':'Percentage or fixed deduction','Отдельные правила для тренировок, абонементов и услуг':'Separate rules for trainings, memberships and services','Баланс клуба и история расчётов':'Club balance and settlement history','Фиксированные платежи за период и дежурства':'Fixed period payments and duties','Клиенты платят клубу':'Clients pay the club','Доля тренера после занятий':'Trainer share after trainings','Комиссии, оплаченные тренером':'Commissions paid by the trainer','Дежурства тренера':'Trainer duties','К получению от клуба':'To receive from the club','Взаиморасчёт':'Settlement','Основная работа без интернета':'Core work without internet','Локальные данные':'Local data','Нет серверной базы TWORK':'No TWORK server database','Платформа':'Platform','Создано только для iPhone':'Built only for iPhone','Персональный тренер':'Personal trainer','Тренер в нескольких клубах':'Trainer in multiple clubs','Онлайн-тренер':'Online trainer','Владелец студии или клуба':'Studio or club owner','Выберите вариант':'Choose an option','Необязательно':'Optional','Данные используются только для связи по поводу раннего доступа.':'Your data is used only to contact you about early access.','Заявка отправлена. Мы напишем вам на указанный email.':'Request sent. We will contact you at the provided email.'
  };
  const transliteration = {'А':'A','Б':'B','В':'V','Г':'G','Д':'D','Е':'E','Ё':'Yo','Ж':'Zh','З':'Z','И':'I','Й':'Y','К':'K','Л':'L','М':'M','Н':'N','О':'O','П':'P','Р':'R','С':'S','Т':'T','У':'U','Ф':'F','Х':'Kh','Ц':'Ts','Ч':'Ch','Ш':'Sh','Щ':'Sch','Ъ':'','Ы':'Y','Ь':'','Э':'E','Ю':'Yu','Я':'Ya','а':'a','б':'b','в':'v','г':'g','д':'d','е':'e','ё':'yo','ж':'zh','з':'z','и':'i','й':'y','к':'k','л':'l','м':'m','н':'n','о':'o','п':'p','р':'r','с':'s','т':'t','у':'u','ф':'f','х':'kh','ц':'ts','ч':'ch','ш':'sh','щ':'sch','ъ':'','ы':'y','ь':'','э':'e','ю':'yu','я':'ya'};
  const translateString = (source,language) => {
    if (language === 'ru') return source;
    let result = source;
    if (exactEnglish[result.trim()]) return exactEnglish[result.trim()];
    result = result.replaceAll('абонемент',word('membership',language)).replaceAll('Абонемент',word('membership',language));
    result = result.replaceAll('дежурство',word('duty',language)).replaceAll('Дежурство',word('duty',language));
    result = result.replaceAll('онлайн',word('online',language)).replaceAll('Онлайн',word('online',language));
    result = result.replaceAll('офлайн',word('offline',language)).replaceAll('Офлайн',word('offline',language));
    result = result.replaceAll('минут',word('minutes',language)).replaceAll('участников',word('participants',language));
    result = result.replaceAll('Русский',(() => { try { return new Intl.DisplayNames([language === 'zh-Hans' ? 'zh-CN' : language],{type:'language'}).of('ru'); } catch { return 'Russian'; } })());
    result = result.replaceAll('Анна Ковалёва','Anna Kovalova').replaceAll('Максим и Олег','Maxim and Oleg').replaceAll('Елена','Elena').replaceAll('Ольга','Olga').replaceAll('Братислава','Bratislava').replaceAll('Алматы','Almaty');
    if (language !== 'uk' && hasRussian(result)) result = Array.from(result,ch => transliteration[ch] ?? ch).join('');
    return result;
  };
  const translateNode = (node,language) => {
    if (!node || node.nodeType !== Node.TEXT_NODE) return;
    const raw = node.nodeValue || '';
    const match = raw.match(/^(\s*)(.*?)(\s*)$/s);
    if (!match || !match[2]) return;
    let source = node.__tworkV4Source;
    if (!source && hasRussian(match[2])) { source = match[2]; node.__tworkV4Source = source; }
    if (!source) return;
    node.nodeValue = `${match[1]}${translateString(source,language)}${match[3]}`;
  };
  const localizeWeekdays = language => {
    const locale = language === 'zh-Hans' ? 'zh-CN' : language;
    document.querySelectorAll('.hero-cal-weekdays').forEach(container => [...container.children].forEach((element,index) => {
      try { element.textContent = new Intl.DateTimeFormat(locale,{weekday:'short'}).format(new Date(2026,5,15 + index)); } catch {}
    }));
    document.querySelectorAll('.week-mini').forEach(container => [...container.children].forEach((element,index) => {
      try { element.textContent = new Intl.DateTimeFormat(locale,{weekday:'short'}).format(new Date(2026,5,15 + index)); } catch {}
    }));
  };
  const run = (root = document.body, language = currentLanguage()) => {
    const walker = document.createTreeWalker(root,NodeFilter.SHOW_TEXT,{acceptNode(node){ const p=node.parentElement; return !p || p.closest('script,style,svg,.language-switcher') ? NodeFilter.FILTER_REJECT : NodeFilter.FILTER_ACCEPT; }});
    let node;
    while ((node = walker.nextNode())) translateNode(node,language);
    localizeWeekdays(language);
    if (language !== 'ru' && language !== 'uk') {
      let residual = 0;
      const audit = document.createTreeWalker(document.body,NodeFilter.SHOW_TEXT);
      while ((node = audit.nextNode())) if (!node.parentElement?.closest('script,style,svg') && hasRussian(node.nodeValue || '')) residual += 1;
      document.documentElement.dataset.i18nResidual = String(residual);
    }
  };

  window.TWORK_I18N_CLEANUP = (language = currentLanguage()) => run(document.body,language);

  const boot = () => {
    run();
    setTimeout(run,350);
    new MutationObserver(records => records.forEach(record => record.addedNodes.forEach(node => {
      if (node.nodeType === Node.ELEMENT_NODE) run(node,currentLanguage()); else if (node.nodeType === Node.TEXT_NODE) translateNode(node,currentLanguage());
    }))).observe(document.body,{subtree:true,childList:true});
  };
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded',boot,{once:true}); else boot();
})();
