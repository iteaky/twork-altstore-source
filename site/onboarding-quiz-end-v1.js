(() => {
  if (window.TWORK_QUIZ_END_BLOCK_V1) return;
  window.TWORK_QUIZ_END_BLOCK_V1 = true;

  const copy = {
    ru: {
      overline: 'Настройка до первого запуска',
      title: 'Познакомьтесь с TWORK — и сразу настройте его под себя.',
      lead: 'Пройдите тот же пошаговый квиз, что и в приложении. Вы увидите функции TWORK, выберете рабочие форматы, цены, уведомления и правила клубов, а в конце получите готовый файл настроек для iPhone.',
      b1: 'Квиз как в приложении', b1d: 'Те же шаги, варианты, тексты и логика появления вопросов.',
      b2: 'Настоящие настройки', b2d: 'Результат можно открыть в TWORK вместо повторного заполнения.',
      b3: 'Без хранения на сайте', b3d: 'Ответы остаются в браузере до скачивания или отправки файла.',
      start: 'Пройти квиз настройки', time: 'Около 5–7 минут', privacy: 'Без аккаунта и сервера',
      fileTitle: 'Ваш файл TWORK', fileDescription: 'Только настройки — без клиентов, балансов и истории оплат.',
      item1: 'Форматы работы и функции', item2: 'Цены, абонементы и услуги', item3: 'Клубы и взаиморасчёты'
    },
    en: {
      overline: 'Set up before first launch',
      title: 'Explore TWORK — and configure it for your work.',
      lead: 'Take the same guided quiz used inside the app. Explore TWORK features, choose work formats, prices, notifications and club rules, then receive a ready-to-use setup file for iPhone.',
      b1: 'Matches the app', b1d: 'The same steps, choices, copy and conditional logic.',
      b2: 'Real configuration', b2d: 'Open the result in TWORK instead of entering everything again.',
      b3: 'Nothing stored here', b3d: 'Answers stay in the browser until you download or share the file.',
      start: 'Start the setup quiz', time: 'About 5–7 minutes', privacy: 'No account or TWORK server',
      fileTitle: 'Your TWORK file', fileDescription: 'Settings only — never clients, balances or payment history.',
      item1: 'Work formats and features', item2: 'Prices, subscriptions and services', item3: 'Clubs and settlement rules'
    },
    sk: {
      overline: 'Nastavenie pred prvým spustením',
      title: 'Spoznajte TWORK a rovno si ho nastavte.',
      lead: 'Prejdite rovnakým sprievodcom ako v aplikácii. Spoznáte funkcie TWORK, vyberiete formáty práce, ceny, upozornenia a pravidlá klubov a získate hotový súbor nastavení pre iPhone.',
      b1: 'Rovnaké ako v aplikácii', b1d: 'Tie isté kroky, možnosti, texty a podmienené otázky.',
      b2: 'Skutočné nastavenie', b2d: 'Výsledok otvoríte v TWORK bez opätovného vypĺňania.',
      b3: 'Web nič neukladá', b3d: 'Odpovede zostávajú v prehliadači do stiahnutia alebo zdieľania.',
      start: 'Spustiť kvíz nastavenia', time: 'Približne 5–7 minút', privacy: 'Bez účtu a servera TWORK',
      fileTitle: 'Váš súbor TWORK', fileDescription: 'Iba nastavenia — bez klientov, zostatkov a histórie platieb.',
      item1: 'Formáty práce a funkcie', item2: 'Ceny, permanentky a služby', item3: 'Kluby a vyúčtovanie'
    },
    cs: {overline:'Nastavení před prvním spuštěním',title:'Poznejte TWORK a rovnou si jej nastavte.',lead:'Projděte stejný průvodce jako v aplikaci. Vyberete pracovní formáty, ceny, upozornění a pravidla klubů a získáte hotový soubor nastavení pro iPhone.',b1:'Stejné jako v aplikaci',b1d:'Stejné kroky, možnosti, texty a podmíněné otázky.',b2:'Skutečné nastavení',b2d:'Výsledek otevřete v TWORK bez opakovaného vyplňování.',b3:'Web nic neukládá',b3d:'Odpovědi zůstávají v prohlížeči do stažení nebo sdílení.',start:'Spustit kvíz nastavení',time:'Přibližně 5–7 minut',privacy:'Bez účtu a serveru TWORK',fileTitle:'Váš soubor TWORK',fileDescription:'Pouze nastavení — bez klientů, zůstatků a historie plateb.',item1:'Formáty práce a funkce',item2:'Ceny, permanentky a služby',item3:'Kluby a vyúčtování'},
    de: {overline:'Einrichtung vor dem ersten Start',title:'TWORK kennenlernen und direkt passend einrichten.',lead:'Durchlaufen Sie denselben Assistenten wie in der App. Wählen Sie Arbeitsformen, Preise, Benachrichtigungen und Clubregeln und erhalten Sie eine fertige Einstellungsdatei für das iPhone.',b1:'Wie in der App',b1d:'Dieselben Schritte, Optionen, Texte und Bedingungen.',b2:'Echte Konfiguration',b2d:'Das Ergebnis lässt sich in TWORK öffnen, ohne alles erneut einzugeben.',b3:'Keine Speicherung',b3d:'Antworten bleiben bis zum Download oder Teilen im Browser.',start:'Einrichtungsquiz starten',time:'Etwa 5–7 Minuten',privacy:'Ohne Konto und TWORK-Server',fileTitle:'Ihre TWORK-Datei',fileDescription:'Nur Einstellungen — keine Kunden, Salden oder Zahlungshistorie.',item1:'Arbeitsformen und Funktionen',item2:'Preise, Abos und Leistungen',item3:'Clubs und Abrechnungsregeln'},
    uk: {overline:'Налаштування до першого запуску',title:'Познайомтеся з TWORK — і одразу налаштуйте його під себе.',lead:'Пройдіть той самий покроковий квіз, що й у застосунку. Оберіть формати роботи, ціни, сповіщення та правила клубів і отримайте готовий файл налаштувань для iPhone.',b1:'Як у застосунку',b1d:'Ті самі кроки, варіанти, тексти й умовна логіка.',b2:'Справжні налаштування',b2d:'Результат можна відкрити в TWORK без повторного заповнення.',b3:'Сайт нічого не зберігає',b3d:'Відповіді залишаються у браузері до завантаження або надсилання.',start:'Пройти квіз налаштування',time:'Близько 5–7 хвилин',privacy:'Без акаунта й сервера TWORK',fileTitle:'Ваш файл TWORK',fileDescription:'Лише налаштування — без клієнтів, балансів та історії оплат.',item1:'Формати роботи й функції',item2:'Ціни, абонементи й послуги',item3:'Клуби та взаєморозрахунки'},
    pl: {overline:'Konfiguracja przed pierwszym uruchomieniem',title:'Poznaj TWORK i od razu dopasuj go do swojej pracy.',lead:'Przejdź ten sam przewodnik co w aplikacji. Wybierz formaty pracy, ceny, powiadomienia i zasady klubów, a następnie pobierz gotowy plik ustawień dla iPhone’a.',b1:'Tak jak w aplikacji',b1d:'Te same kroki, opcje, teksty i logika warunkowa.',b2:'Prawdziwa konfiguracja',b2d:'Otwórz wynik w TWORK bez ponownego wpisywania danych.',b3:'Bez zapisu na stronie',b3d:'Odpowiedzi pozostają w przeglądarce do pobrania lub udostępnienia.',start:'Uruchom quiz konfiguracji',time:'Około 5–7 minut',privacy:'Bez konta i serwera TWORK',fileTitle:'Twój plik TWORK',fileDescription:'Tylko ustawienia — bez klientów, sald i historii płatności.',item1:'Formaty pracy i funkcje',item2:'Ceny, karnety i usługi',item3:'Kluby i rozliczenia'},
    hu: {overline:'Beállítás az első indítás előtt',title:'Ismerje meg a TWORK-öt, és állítsa be azonnal.',lead:'Töltse ki ugyanazt a vezetett kérdéssort, mint az alkalmazásban. Válassza ki a munkamódokat, árakat, értesítéseket és klubszabályokat, majd kapjon kész beállításfájlt iPhone-ra.',b1:'Ugyanaz, mint az appban',b1d:'Azonos lépések, lehetőségek, szövegek és feltételes logika.',b2:'Valódi beállítások',b2d:'Az eredmény megnyitható a TWORK-ben újbóli kitöltés nélkül.',b3:'A webhely nem tárolja',b3d:'A válaszok letöltésig vagy megosztásig a böngészőben maradnak.',start:'Beállítási kvíz indítása',time:'Körülbelül 5–7 perc',privacy:'Fiók és TWORK-szerver nélkül',fileTitle:'Az Ön TWORK-fájlja',fileDescription:'Csak beállítások — ügyfelek, egyenlegek és fizetési előzmények nélkül.',item1:'Munkamódok és funkciók',item2:'Árak, bérletek és szolgáltatások',item3:'Klubok és elszámolási szabályok'},
    es: {overline:'Configuración antes del primer inicio',title:'Conoce TWORK y déjalo configurado para tu trabajo.',lead:'Completa el mismo cuestionario guiado de la app. Elige formatos de trabajo, precios, avisos y reglas de clubes y obtén un archivo de configuración listo para iPhone.',b1:'Igual que en la app',b1d:'Los mismos pasos, opciones, textos y lógica condicional.',b2:'Configuración real',b2d:'Abre el resultado en TWORK sin repetir todo.',b3:'Nada se guarda aquí',b3d:'Las respuestas permanecen en el navegador hasta descargar o compartir.',start:'Iniciar cuestionario',time:'Unos 5–7 minutos',privacy:'Sin cuenta ni servidor TWORK',fileTitle:'Tu archivo TWORK',fileDescription:'Solo ajustes, sin clientes, saldos ni historial de pagos.',item1:'Formatos de trabajo y funciones',item2:'Precios, abonos y servicios',item3:'Clubes y liquidaciones'},
    fr: {overline:'Configuration avant le premier lancement',title:'Découvrez TWORK et configurez-le immédiatement.',lead:'Suivez le même questionnaire guidé que dans l’application. Choisissez vos formats de travail, tarifs, notifications et règles de clubs, puis obtenez un fichier de configuration prêt pour iPhone.',b1:'Comme dans l’application',b1d:'Les mêmes étapes, choix, textes et conditions.',b2:'Une vraie configuration',b2d:'Ouvrez le résultat dans TWORK sans tout ressaisir.',b3:'Aucun stockage sur le site',b3d:'Les réponses restent dans le navigateur jusqu’au téléchargement ou au partage.',start:'Démarrer le questionnaire',time:'Environ 5–7 minutes',privacy:'Sans compte ni serveur TWORK',fileTitle:'Votre fichier TWORK',fileDescription:'Uniquement les réglages — sans clients, soldes ni historique de paiement.',item1:'Formats de travail et fonctions',item2:'Tarifs, abonnements et services',item3:'Clubs et règles de règlement'},
    pt: {overline:'Configuração antes da primeira utilização',title:'Conheça o TWORK e deixe-o configurado para o seu trabalho.',lead:'Faça o mesmo questionário guiado da aplicação. Escolha formatos de trabalho, preços, notificações e regras de clubes e receba um ficheiro de configuração pronto para iPhone.',b1:'Igual à aplicação',b1d:'Os mesmos passos, opções, textos e lógica condicional.',b2:'Configuração real',b2d:'Abra o resultado no TWORK sem repetir tudo.',b3:'Nada fica guardado',b3d:'As respostas permanecem no navegador até descarregar ou partilhar.',start:'Iniciar questionário',time:'Cerca de 5–7 minutos',privacy:'Sem conta nem servidor TWORK',fileTitle:'O seu ficheiro TWORK',fileDescription:'Apenas definições — sem clientes, saldos ou histórico de pagamentos.',item1:'Formatos de trabalho e funções',item2:'Preços, planos e serviços',item3:'Clubes e regras de liquidação'},
    ar: {overline:'الإعداد قبل التشغيل الأول',title:'تعرّف على TWORK واضبطه بما يناسب عملك.',lead:'أكمل نفس الاختبار الإرشادي الموجود في التطبيق. اختر أنماط العمل والأسعار والإشعارات وقواعد الأندية، ثم احصل على ملف إعداد جاهز للـ iPhone.',b1:'مطابق للتطبيق',b1d:'نفس الخطوات والخيارات والنصوص والمنطق الشرطي.',b2:'إعدادات حقيقية',b2d:'افتح النتيجة في TWORK من دون إدخال كل شيء مرة أخرى.',b3:'لا تخزين على الموقع',b3d:'تبقى الإجابات في المتصفح حتى تنزيل الملف أو مشاركته.',start:'بدء اختبار الإعداد',time:'حوالي 5–7 دقائق',privacy:'من دون حساب أو خادم TWORK',fileTitle:'ملف TWORK الخاص بك',fileDescription:'إعدادات فقط — من دون عملاء أو أرصدة أو سجل مدفوعات.',item1:'أنماط العمل والوظائف',item2:'الأسعار والاشتراكات والخدمات',item3:'الأندية وقواعد التسوية'},
    'zh-Hans': {overline:'首次启动前完成设置',title:'了解 TWORK，并立即按你的工作方式完成配置。',lead:'完成与应用内相同的引导问卷。选择工作模式、价格、通知和俱乐部规则，然后获得可在 iPhone 上使用的设置文件。',b1:'与应用一致',b1d:'相同的步骤、选项、文案和条件逻辑。',b2:'真实配置',b2d:'在 TWORK 中打开结果，无需再次填写。',b3:'网站不保存数据',b3d:'答案只保留在浏览器中，直到下载或分享文件。',start:'开始设置问卷',time:'约 5–7 分钟',privacy:'无需账号和 TWORK 服务器',fileTitle:'你的 TWORK 文件',fileDescription:'仅包含设置，不包含客户、余额或付款记录。',item1:'工作模式与功能',item2:'价格、套餐与服务',item3:'俱乐部与结算规则'},
    ja: {overline:'初回起動前のセットアップ',title:'TWORKを知り、仕事に合わせてそのまま設定。',lead:'アプリ内と同じガイド付きクイズを進めます。働き方、料金、通知、クラブのルールを選び、iPhone用の設定ファイルを受け取れます。',b1:'アプリと同じ内容',b1d:'同じ手順、選択肢、文言、条件分岐です。',b2:'実際の設定',b2d:'結果をTWORKで開けば、再入力は不要です。',b3:'サイトには保存しません',b3d:'回答はダウンロードまたは共有までブラウザ内にのみ残ります。',start:'セットアップクイズを開始',time:'約5〜7分',privacy:'アカウント・TWORKサーバー不要',fileTitle:'TWORK設定ファイル',fileDescription:'設定のみ。顧客、残高、支払い履歴は含みません。',item1:'働き方と機能',item2:'料金、回数券、サービス',item3:'クラブと精算ルール'},
    ko: {overline:'첫 실행 전 설정',title:'TWORK를 살펴보고 업무에 맞게 바로 설정하세요.',lead:'앱과 동일한 안내형 퀴즈를 진행합니다. 업무 방식, 가격, 알림, 클럽 규칙을 선택하고 iPhone용 설정 파일을 받으세요.',b1:'앱과 동일한 퀴즈',b1d:'같은 단계, 선택지, 문구와 조건부 흐름을 사용합니다.',b2:'실제 설정 파일',b2d:'결과를 TWORK에서 열면 다시 입력할 필요가 없습니다.',b3:'사이트에 저장하지 않음',b3d:'답변은 다운로드하거나 공유할 때까지 브라우저에만 남습니다.',start:'설정 퀴즈 시작',time:'약 5–7분',privacy:'계정 및 TWORK 서버 불필요',fileTitle:'TWORK 설정 파일',fileDescription:'설정만 포함하며 고객, 잔액, 결제 내역은 포함하지 않습니다.',item1:'업무 방식과 기능',item2:'가격, 이용권 및 서비스',item3:'클럽과 정산 규칙'}
  };

  const language = () => {
    const raw = document.documentElement.dataset.siteLanguage || document.documentElement.lang || 'en';
    if (copy[raw]) return raw;
    const base = String(raw).toLowerCase().split('-')[0];
    return copy[base] ? base : 'en';
  };

  const escapeHTML = value => String(value).replace(/[&<>'"]/g, character => ({'&':'&amp;','<':'&lt;','>':'&gt;',"'":'&#39;','"':'&quot;'}[character]));

  const markup = text => `
    <div class="container">
      <div class="quiz-end-card reveal">
        <div class="quiz-end-copy">
          <p class="overline">${escapeHTML(text.overline)}</p>
          <h2>${escapeHTML(text.title)}</h2>
          <p>${escapeHTML(text.lead)}</p>
          <div class="quiz-end-benefits">
            <div class="quiz-end-benefit"><strong>${escapeHTML(text.b1)}</strong><span>${escapeHTML(text.b1d)}</span></div>
            <div class="quiz-end-benefit"><strong>${escapeHTML(text.b2)}</strong><span>${escapeHTML(text.b2d)}</span></div>
            <div class="quiz-end-benefit"><strong>${escapeHTML(text.b3)}</strong><span>${escapeHTML(text.b3d)}</span></div>
          </div>
          <div class="quiz-end-actions">
            <button class="quiz-end-primary" type="button" data-quiz-end-open>${escapeHTML(text.start)}</button>
            <div class="quiz-end-meta"><span>${escapeHTML(text.time)}</span><span>${escapeHTML(text.privacy)}</span></div>
          </div>
        </div>
        <div class="quiz-end-file" aria-hidden="true">
          <div class="quiz-end-file-card">
            <div class="quiz-end-file-icon">TW</div>
            <h3>${escapeHTML(text.fileTitle)}</h3>
            <p>${escapeHTML(text.fileDescription)}</p>
            <div class="quiz-end-file-list"><span>${escapeHTML(text.item1)}</span><span>${escapeHTML(text.item2)}</span><span>${escapeHTML(text.item3)}</span></div>
            <div class="quiz-end-file-badge">↗</div>
          </div>
        </div>
      </div>
    </div>`;

  const render = () => {
    const main = document.querySelector('main');
    if (!main) return;
    let section = document.getElementById('setup-quiz-end');
    if (!section) {
      section = document.createElement('section');
      section.id = 'setup-quiz-end';
      section.className = 'quiz-end-section section-pad setup-i18n-island';
      const finalSection = main.querySelector('.final-section');
      if (finalSection) finalSection.insertAdjacentElement('afterend', section);
      else main.appendChild(section);
    }
    section.innerHTML = markup(copy[language()]);
  };

  const visible = element => !!(element && element.getClientRects().length && !element.disabled);

  const openQuiz = source => {
    const directSelectors = [
      '[data-setup-open]', '[data-twq-open]', '[data-quiz-open]', '[data-native-quiz-open]',
      '.setup-hero-button', '.js-setup-quiz', '.twq-open', '.quiz-open'
    ];
    for (const selector of directSelectors) {
      const target = [...document.querySelectorAll(selector)].find(element => element !== source && !source.closest('section')?.contains(element) && visible(element));
      if (target) { target.click(); return true; }
    }

    const quizWords = /квиз|quiz|kvíz|kvíz|cuestionario|questionnaire|квіз|クイズ|퀴즈|问卷|اختبار/i;
    const textTarget = [...document.querySelectorAll('button,a')].find(element => element !== source && !source.closest('section')?.contains(element) && visible(element) && quizWords.test(element.textContent || ''));
    if (textTarget) { textTarget.click(); return true; }

    for (const attribute of ['data-setup-open','data-twq-open','data-quiz-open','data-native-quiz-open']) {
      const proxy = document.createElement('button');
      proxy.setAttribute(attribute, '1');
      proxy.hidden = true;
      document.body.appendChild(proxy);
      proxy.click();
      proxy.remove();
    }

    const dialog = [...document.querySelectorAll('[role="dialog"],dialog,[id*="quiz" i],[class*="quiz" i],[id*="onboarding" i],[class*="onboarding" i]')]
      .find(element => !source.closest('section')?.contains(element) && (element.matches('dialog') || element.getAttribute('role') === 'dialog'));
    if (dialog) {
      dialog.classList.add('is-open', 'open', 'is-visible');
      dialog.removeAttribute('hidden');
      dialog.setAttribute('aria-hidden', 'false');
      document.body.style.overflow = 'hidden';
      return true;
    }
    return false;
  };

  const boot = () => {
    render();
    document.addEventListener('click', event => {
      const button = event.target.closest('[data-quiz-end-open]');
      if (!button) return;
      event.preventDefault();
      openQuiz(button);
    });
    new MutationObserver(render).observe(document.documentElement, {attributes:true, attributeFilter:['lang','data-site-language']});
  };

  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', boot, {once:true});
  else boot();
})();
