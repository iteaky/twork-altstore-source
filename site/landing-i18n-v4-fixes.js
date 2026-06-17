(() => {
  const currentLanguage = () => document.documentElement.dataset.siteLanguage || localStorage.getItem('twork-site-language') || 'en';
  const hasRussian = text => /[А-Яа-яЁё]/.test(text);
  const exactEnglish = {
    'После этой тренировки останется: 1.':'After this training, 1 remains.','осталось: 1 мес. 16 дн.':'remaining: 1 mo. 16 d.','до 18:00':'until 18:00','Подготовка программы':'Program preparation','закреплено за клубом':'assigned to the club','Будущие тренировки, услуги и дежурства':'Future trainings, services and duties','Открыть план':'Open plan','Добавить дежурство':'Add duty','фикс за смену':'fixed per shift','аренда за месяц':'monthly rent','К получению после удержаний':'To receive after deductions','Открыть абонемент':'Open membership','Открыть все услуги':'Open all services','Добавить тренировку':'Add training','Новый клиент':'New client','Будущие оплаты':'Future payments','Клуб должен вам':'The club owes you','Оплатить клубу':'Pay club','Рассчитаться':'Settle up','Предложить время':'Offer time','Принять оплату':'Accept payment','Обзор месяца':'Monthly overview','Доход и тренировки':'Income and trainings','Управление абонементами':'Membership management','3 тренировки':'3 trainings','1 тренировка':'1 training','5 сообщений к отправке':'5 messages to send','2 клиента с долгом':'2 clients with debt','3 заметки по клиентам':'3 client notes','Клиенты, правила дохода и взаиморасчёты':'Clients, income rules and settlements','Постоянная информация':'Permanent information','Личное событие':'Personal event','Весь день виден полностью':'The full day is visible','Календарь Анны':'Anna’s calendar','Тренировка с Константином':'Training with Konstantin','Свяжитесь с тренером, если нужно перенести тренировку.':'Contact the trainer if you need to reschedule.','Комментарий тренера':'Trainer comment','Возьмите полотенце.':'Bring a towel.','Авто + свой текст':'Automatic + custom text','Обновляется вместе с событием':'Updates with the event','Только её занятия':'Only her trainings','Только просмотр':'View only','Доступ для семьи':'Family access','Моё полное расписание':'My full schedule','Напоминание о расписании':'Schedule reminder','Напоминаю расписание тренировок на эту неделю:':'Here is your training schedule for this week:','Если нужно скорректировать время — дайте знать заранее.':'Let me know in advance if the time needs to be adjusted.','Всего':'Total','Пора отправить':'Time to send','Запланированные':'Scheduled','Отправленные':'Sent','Свободное окно':'Available slot','Остаток абонемента':'Remaining membership','Напоминание':'Reminder','Перенос':'Reschedule','Процент или фиксированное удержание':'Percentage or fixed deduction','Отдельные правила для тренировок, абонементов и услуг':'Separate rules for trainings, memberships and services','Баланс клуба и история расчётов':'Club balance and settlement history','Фиксированные платежи за период и дежурства':'Fixed period payments and duties','Клиенты платят клубу':'Clients pay the club','Доля тренера после занятий':'Trainer share after trainings','Комиссии, оплаченные тренером':'Commissions paid by the trainer','Дежурства тренера':'Trainer duties','К получению от клуба':'To receive from the club','Взаиморасчёт':'Settlement','Основная работа без интернета':'Core work without internet','Локальные данные':'Local data','Нет серверной базы TWORK':'No TWORK server database','Платформа':'Platform','Создано только для iPhone':'Built only for iPhone','Персональный тренер':'Personal trainer','Тренер в нескольких клубах':'Trainer in multiple clubs','Онлайн-тренер':'Online trainer','Владелец студии или клуба':'Studio or club owner','Выберите вариант':'Choose an option','Необязательно':'Optional','Данные используются только для связи по поводу раннего доступа.':'Your data is used only to contact you about early access.','Заявка отправлена. Мы напишем вам на указанный email.':'Request sent. We will contact you at the provided email.'
  };

  const replaceProperNames = (source, language) => {
    if (language === 'ru') return source;
    if (language === 'uk') {
      return source
        .replaceAll('Анна Ковалёва','Анна Ковальова')
        .replaceAll('Максим и Олег','Максим і Олег')
        .replaceAll('Елена','Олена')
        .replaceAll('Алматы','Алмати');
    }
    return source
      .replaceAll('Анна Ковалёва','Anna Kovalova')
      .replaceAll('Максим и Олег','Maxim and Oleg')
      .replaceAll('Елена','Elena')
      .replaceAll('Ольга','Olga')
      .replaceAll('Братислава','Bratislava')
      .replaceAll('Алматы','Almaty');
  };

  const translateString = (source,language) => {
    if (language === 'ru') return source;
    const key = source.trim();
    if (language === 'en' && exactEnglish[key]) return exactEnglish[key];

    let result = replaceProperNames(source,language);
    if (result.includes('Русский')) {
      try {
        const locale = language === 'zh-Hans' ? 'zh-CN' : language;
        result = result.replaceAll('Русский',new Intl.DisplayNames([locale],{type:'language'}).of('ru'));
      } catch {
        result = result.replaceAll('Русский','Russian');
      }
    }

    // Unknown phrases intentionally remain untouched. The Playwright
    // completeness test reports them as missing translations instead of
    // producing mixed words such as “abonnementы”.
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
    const next = `${match[1]}${translateString(source,language)}${match[3]}`;
    if (next !== raw) node.nodeValue = next;
  };

  const localizeWeekdays = language => {
    const locale = language === 'zh-Hans' ? 'zh-CN' : language;
    document.querySelectorAll('.hero-cal-weekdays').forEach(container => [...container.children].forEach((element,index) => {
      try {
        const next = new Intl.DateTimeFormat(locale,{weekday:'short'}).format(new Date(2026,5,15 + index));
        if (element.textContent !== next) element.textContent = next;
      } catch {}
    }));
    document.querySelectorAll('.week-mini').forEach(container => [...container.children].forEach((element,index) => {
      try {
        const next = new Intl.DateTimeFormat(locale,{weekday:'short'}).format(new Date(2026,5,15 + index));
        if (element.textContent !== next) element.textContent = next;
      } catch {}
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
      while ((node = audit.nextNode())) {
        if (!node.parentElement?.closest('script,style,svg,.language-switcher') && hasRussian(node.nodeValue || '')) residual += 1;
      }
      document.documentElement.dataset.i18nResidual = String(residual);
    } else {
      document.documentElement.dataset.i18nResidual = '0';
    }
  };

  window.TWORK_I18N_CLEANUP = (language = currentLanguage()) => run(document.body,language);

  const boot = () => {
    run();
    setTimeout(() => run(),220);
    setTimeout(() => run(),620);
  };
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded',boot,{once:true}); else boot();
})();
