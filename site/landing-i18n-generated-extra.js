(() => {
  const order = ['sk','en','ru','cs','hu','pl','de','uk','es','fr','pt','ar','zh-Hans','ja','ko'];
  const languageIndex = Object.fromEntries(order.map((code,index) => [code,index]));
  const rows = {
    next:['Ďalšia','Next','Следующая','Další','Következő','Następna','Nächste','Наступна','Siguiente','Suivante','Próxima','التالي','下一项','次へ','다음'],
    training:['Tréning','Training','Тренировка','Trénink','Edzés','Trening','Training','Тренування','Entrenamiento','Entraînement','Treino','تدريب','训练','トレーニング','트레이닝'],
    membership:['Permanentka','Membership','Абонемент','Permanentka','Bérlet','Karnet','Mitgliedschaft','Абонемент','Bono','Abonnement','Plano','اشتراك','课包','回数券','이용권'],
    income:['Príjem','Income','Доход','Příjem','Bevétel','Przychód','Einnahmen','Дохід','Ingresos','Revenus','Receita','الدخل','收入','収入','수입'],
    message:['Správa','Message','Сообщение','Zpráva','Üzenet','Wiadomość','Nachricht','Повідомлення','Mensaje','Message','Mensagem','رسالة','消息','メッセージ','메시지'],
    personalPlural:['Osobné','Personal','Персональные','Osobní','Személyi','Personalne','Personal','Персональні','Personales','Personnels','Pessoais','شخصية','私教','パーソナル','퍼스널'],
    split:['Split','Split','Сплит','Split','Páros','Split','Split','Спліт','Dúo','Duo','Dupla','ثنائي','双人','ペア','2인'],
    group:['Skupinové','Group','Групповые','Skupinové','Csoportos','Grupowe','Gruppe','Групові','Grupales','Collectifs','Grupo','جماعية','团课','グループ','그룹'],
    onlineServices:['Online služby','Online services','Онлайн-услуги','Online služby','Online szolgáltatások','Usługi online','Online-Services','Онлайн-послуги','Servicios online','Services en ligne','Serviços online','خدمات عبر الإنترنت','在线服务','オンラインサービス','온라인 서비스'],
    multipleClubs:['Viac klubov','Multiple clubs','Несколько клубов','Více klubů','Több klub','Wiele klubów','Mehrere Studios','Кілька клубів','Varios clubes','Plusieurs clubs','Vários clubes','عدة أندية','多个俱乐部','複数クラブ','여러 클럽'],
    clientPayment:['Platba klienta','Client payment','Оплата клиента','Platba klienta','Ügyfélfizetés','Płatność klienta','Kundenzahlung','Оплата клієнта','Pago del cliente','Paiement client','Pagamento do cliente','دفعة العميل','客户付款','顧客支払い','고객 결제'],
    trainingCost:['Cena tréningu','Training cost','Стоимость тренировки','Cena tréninku','Edzés ára','Koszt treningu','Trainingskosten','Вартість тренування','Coste del entrenamiento','Coût de la séance','Custo do treino','تكلفة التدريب','训练费用','トレーニング料金','트레이닝 비용'],
    clubCommission:['Provízia klubu','Club commission','Комиссия клуба','Provize klubu','Klubjutalék','Prowizja klubu','Studio-Provision','Комісія клубу','Comisión del club','Commission du club','Comissão do clube','عمولة النادي','俱乐部佣金','クラブ手数料','클럽 수수료'],
    trainerIncome:['Príjem trénera','Trainer income','Доход тренера','Příjem trenéra','Edző bevétele','Przychód trenera','Trainer-Einnahmen','Дохід тренера','Ingresos del entrenador','Revenus du coach','Receita do treinador','دخل المدرب','教练收入','トレーナー収入','트레이너 수입'],
    fullSchedule:['Môj celý rozvrh','My full schedule','Моё полное расписание','Můj celý rozvrh','Teljes időbeosztásom','Mój pełny grafik','Mein kompletter Terminplan','Мій повний розклад','Mi horario completo','Mon planning complet','A minha agenda completa','جدولي الكامل','我的完整日程','自分の全予定','내 전체 일정'],
    familyAccess:['Prístup pre rodinu','Family access','Доступ для семьи','Přístup pro rodinu','Családi hozzáférés','Dostęp dla rodziny','Familienzugriff','Доступ для родини','Acceso familiar','Accès famille','Acesso da família','وصول للعائلة','家庭访问','家族アクセス','가족 접근'],
    onlyHerClasses:['Len jej tréningy','Only her trainings','Только её занятия','Pouze její tréninky','Csak az ő edzései','Tylko jej treningi','Nur ihre Trainings','Лише її заняття','Solo sus entrenamientos','Uniquement ses séances','Apenas os treinos dela','تدريباتها فقط','仅她的训练','彼女のトレーニングのみ','그녀의 트레이닝만'],
    viewOnly:['Len na čítanie','View only','Только просмотр','Pouze pro čtení','Csak megtekintés','Tylko odczyt','Nur ansehen','Лише перегляд','Solo lectura','Lecture seule','Apenas leitura','للعرض فقط','仅查看','閲覧のみ','보기 전용'],
    trainerComment:['Komentár trénera','Trainer comment','Комментарий тренера','Komentář trenéra','Edző megjegyzése','Komentarz trenera','Trainerkommentar','Коментар тренера','Comentario del entrenador','Commentaire du coach','Comentário do treinador','تعليق المدرب','教练备注','トレーナーコメント','트레이너 코멘트'],
    clientLanguage:['Jazyk klienta','Client language','Язык клиента','Jazyk klienta','Ügyfél nyelve','Język klienta','Kundensprache','Мова клієнта','Idioma del cliente','Langue du client','Idioma do cliente','لغة العميل','客户语言','顧客の言語','고객 언어'],
    automaticText:['Automaticky + vlastný text','Automatic + custom text','Авто + свой текст','Automaticky + vlastní text','Automatikus + saját szöveg','Automatycznie + własny tekst','Automatisch + eigener Text','Автоматично + власний текст','Automático + texto propio','Automatique + texte personnalisé','Automático + texto próprio','تلقائي + نص مخصص','自动 + 自定义文本','自動 + 独自テキスト','자동 + 사용자 텍스트'],
    updatesWithEvent:['Aktualizuje sa s udalosťou','Updates with the event','Обновляется вместе с событием','Aktualizuje se s událostí','Az eseménnyel frissül','Aktualizuje się z wydarzeniem','Aktualisiert sich mit dem Termin','Оновлюється разом із подією','Se actualiza con el evento','Se met à jour avec l’événement','Atualiza com o evento','يتحدث مع الحدث','随事件更新','イベントと連動して更新','이벤트와 함께 업데이트'],
    timeToSend:['Čas odoslať','Time to send','Пора отправить','Čas odeslat','Ideje elküldeni','Czas wysłać','Zeit zum Senden','Час надіслати','Es hora de enviar','C’est le moment d’envoyer','Hora de enviar','حان وقت الإرسال','该发送了','送信の時間','보낼 시간'],
    scheduled:['Naplánované','Scheduled','Запланированные','Naplánované','Ütemezett','Zaplanowane','Geplant','Заплановані','Programados','Planifiés','Agendados','مجدولة','已计划','予定','예약됨'],
    sent:['Odoslané','Sent','Отправленные','Odeslané','Elküldött','Wysłane','Gesendet','Надіслані','Enviados','Envoyés','Enviados','مرسلة','已发送','送信済み','전송됨'],
    send:['Odoslať','Send','Отправить','Odeslat','Küldés','Wyślij','Senden','Надіслати','Enviar','Envoyer','Enviar','إرسال','发送','送信','전송'],
    copy:['Kopírovať','Copy','Скопировать','Kopírovat','Másolás','Kopiuj','Kopieren','Скопіювати','Copiar','Copier','Copiar','نسخ','复制','コピー','복사'],
    total:['Spolu','Total','Всего','Celkem','Összesen','Łącznie','Gesamt','Усього','Total','Total','Total','الإجمالي','总计','合計','전체']
  };

  const sourceMap = {
    'Следующая':'next','Тренировка':'training','Абонемент':'membership','Доход':'income','Сообщение':'message','Персональные':'personalPlural','Сплит':'split','Групповые':'group','Онлайн-услуги':'onlineServices','Несколько клубов':'multipleClubs','Оплата клиента':'clientPayment','Стоимость тренировки':'trainingCost','Комиссия клуба':'clubCommission','Доход тренера':'trainerIncome','Моё полное расписание':'fullSchedule','Доступ для семьи':'familyAccess','Только её занятия':'onlyHerClasses','Только просмотр':'viewOnly','Комментарий тренера':'trainerComment','Язык клиента':'clientLanguage','Авто + свой текст':'automaticText','Обновляется вместе с событием':'updatesWithEvent','Пора отправить':'timeToSend','Запланированные':'scheduled','Отправленные':'sent','Отправить':'send','Скопировать':'copy','Всего':'total'
  };

  const currentLanguage = () => document.documentElement.dataset.siteLanguage || localStorage.getItem('twork-site-language') || 'en';
  const translated = (key, language) => rows[key]?.[languageIndex[language] ?? 1] || rows[key]?.[1];

  const translateNode = (node, language = currentLanguage()) => {
    if (!node || node.nodeType !== Node.TEXT_NODE) return;
    const raw = node.nodeValue || '';
    const match = raw.match(/^(\s*)(.*?)(\s*)$/s);
    if (!match || !match[2]) return;
    const key = node.__tworkExtraKey || sourceMap[match[2]];
    if (!key) return;
    node.__tworkExtraKey = key;
    const next = `${match[1]}${translated(key,language)}${match[3]}`;
    if (next !== raw) node.nodeValue = next;
  };

  const translateTree = (root = document.body, language = currentLanguage()) => {
    const walker = document.createTreeWalker(root,NodeFilter.SHOW_TEXT,{
      acceptNode(node){
        const parent = node.parentElement;
        return !parent || parent.closest('script,style,.language-switcher,svg') ? NodeFilter.FILTER_REJECT : NodeFilter.FILTER_ACCEPT;
      }
    });
    let node;
    while ((node = walker.nextNode())) translateNode(node,language);
  };

  window.TWORK_I18N_GENERATED = (language = currentLanguage()) => translateTree(document.body,language);

  const boot = () => {
    translateTree(document.body);
    window.setTimeout(() => translateTree(document.body),180);
    window.setTimeout(() => translateTree(document.body),520);
  };

  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded',boot,{once:true});
  else boot();
})();
