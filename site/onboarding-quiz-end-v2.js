(() => {
  if(window.TWORK_QUIZ_END_V2)return;window.TWORK_QUIZ_END_V2=true;
  const quizStyle=document.querySelector('[data-twork-v542-style="onboarding-quiz-v6"]');
  if(quizStyle)quizStyle.href='site/onboarding-quiz-v6.css?v=20260620-5';
  else{const l=document.createElement('link');l.rel='stylesheet';l.href='site/onboarding-quiz-v6.css?v=20260620-5';l.dataset.tworkV542Style='onboarding-quiz-v6';document.head.appendChild(l)}
  if(!document.querySelector('[data-twork-quiz-v554-upgrade]')){const s=document.createElement('script');s.src='site/onboarding-quiz-v554-upgrade.js?v=20260620-5';s.async=false;s.dataset.tworkQuizV554Upgrade='1';document.head.appendChild(s)}

  const copy={
    ru:{over:'Настройка до первого запуска',title:'Познакомьтесь с TWORK — и сразу настройте его под себя.',lead:'Пройдите тот же пошаговый квиз, что и в приложении. Выберите рабочие форматы, цены, уведомления и правила клубов, а в конце получите готовый файл настроек для iPhone.',start:'Пройти квиз настройки',time:'Около 5–7 минут',privacy:'Без аккаунта и сервера',file:'Ваш файл TWORK',desc:'Только настройки — без клиентов, балансов и истории оплат.',a:'Форматы работы и функции',b:'Цены, абонементы и услуги',c:'Клубы и взаиморасчёты'},
    en:{over:'Set up before first launch',title:'Explore TWORK — and configure it for your work.',lead:'Take the same guided quiz used inside the app. Choose work formats, prices, notifications and club rules, then receive a ready-to-use setup file for iPhone.',start:'Start the setup quiz',time:'About 5–7 minutes',privacy:'No account or server',file:'Your TWORK file',desc:'Settings only — no clients, balances or payment history.',a:'Work formats and features',b:'Prices, subscriptions and services',c:'Clubs and settlement rules'},
    sk:{over:'Nastavenie pred prvým spustením',title:'Spoznajte TWORK a rovno si ho nastavte.',lead:'Prejdite rovnakým sprievodcom ako v aplikácii. Vyberte formáty práce, ceny, upozornenia a pravidlá klubov a získajte hotový súbor nastavení pre iPhone.',start:'Spustiť kvíz nastavenia',time:'Približne 5–7 minút',privacy:'Bez účtu a servera',file:'Váš súbor TWORK',desc:'Iba nastavenia — bez klientov, zostatkov a histórie platieb.',a:'Formáty práce a funkcie',b:'Ceny, permanentky a služby',c:'Kluby a vyúčtovanie'},
    cs:{over:'Nastavení před prvním spuštěním',title:'Poznejte TWORK a rovnou si ho nastavte.',lead:'Projděte stejný průvodce jako v aplikaci. Vyberte pracovní formáty, ceny, upozornění a pravidla klubů a na konci získáte hotový soubor nastavení pro iPhone.',start:'Spustit kvíz nastavení',time:'Přibližně 5–7 minut',privacy:'Bez účtu a serveru',file:'Váš soubor TWORK',desc:'Pouze nastavení — bez klientů, zůstatků a historie plateb.',a:'Formáty práce a funkce',b:'Ceny, permanentky a služby',c:'Kluby a vyúčtování'},
    hu:{over:'Beállítás az első indítás előtt',title:'Ismerd meg a TWORK-öt, és állítsd be rögtön a munkádhoz.',lead:'Haladj végig ugyanazon a lépésről lépésre vezető kérdőíven, mint az alkalmazásban. Válaszd ki a munkaformákat, árakat, értesítéseket és klubszabályokat, majd töltsd le az iPhone-hoz kész beállítási fájlt.',start:'Beállítási kvíz indítása',time:'Körülbelül 5–7 perc',privacy:'Fiók és szerver nélkül',file:'A TWORK-fájlod',desc:'Csak beállítások — ügyfelek, egyenlegek és fizetési előzmények nélkül.',a:'Munkaformák és funkciók',b:'Árak, bérletek és szolgáltatások',c:'Klubok és elszámolási szabályok'},
    pl:{over:'Konfiguracja przed pierwszym uruchomieniem',title:'Poznaj TWORK i od razu dopasuj go do swojej pracy.',lead:'Przejdź ten sam przewodnik krok po kroku co w aplikacji. Wybierz formy pracy, ceny, powiadomienia i zasady klubów, a na końcu pobierz gotowy plik ustawień dla iPhone’a.',start:'Rozpocznij quiz konfiguracji',time:'Około 5–7 minut',privacy:'Bez konta i serwera',file:'Twój plik TWORK',desc:'Tylko ustawienia — bez klientów, sald i historii płatności.',a:'Formy pracy i funkcje',b:'Ceny, karnety i usługi',c:'Kluby i rozliczenia'},
    de:{over:'Einrichtung vor dem ersten Start',title:'Lerne TWORK kennen und richte es direkt für deine Arbeit ein.',lead:'Durchlaufe denselben Schritt-für-Schritt-Assistenten wie in der App. Wähle Arbeitsformen, Preise, Benachrichtigungen und Clubregeln und erhalte anschließend eine fertige Einstellungsdatei für dein iPhone.',start:'Einrichtungs-Quiz starten',time:'Etwa 5–7 Minuten',privacy:'Kein Konto, kein Server',file:'Deine TWORK-Datei',desc:'Nur Einstellungen — ohne Kundendaten, Salden oder Zahlungsverlauf.',a:'Arbeitsformen und Funktionen',b:'Preise, Abos und Leistungen',c:'Clubs und Abrechnungsregeln'},
    uk:{over:'Налаштування перед першим запуском',title:'Познайомтеся з TWORK і одразу налаштуйте його під свою роботу.',lead:'Пройдіть той самий покроковий квіз, що й у застосунку. Виберіть формати роботи, ціни, сповіщення та правила клубів, а наприкінці отримайте готовий файл налаштувань для iPhone.',start:'Пройти квіз налаштування',time:'Приблизно 5–7 хвилин',privacy:'Без облікового запису й сервера',file:'Ваш файл TWORK',desc:'Лише налаштування — без клієнтів, балансів та історії оплат.',a:'Формати роботи та функції',b:'Ціни, абонементи й послуги',c:'Клуби та взаєморозрахунки'},
    es:{over:'Configuración antes del primer inicio',title:'Descubre TWORK y configúralo desde el principio para tu trabajo.',lead:'Completa el mismo cuestionario guiado que se utiliza en la aplicación. Elige formatos de trabajo, precios, notificaciones y reglas de clubes y obtén al final un archivo de configuración listo para el iPhone.',start:'Iniciar el cuestionario de configuración',time:'Unos 5–7 minutos',privacy:'Sin cuenta ni servidor',file:'Tu archivo de TWORK',desc:'Solo ajustes: sin clientes, saldos ni historial de pagos.',a:'Formatos de trabajo y funciones',b:'Precios, bonos y servicios',c:'Clubes y liquidaciones'},
    fr:{over:'Configuration avant le premier lancement',title:'Découvrez TWORK et configurez-le immédiatement pour votre activité.',lead:'Suivez le même questionnaire guidé que dans l’application. Choisissez vos formats de travail, tarifs, notifications et règles de club, puis récupérez un fichier de configuration prêt pour l’iPhone.',start:'Démarrer le questionnaire de configuration',time:'Environ 5 à 7 minutes',privacy:'Sans compte ni serveur',file:'Votre fichier TWORK',desc:'Uniquement les réglages — sans clients, soldes ni historique des paiements.',a:'Formats de travail et fonctionnalités',b:'Tarifs, abonnements et services',c:'Clubs et règles de règlement'},
    pt:{over:'Configuração antes da primeira utilização',title:'Conheça o TWORK e configure-o desde já para o seu trabalho.',lead:'Conclua o mesmo questionário guiado utilizado na aplicação. Escolha formatos de trabalho, preços, notificações e regras de clubes e receba no final um ficheiro de configuração pronto para o iPhone.',start:'Iniciar o questionário de configuração',time:'Cerca de 5–7 minutos',privacy:'Sem conta nem servidor',file:'O seu ficheiro TWORK',desc:'Apenas definições — sem clientes, saldos ou histórico de pagamentos.',a:'Formatos de trabalho e funcionalidades',b:'Preços, pacotes e serviços',c:'Clubes e acertos'},
    ar:{over:'الإعداد قبل التشغيل الأول',title:'تعرّف على TWORK واضبطه مباشرةً بما يناسب عملك.',lead:'أكمل الاستبيان الإرشادي نفسه الموجود داخل التطبيق. اختر أنماط العمل والأسعار والإشعارات وقواعد الأندية، ثم احصل في النهاية على ملف إعداد جاهز لجهاز iPhone.',start:'بدء استبيان الإعداد',time:'حوالي 5–7 دقائق',privacy:'من دون حساب أو خادم',file:'ملف TWORK الخاص بك',desc:'إعدادات فقط — من دون عملاء أو أرصدة أو سجل مدفوعات.',a:'أنماط العمل والميزات',b:'الأسعار والاشتراكات والخدمات',c:'الأندية وقواعد التسوية'},
    'zh-Hans':{over:'首次启动前设置',title:'了解 TWORK，并立即按你的工作方式完成设置。',lead:'完成与应用内相同的分步设置问卷。选择工作形式、价格、通知和俱乐部规则，最后获取可直接用于 iPhone 的设置文件。',start:'开始设置问卷',time:'约 5–7 分钟',privacy:'无需账号或服务器',file:'你的 TWORK 文件',desc:'仅包含设置，不含客户、余额或付款历史。',a:'工作形式与功能',b:'价格、套餐与服务',c:'俱乐部与结算规则'},
    ja:{over:'初回起動前の設定',title:'TWORKを知り、仕事に合わせてすぐに設定しましょう。',lead:'アプリ内と同じステップ形式の設定クイズに進みます。働き方、料金、通知、クラブのルールを選び、最後にiPhoneで使える設定ファイルを受け取れます。',start:'設定クイズを始める',time:'約5〜7分',privacy:'アカウント・サーバー不要',file:'TWORK設定ファイル',desc:'設定のみ。顧客、残高、支払い履歴は含まれません。',a:'働き方と機能',b:'料金、回数券、サービス',c:'クラブと精算ルール'},
    ko:{over:'첫 실행 전 설정',title:'TWORK를 살펴보고 업무 방식에 맞게 바로 설정하세요.',lead:'앱에서 사용하는 것과 같은 단계별 설정 퀴즈를 진행하세요. 업무 형태, 가격, 알림, 클럽 규칙을 선택한 뒤 iPhone에서 바로 사용할 수 있는 설정 파일을 받을 수 있습니다.',start:'설정 퀴즈 시작',time:'약 5~7분',privacy:'계정과 서버 없이',file:'내 TWORK 파일',desc:'설정만 포함되며 고객, 잔액, 결제 내역은 포함되지 않습니다.',a:'업무 형태와 기능',b:'가격, 이용권, 서비스',c:'클럽과 정산 규칙'}
  };

  const language=()=>{
    const raw=String(document.documentElement.dataset.siteLanguage||document.documentElement.lang||'en').replace('_','-');
    if(copy[raw])return raw;
    const lower=raw.toLowerCase();
    if(lower.startsWith('zh'))return 'zh-Hans';
    const base=lower.split('-')[0];
    return copy[base]?base:'en';
  };
  const esc=v=>String(v).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
  let renderedLanguage='';
  function render(){
    const main=document.querySelector('main');if(!main)return;
    const currentLanguage=language();
    const t=copy[currentLanguage]||copy.en;
    let section=document.getElementById('setup-quiz-end');
    if(section&&renderedLanguage===currentLanguage&&section.dataset.quizLanguage===currentLanguage)return;
    if(!section){
      section=document.createElement('section');
      section.id='setup-quiz-end';
      section.className='quiz-end-section section-pad setup-i18n-island';
      const final=main.querySelector('.final-section');
      final?final.insertAdjacentElement('afterend',section):main.appendChild(section);
    }
    renderedLanguage=currentLanguage;
    section.dataset.quizLanguage=currentLanguage;
    section.lang=currentLanguage;
    section.dir=currentLanguage==='ar'?'rtl':'ltr';
    section.innerHTML=`<div class="container"><div class="quiz-end-card"><div class="quiz-end-copy"><p class="overline">${esc(t.over)}</p><h2>${esc(t.title)}</h2><p>${esc(t.lead)}</p><div class="quiz-end-actions"><button class="quiz-end-primary" type="button" data-quiz-end-open data-twq6-open>${esc(t.start)}</button><div class="quiz-end-meta"><span>${esc(t.time)}</span><span>${esc(t.privacy)}</span></div></div></div><div class="quiz-end-file" aria-hidden="true"><div class="quiz-end-file-card"><div class="quiz-end-file-icon">TW</div><h3>${esc(t.file)}</h3><p>${esc(t.desc)}</p><div class="quiz-end-file-list"><span>${esc(t.a)}</span><span>${esc(t.b)}</span><span>${esc(t.c)}</span></div><div class="quiz-end-file-badge">↗</div></div></div></div></div>`;
  }
  if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',render,{once:true});else render();
  new MutationObserver(render).observe(document.documentElement,{attributes:true,attributeFilter:['data-site-language']});
})();
