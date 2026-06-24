(() => {
  if (window.__TWORK_V564_ACTIVATOR__) return;
  window.__TWORK_V564_ACTIVATOR__ = true;

  let installing = false;
  const load = src => new Promise((resolve, reject) => {
    const script = document.createElement('script');
    script.src = src;
    script.async = false;
    script.onload = resolve;
    script.onerror = () => reject(new Error(`Failed to load ${src}`));
    document.head.appendChild(script);
  });

  const activate = async () => {
    if (installing || window.__TWORK_QUIZ_V564_READY__) return;
    if (!window.TWORK_QUIZ_IOS_I18N || !document.getElementById('twork-onboarding-quiz-v6')) return;
    installing = true;
    try {
      window.__TWQ564_RUNTIME_GZIP = '';
      const version = '20260624-3';
      for (const part of ['01','02','03','04','05','06','07','08']) {
        await load(`site/v564-runtime/part-${part}.js?v=${version}`);
      }
      await load(`site/onboarding-quiz-v564.js?v=${version}`);
      if (!window.__TWORK_QUIZ_V564_READY__) throw new Error('V564 runtime did not initialize');
    } catch (error) {
      console.error('[TWORK onboarding V564]', error);
      installing = false;
    }
  };

  window.addEventListener('twork:native-quiz-ready', activate);
  window.addEventListener('twork:quiz-v554-ready', activate);
  const timer = window.setInterval(() => {
    activate();
    if (window.__TWORK_QUIZ_V564_READY__) window.clearInterval(timer);
  }, 150);
  window.setTimeout(() => window.clearInterval(timer), 25000);
})();