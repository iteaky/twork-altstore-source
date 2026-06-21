window.__TWQ6_PAYLOAD='';
(() => {
  const patch = {
    cs: {
      'l10n.onboarding_data_import_yes_subtitle': 'Staré tréninky, permanentky a služby si zachovají ceny pro historii, ale znovu nevytvoří nový dluh.',
      'l10n.onboarding_service_lifecycle_hide_text': 'Dokončená služba se nesmaže. Lze ji skrýt z rozhraní, aby platby a historie zůstaly správné.'
    },
    hu: {
      'l10n.onboarding_data_import_yes_subtitle': 'A régi edzések, bérletek és szolgáltatások árai megmaradnak az előzményekben, de nem hoznak létre újra új tartozást.',
      'l10n.onboarding_service_lifecycle_hide_text': 'A befejezett szolgáltatás nem törlődik. Elrejthető a felületről, így a fizetések és az előzmények továbbra is helyesek maradnak.'
    },
    pl: {
      'l10n.onboarding_data_import_yes_subtitle': 'Stare treningi, karnety i usługi zachowają ceny w historii, ale nie utworzą ponownie nowego zadłużenia.',
      'l10n.onboarding_service_lifecycle_hide_text': 'Zakończona usługa nie jest usuwana. Można ją ukryć w interfejsie, aby płatności i historia pozostały poprawne.'
    },
    de: {
      'l10n.onboarding_data_import_yes_subtitle': 'Alte Trainings, Abos und Leistungen behalten ihre Preise für den Verlauf, erzeugen aber nicht erneut neue Schulden.',
      'l10n.onboarding_service_lifecycle_hide_text': 'Eine abgeschlossene Leistung wird nicht gelöscht. Sie kann in der Oberfläche ausgeblendet werden, damit Zahlungen und Verlauf korrekt bleiben.'
    },
    uk: {
      'l10n.onboarding_data_import_yes_subtitle': 'Старі тренування, абонементи та послуги збережуть ціни в історії, але не створюватимуть новий борг повторно.',
      'l10n.onboarding_service_lifecycle_hide_text': 'Завершена послуга не видаляється. Її можна приховати з інтерфейсу, щоб оплати та історія залишалися коректними.'
    },
    es: {
      'l10n.onboarding_data_import_yes_subtitle': 'Los entrenamientos, bonos y servicios anteriores conservarán sus precios en el historial, pero no volverán a generar una deuda nueva.',
      'l10n.onboarding_service_lifecycle_hide_text': 'Un servicio completado no se elimina. Puede ocultarse de la interfaz para que los pagos y el historial sigan siendo correctos.'
    },
    fr: {
      'l10n.onboarding_data_import_yes_subtitle': 'Les anciens entraînements, abonnements et services conservent leurs tarifs dans l’historique, mais ne créeront pas de nouvelle dette une seconde fois.',
      'l10n.onboarding_service_lifecycle_hide_text': 'Un service terminé n’est pas supprimé. Il peut être masqué de l’interface afin que les paiements et l’historique restent corrects.'
    },
    pt: {
      'l10n.onboarding_data_import_yes_subtitle': 'Os treinos, pacotes e serviços antigos mantêm os respetivos preços no histórico, mas não voltarão a criar uma nova dívida.',
      'l10n.onboarding_service_lifecycle_hide_text': 'Um serviço concluído não é eliminado. Pode ser ocultado da interface para que os pagamentos e o histórico permaneçam corretos.'
    },
    ar: {
      'l10n.onboarding_data_import_yes_subtitle': 'ستحتفظ التدريبات والاشتراكات والخدمات القديمة بأسعارها في السجل، لكنها لن تنشئ دينًا جديدًا مرة أخرى.',
      'l10n.onboarding_service_lifecycle_hide_text': 'لا تُحذف الخدمة المكتملة. يمكن إخفاؤها من الواجهة كي تظل المدفوعات والسجلات صحيحة.'
    },
    'zh-Hans': {
      'l10n.onboarding_data_import_yes_subtitle': '旧训练、套餐和服务会在历史记录中保留原价格，但不会再次产生新的欠款。',
      'l10n.onboarding_service_lifecycle_hide_text': '已完成的服务不会被删除。可以将其从界面中隐藏，同时保留正确的付款和历史记录。'
    },
    ja: {
      'l10n.onboarding_data_import_yes_subtitle': '過去のトレーニング、回数券、サービスの料金は履歴に残りますが、新しい未払いが再び発生することはありません。',
      'l10n.onboarding_service_lifecycle_hide_text': '完了したサービスは削除されません。支払いと履歴を正しく残したまま、画面上では非表示にできます。'
    },
    ko: {
      'l10n.onboarding_data_import_yes_subtitle': '이전 운동, 이용권 및 서비스의 가격은 기록에 유지되지만 새로운 미납 금액이 다시 생성되지는 않습니다.',
      'l10n.onboarding_service_lifecycle_hide_text': '완료된 서비스는 삭제되지 않습니다. 결제와 기록을 올바르게 유지하면서 화면에서 숨길 수 있습니다.'
    }
  };

  const applyQuizPatch = () => {
    const root = window.TWORK_QUIZ_IOS_I18N = window.TWORK_QUIZ_IOS_I18N || {};
    for (const [language, values] of Object.entries(patch)) {
      Object.assign(root[language] || (root[language] = {}), values);
    }
  };

  const fixUkrainianLanding = () => {
    const language = String(document.documentElement.dataset.siteLanguage || document.documentElement.lang || '').toLowerCase();
    if (!language.startsWith('uk')) return;
    for (const element of document.querySelectorAll('span,h3')) {
      const text = element.textContent.trim();
      if (text === 'Без сервера TWORK') element.textContent = 'Працює без сервера TWORK';
      if (text === 'Ваш файл TWORK') element.textContent = 'Файл TWORK для вас';
    }
  };

  applyQuizPatch();
  fixUkrainianLanding();
  let attempts = 0;
  const timer = setInterval(() => {
    applyQuizPatch();
    fixUkrainianLanding();
    attempts += 1;
    if (attempts >= 80) clearInterval(timer);
  }, 125);
  window.addEventListener('twork-quiz-v554-ready', applyQuizPatch);
  new MutationObserver(fixUkrainianLanding).observe(document.documentElement, {
    attributes: true,
    attributeFilter: ['data-site-language', 'lang']
  });
})();
