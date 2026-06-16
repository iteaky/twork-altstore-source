(() => {
  const languages = [
    ['sk', 'Slovenčina'], ['en', 'English'], ['ru', 'Русский'], ['cs', 'Čeština'],
    ['hu', 'Magyar'], ['pl', 'Polski'], ['de', 'Deutsch'], ['uk', 'Українська'],
    ['es', 'Español'], ['fr', 'Français'], ['pt', 'Português'], ['ar', 'العربية'],
    ['zh-Hans', '简体中文'], ['ja', '日本語'], ['ko', '한국어']
  ];
  const supported = new Set(languages.map(([code]) => code));
  const rtlLanguages = new Set(['ar']);

  const sourceText = {
    'Продукт': 'navProduct', 'Возможности': 'navFeatures', 'Календари': 'navCalendars',
    'Клубы': 'navClubs', 'Сообщения': 'navMessages', 'Ранний доступ': 'earlyAccess',
    'Для персональных, клубных и онлайн-тренеров': 'heroOverline',
    'Вся работа.': 'heroTitle1', 'В одном ритме.': 'heroTitle2',
    'TWORK связывает расписание, клиентов, абонементы, деньги, клубы и сообщения. Создаёте тренировку один раз — всё остальное обновляется вместе с ней.': 'heroLead',
    'Запросить ранний доступ': 'requestAccess', 'Увидеть возможности': 'seeFeatures',
    'Только iOS': 'onlyIos', 'Работает офлайн': 'worksOffline', 'Без сервера TWORK': 'noServer',
    'Не просто календарь': 'manifestoOverline', 'Одно действие.': 'manifestoTitle1',
    'Все расчёты готовы.': 'manifestoTitle2',
    'Проведённая тренировка списывается из абонемента, меняет баланс клиента, учитывается в доходе и добавляется в расчёт с клубом. Отмена может вернуть деньги и тренировку обратно.': 'manifestoBody',
    'Основные возможности': 'featuresOverline', 'Подстраивается': 'featuresTitle1',
    'под вашу работу.': 'featuresTitle2',
    'Неважно, тренируете вы в одном зале, работаете через несколько клубов или ведёте клиентов онлайн из разных стран.': 'featuresBody',
    'Онлайн без путаницы во времени и деньгах.': 'feature1Title',
    'У каждого клиента могут быть свои язык, валюта и часовой пояс. TWORK хранит их в карточке клиента и использует там, где это важно.': 'feature1Body',
    'Прямые клиенты и клубы — вместе, но не вперемешку.': 'feature2Title',
    'TWORK отдельно отвечает на два вопроса: сколько клиент должен вам и сколько вы должны получить от клуба или передать ему.': 'feature2Body',
    'Календарь клиента — не только расписание.': 'feature3Title',
    'Для каждого клиента создаётся отдельный календарь только с его тренировками. В комментарии к событию TWORK показывает актуальную информацию, которую клиент обычно ищет в личном кабинете.': 'feature3Body',
    'Клубы и организации': 'clubOverline', 'Сложные расчёты.': 'clubTitle1', 'Простой итог.': 'clubTitle2',
    'Для каждого клуба можно настроить собственные цены, комиссии и правила взаиморасчётов. TWORK учитывает, кто принял оплату и кто оплачивает комиссию клуба.': 'clubBody',
    'Сообщения без ручной рутины': 'messageOverline', 'Готовый текст.': 'messageTitle1',
    'В нужный момент.': 'messageTitle2',
    'Выберите шаблон — TWORK подставит имя клиента, дату, время, адрес, остаток тренировок и другие данные. Сообщение можно проверить и отправить через привычный мессенджер.': 'messageBody',
    'Приватность по умолчанию': 'privacyOverline', 'Ваши клиенты.': 'privacyTitle1',
    'На вашем iPhone.': 'privacyTitle2',
    'TWORK работает без подключения к интернету. Данные клиентов, тренировок, абонементов и оплат хранятся локально на устройстве и не загружаются в серверную базу TWORK.': 'privacyBody',
    'Оставьте таблицы': 'finalTitle1', 'в прошлом.': 'finalTitle2',
    'TWORK собирает работу тренера в одну систему — от первого клиента до расчётов с несколькими клубами.': 'finalBody',
    'Стать ранним пользователем': 'becomeEarly', 'Мы свяжемся с вами и расскажем о запуске.': 'finalNote',
    'Только iOS · Работает офлайн · 2026': 'footer',
    'Оставьте несколько деталей. Заявка придёт на': 'modalIntroPrefix',
    'Закрыть': 'close', 'Имя': 'name', 'Как к вам обращаться': 'namePlaceholder',
    'Кто вы?': 'who', 'Выберите вариант': 'choose', 'Необязательно': 'optional',
    'Что важно для вас в TWORK?': 'important', 'Отправить заявку': 'submit'
  };

  const en = {
    navProduct:'Product',navFeatures:'Features',navCalendars:'Calendars',navClubs:'Clubs',navMessages:'Messages',earlyAccess:'Early access',
    heroOverline:'For personal, club and online trainers',heroTitle1:'All your work.',heroTitle2:'In one rhythm.',heroLead:'TWORK connects schedules, clients, memberships, money, clubs and messages. Create a training once — everything else updates with it.',requestAccess:'Request early access',seeFeatures:'Explore features',onlyIos:'iOS only',worksOffline:'Works offline',noServer:'No TWORK server',
    manifestoOverline:'More than a calendar',manifestoTitle1:'One action.',manifestoTitle2:'Every calculation ready.',manifestoBody:'A completed training is deducted from the membership, changes the client balance, counts toward income and enters the club settlement. A cancellation can return both money and the training.',
    featuresOverline:'Core features',featuresTitle1:'Adapts',featuresTitle2:'to the way you work.',featuresBody:'Whether you train in one gym, work with several clubs or coach clients online across countries.',
    feature1Title:'Online coaching without time or money confusion.',feature1Body:'Each client can have their own language, currency and time zone. TWORK stores them in the client card and uses them wherever they matter.',feature2Title:'Direct clients and clubs — together, never mixed up.',feature2Body:'TWORK answers two questions separately: what the client owes you, and what you should receive from or pay to the club.',feature3Title:'A client calendar is more than a schedule.',feature3Body:'Each client gets a separate calendar with only their trainings. Event notes show the live information they would normally look for in a client portal.',
    clubOverline:'Clubs and organisations',clubTitle1:'Complex settlements.',clubTitle2:'A simple result.',clubBody:'Set individual prices, commissions and settlement rules for every club. TWORK tracks who received the payment and who covers the club commission.',
    messageOverline:'Messages without manual routine',messageTitle1:'Ready text.',messageTitle2:'At the right moment.',messageBody:'Choose a template — TWORK inserts the client name, date, time, address, remaining trainings and other data. Review it and send it through your usual messenger.',
    privacyOverline:'Privacy by default',privacyTitle1:'Your clients.',privacyTitle2:'On your iPhone.',privacyBody:'TWORK works without an internet connection. Client, training, membership and payment data stays locally on the device and is never uploaded to a TWORK server database.',
    finalTitle1:'Leave spreadsheets',finalTitle2:'in the past.',finalBody:'TWORK brings a trainer’s work into one system — from the first client to settlements with multiple clubs.',becomeEarly:'Join early access',finalNote:'We will contact you with launch details.',footer:'iOS only · Works offline · 2026',modalIntroPrefix:'Leave a few details. Your request will be sent to',close:'Close',name:'Name',namePlaceholder:'How should we address you?',who:'Who are you?',choose:'Choose an option',optional:'Optional',important:'What matters to you in TWORK?',submit:'Send request',language:'Language',switching:'Switching language'
  };

  const copy = {
    en,
    ru:{...en,navProduct:'Продукт',navFeatures:'Возможности',navCalendars:'Календари',navClubs:'Клубы',navMessages:'Сообщения',earlyAccess:'Ранний доступ',heroOverline:'Для персональных, клубных и онлайн-тренеров',heroTitle1:'Вся работа.',heroTitle2:'В одном ритме.',heroLead:'TWORK связывает расписание, клиентов, абонементы, деньги, клубы и сообщения. Создаёте тренировку один раз — всё остальное обновляется вместе с ней.',requestAccess:'Запросить ранний доступ',seeFeatures:'Увидеть возможности',onlyIos:'Только iOS',worksOffline:'Работает офлайн',noServer:'Без сервера TWORK',manifestoOverline:'Не просто календарь',manifestoTitle1:'Одно действие.',manifestoTitle2:'Все расчёты готовы.',manifestoBody:'Проведённая тренировка списывается из абонемента, меняет баланс клиента, учитывается в доходе и добавляется в расчёт с клубом. Отмена может вернуть деньги и тренировку обратно.',featuresOverline:'Основные возможности',featuresTitle1:'Подстраивается',featuresTitle2:'под вашу работу.',featuresBody:'Неважно, тренируете вы в одном зале, работаете через несколько клубов или ведёте клиентов онлайн из разных стран.',feature1Title:'Онлайн без путаницы во времени и деньгах.',feature1Body:'У каждого клиента могут быть свои язык, валюта и часовой пояс. TWORK хранит их в карточке клиента и использует там, где это важно.',feature2Title:'Прямые клиенты и клубы — вместе, но не вперемешку.',feature2Body:'TWORK отдельно отвечает на два вопроса: сколько клиент должен вам и сколько вы должны получить от клуба или передать ему.',feature3Title:'Календарь клиента — не только расписание.',feature3Body:'Для каждого клиента создаётся отдельный календарь только с его тренировками. В комментарии к событию TWORK показывает актуальную информацию, которую клиент обычно ищет в личном кабинете.',clubOverline:'Клубы и организации',clubTitle1:'Сложные расчёты.',clubTitle2:'Простой итог.',clubBody:'Для каждого клуба можно настроить собственные цены, комиссии и правила взаиморасчётов. TWORK учитывает, кто принял оплату и кто оплачивает комиссию клуба.',messageOverline:'Сообщения без ручной рутины',messageTitle1:'Готовый текст.',messageTitle2:'В нужный момент.',messageBody:'Выберите шаблон — TWORK подставит имя клиента, дату, время, адрес, остаток тренировок и другие данные. Сообщение можно проверить и отправить через привычный мессенджер.',privacyOverline:'Приватность по умолчанию',privacyTitle1:'Ваши клиенты.',privacyTitle2:'На вашем iPhone.',privacyBody:'TWORK работает без подключения к интернету. Данные клиентов, тренировок, абонементов и оплат хранятся локально на устройстве и не загружаются в серверную базу TWORK.',finalTitle1:'Оставьте таблицы',finalTitle2:'в прошлом.',finalBody:'TWORK собирает работу тренера в одну систему — от первого клиента до расчётов с несколькими клубами.',becomeEarly:'Стать ранним пользователем',finalNote:'Мы свяжемся с вами и расскажем о запуске.',footer:'Только iOS · Работает офлайн · 2026',modalIntroPrefix:'Оставьте несколько деталей. Заявка придёт на',close:'Закрыть',name:'Имя',namePlaceholder:'Как к вам обращаться',who:'Кто вы?',choose:'Выберите вариант',optional:'Необязательно',important:'Что важно для вас в TWORK?',submit:'Отправить заявку',language:'Язык',switching:'Смена языка'},
    sk:{...en,navProduct:'Produkt',navFeatures:'Funkcie',navCalendars:'Kalendáre',navClubs:'Kluby',navMessages:'Správy',earlyAccess:'Skorý prístup',heroOverline:'Pre osobných, klubových a online trénerov',heroTitle1:'Celá vaša práca.',heroTitle2:'V jednom rytme.',heroLead:'TWORK prepája rozvrh, klientov, permanentky, peniaze, kluby a správy. Tréning vytvoríte raz — všetko ostatné sa aktualizuje spolu s ním.',requestAccess:'Požiadať o skorý prístup',seeFeatures:'Pozrieť funkcie',onlyIos:'Len iOS',worksOffline:'Funguje offline',noServer:'Bez servera TWORK',manifestoOverline:'Viac než kalendár',manifestoTitle1:'Jeden krok.',manifestoTitle2:'Všetky výpočty hotové.',manifestoBody:'Uskutočnený tréning sa odpočíta z permanentky, zmení zostatok klienta, započíta sa do príjmu a pridá do vyúčtovania s klubom.',featuresOverline:'Hlavné funkcie',featuresTitle1:'Prispôsobí sa',featuresTitle2:'vašej práci.',featuresBody:'Či trénujete v jednom fitku, spolupracujete s viacerými klubmi alebo vediete klientov online z rôznych krajín.',feature1Title:'Online tréning bez chaosu v čase a peniazoch.',feature1Body:'Každý klient môže mať vlastný jazyk, menu a časové pásmo. TWORK ich používa všade, kde sú dôležité.',feature2Title:'Priami klienti a kluby — spolu, ale oddelene.',feature2Body:'TWORK samostatne ukazuje, koľko dlhuje klient a koľko máte dostať od klubu alebo mu zaplatiť.',feature3Title:'Kalendár klienta nie je len rozvrh.',feature3Body:'Každý klient dostane vlastný kalendár iba so svojimi tréningami a aktuálnymi informáciami v poznámke udalosti.',clubOverline:'Kluby a organizácie',clubTitle1:'Zložité vyúčtovanie.',clubTitle2:'Jednoduchý výsledok.',clubBody:'Pre každý klub nastavíte vlastné ceny, provízie a pravidlá vyúčtovania. TWORK sleduje, kto prijal platbu a kto hradí províziu.',messageOverline:'Správy bez ručnej rutiny',messageTitle1:'Hotový text.',messageTitle2:'V správnom čase.',messageBody:'Vyberte šablónu — TWORK doplní meno, dátum, čas, adresu, zostávajúce tréningy a ďalšie údaje.',privacyOverline:'Súkromie od začiatku',privacyTitle1:'Vaši klienti.',privacyTitle2:'Vo vašom iPhone.',privacyBody:'TWORK funguje bez internetu. Údaje zostávajú lokálne v zariadení a nenahrávajú sa do databázy servera TWORK.',finalTitle1:'Nechajte tabuľky',finalTitle2:'v minulosti.',finalBody:'TWORK spája prácu trénera do jedného systému — od prvého klienta po vyúčtovanie s viacerými klubmi.',becomeEarly:'Získať skorý prístup',finalNote:'Ozveme sa vám s informáciami o spustení.',footer:'Len iOS · Funguje offline · 2026',modalIntroPrefix:'Zanechajte pár údajov. Žiadosť príde na',close:'Zavrieť',name:'Meno',namePlaceholder:'Ako vás máme oslovovať?',who:'Kto ste?',choose:'Vyberte možnosť',optional:'Voliteľné',important:'Čo je pre vás v TWORK dôležité?',submit:'Odoslať žiadosť',language:'Jazyk',switching:'Mením jazyk'},
    cs:{...en,navProduct:'Produkt',navFeatures:'Funkce',navCalendars:'Kalendáře',navClubs:'Kluby',navMessages:'Zprávy',earlyAccess:'Předběžný přístup',heroOverline:'Pro osobní, klubové a online trenéry',heroTitle1:'Veškerá práce.',heroTitle2:'V jednom rytmu.',heroLead:'TWORK propojuje rozvrh, klienty, permanentky, peníze, kluby a zprávy. Trénink vytvoříte jednou — vše ostatní se aktualizuje s ním.',requestAccess:'Požádat o přístup',seeFeatures:'Prohlédnout funkce',onlyIos:'Pouze iOS',worksOffline:'Funguje offline',noServer:'Bez serveru TWORK',manifestoOverline:'Více než kalendář',manifestoTitle1:'Jedna akce.',manifestoTitle2:'Všechny výpočty hotové.',manifestoBody:'Dokončený trénink se odečte z permanentky, změní zůstatek klienta, započítá se do příjmů a do vyúčtování s klubem.',featuresOverline:'Hlavní funkce',featuresTitle1:'Přizpůsobí se',featuresTitle2:'vaší práci.',featuresBody:'Ať trénujete v jednom fitku, spolupracujete s více kluby nebo vedete klienty online z různých zemí.',feature1Title:'Online trénink bez zmatků v čase a penězích.',feature1Body:'Každý klient může mít vlastní jazyk, měnu a časové pásmo. TWORK je používá všude, kde jsou důležité.',feature2Title:'Přímí klienti a kluby — spolu, ale odděleně.',feature2Body:'TWORK samostatně ukazuje, kolik dluží klient a kolik máte dostat od klubu nebo mu zaplatit.',feature3Title:'Kalendář klienta není jen rozvrh.',feature3Body:'Každý klient dostane vlastní kalendář pouze se svými tréninky a aktuálními informacemi v poznámce události.',clubOverline:'Kluby a organizace',clubTitle1:'Složité vyúčtování.',clubTitle2:'Jednoduchý výsledek.',clubBody:'Pro každý klub nastavíte vlastní ceny, provize a pravidla vyúčtování.',messageOverline:'Zprávy bez ruční rutiny',messageTitle1:'Hotový text.',messageTitle2:'Ve správný okamžik.',messageBody:'Vyberte šablonu — TWORK doplní jméno, datum, čas, adresu, zbývající tréninky a další údaje.',privacyOverline:'Soukromí ve výchozím nastavení',privacyTitle1:'Vaši klienti.',privacyTitle2:'Na vašem iPhonu.',privacyBody:'TWORK funguje bez internetu. Data zůstávají lokálně v zařízení a neodesílají se do databáze TWORK.',finalTitle1:'Nechte tabulky',finalTitle2:'v minulosti.',finalBody:'TWORK spojuje práci trenéra do jednoho systému — od prvního klienta po vyúčtování s více kluby.',becomeEarly:'Získat předběžný přístup',finalNote:'Ozveme se vám s informacemi o spuštění.',footer:'Pouze iOS · Funguje offline · 2026',modalIntroPrefix:'Zanechte několik údajů. Žádost přijde na',close:'Zavřít',name:'Jméno',namePlaceholder:'Jak vás máme oslovovat?',who:'Kdo jste?',choose:'Vyberte možnost',optional:'Volitelné',important:'Co je pro vás v TWORK důležité?',submit:'Odeslat žádost',language:'Jazyk',switching:'Přepínám jazyk'},
    de:{...en,navProduct:'Produkt',navFeatures:'Funktionen',navCalendars:'Kalender',navClubs:'Studios',navMessages:'Nachrichten',earlyAccess:'Frühzugang',heroOverline:'Für Personal-, Studio- und Online-Trainer',heroTitle1:'Deine ganze Arbeit.',heroTitle2:'In einem Rhythmus.',heroLead:'TWORK verbindet Termine, Kunden, Mitgliedschaften, Geld, Studios und Nachrichten. Ein Training einmal anlegen — alles Weitere aktualisiert sich automatisch.',requestAccess:'Frühzugang anfragen',seeFeatures:'Funktionen ansehen',onlyIos:'Nur iOS',worksOffline:'Funktioniert offline',noServer:'Kein TWORK-Server',manifestoOverline:'Mehr als ein Kalender',manifestoTitle1:'Eine Aktion.',manifestoTitle2:'Alle Berechnungen fertig.',manifestoBody:'Ein absolviertes Training wird von der Mitgliedschaft abgezogen, ändert den Kundensaldo, zählt zum Einkommen und fließt in die Studioabrechnung ein.',featuresOverline:'Kernfunktionen',featuresTitle1:'Passt sich',featuresTitle2:'deiner Arbeit an.',featuresBody:'Egal ob du in einem Studio, mit mehreren Clubs oder online mit Kunden aus verschiedenen Ländern arbeitest.',feature1Title:'Online-Coaching ohne Zeit- und Währungschaos.',feature1Body:'Jeder Kunde kann eine eigene Sprache, Währung und Zeitzone haben. TWORK nutzt diese Daten überall dort, wo sie wichtig sind.',feature2Title:'Direktkunden und Studios — zusammen, aber klar getrennt.',feature2Body:'TWORK zeigt getrennt, was ein Kunde schuldet und was du vom Studio bekommst oder an es zahlst.',feature3Title:'Der Kundenkalender ist mehr als ein Terminplan.',feature3Body:'Jeder Kunde erhält einen eigenen Kalender nur mit seinen Trainings und aktuellen Informationen in den Ereignisnotizen.',clubOverline:'Studios und Organisationen',clubTitle1:'Komplexe Abrechnung.',clubTitle2:'Ein klares Ergebnis.',clubBody:'Lege für jedes Studio eigene Preise, Provisionen und Abrechnungsregeln fest.',messageOverline:'Nachrichten ohne Handarbeit',messageTitle1:'Fertiger Text.',messageTitle2:'Im richtigen Moment.',messageBody:'Wähle eine Vorlage — TWORK ergänzt Name, Datum, Uhrzeit, Adresse, verbleibende Trainings und weitere Daten.',privacyOverline:'Datenschutz standardmäßig',privacyTitle1:'Deine Kunden.',privacyTitle2:'Auf deinem iPhone.',privacyBody:'TWORK funktioniert ohne Internet. Kundendaten bleiben lokal auf dem Gerät und werden nicht auf einen TWORK-Server hochgeladen.',finalTitle1:'Lass Tabellen',finalTitle2:'hinter dir.',finalBody:'TWORK bündelt die Arbeit eines Trainers in einem System — vom ersten Kunden bis zur Abrechnung mit mehreren Studios.',becomeEarly:'Frühzugang erhalten',finalNote:'Wir melden uns mit Informationen zum Start.',footer:'Nur iOS · Funktioniert offline · 2026',modalIntroPrefix:'Hinterlasse ein paar Angaben. Die Anfrage geht an',close:'Schließen',name:'Name',namePlaceholder:'Wie dürfen wir dich ansprechen?',who:'Wer bist du?',choose:'Option auswählen',optional:'Optional',important:'Was ist dir bei TWORK wichtig?',submit:'Anfrage senden',language:'Sprache',switching:'Sprache wird gewechselt'},
    pl:{...en,navProduct:'Produkt',navFeatures:'Funkcje',navCalendars:'Kalendarze',navClubs:'Kluby',navMessages:'Wiadomości',earlyAccess:'Wczesny dostęp',heroOverline:'Dla trenerów personalnych, klubowych i online',heroTitle1:'Cała Twoja praca.',heroTitle2:'W jednym rytmie.',heroLead:'TWORK łączy grafik, klientów, karnety, finanse, kluby i wiadomości. Tworzysz trening raz — reszta aktualizuje się razem z nim.',requestAccess:'Poproś o wczesny dostęp',seeFeatures:'Zobacz funkcje',onlyIos:'Tylko iOS',worksOffline:'Działa offline',noServer:'Bez serwera TWORK',manifestoOverline:'Więcej niż kalendarz',manifestoTitle1:'Jedno działanie.',manifestoTitle2:'Wszystkie rozliczenia gotowe.',manifestoBody:'Zrealizowany trening jest odejmowany z karnetu, zmienia saldo klienta, trafia do przychodu i rozliczenia z klubem.',featuresOverline:'Najważniejsze funkcje',featuresTitle1:'Dopasowuje się',featuresTitle2:'do Twojej pracy.',featuresBody:'Niezależnie od tego, czy pracujesz w jednym klubie, w kilku klubach czy online z klientami z różnych krajów.',feature1Title:'Trening online bez chaosu czasu i pieniędzy.',feature1Body:'Każdy klient może mieć własny język, walutę i strefę czasową. TWORK używa ich tam, gdzie są potrzebne.',feature2Title:'Klienci bezpośredni i kluby — razem, ale osobno.',feature2Body:'TWORK osobno pokazuje, ile klient jest winien Tobie i ile masz otrzymać od klubu lub mu zapłacić.',feature3Title:'Kalendarz klienta to więcej niż grafik.',feature3Body:'Każdy klient otrzymuje osobny kalendarz tylko ze swoimi treningami i aktualnymi informacjami w notatce wydarzenia.',clubOverline:'Kluby i organizacje',clubTitle1:'Złożone rozliczenia.',clubTitle2:'Prosty wynik.',clubBody:'Dla każdego klubu ustawisz osobne ceny, prowizje i zasady rozliczeń.',messageOverline:'Wiadomości bez ręcznej rutyny',messageTitle1:'Gotowy tekst.',messageTitle2:'We właściwym momencie.',messageBody:'Wybierz szablon — TWORK uzupełni imię, datę, godzinę, adres, liczbę pozostałych treningów i inne dane.',privacyOverline:'Prywatność domyślnie',privacyTitle1:'Twoi klienci.',privacyTitle2:'Na Twoim iPhonie.',privacyBody:'TWORK działa bez internetu. Dane pozostają lokalnie na urządzeniu i nie trafiają do bazy serwera TWORK.',finalTitle1:'Zostaw arkusze',finalTitle2:'w przeszłości.',finalBody:'TWORK łączy pracę trenera w jednym systemie — od pierwszego klienta po rozliczenia z wieloma klubami.',becomeEarly:'Dołącz do wczesnego dostępu',finalNote:'Skontaktujemy się z informacjami o starcie.',footer:'Tylko iOS · Działa offline · 2026',modalIntroPrefix:'Zostaw kilka informacji. Zgłoszenie trafi na',close:'Zamknij',name:'Imię',namePlaceholder:'Jak mamy się do Ciebie zwracać?',who:'Kim jesteś?',choose:'Wybierz opcję',optional:'Opcjonalnie',important:'Co jest dla Ciebie ważne w TWORK?',submit:'Wyślij zgłoszenie',language:'Język',switching:'Zmiana języka'},
    uk:{...en,navProduct:'Продукт',navFeatures:'Можливості',navCalendars:'Календарі',navClubs:'Клуби',navMessages:'Повідомлення',earlyAccess:'Ранній доступ',heroOverline:'Для персональних, клубних та онлайн-тренерів',heroTitle1:'Уся ваша робота.',heroTitle2:'В одному ритмі.',heroLead:'TWORK поєднує розклад, клієнтів, абонементи, гроші, клуби та повідомлення. Створюєте тренування один раз — усе інше оновлюється разом із ним.',requestAccess:'Запросити ранній доступ',seeFeatures:'Переглянути можливості',onlyIos:'Лише iOS',worksOffline:'Працює офлайн',noServer:'Без сервера TWORK',manifestoOverline:'Більше ніж календар',manifestoTitle1:'Одна дія.',manifestoTitle2:'Усі розрахунки готові.',manifestoBody:'Проведене тренування списується з абонемента, змінює баланс клієнта, враховується в доході та додається до розрахунку з клубом.',featuresOverline:'Основні можливості',featuresTitle1:'Підлаштовується',featuresTitle2:'під вашу роботу.',featuresBody:'Неважливо, чи тренуєте ви в одному залі, працюєте з кількома клубами або ведете клієнтів онлайн з різних країн.',feature1Title:'Онлайн без плутанини з часом і грошима.',feature1Body:'Кожен клієнт може мати власну мову, валюту та часовий пояс. TWORK використовує їх там, де це важливо.',feature2Title:'Прямі клієнти й клуби — разом, але окремо.',feature2Body:'TWORK окремо показує, скільки клієнт винен вам і скільки ви маєте отримати від клубу або передати йому.',feature3Title:'Календар клієнта — це більше ніж розклад.',feature3Body:'Кожен клієнт отримує окремий календар лише зі своїми тренуваннями та актуальною інформацією в нотатці події.',clubOverline:'Клуби та організації',clubTitle1:'Складні розрахунки.',clubTitle2:'Простий результат.',clubBody:'Для кожного клубу можна налаштувати власні ціни, комісії та правила взаєморозрахунків.',messageOverline:'Повідомлення без ручної рутини',messageTitle1:'Готовий текст.',messageTitle2:'У потрібний момент.',messageBody:'Оберіть шаблон — TWORK підставить ім’я, дату, час, адресу, залишок тренувань та інші дані.',privacyOverline:'Приватність за замовчуванням',privacyTitle1:'Ваші клієнти.',privacyTitle2:'На вашому iPhone.',privacyBody:'TWORK працює без інтернету. Дані залишаються локально на пристрої й не завантажуються до серверної бази TWORK.',finalTitle1:'Залиште таблиці',finalTitle2:'у минулому.',finalBody:'TWORK збирає роботу тренера в одну систему — від першого клієнта до розрахунків із кількома клубами.',becomeEarly:'Долучитися до раннього доступу',finalNote:'Ми зв’яжемося з вами та розповімо про запуск.',footer:'Лише iOS · Працює офлайн · 2026',modalIntroPrefix:'Залиште кілька деталей. Заявка надійде на',close:'Закрити',name:'Ім’я',namePlaceholder:'Як до вас звертатися?',who:'Хто ви?',choose:'Оберіть варіант',optional:'Необов’язково',important:'Що для вас важливо в TWORK?',submit:'Надіслати заявку',language:'Мова',switching:'Зміна мови'},
    es:{...en,navProduct:'Producto',navFeatures:'Funciones',navCalendars:'Calendarios',navClubs:'Clubes',navMessages:'Mensajes',earlyAccess:'Acceso anticipado',heroOverline:'Para entrenadores personales, de club y online',heroTitle1:'Todo tu trabajo.',heroTitle2:'En un solo ritmo.',heroLead:'TWORK conecta horarios, clientes, bonos, dinero, clubes y mensajes. Crea un entrenamiento una vez y todo lo demás se actualiza con él.',requestAccess:'Solicitar acceso anticipado',seeFeatures:'Ver funciones',onlyIos:'Solo iOS',worksOffline:'Funciona sin conexión',noServer:'Sin servidor TWORK',manifestoOverline:'Más que un calendario',manifestoTitle1:'Una acción.',manifestoTitle2:'Todos los cálculos listos.',manifestoBody:'Una sesión completada se descuenta del bono, cambia el saldo del cliente, cuenta como ingreso y entra en la liquidación con el club.',featuresOverline:'Funciones principales',featuresTitle1:'Se adapta',featuresTitle2:'a tu forma de trabajar.',featuresBody:'Tanto si entrenas en un gimnasio, trabajas con varios clubes o atiendes clientes online de distintos países.',feature1Title:'Entrenamiento online sin confusiones de tiempo o dinero.',feature1Body:'Cada cliente puede tener su idioma, moneda y zona horaria. TWORK los usa donde realmente importan.',feature2Title:'Clientes directos y clubes — juntos, pero separados.',feature2Body:'TWORK muestra por separado lo que te debe el cliente y lo que debes recibir del club o pagarle.',feature3Title:'El calendario del cliente es más que un horario.',feature3Body:'Cada cliente recibe un calendario propio solo con sus entrenamientos e información actualizada en las notas del evento.',clubOverline:'Clubes y organizaciones',clubTitle1:'Liquidaciones complejas.',clubTitle2:'Un resultado claro.',clubBody:'Configura precios, comisiones y reglas de liquidación para cada club.',messageOverline:'Mensajes sin trabajo manual',messageTitle1:'Texto listo.',messageTitle2:'En el momento adecuado.',messageBody:'Elige una plantilla y TWORK añadirá nombre, fecha, hora, dirección, sesiones restantes y otros datos.',privacyOverline:'Privacidad por defecto',privacyTitle1:'Tus clientes.',privacyTitle2:'En tu iPhone.',privacyBody:'TWORK funciona sin internet. Los datos permanecen en el dispositivo y no se suben a una base de datos de TWORK.',finalTitle1:'Deja las hojas de cálculo',finalTitle2:'en el pasado.',finalBody:'TWORK reúne el trabajo del entrenador en un solo sistema, desde el primer cliente hasta las liquidaciones con varios clubes.',becomeEarly:'Unirme al acceso anticipado',finalNote:'Te contactaremos con información sobre el lanzamiento.',footer:'Solo iOS · Funciona sin conexión · 2026',modalIntroPrefix:'Déjanos algunos datos. La solicitud llegará a',close:'Cerrar',name:'Nombre',namePlaceholder:'¿Cómo debemos llamarte?',who:'¿Quién eres?',choose:'Elige una opción',optional:'Opcional',important:'¿Qué es importante para ti en TWORK?',submit:'Enviar solicitud',language:'Idioma',switching:'Cambiando idioma'},
    fr:{...en,navProduct:'Produit',navFeatures:'Fonctions',navCalendars:'Calendriers',navClubs:'Clubs',navMessages:'Messages',earlyAccess:'Accès anticipé',heroOverline:'Pour les coachs personnels, en club et en ligne',heroTitle1:'Tout votre travail.',heroTitle2:'Dans un même rythme.',heroLead:'TWORK relie planning, clients, abonnements, finances, clubs et messages. Créez une séance une fois — tout le reste se met à jour avec elle.',requestAccess:'Demander un accès anticipé',seeFeatures:'Voir les fonctions',onlyIos:'iOS uniquement',worksOffline:'Fonctionne hors ligne',noServer:'Sans serveur TWORK',manifestoOverline:'Plus qu’un calendrier',manifestoTitle1:'Une action.',manifestoTitle2:'Tous les calculs sont prêts.',manifestoBody:'Une séance terminée est déduite de l’abonnement, modifie le solde du client, compte dans le revenu et rejoint le règlement du club.',featuresOverline:'Fonctions principales',featuresTitle1:'S’adapte',featuresTitle2:'à votre façon de travailler.',featuresBody:'Que vous travailliez dans une salle, avec plusieurs clubs ou avec des clients en ligne dans différents pays.',feature1Title:'Coaching en ligne sans confusion de temps ni d’argent.',feature1Body:'Chaque client peut avoir sa langue, sa devise et son fuseau horaire. TWORK les utilise partout où cela compte.',feature2Title:'Clients directs et clubs — ensemble, mais bien séparés.',feature2Body:'TWORK distingue ce que le client vous doit et ce que vous devez recevoir du club ou lui verser.',feature3Title:'Le calendrier client est plus qu’un planning.',feature3Body:'Chaque client reçoit son propre calendrier avec uniquement ses séances et des informations à jour dans les notes.',clubOverline:'Clubs et organisations',clubTitle1:'Des règlements complexes.',clubTitle2:'Un résultat simple.',clubBody:'Définissez des prix, commissions et règles de règlement propres à chaque club.',messageOverline:'Des messages sans routine manuelle',messageTitle1:'Un texte prêt.',messageTitle2:'Au bon moment.',messageBody:'Choisissez un modèle — TWORK ajoute le nom, la date, l’heure, l’adresse, les séances restantes et d’autres données.',privacyOverline:'Confidentialité par défaut',privacyTitle1:'Vos clients.',privacyTitle2:'Sur votre iPhone.',privacyBody:'TWORK fonctionne sans internet. Les données restent localement sur l’appareil et ne sont jamais envoyées vers une base serveur TWORK.',finalTitle1:'Laissez les tableaux',finalTitle2:'dans le passé.',finalBody:'TWORK réunit le travail du coach dans un seul système — du premier client aux règlements avec plusieurs clubs.',becomeEarly:'Rejoindre l’accès anticipé',finalNote:'Nous vous contacterons avec les informations de lancement.',footer:'iOS uniquement · Fonctionne hors ligne · 2026',modalIntroPrefix:'Laissez quelques informations. La demande sera envoyée à',close:'Fermer',name:'Nom',namePlaceholder:'Comment devons-nous vous appeler ?',who:'Qui êtes-vous ?',choose:'Choisissez une option',optional:'Facultatif',important:'Qu’est-ce qui compte pour vous dans TWORK ?',submit:'Envoyer la demande',language:'Langue',switching:'Changement de langue'},
    pt:{...en,navProduct:'Produto',navFeatures:'Funcionalidades',navCalendars:'Calendários',navClubs:'Clubes',navMessages:'Mensagens',earlyAccess:'Acesso antecipado',heroOverline:'Para personal trainers, treinadores de clube e online',heroTitle1:'Todo o seu trabalho.',heroTitle2:'Num só ritmo.',heroLead:'O TWORK liga agenda, clientes, planos, dinheiro, clubes e mensagens. Crie um treino uma vez — tudo o resto é atualizado com ele.',requestAccess:'Pedir acesso antecipado',seeFeatures:'Ver funcionalidades',onlyIos:'Apenas iOS',worksOffline:'Funciona offline',noServer:'Sem servidor TWORK',manifestoOverline:'Mais do que um calendário',manifestoTitle1:'Uma ação.',manifestoTitle2:'Todos os cálculos prontos.',manifestoBody:'Um treino concluído é descontado do plano, altera o saldo do cliente, entra na receita e no acerto com o clube.',featuresOverline:'Funcionalidades principais',featuresTitle1:'Adapta-se',featuresTitle2:'à sua forma de trabalhar.',featuresBody:'Quer treine num ginásio, trabalhe com vários clubes ou acompanhe clientes online em diferentes países.',feature1Title:'Treino online sem confusão de tempo ou dinheiro.',feature1Body:'Cada cliente pode ter o seu idioma, moeda e fuso horário. O TWORK usa-os onde são importantes.',feature2Title:'Clientes diretos e clubes — juntos, mas separados.',feature2Body:'O TWORK mostra em separado o que o cliente lhe deve e o que deve receber do clube ou pagar-lhe.',feature3Title:'O calendário do cliente é mais do que uma agenda.',feature3Body:'Cada cliente recebe um calendário próprio apenas com os seus treinos e informações atualizadas nas notas.',clubOverline:'Clubes e organizações',clubTitle1:'Acertos complexos.',clubTitle2:'Um resultado simples.',clubBody:'Defina preços, comissões e regras de acerto específicas para cada clube.',messageOverline:'Mensagens sem rotina manual',messageTitle1:'Texto pronto.',messageTitle2:'No momento certo.',messageBody:'Escolha um modelo — o TWORK adiciona nome, data, hora, morada, treinos restantes e outros dados.',privacyOverline:'Privacidade por predefinição',privacyTitle1:'Os seus clientes.',privacyTitle2:'No seu iPhone.',privacyBody:'O TWORK funciona sem internet. Os dados ficam localmente no dispositivo e não são enviados para uma base de dados TWORK.',finalTitle1:'Deixe as folhas de cálculo',finalTitle2:'no passado.',finalBody:'O TWORK reúne o trabalho do treinador num só sistema — do primeiro cliente aos acertos com vários clubes.',becomeEarly:'Aderir ao acesso antecipado',finalNote:'Entraremos em contacto com informações sobre o lançamento.',footer:'Apenas iOS · Funciona offline · 2026',modalIntroPrefix:'Deixe alguns dados. O pedido será enviado para',close:'Fechar',name:'Nome',namePlaceholder:'Como devemos tratá-lo?',who:'Quem é?',choose:'Escolha uma opção',optional:'Opcional',important:'O que é importante para si no TWORK?',submit:'Enviar pedido',language:'Idioma',switching:'A mudar idioma'},
    hu:{...en,navProduct:'Termék',navFeatures:'Funkciók',navCalendars:'Naptárak',navClubs:'Klubok',navMessages:'Üzenetek',earlyAccess:'Korai hozzáférés',heroOverline:'Személyi, klub- és online edzőknek',heroTitle1:'Minden munkád.',heroTitle2:'Egy ritmusban.',heroLead:'A TWORK összeköti az időbeosztást, ügyfeleket, bérleteket, pénzügyeket, klubokat és üzeneteket. Egy edzést egyszer hozol létre — minden más vele együtt frissül.',requestAccess:'Korai hozzáférés kérése',seeFeatures:'Funkciók megtekintése',onlyIos:'Csak iOS',worksOffline:'Offline is működik',noServer:'Nincs TWORK-szerver',manifestoOverline:'Több mint naptár',manifestoTitle1:'Egy művelet.',manifestoTitle2:'Minden számítás kész.',manifestoBody:'A megtartott edzés levonódik a bérletből, módosítja az ügyfél egyenlegét, bevételként számít és bekerül a klubelszámolásba.',featuresOverline:'Fő funkciók',featuresTitle1:'Alkalmazkodik',featuresTitle2:'a munkádhoz.',featuresBody:'Akár egy teremben edzel, több klubbal dolgozol, vagy különböző országokból vezetsz online ügyfeleket.',feature1Title:'Online edzés idő- és pénzügyi zűrzavar nélkül.',feature1Body:'Minden ügyfélnek saját nyelve, pénzneme és időzónája lehet. A TWORK ott használja ezeket, ahol számítanak.',feature2Title:'Közvetlen ügyfelek és klubok — együtt, de külön.',feature2Body:'A TWORK külön mutatja, mennyivel tartozik az ügyfél és mennyit kell kapnod a klubtól vagy fizetned neki.',feature3Title:'Az ügyfélnaptár több mint időbeosztás.',feature3Body:'Minden ügyfél saját naptárat kap, csak a saját edzéseivel és naprakész információkkal.',clubOverline:'Klubok és szervezetek',clubTitle1:'Összetett elszámolás.',clubTitle2:'Egyszerű eredmény.',clubBody:'Minden klubhoz külön árakat, jutalékokat és elszámolási szabályokat állíthatsz be.',messageOverline:'Üzenetek kézi rutin nélkül',messageTitle1:'Kész szöveg.',messageTitle2:'A megfelelő pillanatban.',messageBody:'Válassz sablont — a TWORK beilleszti a nevet, dátumot, időt, címet, hátralévő edzéseket és más adatokat.',privacyOverline:'Adatvédelem alapból',privacyTitle1:'Az ügyfeleid.',privacyTitle2:'Az iPhone-odon.',privacyBody:'A TWORK internet nélkül működik. Az adatok helyben maradnak az eszközön, és nem kerülnek TWORK-szerverre.',finalTitle1:'Hagyd a táblázatokat',finalTitle2:'a múltban.',finalBody:'A TWORK egy rendszerbe rendezi az edző munkáját — az első ügyféltől a több klubbal való elszámolásig.',becomeEarly:'Korai hozzáférés',finalNote:'Jelentkezünk az indulás részleteivel.',footer:'Csak iOS · Offline is működik · 2026',modalIntroPrefix:'Adj meg néhány adatot. A kérés ide érkezik:',close:'Bezárás',name:'Név',namePlaceholder:'Hogyan szólíthatunk?',who:'Ki vagy?',choose:'Válassz lehetőséget',optional:'Opcionális',important:'Mi fontos számodra a TWORK-ban?',submit:'Kérés elküldése',language:'Nyelv',switching:'Nyelvváltás'},
    ar:{...en,navProduct:'المنتج',navFeatures:'الميزات',navCalendars:'التقويمات',navClubs:'الأندية',navMessages:'الرسائل',earlyAccess:'وصول مبكر',heroOverline:'للمدربين الشخصيين ومدربي الأندية والمدربين عبر الإنترنت',heroTitle1:'كل عملك.',heroTitle2:'بإيقاع واحد.',heroLead:'يربط TWORK الجداول والعملاء والاشتراكات والأموال والأندية والرسائل. أنشئ الحصة مرة واحدة، وسيتحدث كل شيء معها.',requestAccess:'طلب الوصول المبكر',seeFeatures:'استعراض الميزات',onlyIos:'لنظام iOS فقط',worksOffline:'يعمل دون اتصال',noServer:'من دون خادم TWORK',manifestoOverline:'أكثر من تقويم',manifestoTitle1:'إجراء واحد.',manifestoTitle2:'كل الحسابات جاهزة.',manifestoBody:'تُخصم الحصة المنجزة من الاشتراك، وتغيّر رصيد العميل، وتُحتسب ضمن الدخل وتسوية النادي.',featuresOverline:'الميزات الأساسية',featuresTitle1:'يتكيف',featuresTitle2:'مع طريقة عملك.',featuresBody:'سواء كنت تعمل في صالة واحدة أو مع عدة أندية أو تدرب عملاء عبر الإنترنت من دول مختلفة.',feature1Title:'تدريب عبر الإنترنت بلا ارتباك في الوقت أو المال.',feature1Body:'يمكن لكل عميل اختيار لغته وعملته ومنطقته الزمنية. يستخدمها TWORK حيث تكون مهمة.',feature2Title:'العملاء المباشرون والأندية — معًا ولكن بشكل منفصل.',feature2Body:'يعرض TWORK بشكل منفصل ما يدين به العميل وما يجب أن تستلمه من النادي أو تدفعه له.',feature3Title:'تقويم العميل أكثر من مجرد جدول.',feature3Body:'يحصل كل عميل على تقويم خاص بتدريباته فقط ومعلومات محدثة في ملاحظات الحدث.',clubOverline:'الأندية والمؤسسات',clubTitle1:'تسويات معقدة.',clubTitle2:'نتيجة بسيطة.',clubBody:'اضبط أسعارًا وعمولات وقواعد تسوية خاصة بكل نادٍ.',messageOverline:'رسائل بلا عمل يدوي',messageTitle1:'نص جاهز.',messageTitle2:'في الوقت المناسب.',messageBody:'اختر قالبًا وسيضيف TWORK الاسم والتاريخ والوقت والعنوان والحصص المتبقية والبيانات الأخرى.',privacyOverline:'الخصوصية افتراضيًا',privacyTitle1:'عملاؤك.',privacyTitle2:'على جهاز iPhone.',privacyBody:'يعمل TWORK دون إنترنت. تبقى البيانات محليًا على الجهاز ولا تُرفع إلى قاعدة بيانات خادم TWORK.',finalTitle1:'اترك الجداول',finalTitle2:'في الماضي.',finalBody:'يجمع TWORK عمل المدرب في نظام واحد — من أول عميل إلى التسويات مع عدة أندية.',becomeEarly:'الانضمام إلى الوصول المبكر',finalNote:'سنتواصل معك بتفاصيل الإطلاق.',footer:'iOS فقط · يعمل دون اتصال · 2026',modalIntroPrefix:'اترك بعض التفاصيل. سيُرسل الطلب إلى',close:'إغلاق',name:'الاسم',namePlaceholder:'كيف نخاطبك؟',who:'من أنت؟',choose:'اختر خيارًا',optional:'اختياري',important:'ما المهم لك في TWORK؟',submit:'إرسال الطلب',language:'اللغة',switching:'تبديل اللغة'},
    'zh-Hans':{...en,navProduct:'产品',navFeatures:'功能',navCalendars:'日历',navClubs:'俱乐部',navMessages:'消息',earlyAccess:'抢先体验',heroOverline:'面向私教、俱乐部教练和在线教练',heroTitle1:'所有工作。',heroTitle2:'同一节奏。',heroLead:'TWORK 将日程、客户、课包、资金、俱乐部和消息连接在一起。训练只需创建一次，其他内容会同步更新。',requestAccess:'申请抢先体验',seeFeatures:'查看功能',onlyIos:'仅支持 iOS',worksOffline:'离线可用',noServer:'无需 TWORK 服务器',manifestoOverline:'不只是日历',manifestoTitle1:'一次操作。',manifestoTitle2:'所有计算就绪。',manifestoBody:'已完成的训练会从课包中扣除，更新客户余额，计入收入并加入俱乐部结算。',featuresOverline:'核心功能',featuresTitle1:'适应',featuresTitle2:'你的工作方式。',featuresBody:'无论你在一家健身房、多个俱乐部，还是为不同国家的客户提供在线训练。',feature1Title:'在线训练，不再混淆时间和金钱。',feature1Body:'每位客户都可以拥有自己的语言、货币和时区。TWORK 会在需要的地方使用它们。',feature2Title:'直属客户与俱乐部 — 在一起，但不混在一起。',feature2Body:'TWORK 分别显示客户欠你的金额，以及你应从俱乐部收取或支付的金额。',feature3Title:'客户日历不只是日程。',feature3Body:'每位客户都有只包含自己训练的独立日历，事件备注中会显示最新信息。',clubOverline:'俱乐部与机构',clubTitle1:'复杂结算。',clubTitle2:'简单结果。',clubBody:'为每个俱乐部设置独立价格、佣金和结算规则。',messageOverline:'无需手动整理消息',messageTitle1:'文本已准备。',messageTitle2:'在正确的时间。',messageBody:'选择模板，TWORK 会自动填入姓名、日期、时间、地址、剩余训练次数等数据。',privacyOverline:'默认保护隐私',privacyTitle1:'你的客户。',privacyTitle2:'在你的 iPhone 上。',privacyBody:'TWORK 无需联网即可工作。数据仅保存在设备本地，不会上传到 TWORK 服务器数据库。',finalTitle1:'让电子表格',finalTitle2:'成为过去。',finalBody:'TWORK 将教练的工作整合到一个系统中 — 从第一位客户到多个俱乐部的结算。',becomeEarly:'加入抢先体验',finalNote:'我们会联系你并提供上线信息。',footer:'仅 iOS · 离线可用 · 2026',modalIntroPrefix:'请留下少量信息。申请将发送至',close:'关闭',name:'姓名',namePlaceholder:'我们该如何称呼你？',who:'你的身份是？',choose:'选择一个选项',optional:'可选',important:'你最看重 TWORK 的什么？',submit:'提交申请',language:'语言',switching:'正在切换语言'},
    ja:{...en,navProduct:'製品',navFeatures:'機能',navCalendars:'カレンダー',navClubs:'クラブ',navMessages:'メッセージ',earlyAccess:'早期アクセス',heroOverline:'パーソナル・クラブ・オンラインのトレーナー向け',heroTitle1:'すべての仕事を。',heroTitle2:'ひとつのリズムで。',heroLead:'TWORK はスケジュール、顧客、回数券、収支、クラブ、メッセージをつなぎます。トレーニングは一度作成するだけで、すべてが連動して更新されます。',requestAccess:'早期アクセスを申し込む',seeFeatures:'機能を見る',onlyIos:'iOS のみ',worksOffline:'オフライン対応',noServer:'TWORK サーバー不要',manifestoOverline:'カレンダー以上',manifestoTitle1:'ひとつの操作。',manifestoTitle2:'すべての計算が完了。',manifestoBody:'完了したトレーニングは回数券から差し引かれ、顧客残高、売上、クラブ精算に反映されます。',featuresOverline:'主な機能',featuresTitle1:'あなたの働き方に',featuresTitle2:'合わせて変わる。',featuresBody:'1つのジムでも、複数クラブでも、海外の顧客へのオンライン指導でも利用できます。',feature1Title:'時間とお金で迷わないオンライン指導。',feature1Body:'顧客ごとに言語、通貨、タイムゾーンを設定でき、TWORK が必要な場所で自動的に使用します。',feature2Title:'直接顧客とクラブを一緒に、でも混ぜない。',feature2Body:'顧客の未払い額と、クラブから受け取る・支払う金額を別々に管理します。',feature3Title:'顧客カレンダーは予定表以上。',feature3Body:'顧客ごとに専用カレンダーを作成し、イベントメモに最新情報を表示します。',clubOverline:'クラブと組織',clubTitle1:'複雑な精算。',clubTitle2:'シンプルな結果。',clubBody:'クラブごとに価格、手数料、精算ルールを設定できます。',messageOverline:'手作業なしのメッセージ',messageTitle1:'文章は準備済み。',messageTitle2:'必要なタイミングで。',messageBody:'テンプレートを選ぶと、名前、日時、住所、残り回数などを TWORK が自動入力します。',privacyOverline:'プライバシーを標準で',privacyTitle1:'あなたの顧客を。',privacyTitle2:'あなたの iPhone に。',privacyBody:'TWORK はインターネットなしで動作します。データは端末内に保存され、TWORK サーバーへアップロードされません。',finalTitle1:'表計算ソフトを',finalTitle2:'過去のものに。',finalBody:'TWORK は最初の顧客から複数クラブとの精算まで、トレーナーの仕事を一つにまとめます。',becomeEarly:'早期アクセスに参加',finalNote:'リリース情報をご連絡します。',footer:'iOS のみ · オフライン対応 · 2026',modalIntroPrefix:'いくつか情報を入力してください。申請は次へ送信されます:',close:'閉じる',name:'名前',namePlaceholder:'お名前を教えてください',who:'あなたについて',choose:'選択してください',optional:'任意',important:'TWORK で重視することは？',submit:'申請を送信',language:'言語',switching:'言語を切り替え中'},
    ko:{...en,navProduct:'제품',navFeatures:'기능',navCalendars:'캘린더',navClubs:'클럽',navMessages:'메시지',earlyAccess:'얼리 액세스',heroOverline:'퍼스널·클럽·온라인 트레이너를 위해',heroTitle1:'모든 업무를.',heroTitle2:'하나의 리듬으로.',heroLead:'TWORK는 일정, 고객, 이용권, 정산, 클럽, 메시지를 연결합니다. 트레이닝을 한 번 만들면 모든 정보가 함께 업데이트됩니다.',requestAccess:'얼리 액세스 신청',seeFeatures:'기능 보기',onlyIos:'iOS 전용',worksOffline:'오프라인 지원',noServer:'TWORK 서버 없음',manifestoOverline:'캘린더 그 이상',manifestoTitle1:'한 번의 작업.',manifestoTitle2:'모든 계산 완료.',manifestoBody:'완료된 트레이닝은 이용권에서 차감되고 고객 잔액, 수입, 클럽 정산에 반영됩니다.',featuresOverline:'핵심 기능',featuresTitle1:'당신의 방식에',featuresTitle2:'맞춰집니다.',featuresBody:'한 체육관, 여러 클럽, 또는 여러 나라의 온라인 고객과 일할 때 모두 사용할 수 있습니다.',feature1Title:'시간과 돈의 혼란 없는 온라인 코칭.',feature1Body:'고객마다 언어, 통화, 시간대를 설정할 수 있고 TWORK가 필요한 곳에 자동으로 적용합니다.',feature2Title:'직접 고객과 클럽 — 함께, 그러나 분리해서.',feature2Body:'고객이 지불할 금액과 클럽에서 받을 또는 지급할 금액을 따로 관리합니다.',feature3Title:'고객 캘린더는 일정표 그 이상입니다.',feature3Body:'고객마다 전용 캘린더를 만들고 이벤트 메모에 최신 정보를 표시합니다.',clubOverline:'클럽과 조직',clubTitle1:'복잡한 정산.',clubTitle2:'간단한 결과.',clubBody:'클럽별 가격, 수수료, 정산 규칙을 설정할 수 있습니다.',messageOverline:'수작업 없는 메시지',messageTitle1:'준비된 문구.',messageTitle2:'필요한 순간에.',messageBody:'템플릿을 선택하면 TWORK가 이름, 날짜, 시간, 주소, 남은 횟수 등을 자동으로 채웁니다.',privacyOverline:'기본값부터 개인정보 보호',privacyTitle1:'당신의 고객.',privacyTitle2:'당신의 iPhone 안에.',privacyBody:'TWORK는 인터넷 없이 작동합니다. 데이터는 기기에만 저장되며 TWORK 서버로 업로드되지 않습니다.',finalTitle1:'스프레드시트는',finalTitle2:'과거로.',finalBody:'TWORK는 첫 고객부터 여러 클럽과의 정산까지 트레이너 업무를 하나의 시스템으로 통합합니다.',becomeEarly:'얼리 액세스 참여',finalNote:'출시 정보를 연락드리겠습니다.',footer:'iOS 전용 · 오프라인 지원 · 2026',modalIntroPrefix:'몇 가지 정보를 남겨 주세요. 신청은 다음 주소로 전송됩니다:',close:'닫기',name:'이름',namePlaceholder:'어떻게 불러드릴까요?',who:'어떤 분인가요?',choose:'옵션을 선택하세요',optional:'선택 사항',important:'TWORK에서 중요한 점은 무엇인가요?',submit:'신청 보내기',language:'언어',switching:'언어 전환 중'}
  };

  const aliases = {
    zh:'zh-Hans','zh-cn':'zh-Hans','zh-sg':'zh-Hans','zh-hans':'zh-Hans',
    'pt-br':'pt','pt-pt':'pt','sk-sk':'sk','cs-cz':'cs','uk-ua':'uk','ar-sa':'ar'
  };

  const normalizeLanguage = value => {
    if (!value) return null;
    const normalized = value.replace('_','-');
    if (supported.has(normalized)) return normalized;
    const lower = normalized.toLowerCase();
    if (aliases[lower]) return aliases[lower];
    const base = lower.split('-')[0];
    return supported.has(base) ? base : null;
  };

  const detectLanguage = () => {
    const query = normalizeLanguage(new URLSearchParams(location.search).get('lang'));
    if (query) return query;
    const saved = normalizeLanguage(localStorage.getItem('twork-site-language'));
    if (saved) return saved;
    for (const candidate of navigator.languages || [navigator.language]) {
      const resolved = normalizeLanguage(candidate);
      if (resolved) return resolved;
    }
    return 'en';
  };

  let currentLanguage = detectLanguage();
  let translating = false;
  let switcher = null;

  const translateTextNode = (node, dictionary) => {
    if (!node || node.nodeType !== Node.TEXT_NODE) return;
    const raw = node.nodeValue || '';
    const match = raw.match(/^(\s*)(.*?)(\s*)$/s);
    if (!match || !match[2]) return;
    let key = node.__tworkI18nKey;
    if (!key) {
      key = sourceText[match[2]];
      if (!key) return;
      node.__tworkI18nKey = key;
    }
    const translated = dictionary[key] ?? en[key];
    if (translated != null) node.nodeValue = `${match[1]}${translated}${match[3]}`;
  };

  const translateAttributes = (root, dictionary) => {
    const elements = root.nodeType === Node.ELEMENT_NODE ? [root, ...root.querySelectorAll('*')] : [...document.querySelectorAll('*')];
    elements.forEach(element => {
      ['placeholder','aria-label','title'].forEach(attribute => {
        const value = element.getAttribute?.(attribute);
        if (!value) return;
        const storageKey = `tworkI18n${attribute}`;
        let key = element.dataset?.[storageKey];
        if (!key) {
          key = sourceText[value.trim()];
          if (!key) return;
          element.dataset[storageKey] = key;
        }
        element.setAttribute(attribute, dictionary[key] ?? en[key]);
      });
    });
  };

  const translateTree = (root = document.body) => {
    const dictionary = copy[currentLanguage] || en;
    translating = true;
    const walker = document.createTreeWalker(root, NodeFilter.SHOW_TEXT, {
      acceptNode(node) {
        const parent = node.parentElement;
        if (!parent || parent.closest('script,style,.matrix-language-transition,.language-switcher')) return NodeFilter.FILTER_REJECT;
        return NodeFilter.FILTER_ACCEPT;
      }
    });
    let node;
    while ((node = walker.nextNode())) translateTextNode(node, dictionary);
    translateAttributes(root, dictionary);
    translating = false;
  };

  const updateMetadata = () => {
    const dictionary = copy[currentLanguage] || en;
    document.documentElement.lang = currentLanguage;
    document.documentElement.dir = rtlLanguages.has(currentLanguage) ? 'rtl' : 'ltr';
    document.documentElement.dataset.siteLanguage = currentLanguage;
    document.title = `TWORK — ${dictionary.heroTitle1} ${dictionary.heroTitle2}`;
    const description = document.querySelector('meta[name="description"]');
    if (description) description.content = dictionary.heroLead;
  };

  const updateSwitcher = () => {
    if (!switcher) return;
    const dictionary = copy[currentLanguage] || en;
    const button = switcher.querySelector('.language-switcher-button');
    button?.setAttribute('aria-label', dictionary.language);
    const code = switcher.querySelector('.language-code');
    if (code) code.textContent = currentLanguage === 'zh-Hans' ? 'ZH' : currentLanguage.toUpperCase();
    switcher.querySelectorAll('.language-option').forEach(option => {
      const selected = option.dataset.language === currentLanguage;
      option.setAttribute('aria-checked', String(selected));
      option.tabIndex = selected ? 0 : -1;
    });
  };

  const applyLanguage = (language, remember = false) => {
    currentLanguage = normalizeLanguage(language) || 'en';
    if (remember) localStorage.setItem('twork-site-language', currentLanguage);
    updateMetadata();
    translateTree(document.body);
    updateSwitcher();
  };

  const glyphSets = {
    latin:'01ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz<>/{}[]+-=',
    cyrillic:'01АБВГДЕЖЗИЙКЛМНОПРСТУФХЦЧШЩЫЭЮЯ<>/{}[]+-=',
    arabic:'٠١ابتثجحخدذرزسشصضطظعغفقكلمنهوي<>/{}[]+-=',
    cjk:'01仕事顧客予定収入計算言語時間未来接続同期管理训练客户日历俱乐部消息',
    korean:'01업무고객일정수입계산언어시간미래연결동기화관리트레이닝클럽메시지'
  };

  const glyphsFor = language => {
    if (language === 'ar') return glyphSets.arabic;
    if (language === 'zh-Hans' || language === 'ja') return glyphSets.cjk;
    if (language === 'ko') return glyphSets.korean;
    if (language === 'ru' || language === 'uk') return glyphSets.cyrillic;
    return glyphSets.latin;
  };

  const runMatrixTransition = language => {
    if (language === currentLanguage) return;
    if (matchMedia('(prefers-reduced-motion: reduce)').matches) {
      applyLanguage(language, true);
      return;
    }

    document.querySelector('.matrix-language-transition')?.remove();
    const dictionary = copy[language] || en;
    const overlay = document.createElement('div');
    overlay.className = 'matrix-language-transition';
    overlay.innerHTML = '<canvas class="matrix-language-canvas"></canvas><div class="matrix-language-label"><strong></strong><span></span></div>';
    overlay.querySelector('strong').textContent = languages.find(([code]) => code === language)?.[1] || language;
    overlay.querySelector('span').textContent = dictionary.switching;
    document.body.appendChild(overlay);

    const canvas = overlay.querySelector('canvas');
    const context = canvas.getContext('2d');
    const dpr = Math.min(2, devicePixelRatio || 1);
    const width = innerWidth;
    const height = innerHeight;
    canvas.width = Math.round(width * dpr);
    canvas.height = Math.round(height * dpr);
    canvas.style.width = `${width}px`;
    canvas.style.height = `${height}px`;
    context.scale(dpr, dpr);

    const fontSize = Math.max(14, Math.min(20, width / 24));
    const columns = Math.ceil(width / fontSize);
    const drops = Array.from({length:columns}, () => -Math.random() * 30);
    const glyphs = glyphsFor(language);
    let start = 0;
    let animationFrame = 0;

    const draw = timestamp => {
      if (!start) start = timestamp;
      const elapsed = timestamp - start;
      context.fillStyle = elapsed < 500 ? 'rgba(0,8,5,.13)' : 'rgba(0,8,5,.22)';
      context.fillRect(0,0,width,height);
      context.font = `700 ${fontSize}px ui-monospace,SFMono-Regular,Menlo,monospace`;
      for (let index=0; index<columns; index+=1) {
        const glyph = glyphs[Math.floor(Math.random()*glyphs.length)];
        const y = drops[index] * fontSize;
        context.fillStyle = Math.random() > .94 ? '#d8ffe9' : `rgba(65,255,151,${.45 + Math.random()*.5})`;
        context.fillText(glyph,index*fontSize,y);
        if (y > height && Math.random() > .965) drops[index] = -Math.random()*12;
        drops[index] += .72 + Math.random()*.55;
      }
      if (elapsed < 980) animationFrame = requestAnimationFrame(draw);
    };

    requestAnimationFrame(() => overlay.classList.add('is-visible'));
    animationFrame = requestAnimationFrame(draw);
    setTimeout(() => applyLanguage(language, true), 360);
    setTimeout(() => overlay.classList.add('is-leaving'), 760);
    setTimeout(() => {
      cancelAnimationFrame(animationFrame);
      overlay.remove();
    }, 1080);
  };

  const createSwitcher = () => {
    const actions = document.querySelector('.nav-actions');
    if (!actions || actions.querySelector('.language-switcher')) return;
    switcher = document.createElement('div');
    switcher.className = 'language-switcher';
    switcher.innerHTML = `
      <button class="language-switcher-button" type="button" aria-haspopup="listbox" aria-expanded="false">
        <span class="language-globe" aria-hidden="true">◎</span><span class="language-code"></span><span class="language-caret" aria-hidden="true">⌄</span>
      </button>
      <div class="language-menu" role="listbox"></div>`;
    const menu = switcher.querySelector('.language-menu');
    languages.forEach(([code,name]) => {
      const option = document.createElement('button');
      option.type = 'button';
      option.className = 'language-option';
      option.dataset.language = code;
      option.setAttribute('role','option');
      option.innerHTML = `<span class="language-option-code">${code === 'zh-Hans' ? 'ZH' : code.toUpperCase()}</span><span class="language-option-name">${name}</span><span class="language-option-check">✓</span>`;
      option.addEventListener('click', () => {
        switcher.classList.remove('is-open');
        switcher.querySelector('.language-switcher-button').setAttribute('aria-expanded','false');
        runMatrixTransition(code);
      });
      menu.appendChild(option);
    });

    const toggle = switcher.querySelector('.language-switcher-button');
    toggle.addEventListener('click', event => {
      event.stopPropagation();
      const open = switcher.classList.toggle('is-open');
      toggle.setAttribute('aria-expanded',String(open));
      if (open) switcher.querySelector('.language-option[aria-checked="true"]')?.focus();
    });
    menu.addEventListener('click', event => event.stopPropagation());
    actions.prepend(switcher);

    document.addEventListener('click', () => {
      switcher.classList.remove('is-open');
      toggle.setAttribute('aria-expanded','false');
    });
    document.addEventListener('keydown', event => {
      if (event.key === 'Escape') {
        switcher.classList.remove('is-open');
        toggle.setAttribute('aria-expanded','false');
        toggle.focus();
      }
    });
  };

  const boot = () => {
    createSwitcher();
    applyLanguage(currentLanguage, false);

    const observer = new MutationObserver(records => {
      if (translating) return;
      records.forEach(record => {
        if (record.type === 'characterData') translateTextNode(record.target, copy[currentLanguage] || en);
        record.addedNodes.forEach(node => {
          if (node.nodeType === Node.ELEMENT_NODE) translateTree(node);
          else if (node.nodeType === Node.TEXT_NODE) translateTextNode(node, copy[currentLanguage] || en);
        });
      });
    });
    observer.observe(document.body,{subtree:true,childList:true,characterData:true});
  };

  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded',boot,{once:true});
  else boot();
})();
