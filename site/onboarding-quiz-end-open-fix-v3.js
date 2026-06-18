(() => {
  if (window.TWORK_QUIZ_END_OPEN_FIX_V6) return;
  window.TWORK_QUIZ_END_OPEN_FIX_V6 = true;

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

  const openNative = () => {
    if (typeof window.TWORK_OPEN_NATIVE_QUIZ !== 'function') return false;
    try {
      return window.TWORK_OPEN_NATIVE_QUIZ() !== false;
    } catch (error) {
      console.error('[TWORK quiz CTA]', error);
      return false;
    }
  };

  document.addEventListener('click', event => {
    const button = event.target.closest(selector);
    if (!button) return;

    // Mark the real CTA with the selector used by the quiz itself.
    // Do not prevent or stop the click: the native quiz listener must
    // receive this same event during the bubble phase.
    prepare();

    if (!openNative()) {
      let attempts = 0;
      const timer = window.setInterval(() => {
        attempts += 1;
        if (openNative() || attempts >= 50) window.clearInterval(timer);
      }, 100);
    }
  }, true);

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
