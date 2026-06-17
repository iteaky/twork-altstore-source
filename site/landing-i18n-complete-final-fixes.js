(() => {
  const bundle = window.TWORK_COMPLETE_I18N;
  if (!bundle?.keys || !bundle?.values) return;

  const patch = (source, language, value) => {
    const index = bundle.keys.indexOf(source);
    if (index >= 0 && bundle.values[language]) bundle.values[language][index] = value;
  };

  patch('10:00 · Онлайн','pl','10:00 · Trening online');
  patch('18:00 · Анна','pl','18:00 · Anna · trening');
  patch('Mark · онлайн','pl','Mark · trening online');
  patch('10:00 · Онлайн','pt','10:00 · Treino online');

  const labels = {
    ru:'Доступ', en:'Access', sk:'Prístup', cs:'Přístup', hu:'Hozzáférés',
    pl:'Dostęp', de:'Zugang', uk:'Доступ', es:'Acceso', fr:'Accès',
    pt:'Acesso', ar:'الوصول', 'zh-Hans':'访问', ja:'アクセス', ko:'접근'
  };

  const style = document.createElement('style');
  style.textContent = '@media(max-width:680px){.nav-cta::after{content:attr(data-short-label)!important}}';
  document.head.appendChild(style);

  const applyLabel = () => {
    const language = document.documentElement.dataset.siteLanguage || 'en';
    document.querySelectorAll('.nav-cta').forEach(button => {
      button.dataset.shortLabel = labels[language] || labels.en;
    });
  };

  applyLabel();
  new MutationObserver(applyLabel).observe(document.documentElement,{
    attributes:true,
    attributeFilter:['data-site-language']
  });
})();
