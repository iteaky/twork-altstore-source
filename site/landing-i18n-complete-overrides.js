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

    add('Email Apple Account (для TestFlight)', {
      ru:'Email Apple Account (для TestFlight)', en:'Apple Account email (for TestFlight)',
      sk:'Email Apple Account (pre TestFlight)', cs:'E-mail Apple Account (pro TestFlight)',
      hu:'Apple Account e-mail-cím (TestFlight)', pl:'E-mail Apple Account (do TestFlight)',
      de:'Apple Account-E-Mail (für TestFlight)', uk:'Email Apple Account (для TestFlight)',
      es:'Email de Apple Account (para TestFlight)', fr:'E-mail Apple Account (pour TestFlight)',
      pt:'E-mail da Apple Account (para TestFlight)', ar:'بريد Apple Account الإلكتروني (لـ TestFlight)',
      'zh-Hans':'Apple Account 邮箱（用于 TestFlight）', ja:'Apple Accountのメール（TestFlight用）',
      ko:'Apple Account 이메일(TestFlight용)'
    });
    add('Укажите email, с которым вы вошли в App Store на iPhone. На него мы выдадим доступ к тестовой версии TWORK.', {
      ru:'Укажите email, с которым вы вошли в App Store на iPhone. На него мы выдадим доступ к тестовой версии TWORK.',
      en:'Enter the email you use to sign in to the App Store on your iPhone. We will grant access to the TWORK test version to this account.',
      sk:'Zadajte email, ktorým ste prihlásení do App Store na iPhone. Na tento účet vám sprístupníme testovaciu verziu TWORK.',
      cs:'Zadejte e-mail, kterým jste přihlášeni do App Storu na iPhonu. Tomuto účtu zpřístupníme testovací verzi TWORK.',
      hu:'Adja meg azt az e-mail-címet, amellyel be van jelentkezve az App Store-ba az iPhone-ján. Ehhez a fiókhoz adunk hozzáférést a TWORK tesztverziójához.',
      pl:'Podaj e-mail używany do logowania w App Store na iPhonie. Na to konto przyznamy dostęp do testowej wersji TWORK.',
      de:'Gib die E-Mail-Adresse ein, mit der du auf deinem iPhone im App Store angemeldet bist. Für dieses Konto schalten wir die TWORK-Testversion frei.',
      uk:'Вкажіть email, з яким ви увійшли в App Store на iPhone. На цей акаунт ми надамо доступ до тестової версії TWORK.',
      es:'Introduce el email con el que has iniciado sesión en App Store en tu iPhone. Daremos acceso a la versión de prueba de TWORK a esta cuenta.',
      fr:'Indiquez l’e-mail utilisé pour vous connecter à l’App Store sur votre iPhone. Nous donnerons à ce compte l’accès à la version de test de TWORK.',
      pt:'Indique o e-mail usado para iniciar sessão na App Store no iPhone. Daremos a essa conta acesso à versão de teste do TWORK.',
      ar:'أدخل البريد الإلكتروني الذي تستخدمه لتسجيل الدخول إلى App Store على iPhone. سنمنح هذا الحساب إمكانية الوصول إلى النسخة التجريبية من TWORK.',
      'zh-Hans':'请输入您在 iPhone 上登录 App Store 时使用的邮箱。我们会为该账户开通 TWORK 测试版访问权限。',
      ja:'iPhoneのApp Storeへのサインインに使用しているメールアドレスを入力してください。このアカウントにTWORKテスト版へのアクセス権を付与します。',
      ko:'iPhone의 App Store에 로그인할 때 사용하는 이메일을 입력하세요. 해당 계정에 TWORK 테스트 버전 접근 권한을 부여합니다.'
    });
    add('email вашего Apple Account', {
      ru:'email вашего Apple Account', en:'your Apple Account email',
      sk:'email vášho Apple Account', cs:'e-mail vašeho Apple Account',
      hu:'az Apple Account e-mail-címe', pl:'e-mail Twojego Apple Account',
      de:'E-Mail deines Apple Account', uk:'email вашого Apple Account',
      es:'email de tu Apple Account', fr:'e-mail de votre Apple Account',
      pt:'e-mail da sua Apple Account', ar:'بريد Apple Account الإلكتروني',
      'zh-Hans':'您的 Apple Account 邮箱', ja:'Apple Accountのメール', ko:'Apple Account 이메일'
    });

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
