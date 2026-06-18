(() => {
  if (window.TWORK_QUIZ_END_OPEN_FIX_V4) return;
  window.TWORK_QUIZ_END_OPEN_FIX_V4 = true;

  const buttonSelector = '[data-quiz-end-open]';

  const prepare = () => {
    document.querySelectorAll(buttonSelector).forEach(button => {
      button.setAttribute('data-setup-open', '1');
      button.setAttribute('data-quiz-open', '1');
      button.setAttribute('data-native-quiz-open', '1');
      button.setAttribute('data-start-quiz', '1');
      button.classList.add('setup-hero-button', 'js-setup-quiz', 'quiz-launcher');
      button.disabled = false;
      button.style.pointerEvents = 'auto';
      button.style.cursor = 'pointer';
    });
  };

  const open = () => {
    if (typeof window.TWORK_OPEN_NATIVE_QUIZ === 'function') {
      window.TWORK_OPEN_NATIVE_QUIZ();
      return true;
    }
    return false;
  };

  const openSoon = () => {
    if (open()) return;
    let count = 0;
    const timer = window.setInterval(() => {
      count += 1;
      if (open() || count >= 50) window.clearInterval(timer);
    }, 100);
  };

  document.addEventListener('click', event => {
    const button = event.target.closest(buttonSelector);
    if (!button) return;
    prepare();
    openSoon();
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
