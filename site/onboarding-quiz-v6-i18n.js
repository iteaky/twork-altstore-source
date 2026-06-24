(() => {
  if (window.__TWORK_V564_ACTIVATOR__) return;
  window.__TWORK_V564_ACTIVATOR__ = true;

  const activate = () => {
    if (window.__TWORK_QUIZ_V564_READY__) return;
    if (!window.TWORK_QUIZ_IOS_I18N || !document.getElementById('twork-onboarding-quiz-v6')) return;
    import('./onboarding-quiz-v564.js?v=20260624-1').catch(error => {
      console.error('[TWORK onboarding V564]', error);
    });
  };

  window.addEventListener('twork:native-quiz-ready', activate);
  window.addEventListener('twork:quiz-v554-ready', activate);
  const timer = window.setInterval(() => {
    activate();
    if (window.__TWORK_QUIZ_V564_READY__) window.clearInterval(timer);
  }, 200);
  window.setTimeout(() => window.clearInterval(timer), 20000);
})();