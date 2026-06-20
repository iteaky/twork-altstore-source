(() => {
  if (window.__TWORK_QUIZ_V554_UPGRADE__) return;
  window.__TWORK_QUIZ_V554_UPGRADE__ = true;

  let installing = false;
  let installed = false;

  const load = src => new Promise((resolve, reject) => {
    const script = document.createElement('script');
    script.src = src;
    script.async = false;
    script.onload = resolve;
    script.onerror = () => reject(new Error(`Failed to load ${src}`));
    document.head.appendChild(script);
  });

  const install = async () => {
    if (installing || installed) return;
    const oldRoot = document.getElementById('twork-onboarding-quiz-v6');
    if (!oldRoot || !window.TWORK_QUIZ_IOS_I18N) return;

    installing = true;
    const wasOpen = oldRoot.classList.contains('is-open');

    try {
      oldRoot.remove();
      document.getElementById('twork-onboarding-quiz-v6-style')?.remove();
      document.querySelector('[data-twork-quiz-v552-theme-style]')?.remove();
      document.documentElement.classList.remove('twq6-open', 'quiz-open');
      document.body.classList.remove('twq6-open', 'quiz-open');
      window.TWORK_ONBOARDING_QUIZ_V6 = false;
      window.__TWQ554_SOURCE = '';

      const version = '20260620-5';
      await load(`site/v554-source/i18n-ru.js?v=${version}`);
      for (let index = 1; index <= 6; index += 1) {
        const part = String(index).padStart(2, '0');
        await load(`site/v554-source/js-source-${part}.js?v=${version}`);
      }

      const source = String(window.__TWQ554_SOURCE || '');
      if (source.length !== 91393) {
        throw new Error(`TWORK quiz v554 source has invalid length: ${source.length}`);
      }

      const script = document.createElement('script');
      script.dataset.tworkQuizV554Runtime = '1';
      script.textContent = `${source}\n//# sourceURL=onboarding-quiz-v554-source.js`;
      document.head.appendChild(script);

      if (!window.TWORK_ONBOARDING_QUIZ_V6 || !document.getElementById('twork-onboarding-quiz-v6')) {
        throw new Error('TWORK quiz v554 did not initialize');
      }

      installed = true;
      window.__TWORK_QUIZ_V554_READY__ = true;
      if (wasOpen && typeof window.TWORK_OPEN_SETUP_QUIZ === 'function') {
        window.TWORK_OPEN_SETUP_QUIZ();
      }
      window.dispatchEvent(new CustomEvent('twork:quiz-v554-ready'));
    } catch (error) {
      console.error('[TWORK onboarding quiz v554 upgrade]', error);
    } finally {
      installing = false;
    }
  };

  window.addEventListener('twork:native-quiz-ready', install);
  const timer = window.setInterval(() => {
    if (installed) {
      window.clearInterval(timer);
      return;
    }
    install();
  }, 100);
  window.setTimeout(() => window.clearInterval(timer), 15000);
})();
