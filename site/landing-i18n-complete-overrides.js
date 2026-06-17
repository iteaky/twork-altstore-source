(() => {
  window.TWORK_APPLY_COMPLETE_OVERRIDES = () => {
    const bundle = window.TWORK_COMPLETE_I18N;
    if (!bundle?.keys || !bundle?.values) return;

    const languages = ['sk','en','ru','cs','hu','pl','de','uk','es','fr','pt','ar','zh-Hans','ja','ko'];
    const ensureLanguage = language => {
      bundle.values[language] ||= [];
      while (bundle.values[language].length < bundle.keys.length) bundle.values[language].push('');
    };
    languages.forEach(ensureLanguage);

    const indexOf = source => bundle.keys.indexOf(source);
    const patch = (source, language, value) => {
      const index = indexOf(source);
      if (index >= 0) bundle.values[language][index] = value;
    };
    const add = (source, values) => {
      let index = indexOf(source);
      if (index < 0) {
        index = bundle.keys.length;
        bundle.keys.push(source);
        languages.forEach(language => bundle.values[language].push(''));
      }
      for (const [language,value] of Object.entries(values)) bundle.values[language][index] = value;
    };

    const fixes = {
      cs: {
        '10:00 · Онлайн':'10:00 · Online trénink',
        '18:00 · Анна':'18:00 · Anna · trénink',
        'Анна · Bratislava':'Anna · Bratislava, Slovensko',
        'Анна · Братислава':'Anna · Bratislava, Slovensko',
        'Mark · онлайн':'Mark · online trénink'
      },
      de: {
        '1 тренировка':'1 Trainingseinheit',
        '3 тренировки':'3 Trainingseinheiten',
        '10:00 · Онлайн':'10:00 · Online-Training',
        '18:00 · Анна':'18:00 · Anna · Training',
        'Анна · Bratislava':'Anna · Bratislava, Slowakei',
        'Анна · Братислава':'Anna · Bratislava, Slowakei',
        'Mark · онлайн':'Mark · Online-Training',
        'Персональный тренер':'Personaltrainer'
      },
      es: {
        '18:00 · Анна':'18:00 · Anna · sesión',
        'Анна · Bratislava':'Anna · Bratislava, Eslovaquia',
        'Анна · Братислава':'Anna · Bratislava, Eslovaquia',
        'Всего: 2':'Total: 2 elementos'
      },
      fr: {
        '18:00 · Анна':'18:00 · Anna · séance',
        'Анна · Bratislava':'Anna · Bratislava, Slovaquie',
        'Анна · Братислава':'Anna · Bratislava, Slovaquie',
        'Functional · 8 участников':'Fonctionnel · 8 participants',
        'Iron Club · 60 минут':'Iron Club · séance de 60 minutes',
        'Mobility · 6 участников':'Mobilité · 6 participants'
      },
      hu: {
        '10:00 · Онлайн':'10:00 · Online edzés',
        '18:00 · Анна':'18:00 · Anna · edzés',
        'Mark · онлайн':'Mark · online edzés',
        'Онлайн-ведение':'Online edzésvezetés'
      },
      sk: {
        '10:00 · Онлайн':'10:00 · Online tréning',
        '18:00 · Анна':'18:00 · Anna · tréning',
        'Анна · Bratislava':'Anna · Bratislava, Slovensko',
        'Анна · Братислава':'Anna · Bratislava, Slovensko',
        'Mark · онлайн':'Mark · online tréning'
      },
      uk: {
        '10:00 · Онлайн':'10:00 · Онлайн-тренування',
        '18:00 · Анна':'18:00 · Анна · тренування',
        'Iron Club · до 18:00':'Iron Club · до 18:00 год',
        'Mark · онлайн':'Марк · онлайн',
        'Анна · Братислава':'Анна · м. Братислава',
        'Без сервера TWORK':'TWORK без власного сервера'
      }
    };
    for (const [language,values] of Object.entries(fixes)) {
      for (const [source,value] of Object.entries(values)) patch(source,language,value);
    }

    add('Максим и Олег · TWORK Studio', {
      ru:'Максим и Олег · TWORK Studio', en:'Maxim and Oleg · TWORK Studio',
      sk:'Maxim a Oleg · štúdio TWORK', cs:'Maxim a Oleg · studio TWORK',
      hu:'Maxim és Oleg · TWORK stúdió', pl:'Maxim i Oleg · studio TWORK',
      de:'Maxim und Oleg · TWORK-Studio', uk:'Максим і Олег · студія TWORK',
      es:'Maxim y Oleg · estudio TWORK', fr:'Maxim et Oleg · studio TWORK',
      pt:'Maxim e Oleg · estúdio TWORK', ar:'مكسيم وأوليغ · استوديو TWORK',
      'zh-Hans':'马克西姆和奥列格 · TWORK 工作室', ja:'マクシムとオレグ · TWORKスタジオ',
      ko:'막심과 올레그 · TWORK 스튜디오'
    });
    add('Елена · Алматы', {
      ru:'Елена · Алматы', en:'Elena · Almaty',
      sk:'Elena · Almaty, Kazachstan', cs:'Elena · Almaty, Kazachstán',
      hu:'Elena · Almati, Kazahsztán', pl:'Elena · Ałmaty, Kazachstan',
      de:'Elena · Almaty, Kasachstan', uk:'Олена · Алмати, Казахстан',
      es:'Elena · Almaty, Kazajistán', fr:'Elena · Almaty, Kazakhstan',
      pt:'Elena · Almaty, Cazaquistão', ar:'إيلينا · ألماتي، كازاخستان',
      'zh-Hans':'叶莲娜 · 哈萨克斯坦阿拉木图', ja:'エレナ · カザフスタン・アルマトイ',
      ko:'옐레나 · 카자흐스탄 알마티'
    });
  };

  window.TWORK_APPLY_COMPLETE_OVERRIDES();
})();
