(() => {
  const bundle = window.TWORK_COMPLETE_I18N;
  if (!bundle?.keys?.length || !bundle?.values) return;

  const dictionaries = {
    pt: 'site/landing-i18n-complete-pt.js?v=20260617-10',
    'zh-Hans': 'site/landing-i18n-complete-zh-Hans.js?v=20260617-10',
    ja: 'site/landing-i18n-complete-ja.js?v=20260617-10',
    ko: 'site/landing-i18n-complete-ko.js?v=20260617-10'
  };

  const load = src => new Promise((resolve, reject) => {
    const script = document.createElement('script');
    script.src = src;
    script.async = false;
    script.onload = resolve;
    script.onerror = () => reject(new Error('Unable to load localization dictionary'));
    document.head.appendChild(script);
  });

  const complete = language => {
    const values = bundle.values[language];
    return Array.isArray(values)
      && values.length >= bundle.keys.length
      && values.slice(0, bundle.keys.length).every(value => typeof value === 'string' && value.trim());
  };

  (async () => {
    for (const [language, src] of Object.entries(dictionaries)) {
      if (!complete(language)) await load(src);
    }
    window.TWORK_APPLY_COMPLETE_OVERRIDES?.();
    await load('site/landing-i18n-complete-final-fixes.js?v=20260617-10');
    await load('site/landing-i18n-complete-core.js?v=20260617-10');
  })().catch(error => console.error('[TWORK i18n]', error));
})();
