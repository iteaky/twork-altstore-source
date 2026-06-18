(() => {
  if (window.TWORK_QUIZ_END_OPEN_FIX_V5) return;
  window.TWORK_QUIZ_END_OPEN_FIX_V5 = true;

  const selector = '[data-quiz-end-open]';

  const prepare = () => {
    document.querySelectorAll(selector).forEach(button => {
      button.setAttribute('data-twq4-open', '1');
      button.setAttribute('data-native-quiz-open', '1');
      button.removeAttribute('disabled');
      button.disabled = false;
      button.style.setProperty('pointer-events', 'auto', 'important');
      button.style.setProperty('cursor', 'pointer', 'important');
      button.style.setProperty('position', 'relative', 'important');
      button.style.setProperty('z-index', '20', 'important');
    });
  };

  const open = () => {
    if (typeof window.TWORK_OPEN_NATIVE_QUIZ === 'function') {
      try {
        return window.TWORK_OPEN_NATIVE_QUIZ() !== false;
      } catch (error) {
        console.error('[TWORK quiz CTA]', error);
      }
    }
    return false;
  };

  const openWhenReady = () => {
    if (open()) return;
    let attempts = 0;
    const timer = window.setInterval(() => {
      attempts += 1;
      if (open() || attempts >= 50) window.clearInterval(timer);
    }, 100);
  };

  document.addEventListener('click', event => {
    const button = event.target.closest(selector);
    if (!button) return;
    prepare();
    // Do not stop propagation: the native quiz listener opens
    // elements marked with data-twq4-open.
    window.setTimeout(openWhenReady, 0);
  }, true);

  window.addEventListener('twork:native-quiz-ready', prepare);

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', prepare, { once: true });
  } else {
    prepare();
  }

  new MutationObserver(prepare).observe(document.documentElement, {
    childList: true,
    subtree: true
  });
})();
